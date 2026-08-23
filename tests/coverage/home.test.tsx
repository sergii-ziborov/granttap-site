import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import Home from "../../app/page";

test("renders the Personal product journey and locale control", async () => {
  const user = userEvent.setup();
  render(<Home />);

  expect(screen.getByRole("heading", { name: /All your coding agents/i })).toBeTruthy();
  expect(screen.getByText("Claude Code + Codex")).toBeTruthy();
  expect(screen.getByText("Cursor Beta")).toBeTruthy();
  expect(screen.getByText("Grok Build · Experimental")).toBeTruthy();
  expect(screen.getByRole("heading", { name: "Needs You" })).toBeTruthy();
  expect(screen.getByText(/npm install -g granttap-mcp/)).toBeTruthy();
  expect(screen.queryByText(/Enterprise|Open account|GrantTap Web/i)).toBeNull();
  expect(screen.getByRole("img", { name: "GrantTap live task chat" })).toBeTruthy();

  const previews = screen.getAllByRole("button", { name: /Open full-size/i });
  expect(previews).toHaveLength(5);
  await user.click(previews[0]);
  expect(screen.getByRole("dialog", { name: "Now screenshot" })).toBeTruthy();
  expect(screen.getByRole("img", { name: "GrantTap Now, full size" })).toBeTruthy();
  await user.keyboard("a");
  expect(screen.getByRole("dialog", { name: "Now screenshot" })).toBeTruthy();
  await user.keyboard("{Escape}");
  expect(screen.queryByRole("dialog")).toBeNull();

  await user.click(previews[1]);
  await user.click(screen.getByRole("button", { name: "Close preview" }));
  expect(screen.queryByRole("dialog")).toBeNull();

  await user.click(previews[2]);
  const usageDialog = screen.getByRole("dialog", { name: "Usage screenshot" });
  fireEvent.mouseDown(screen.getByRole("img", { name: "GrantTap Usage, full size" }));
  expect(screen.getByRole("dialog", { name: "Usage screenshot" })).toBeTruthy();
  fireEvent.mouseDown(usageDialog);
  expect(screen.queryByRole("dialog")).toBeNull();

  await user.click(screen.getByRole("button", { name: "Switch to Russian" }));
  expect(screen.getByRole("heading", { name: /Все ваши coding agents/i })).toBeTruthy();
});
