import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import RootLayout from "../../app/layout";

test("wraps route content in the GrantTap document layout", () => {
  render(<RootLayout><span>GrantTap route</span></RootLayout>);
  expect(screen.getByText("GrantTap route")).toBeTruthy();
});
