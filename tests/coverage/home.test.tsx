import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import Home from "../../app/page";

test("renders the Personal product journey and locale control", async () => {
  const user = userEvent.setup();
  render(<Home />);

  expect(screen.getByRole("heading", { name: /All your coding agents/i })).toBeTruthy();
  expect(screen.getByText("Claude Code + Codex")).toBeTruthy();
  expect(screen.getByText("Cursor Beta")).toBeTruthy();
  expect(screen.getByRole("heading", { name: "Needs You" })).toBeTruthy();
  expect(screen.getByText(/npm install -g granttap-mcp/)).toBeTruthy();
  expect(screen.queryByText(/Enterprise|Open account|GrantTap Web/i)).toBeNull();
  expect(screen.getByRole("img", { name: "GrantTap live task chat" })).toBeTruthy();

  await user.click(screen.getByRole("button", { name: "Switch to Russian" }));
  expect(screen.getByRole("heading", { name: /Все ваши coding agents/i })).toBeTruthy();
});
