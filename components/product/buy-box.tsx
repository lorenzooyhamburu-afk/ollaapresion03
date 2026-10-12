"use client";

import { useMemo, useState } from "react";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import type { Product } from "@/lib/shopify/types";
import { discountPercent, formatPrice } from "@/lib/utils";

export function BuyBox({ product }: { product: Product }) {
  const initial = product.variants.find((v) => v.availableForSale) ?? product.variants[0];
  const [selected, setSelected] = useState<Record<string, string>>(
    Object.fromEntries(initial?.selectedOptions.map((o) => [o.name, o.value]) ?? []),
  );
  const [quantity, setQuantity] = useState(1);

  const variant = useMemo(
    () => product.variants.find((v) => v.selectedOptions.every((o) => selected[o.name] === o.value)),
    [product.variants, selected],
  );

  const showOptions = !(product.options.length === 1 && product.options[0].optionValues.length <= 1);
  const price = variant?.price ?? product.priceRange.minVariantPrice;
  const off = discountPercent(price, variant?.compareAtPrice);
  const available = !!variant?.availableForSale;

  // ¿Esta combinación de opciones existe y tiene stock?
  function isAvailable(optionName: string, value: string) {
    const wanted = { ...selected, [optionName]: value };
    return product.variants.some(
      (v) => v.availableForSale && v.selectedOptions.every((o) => wanted[o.name] === o.value),
    );
  }

  return (
    <div>
      <div className="flex items-baseline gap-3">
        <span className="text-4xl font-extrabold">{formatPrice(price)}</span>
        {off > 0 && variant?.compareAtPrice && (
          <>
            <span className="text-lg text-muted line-through">{formatPrice(variant.compareAtPrice)}</span>
            <span className="rounded-full bg-candy px-2 py-0.5 text-sm font-extrabold">-{off}%</span>
          </>
        )}
      </div>

      {showOptions &&
        product.options.map((option) => (
          <fieldset key={option.id} className="mt-5">
            <legend className="mb-2 font-bold">
              {option.name}: <span className="font-semibold text-muted">{selected[option.name]}</span>
            </legend>
            <div className="flex flex-wrap gap-2">
              {option.optionValues.map((value) => {
                const active = selected[option.name] === value.name;
                const inStock = isAvailable(option.name, value.name);
                return (
                  <button
                    key={value.id}
                    type="button"
                    onClick={() => setSelected((s) => ({ ...s, [option.name]: value.name }))}
                    aria-pressed={active}
                    className={`rounded-full border-2 px-4 py-2 text-sm font-bold transition ${
                      active ? "border-brand-dark bg-brand-soft text-brand-deep" : "border-line hover:border-brand"
                    } ${inStock ? "" : "text-muted line-through opacity-60"}`}
                  >
                    {value.name}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}

      <div className="mt-6 flex gap-3">
        <div className="flex items-center rounded-full border-2 border-line">
          <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="grid size-12 place-items-center text-xl font-bold" aria-label="Restar uno">
            −
          </button>
          <span className="w-8 text-center text-lg font-bold tabular-nums" aria-live="polite">{quantity}</span>
          <button type="button" onClick={() => setQuantity((q) => q + 1)} className="grid size-12 place-items-center text-xl font-bold" aria-label="Sumar uno">
            +
          </button>
        </div>
        <AddToCartButton variantId={variant?.id} available={available} quantity={quantity} className="flex-1" />
      </div>

      {/* Barra fija en mobile: el botón de compra siempre a mano del pulgar */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur md:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <p className="truncate text-xs text-muted">{product.title}</p>
            <p className="text-lg font-extrabold">{formatPrice(price)}</p>
          </div>
          <AddToCartButton variantId={variant?.id} available={available} quantity={quantity} className="flex-1 py-3 text-base" />
        </div>
      </div>
    </div>
  );
}
