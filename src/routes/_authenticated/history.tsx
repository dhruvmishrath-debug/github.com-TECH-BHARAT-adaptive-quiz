import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/history")({
  head: () => ({
    meta: [
      { title: "Quiz Attempt History — QuizGen" },
      { name: "description", content: "Browse every quiz attempt you've taken on QuizGen with scores, time taken, subject and difficulty filters." },
      { property: "og:title", content: "Your QuizGen Attempt History" },
      { property: "og:description", content: "Track every quiz attempt, score, and time taken in one place." },
      { property: "og:url", content: "https://lnct-tech-bharat.lovable.app/history" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://lnct-tech-bharat.lovable.app/history" }],
  }),
  component: HistoryPage,
});

type Attempt = {
  id: string;
  score: number;
  time_taken_seconds: number;
  attempted_at: string;
  quiz_id: string;
  quizzes: { title: string; subject: string; difficulty: string } | null;
};

function HistoryPage() {
  const [rows, setRows] = useState<Attempt[]>([]);
  const [subject, setSubject] = useState<string>("all");
  const [difficulty, setDifficulty] = useState<string>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    supabase
      .from("attempts")
      .select("id, score, time_taken_seconds, attempted_at, quiz_id, quizzes(title, subject, difficulty)")
      .order("attempted_at", { ascending: false })
      .then(({ data }) => setRows((data as any) ?? []));
  }, []);

  const subjects = useMemo(() => Array.from(new Set(rows.map((r) => r.quizzes?.subject).filter(Boolean))) as string[], [rows]);

  const filtered = rows.filter((r) => {
    if (subject !== "all" && r.quizzes?.subject !== subject) return false;
    if (difficulty !== "all" && r.quizzes?.difficulty !== difficulty) return false;
    if (search && !(r.quizzes?.title ?? "").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Quiz history</h1>
        <p className="text-muted-foreground">Every attempt, every score.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Input placeholder="Search title…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Select value={subject} onValueChange={setSubject}>
          <SelectTrigger><SelectValue placeholder="Subject" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All subjects</SelectItem>
            {subjects.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger><SelectValue placeholder="Difficulty" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All difficulties</SelectItem>
            {["Easy", "Medium", "Hard", "Mixed"].map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="p-3">Quiz</th>
              <th className="p-3">Subject</th>
              <th className="p-3">Difficulty</th>
              <th className="p-3">Score</th>
              <th className="p-3">Time</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No attempts yet.</td></tr>
            ) : filtered.map((r) => {
              const m = Math.floor(r.time_taken_seconds / 60);
              const s = r.time_taken_seconds % 60;
              return (
                <tr key={r.id} className="border-t border-border hover:bg-secondary/30">
                  <td className="p-3"><Link to="/results/$attemptId" params={{ attemptId: r.id }} className="font-semibold hover:text-accent">{r.quizzes?.title ?? "—"}</Link></td>
                  <td className="p-3 text-muted-foreground">{r.quizzes?.subject ?? "—"}</td>
                  <td className="p-3 text-muted-foreground">{r.quizzes?.difficulty ?? "—"}</td>
                  <td className="p-3 font-bold">{Number(r.score).toFixed(0)}%</td>
                  <td className="p-3 text-muted-foreground">{m}m {s}s</td>
                  <td className="p-3 text-muted-foreground">{new Date(r.attempted_at).toLocaleDateString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
