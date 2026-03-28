"use client";

import { ResultCard } from "@/components/result-card";
import type { CopyResult } from "@/types/copy";

type ResultListProps = {
  items: CopyResult[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function ResultList({ items, selectedId, onSelect }: ResultListProps) {
  return (
    <section className="mt-5 flex flex-col gap-3" aria-label="생성된 카피 리스트">
      {items.map((item) => (
        <ResultCard
          key={item.id}
          item={item}
          selected={selectedId === item.id}
          onSelect={onSelect}
        />
      ))}
    </section>
  );
}
