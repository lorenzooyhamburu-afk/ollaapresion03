import type { Metadata } from "next";
import { ProductGrid } from "@/components/product/product-card";
import { SortBar } from "@/components/product/sort-bar";
import { getProducts } from "@/lib/shopify";
import { getSort } from "@/lib/sort";

type Props = { searchParams: Promise<{ q?: string; orden?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return { title: q ? `Resultados para "${q}"` : "Todos los productos", robots: { index: !q } };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = "", orden } = await searchParams;
  const sort = getSort(orden ?? (q ? "destacados" : "mas-vendidos"));
  // RELEVANCE solo tiene sentido con un término de búsqueda
  const sortKey = !q && sort.search === "RELEVANCE" ? "BEST_SELLING" : sort.search;
  const products = await getProducts({ first: 100, query: q || undefined, sortKey, reverse: sort.reverse });

  return (
    <div className="container-shop pt-8">
      <h1 className="mb-1 text-4xl font-extrabold">{q ? <>Resultados para “{q}”</> : "Todos los productos"}</h1>
      <p className="mb-5 text-sm font-semibold text-brand-deep">{products.length} productos</p>
      <SortBar basePath="/buscar" current={sort.slug} extraParams={q ? { q } : {}} />
      {products.length ? (
        <ProductGrid products={products} priorityCount={4} />
      ) : (
        <div className="py-16 text-center">
          <p className="text-5xl">🔍</p>
          <p className="mt-3 text-xl font-bold">No encontramos “{q}”</p>
          <p className="mt-1 text-muted">Probá con otra palabra, por ejemplo una marca o el tipo de golosina.</p>
        </div>
      )}
    </div>
  );
}
