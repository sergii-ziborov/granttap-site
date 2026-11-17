import type { Device } from "../client";

const paths: Record<Device["kind"], string> = {
  iphone: "M8 2.5h8a1.5 1.5 0 0 1 1.5 1.5v16a1.5 1.5 0 0 1-1.5 1.5H8A1.5 1.5 0 0 1 6.5 20V4A1.5 1.5 0 0 1 8 2.5Zm3 16h2",
  ipad: "M5.5 2.5h13A1.5 1.5 0 0 1 20 4v16a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 20V4a1.5 1.5 0 0 1 1.5-1.5Zm5.5 16h2",
  mac: "M4.5 5h15a1 1 0 0 1 1 1v9.5h-17V6a1 1 0 0 1 1-1ZM2 18.5h20",
  computer: "M4.5 4h15a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1ZM9 20h6m-3-4v4",
  browser: "M3.5 5.5h17a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-17a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1Zm-1 4h19M6 7.5h.01M8.5 7.5h.01",
  app: "M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm1.5 9h7M12 8.5v7",
  unknown: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-2.5-11.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5v.7m0 3h.01",
};

export function DeviceIcon({ kind }: { kind: Device["kind"] }) {
  return <span className="account-device-icon" aria-hidden="true">
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round"><path d={paths[kind]} /></svg>
  </span>;
}
