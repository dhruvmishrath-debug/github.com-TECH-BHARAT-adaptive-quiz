import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { generateYouTubeQuiz } from "@/lib/youtube-quiz.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Sparkles, Youtube } from "lucide-react";

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
  const router = useRouter();
  const generate = useServerFn(generateYouTubeQuiz);
  const [url, setUrl] = useState("");
  const [topic, setTopic] = useState("");
  const [transcript, setTranscript] = useState("");
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [loading, setLoading] = useState(false);

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
    try {
      toast.info("Generating your quiz with AI…");
      const { quizId } = await generate({ data: { url, topic, transcript, numQuestions } });
      toast.success("Quiz ready!");
      router.navigate({ to: "/quiz/$quizId", params: { quizId } });
    } catch (e: any) {
      toast.error(e?.message ?? "Could not generate the quiz.");
    } finally {
      setLoading(false);
    }
  }

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

            <div>
              <Label>Number of questions</Label>
              <Select value={String(numQuestions)} onValueChange={(v) => setNumQuestions(Number(v))}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[3, 5, 7, 10, 15].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} questions
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleGenerate} disabled={loading} size="lg" className="rounded-xl shadow-warm">
              {loading ? (
                "Generating quiz…"
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" /> Generate Quiz
                </>
              )}
            </Button>
          </div>
        </div>
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
              title: "3. Take the quiz & track progress",
              desc: "Get instant multiple-choice questions saved to your history.",
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
