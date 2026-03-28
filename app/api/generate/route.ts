import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { generateCopies } from "@/lib/ai";
import { requestSchema } from "@/lib/schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { mood } = requestSchema.parse(body);

    const result = await generateCopies(mood);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "잘못된 요청입니다." },
        { status: 400 },
      );
    }

    console.error("/api/generate error", error);
    return NextResponse.json(
      { error: "카피 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 500 },
    );
  }
}
