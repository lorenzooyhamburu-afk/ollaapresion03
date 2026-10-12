"use client";

import { useCart } from "./cart-context";

export function CartButton() {
  const { cart, openCart } = useCart();
  const count = cart?.lines.reduce((n, l) => n + l.quantity, 0) ?? 0;

  return (
    <button
      onClick={openCart}
      className="relative grid size-11 place-items-center rounded-full hover:bg-brand-soft"
      aria-label={`Abrir carrito, ${count} productos`}
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 7h12l-1 13H7L6 7z" />
        <path d="M9 7a3 3 0 0 1 6 0" />
      </svg>
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-action px-1 text-xs font-extrabold text-white">
          {count}
        </span>
      )}
    </button>
  );
}
