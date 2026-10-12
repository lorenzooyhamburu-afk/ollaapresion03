import "server-only";
import {
  addToCartMutation,
  createCartMutation,
  getCartQuery,
  getCollectionProductsQuery,
  getCollectionsQuery,
  getProductQuery,
  getProductsQuery,
  getPageQuery,
  getRecommendationsQuery,
  removeFromCartMutation,
  updateCartMutation,
} from "./queries";
import type {
  Cart,
  Collection,
  CollectionSort,
  Connection,
  Product,
  ProductSort,
  ShopifyCart,
  ShopifyProduct,
} from "./types";

const domain = process.env.SHOPIFY_STORE_DOMAIN?.replace(/^https?:\/\//, "").replace(/\/$/, "");
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const apiVersion = process.env.SHOPIFY_API_VERSION ?? "2026-07";
const endpoint = `https://${domain}/api/${apiVersion}/graphql.json`;

// El catálogo se cachea 5 minutos y además se invalida al instante
// con el webhook de /api/revalidate cuando cambia algo en Shopify.
const CATALOG_REVALIDATE = 300;

type FetchOptions = {
  query: string;
  variables?: Record<string, unknown>;
  cache?: "catalog" | "no-store";
};

export class ShopifyError extends Error {}

export async function shopifyFetch<T>({ query, variables, cache = "catalog" }: FetchOptions): Promise<T> {
  if (process.env.SHOPIFY_MOCK === "1" && process.env.NODE_ENV !== "production") {
    const { mockResponse } = await import("./mock");
    return mockResponse(query, variables) as T;
  }

  if (!domain || !token) {
    throw new ShopifyError("Faltan SHOPIFY_STORE_DOMAIN o SHOPIFY_STOREFRONT_ACCESS_TOKEN en el .env.local");
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    ...(cache === "no-store"
      ? { cache: "no-store" as const }
      : { next: { revalidate: CATALOG_REVALIDATE, tags: ["shopify"] } }),
  });

  const body = await res.json().catch(() => null);

  if (!res.ok || !body || body.errors) {
    const message = body?.errors?.[0]?.message ?? `HTTP ${res.status}`;
    throw new ShopifyError(`Shopify Storefront API: ${message}`);
  }

  return body.data as T;
}

/** Envuelve una lectura de catálogo para que la tienda no se caiga si Shopify falla. */
async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.error(error);
    return fallback;
  }
}

const nodes = <T>(c: Connection<T>) => c.edges.map((e) => e.node);

function reshapeProduct(p: ShopifyProduct): Product {
  return { ...p, images: nodes(p.images), variants: nodes(p.variants) };
}

function reshapeCart(c: ShopifyCart): Cart {
  return { ...c, lines: nodes(c.lines) };
}

// ---------- Productos ----------

export async function getProduct(handle: string): Promise<Product | null> {
  return safe(async () => {
    const data = await shopifyFetch<{ product: ShopifyProduct | null }>({
      query: getProductQuery,
      variables: { handle },
    });
    return data.product ? reshapeProduct(data.product) : null;
  }, null);
}

export async function getProducts(opts: {
  first?: number;
  sortKey?: ProductSort;
  reverse?: boolean;
  query?: string;
} = {}): Promise<Product[]> {
  return safe(async () => {
    const data = await shopifyFetch<{ products: Connection<ShopifyProduct> }>({
      query: getProductsQuery,
      variables: { first: opts.first ?? 24, sortKey: opts.sortKey, reverse: opts.reverse, query: opts.query },
      cache: opts.query ? "no-store" : "catalog",
    });
    return nodes(data.products).map(reshapeProduct);
  }, []);
}

export async function getRecommendations(productId: string): Promise<Product[]> {
  return safe(async () => {
    const data = await shopifyFetch<{ productRecommendations: ShopifyProduct[] | null }>({
      query: getRecommendationsQuery,
      variables: { productId },
    });
    return (data.productRecommendations ?? []).map(reshapeProduct);
  }, []);
}

// ---------- Colecciones ----------

export async function getCollections(first = 20): Promise<Collection[]> {
  return safe(async () => {
    const data = await shopifyFetch<{ collections: Connection<Collection> }>({
      query: getCollectionsQuery,
      variables: { first },
    });
    // "frontpage" es la colección interna de Shopify para la home: no la mostramos.
    return nodes(data.collections).filter((c) => c.handle !== "frontpage");
  }, []);
}

export async function getCollectionWithProducts(
  handle: string,
  opts: { sortKey?: CollectionSort; reverse?: boolean; first?: number } = {},
): Promise<{ collection: Collection; products: Product[] } | null> {
  return safe(async () => {
    const data = await shopifyFetch<{
      collection: (Collection & { products: Connection<ShopifyProduct> }) | null;
    }>({
      query: getCollectionProductsQuery,
      variables: { handle, first: opts.first ?? 100, sortKey: opts.sortKey, reverse: opts.reverse },
    });
    if (!data.collection) return null;
    const { products, ...collection } = data.collection;
    return { collection, products: nodes(products).map(reshapeProduct) };
  }, null);
}

// ---------- Carrito (nunca se cachea) ----------

type CartPayload = { cart: ShopifyCart | null; userErrors: { message: string }[] };

function unwrapCart(payload: CartPayload): Cart {
  if (payload.userErrors.length) throw new ShopifyError(payload.userErrors[0].message);
  if (!payload.cart) throw new ShopifyError("Shopify no devolvió el carrito");
  return reshapeCart(payload.cart);
}

export async function getCart(cartId: string): Promise<Cart | null> {
  return safe(async () => {
    const data = await shopifyFetch<{ cart: ShopifyCart | null }>({
      query: getCartQuery,
      variables: { cartId },
      cache: "no-store",
    });
    return data.cart ? reshapeCart(data.cart) : null;
  }, null);
}

export async function createCart(lines: { merchandiseId: string; quantity: number }[]): Promise<Cart> {
  const data = await shopifyFetch<{ cartCreate: CartPayload }>({
    query: createCartMutation,
    variables: { lines },
    cache: "no-store",
  });
  return unwrapCart(data.cartCreate);
}

export async function addToCart(cartId: string, lines: { merchandiseId: string; quantity: number }[]) {
  const data = await shopifyFetch<{ cartLinesAdd: CartPayload }>({
    query: addToCartMutation,
    variables: { cartId, lines },
    cache: "no-store",
  });
  return unwrapCart(data.cartLinesAdd);
}

export async function updateCart(cartId: string, lines: { id: string; quantity: number }[]) {
  const data = await shopifyFetch<{ cartLinesUpdate: CartPayload }>({
    query: updateCartMutation,
    variables: { cartId, lines },
    cache: "no-store",
  });
  return unwrapCart(data.cartLinesUpdate);
}

export async function removeFromCart(cartId: string, lineIds: string[]) {
  const data = await shopifyFetch<{ cartLinesRemove: CartPayload }>({
    query: removeFromCartMutation,
    variables: { cartId, lineIds },
    cache: "no-store",
  });
  return unwrapCart(data.cartLinesRemove);
}

// ---------- Páginas ----------

export type Page = { id: string; handle: string; title: string; body: string; seo: { title: string | null; description: string | null } };

export async function getPage(handle: string): Promise<Page | null> {
  return safe(async () => {
    const data = await shopifyFetch<{ page: Page | null }>({ query: getPageQuery, variables: { handle } });
    return data.page;
  }, null);
}
