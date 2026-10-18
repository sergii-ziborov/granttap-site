import { expect, it } from "vitest";
import { accountReturnPath } from "../return-path";

it("returns signed-in users only to the requested GrantTap browser app", () => {
  expect(accountReturnPath("?returnTo=control")).toBe("/control");
  expect(accountReturnPath("?lang=ru&returnTo=control")).toBe("/control");
  for (const search of ["", "?returnTo=", "?returnTo=https://other.example", "?returnTo=//other.example",
    "?returnTo=/control", "?returnTo=control&returnTo=https://other.example", "?returnTo=CONTROL"]) {
    expect(accountReturnPath(search)).toBeUndefined();
  }
});
