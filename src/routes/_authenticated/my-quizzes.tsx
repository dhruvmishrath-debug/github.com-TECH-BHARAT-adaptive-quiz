import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { deleteQuiz } from "@/lib/quiz.functions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2, Play } from "lucide-react";

export const Route = createFileRoute("/_authenticated/my-quizzes")({
  head: () => ({
    meta: [
      { title: "My Quizzes — QuizGen" },
      {
        name: "description",
        content:
          "Manage all the quizzes you've generated on QuizGen — replay them, view scores, or delete ones you no longer need.",
      },
      { property: "og:title", content: "My QuizGen Library" },
      {
        property: "og:description",
        content: "All the quizzes you've generated, ready to replay anytime.",
      },
      { property: "og:url", content: "https://lnct-tech-bharat.lovable.app/my-quizzes" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://lnct-tech-bharat.lovable.app/my-quizzes" }],
  }),
  component: MyQuizzesPage,
});

type Row = {
  id: string;
  title: string;
  subject: string;
  difficulty: string;
  total_questions: number;
  created_at: string;
  attempts: { score: number }[];
};

function MyQuizzesPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const del = useServerFn(deleteQuiz);

  async function load() {
    const { data } = await supabase
      .from("quizzes")
      .select("id, title, subject, difficulty, total_questions, created_at, attempts(score)")
      .order("created_at", { ascending: false });
    setRows((data as any) ?? []);
  }
  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this quiz and all its attempts?")) return;
    try {
      await del({ data: { quizId: id } });
      toast.success("Quiz deleted");
      setRows((r) => r.filter((x) => x.id !== id));
    } catch (err: any) {
      toast.error(err.message ?? "Could not delete");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">My quizzes</h1>
          <p className="text-muted-foreground">All the quizzes you've created.</p>
        </div>
        <Link to="/upload">
          <Button>New quiz</Button>
        </Link>
      </div>

      {rows.length === 0 ? (
        <p className="text-muted-foreground">No quizzes yet.</p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {rows.map((q) => {
            const avg =
              q.attempts.length > 0
                ? q.attempts.reduce((s, a) => s + Number(a.score), 0) / q.attempts.length
                : null;
            return (
              <div key={q.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg font-bold">{q.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {q.subject} · {q.difficulty} · {q.total_questions} questions
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {q.attempts.length} attempt{q.attempts.length === 1 ? "" : "s"}
                  </span>
                  <span>{avg == null ? "—" : `Avg ${avg.toFixed(0)}%`}</span>
                </div>
                <div className="mt-4 flex gap-2">
                  <Link to="/quiz/$quizId" params={{ quizId: q.id }} className="flex-1">
                    <Button className="w-full" size="sm">
                      <Play className="mr-1 h-4 w-4" /> Attempt
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    aria-label="Delete quiz"
                    onClick={() => handleDelete(q.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
