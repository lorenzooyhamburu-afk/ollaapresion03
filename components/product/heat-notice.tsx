import { hotMonths } from "@/lib/config";

/** Aviso de temporada de calor. Se muestra solo entre octubre y marzo. */
export function HeatNotice({ compact = false }: { compact?: boolean }) {
  const month = new Date().getMonth();
  if (!hotMonths.includes(month)) return null;

  return (
    <div className="flex items-start gap-3 rounded-2xl bg-candy-soft p-3 text-sm">
      <span className="text-xl" aria-hidden>☀️</span>
      <p>
        <strong>Temporada de calor:</strong>{" "}
        {compact
          ? "para chocolates te recomendamos retiro en el local o envío en el día."
          : "los chocolates viajan mejor con retiro en el local o envío en el día dentro de Moreno y zona oeste."}
      </p>
    </div>
  );
}

export function isChocolate(text: string) {
  return /chocolat|bomb[oó]n|alfajor|ba[ñn]ad/i.test(text);
}
