import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { parseGuide } from "../markdown";
import { Inline } from "../Inline";

describe("guide content", () => {
  it("keeps stable deep links, executable examples and table columns", () => {
    const sections = parseGuide("Введение.\n\n## Подключение {#pair}\n```bash\ngranttap setup\n```\n\n| Шаг | Результат |\n| --- | --- |\n| QR | Привязка |\n\n:::warning Ключи\nНе публикуйте код.\n:::");
    expect(sections[1].id).toBe("pair");
    expect(sections[1].blocks).toEqual([
      { kind: "code", language: "bash", text: "granttap setup" },
      { kind: "table", rows: [["Шаг", "Результат"], ["QR", "Привязка"]] },
      { kind: "callout", tone: "warning", title: "Ключи", text: "Не публикуйте код." },
    ]);
  });
  it("renders links and emphasis without interpreting embedded HTML or unsafe URLs", () => {
    render(<Inline text={'**Внимание**: [очередь](/guide/message-queue), `Cancel`, ==важно== <script>alert(1)</script> [bad](javascript:alert)'} />);
    expect(screen.getByRole("link", { name: "очередь" }).getAttribute("href")).toBe("/guide/message-queue");
    expect(document.querySelector("script")).toBeNull();
    expect(document.querySelector("mark")?.textContent).toBe("важно");
    expect(screen.queryByRole("link", { name: "bad" })).toBeNull();
  });
});
