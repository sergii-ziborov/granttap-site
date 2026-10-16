import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import PricingPage from "../../app/pricing/page";

test("first launch offers three monthly plans and a separate one-time Mac purchase", () => {
  render(<PricingPage />);
  for (const [name, price, computers] of [["Personal", "$3.99", "2"],
    ["Personal Plus", "$6.99", "5"], ["Fleet", "$11.99", "15"]]) {
    const card = screen.getByRole("article", { name });
    expect(within(card).getByText(price)).toBeTruthy();
    expect(within(card).getByText(`Up to ${computers} managed computers`)).toBeTruthy();
  }
  expect(screen.getByText("$39.99")).toBeTruthy();
  expect(screen.queryByRole("button", { name: /yearly/i })).toBeNull();
  expect(screen.queryByText(/\$1\.99|\$5\.99|\$9\.99/)).toBeNull();
});

test("Russian pricing keeps the locale through its real installation and help paths", async () => {
  const user = userEvent.setup();
  render(<PricingPage />);
  await user.click(screen.getByRole("button", { name: "Switch to Russian" }));
  expect(screen.getByRole("heading", { name: "Выберите, сколько компьютеров подключить" })).toBeTruthy();
  expect(screen.getByRole("link", { name: "Подробнее о Mac Local" }).getAttribute("href")).toBe("/mac?lang=ru");
  expect(screen.getAllByRole("link", { name: "Запросить приглашение" })
    .every(link => link.getAttribute("href") === "/support?lang=ru#contact")).toBe(true);
});
