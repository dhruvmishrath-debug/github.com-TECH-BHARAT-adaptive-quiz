import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, FileText, History, TrendingUp, BookOpen } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — QuizGen" },
      { name: "description", content: "Your QuizGen dashboard: recent quizzes, average score, and quick access to generate a new quiz from your notes." },
      { property: "og:title", content: "Your QuizGen Dashboard" },
      { property: "og:description", content: "See your recent quizzes and study progress at a glance." },
      { property: "og:url", content: "https://lnct-tech-bharat.lovable.app/dashboard" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://lnct-tech-bharat.lovable.app/dashboard" }],
  }),
  component: Dashboard,
});

type Quiz = { id: string; title: string; subject: string; difficulty: string; total_questions: number; created_at: string };

function Dashboard() {
  const [name, setName] = useState("");
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [avgScore, setAvgScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: user } = await supabase.auth.getUser();
      setName((user.user?.user_metadata?.name as string) ?? "there");
      const [{ data: q }, { data: a }] = await Promise.all([
        supabase.from("quizzes").select("*").order("created_at", { ascending: false }).limit(8),
        supabase.from("attempts").select("score"),
      ]);
      setQuizzes(q ?? []);
      if (a && a.length > 0) {
        setAvgScore(a.reduce((s, r) => s + Number(r.score), 0) / a.length);
      }
      setLoading(false);
    })();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold">Dashboard — Welcome back, {name.split(" ")[0]}.</h1>
          <p className="mt-1 text-muted-foreground">Ready to turn more notes into quizzes?</p>
        </div>
        <Link to="/upload">
          <Button size="lg" className="shadow-warm"><Plus className="mr-2 h-4 w-4" /> New quiz</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard icon={BookOpen} label="Quizzes generated" value={String(quizzes.length)} />
        <StatCard icon={TrendingUp} label="Average score" value={avgScore == null ? "—" : `${avgScore.toFixed(0)}%`} />
        <StatCard icon={History} label="Quick access" value="History" actionTo="/history" />
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold">Recent quizzes</h2>
          <Link to="/my-quizzes" className="text-sm font-semibold text-accent hover:underline">See all →</Link>
        </div>
        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : quizzes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center">
            <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-3 text-muted-foreground">No quizzes yet. Upload some notes to get started.</p>
            <Link to="/upload" className="mt-4 inline-block">
              <Button>Create your first quiz</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {quizzes.map((q) => (
              <Link
                key={q.id}
                to="/quiz/$quizId"
                params={{ quizId: q.id }}
                className="group rounded-2xl border border-border bg-card p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-accent/50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg font-bold leading-tight">{q.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {q.subject} · {q.difficulty} · {q.total_questions} questions
                    </p>
                  </div>
                  <span className="rounded-full bg-gradient-warm px-2.5 py-1 text-xs font-bold text-primary-foreground opacity-0 transition group-hover:opacity-100">
                    Attempt →
                  </span>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  {new Date(q.created_at).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, actionTo }: { icon: any; label: string; value: string; actionTo?: string }) {
  const inner = (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-warm text-primary-foreground shadow-warm">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="font-display text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
  return actionTo ? <Link to={actionTo}>{inner}</Link> : inner;
}
