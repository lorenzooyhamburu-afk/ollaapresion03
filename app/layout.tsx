import type { Metadata, Viewport } from "next";
// Fuentes self-hosted (sin depender de Google Fonts en el build ni en el navegador)
import "@fontsource-variable/baloo-2/wght.css";
import "@fontsource-variable/nunito/wght.css";
import { CartProvider } from "@/components/cart/cart-context";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { readCart } from "@/lib/cart-actions";
import { site } from "@/lib/config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} | ${site.tagline} en Moreno`, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: { type: "website", locale: "es_AR", siteName: site.name, images: ["/logo.png"] },
  icons: { icon: "/logo.png" },
};

export const viewport: Viewport = { themeColor: "#2e9e44" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cart = await readCart();

  return (
    <html lang="es-AR">
      <body className="min-h-dvh antialiased">
        <CartProvider initialCart={cart}>
          <Header />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}
