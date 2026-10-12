// Configuración del negocio. Todo lo que no viene de Shopify se edita acá.

export const site = {
  name: "Animate Golosinería",
  tagline: "Golosinas, juguetes y bebidas",
  description:
    "Golosinas, juguetes y bebidas sin alcohol. Comprá online y retirá gratis en nuestro local de Moreno centro o recibilo en tu casa.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  whatsapp: "5491176125358", // sin + ni espacios. Vacío = se oculta el botón.
  instagram: "", // ej: "https://instagram.com/animategolosineria"
};

// Datos del local físico. Completar con los datos reales.
export const store = {
  name: "Animate Golosinería – Moreno centro",
  street: "Completar dirección",
  city: "Moreno",
  region: "Buenos Aires",
  postalCode: "1744",
  country: "AR",
  hours: [
    { days: "Lunes a sábado", time: "9:00 a 20:00" },
    { days: "Domingos", time: "10:00 a 14:00" },
  ],
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Moreno+centro+Buenos+Aires",
};

export const shipping = {
  freeShippingThreshold: Number(process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD ?? 30000),
  options: [
    { title: "Retiro gratis en el local", detail: "Moreno centro · listo en el día" },
    { title: "Envío en el día", detail: "Moreno y zona oeste" },
    { title: "Envío a todo el país", detail: "Por correo, con seguimiento" },
  ],
};

// Accesos rápidos de la home. Cada uno apunta a una colección de Shopify:
// creá colecciones con estos "handles" (o cambialos por los que ya tengas).
export const shortcuts = [
  { title: "Golosinas", handle: "golosinas", emoji: "🍬", tone: "pink" },
  { title: "Combos", handle: "combos", emoji: "🛍️", tone: "green" },
  { title: "Para regalar", handle: "regalos", emoji: "🎁", tone: "pink" },
  { title: "Juguetes", handle: "juguetes", emoji: "🧸", tone: "green" },
  { title: "Bebidas", handle: "bebidas", emoji: "🥤", tone: "pink" },
  { title: "Chocolates", handle: "chocolates", emoji: "🍫", tone: "green" },
] as const;

// Meses de calor (0 = enero). En estos meses se muestra el aviso sobre chocolates.
export const hotMonths = [0, 1, 2, 9, 10, 11];

// Cómo se cierran las compras:
//  "whatsapp" → el cliente envía el pedido por WhatsApp y el pago se coordina con el local.
//  "both"     → WhatsApp + botón de pago online con el checkout de Shopify.
//  "online"   → solo pago online con el checkout de Shopify.
export const checkout: { mode: "whatsapp" | "both" | "online" } = { mode: "whatsapp" };
