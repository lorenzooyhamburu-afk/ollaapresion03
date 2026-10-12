import Link from "next/link";
import { sortOptions } from "@/lib/sort";

/** Orden por chips: funciona sin JavaScript y es cómodo con el pulgar. */
export function SortBar({ basePath, current, extraParams = {} }: { basePath: string; current: string; extraParams?: Record<string, string> }) {
  return (
    <nav aria-label="Ordenar productos" className="no-scrollbar -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      {sortOptions.map((o) => {
        const params = new URLSearchParams({ ...extraParams, orden: o.slug });
        const active = o.slug === current;
        return (
          <Link
            key={o.slug}
            href={`${basePath}?${params}`}
            scroll={false}
            aria-current={active ? "true" : undefined}
            className={`shrink-0 rounded-full border-2 px-4 py-1.5 text-sm font-bold transition ${
              active ? "border-brand-dark bg-brand-dark text-white" : "border-line hover:border-brand"
            }`}
          >
            {o.label}
          </Link>
        );
      })}
    </nav>
  );
}
