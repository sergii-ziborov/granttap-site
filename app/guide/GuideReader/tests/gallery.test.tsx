import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { ScreenshotGallery } from "../ScreenshotGallery";
import captures from "../../GuideContent/screenshots.json";

beforeEach(() => {
  HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  HTMLDialogElement.prototype.close = function () { this.open = false; };
});

describe("real screenshot gallery", () => {
  it("filters actual screens by reader journey and exposes the complete collection", () => {
    render(<ScreenshotGallery />);
    fireEvent.click(screen.getByRole("button", { name: "Подключение · 2" }));
    expect(screen.getAllByRole("img")).toHaveLength(2);
    expect(screen.getByRole("img", { name: "Devices: вход и подключение компьютера" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Все экраны · 17" }));
    expect(screen.getAllByRole("img")).toHaveLength(captures.length);
    expect(screen.getByRole("status").textContent).toContain("17");
    fireEvent.click(screen.getByRole("button", { name: "Mac · 2" }));
    expect(screen.getAllByRole("img")).toHaveLength(2);
    expect(screen.getAllByText(/Сборка 181/)).toHaveLength(2);
  });
  it("opens the chosen original screen without presenting illustration as product evidence", () => {
    render(<ScreenshotGallery />);
    fireEvent.click(screen.getByRole("button", { name: "Подключение · 2" }));
    fireEvent.click(screen.getByRole("button", { name: "Увеличить: Добавить устройство: Scan QR и защищённый ввод" }));
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByRole("img").getAttribute("src")).toBe("/guide/screens/pairing-options.png");
    fireEvent.click(screen.getByRole("button", { name: "Закрыть изображение" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
