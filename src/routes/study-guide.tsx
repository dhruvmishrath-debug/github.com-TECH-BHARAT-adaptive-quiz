import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { generateStudyGuide, type StudyGuide } from "@/lib/study-guide.functions";
import { extractPdfText } from "@/lib/pdf-extract";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Sparkles, BookOpen, FileUp, Lightbulb, ListChecks, HelpCircle, ArrowRight, Printer } from "lucide-react";

export const Route = createFileRoute("/study-guide")({
  head: () => ({
    meta: [
      { title: "Free AI Study Guide Generator — QuizGen" },
      {
        name: "description",
        content:
          "Free AI study guide generator. Paste notes or upload a PDF and instantly get key concepts, definitions, summary points, and practice questions — perfect for exam prep.",
      },
      { property: "og:title", content: "Free AI Study Guide Generator — QuizGen" },
      {
        property: "og:description",
        content:
          "Turn lecture notes or PDFs into an exam-ready study guide with key concepts, definitions, and practice questions in seconds.",
      },
      { property: "og:url", content: "https://lnct-tech-bharat.lovable.app/study-guide" },
    ],
    links: [{ rel: "canonical", href: "https://lnct-tech-bharat.lovable.app/study-guide" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "QuizGen Study Guide Generator",
          applicationCategory: "EducationApplication",
          operatingSystem: "Web",
          url: "https://lnct-tech-bharat.lovable.app/study-guide",
          description:
            "AI tool that turns any notes or PDF into a structured study guide with key concepts, definitions, summary points, and practice questions.",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }),
      },
    ],
  }),
  component: StudyGuidePage,
});

function StudyGuidePage() {
  const generate = useServerFn(generateStudyGuide);
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [guide, setGuide] = useState<StudyGuide | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      toast.info("Reading PDF…");
      const text = await extractPdfText(f);
      setNotes(text);
      if (!topic) setTopic(f.name.replace(/\.pdf$/i, ""));
      toast.success("PDF loaded into the notes box");
    } catch {
      toast.error("Couldn't read that PDF. Try pasting the text instead.");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (notes.trim().length < 50) {
      toast.error("Add at least a paragraph of notes (50+ characters).");
      return;
    }
    setLoading(true);
    setGuide(null);
    try {
      const result = await generate({ data: { notes, topic: topic || "Study Guide" } });
      setGuide(result);
      toast.success("Your study guide is ready!");
    } catch (err: any) {
      toast.error(err?.message ?? "Generation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      <div className="h-9 bg-gradient-primary" />
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-extrabold">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-pop">
            <Sparkles className="h-5 w-5" />
          </span>
          QuizGen
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-semibold text-foreground/80 md:flex">
          <Link to="/" className="hover:text-primary">Home</Link>
          <Link to="/study-guide" className="text-primary">Study Guide</Link>
        </nav>
        <Link to="/auth">
          <Button className="rounded-xl bg-primary text-primary-foreground shadow-pop hover:bg-primary/90">
            Sign in <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </header>

      <section className="mx-auto max-w-4xl px-4 pt-6 pb-10 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-tint-purple px-3 py-1 text-xs font-bold text-primary">
          <Sparkles className="h-3 w-3" /> Free · No signup needed
        </span>
        <h1 className="mt-4 font-display text-4xl font-black leading-tight md:text-5xl">
          AI <span className="text-primary">Study Guide Generator</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Paste your notes or upload a PDF and we'll extract the key concepts, definitions, summary points,
          and practice questions you need to ace your next exam.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-10">
        <form
          onSubmit={handleSubmit}
          className="rounded-[2rem] border border-border bg-card p-6 shadow-soft md:p-8"
        >
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <Label htmlFor="topic" className="text-sm font-semibold">Topic or subject</Label>
              <Input
                id="topic"
                placeholder="e.g. Photosynthesis, World War II, Linear Algebra"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                maxLength={200}
                className="mt-1 h-11 rounded-xl"
              />
            </div>
            <div>
              <Label htmlFor="pdf" className="text-sm font-semibold">Or upload a PDF</Label>
              <label
                htmlFor="pdf"
                className="mt-1 inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl border-2 border-dashed border-border bg-background px-4 text-sm font-semibold hover:border-primary"
              >
                <FileUp className="h-4 w-4" /> Choose PDF
              </label>
              <input id="pdf" type="file" accept="application/pdf" className="hidden" onChange={handleFile} />
            </div>
          </div>

          <div className="mt-4">
            <Label htmlFor="notes" className="text-sm font-semibold">Your notes</Label>
            <Textarea
              id="notes"
              placeholder="Paste lecture notes, textbook excerpts, or any study material here…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={60000}
              rows={10}
              className="mt-1 rounded-xl"
            />
            <p className="mt-1 text-xs text-muted-foreground">{notes.length.toLocaleString()} / 60,000 characters</p>
          </div>

          <Button
            type="submit"
            disabled={loading}
            size="lg"
            className="mt-5 h-12 w-full rounded-xl bg-gradient-primary text-base font-bold text-primary-foreground shadow-pop hover:opacity-95"
          >
            {loading ? "Generating your study guide…" : (
              <>
                <Sparkles className="mr-2 h-4 w-4" /> Generate Study Guide
              </>
            )}
          </Button>
        </form>
      </section>

      {guide && (
        <section className="mx-auto max-w-4xl px-4 pb-16" aria-live="polite">
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-clay md:p-10">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-3xl font-black">{guide.title}</h2>
                <p className="mt-2 text-muted-foreground">{guide.overview}</p>
              </div>
              <Button variant="outline" onClick={() => window.print()} className="rounded-xl">
                <Printer className="mr-2 h-4 w-4" /> Print / Save PDF
              </Button>
            </div>

            <div className="mt-8 grid gap-8">
              <Block icon={Lightbulb} title="Key Concepts" tint="bg-tint-peach">
                <ul className="space-y-3">
                  {guide.key_concepts.map((k, i) => (
                    <li key={i} className="rounded-xl bg-background/60 p-3">
                      <p className="font-bold text-foreground">{k.concept}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">{k.explanation}</p>
                    </li>
                  ))}
                </ul>
              </Block>

              <Block icon={BookOpen} title="Definitions" tint="bg-tint-blue">
                <dl className="grid gap-3 sm:grid-cols-2">
                  {guide.definitions.map((d, i) => (
                    <div key={i} className="rounded-xl bg-background/60 p-3">
                      <dt className="font-bold text-foreground">{d.term}</dt>
                      <dd className="mt-0.5 text-sm text-muted-foreground">{d.definition}</dd>
                    </div>
                  ))}
                </dl>
              </Block>

              <Block icon={ListChecks} title="Summary Points" tint="bg-tint-mint">
                <ul className="ml-5 list-disc space-y-1.5 text-sm">
                  {guide.summary_points.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </Block>

              <Block icon={HelpCircle} title="Practice Questions" tint="bg-tint-pink">
                <ol className="ml-5 list-decimal space-y-2 text-sm">
                  {guide.practice_questions.map((q, i) => <li key={i}>{q}</li>)}
                </ol>
              </Block>
            </div>

            <div className="mt-10 rounded-2xl bg-gradient-primary p-6 text-center text-primary-foreground">
              <p className="font-display text-xl font-bold">Ready to test yourself?</p>
              <p className="mt-1 text-sm text-primary-foreground/85">Turn the same notes into an adaptive quiz with instant scoring.</p>
              <Link to="/auth" search={{ mode: "signup" } as never} className="mt-4 inline-block">
                <Button variant="secondary" className="rounded-xl bg-white text-primary hover:bg-white/90">
                  Create a quiz from these notes <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      <footer className="border-t border-border/60 py-8 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} QuizGen · Study smarter, not longer.</p>
      </footer>
    </div>
  );
}

function Block({
  icon: Icon,
  title,
  tint,
  children,
}: {
  icon: typeof Lightbulb;
  title: string;
  tint: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <div className={`grid h-10 w-10 place-items-center rounded-xl ${tint} text-primary`}>
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="font-display text-xl font-extrabold">{title}</h3>
      </div>
      {children}
    </div>
  );
}
