import assert from "node:assert/strict";
import test from "node:test";
import { calculateOrder } from "./order.mjs";

test("пустая корзина не оплачивает доставку", () => {
  assert.deepEqual(calculateOrder([]), { subtotal: 0, shipping: 0, total: 0, currency: "RUB" });
});

test("товары и доставка считаются отдельно в целых копейках", () => {
  assert.deepEqual(calculateOrder([{ price: 19900, quantity: 2 }, { price: 5000, quantity: 1 }]),
    { subtotal: 44800, shipping: 500, total: 45300, currency: "RUB" });
});

test("стоимость доставки можно задать явно", () => {
  assert.equal(calculateOrder([{ price: 1000, quantity: 3 }], 250).total, 3250);
});

test("неверное количество и цена отклоняются", () => {
  for (const item of [{ price: -1, quantity: 1 }, { price: 1, quantity: 0 },
    { price: 1.5, quantity: 1 }, { price: 100, quantity: 1.5 }]) {
    assert.throws(() => calculateOrder([item]), RangeError);
  }
});

test("небезопасное переполнение не превращается в тихую ошибку", () => {
  assert.throws(() => calculateOrder([{ price: Number.MAX_SAFE_INTEGER, quantity: 2 }]), RangeError);
});

test("стоимость доставки тоже проверяется", () => {
  assert.throws(() => calculateOrder([{ price: 100, quantity: 1 }], -1), RangeError);
});
