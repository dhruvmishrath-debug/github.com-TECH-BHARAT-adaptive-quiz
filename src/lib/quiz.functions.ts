import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { generateObject } from "ai";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const GenerateInput = z.object({
  notes: z.string().min(50).max(60000),
  subject: z.string().min(1).max(100),
  difficulty: z.enum(["Easy", "Medium", "Hard", "Mixed"]),
  numQuestions: z.number().int().min(3).max(20),
  title: z.string().min(1).max(200),
});

function trimToWords(text: string, max: number): string {
  const words = text.trim().split(/\s+/);
  return words.length <= max ? text : words.slice(0, max).join(" ");
}

function extractJson(raw: string): unknown {
  // Strip code fences and find first [ ... ]
  const cleaned = raw.replace(/```json|```/g, "").trim();
  const first = cleaned.indexOf("[");
  const last = cleaned.lastIndexOf("]");
  if (first === -1 || last === -1) throw new Error("AI did not return JSON array");
  return JSON.parse(cleaned.slice(first, last + 1));
}

const QuestionSchema = z.object({
  question: z.string().min(3),
  options: z.array(z.string().min(1)).length(4),
  correct_answer: z.number().int().min(0).max(3),
  explanation: z.string().default(""),
});

export const generateQuiz = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => GenerateInput.parse(input))
  .handler(async ({ data, context }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("AI is not configured. Please try again later.");

    const notes = trimToWords(data.notes, 2000);
    const gateway = createLovableAiGatewayProvider(key);

    const prompt = `Generate exactly ${data.numQuestions} multiple choice questions at ${data.difficulty} difficulty from these study notes. Each question: 4 options, exactly one correct (correct_answer is the index 0-3).

NOTES:
${notes}`;

    let questions: z.infer<typeof QuestionSchema>[];
    try {
      const { object } = await generateObject({
        model: gateway("google/gemini-3.1-flash-lite-preview"),
        schema: z.object({ questions: z.array(QuestionSchema).min(1) }),
        prompt,
      });
      questions = object.questions;
    } catch (e: any) {
      const msg = String(e?.message ?? e);
      if (msg.includes("429"))
        throw new Error("AI rate limit reached. Please wait a moment and try again.");
      if (msg.includes("402"))
        throw new Error("AI credits exhausted. Please add credits in your workspace.");
      throw new Error("Quiz generation failed, please try again.");
    }

    const { supabase, userId } = context;
    const { data: quiz, error: qErr } = await supabase
      .from("quizzes")
      .insert({
        user_id: userId,
        title: data.title,
        subject: data.subject,
        difficulty: data.difficulty,
        total_questions: questions.length,
      })
      .select()
      .single();
    if (qErr || !quiz) throw new Error(qErr?.message ?? "Failed to save quiz");

    const rows = questions.map((q, i) => ({
      quiz_id: quiz.id,
      position: i,
      question_text: q.question,
      option_a: q.options[0],
      option_b: q.options[1],
      option_c: q.options[2],
      option_d: q.options[3],
      correct_answer_index: q.correct_answer,
      explanation: q.explanation ?? "",
    }));
    const { error: qsErr } = await supabase.from("questions").insert(rows);
    if (qsErr) throw new Error(qsErr.message);

    return { quizId: quiz.id as string };
  });

const SubmitInput = z.object({
  quizId: z.string().uuid(),
  answers: z.array(
    z.object({
      questionId: z.string().uuid(),
      selectedIndex: z.number().int().min(0).max(3).nullable(),
    }),
  ),
  timeTakenSeconds: z.number().int().min(0).max(86400),
});

export const submitQuiz = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => SubmitInput.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: questions, error: qErr } = await supabase
      .from("questions")
      .select("id, correct_answer_index")
      .eq("quiz_id", data.quizId);
    if (qErr || !questions) throw new Error("Quiz not found");

    const correctMap = new Map(questions.map((q) => [q.id, q.correct_answer_index]));
    let correctCount = 0;
    for (const a of data.answers) {
      if (a.selectedIndex !== null && correctMap.get(a.questionId) === a.selectedIndex)
        correctCount++;
    }
    const score = questions.length === 0 ? 0 : (correctCount / questions.length) * 100;

    const { data: attempt, error: aErr } = await supabase
      .from("attempts")
      .insert({
        user_id: userId,
        quiz_id: data.quizId,
        score,
        time_taken_seconds: data.timeTakenSeconds,
      })
      .select()
      .single();
    if (aErr || !attempt) throw new Error(aErr?.message ?? "Failed to save attempt");

    const answerRows = data.answers.map((a) => ({
      attempt_id: attempt.id,
      question_id: a.questionId,
      selected_option_index: a.selectedIndex,
      is_correct: a.selectedIndex !== null && correctMap.get(a.questionId) === a.selectedIndex,
    }));
    if (answerRows.length > 0) {
      const { error: ansErr } = await supabase.from("answers").insert(answerRows);
      if (ansErr) throw new Error(ansErr.message);
    }

    return { attemptId: attempt.id as string };
  });

export const deleteQuiz = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ quizId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("quizzes").delete().eq("id", data.quizId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
