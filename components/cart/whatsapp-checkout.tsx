"use client";

import { useEffect, useState } from "react";
import { checkout, shipping, site } from "@/lib/config";
import type { Cart } from "@/lib/shopify/types";
import { formatPrice } from "@/lib/utils";

const deliveryOptions = [
  { id: "retiro", label: "Retiro en el local", needsAddress: false },
  { id: "local", label: "Envío en el día (Moreno y zona oeste)", needsAddress: true },
  { id: "nacional", label: "Envío a otra localidad", needsAddress: true },
] as const;

type DeliveryId = (typeof deliveryOptions)[number]["id"];

const STORAGE_KEY = "animate_datos_cliente";

/**
 * Cierre de compra por WhatsApp: el cliente completa 2 o 3 datos y se abre
 * WhatsApp con el pedido ya escrito. El pago se coordina con el local.
 */
export function WhatsAppCheckout({ cart }: { cart: Cart }) {
  const [name, setName] = useState("");
  const [delivery, setDelivery] = useState<DeliveryId>("retiro");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [showErrors, setShowErrors] = useState(false);

  // Recordamos nombre, entrega y dirección para la próxima compra
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
      if (saved.name) setName(saved.name);
      if (saved.delivery) setDelivery(saved.delivery);
      if (saved.address) setAddress(saved.address);
    } catch {}
  }, []);

  const option = deliveryOptions.find((o) => o.id === delivery)!;
  const nameMissing = !name.trim();
  const addressMissing = option.needsAddress && !address.trim();

  function buildMessage() {
    const items = cart.lines.map((l) => {
      const variant = l.merchandise.title !== "Default Title" ? ` (${l.merchandise.title})` : "";
      return `• ${l.quantity} x ${l.merchandise.product.title}${variant} — ${formatPrice(l.cost.totalAmount)}`;
    });
    return [
      "¡Hola Animate! 🍉 Quiero hacer este pedido:",
      "",
      ...items,
      "",
      `*Total: ${formatPrice(cart.cost.subtotalAmount)}*`,
      "",
      `Nombre: ${name.trim()}`,
      `Entrega: ${option.label}`,
      option.needsAddress ? `Dirección: ${address.trim()}` : null,
      note.trim() ? `Nota: ${note.trim()}` : null,
    ]
      .filter((l) => l !== null)
      .join("\n");
  }

  function send() {
    if (nameMissing || addressMissing) {
      setShowErrors(true);
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ name, delivery, address }));
    } catch {}
    window.open(`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(buildMessage())}`, "_blank", "noopener");
  }

  const input =
    "w-full rounded-xl border-2 border-line bg-white px-3 py-2 text-[16px] outline-none transition focus:border-brand";

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor="wa-name" className="mb-1 block text-sm font-bold">Tu nombre</label>
        <input
          id="wa-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          className={`${input} ${showErrors && nameMissing ? "border-action" : ""}`}
        />
      </div>

      <fieldset>
        <legend className="mb-1 text-sm font-bold">¿Cómo lo recibís?</legend>
        <div className="space-y-1.5">
          {deliveryOptions.map((o) => (
            <label key={o.id} className={`flex cursor-pointer items-center gap-2 rounded-xl border-2 px-3 py-2 text-sm font-semibold ${delivery === o.id ? "border-brand-dark bg-brand-soft" : "border-line"}`}>
              <input type="radio" name="wa-delivery" checked={delivery === o.id} onChange={() => setDelivery(o.id)} className="accent-[var(--color-brand-dark)]" />
              {o.label}
            </label>
          ))}
        </div>
      </fieldset>

      {option.needsAddress && (
        <div>
          <label htmlFor="wa-address" className="mb-1 block text-sm font-bold">Dirección y localidad</label>
          <input
            id="wa-address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            autoComplete="street-address"
            className={`${input} ${showErrors && addressMissing ? "border-action" : ""}`}
          />
        </div>
      )}

      <div>
        <label htmlFor="wa-note" className="mb-1 block text-sm font-bold">
          Nota <span className="font-normal text-muted">(opcional)</span>
        </label>
        <input id="wa-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ej: paso a la tarde" className={input} />
      </div>

      {showErrors && (nameMissing || addressMissing) && (
        <p className="text-sm font-semibold text-action">
          {nameMissing ? "Poné tu nombre" : "Poné la dirección"} para enviar el pedido.
        </p>
      )}

      <button type="button" onClick={send} className="btn-action w-full text-lg">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.1c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5 2.5 1 3 .8 3.6.7.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.6 15l-1.4 5 5.1-1.3A10 10 0 1 0 12 2z" />
        </svg>
        Enviar pedido por WhatsApp
      </button>
      <p className="text-center text-xs text-muted">
        Te respondemos para confirmar el stock y coordinar el pago.
        {Number(cart.cost.subtotalAmount.amount) >= shipping.freeShippingThreshold && " Tu pedido tiene envío gratis."}
      </p>

      {checkout.mode === "both" && (
        <a href={cart.checkoutUrl} className="btn-ghost w-full">
          Prefiero pagar online ahora
        </a>
      )}
    </div>
  );
}
