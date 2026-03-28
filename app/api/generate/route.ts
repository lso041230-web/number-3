import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { STYLE_GUIDE, buildPoemPrompt } from "@/lib/prompts";
import type { GenerateResponse, PoemResult } from "@/types/poem";

const requestSchema = z.object({
  mood: z
    .string({ required_error: "분위기를 입력해 주세요." })
    .trim()
    .min(1, "분위기를 입력해 주세요.")
    .max(100, "분위기는 100자 이내로 입력해 주세요."),
});

const poemResultSchema = z.object({
  id: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  style: z.enum(["lyrical", "minimal", "dreamy", "warm", "impactful"]),
  title: z.string().min(1),
  text: z.string().min(1).max(250),
});

const responseSchema = z.object({
  inputMood: z.string().min(1),
  results: z.array(poemResultSchema).length(5),
});

const strictJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inputMood: { type: "string" },
    results: {
      type: "array",
      minItems: 5,
      maxItems: 5,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          id: { type: "integer", enum: [1, 2, 3, 4, 5] },
          style: { type: "string", enum: ["lyrical", "minimal", "dreamy", "warm", "impactful"] },
          title: { type: "string" },
          text: { type: "string", minLength: 1 },
        },
        required: ["id", "style", "title", "text"],
      },
    },
  },
  required: ["inputMood", "results"],
} as const;

function normalizeResult(mood: string, parsed: z.infer<typeof responseSchema>): GenerateResponse {
  const textById = new Map<number, string>();

  for (const item of parsed.results) {
    if (!textById.has(item.id)) {
      textById.set(item.id, item.text.trim());
    }
  }

  const results: PoemResult[] = STYLE_GUIDE.map((guide) => ({
    id: guide.id,
    style: guide.style,
    title: guide.title,
    text: textById.get(guide.id) ?? "",
  }));

  if (results.some((entry) => entry.text.length === 0)) {
    throw new Error("Incomplete result after normalization");
  }

  return {
    inputMood: mood,
    results,
  };
}

export async function POST(req: Request) {
  console.info("[api/generate] request start");

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "요청 본문이 올바른 JSON 형식이 아닙니다." }, { status: 400 });
  }

  const rawMood =
    typeof body === "object" && body !== null && "mood" in body ? (body as { mood?: unknown }).mood : "";

  const validation = requestSchema.safeParse({ mood: rawMood });
  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error.issues[0]?.message ?? "분위기 입력값을 확인해 주세요." },
      { status: 400 },
    );
  }

  const mood = validation.data.mood;
  console.info("[api/generate] sanitized mood", { mood });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("[api/generate] missing env OPENAI_API_KEY");
    return NextResponse.json({ error: "OPENAI_API_KEY is not configured" }, { status: 500 });
  }

  try {
    const client = new OpenAI({ apiKey });
    const completion = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: [{ type: "input_text", text: "당신은 한국어 시 문장 작가이며 JSON만 반환합니다." }],
        },
        {
          role: "user",
          content: [{ type: "input_text", text: buildPoemPrompt(mood) }],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "poem_response",
          strict: true,
          schema: strictJsonSchema,
        },
      },
      temperature: 0.8,
    });

    const rawOutput = completion.output_text;
    if (!rawOutput) {
      console.error("[api/generate] OpenAI raw failure: empty output_text", { responseId: completion.id });
      return NextResponse.json({ error: "OpenAI request failure: empty response from model" }, { status: 500 });
    }

    let parsedOutput: unknown;
    try {
      parsedOutput = JSON.parse(rawOutput);
    } catch (error) {
      console.error("[api/generate] JSON parse/schema validation failure", {
        stage: "json-parse",
        error,
        rawOutput,
      });
      return NextResponse.json({ error: "invalid JSON/schema from model" }, { status: 500 });
    }

    const schemaCheck = responseSchema.safeParse(parsedOutput);
    if (!schemaCheck.success) {
      console.error("[api/generate] JSON parse/schema validation failure", {
        stage: "schema-validate",
        issues: schemaCheck.error.issues,
      });
      return NextResponse.json({ error: "invalid JSON/schema from model" }, { status: 500 });
    }

    const normalized = normalizeResult(mood, schemaCheck.data);
    return NextResponse.json(normalized);
  } catch (error) {
    console.error("[api/generate] OpenAI raw failure", error);
    return NextResponse.json(
      { error: "OpenAI request failure. Please try again shortly." },
      { status: 500 },
    );
  }
}
