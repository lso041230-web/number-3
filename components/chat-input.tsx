"use client";

import { FormEvent } from "react";

type ChatInputProps = {
  value: string;
  loading: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export function ChatInput({ value, loading, onChange, onSubmit }: ChatInputProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!loading) onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full" aria-label="분위기 입력 폼">
      <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
        <label htmlFor="mood-input" className="sr-only">
          분위기 입력
        </label>
        <div className="flex items-end gap-2">
          <input
            id="mood-input"
            name="mood"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="원하는 분위기를 입력하세요"
            maxLength={100}
            disabled={loading}
            className="h-12 flex-1 rounded-2xl border border-slate-200 px-4 text-base outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-50"
            aria-describedby="mood-help"
          />
          <button
            type="submit"
            disabled={loading}
            className="h-12 min-w-20 rounded-2xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            aria-label="카피 생성"
          >
            {loading ? "생성 중" : "전송"}
          </button>
        </div>
      </div>
      <p id="mood-help" className="mt-2 text-center text-xs text-slate-500">
        엔터 또는 전송 버튼으로 제출할 수 있어요. ({value.length}/100)
      </p>
    </form>
  );
}
