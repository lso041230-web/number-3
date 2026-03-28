"use client";

import { useMemo, useState } from "react";
import { ChatInput } from "@/components/chat-input";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { ResultList } from "@/components/result-list";
import type { GenerateCopyResponse } from "@/types/copy";

export default function HomePage() {
  const [mood, setMood] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<GenerateCopyResponse | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const inputError = useMemo(() => {
    const trimmed = mood.trim();
    if (!trimmed) return "분위기를 입력해 주세요.";
    if (trimmed.length > 100) return "분위기는 100자 이내로 입력해 주세요.";
    return "";
  }, [mood]);

  const handleReset = () => {
    setMood("");
    setResult(null);
    setSelectedId(null);
    setError("");
    setLoading(false);
  };

  const handleGenerate = async () => {
    if (loading) return;

    const trimmed = mood.trim();
    if (!trimmed || trimmed.length > 100) {
      setError(inputError || "입력값을 확인해 주세요.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood: trimmed }),
      });

      const body = (await response.json()) as GenerateCopyResponse & { error?: string };

      if (!response.ok) {
        throw new Error(body.error || "카피 생성에 실패했습니다.");
      }

      setResult(body);
      setSelectedId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const isResultScreen = loading || Boolean(result);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 py-8">
      <section className="flex flex-1 flex-col justify-center">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">AI 카피 문구 생성기</h1>
          <p className="mt-2 text-sm text-slate-600">분위기 한 줄로, 바로 사용할 수 있는 카피 5개를 만들어 드려요.</p>
        </header>

        {!isResultScreen && (
          <>
            <ChatInput value={mood} loading={loading} onChange={setMood} onSubmit={handleGenerate} />
            {error && <ErrorState message={error} />}
          </>
        )}

        {isResultScreen && (
          <section className="flex flex-1 flex-col">
            <p className="text-sm text-slate-600">
              입력 분위기: <span className="font-semibold text-slate-900">{mood.trim()}</span>
            </p>

            {loading && <LoadingState />}

            {!loading && result && (
              <>
                <ResultList items={result.results} selectedId={selectedId} onSelect={setSelectedId} />
                <p className="mt-3 text-xs text-slate-500">카드를 탭해서 원하는 1개를 선택하세요.</p>
              </>
            )}

            {error && <ErrorState message={error} onRetry={handleGenerate} />}

            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="mt-6 h-12 w-full rounded-xl bg-slate-900 text-base font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              다시 돌아가기
            </button>
          </section>
        )}
      </section>
    </main>
  );
}
