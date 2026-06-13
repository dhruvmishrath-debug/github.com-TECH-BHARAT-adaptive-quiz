import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { generateFlashcards, type Flashcard } from "@/lib/flashcards.functions";
import { extractPdfText } from "@/lib/pdf-extract";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Sparkles, FileUp, RotateCw, ChevronLeft, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/flashcards")({
  head: () => ({
    meta: [
      { title: "AI Flashcard Maker — QuizGen" },
      {
        name: "description",
        content:
          "AI flashcard maker. Paste notes or upload a PDF and generate study flashcards for active recall in seconds.",
      },
      { property: "og:title", content: "AI Flashcard Maker — QuizGen" },
      {
        property: "og:description",
        content: "Turn notes or PDFs into AI flashcards instantly.",
      },
      { property: "og:url", content: "https://lnct-tech-bharat.lovable.app/flashcards" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://lnct-tech-bharat.lovable.app/flashcards" }],
  }),
  component: FlashcardsPage,
});

function FlashcardsPage() {
  const generate = useServerFn(generateFlashcards);
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");
  const [count, setCount] = useState(12);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      toast.info("Reading PDF…");
      const text = await extractPdfText(f);
      setNotes(text);
      if (!topic) setTopic(f.name.replace(/\.pdf$/i, ""));
      toast.success("PDF loaded");
    } catch {
      toast.error("Couldn't read that PDF. Try pasting text instead.");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (notes.trim().length < 20) {
      toast.error("Add at least a short paragraph of notes.");
      return;
    }
    setLoading(true);
    setCards([]);
    setIdx(0);
    setFlipped(false);
    try {
      const result = await generate({
        data: { notes, topic: topic || "Flashcards", count },
      });
      setTitle(result.title);
      setCards(result.cards);
      toast.success(`${result.cards.length} flashcards ready!`);
    } catch (err: any) {
      toast.error(err?.message ?? "Generation failed");
    } finally {
      setLoading(false);
    }
  }

  const card = cards[idx];

  return (
    <div className="space-y-8">
      <section className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-tint-mint px-3 py-1 text-xs font-bold text-primary">
          <Sparkles className="h-3 w-3" /> AI-Powered
        </span>
        <h1 className="mt-4 font-display text-4xl font-black leading-tight md:text-5xl">
          AI <span className="text-primary">Flashcard Maker</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Paste notes or upload a PDF. We'll generate study flashcards for active recall —
          the fastest way to memorize anything.
        </p>
      </section>

      <section className="mx-auto max-w-4xl">
        <form
          onSubmit={handleSubmit}
          className="rounded-[2rem] border border-border bg-card p-6 shadow-soft md:p-8"
        >
          <div className="grid gap-4 md:grid-cols-3 md:items-end">
            <div className="md:col-span-2">
              <Label htmlFor="topic" className="text-sm font-semibold">Topic</Label>
              <Input
                id="topic"
                placeholder="e.g. Cell Biology, Spanish verbs, US History"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                maxLength={200}
                className="mt-1 h-11 rounded-xl"
              />
            </div>
            <div>
              <Label htmlFor="count" className="text-sm font-semibold"># cards</Label>
              <Input
                id="count"
                type="number"
                min={5}
                max={30}
                value={count}
                onChange={(e) => setCount(Math.max(5, Math.min(30, Number(e.target.value) || 12)))}
                className="mt-1 h-11 rounded-xl"
              />
            </div>
          </div>

          <div className="mt-4">
            <Label htmlFor="pdf" className="text-sm font-semibold">Upload a PDF (optional)</Label>
            <label
              htmlFor="pdf"
              className="mt-1 inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl border-2 border-dashed border-border bg-background px-4 text-sm font-semibold hover:border-primary"
            >
              <FileUp className="h-4 w-4" /> Choose PDF
            </label>
            <input id="pdf" type="file" accept="application/pdf" className="hidden" onChange={handleFile} />
          </div>

          <div className="mt-4">
            <Label htmlFor="notes" className="text-sm font-semibold">Your notes</Label>
            <Textarea
              id="notes"
              placeholder="Paste lecture notes, textbook excerpts, vocabulary lists…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={60000}
              rows={10}
              className="mt-1 rounded-xl"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {notes.length.toLocaleString()} / 60,000 characters
            </p>
          </div>

          <Button
            type="submit"
            disabled={loading}
            size="lg"
            className="mt-5 h-12 w-full rounded-xl bg-gradient-primary text-base font-bold text-primary-foreground shadow-pop hover:opacity-95"
          >
            {loading ? "Generating flashcards…" : (
              <><Sparkles className="mr-2 h-4 w-4" /> Generate Flashcards</>
            )}
          </Button>
        </form>
      </section>

      {cards.length > 0 && card && (
        <section className="mx-auto max-w-3xl" aria-live="polite">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl font-black">{title}</h2>
            <span className="text-sm font-semibold text-muted-foreground">
              {idx + 1} / {cards.length}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setFlipped((v) => !v)}
            className="group relative block w-full rounded-[2rem] border border-border bg-card p-10 text-left shadow-clay transition hover:shadow-pop md:p-14"
          >
            <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
              <RotateCw className="h-3 w-3" /> {flipped ? "Answer" : "Question"}
            </span>
            <p className="min-h-[120px] font-display text-2xl font-bold leading-snug text-foreground md:text-3xl">
              {flipped ? card.back : card.front}
            </p>
            {!flipped && card.hint && (
              <p className="mt-4 text-sm text-muted-foreground">Hint: {card.hint}</p>
            )}
            <p className="mt-6 text-xs text-muted-foreground">Tap card to flip</p>
          </button>

          <div className="mt-5 flex items-center justify-between gap-3">
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => {
                setFlipped(false);
                setIdx((i) => (i - 1 + cards.length) % cards.length);
              }}
            >
              <ChevronLeft className="mr-1 h-4 w-4" /> Prev
            </Button>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => setFlipped((v) => !v)}
            >
              <RotateCw className="mr-1 h-4 w-4" /> Flip
            </Button>
            <Button
              className="rounded-xl bg-primary text-primary-foreground"
              onClick={() => {
                setFlipped(false);
                setIdx((i) => (i + 1) % cards.length);
              }}
            >
              Next <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
