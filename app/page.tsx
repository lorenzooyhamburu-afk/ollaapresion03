import Image from "next/image";
import Link from "next/link";
import { ProductGrid } from "@/components/product/product-card";
import { HeatNotice } from "@/components/product/heat-notice";
import { ViewCartButton } from "@/components/cart/view-cart-button";
import { checkout, shipping, shortcuts, store } from "@/lib/config";
import { getCollections, getProducts } from "@/lib/shopify";
import { formatPrice } from "@/lib/utils";

export default async function HomePage() {
  const [bestSellers, newest, collections] = await Promise.all([
    getProducts({ first: 8, sortKey: "BEST_SELLING" }),
    getProducts({ first: 8, sortKey: "CREATED_AT", reverse: true }),
    getCollections(8),
  ]);

  return (
    <>
      {/* HERO: propuesta de valor + acción en el primer pantallazo */}
      <section className="relative overflow-hidden bg-brand-soft">
        <div aria-hidden className="absolute -right-24 -top-24 size-80 rounded-full bg-candy-soft" />
        <div aria-hidden className="absolute -bottom-32 right-40 hidden size-64 rounded-full bg-brand/20 md:block" />
        <div className="container-shop relative grid items-center gap-8 py-10 md:grid-cols-2 md:py-16">
          <div>
            <p className="inline-block rounded-full bg-white px-3 py-1 text-sm font-bold text-brand-deep">
              🍉 Golosinería en Moreno centro
            </p>
            <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl lg:text-6xl">
              Todo lo dulce, <span className="text-brand-dark">en un solo lugar.</span>
            </h1>
            <p className="mt-4 max-w-md text-lg text-muted">
              Golosinas, juguetes y bebidas para darte un gusto cuando quieras. Pedí online y retiralo hoy.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="#mas-vendidos" className="btn-action text-lg">
                Comprar ahora
              </Link>
              <ViewCartButton className="btn-ghost bg-white text-lg" />
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-brand-deep">
              <li>✓ Retiro gratis en el local</li>
              <li>✓ Envío gratis desde {formatPrice(shipping.freeShippingThreshold)}</li>
              <li>{checkout.mode === "online" ? "✓ Pago seguro" : "✓ Pedí por WhatsApp"}</li>
            </ul>
          </div>
          <div className="relative mx-auto hidden w-full max-w-md md:block">
            <Image src="/logo.png" alt="" width={311} height={195} className="w-full -rotate-3 drop-shadow-xl" priority />
          </div>
        </div>
      </section>

      <div className="container-shop pt-6">
        <HeatNotice />
      </div>

      {/* ACCESOS RÁPIDOS */}
      <section id="accesos" className="container-shop scroll-mt-32 pt-10">
        <SectionTitle title="¿Qué estás buscando?" />
        <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0 lg:grid-cols-6">
          {shortcuts.map((o) => (
            <Link
              key={o.handle}
              href={`/coleccion/${o.handle}`}
              className={`flex w-32 shrink-0 flex-col items-center gap-2 rounded-[var(--radius-card)] p-4 text-center font-extrabold transition hover:-translate-y-1 sm:w-auto ${
                o.tone === "pink" ? "bg-candy-soft" : "bg-brand-soft"
              }`}
            >
              <span className="text-4xl" aria-hidden>{o.emoji}</span>
              {o.title}
            </Link>
          ))}
        </div>
      </section>

      {collections.length > 0 && (
        <section id="categorias" className="container-shop scroll-mt-32 pt-10">
          <SectionTitle title="Categorías" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {collections.map((c) => (
              <Link
                key={c.id}
                href={`/coleccion/${c.handle}`}
                className="group relative flex aspect-[4/3] items-end overflow-hidden rounded-[var(--radius-card)] bg-brand-soft p-4"
              >
                {c.image && (
                  <Image src={c.image.url} alt="" fill sizes="(min-width: 640px) 25vw, 50vw" className="object-cover transition-transform duration-300 group-hover:scale-105" />
                )}
                <span className="relative rounded-full bg-white px-3 py-1 font-extrabold shadow-sm">{c.title}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {bestSellers.length > 0 ? (
        <section id="mas-vendidos" className="container-shop scroll-mt-32 pt-12">
          <SectionTitle title="Los más vendidos" href="/buscar?orden=mas-vendidos" />
          <ProductGrid products={bestSellers} priorityCount={4} />
        </section>
      ) : (
        <EmptyCatalog />
      )}

      {/* LOCAL: confianza + la opción de entrega que mejor convierte con ticket bajo */}
      <section className="container-shop pt-12">
        <div className="grid items-center gap-6 rounded-[var(--radius-card)] bg-brand-dark p-6 text-white md:grid-cols-[1fr_auto] md:p-10">
          <div>
            <h2 className="text-3xl font-extrabold">Pedí online, retiralo hoy</h2>
            <p className="mt-2 max-w-xl text-white/90">
              Armá tu pedido desde el celu y pasá a buscarlo por nuestro local en {store.city} centro. Sin costo de envío y sin esperas.
            </p>
          </div>
          <Link href="/sucursal" className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 font-extrabold text-brand-deep transition hover:bg-brand-soft">
            📍 Ver dirección y horarios
          </Link>
        </div>
      </section>

      {newest.length > 0 && (
        <section className="container-shop pt-12">
          <SectionTitle title="Recién llegados" href="/buscar?orden=nuevos" />
          <ProductGrid products={newest} />
        </section>
      )}
    </>
  );
}

function SectionTitle({ title, href }: { title: string; href?: string }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <h2 className="text-3xl font-extrabold">{title}</h2>
      {href && (
        <Link href={href} className="shrink-0 font-bold text-brand-deep underline-offset-4 hover:underline">
          Ver todo →
        </Link>
      )}
    </div>
  );
}

function EmptyCatalog() {
  return (
    <section className="container-shop pt-12">
      <div className="rounded-[var(--radius-card)] border-2 border-dashed border-line p-10 text-center">
        <p className="text-5xl">🍬</p>
        <h2 className="mt-3 text-2xl font-extrabold">Todavía no hay productos para mostrar</h2>
        <p className="mt-2 text-muted">
          Revisá que el dominio y el Storefront token del archivo .env.local sean correctos y que los productos estén
          publicados en el canal de ventas de la app headless.
        </p>
      </div>
    </section>
  );
}
