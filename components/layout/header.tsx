import Image from "next/image";
import Link from "next/link";
import { CartButton } from "@/components/cart/cart-button";
import { shipping } from "@/lib/config";
import { getCollections } from "@/lib/shopify";
import { formatPrice } from "@/lib/utils";

function SearchForm({ className = "" }: { className?: string }) {
  return (
    <form action="/buscar" role="search" className={`relative ${className}`}>
      <input
        type="search"
        name="q"
        placeholder="Buscá alfajores, chupetines, juguetes…"
        aria-label="Buscar productos"
        className="w-full rounded-full border-2 border-line bg-white py-2.5 pl-11 pr-4 text-[16px] outline-none transition focus:border-brand"
      />
      <svg className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.5-3.5" />
      </svg>
    </form>
  );
}

export async function Header() {
  const collections = await getCollections(12);

  return (
    <>
      {/* Barra de anuncios: las dos razones principales para comprar acá */}
      <div className="bg-brand-dark text-white">
        <div className="container-shop flex items-center justify-center gap-x-6 py-2 text-center text-xs font-bold sm:text-sm">
          <span>🍉 Retiro gratis en Moreno centro</span>
          <span className="hidden sm:inline">🚚 Envío gratis desde {formatPrice(shipping.freeShippingThreshold)}</span>
        </div>
      </div>

      <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
        <div className="container-shop flex items-center gap-4 py-2">
          <Link href="/" aria-label="Animate Golosinería, ir al inicio" className="shrink-0">
            <Image src="/logo.png" alt="Animate Golosinas y Juguetes" width={311} height={195} priority className="h-14 w-auto md:h-16" />
          </Link>
          <SearchForm className="hidden flex-1 md:block md:max-w-xl" />
          <nav className="ml-auto flex items-center gap-1">
            <Link href="/sucursal" className="hidden rounded-full px-3 py-2 text-sm font-bold text-brand-deep hover:bg-brand-soft lg:block">
              📍 Nuestro local
            </Link>
            <CartButton />
          </nav>
        </div>

        <div className="container-shop pb-2 md:hidden">
          <SearchForm />
        </div>

        {collections.length > 0 && (
          <nav aria-label="Categorías" className="border-t border-line">
            <ul className="container-shop no-scrollbar flex gap-2 overflow-x-auto py-2">
              {collections.map((c) => (
                <li key={c.id} className="shrink-0">
                  <Link
                    href={`/coleccion/${c.handle}`}
                    className="block rounded-full px-3.5 py-1.5 text-sm font-bold text-ink transition hover:bg-brand-soft hover:text-brand-deep"
                  >
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>
    </>
  );
}
