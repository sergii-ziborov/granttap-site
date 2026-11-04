import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GuideReader } from "..";
import { parseGuide } from "../markdown";
import { Capture } from "../Capture";
import { Diagram } from "../Diagram";
import { CodeBlock } from "../CodeBlock";

beforeEach(() => {
  HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  HTMLDialogElement.prototype.close = function () { this.open = false; };
});

describe("reading and inspecting examples", () => {
  it("renders structured instructions, lists, real figures and scrollable table data", () => {
    const text = "Введение\r\n\n## Шаги {#steps}\nПродолжение\nв том же абзаце.\n\n- Один\n- Два\n\n1. Начать\n2. Закончить\n\n| Шаг | Результат |\n| --- | --- |\n| **Send** | Принято |\n\n:::capture now\n\n:::diagram task\n\n:::warning Внимание\nПервое.\n\nВторое.\n:::\n\n:::exercise Практика\nПопробуйте.\n:::\n\n:::note\nПримечание.\n:::\n\n```bash\n# Только учебная папка\nnpm test\n```";
    render(<GuideReader sections={parseGuide(text)} />);
    expect(screen.getByRole("heading", { name: /Шаги/ })).toBeTruthy();
    expect(screen.getByText("Один").closest("ul")?.children).toHaveLength(2);
    expect(screen.getByText("Начать").closest("ol")?.children).toHaveLength(2);
    expect(screen.getByRole("cell", { name: "Принято" })).toBeTruthy();
    expect(screen.getByText("Второе.")).toBeTruthy();
    expect(screen.getByRole("img", { name: "Сейчас: решения и вопросы" })).toBeTruthy();
    expect(screen.getByText("npm test")).toBeTruthy();
  });
  it("lets the reader compare receipt stages without claiming delivery", () => {
    render(<Diagram id="delivery" />);
    fireEvent.click(screen.getByRole("button", { name: /02\s*Реле/ }));
    expect(screen.getByText(/Это ещё не получение агентом/)).toBeTruthy();
    expect(screen.getByRole("link", { name: "Подробнее об этом этапе ↗" }).getAttribute("href")).toBe("/guide/message-delivery#receipts");
    fireEvent.click(screen.getByRole("button", { name: /05\s*История/ }));
    expect(screen.getByRole("button", { name: /05\s*История/ }).getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByText(/экран на ПК может обновиться позднее/)).toBeTruthy();
  });
  it("opens real screenshots and closes with either explicit action or Escape", () => {
    render(<Capture id="chat" />);
    const trigger = screen.getByRole("button", { name: "Увеличить: Чат учебной задачи" });
    trigger.focus(); fireEvent.click(trigger);
    expect(screen.getByRole("dialog").getAttribute("open")).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Закрыть изображение" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(trigger);
    fireEvent.click(screen.getByRole("button", { name: "Увеличить: Чат учебной задачи" }));
    fireEvent(screen.getByRole("dialog"), new Event("cancel", { bubbles: true }));
    expect(screen.queryByRole("dialog")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Увеличить: Чат учебной задачи" }));
    fireEvent.click(screen.getByRole("dialog"));
    expect(screen.queryByRole("dialog")).toBeNull();
  });
  it("copies commands exactly and offers a fallback if clipboard permission is unavailable", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    const view = render(<CodeBlock text={"# Lab\nnpm test"} language="bash" />);
    fireEvent.click(screen.getByRole("button", { name: "Копировать" }));
    await screen.findByRole("button", { name: "Скопировано" });
    expect(writeText).toHaveBeenCalledWith("# Lab\nnpm test");
    view.unmount(); writeText.mockRejectedValue(new Error("permission denied"));
    render(<CodeBlock text="npm test" language="" />);
    fireEvent.click(screen.getByRole("button", { name: "Копировать" }));
    await waitFor(() => expect(screen.getByRole("status").textContent).toContain("Выделите текст"));
    expect(screen.getByText("Пример")).toBeTruthy();
  });
  it("ignores unknown visual references and handles headings without explicit anchors", () => {
    const view = render(<><Capture id="missing" /><Diagram id="missing" /></>);
    expect(view.container.textContent).toBe("");
    expect(parseGuide("## Заголовок\nОбычный текст")[1].id).toBe("section-1");
  });
});
