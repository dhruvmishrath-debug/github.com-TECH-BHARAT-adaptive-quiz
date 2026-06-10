import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { generateQuiz } from "@/lib/quiz.functions";
import { extractPdfText } from "@/lib/pdf-extract";
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
import { Upload as UploadIcon, FileText, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/upload")({
  head: () => ({
    meta: [
      { title: "New Quiz — Upload Notes — QuizGen" },
      {
        name: "description",
        content:
          "Upload a PDF or paste your study notes, pick difficulty and number of questions, and QuizGen will generate a quiz in seconds.",
      },
      { property: "og:title", content: "Generate a New Quiz from Your Notes" },
      {
        property: "og:description",
        content: "Turn any PDF or pasted notes into an adaptive AI quiz in seconds.",
      },
      { property: "og:url", content: "https://lnct-tech-bharat.lovable.app/upload" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://lnct-tech-bharat.lovable.app/upload" }],
  }),
  component: UploadPage,
});

function UploadPage() {
  const router = useRouter();
  const generate = useServerFn(generateQuiz);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("General");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard" | "Mixed">("Medium");
  const [numQuestions, setNumQuestions] = useState<number>(10);
  const [notesText, setNotesText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) {
      toast.error("File must be under 10MB");
      return;
    }
    if (!/\.(pdf|txt)$/i.test(f.name)) {
      toast.error("Only PDF or TXT files");
      return;
    }
    setFile(f);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      let notes = notesText.trim();
      if (file) {
        toast.info("Reading your notes…");
        if (/\.pdf$/i.test(file.name)) {
          notes = await extractPdfText(file);
        } else {
          notes = await file.text();
        }
      }
      if (notes.length < 50) {
        toast.error("Please provide more notes (at least 50 characters).");
        return;
      }
      const t = title.trim() || `${subject} Quiz`;
      toast.info("Generating your quiz with AI…");
      const { quizId } = await generate({
        data: { notes, subject, difficulty, numQuestions, title: t },
      });
      toast.success("Quiz ready!");
      router.navigate({ to: "/quiz/$quizId", params: { quizId } });
    } catch (err: any) {
      toast.error(err.message ?? "Quiz generation failed, please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold">Upload your notes</h1>
        <p className="mt-1 text-muted-foreground">PDF or pasted text. We'll do the rest.</p>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-soft md:p-8"
      >
        <div className="space-y-2">
          <Label>Notes file (PDF or TXT, up to 10MB)</Label>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-border bg-background/50 px-4 py-6 transition hover:border-accent">
            <UploadIcon className="h-6 w-6 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">{file ? file.name : "Click to upload a file"}</p>
              <p className="text-xs text-muted-foreground">PDF or TXT only</p>
            </div>
            <input
              type="file"
              accept=".pdf,.txt,application/pdf,text/plain"
              className="hidden"
              onChange={handleFile}
            />
          </label>
        </div>

        <div className="relative text-center text-xs uppercase tracking-wide text-muted-foreground">
          <span className="bg-card px-2">or paste text</span>
          <div className="absolute left-0 right-0 top-1/2 -z-10 h-px bg-border" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">
            <FileText className="mr-1 inline h-4 w-4" /> Notes
          </Label>
          <Textarea
            id="notes"
            value={notesText}
            onChange={(e) => setNotesText(e.target.value)}
            rows={8}
            placeholder="Paste your study notes here…"
            maxLength={60000}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">Quiz title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Chapter 5 Review"
              maxLength={200}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              maxLength={100}
            />
          </div>
          <div className="space-y-2">
            <Label>Difficulty</Label>
            <Select value={difficulty} onValueChange={(v) => setDifficulty(v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
                <SelectItem value="Mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Number of questions</Label>
            <Select value={String(numQuestions)} onValueChange={(v) => setNumQuestions(Number(v))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 15, 20].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n} questions
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full shadow-warm" disabled={loading}>
          <Sparkles className="mr-2 h-4 w-4" />
          {loading ? "Generating your quiz…" : "Generate Quiz"}
        </Button>
      </form>
    </div>
  );
}
