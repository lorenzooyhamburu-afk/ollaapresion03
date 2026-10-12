"use client";

import { createContext, useCallback, useContext, useEffect, useState, useTransition } from "react";
import { addItemAction, updateQuantityAction } from "@/lib/cart-actions";
import type { Cart } from "@/lib/shopify/types";

type CartContextValue = {
  cart: Cart | null;
  isOpen: boolean;
  isPending: boolean;
  error: string | null;
  openCart: () => void;
  closeCart: () => void;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ initialCart, children }: { initialCart: Cart | null; children: React.ReactNode }) {
  const [cart, setCart] = useState(initialCart);
  const [isOpen, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => setCart(initialCart), [initialCart]);

  // Bloquea el scroll de la página con el carrito abierto
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const addItem = useCallback(async (variantId: string, quantity = 1) => {
    setError(null);
    const res = await addItemAction(variantId, quantity);
    setCart(res.cart);
    if (res.error) setError(res.error);
    setOpen(true); // abrir el carrito confirma la acción y muestra la barra de envío gratis
  }, []);

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    setError(null);
    // Actualización optimista: el número cambia al instante
    setCart((prev) =>
      prev
        ? {
            ...prev,
            lines: prev.lines
              .map((l) => (l.id === lineId ? { ...l, quantity } : l))
              .filter((l) => l.quantity > 0),
          }
        : prev,
    );
    startTransition(async () => {
      const res = await updateQuantityAction(lineId, quantity);
      setCart(res.cart);
      if (res.error) setError(res.error);
    });
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        isPending,
        error,
        openCart: () => setOpen(true),
        closeCart: () => setOpen(false),
        addItem,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
}
