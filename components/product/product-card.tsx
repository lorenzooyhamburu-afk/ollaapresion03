import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import type { Product } from "@/lib/shopify/types";
import { discountPercent, formatPrice } from "@/lib/utils";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const price = product.priceRange.minVariantPrice;
  const hasVariants = product.variants.length > 1;
  const firstAvailable = product.variants.find((v) => v.availableForSale) ?? product.variants[0];
  const off = discountPercent(price, firstAvailable?.compareAtPrice);
  const isNew = product.tags.some((t) => t.toLowerCase() === "nuevo");

  return (
    <article className="group flex flex-col">
      <Link href={`/producto/${product.handle}`} className="flex flex-1 flex-col">
        <div className="relative aspect-square overflow-hidden rounded-[var(--radius-card)] bg-brand-soft">
          {product.featuredImage ? (
            <Image
              src={product.featuredImage.url}
              alt={product.featuredImage.altText ?? product.title}
              fill
              priority={priority}
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="grid h-full place-items-center text-5xl">🍬</div>
          )}
          <div className="absolute left-2 top-2 flex flex-col gap-1">
            {off > 0 && (
              <span className="rounded-full bg-candy px-2 py-0.5 text-xs font-extrabold text-ink">-{off}%</span>
            )}
            {isNew && (
              <span className="rounded-full bg-brand px-2 py-0.5 text-xs font-extrabold text-ink">Nuevo</span>
            )}
          </div>
          {!product.availableForSale && (
            <span className="absolute inset-x-2 bottom-2 rounded-full bg-white/90 py-1 text-center text-xs font-bold text-muted">
              Sin stock
            </span>
          )}
        </div>

        <h3 className="mt-2 line-clamp-2 font-sans text-sm font-bold leading-snug sm:text-base">{product.title}</h3>
        <p className="mt-1 flex items-baseline gap-2">
          <span className="text-lg font-extrabold">
            {hasVariants && Number(product.priceRange.maxVariantPrice.amount) > Number(price.amount) && (
              <span className="text-xs font-semibold text-muted">desde </span>
            )}
            {formatPrice(price)}
          </span>
          {off > 0 && firstAvailable?.compareAtPrice && (
            <span className="text-sm text-muted line-through">{formatPrice(firstAvailable.compareAtPrice)}</span>
          )}
        </p>
      </Link>

      {/* Compra directa desde la grilla: en golosinas casi nadie entra a la ficha */}
      <div className="mt-2">
        {hasVariants ? (
          <Link href={`/producto/${product.handle}`} className="btn-ghost w-full px-3 py-2 text-sm">
            Elegir opción
          </Link>
        ) : (
          <AddToCartButton variantId={firstAvailable?.id} available={product.availableForSale} size="grid" />
        )}
      </div>
    </article>
  );
}

export function ProductGrid({ products, priorityCount = 0 }: { products: Product[]; priorityCount?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-5">
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < priorityCount} />
      ))}
    </div>
  );
}
