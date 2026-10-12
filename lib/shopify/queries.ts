const imageFragment = /* GraphQL */ `
  fragment image on Image {
    url
    altText
    width
    height
  }
`;

const productFragment = /* GraphQL */ `
  fragment product on Product {
    id
    handle
    title
    description
    descriptionHtml
    vendor
    productType
    availableForSale
    tags
    options {
      id
      name
      optionValues {
        id
        name
      }
    }
    priceRange {
      minVariantPrice { amount currencyCode }
      maxVariantPrice { amount currencyCode }
    }
    compareAtPriceRange {
      minVariantPrice { amount currencyCode }
    }
    featuredImage { ...image }
    images(first: 10) {
      edges { node { ...image } }
    }
    variants(first: 100) {
      edges {
        node {
          id
          title
          availableForSale
          selectedOptions { name value }
          price { amount currencyCode }
          compareAtPrice { amount currencyCode }
          image { ...image }
        }
      }
    }
    seo { title description }
  }
  ${imageFragment}
`;

const collectionFragment = /* GraphQL */ `
  fragment collection on Collection {
    id
    handle
    title
    description
    image { ...image }
    seo { title description }
  }
`;

const cartFragment = /* GraphQL */ `
  fragment cart on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost { totalAmount { amount currencyCode } }
          merchandise {
            ... on ProductVariant {
              id
              title
              selectedOptions { name value }
              image { ...image }
              product {
                handle
                title
                featuredImage { ...image }
              }
            }
          }
        }
      }
    }
  }
  ${imageFragment}
`;

// ---------- Productos ----------

export const getProductQuery = /* GraphQL */ `
  query getProduct($handle: String!) {
    product(handle: $handle) { ...product }
  }
  ${productFragment}
`;

export const getProductsQuery = /* GraphQL */ `
  query getProducts($first: Int!, $sortKey: ProductSortKeys, $reverse: Boolean, $query: String) {
    products(first: $first, sortKey: $sortKey, reverse: $reverse, query: $query) {
      edges { node { ...product } }
    }
  }
  ${productFragment}
`;

export const getRecommendationsQuery = /* GraphQL */ `
  query getRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) { ...product }
  }
  ${productFragment}
`;

// ---------- Colecciones ----------

export const getCollectionsQuery = /* GraphQL */ `
  query getCollections($first: Int!) {
    collections(first: $first, sortKey: UPDATED_AT, reverse: true) {
      edges { node { ...collection } }
    }
  }
  ${collectionFragment}
  ${imageFragment}
`;

export const getCollectionProductsQuery = /* GraphQL */ `
  query getCollectionProducts(
    $handle: String!
    $first: Int!
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
  ) {
    collection(handle: $handle) {
      ...collection
      products(first: $first, sortKey: $sortKey, reverse: $reverse) {
        edges { node { ...product } }
      }
    }
  }
  ${collectionFragment}
  ${productFragment}
`;

// ---------- Carrito ----------

export const getCartQuery = /* GraphQL */ `
  query getCart($cartId: ID!) {
    cart(id: $cartId) { ...cart }
  }
  ${cartFragment}
`;

export const createCartMutation = /* GraphQL */ `
  mutation createCart($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart { ...cart }
      userErrors { field message }
    }
  }
  ${cartFragment}
`;

export const addToCartMutation = /* GraphQL */ `
  mutation addToCart($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { ...cart }
      userErrors { field message }
    }
  }
  ${cartFragment}
`;

export const updateCartMutation = /* GraphQL */ `
  mutation updateCart($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { ...cart }
      userErrors { field message }
    }
  }
  ${cartFragment}
`;

export const removeFromCartMutation = /* GraphQL */ `
  mutation removeFromCart($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { ...cart }
      userErrors { field message }
    }
  }
  ${cartFragment}
`;

// ---------- Páginas (Envíos, Preguntas frecuentes, Arrepentimiento, etc.) ----------

export const getPageQuery = /* GraphQL */ `
  query getPage($handle: String!) {
    page(handle: $handle) {
      id
      handle
      title
      body
      seo { title description }
    }
  }
`;
