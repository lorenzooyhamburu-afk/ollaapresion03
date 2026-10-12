"use client";

import { useCart } from "./cart-context";

export function ViewCartButton({ className = "" }: { className?: string }) {
  const { openCart, cart } = useCart();
  const count = cart?.lines.reduce((n, l) => n + l.quantity, 0) ?? 0;
  return (
    <button type="button" onClick={openCart} className={className}>
      Ver carrito{count > 0 && ` (${count})`}
    </button>
  );
}
