import { z } from "zod";

export const translateRequestSchema = z.object({
  targetLang: z.string(), // TODO : get list of lang iso strings, refer as enum
  sourceLang: z.string(),
  text: z.string().min(1),
});

export type TranslateRequest = z.infer<typeof translateRequestSchema>;

export const translateResponseSchema = z.object({
  timestamp: z.number(),
  translation: z.string(),
});

export type TranslateResponse = z.infer<typeof translateResponseSchema>;

export type TranslationDBDocument = TranslateRequest &
  TranslateResponse & {
    requestId: string;
  };
