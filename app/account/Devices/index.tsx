"use client";
import { useState } from "react";
import { accountApi, relativeTime, shortDate, type Device } from "../client";
import { ConfirmAction } from "../ConfirmAction";
import { devicesCopy } from "./copy";
import { DeviceIcon } from "./icon";

const STALE_DAYS = 30;
export const lastActive = (device: Device) => device.lastSeenAt ?? device.createdAt;
type Copy = (typeof devicesCopy)[keyof typeof devicesCopy];

/** Every session and computer on the account, with sign-out, removal, a 30-day cleanup and one for older sign-ins. */
export function AccountDevices({ locale, devices, onChanged, onSignedOut }: { locale: "en" | "ru"; devices: Device[];
  onChanged: () => void; onSignedOut: () => void }) {
  const t = devicesCopy[locale];
  const [error, setError] = useState("");
  const [now] = useState(() => Date.now());
  const cutoff = now - STALE_DAYS * 86_400_000;
  const recorded = devices.filter(device => !device.older), older = devices.filter(device => device.older);
  const stale = recorded.filter(device => !device.current && (lastActive(device) ?? 0) < cutoff);
  const removableOlder = older.filter(device => !device.current);

  async function remove(device: Device) {
    setError("");
    const result = await accountApi(`devices/${device.type === "session" ? "sessions" : "computers"}/${device.id}`, { method: "DELETE" });
    if (!result.ok) { setError(t.failed); return; }
    if (device.current) onSignedOut(); else onChanged();
  }
  async function prune(body: { inactiveDays: number } | { older: true }) {
    setError("");
    const result = await accountApi("devices/prune", { method: "POST", body });
    if (result.ok) onChanged(); else setError(t.failed);
  }
  const row = (device: Device) => <DeviceRow key={device.type + device.id} device={device} t={t} locale={locale} now={now}
    onRemove={() => remove(device)} />;

  return <>
    <p className="account-section-lead">{t.lead}</p>
    <ul className="account-devices">{recorded.map(row)}</ul>
    {devices.length === 0 && <p className="account-note">{t.empty}</p>}
    <div className="account-row-actions">
      <ConfirmAction label={t.prune(STALE_DAYS)} disabled={stale.length === 0} danger quiet
        question={<>{t.confirmPrune(stale.length)} <strong>{stale.map(device => device.name).join(", ")}</strong></>}
        confirmLabel={t.pruneConfirm(stale.length)} cancelLabel={t.keepAll} onConfirm={() => prune({ inactiveDays: STALE_DAYS })} />
      {stale.length === 0 && <p className="account-note">{t.nothingStale(STALE_DAYS)}</p>}
    </div>
    {older.length > 0 && <>
      <h3>{t.olderTitle}</h3>
      <p className="account-note">{t.olderLead}</p>
      <ul className="account-devices">{older.map(row)}</ul>
      {removableOlder.length > 0 && <div className="account-row-actions">
        <ConfirmAction label={t.removeOlder(removableOlder.length)} danger quiet question={t.confirmOlder(removableOlder.length)}
          confirmLabel={t.removeOlder(removableOlder.length)} cancelLabel={t.keepAll} onConfirm={() => prune({ older: true })} />
      </div>}
    </>}
    {error && <p role="alert" className="account-error">{error}</p>}
  </>;
}

function DeviceRow({ device, t, locale, now, onRemove }: { device: Device; t: Copy; locale: "en" | "ru"; now: number;
  onRemove: () => Promise<void> }) {
  const name = device.older && device.kind === "unknown" ? t.olderName : device.name;
  const seen = lastActive(device);
  const meta = device.older
    ? [device.kind !== "unknown" && t.kind[device.kind], device.signIn && t.signIn[device.signIn],
      device.createdAt && t.since(shortDate(device.createdAt, locale)),
      device.lastSeenAt ? t.lastUsed(relativeTime(device.lastSeenAt, locale, now)) : t.noUse]
    : [t.kind[device.kind], device.signIn && t.signIn[device.signIn],
      device.type === "computer" && device.encryptionKeyId ? t.encrypted(device.encryptionKeyId.slice(0, 6)) : null,
      seen ? t.active(relativeTime(seen, locale, now)) : t.neverSeen];
  return <li className={device.current ? "current" : ""}>
    <DeviceIcon kind={device.kind} />
    <div className="account-device-text">
      <p className="account-device-name">{name}{device.current && <span className="account-badge">{t.thisBrowser(device.kind)}</span>}</p>
      <p className="account-device-meta">{meta.filter(Boolean).join(" · ")}</p>
    </div>
    <ConfirmAction label={device.type === "computer" ? t.remove : t.signOut}
      accessibleLabel={`${device.type === "computer" ? t.remove : t.signOut}: ${name}`}
      question={device.type === "computer" ? t.confirmRemove(name) : device.current ? t.confirmSelf : t.confirmSignOut(name)}
      confirmLabel={device.type === "computer" ? t.remove : t.signOut}
      cancelLabel={device.type === "computer" ? t.keepComputer : t.keepSession} danger quiet
      onConfirm={onRemove} />
  </li>;
}
