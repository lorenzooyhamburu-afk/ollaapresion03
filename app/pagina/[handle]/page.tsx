import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPage } from "@/lib/shopify";

// Páginas de contenido que se editan en Shopify (Tienda online → Páginas).
type Props = { params: Promise<{ handle: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await getPage((await params).handle);
  if (!page) return {};
  return { title: page.seo.title ?? page.title, description: page.seo.description ?? undefined };
}

export default async function ContentPage({ params }: Props) {
  const page = await getPage((await params).handle);
  if (!page) notFound();
  return (
    <article className="container-shop max-w-3xl pt-8">
      <h1 className="mb-6 text-4xl font-extrabold">{page.title}</h1>
      <div className="prose-product text-lg" dangerouslySetInnerHTML={{ __html: page.body }} />
    </article>
  );
}
