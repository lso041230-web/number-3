"use client";

import { FormEvent } from "react";

type MoodInputProps = {
  value: string;
  loading: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export function MoodInput({ value, loading, onChange, onSubmit }: MoodInputProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    onSubmit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-calm backdrop-blur sm:p-6"
    >
      <label htmlFor="mood" className="mb-3 block text-sm font-medium text-slate-600">
        지금의 분위기를 한 줄로 적어주세요.
      </label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          id="mood"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={100}
          placeholder="예: 새벽의 외로움"
          className="h-14 w-full rounded-2xl border border-slate-200 px-5 text-lg outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="h-14 min-w-28 rounded-2xl bg-slate-900 px-6 text-base font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {loading ? "생성 중..." : "보내기"}
        </button>
      </div>
      <p className="mt-3 text-right text-sm text-slate-400">{value.length}/100</p>
    </form>
  );
}
