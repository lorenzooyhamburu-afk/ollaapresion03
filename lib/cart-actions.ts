"use server";

import { cookies } from "next/headers";
import { addToCart, createCart, getCart, removeFromCart, updateCart } from "./shopify";
import type { Cart } from "./shopify/types";

const CART_COOKIE = "animate_cart";

async function setCartCookie(cartId: string) {
  const store = await cookies();
  store.set(CART_COOKIE, cartId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14, // 14 días: el carrito sobrevive si vuelve otro día
  });
}

export async function readCart(): Promise<Cart | null> {
  const cartId = (await cookies()).get(CART_COOKIE)?.value;
  return cartId ? getCart(cartId) : null;
}

type Result = { cart: Cart | null; error?: string };

export async function addItemAction(merchandiseId: string, quantity = 1): Promise<Result> {
  try {
    const existing = await readCart();
    const lines = [{ merchandiseId, quantity }];
    const cart = existing ? await addToCart(existing.id, lines) : await createCart(lines);
    if (!existing) await setCartCookie(cart.id);
    return { cart };
  } catch (e) {
    console.error(e);
    return { cart: await readCart(), error: "No pudimos agregar el producto. Probá de nuevo." };
  }
}

export async function updateQuantityAction(lineId: string, quantity: number): Promise<Result> {
  try {
    const existing = await readCart();
    if (!existing) return { cart: null };
    const cart =
      quantity <= 0
        ? await removeFromCart(existing.id, [lineId])
        : await updateCart(existing.id, [{ id: lineId, quantity }]);
    return { cart };
  } catch (e) {
    console.error(e);
    return { cart: await readCart(), error: "No pudimos actualizar el carrito." };
  }
}
