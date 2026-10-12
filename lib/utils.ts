import type { Money } from "./shopify/types";

export function formatPrice(money: Money | number, currencyCode = "ARS") {
  const amount = typeof money === "number" ? money : Number(money.amount);
  const currency = typeof money === "number" ? currencyCode : money.currencyCode;
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/** Porcentaje de descuento entre precio de lista y precio actual (0 si no hay). */
export function discountPercent(price: Money, compareAt?: Money | null) {
  if (!compareAt) return 0;
  const p = Number(price.amount);
  const c = Number(compareAt.amount);
  return c > p ? Math.round(((c - p) / c) * 100) : 0;
}

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
