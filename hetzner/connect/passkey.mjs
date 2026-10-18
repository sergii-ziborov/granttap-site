import { REQUEST_ID } from "./requests.mjs";
import { json, readBody } from "./http.mjs";
import { sessionCookie } from "../../worker/account/http.ts";

export async function completeConnectPasskey(req, res, id, { records, auth, machines }) {
      if (req.headers.origin !== "https://granttap.com") {
        json(res, 403, { error: "Passkey approval requires this website." });
        return;
      }
      const current = records.read(id);
      if (!current) { json(res, 404, { error: "Connection request expired." }); return; }
      if (current.passkeyCapable !== true) {
        json(res, 409, { error: "Update the Mac helper to use passkeys." }); return;
      }
      if (!current.requestSecret) {
        json(res, 409, { error: "Update the Mac helper for device-wide passkey access." }); return;
      }
      if (current.decision) { json(res, 409, { error: "Request already decided." }); return; }
      const body = await readBody(req);
      if (typeof body?.ceremonyId !== "string" || !REQUEST_ID.test(body.ceremonyId)
          || !body.response || typeof body.response !== "object" || Array.isArray(body.response)
          || typeof body.response.id !== "string") {
        json(res, 400, { error: "Invalid passkey response." });
        return;
      }
      const verified = await auth.completeAuthentication(body.ceremonyId, body.response);
      if (!verified) { json(res, 401, { error: "Passkey verification failed or expired." }); return; }
      const owner = current.machineId ? await machines.owner(current.machineId) : null;
      if (owner && owner !== verified.accountId) {
        json(res, 409, { error: "This Mac is linked to another GrantTap account." }); return;
      }
      if (!owner) {
        const registered = await machines.register(
          verified.accountId, current.computerName || "Mac",
        );
        if (!registered) { json(res, 503, { error: "Computer link unavailable." }); return; }
        current.machineId = registered.id;
        current.machineToken = registered.machineToken;
      }
      current.accountId = verified.accountId;
      current.decision = "passkey";
      records.write(id, current);
      res.setHeader("set-cookie", sessionCookie(verified.token));
      json(res, 200, { ok: true, decision: "passkey" });
      return;
    }
