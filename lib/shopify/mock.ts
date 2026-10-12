// Modo demo: datos de ejemplo para ver el diseño sin conectarse a Shopify.
// Se activa con SHOPIFY_MOCK=1 en .env.local. En producción, nunca.

const money = (amount: number) => ({ amount: amount.toFixed(1), currencyCode: "ARS" });
const conn = <T,>(items: T[]) => ({ edges: items.map((node) => ({ node })) });

const sample = [
  ["Alfajor triple de chocolate", 1200, 1500, "Alfajores", "nuevo"],
  ["Chupetín de frutilla x 50", 4800, null, "Caramelos", ""],
  ["Gomitas ácidas 500 g", 3900, null, "Gomitas", "nuevo"],
  ["Bombones surtidos caja x 12", 8900, 10500, "Chocolates", ""],
  ["Gaseosa lima-limón 1,5 L", 2300, null, "Bebidas", ""],
  ["Pelota saltarina luminosa", 1500, null, "Juguetes", ""],
  ["Chicles de menta x 100", 5200, null, "Chicles", ""],
  ["Turrón de maní x 25", 6100, 6900, "Turrones", ""],
] as const;

const products = sample.map(([title, price, compare, type, tag], i) => {
  const variant = {
    id: `gid://shopify/ProductVariant/${i + 1}`,
    title: "Default Title",
    availableForSale: i !== 6,
    selectedOptions: [{ name: "Title", value: "Default Title" }],
    price: money(price),
    compareAtPrice: compare ? money(compare) : null,
    image: null,
  };
  return {
    id: `gid://shopify/Product/${i + 1}`,
    handle: `producto-${i + 1}`,
    title,
    description: `${title}. Producto de ejemplo del modo demo.`,
    descriptionHtml: `<p>${title}. Producto de ejemplo del modo demo.</p>`,
    vendor: "Marca de ejemplo",
    productType: type,
    availableForSale: i !== 6,
    tags: tag ? [tag] : [],
    options: [{ id: "o1", name: "Title", optionValues: [{ id: "v1", name: "Default Title" }] }],
    priceRange: { minVariantPrice: money(price), maxVariantPrice: money(price) },
    compareAtPriceRange: { minVariantPrice: compare ? money(compare) : money(0) },
    featuredImage: null,
    images: conn([]),
    variants: conn([variant]),
    seo: { title: null, description: null },
  };
});

const collections = ["Chocolates", "Caramelos", "Gomitas", "Bebidas", "Juguetes", "Alfajores"].map((t, i) => ({
  id: `gid://shopify/Collection/${i + 1}`,
  handle: t.toLowerCase(),
  title: t,
  description: "",
  image: null,
  seo: { title: null, description: null },
}));

let lines: { variantIndex: number; quantity: number }[] = [];

function cart() {
  const ls = lines.map((l, i) => {
    const p = products[l.variantIndex];
    const v = p.variants.edges[0].node;
    return {
      id: `line-${i}`,
      quantity: l.quantity,
      cost: { totalAmount: money(Number(v.price.amount) * l.quantity) },
      merchandise: { id: v.id, title: v.title, selectedOptions: v.selectedOptions, image: null, product: { handle: p.handle, title: p.title, featuredImage: null } },
    };
  });
  const total = ls.reduce((n, l) => n + Number(l.cost.totalAmount.amount), 0);
  return {
    id: "gid://shopify/Cart/demo",
    checkoutUrl: "#checkout-demo",
    totalQuantity: ls.reduce((n, l) => n + l.quantity, 0),
    cost: { subtotalAmount: money(total), totalAmount: money(total) },
    lines: conn(ls),
  };
}

const variantIndex = (id: string) => Number(id.split("/").pop()) - 1;

export function mockResponse(query: string, variables: Record<string, any> = {}): unknown {
  const op = query.match(/(?:query|mutation)\s+(\w+)/)?.[1];
  const payload = () => ({ cart: cart(), userErrors: [] });
  switch (op) {
    case "getProduct":
      return { product: products.find((p) => p.handle === variables.handle) ?? null };
    case "getProducts":
      return { products: conn(products.slice(0, variables.first ?? 24)) };
    case "getRecommendations":
      return { productRecommendations: products.slice(0, 4) };
    case "getCollections":
      return { collections: conn(collections) };
    case "getCollectionProducts": {
      const c = collections.find((c) => c.handle === variables.handle);
      return { collection: c ? { ...c, products: conn(products) } : null };
    }
    case "getPage":
      return { page: null };
    case "getCart":
      return { cart: cart() };
    case "createCart":
    case "addToCart":
      for (const l of variables.lines) lines.push({ variantIndex: variantIndex(l.merchandiseId), quantity: l.quantity });
      return { [op === "createCart" ? "cartCreate" : "cartLinesAdd"]: payload() };
    case "updateCart":
      for (const l of variables.lines) {
        const i = Number(String(l.id).replace("line-", ""));
        if (lines[i]) lines[i].quantity = l.quantity;
      }
      return { cartLinesUpdate: payload() };
    case "removeFromCart":
      lines = lines.filter((_, i) => !variables.lineIds.includes(`line-${i}`));
      return { cartLinesRemove: payload() };
    default:
      return {};
  }
}
