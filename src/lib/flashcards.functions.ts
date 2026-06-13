import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { generateObject } from "ai";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const GenerateInput = z.object({
  notes: z.string().min(20).max(60000),
  topic: z.string().min(1).max(200).default("Flashcards"),
  count: z.number().int().min(5).max(30).default(12),
});

const FlashcardSchema = z.object({
  front: z.string().min(1),
  back: z.string().min(1),
  hint: z.string().optional().default(""),
});

export type Flashcard = z.infer<typeof FlashcardSchema>;

function trimToWords(text: string, max: number): string {
  const trimmed = text.trim();
  const words = trimmed.split(/\s+/);
  return words.length <= max ? trimmed : words.slice(0, max).join(" ");
}

export const generateFlashcards = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => GenerateInput.parse(input))
  .handler(async ({ data }): Promise<{ title: string; cards: Flashcard[] }> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("AI is not configured. Please try again later.");

    const notes = trimToWords(data.notes, 2000);
    const gateway = createLovableAiGatewayProvider(key);

    const prompt = `Create exactly ${data.count} high-quality study flashcards from the notes below for active recall. Front = a clear question or term. Back = a concise, accurate answer (1-3 sentences). Optional short hint. Topic: "${data.topic}".

NOTES:
${notes}`;

    try {
      const { object } = await generateObject({
        model: gateway("google/gemini-3.1-flash-lite-preview"),
        schema: z.object({
          title: z.string().min(1).max(200),
          cards: z.array(FlashcardSchema).min(3).max(40),
        }),
        prompt,
      });
      return object;
    } catch (e: any) {
      const msg = String(e?.message ?? e);
      if (msg.includes("429"))
        throw new Error("AI rate limit reached. Please wait a moment and try again.");
      if (msg.includes("402"))
        throw new Error("AI credits exhausted. Please add credits in your workspace.");
      throw new Error("Flashcard generation failed, please try again.");
    }
  });
