import { createHash } from 'node:crypto';
import { isIP } from 'node:net';
import { ManagedSubscriptions } from '../worker/account/subscriptions/index.ts';
import { sessionToken } from '../worker/account/http.ts';
import { clientAccessFromEnv } from './hostwatch-client.mjs';

export function accountClientAccess({ db, auth, machines, env = process.env, adapter = clientAccessFromEnv(env) }) {
  if (!adapter) return null;
  const ledger = new ManagedSubscriptions(db);
  const trusted = new Set((env.HOSTWATCH_TRUSTED_PROXY_IPS ?? '').split(','));
  async function identity(req) {
    const headers = new Headers();
    for (const key of ['authorization', 'cookie']) if (typeof req.headers[key] === 'string') headers.set(key, req.headers[key]);
    const token = sessionToken(new Request('https://granttap.com/api/account/control/access', { headers }));
    let account = await auth.accountForToken(token), device;
    if (account) device = `session:${createHash('sha256').update(token).digest('hex')}`;
    if (!account && String(req.url ?? '').startsWith('/api/account/machine/')) {
      const machine = await machines.identity(token);
      if (machine) { account = machine.accountId; device = `machine:${machine.machineId}`; }
    }
    const peer = req.socket.remoteAddress?.replace(/^::ffff:/, '');
    const forwarded = req.headers['x-real-ip'];
    const clientIp = trusted.has(peer) && typeof forwarded === 'string' && isIP(forwarded) ? forwarded : peer;
    if (!account) return { category: 'anonymous', clientIp };
    const right = await ledger.entitlement(account);
    return { category: right?.source === 'subscription' ? 'subscriber' : right?.source === 'beta' ? 'beta' : 'registered',
      account, device, clientIp, expiresAt: Math.min(Date.now() + 30000, right?.expiresAt ?? Infinity) };
  }
  return {
    async http(req, res) {
      const d = await adapter.admit(await identity(req));
      res.setHeader('X-Hostwatch-Client-Category', d.category);
      res.setHeader('X-Hostwatch-Client-Limit', d.allowed ? 'none' : d.reason);
      if (d.fallback) res.setHeader('X-Hostwatch-Client-Mode', 'local-fallback');
      if (d.allowed) return true;
      res.writeHead(429, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'Retry-After': String(d.retryAfter || 5) });
      res.end(JSON.stringify({ error: 'Client allowance reached', reason: d.reason })); return false;
    },
    async socket(req) {
      const context = await identity(req), decision = await adapter.admit(context, 'connect');
      return { allowed: decision.allowed, reason: decision.reason, category: decision.category,
        cancel: () => adapter.admit(context, 'release', decision.leaseId),
        onConnected(client) {
          let lease = decision.leaseId, running = false;
          const timer = setInterval(async () => {
            if (running || client.readyState !== 1) return; running = true;
            try {
              const next = await identity(req);
              if (next.account !== context.account || !['subscriber', 'beta'].includes(next.category)) { client.close(4403, 'Account access expired'); return; }
              const d = await adapter.admit(next, 'renew', lease);
              if (!d.allowed) client.close(4429, d.reason); else if (d.leaseId) lease = d.leaseId;
            } catch { /* Existing signed admission expiry remains enforced by the control bridge. */ }
            finally { running = false; }
          }, 15000); timer.unref();
          client.once('close', () => { clearInterval(timer); void adapter.admit(context, 'release', lease); });
        } };
    },
  };
}
