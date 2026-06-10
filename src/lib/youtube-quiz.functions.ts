import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { generateObject } from "ai";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const GenerateInput = z.object({
  url: z.string().url().max(500),
  topic: z.string().min(1).max(200),
  transcript: z.string().max(60000).optional().default(""),
  numQuestions: z.number().int().min(3).max(15).default(5),
});

const QuizSchema = z.object({
  title: z.string().min(1).max(200),
  summary: z.string().min(10),
  questions: z
    .array(
      z.object({
        question: z.string().min(1),
        options: z.array(z.string().min(1)).length(4),
        correct_index: z.number().int().min(0).max(3),
        explanation: z.string().min(1),
      }),
    )
    .min(3)
    .max(15),
});

export type YouTubeQuiz = z.infer<typeof QuizSchema>;

function trimToWords(text: string, max: number): string {
  const words = text.trim().split(/\s+/);
  return words.length <= max ? text : words.slice(0, max).join(" ");
}

export const generateYouTubeQuiz = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => GenerateInput.parse(input))
  .handler(async ({ data }): Promise<YouTubeQuiz> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("AI is not configured. Please try again later.");

    const transcript = trimToWords(data.transcript ?? "", 2500);
    const gateway = createLovableAiGatewayProvider(key);

    const prompt = `You are an expert study coach. Create a multiple-choice quiz to help a student review a YouTube lecture or educational video.

Video URL: ${data.url}
Video topic / title: ${data.topic}
${transcript ? `Transcript / notes from the video:\n${transcript}` : "No transcript was provided — generate questions based on the topic and what is commonly taught about it."}

Generate exactly ${data.numQuestions} questions. Each question must have 4 distinct options and a brief explanation of the correct answer. Cover the most important concepts a student should remember after watching this video.`;

    try {
      const { object } = await generateObject({
        model: gateway("google/gemini-3.1-flash-lite-preview"),
        schema: QuizSchema,
        prompt,
      });
      return object;
    } catch (e: any) {
      const msg = String(e?.message ?? e);
      if (msg.includes("429")) throw new Error("AI rate limit reached. Please wait a moment and try again.");
      if (msg.includes("402")) throw new Error("AI credits exhausted. Please add credits in your workspace.");
      throw new Error("Quiz generation failed, please try again.");
    }
  });
