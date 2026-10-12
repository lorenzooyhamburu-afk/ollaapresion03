# Animate Golosinería — tienda headless

Tienda online de **Animate Golosinería** (Moreno centro) hecha con **Next.js 16** y **Shopify Storefront API**.
Shopify maneja productos, stock, pagos y pedidos; esta web es la vitrina rápida y orientada a conversión.

## Cómo correrla en tu computadora

Necesitás **Node.js 20 o superior**.

```bash
npm install
npm run dev
```

Abrí http://localhost:3000. El archivo `.env.local` ya trae el dominio y el Storefront token de la tienda.

**Modo demo** (para ver el diseño sin Shopify): agregá `SHOPIFY_MOCK=1` al `.env.local`.

## Antes de publicar

1. **Rotar el Admin token.** El token `shpat_…` compartido en el chat da acceso total a la tienda y esta web no lo usa. Revocalo en Shopify → Configuración → Apps → Desarrollar apps.
2. **Publicar los productos en el canal headless.** En Shopify, cada producto tiene que estar disponible en el canal de ventas de la app que generó el Storefront token. Si la home dice "Todavía no hay productos", es esto.
3. **Completar `lib/config.ts`**: dirección y horarios del local, WhatsApp, Instagram.
4. **Crear las colecciones en Shopify** de los accesos rápidos de la home, con estos handles (o cambialos en `lib/config.ts`): `golosinas`, `combos`, `regalos`, `juguetes`, `bebidas`, `chocolates`. Todas las colecciones aparecen solas en el menú.
5. **Crear las páginas en Shopify** (Tienda online → Páginas) con estos handles: `envios`, `preguntas-frecuentes`, `terminos`, `arrepentimiento`. El **botón de arrepentimiento** es obligatorio en Argentina (Res. 424/2020).
6. **Configurar envíos en Shopify**: retiro en tienda (Moreno centro), tarifas locales por zona y envío nacional. El checkout los muestra solos.
7. **Logo en SVG**: el actual es un PNG chico y se ve algo borroso en pantallas grandes. Reemplazá `public/logo.png` por una versión en alta o un SVG.

## Publicar en Vercel

1. Subí el proyecto a GitHub e importalo en vercel.com.
2. Cargá las variables de `.env.example` en *Settings → Environment Variables*.
3. En Shopify → Configuración → Notificaciones → Webhooks, creá webhooks de *Actualización de producto*, *Actualización de colección* y *Actualización de nivel de inventario* apuntando a:
   `https://TU-DOMINIO/api/revalidate?secret=TU_SHOPIFY_REVALIDATION_SECRET`

## Estructura

```
app/
  page.tsx                 Home: hero, categorías, más vendidos, local, novedades
  coleccion/[handle]       Categorías con orden (más vendidos, precio, nuevos)
  producto/[handle]        Ficha: galería, variantes, compra fija en mobile, recomendados
  buscar                   Búsqueda y "ver todos"
  sucursal                 Local de Moreno con datos para SEO local
  pagina/[handle]          Páginas de contenido editadas en Shopify
  api/revalidate           Webhook para actualizar el catálogo al instante
components/
  cart/                    Carrito lateral, barra de envío gratis, botón de agregar
  product/                 Tarjeta, grilla, ficha, aviso de calor
  layout/                  Header, footer, WhatsApp
lib/
  config.ts                Datos del negocio (editar acá)
  shopify/                 Cliente de la Storefront API, queries y modo demo
  cart-actions.ts          Acciones del carrito (server actions + cookie)
```

## Design system

Paleta tomada del logo, en `app/globals.css`:

| Token | Color | Uso |
|---|---|---|
| `brand` | `#6DBE4B` | Verde lima del logo |
| `brand-dark` | `#2E9E44` | Barra superior, títulos y bordes |
| `brand-soft` | `#EEF8E8` | Fondos de sección |
| `action` | `#D6246E` | **Solo** botones de compra |
| `candy` | `#F062A0` | Badges de oferta |
| `ink` | `#1A1A1A` | Texto |

Reglas: el rosa `action` no se usa para nada que no sea comprar, y nunca va texto blanco sobre el verde lima.

## Próximos pasos del roadmap

- Armá tu caja (bundles con descuento).
- Producto de impulso dentro del carrito.
- Analítica GA4 + Meta Pixel con eventos de ecommerce y primeros tests A/B.
