import OpenAI from "openai";
import { COPY_STYLES, generateCopyResponseSchema } from "@/lib/schema";
import type { GenerateCopyResponse } from "@/types/copy";

let client: OpenAI | null = null;

function getClient() {
  if (client) return client;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  client = new OpenAI({ apiKey });
  return client;
}

function buildPrompt(mood: string) {
  return [
    "당신은 브랜드 카피라이터입니다.",
    `입력 분위기: \"${mood}\"`,
    "요구사항:",
    "- 한국어로만 작성",
    "- 정확히 5개 결과 생성",
    "- style은 감성형, 직관형, 프리미엄형, 트렌디형, 미니멀형을 각각 1회씩 사용",
    "- headline은 짧고 인상적으로 작성",
    "- description은 한 줄 설명으로 작성",
    "- 중복 표현 금지",
    "- JSON 외 텍스트 출력 금지",
  ].join("\n");
}

export async function generateCopies(mood: string): Promise<GenerateCopyResponse> {
  const completion = await getClient().responses.create({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "system",
        content: [{ type: "input_text", text: "You are a Korean copywriter. Output valid JSON only." }],
      },
      {
        role: "user",
        content: [{ type: "input_text", text: buildPrompt(mood) }],
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "copy_response",
        strict: true,
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            mood: { type: "string" },
            results: {
              type: "array",
              minItems: 5,
              maxItems: 5,
              items: {
                type: "object",
                additionalProperties: false,
                properties: {
                  id: { type: "string" },
                  style: { type: "string", enum: [...COPY_STYLES] },
                  headline: { type: "string" },
                  description: { type: "string" },
                },
                required: ["id", "style", "headline", "description"],
              },
            },
          },
          required: ["mood", "results"],
        },
      },
    },
    temperature: 0.8,
  });

  const parsed = generateCopyResponseSchema.parse(JSON.parse(completion.output_text));

  const uniqueStyles = new Set(parsed.results.map((item) => item.style));
  if (uniqueStyles.size !== 5) {
    throw new Error("스타일이 중복되어 생성되었습니다.");
  }

  return {
    mood,
    results: parsed.results,
  };
}
