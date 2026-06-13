import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  FileUp,
  Brain,
  Trophy,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  FileText,
  Target,
  Clock,
  Award,
  Zap,
  Menu,
  X,
  Video,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import heroStudent from "@/assets/hero-student.png";
import advisorStudent from "@/assets/advisor-student.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "QuizGen — Turn Your Notes into Smart Quizzes" },
      {
        name: "description",
        content:
          "Upload PDFs or paste your notes. QuizGen builds adaptive quizzes, grades you instantly, and explains every answer — the modern way to study.",
      },
      { property: "og:title", content: "QuizGen — Study Smarter with AI Quizzes" },
      {
        property: "og:description",
        content: "AI study companion. Upload notes, get quizzes, track progress.",
      },
      { property: "og:url", content: "https://lnct-tech-bharat.lovable.app/" },
    ],
    links: [{ rel: "canonical", href: "https://lnct-tech-bharat.lovable.app/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              name: "QuizGen",
              url: "https://lnct-tech-bharat.lovable.app/",
            },
            {
              "@type": "WebSite",
              name: "QuizGen",
              url: "https://lnct-tech-bharat.lovable.app/",
              description:
                "Upload PDFs or paste your notes. QuizGen builds adaptive quizzes, grades you instantly, and explains every answer.",
            },
          ],
        }),
      },
    ],
  }),
  component: Landing,
});

const categories = [
  { title: "PDF Notes", tint: "bg-tint-blue", icon: FileText },
  { title: "Lecture Slides", tint: "bg-tint-pink", icon: BookOpen },
  { title: "Textbook Chapters", tint: "bg-tint-purple", icon: BookOpen },
  { title: "Exam Prep", tint: "bg-tint-mint", icon: Target },
  { title: "Quick Revision", tint: "bg-tint-peach", icon: Zap },
  { title: "YouTube Lectures", tint: "bg-tint-rose", icon: Video },
];

const advisors = [
  {
    icon: CheckCircle2,
    title: "Adaptive Questions",
    desc: "Easy, Medium, Hard or Mixed — every quiz fits your level.",
  },
  {
    icon: Award,
    title: "Instant Grading",
    desc: "See your score the moment you submit, every answer explained.",
  },
  {
    icon: Clock,
    title: "Study Anywhere",
    desc: "Your notes, quizzes, and history travel with you in the cloud.",
  },
  {
    icon: Trophy,
    title: "Track Progress",
    desc: "A complete history of every attempt, score, and time taken.",
  },
];

function Landing() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Top accent bar like Educax */}
      <div className="h-9 bg-gradient-primary" />

      <header className="relative mx-auto max-w-6xl px-4 py-5">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-extrabold">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-pop">
              <Sparkles className="h-5 w-5" />
            </span>
            QuizGen
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-semibold text-foreground/80 md:flex">
            <a href="#how" className="hover:text-primary">
              How it works
            </a>
            <a href="#categories" className="hover:text-primary">
              What you can study
            </a>
            <a href="#features" className="hover:text-primary">
              Features
            </a>
            <Link to="/auth" className="hover:text-primary">
              Login
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/auth" search={{ mode: "signup" } as never} className="hidden md:inline-flex">
              <Button className="rounded-xl bg-primary text-primary-foreground shadow-pop hover:bg-primary/90">
                Get Started <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <button
              className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-card md:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <nav className="mt-4 flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft md:hidden">
            <a href="#how" className="text-sm font-semibold hover:text-primary" onClick={() => setMobileOpen(false)}>
              How it works
            </a>
            <a href="#categories" className="text-sm font-semibold hover:text-primary" onClick={() => setMobileOpen(false)}>
              What you can study
            </a>
            <a href="#features" className="text-sm font-semibold hover:text-primary" onClick={() => setMobileOpen(false)}>
              Features
            </a>
            <Link to="/auth" className="text-sm font-semibold hover:text-primary" onClick={() => setMobileOpen(false)}>
              Login
            </Link>
            <Link to="/auth" search={{ mode: "signup" } as never} onClick={() => setMobileOpen(false)}>
              <Button className="w-full rounded-xl bg-primary text-primary-foreground shadow-pop hover:bg-primary/90">
                Get Started <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </nav>
        )}
      </header>

      {/* HERO */}
      <section className="relative mx-auto max-w-6xl px-4 pt-10 pb-16 md:pt-16">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent">
              <Sparkles className="h-4 w-4" /> Start Studying Smarter Today
            </span>
            <h1 className="mt-4 font-display text-5xl font-black leading-[1.05] text-foreground md:text-6xl">
              The Smartest Way to <span className="text-primary">Turn Notes</span> Into Quizzes
            </h1>
            <p className="mt-5 max-w-md text-base text-muted-foreground">
              "Our mission is to help every student learn faster — upload your notes and let AI
              build the perfect quiz for you, anywhere, anytime."
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link to="/auth" search={{ mode: "signup" } as never}>
                <Button
                  size="lg"
                  className="rounded-xl bg-primary px-6 text-primary-foreground shadow-pop hover:bg-primary/90"
                >
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline" className="rounded-xl border-2">
                  View product features
                </Button>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative mx-auto w-full max-w-md"
          >
            {/* Coral doodle blob */}
            <svg
              viewBox="0 0 400 400"
              className="absolute inset-0 -z-10 h-full w-full"
              aria-hidden="true"
            >
              <path
                d="M200 30 C310 30 380 110 380 220 C380 320 300 380 200 380 C100 380 20 320 20 220 C20 110 90 30 200 30 Z"
                fill="none"
                stroke="oklch(0.78 0.16 30)"
                strokeWidth="3"
                strokeDasharray="2 0"
                opacity="0.65"
              />
            </svg>
            {/* Sparkle doodles */}
            <Sparkles className="absolute -left-2 top-4 h-7 w-7 text-accent" />
            <span className="absolute right-2 top-2 text-3xl">✨</span>
            <span className="absolute -right-2 bottom-12 text-2xl">💬</span>
            <img
              src={heroStudent}
              alt="Cheerful student holding study notebooks"
              width={1024}
              height={1024}
              className="relative h-auto w-full drop-shadow-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-border/60 bg-card/50 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <p className="text-center text-sm font-medium text-muted-foreground">
            Trusted by students from 1,000+ schools & universities
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-base font-bold text-foreground/70">
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-primary" /> Cambridge
            </span>
            <span className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-accent" /> MIT Prep
            </span>
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-accent" /> StudyHub
            </span>
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full border-2 border-primary" /> Khan Circle
            </span>
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rotate-45 bg-primary" /> Quizly
            </span>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="categories" className="mx-auto max-w-6xl px-4 py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[380px_1fr] lg:gap-16">
          <div className="flex flex-col items-start text-left">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent">
              <Sparkles className="h-4 w-4" /> What you can study
            </span>
            <h2 className="mt-4 font-display text-4xl font-black leading-tight text-foreground md:text-5xl">
              Quizzes from <br /> any kind of notes
            </h2>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed">
              Drop in PDFs, paste lecture transcripts, or upload your handwritten notes as text.
              We'll generate questions tailored to the material.
            </p>
            <Link to="/auth" search={{ mode: "signup" } as never} className="mt-6">
              <Button size="lg" className="rounded-xl bg-primary px-6 text-primary-foreground shadow-pop hover:bg-primary/90">
                Try a category <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {categories.map(({ title, tint, icon: Icon }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`group flex aspect-square w-full flex-col items-center justify-center rounded-[2.25rem] ${tint} p-6 text-center shadow-soft transition-all duration-250 ease-in-out hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-15px_rgba(107,70,193,0.15)] cursor-pointer`}
              >
                <div className="flex h-24 w-24 items-center justify-center rounded-[1.75rem] bg-white/70 shadow-soft transition-transform duration-250 group-hover:scale-105">
                  <Icon className="h-11 w-11 text-primary" />
                </div>
                <p className="mt-5 text-base font-extrabold text-foreground tracking-tight">{title}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS / ADVISORS */}
      <section id="how" className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute inset-x-6 inset-y-6 -z-10 rounded-[40%_60%_45%_55%/55%_45%_60%_40%] bg-gradient-clay" />
            <img
              src={advisorStudent}
              alt="Student giving thumbs up while holding books"
              width={1024}
              height={1024}
              loading="lazy"
              className="relative h-auto w-full"
            />
          </div>
          <div id="features">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent">
              <Sparkles className="h-4 w-4" /> Why students love it
            </span>
            <h2 className="mt-3 font-display text-4xl font-black leading-tight">
              Smarter quizzes, <br /> built by AI advisors
            </h2>
            <p className="mt-3 text-muted-foreground">
              QuizGen reads your notes the way a tutor would and converts them into meaningful
              practice — not random trivia.
            </p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {advisors.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-3">
                  <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-tint-purple text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold">{title}</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/auth" search={{ mode: "signup" } as never}>
              <Button className="mt-7 rounded-xl bg-primary text-primary-foreground shadow-pop hover:bg-primary/90">
                Start learning <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 3-STEP */}
      <section className="mx-auto max-w-6xl px-4 pb-24">
        <h2 className="sr-only">How QuizGen works in 3 steps</h2>
        <div className="rounded-[2rem] bg-gradient-primary p-10 text-primary-foreground shadow-clay md:p-14">
          <div className="grid gap-10 md:grid-cols-3">
            {[
              {
                icon: FileUp,
                title: "1. Upload notes",
                desc: "PDF or pasted text — your study material, your way.",
              },
              {
                icon: Brain,
                title: "2. AI builds the quiz",
                desc: "Choose difficulty and length. We do the rest in seconds.",
              },
              {
                icon: Trophy,
                title: "3. Learn & track",
                desc: "Instant scoring, explanations, and a complete history.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title}>
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 backdrop-blur">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-2xl font-extrabold">{title}</h3>
                <p className="mt-2 text-sm text-primary-foreground/80">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60 py-10 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} QuizGen · Study smarter, not longer.</p>
      </footer>
    </div>
  );
}
