import { NextResponse } from "next/server";
import { z } from "zod";
import { getOpenAIClient } from "@/lib/openai";
import { buildPoemPrompt, STYLE_GUIDE } from "@/lib/prompts";
import type { GenerateResponse } from "@/types/poem";

const requestSchema = z.object({
  mood: z
    .string({ required_error: "분위기를 입력해 주세요." })
    .trim()
    .min(1, "분위기를 입력해 주세요.")
    .max(100, "분위기는 100자 이내로 입력해 주세요."),
});

const responseSchema = z.object({
  inputMood: z.string(),
  results: z
    .array(
      z.object({
        id: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
        style: z.enum(["lyrical", "minimal", "dreamy", "warm", "impactful"]),
        title: z.string().min(1),
        text: z.string().min(1).max(250),
      }),
    )
    .length(5),
});

export async function POST(req: Request) {
  try {
    const parsed = requestSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "잘못된 요청입니다." },
        { status: 400 },
      );
    }

    const mood = parsed.data.mood;
    const client = getOpenAIClient();

    const completion = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: "당신은 한국어 시 문장 작가이며 JSON만 반환합니다.",
            },
          ],
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
          schema: {
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
                    style: {
                      type: "string",
                      enum: ["lyrical", "minimal", "dreamy", "warm", "impactful"],
                    },
                    title: { type: "string" },
                    text: { type: "string" },
                  },
                  required: ["id", "style", "title", "text"],
                },
              },
            },
            required: ["inputMood", "results"],
          },
          strict: true,
        },
      },
      temperature: 0.9,
    });

    const raw = completion.output_text;
    const parsedResponse = responseSchema.safeParse(JSON.parse(raw));

    if (!parsedResponse.success) {
      throw new Error("Model returned invalid format.");
    }

    const normalized: GenerateResponse = {
      inputMood: mood,
      results: STYLE_GUIDE.map((guide) => {
        const found = parsedResponse.data.results.find((item) => item.id === guide.id);
        return {
          id: guide.id,
          style: guide.style,
          title: guide.title,
          text: found?.text?.trim() || "",
        };
      }),
    };

    if (normalized.results.some((r) => r.text.length === 0)) {
      throw new Error("Incomplete result.");
    }

    return NextResponse.json(normalized);
  } catch (error) {
    console.error("/api/generate error", error);
    return NextResponse.json(
      { error: "시 문장을 생성하지 못했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 500 },
    );
  }
}
