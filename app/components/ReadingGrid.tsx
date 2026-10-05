import type { ReactNode } from "react";

export function ReadingGrid({ children, rail, className = "", railClassName = "", railLabel }: {
  children: ReactNode;
  rail: ReactNode;
  className?: string;
  railClassName?: string;
  railLabel?: string;
}) {
  return <div className={`reading-grid ${className}`}>
    <div className="reading-main">{children}</div>
    <aside className={`reading-rail ${railClassName}`} aria-label={railLabel}>{rail}</aside>
  </div>;
}
