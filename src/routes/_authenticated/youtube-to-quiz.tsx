import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { generateYouTubeQuiz, type YouTubeQuiz } from "@/lib/youtube-quiz.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Sparkles, Youtube, Check, X } from "lucide-react";

export const Route = createFileRoute("/_authenticated/youtube-to-quiz")({
  head: () => ({
    meta: [
      { title: "YouTube to Quiz Generator — QuizGen" },
      {
        name: "description",
        content:
          "AI video to quiz tool. Paste a YouTube link and turn any lecture, tutorial, or study video into a multiple-choice practice quiz in seconds.",
      },
      {
        property: "og:title",
        content: "YouTube to Quiz Generator — Turn Videos into Practice Tests",
      },
      {
        property: "og:description",
        content:
          "Convert YouTube lectures into AI-generated multiple-choice quizzes.",
      },
      { property: "og:url", content: "https://lnct-tech-bharat.lovable.app/youtube-to-quiz" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://lnct-tech-bharat.lovable.app/youtube-to-quiz" }],
  }),
  component: YouTubeToQuizPage,
});

function extractVideoId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1) || null;
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname.startsWith("/watch")) return u.searchParams.get("v");
      if (u.pathname.startsWith("/embed/")) return u.pathname.split("/")[2] ?? null;
      if (u.pathname.startsWith("/shorts/")) return u.pathname.split("/")[2] ?? null;
    }
    return null;
  } catch {
    return null;
  }
}

function YouTubeToQuizPage() {
  const generate = useServerFn(generateYouTubeQuiz);
  const [url, setUrl] = useState("");
  const [topic, setTopic] = useState("");
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState<YouTubeQuiz | null>(null);
  const [picks, setPicks] = useState<Record<number, number>>({});
  const [showAnswers, setShowAnswers] = useState(false);

  const videoId = extractVideoId(url);

  async function handleGenerate() {
    if (!url.trim() || !topic.trim()) {
      toast.error("Please enter a YouTube URL and a short topic for the video.");
      return;
    }
    if (!videoId) {
      toast.error(
        "That doesn't look like a YouTube URL. Try a youtube.com/watch or youtu.be link.",
      );
      return;
    }
    setLoading(true);
    setQuiz(null);
    setPicks({});
    setShowAnswers(false);
    try {
      const result = await generate({ data: { url, topic, transcript, numQuestions: 5 } });
      setQuiz(result);
    } catch (e: any) {
      toast.error(e?.message ?? "Could not generate the quiz.");
    } finally {
      setLoading(false);
    }
  }

  const score =
    quiz && showAnswers
      ? quiz.questions.reduce((s, q, i) => s + (picks[i] === q.correct_index ? 1 : 0), 0)
      : 0;

  return (
    <div className="space-y-8">
      <section className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-tint-pink px-3 py-1 text-xs font-bold text-foreground">
          <Youtube className="h-4 w-4 text-primary" /> AI Video Quiz
        </span>
        <h1 className="mt-4 font-display text-4xl font-black leading-tight md:text-5xl">
          Turn any <span className="text-primary">YouTube video</span> into a quiz
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Paste a YouTube lecture or tutorial link, add a short topic, and our AI builds a
          multiple-choice quiz so you can self-test what you just watched.
        </p>
      </section>

      <section className="mx-auto max-w-3xl">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="yt-url">YouTube video URL</Label>
              <Input
                id="yt-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="mt-1.5"
              />
            </div>

            {videoId && (
              <div className="overflow-hidden rounded-2xl border border-border">
                <div className="aspect-video">
                  <iframe
                    className="size-full"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title="YouTube video preview"
                    loading="lazy"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="yt-topic">Video topic or title</Label>
              <Input
                id="yt-topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Photosynthesis — Crash Course Biology #8"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="yt-transcript">Paste transcript or your notes (optional)</Label>
              <Textarea
                id="yt-transcript"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Optional but recommended. Paste the auto-generated YouTube transcript here for much sharper questions."
                rows={6}
                className="mt-1.5"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Tip: open the video on YouTube, click <strong>More → Show transcript</strong>, copy
                the text, and paste it here.
              </p>
            </div>

            <Button onClick={handleGenerate} disabled={loading} size="lg" className="rounded-xl">
              {loading ? (
                "Generating quiz…"
              ) : (
                <>
                  Generate quiz <Sparkles className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>

        {quiz && (
          <div className="mt-8 space-y-5">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
              <h2 className="font-display text-2xl font-bold">{quiz.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{quiz.summary}</p>
            </div>

            {quiz.questions.map((q, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Question {i + 1}
                </p>
                <p className="mt-1 font-display text-lg font-bold leading-snug">{q.question}</p>
                <div className="mt-3 space-y-2">
                  {q.options.map((opt, oi) => {
                    const picked = picks[i] === oi;
                    const correct = oi === q.correct_index;
                    const style = showAnswers
                      ? correct
                        ? "border-success bg-success/10"
                        : picked
                          ? "border-destructive bg-destructive/10"
                          : "border-border"
                      : picked
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50";
                    return (
                      <button
                        key={oi}
                        type="button"
                        disabled={showAnswers}
                        onClick={() => setPicks((p) => ({ ...p, [i]: oi }))}
                        className={`flex w-full items-start gap-3 rounded-lg border-2 p-3 text-left transition ${style}`}
                      >
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded bg-secondary text-xs font-bold">
                          {String.fromCharCode(65 + oi)}
                        </span>
                        <span className="text-sm">{opt}</span>
                        {showAnswers && correct && (
                          <Check className="ml-auto h-4 w-4 text-success" />
                        )}
                        {showAnswers && picked && !correct && (
                          <X className="ml-auto h-4 w-4 text-destructive" />
                        )}
                      </button>
                    );
                  })}
                </div>
                {showAnswers && (
                  <div className="mt-3 rounded-lg bg-secondary/60 p-3 text-sm">
                    <span className="font-bold">Why:</span> {q.explanation}
                  </div>
                )}
              </div>
            ))}

            <div className="rounded-3xl border border-border bg-card p-6 text-center shadow-soft">
              {showAnswers ? (
                <>
                  <p className="font-display text-xl font-bold">
                    You scored {score} / {quiz.questions.length}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Great job! Try generating quizzes from your own PDFs and notes too.
                  </p>
                </>
              ) : (
                <Button onClick={() => setShowAnswers(true)} className="rounded-xl">
                  Reveal answers
                </Button>
              )}
            </div>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-4xl">
        <h2 className="text-center font-display text-3xl font-black">
          How the YouTube to Quiz tool works
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "1. Paste the video link",
              desc: "Drop in any YouTube lecture, tutorial, or revision video.",
            },
            {
              title: "2. Add the transcript (optional)",
              desc: "Paste YouTube's auto-transcript for the sharpest questions.",
            },
            {
              title: "3. Practice and self-test",
              desc: "Get instant multiple-choice questions with explanations.",
            },
          ].map((s) => (
            <div key={s.title} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <h3 className="font-display text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
