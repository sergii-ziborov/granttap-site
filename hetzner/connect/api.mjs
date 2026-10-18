import { REQUEST_ID, sanitize, publicRow, privateRow, isLoopbackRedirect } from "./requests.mjs";
import { json, readBody, requestSecret } from "./http.mjs";
import { completeConnectPasskey } from "./passkey.mjs";

export async function routeConnectRequest(req, res, url, services) {
  const { records } = services;
  const parts = url.pathname.split("/").filter(Boolean);
  if (parts[0] === "api" && parts[1] === "connect" && parts[2] === "requests") {
    const id = parts[3] ?? "";
    const action = parts[4];
    if (!REQUEST_ID.test(id)) {
      json(res, 400, { error: "Invalid connection request." });
      return;
    }
    if (req.method === "GET" && !action) {
      const row = records.read(id);
      if (!row) {
        json(res, 404, { error: "This connection request expired. Start again in your coding app." });
        return;
      }
      json(res, 200, requestSecret(req) && requestSecret(req) === row.requestSecret
        ? privateRow(row) : publicRow(row));
      return;
    }
    if (req.method === "PUT" && !action) {
      const current = records.read(id);
      const secret = requestSecret(req);
      if (current?.requestSecret && secret !== current.requestSecret) {
        json(res, 403, { error: "Computer request authentication failed." }); return;
      }
      const incoming = sanitize(await readBody(req), current);
      if (!incoming) {
        json(res, 400, { error: "Invalid connection snapshot." });
        return;
      }
      if (!current && secret) incoming.requestSecret = secret;
      records.write(id, incoming);
      json(res, 200, { ok: true });
      return;
    }
    if (req.method === "POST" && action === "passkey") {
      await completeConnectPasskey(req, res, id, services); return;
    }
    if (req.method === "POST" && action === "decision") {
      const current = records.read(id);
      if (!current) {
        json(res, 404, { error: "This connection request expired. Start again in your coding app." });
        return;
      }
      const body = await readBody(req);
      if (body?.decision !== "approve" && body?.decision !== "deny") {
        json(res, 400, { error: "Choose Approve or Deny." });
        return;
      }
      if (typeof body?.phone === "string") {
        const name = body.phone.trim().slice(0, 80);
        const names = (current.phones ?? []).map((phone) => phone.name);
        if (name && (names.length === 0 || names.includes(name))) current.selectedPhone = name;
      }
      if (!current.decision) current.decision = body.decision;
      records.write(id, current);
      json(res, 200, { ok: true, decision: current.decision });
      return;
    }
    if (req.method === "POST" && action === "redirect") {
      const current = records.read(id);
      if (!current) {
        json(res, 404, { error: "This connection request expired. Start again in your coding app." });
        return;
      }
      const body = await readBody(req);
      const accountDestination = current.purpose === "account-link"
        && current.decision === "passkey" && body?.redirectUrl === "https://granttap.com/account";
      if (!body?.redirectUrl || (!isLoopbackRedirect(body.redirectUrl) && !accountDestination)) {
        json(res, 400, { error: "Redirect is not a coding-app callback." });
        return;
      }
      current.redirectUrl = body.redirectUrl;
      records.write(id, current);
      json(res, 200, { ok: true });
      return;
    }
    json(res, 405, { error: "Method not allowed." });
    return;
  }

}
