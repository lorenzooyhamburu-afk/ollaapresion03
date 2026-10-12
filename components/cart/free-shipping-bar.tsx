import { shipping } from "@/lib/config";
import { formatPrice } from "@/lib/utils";

export function FreeShippingBar({ subtotal }: { subtotal: number }) {
  const goal = shipping.freeShippingThreshold;
  const missing = Math.max(goal - subtotal, 0);
  const progress = Math.min((subtotal / goal) * 100, 100);

  return (
    <div className="rounded-2xl bg-brand-soft p-3">
      <p className="text-sm font-semibold text-brand-deep">
        {missing > 0 ? (
          <>
            Te faltan <strong>{formatPrice(missing)}</strong> para el <strong>envío gratis</strong> 🚚
          </>
        ) : (
          <>¡Listo! Tu pedido tiene <strong>envío gratis</strong> 🎉</>
        )}
      </p>
      <div
        className="mt-2 h-2.5 overflow-hidden rounded-full bg-white"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
        aria-label="Progreso hacia el envío gratis"
      >
        <div className="h-full rounded-full bg-brand transition-[width] duration-500" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
