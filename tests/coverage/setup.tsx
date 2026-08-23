import { cleanup } from "@testing-library/react";
import { createElement } from "react";
import { afterEach, vi } from "vitest";

vi.mock("next/image", () => ({
  default: ({ priority: _priority, unoptimized: _unoptimized, ...props }: React.ImgHTMLAttributes<HTMLImageElement> & {
    priority?: boolean;
    unoptimized?: boolean;
  }) => {
    void _priority;
    void _unoptimized;
    return createElement("img", props);
  },
}));

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a href={href} {...props}>{children}</a>,
}));

vi.mock("next/navigation", () => ({ usePathname: () => "/privacy" }));

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});
