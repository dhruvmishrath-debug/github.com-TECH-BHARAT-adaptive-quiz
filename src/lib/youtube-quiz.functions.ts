import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { generateObject } from "ai";
import { getAIProvider } from "./ai-gateway.server";

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
  const trimmed = text.trim();
  const words = trimmed.split(/\s+/);
  return words.length <= max ? trimmed : words.slice(0, max).join(" ");
}

export const generateYouTubeQuiz = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => GenerateInput.parse(input))
  .handler(async ({ data, context }) => {
    const groq = getAIProvider();
    const transcript = trimToWords(data.transcript ?? "", 2500);

    const prompt = `You are an expert study coach. Create a multiple-choice quiz to help a student review a YouTube lecture or educational video. Respond in JSON.

Video URL: ${data.url}
Video topic / title: ${data.topic}
${transcript ? `Transcript / notes from the video:\n${transcript}` : "No transcript was provided — generate questions based on the topic and what is commonly taught about it."}

Generate exactly ${data.numQuestions} questions. Each question must have 4 distinct options and a brief explanation of the correct answer. Cover the most important concepts a student should remember after watching this video.`;

    let quizResult: YouTubeQuiz;
    try {
      const { object } = await generateObject({
        model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
        mode: "tool",
        schema: QuizSchema,
        prompt,
      });
      quizResult = object;
    } catch (e: any) {
      const msg = String(e?.message ?? e);
      console.error("[generateYouTubeQuiz] AI error:", msg, e);
      if (msg.includes("429"))
        throw new Error("AI rate limit reached. Please wait a moment and try again.");
      if (msg.includes("402"))
        throw new Error("AI credits exhausted. Please add credits in your workspace.");
      throw new Error(`Quiz generation failed: ${msg}`);
    }

    // Save quiz to database so it appears in history and opens in the quiz page
    const { supabase, userId } = context;
    const { data: quiz, error: qErr } = await supabase
      .from("quizzes")
      .insert({
        user_id: userId,
        title: quizResult.title || `${data.topic} — YouTube Quiz`,
        subject: data.topic,
        difficulty: "Mixed",
        total_questions: quizResult.questions.length,
      })
      .select()
      .single();
    if (qErr || !quiz) throw new Error(qErr?.message ?? "Failed to save quiz");

    const rows = quizResult.questions.map((q, i) => ({
      quiz_id: quiz.id,
      position: i,
      question_text: q.question,
      option_a: q.options[0],
      option_b: q.options[1],
      option_c: q.options[2],
      option_d: q.options[3],
      correct_answer_index: q.correct_index,
      explanation: q.explanation ?? "",
    }));
    const { error: qsErr } = await supabase.from("questions").insert(rows);
    if (qsErr) throw new Error(qsErr.message);

    return { quizId: quiz.id as string };
  });
