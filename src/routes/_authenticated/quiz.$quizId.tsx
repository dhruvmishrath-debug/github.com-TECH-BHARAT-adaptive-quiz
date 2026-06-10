import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { submitQuiz } from "@/lib/quiz.functions";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Clock, ChevronLeft, ChevronRight, Check } from "lucide-react";

export const Route = createFileRoute("/_authenticated/quiz/$quizId")({
  head: ({ params }) => ({
    meta: [
      { title: "Take Quiz — QuizGen" },
      { name: "description", content: "Answer your AI-generated quiz one question at a time, then submit to get instant scoring and explanations for every answer." },
      { property: "og:title", content: "Take Your QuizGen Quiz" },
      { property: "og:description", content: "Adaptive multiple-choice quiz with instant scoring and answer explanations." },
      { property: "og:url", content: `https://lnct-tech-bharat.lovable.app/quiz/${params.quizId}` },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: `https://lnct-tech-bharat.lovable.app/quiz/${params.quizId}` }],
  }),
  component: QuizPage,
});

type Q = {
  id: string;
  position: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
};

function QuizPage() {
  const { quizId } = Route.useParams();
  const router = useRouter();
  const submit = useServerFn(submitQuiz);
  const [quiz, setQuiz] = useState<{ title: string; difficulty: string; subject: string } | null>(null);
  const [questions, setQuestions] = useState<Q[]>([]);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [idx, setIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const start = useRef(Date.now());

  useEffect(() => {
    (async () => {
      const [{ data: q }, { data: qs }] = await Promise.all([
        supabase.from("quizzes").select("title, difficulty, subject").eq("id", quizId).single(),
        supabase.from("questions").select("id, position, question_text, option_a, option_b, option_c, option_d").eq("quiz_id", quizId).order("position"),
      ]);
      if (q) setQuiz(q);
      if (qs) setQuestions(qs);
    })();
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - start.current) / 1000)), 1000);
    return () => clearInterval(t);
  }, [quizId]);

  const total = questions.length;
  const current = questions[idx];
  const opts = useMemo(() => current ? [current.option_a, current.option_b, current.option_c, current.option_d] : [], [current]);
  const selected = current ? answers[current.id] ?? null : null;
  const answeredCount = Object.values(answers).filter((v) => v !== undefined && v !== null).length;

  async function handleSubmit() {
    if (!total) return;
    setSubmitting(true);
    try {
      const payload = questions.map((q) => ({ questionId: q.id, selectedIndex: answers[q.id] ?? null }));
      const { attemptId } = await submit({ data: { quizId, answers: payload, timeTakenSeconds: elapsed } });
      router.navigate({ to: "/results/$attemptId", params: { attemptId } });
    } catch (err: any) {
      toast.error(err.message ?? "Could not submit");
    } finally {
      setSubmitting(false);
    }
  }

  if (!quiz || !current) {
    return <p className="text-center text-muted-foreground">Loading quiz…</p>;
  }

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">{quiz.title}</h1>
          <p className="text-sm text-muted-foreground">{quiz.subject} · {quiz.difficulty}</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-semibold shadow-soft">
          <Clock className="h-4 w-4 text-accent" />
          {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </div>
      </div>

      <div className="mb-4">
        <div className="mb-2 flex justify-between text-xs text-muted-foreground">
          <span>Question {idx + 1} of {total}</span>
          <span>{answeredCount}/{total} answered</span>
        </div>
        <Progress value={((idx + 1) / total) * 100} />
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft md:p-8">
        <p className="text-xs font-bold uppercase tracking-wider text-accent">Question {idx + 1}</p>
        <h2 className="mt-2 font-display text-2xl font-bold leading-snug">{current.question_text}</h2>

        <div className="mt-6 space-y-2.5">
          {opts.map((opt, i) => {
            const isSelected = selected === i;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setAnswers({ ...answers, [current.id]: i })}
                className={`flex w-full items-start gap-3 rounded-xl border-2 p-4 text-left transition ${
                  isSelected ? "border-accent bg-accent/10" : "border-border bg-background hover:border-accent/40"
                }`}
              >
                <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg font-bold ${
                  isSelected ? "bg-gradient-warm text-primary-foreground" : "bg-secondary text-secondary-foreground"
                }`}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-sm leading-relaxed">{opt}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Button variant="outline" onClick={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0}>
          <ChevronLeft className="mr-1 h-4 w-4" /> Previous
        </Button>
        {idx === total - 1 ? (
          <Button className="shadow-warm" onClick={handleSubmit} disabled={submitting}>
            <Check className="mr-2 h-4 w-4" /> {submitting ? "Submitting…" : "Submit Quiz"}
          </Button>
        ) : (
          <Button onClick={() => setIdx(Math.min(total - 1, idx + 1))}>
            Next <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
