/** Все суммы — целые копейки. Учебный код, без сетевых операций. */
export function calculateOrder(items, shipping = 500) {
  if (!Array.isArray(items)) throw new TypeError("Ожидается список товаров");
  if (!Number.isSafeInteger(shipping) || shipping < 0) throw new RangeError("Неверная стоимость доставки");
  let subtotal = 0;
  for (const item of items) {
    if (!Number.isSafeInteger(item.price) || item.price < 0
      || !Number.isSafeInteger(item.quantity) || item.quantity < 1) {
      throw new RangeError("Неверная цена или количество");
    }
    subtotal += item.price * item.quantity;
    if (!Number.isSafeInteger(subtotal)) throw new RangeError("Сумма слишком велика");
  }
  const delivery = items.length ? shipping : 0;
  const total = subtotal + delivery;
  if (!Number.isSafeInteger(total)) throw new RangeError("Сумма слишком велика");
  return { subtotal, shipping: delivery, total, currency: "RUB" };
}
