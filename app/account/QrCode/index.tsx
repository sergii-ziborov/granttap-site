import { useMemo } from "react";
import { encodeQr } from "./encode";
export { encodeQr } from "./encode";

/** Black modules on a white tile with a four-module quiet zone, in both themes, so any camera reads it. */
export function QrCode({ value, label }: { value: string; label: string }) {
  const matrix = useMemo(() => encodeQr(value), [value]);
  const path = useMemo(() => matrix.dark.flatMap((row, y) => row.flatMap((dark, x) => dark ? [`M${x + 4} ${y + 4}h1v1h-1z`] : [])).join(""),
    [matrix]);
  const extent = matrix.size + 8;
  return <svg className="account-qr" role="img" aria-label={label} viewBox={`0 0 ${extent} ${extent}`}
    shapeRendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
    <rect width={extent} height={extent} fill="#fff" />
    <path d={path} fill="#000" />
  </svg>;
}
