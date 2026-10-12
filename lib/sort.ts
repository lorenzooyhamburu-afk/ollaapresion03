import type { CollectionSort, ProductSort } from "./shopify/types";

export const sortOptions = [
  { slug: "destacados", label: "Destacados", collection: "COLLECTION_DEFAULT", search: "RELEVANCE", reverse: false },
  { slug: "mas-vendidos", label: "Más vendidos", collection: "BEST_SELLING", search: "BEST_SELLING", reverse: false },
  { slug: "menor-precio", label: "Menor precio", collection: "PRICE", search: "PRICE", reverse: false },
  { slug: "mayor-precio", label: "Mayor precio", collection: "PRICE", search: "PRICE", reverse: true },
  { slug: "nuevos", label: "Nuevos", collection: "CREATED", search: "CREATED_AT", reverse: true },
] as const satisfies readonly {
  slug: string;
  label: string;
  collection: CollectionSort;
  search: ProductSort;
  reverse: boolean;
}[];

export function getSort(slug?: string) {
  return sortOptions.find((s) => s.slug === slug) ?? sortOptions[0];
}
