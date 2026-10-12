import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BuyBox } from "@/components/product/buy-box";
import { Gallery } from "@/components/product/gallery";
import { HeatNotice, isChocolate } from "@/components/product/heat-notice";
import { ProductGrid } from "@/components/product/product-card";
import { shipping, site } from "@/lib/config";
import { getProduct, getRecommendations } from "@/lib/shopify";

type Props = { params: Promise<{ handle: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct((await params).handle);
  if (!product) return {};
  const img = product.featuredImage;
  return {
    title: product.seo.title ?? product.title,
    description: product.seo.description ?? product.description.slice(0, 155),
    alternates: { canonical: `/producto/${product.handle}` },
    openGraph: img ? { images: [{ url: img.url, width: img.width ?? undefined, height: img.height ?? undefined }] } : undefined,
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct((await params).handle);
  if (!product) notFound();
  const recommendations = (await getRecommendations(product.id)).slice(0, 4);
  const chocolate = isChocolate(`${product.title} ${product.productType} ${product.tags.join(" ")}`);

  // Datos estructurados para que Google muestre precio y stock en los resultados
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images.map((i) => i.url),
    brand: product.vendor ? { "@type": "Brand", name: product.vendor } : undefined,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      lowPrice: product.priceRange.minVariantPrice.amount,
      highPrice: product.priceRange.maxVariantPrice.amount,
      availability: product.availableForSale ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${site.url}/producto/${product.handle}`,
    },
  };

  return (
    <div className="container-shop pb-28 pt-6 md:pb-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <nav aria-label="Ruta" className="mb-4 text-sm text-muted">
        <Link href="/" className="hover:underline">Inicio</Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{product.title}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
        <Gallery images={product.images} title={product.title} />

        <div>
          {product.vendor && <p className="text-sm font-bold uppercase tracking-wide text-brand-deep">{product.vendor}</p>}
          <h1 className="mt-1 text-3xl font-extrabold sm:text-4xl">{product.title}</h1>

          <div className="mt-4">
            <BuyBox product={product} />
          </div>

          {/* La entrega se resuelve ANTES de agregar: es la principal duda en compras chicas */}
          <ul className="mt-6 divide-y divide-line rounded-2xl border border-line">
            {shipping.options.map((o, i) => (
              <li key={o.title} className="flex items-center gap-3 p-3 text-sm">
                <span className="text-xl" aria-hidden>{["🏪", "🛵", "📦"][i] ?? "✓"}</span>
                <span>
                  <strong>{o.title}</strong> · <span className="text-muted">{o.detail}</span>
                </span>
              </li>
            ))}
          </ul>

          {chocolate && (
            <div className="mt-4">
              <HeatNotice compact />
            </div>
          )}

          {product.descriptionHtml && (
            <section className="mt-8">
              <h2 className="mb-2 text-2xl font-extrabold">Descripción</h2>
              <div className="prose-product text-muted" dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
            </section>
          )}
        </div>
      </div>

      {recommendations.length > 0 && (
        <section className="pt-14">
          <h2 className="mb-5 text-3xl font-extrabold">Sumale a tu pedido</h2>
          <ProductGrid products={recommendations} />
        </section>
      )}
    </div>
  );
}
