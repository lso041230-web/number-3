"use client";

import type { CopyResult } from "@/types/copy";

const styleColorMap: Record<CopyResult["style"], string> = {
  감성형: "border-rose-200 bg-rose-50",
  직관형: "border-blue-200 bg-blue-50",
  프리미엄형: "border-amber-200 bg-amber-50",
  트렌디형: "border-violet-200 bg-violet-50",
  미니멀형: "border-slate-300 bg-slate-100",
};

type ResultCardProps = {
  item: CopyResult;
  selected: boolean;
  onSelect: (id: string) => void;
};

export function ResultCard({ item, selected, onSelect }: ResultCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(item.id)}
      aria-pressed={selected}
      className={`w-full rounded-2xl border p-4 text-left transition ${styleColorMap[item.style]} ${
        selected
          ? "ring-2 ring-slate-800 ring-offset-2 ring-offset-white"
          : "hover:-translate-y-0.5 hover:shadow-md"
      }`}
    >
      <p className="text-xs font-semibold text-slate-600">{item.style}</p>
      <h3 className="mt-2 text-lg font-bold text-slate-900">{item.headline}</h3>
      <p className="mt-2 text-sm text-slate-700">{item.description}</p>
      {selected && (
        <span className="mt-3 inline-block rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">
          선택됨
        </span>
      )}
    </button>
  );
}
