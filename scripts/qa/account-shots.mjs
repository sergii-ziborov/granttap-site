// Screenshots of /account and /sign-in with synthetic data, light and dark, phone and desktop widths.
// Needs `npm run build && npm run build:runtime` first. Run: node --import tsx scripts/qa/account-shots.mjs <output dir>
import { spawn } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { createServer, request as httpRequest } from 'node:http';
import { tmpdir } from 'node:os';
import path from 'node:path';
import nacl from 'tweetnacl';
import { browserSession, delay } from './browser-session.mjs';
import { SqliteD1 } from '../../worker/account/sqlite.ts';
import { AccountWebKeys } from '../../worker/account/web-key/store.ts';
import { parseWebKeyBundle } from '../../worker/account/web-key/bundle.ts';

const output = process.argv[2] || '/tmp/granttap-account-shots';
const only = process.argv[3];
await mkdir(output, { recursive: true });
const work = await mkdtemp(path.join(tmpdir(), 'granttap-account-shots-'));
const storage = randomBytes(32), children = [];
await writeFile(path.join(work, 'storage.key'), storage);
const port = () => new Promise(resolve => { const server = createServer(); server.listen(0, '127.0.0.1', () => { const { port: value } = server.address(); server.close(() => resolve(value)); }); });
async function start(args, env, health) {
  const child = spawn(process.execPath, args, { env: { ...process.env, ...env }, stdio: ['ignore', 'ignore', 'pipe'] });
  let errors = ''; child.stderr.on('data', data => { errors += data; }); children.push(child);
  for (let i = 0; i < 100; i++) { try { if ((await fetch(health)).ok) return; } catch { /* starting */ } await delay(100); }
  throw Error('Service did not start: ' + errors);
}
const [accountPort, sitePort, proxyPort] = [await port(), await port(), await port()];
const db = path.join(work, 'accounts.sqlite');
await start(['--import', 'tsx', 'hetzner/server.mjs'], { PORT: String(accountPort), HOST: '127.0.0.1', GRANTTAP_ACCOUNT_DB: db,
  GRANTTAP_CONNECT_STORE: path.join(work, 'connect.json'), GRANTTAP_ACCOUNT_STORAGE_KEY_PATH: path.join(work, 'storage.key') }, `http://127.0.0.1:${accountPort}/healthz`);
await start(['.runtime/site-start.mjs'], { PORT: String(sitePort), HOST: '127.0.0.1' }, `http://127.0.0.1:${sitePort}/pricing`);
// Local stand-in for host nginx: account API to 3210-equivalent, pages to the site, Origin as granttap.com sends it.
const proxy = createServer((req, res) => {
  const api = req.url.startsWith('/api/account/');
  const headers = { ...req.headers, ...(api && req.headers.origin ? { origin: 'https://granttap.com' } : {}), 'x-real-ip': '198.51.100.20' };
  const upstream = httpRequest({ host: '127.0.0.1', port: api ? accountPort : sitePort, path: req.url, method: req.method, headers }, answer => {
    res.writeHead(answer.statusCode, answer.headers); answer.pipe(res);
  });
  upstream.on('error', () => { res.writeHead(502); res.end(); }); req.pipe(upstream);
});
await new Promise(resolve => proxy.listen(proxyPort, '127.0.0.1', resolve));
const base = `http://localhost:${proxyPort}`, api = `http://127.0.0.1:${accountPort}/api/account/`;
const call = async (route, body, token, method = 'POST', headers = {}) => (await fetch(api + route, { method,
  headers: { 'content-type': 'application/json', ...(token ? { authorization: 'Bearer ' + token } : {}), ...headers },
  body: body === undefined ? undefined : JSON.stringify(body) })).json();

// Synthetic account: a password, two computers, an iPhone, an old Windows browser.
const owner = await call('password/register', { login: 'owner.fixture', password: 'a long synthetic fixture password' });
const phone = await call('password/sign-in', { login: 'owner.fixture', password: 'a long synthetic fixture password' });
await call('devices/current', { name: 'iPhone 17 Pro', kind: 'iphone' }, phone.token, 'PATCH');
const macbook = await call('machines', { name: 'MacBook Pro' }, owner.token);
await call('machines', { name: 'Studio Mac mini' }, owner.token);
await fetch(api + 'password/sign-in', { method: 'POST', headers: { 'content-type': 'application/json', origin: 'https://granttap.com',
  'sec-fetch-site': 'same-origin', 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0' },
  body: JSON.stringify({ login: 'owner.fixture', password: 'a long synthetic fixture password' }) });
const sqlite = new SqliteD1(db);
const old = Date.now() - 41 * 86_400_000;
sqlite.sqlite.prepare("UPDATE account_session_details SET created_at=?,last_seen_at=? WHERE name LIKE 'Firefox%'").run(old, old);
sqlite.sqlite.prepare('INSERT INTO account_machine_endpoints(machine_id,room,public_key,updated_at) VALUES(?,?,?,?)')
  .run(macbook.id, 'a1b2c3d4e5f60718', Buffer.from(nacl.box.keyPair().publicKey).toString('base64'), Date.now() - 600_000);
sqlite.sqlite.prepare('UPDATE account_machines SET last_seen_at=? WHERE id=?').run(Date.now() - 600_000, macbook.id);

const browser = await browserSession();
const shots = [];
try {
  const tab = await browser.tab();
  await tab.send('Network.enable');
  const theme = mode => tab.evaluate(`(()=>{localStorage.setItem('granttap.theme',${JSON.stringify(mode)});document.documentElement.dataset.theme=${JSON.stringify(mode)};return true})()`);
  async function shoot(name, width, mode, url, prepare) {
    if (only && !name.includes(only)) return;
    await tab.send('Emulation.setDeviceMetricsOverride', { width, height: width < 600 ? 844 : 900, deviceScaleFactor: width < 600 ? 2 : 1, mobile: width < 600 });
    await tab.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: mode }] });
    await tab.navigate(base + '/'); await theme(mode);
    await tab.navigate(base + url); await delay(900);
    if (prepare) { await prepare(); await delay(900); }
    const height = await tab.evaluate('Math.ceil(document.documentElement.scrollHeight)');
    const { data } = await tab.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true,
      clip: { x: 0, y: 0, width, height: Math.min(height, 6000), scale: 1 } });
    const file = `${name}-${width}-${mode}.png`; await writeFile(path.join(output, file), Buffer.from(data, 'base64')); shots.push(file);
  }
  const click = text => tab.evaluate(`(()=>{const el=[...document.querySelectorAll('label,button,a')].find(n=>n.textContent.trim().startsWith(${JSON.stringify(text)}));el?.click();return !!el})()`);
  const signIn = token => tab.send('Network.setCookie', { name: 'granttap_session', value: token, url: base + '/api/account/', path: '/api/account', httpOnly: true, secure: true, sameSite: 'Strict' });
  const signOut = () => tab.send('Network.clearBrowserCookies');
  for (const mode of ['light', 'dark']) for (const width of [390, 1280]) {
    await signOut();
    await shoot('signin-passkey', width, mode, '/account');
    await shoot('signin-iphone-qr', width, mode, '/account', () => click('iPhone QR'));
    await shoot('sign-in-handoff', width, mode, `/sign-in#qr=${'A'.repeat(43)}.${'B'.repeat(43)}`);
    await signIn(owner.token);
    await shoot('account-no-key', width, mode, '/account');
  }
  const pair = nacl.box.keyPair();
  const pairing = { machineId: macbook.id, relayUrl: 'wss://relay.granttap.com', room: 'a1b2c3d4e5f60718', role: 'phone', deviceName: 'GrantTap Web',
    senderId: 'web-fixture', myPublicKey: Buffer.from(pair.publicKey).toString('base64'), mySecretKey: Buffer.from(pair.secretKey).toString('base64'),
    peerPublicKey: Buffer.from(nacl.box.keyPair().publicKey).toString('base64'), pushAuth: randomBytes(32).toString('hex') };
  const text = JSON.stringify({ schema: 'granttap.account-web-key.v1', accountId: owner.accountId, createdAt: Date.now(), pairings: [pairing] });
  await new AccountWebKeys(sqlite, storage).save(owner.accountId, text, parseWebKeyBundle(text, owner.accountId), 'Chrome on macOS');
  for (const mode of ['light', 'dark']) for (const width of [390, 1280]) {
    await signIn(owner.token);
    await shoot('account-key-stored', width, mode, '/account#key');
  }
  console.log(JSON.stringify({ output, shots, errors: tab.errors }));
} finally {
  await browser.close(); proxy.close(); for (const child of children) child.kill('SIGTERM');
  await delay(300); await rm(work, { recursive: true, force: true });
}
