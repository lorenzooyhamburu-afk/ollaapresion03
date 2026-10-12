export type Money = { amount: string; currencyCode: string };

export type ShopifyImage = {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
};

export type Connection<T> = { edges: { node: T }[] };

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: { name: string; value: string }[];
  price: Money;
  compareAtPrice: Money | null;
  image: ShopifyImage | null;
};

export type ProductOption = {
  id: string;
  name: string;
  optionValues: { id: string; name: string }[];
};

type ShopifyProductBase = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  vendor: string;
  productType: string;
  availableForSale: boolean;
  tags: string[];
  options: ProductOption[];
  priceRange: { minVariantPrice: Money; maxVariantPrice: Money };
  compareAtPriceRange: { minVariantPrice: Money };
  featuredImage: ShopifyImage | null;
  seo: { title: string | null; description: string | null };
};

export type ShopifyProduct = ShopifyProductBase & {
  images: Connection<ShopifyImage>;
  variants: Connection<ProductVariant>;
};

export type Product = ShopifyProductBase & {
  images: ShopifyImage[];
  variants: ProductVariant[];
};

export type Collection = {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: ShopifyImage | null;
  seo: { title: string | null; description: string | null };
};

export type CartLine = {
  id: string;
  quantity: number;
  cost: { totalAmount: Money };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: { name: string; value: string }[];
    image: ShopifyImage | null;
    product: { handle: string; title: string; featuredImage: ShopifyImage | null };
  };
};

export type ShopifyCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { subtotalAmount: Money; totalAmount: Money };
  lines: Connection<CartLine>;
};

export type Cart = Omit<ShopifyCart, "lines"> & { lines: CartLine[] };

export type CollectionSort = "COLLECTION_DEFAULT" | "BEST_SELLING" | "PRICE" | "CREATED" | "TITLE";
export type ProductSort = "RELEVANCE" | "BEST_SELLING" | "PRICE" | "CREATED_AT" | "TITLE";
