import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { generateObject } from "ai";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const GenerateInput = z.object({
  notes: z.string().min(50).max(60000),
  topic: z.string().min(1).max(200).default("Study Guide"),
});

function trimToWords(text: string, max: number): string {
  const trimmed = text.trim();
  const words = trimmed.split(/\s+/);
  return words.length <= max ? trimmed : words.slice(0, max).join(" ");
}

const StudyGuideSchema = z.object({
  title: z.string().min(1).max(200),
  overview: z.string().min(10),
  key_concepts: z
    .array(
      z.object({
        concept: z.string().min(1),
        explanation: z.string().min(1),
      }),
    )
    .min(1)
    .max(20),
  definitions: z
    .array(
      z.object({
        term: z.string().min(1),
        definition: z.string().min(1),
      }),
    )
    .min(1)
    .max(20),
  summary_points: z.array(z.string().min(1)).min(3).max(15),
  practice_questions: z.array(z.string().min(1)).min(3).max(10),
});

export type StudyGuide = z.infer<typeof StudyGuideSchema>;

export const generateStudyGuide = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => GenerateInput.parse(input))
  .handler(async ({ data }): Promise<StudyGuide> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("AI is not configured. Please try again later.");

    const notes = trimToWords(data.notes, 2500);
    const gateway = createLovableAiGatewayProvider(key);

    const prompt = `You are an expert study coach. Build a concise, exam-ready study guide from the notes below. Extract the most important concepts, definitions, summary bullets, and practice questions a student should review. Use the topic "${data.topic}" as the title focus.

NOTES:
${notes}`;

    try {
      const { object } = await generateObject({
        model: gateway("google/gemini-3.1-flash-lite-preview"),
        schema: StudyGuideSchema,
        prompt,
      });
      return object;
    } catch (e: any) {
      const msg = String(e?.message ?? e);
      if (msg.includes("429"))
        throw new Error("AI rate limit reached. Please wait a moment and try again.");
      if (msg.includes("402"))
        throw new Error("AI credits exhausted. Please add credits in your workspace.");
      throw new Error("Study guide generation failed, please try again.");
    }
  });
