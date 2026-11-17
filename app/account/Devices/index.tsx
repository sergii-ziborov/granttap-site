"use client";
import { useState } from "react";
import { accountApi, relativeTime, type Device } from "../client";
import { ConfirmAction } from "../ConfirmAction";
import { devicesCopy } from "./copy";
import { DeviceIcon } from "./icon";

const STALE_DAYS = 30;
export const lastActive = (device: Device) => device.lastSeenAt ?? device.createdAt;

/** Every session and computer on the account, with sign-out, removal and a 30-day cleanup. */
export function AccountDevices({ locale, devices, onChanged, onSignedOut }: { locale: "en" | "ru"; devices: Device[];
  onChanged: () => void; onSignedOut: () => void }) {
  const t = devicesCopy[locale];
  const [error, setError] = useState("");
  const [now] = useState(() => Date.now());
  const cutoff = now - STALE_DAYS * 86_400_000;
  const stale = devices.filter(device => !device.current && (lastActive(device) ?? 0) < cutoff);

  async function remove(device: Device) {
    setError("");
    const result = await accountApi(`devices/${device.type === "session" ? "sessions" : "computers"}/${device.id}`, { method: "DELETE" });
    if (!result.ok) { setError(t.failed); return; }
    if (device.current) onSignedOut(); else onChanged();
  }
  async function prune() {
    setError("");
    const result = await accountApi("devices/prune", { method: "POST", body: { inactiveDays: STALE_DAYS } });
    if (result.ok) onChanged(); else setError(t.failed);
  }

  return <>
    <p className="account-section-lead">{t.lead}</p>
    <ul className="account-devices">{devices.map(device => <li key={device.type + device.id} className={device.current ? "current" : ""}>
      <DeviceIcon kind={device.kind} />
      <div className="account-device-text">
        <p className="account-device-name">{device.name}{device.current && <span className="account-badge">{t.thisBrowser(device.kind)}</span>}</p>
        <p className="account-device-meta">{[t.kind[device.kind], device.signIn && t.signIn[device.signIn],
          device.type === "computer" && device.encryptionKeyId ? t.encrypted(device.encryptionKeyId.slice(0, 6)) : null,
          lastActive(device) ? t.active(relativeTime(lastActive(device)!, locale, now)) : t.neverSeen].filter(Boolean).join(" · ")}</p>
      </div>
      <ConfirmAction label={device.type === "computer" ? t.remove : t.signOut}
        accessibleLabel={`${device.type === "computer" ? t.remove : t.signOut}: ${device.name}`}
        question={device.type === "computer" ? t.confirmRemove(device.name) : device.current ? t.confirmSelf : t.confirmSignOut(device.name)}
        confirmLabel={device.type === "computer" ? t.remove : t.signOut} cancelLabel={t.cancel} danger quiet
        onConfirm={() => remove(device)} />
    </li>)}</ul>
    {devices.length === 0 && <p className="account-note">{t.empty}</p>}
    <div className="account-row-actions">
      <ConfirmAction label={t.prune(STALE_DAYS)} disabled={stale.length === 0} danger quiet
        question={<>{t.confirmPrune(stale.length)} <strong>{stale.map(device => device.name).join(", ")}</strong></>}
        confirmLabel={t.pruneConfirm(stale.length)} cancelLabel={t.cancel} onConfirm={prune} />
      {stale.length === 0 && <p className="account-note">{t.nothingStale(STALE_DAYS)}</p>}
    </div>
    {error && <p role="alert" className="account-error">{error}</p>}
  </>;
}
