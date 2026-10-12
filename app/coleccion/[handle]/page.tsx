import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/product/product-card";
import { SortBar } from "@/components/product/sort-bar";
import { getCollectionWithProducts } from "@/lib/shopify";
import { getSort } from "@/lib/sort";

type Props = {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ orden?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const data = await getCollectionWithProducts(handle, { first: 1 });
  if (!data) return {};
  const { collection } = data;
  return {
    title: collection.seo.title ?? collection.title,
    description: collection.seo.description ?? (collection.description || undefined),
    alternates: { canonical: `/coleccion/${handle}` },
  };
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const { handle } = await params;
  const sort = getSort((await searchParams).orden);
  const data = await getCollectionWithProducts(handle, { sortKey: sort.collection, reverse: sort.reverse });
  if (!data) notFound();
  const { collection, products } = data;

  return (
    <div className="container-shop pt-8">
      <header className="mb-5">
        <h1 className="text-4xl font-extrabold">{collection.title}</h1>
        {collection.description && <p className="mt-2 max-w-2xl text-muted">{collection.description}</p>}
        <p className="mt-1 text-sm font-semibold text-brand-deep">{products.length} productos</p>
      </header>
      <SortBar basePath={`/coleccion/${handle}`} current={sort.slug} />
      {products.length ? (
        <ProductGrid products={products} priorityCount={4} />
      ) : (
        <p className="py-16 text-center text-muted">Esta categoría todavía no tiene productos.</p>
      )}
    </div>
  );
}
