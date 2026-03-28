import { z } from "zod";

export const COPY_STYLES = ["감성형", "직관형", "프리미엄형", "트렌디형", "미니멀형"] as const;

export const requestSchema = z.object({
  mood: z
    .string({ required_error: "분위기를 입력해 주세요." })
    .trim()
    .min(1, "분위기를 입력해 주세요.")
    .max(100, "분위기는 100자 이내로 입력해 주세요."),
});

export const copyResultSchema = z.object({
  id: z.string().min(1),
  style: z.enum(COPY_STYLES),
  headline: z.string().min(1).max(35),
  description: z.string().min(1).max(90),
});

export const generateCopyResponseSchema = z.object({
  mood: z.string().min(1),
  results: z.array(copyResultSchema).length(5),
});

export type CopyStyleTuple = typeof COPY_STYLES;
