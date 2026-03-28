"use client";

import type { PoemResult } from "@/types/poem";

const styleClasses: Record<PoemResult["style"], string> = {
  lyrical: "bg-rose-50 border-rose-200",
  minimal: "bg-slate-50 border-slate-200",
  dreamy: "bg-violet-50 border-violet-200",
  warm: "bg-amber-50 border-amber-200",
  impactful: "bg-emerald-50 border-emerald-200",
};

type PoemCardProps = {
  item: PoemResult;
  selected: boolean;
  onSelect: (id: PoemResult["id"]) => void;
};

export function PoemCard({ item, selected, onSelect }: PoemCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(item.id)}
      className={`min-h-56 rounded-3xl border p-6 text-left shadow-sm transition ${styleClasses[item.style]} ${
        selected
          ? "ring-4 ring-slate-400 border-slate-500 scale-[1.01]"
          : "hover:-translate-y-0.5 hover:shadow-md"
      }`}
      aria-pressed={selected}
    >
      <p className="text-sm font-semibold tracking-wide text-slate-600">{item.title}</p>
      <p className="mt-4 whitespace-pre-line text-lg leading-relaxed text-slate-800">{item.text}</p>
      {selected && (
        <span className="mt-5 inline-block rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">
          선택됨
        </span>
      )}
    </button>
  );
}
