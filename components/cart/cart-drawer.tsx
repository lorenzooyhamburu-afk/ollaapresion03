"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { checkout } from "@/lib/config";
import { formatPrice } from "@/lib/utils";
import { FreeShippingBar } from "./free-shipping-bar";
import { useCart } from "./cart-context";
import { WhatsAppCheckout } from "./whatsapp-checkout";

export function CartDrawer() {
  const { cart, isOpen, closeCart, updateQuantity, isPending, error } = useCart();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeCart]);

  const lines = cart?.lines ?? [];
  const subtotal = cart ? Number(cart.cost.subtotalAmount.amount) : 0;
  const count = lines.reduce((n, l) => n + l.quantity, 0);

  return (
    <div className={isOpen ? "pointer-events-auto" : "pointer-events-none"} aria-hidden={!isOpen}>
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-40 bg-ink/40 transition-opacity ${isOpen ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Carrito"
        className={`fixed right-0 top-0 z-50 flex h-dvh w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-2xl font-extrabold">
            Tu carrito {count > 0 && <span className="text-brand-dark">({count})</span>}
          </h2>
          <button onClick={closeCart} className="rounded-full p-2 hover:bg-brand-soft" aria-label="Cerrar carrito">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <span className="text-6xl">🍬</span>
            <p className="text-lg font-bold">Tu carrito está vacío</p>
            <p className="text-muted">Empezá por lo que más se lleva la gente.</p>
            <Link href="/buscar?orden=mas-vendidos" onClick={closeCart} className="btn-ghost">
              Ver los más vendidos
            </Link>
          </div>
        ) : (
          <>
            <div className="px-5 pt-4">
              <FreeShippingBar subtotal={subtotal} />
            </div>

            <div className="flex-1 overflow-y-auto">
            <ul className={`divide-y divide-line px-5 ${isPending ? "opacity-70" : ""}`}>
              {lines.map((line) => {
                const img = line.merchandise.image ?? line.merchandise.product.featuredImage;
                const variant = line.merchandise.title !== "Default Title" ? line.merchandise.title : null;
                return (
                  <li key={line.id} className="flex gap-3 py-4">
                    <Link
                      href={`/producto/${line.merchandise.product.handle}`}
                      onClick={closeCart}
                      className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-brand-soft"
                    >
                      {img && (
                        <Image src={img.url} alt={img.altText ?? line.merchandise.product.title} fill sizes="80px" className="object-contain p-1" />
                      )}
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <p className="line-clamp-2 font-bold leading-tight">{line.merchandise.product.title}</p>
                      {variant && <p className="text-sm text-muted">{variant}</p>}
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <QuantityControl
                          value={line.quantity}
                          onChange={(q) => updateQuantity(line.id, q)}
                        />
                        <span className="font-extrabold">{formatPrice(line.cost.totalAmount)}</span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="border-t border-line px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
              {error && <p className="mb-2 text-sm font-semibold text-action">{error}</p>}
              <div className="flex items-baseline justify-between">
                <span className="text-muted">Total</span>
                <span className="text-2xl font-extrabold">{formatPrice(cart!.cost.subtotalAmount)}</span>
              </div>

              {checkout.mode === "online" ? (
                <>
                  <p className="mt-1 text-sm text-muted">
                    Retiro gratis en Moreno centro o envío a domicilio. Lo elegís en el próximo paso.
                  </p>
                  <a href={cart!.checkoutUrl} className="btn-action mt-4 w-full text-lg">
                    Finalizar compra
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </a>
                  <p className="mt-3 text-center text-xs text-muted">🔒 Pago 100% seguro</p>
                </>
              ) : (
                <div className="mt-4">
                  <WhatsAppCheckout cart={cart!} />
                </div>
              )}
            </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

function QuantityControl({ value, onChange }: { value: number; onChange: (q: number) => void }) {
  return (
    <div className="flex items-center rounded-full border border-line">
      <button
        onClick={() => onChange(value - 1)}
        className="grid size-8 place-items-center rounded-full text-lg font-bold hover:bg-brand-soft"
        aria-label={value === 1 ? "Quitar del carrito" : "Restar uno"}
      >
        {value === 1 ? "🗑" : "−"}
      </button>
      <span className="w-7 text-center font-bold tabular-nums">{value}</span>
      <button
        onClick={() => onChange(value + 1)}
        className="grid size-8 place-items-center rounded-full text-lg font-bold hover:bg-brand-soft"
        aria-label="Sumar uno"
      >
        +
      </button>
    </div>
  );
}
