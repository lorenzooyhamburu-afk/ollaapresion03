"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useCart } from "./cart-context";

type Props = {
  variantId: string | undefined;
  available: boolean;
  quantity?: number;
  /** "grid": botón chico en la tarjeta de producto. "full": botón grande de la ficha. */
  size?: "grid" | "full";
  className?: string;
};

export function AddToCartButton({ variantId, available, quantity = 1, size = "full", className }: Props) {
  const { addItem } = useCart();
  const [state, setState] = useState<"idle" | "loading" | "added">("idle");

  const disabled = !available || !variantId || state === "loading";

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault(); // en la tarjeta, el botón vive dentro de un link
    e.stopPropagation();
    if (!variantId) return;
    setState("loading");
    await addItem(variantId, quantity);
    setState("added");
    setTimeout(() => setState("idle"), 1500);
  }

  const label = !available
    ? "Sin stock"
    : state === "loading"
      ? "Agregando…"
      : state === "added"
        ? "¡Agregado!"
        : size === "grid"
          ? "Agregar"
          : "Agregar al carrito";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-live="polite"
      className={cn(
        "btn-action",
        size === "grid" ? "w-full px-3 py-2 text-sm" : "w-full py-4 text-lg",
        className,
      )}
    >
      {available && state === "idle" && (
        <svg width={size === "grid" ? 16 : 20} height={size === "grid" ? 16 : 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      )}
      {label}
    </button>
  );
}
