"use client";

import type { PoemResult } from "@/types/poem";
import { PoemCard } from "@/components/poem-card";

type PoemGridProps = {
  items: PoemResult[];
  selectedId: PoemResult["id"] | null;
  onSelect: (id: PoemResult["id"]) => void;
};

export function PoemGrid({ items, selectedId, onSelect }: PoemGridProps) {
  return (
    <section className="mt-8 grid w-full grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <PoemCard key={item.id} item={item} selected={selectedId === item.id} onSelect={onSelect} />
      ))}
    </section>
  );
}
