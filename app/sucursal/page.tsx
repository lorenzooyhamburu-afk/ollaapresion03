import type { Metadata } from "next";
import Link from "next/link";
import { site, store } from "@/lib/config";

export const metadata: Metadata = {
  title: "Golosinería en Moreno centro: dirección y horarios",
  description: `Visitanos en ${store.city} centro o comprá online y retirá gratis. Golosinas, juguetes y bebidas.`,
  alternates: { canonical: "/sucursal" },
};

export default function StorePage() {
  // SEO local: Google usa estos datos para "golosinería cerca de mí" y "golosinería en Moreno"
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: store.name,
    url: site.url,
    image: `${site.url}/logo.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: store.street,
      addressLocality: store.city,
      addressRegion: store.region,
      postalCode: store.postalCode,
      addressCountry: store.country,
    },
    ...(site.whatsapp ? { telephone: `+${site.whatsapp}` } : {}),
  };

  return (
    <div className="container-shop pt-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="text-4xl font-extrabold">Nuestro local en {store.city} centro</h1>
      <p className="mt-2 max-w-2xl text-lg text-muted">
        Comprá online y retirá gratis el mismo día, o pasá a elegir en persona.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <section className="rounded-[var(--radius-card)] bg-brand-soft p-6">
          <h2 className="text-2xl font-extrabold">📍 Dirección</h2>
          <address className="mt-3 text-lg not-italic">
            {store.street}
            <br />
            {store.city}, {store.region}
          </address>
          <a href={store.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost mt-5 bg-white">
            Abrir en Google Maps
          </a>
        </section>

        <section className="rounded-[var(--radius-card)] bg-candy-soft p-6">
          <h2 className="text-2xl font-extrabold">🕒 Horarios</h2>
          <ul className="mt-3 space-y-1 text-lg">
            {store.hours.map((h) => (
              <li key={h.days}>
                <strong>{h.days}:</strong> {h.time}
              </li>
            ))}
          </ul>
          <h3 className="mt-6 text-xl font-extrabold">¿Cómo funciona el retiro?</h3>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>Armá tu pedido y elegí “Retiro en el local” al pagar.</li>
            <li>Te avisamos cuando está listo.</li>
            <li>Pasás a buscarlo, sin costo de envío.</li>
          </ol>
        </section>
      </div>

      <div className="mt-8 text-center">
        <Link href="/buscar?orden=mas-vendidos" className="btn-action text-lg">
          Empezar mi pedido
        </Link>
      </div>
    </div>
  );
}
