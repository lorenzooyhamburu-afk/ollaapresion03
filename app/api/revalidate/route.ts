import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Webhook para Shopify: cuando cambia un producto, colección o stock,
 * Shopify llama a esta URL y el sitio se actualiza al instante.
 * Configurar en Shopify → Configuración → Notificaciones → Webhooks:
 *   https://TU-DOMINIO/api/revalidate?secret=SHOPIFY_REVALIDATION_SECRET
 */
export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!process.env.SHOPIFY_REVALIDATION_SECRET || secret !== process.env.SHOPIFY_REVALIDATION_SECRET) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, revalidated: Date.now() });
}
