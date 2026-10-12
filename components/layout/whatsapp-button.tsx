import { site } from "@/lib/config";

/** Botón flotante de WhatsApp para consultas. Se oculta si no hay número. */
export function WhatsAppButton() {
  if (!site.whatsapp) return null;
  const text = encodeURIComponent("¡Hola Animate! Quiero hacer una consulta 🍉");
  return (
    <a
      href={`https://wa.me/${site.whatsapp}?text=${text}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribinos por WhatsApp"
      className="fixed bottom-24 left-4 md:bottom-5 md:left-5 z-30 grid size-14 place-items-center rounded-full bg-[#25d366] text-white shadow-lg transition hover:scale-105"
    >
      <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.1c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5 2.5 1 3 .8 3.6.7.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.6 15l-1.4 5 5.1-1.3A10 10 0 1 0 12 2z" />
      </svg>
    </a>
  );
}
