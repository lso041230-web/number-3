import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { generateCopies } from "@/lib/ai";
import { COPY_STYLES, requestSchema } from "@/lib/schema";
import type { GenerateCopyResponse } from "@/types/copy";

function buildDummyResponse(mood: string): GenerateCopyResponse {
  return {
    mood,
    results: COPY_STYLES.map((style, index) => ({
      id: `dummy-${index + 1}`,
      style,
      headline: `${style} 카피 제목`,
      description: `${mood} 분위기에 맞춘 ${style} 더미 설명입니다.`,
    })),
  };
}

export async function POST(req: Request) {
  const requestId = crypto.randomUUID();

  try {
    const body = await req.json();
    const parsed = requestSchema.parse(body);
    const mood = parsed.mood.trim();
    const useDummyMode =
      process.env.USE_DUMMY_COPY === "true" || body?.useDummy === true;

    console.info("[api/generate] request received", {
      requestId,
      moodLength: mood.length,
      useDummyMode,
      timestamp: new Date().toISOString(),
    });

    if (!mood) {
      return NextResponse.json(
        { message: "분위기를 입력해 주세요." },
        { status: 400 }
      );
    }

    if (useDummyMode) {
      console.info("[api/generate] dummy mode response", { requestId });
      return NextResponse.json(buildDummyResponse(mood), { status: 200 });
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error("[api/generate] OPENAI_API_KEY missing", { requestId });
      return NextResponse.json(
        { message: "서버 설정 오류: OPENAI_API_KEY가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    const result = await generateCopies(mood);

    if (!result?.mood || !Array.isArray(result.results) || result.results.length !== 5) {
      console.error("[api/generate] invalid response shape", { requestId, result });
      return NextResponse.json(
        { message: "카피 생성 결과 형식이 올바르지 않습니다." },
        { status: 500 }
      );
    }

    console.info("[api/generate] success", {
      requestId,
      resultCount: result.results.length,
    });

    return NextResponse.json(
      { mood: result.mood, results: result.results },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      console.error("[api/generate] request validation failed", {
        requestId,
        issues: error.issues,
      });

      return NextResponse.json(
        { message: error.issues[0]?.message ?? "잘못된 요청입니다." },
        { status: 400 }
      );
    }

    console.error("[api/generate] OpenAI or server error", {
      requestId,
      error,
    });

    return NextResponse.json(
      { message: "카피 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 500 }
    );
  }
}