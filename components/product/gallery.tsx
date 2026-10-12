"use client";

import Image from "next/image";
import { useState } from "react";
import type { ShopifyImage } from "@/lib/shopify/types";

export function Gallery({ images, title }: { images: ShopifyImage[]; title: string }) {
  const [index, setIndex] = useState(0);
  const current = images[index];

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-[var(--radius-card)] bg-brand-soft">
        {current ? (
          <Image
            src={current.url}
            alt={current.altText ?? title}
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-contain p-6"
          />
        ) : (
          <div className="grid h-full place-items-center text-8xl">🍬</div>
        )}
      </div>
      {images.length > 1 && (
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={img.url}
              onClick={() => setIndex(i)}
              aria-label={`Ver imagen ${i + 1}`}
              aria-current={i === index}
              className={`relative size-20 shrink-0 overflow-hidden rounded-xl border-2 bg-brand-soft ${
                i === index ? "border-brand-dark" : "border-transparent"
              }`}
            >
              <Image src={img.url} alt="" fill sizes="80px" className="object-contain p-1" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
