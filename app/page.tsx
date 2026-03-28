"use client";

import { useMemo, useState } from "react";
import { ErrorState } from "@/components/error-state";
import { LoadingCards } from "@/components/loading-cards";
import { MoodInput } from "@/components/mood-input";
import { PoemGrid } from "@/components/poem-grid";
import type { GenerateResponse, PoemResult } from "@/types/poem";

const INITIAL_ERROR = "";

export default function HomePage() {
  const [mood, setMood] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(INITIAL_ERROR);
  const [data, setData] = useState<GenerateResponse | null>(null);
  const [selectedId, setSelectedId] = useState<PoemResult["id"] | null>(null);

  const inputError = useMemo(() => {
    const trimmed = mood.trim();
    if (!trimmed) return "분위기를 입력해 주세요.";
    if (trimmed.length > 100) return "100자 이내로 입력해 주세요.";
    return "";
  }, [mood]);

  const resetAll = () => {
    setMood("");
    setData(null);
    setSelectedId(null);
    setError(INITIAL_ERROR);
    setLoading(false);
  };

  const generate = async () => {
    const trimmed = mood.trim();
    if (!trimmed || trimmed.length > 100 || loading) {
      setError(inputError || "입력값을 확인해 주세요.");
      return;
    }

    setLoading(true);
    setError(INITIAL_ERROR);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood: trimmed }),
      });

      let parsedBody: unknown = null;
      try {
        parsedBody = await res.json();
      } catch {
        parsedBody = null;
      }

      if (!res.ok) {
        const errorMessage =
          typeof parsedBody === "object" &&
          parsedBody !== null &&
          "error" in parsedBody &&
          typeof (parsedBody as { error?: unknown }).error === "string"
            ? (parsedBody as { error: string }).error
            : `서버 요청 실패 (HTTP ${res.status})`;

        throw new Error(errorMessage);
      }

      if (!parsedBody || typeof parsedBody !== "object" || !("results" in parsedBody)) {
        throw new Error("서버 응답 형식이 올바르지 않습니다.");
      }

      setData(parsedBody as GenerateResponse);
      setSelectedId(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
      setError(message);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
      <div className="w-full">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-800 sm:text-4xl">Mood to Poem</h1>
          <p className="mt-3 text-base text-slate-500 sm:text-lg">
            지금 마음을 적으면 다섯 가지 결의 시적 문장으로 돌려드릴게요.
          </p>
        </header>

        {!data && (
          <section className="mx-auto flex min-h-[40vh] max-w-4xl items-center justify-center">
            <div className="w-full">
              <MoodInput value={mood} loading={loading} onChange={setMood} onSubmit={generate} />
              {error && <ErrorState message={error} onRetry={() => setError(INITIAL_ERROR)} />}
            </div>
          </section>
        )}

        {(loading || data) && (
          <section className="mx-auto mt-2 w-full max-w-6xl">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-base text-slate-600 sm:text-lg">
                입력한 분위기: <span className="font-semibold text-slate-800">{mood.trim()}</span>
              </p>
              <button
                type="button"
                onClick={resetAll}
                disabled={loading}
                className="h-12 rounded-xl border border-slate-300 px-5 text-sm font-semibold text-slate-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                다시 돌아가기
              </button>
            </div>

            {loading && <LoadingCards />}
            {!loading && data && (
              <>
                <PoemGrid items={data.results} selectedId={selectedId} onSelect={setSelectedId} />
                <p className="mt-4 text-sm text-slate-500">카드를 눌러 하나만 선택할 수 있어요.</p>
              </>
            )}

            {error && <ErrorState message={error} onRetry={generate} />}
          </section>
        )}
      </div>
    </main>
  );
}
