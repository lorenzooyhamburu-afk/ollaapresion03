import Link from "next/link";
import { shipping, site, store } from "@/lib/config";

export function Footer() {
  return (
    <footer className="mt-16 bg-brand-soft">
      <div className="container-shop grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-2xl font-extrabold text-brand-deep">Animate 🍉</p>
          <p className="mt-2 text-sm text-muted">{site.description}</p>
        </div>

        <div>
          <h3 className="text-lg font-extrabold">Envíos y retiro</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {shipping.options.map((o) => (
              <li key={o.title}>
                <strong>{o.title}</strong>
                <br />
                <span className="text-muted">{o.detail}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-extrabold">Nuestro local</h3>
          <address className="mt-3 text-sm not-italic">
            {store.street}
            <br />
            {store.city}, {store.region}
          </address>
          <ul className="mt-2 text-sm text-muted">
            {store.hours.map((h) => (
              <li key={h.days}>
                {h.days}: {h.time}
              </li>
            ))}
          </ul>
          <Link href="/sucursal" className="mt-3 inline-block text-sm font-bold text-brand-deep underline underline-offset-4">
            Cómo llegar
          </Link>
        </div>

        <div>
          <h3 className="text-lg font-extrabold">Ayuda</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/pagina/envios" className="hover:underline">Envíos y entregas</Link></li>
            <li><Link href="/pagina/preguntas-frecuentes" className="hover:underline">Preguntas frecuentes</Link></li>
            <li><Link href="/pagina/terminos" className="hover:underline">Términos y condiciones</Link></li>
            {/* Obligatorio en Argentina (Res. 424/2020) */}
            <li><Link href="/pagina/arrepentimiento" className="font-bold hover:underline">Botón de arrepentimiento</Link></li>
            <li>
              <a href="https://www.argentina.gob.ar/produccion/defensadelconsumidor" target="_blank" rel="noopener noreferrer" className="hover:underline">
                Defensa de las y los consumidores
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="container-shop py-4 text-xs text-muted">
          © {new Date().getFullYear()} {site.name}. Precios en pesos argentinos, IVA incluido.
        </p>
      </div>
    </footer>
  );
}
