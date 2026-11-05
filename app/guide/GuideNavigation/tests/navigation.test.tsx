import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GuideShell } from "..";
import { guideSearchIndex } from "../../GuideContent";

beforeEach(() => {
  HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  HTMLDialogElement.prototype.close = function () { this.open = false; };
});

describe("guide navigation", () => {
  it("loads full-text search only when opened and lets a failed load be retried", async () => {
    const fetchIndex = vi.fn()
      .mockResolvedValueOnce({ ok: false })
      .mockResolvedValueOnce({ ok: true, json: async () => guideSearchIndex });
    vi.stubGlobal("fetch", fetchIndex);
    const view = render(<GuideShell>Читать</GuideShell>);
    expect(fetchIndex).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Поиск по руководству ⌘ K" }));
    await screen.findByRole("button", { name: "Повторить загрузку" });
    fireEvent.click(screen.getByRole("button", { name: "Повторить загрузку" }));
    await waitFor(() => expect(fetchIndex).toHaveBeenCalledTimes(2));
    fireEvent.change(screen.getByRole("textbox", { name: "Найти в руководстве" }), { target: { value: "authorization" } });
    await waitFor(() => expect(screen.getAllByRole("option").some(item => item.getAttribute("href")?.includes("provider-sign-in"))).toBe(true));
    view.unmount(); vi.unstubAllGlobals();
  });
  it("highlights the active chapter, remembers theme and restores the host page language", () => {
    document.documentElement.lang = "en"; localStorage.setItem("granttap.guide.theme", "dark");
    const view = render(<GuideShell current="message-delivery" searchIndex={guideSearchIndex}>Читать</GuideShell>);
    expect(screen.getByRole("link", { name: "Как доставляется сообщение" }).getAttribute("aria-current")).toBe("page");
    expect(document.documentElement.lang).toBe("ru");
    fireEvent.change(screen.getByLabelText("Цветовая тема"), { target: { value: "light" } });
    expect(localStorage.getItem("granttap.theme")).toBe("light");
    fireEvent.change(screen.getByLabelText("Цветовая тема"), { target: { value: "dark" } });
    expect(localStorage.getItem("granttap.theme")).toBe("dark");
    view.unmount(); expect(document.documentElement.lang).toBe("en");
  });
  it("opens search by shortcut, filters all chapters, navigates results and closes with Escape", () => {
    render(<GuideShell searchIndex={guideSearchIndex}>Читать</GuideShell>);
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    const input = screen.getByRole("textbox", { name: "Найти в руководстве" });
    expect(document.activeElement).toBe(input);
    fireEvent.click(screen.getByRole("button", { name: "Го ↗" }));
    const results = screen.getAllByRole("option");
    expect(results[0].getAttribute("href")).toContain("/guide/message-delivery");
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(results[1].getAttribute("aria-selected")).toBe("true");
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(results[0].getAttribute("aria-selected")).toBe("true");
    fireEvent.mouseEnter(results[2]); expect(results[2].getAttribute("aria-selected")).toBe("true");
    fireEvent.change(input, { target: { value: "неизвестныйтермин" } });
    expect(screen.getByRole("status").textContent).toContain("Ничего не найдено");
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent(screen.getByRole("dialog"), new Event("cancel", { bubbles: true, cancelable: true }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });
  it("opens search from its button, closes on backdrop and keeps links available without storage", () => {
    const get = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("private mode"); });
    const set = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("private mode"); });
    render(<GuideShell searchIndex={guideSearchIndex}>Читать</GuideShell>);
    fireEvent.change(screen.getByLabelText("Цветовая тема"), { target: { value: "light" } });
    fireEvent.click(screen.getByRole("button", { name: "Поиск по руководству ⌘ K" }));
    fireEvent.click(screen.getByRole("dialog"));
    expect(screen.queryByRole("dialog")).toBeNull();
    fireEvent.keyDown(window, { key: "K", metaKey: true });
    fireEvent.click(screen.getByRole("button", { name: "Закрыть поиск" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    get.mockRestore(); set.mockRestore();
  });
  it("toggles compact navigation and closes it when a chapter is selected", () => {
    render(<GuideShell searchIndex={guideSearchIndex}>Читать</GuideShell>);
    fireEvent.click(screen.getByRole("button", { name: "Разделы" }));
    expect(screen.getByRole("button", { name: "Закрыть" }).getAttribute("aria-expanded")).toBe("true");
    fireEvent.click(screen.getByRole("button", { name: "Закрыть навигацию" }));
    expect(screen.getByRole("button", { name: "Разделы" }).getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(screen.getByRole("button", { name: "Разделы" }));
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.getByRole("button", { name: "Разделы" }).getAttribute("aria-expanded")).toBe("false");
  });
});
