import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Check, X, RotateCcw, Plus, LayoutDashboard } from "lucide-react";

export const Route = createFileRoute("/_authenticated/results/$attemptId")({
  head: ({ params }) => ({
    meta: [
      { title: "Quiz Results — QuizGen" },
      { name: "description", content: "Review your quiz attempt: see your score, which answers were correct, and read explanations for every question." },
      { property: "og:title", content: "Quiz Results — QuizGen" },
      { property: "og:description", content: "Your score, correct answers, and per-question explanations." },
      { property: "og:url", content: `https://lnct-tech-bharat.lovable.app/results/${params.attemptId}` },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: `https://lnct-tech-bharat.lovable.app/results/${params.attemptId}` }],
  }),
  component: ResultsPage,
});

type Row = {
  question_id: string;
  selected_option_index: number | null;
  is_correct: boolean;
  questions: {
    question_text: string;
    option_a: string; option_b: string; option_c: string; option_d: string;
    correct_answer_index: number;
    explanation: string;
    position: number;
  } | null;
};

function ResultsPage() {
  const { attemptId } = Route.useParams();
  const [attempt, setAttempt] = useState<{ score: number; quiz_id: string; quizzes: { title: string } | null } | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: a } = await supabase
        .from("attempts")
        .select("score, quiz_id, quizzes(title)")
        .eq("id", attemptId)
        .single();
      setAttempt(a as any);
      const { data: ans } = await supabase
        .from("answers")
        .select("question_id, selected_option_index, is_correct, questions(question_text, option_a, option_b, option_c, option_d, correct_answer_index, explanation, position)")
        .eq("attempt_id", attemptId);
      const sorted = (ans ?? []).slice().sort((x: any, y: any) => (x.questions?.position ?? 0) - (y.questions?.position ?? 0));
      setRows(sorted as any);
      setLoading(false);
    })();
  }, [attemptId]);

  if (loading || !attempt) return <p className="text-center text-muted-foreground">Loading results…</p>;

  const score = Number(attempt.score);
  const correct = rows.filter((r) => r.is_correct).length;
  const total = rows.length;
  const label = score >= 80 ? "Excellent" : score >= 60 ? "Good" : "Needs Improvement";
  const labelColor = score >= 80 ? "text-success" : score >= 60 ? "text-warning-foreground" : "text-destructive";

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-soft">
        <h1 className="font-display text-2xl font-bold">Quiz Results: {attempt.quizzes?.title ?? "Your attempt"}</h1>
        <p className={`mt-2 font-display text-sm font-bold uppercase tracking-widest ${labelColor}`}>{label}</p>
        <div className="mt-4">
          <span className="font-display text-7xl font-black bg-gradient-warm bg-clip-text text-transparent">{score.toFixed(0)}%</span>
        </div>
        <p className="mt-2 text-muted-foreground">{correct} out of {total} correct</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link to="/quiz/$quizId" params={{ quizId: attempt.quiz_id }}>
            <Button variant="outline"><RotateCcw className="mr-2 h-4 w-4" /> Retake</Button>
          </Link>
          <Link to="/upload">
            <Button><Plus className="mr-2 h-4 w-4" /> New Quiz</Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="ghost"><LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard</Button>
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-display text-2xl font-bold">Review</h2>
        {rows.map((r, i) => {
          const q = r.questions;
          if (!q) return null;
          const opts = [q.option_a, q.option_b, q.option_c, q.option_d];
          return (
            <div key={r.question_id} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="flex items-start gap-3">
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${r.is_correct ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"}`}>
                  {r.is_correct ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                </span>
                <div className="flex-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Question {i + 1}</p>
                  <p className="mt-1 font-display text-lg font-bold leading-snug">{q.question_text}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {opts.map((opt, oi) => {
                  const isCorrect = oi === q.correct_answer_index;
                  const isPicked = oi === r.selected_option_index;
                  const style = isCorrect
                    ? "border-success bg-success/10"
                    : isPicked
                    ? "border-destructive bg-destructive/10"
                    : "border-border";
                  return (
                    <div key={oi} className={`flex items-start gap-3 rounded-lg border-2 p-3 ${style}`}>
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded bg-secondary text-xs font-bold">
                        {String.fromCharCode(65 + oi)}
                      </span>
                      <span className="text-sm">{opt}</span>
                      {isCorrect && <span className="ml-auto text-xs font-bold text-success">Correct</span>}
                      {isPicked && !isCorrect && <span className="ml-auto text-xs font-bold text-destructive">Your answer</span>}
                    </div>
                  );
                })}
              </div>
              {q.explanation && (
                <div className="mt-4 rounded-lg bg-secondary/60 p-3 text-sm">
                  <span className="font-bold">Why:</span> {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
