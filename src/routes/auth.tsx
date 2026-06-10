import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Sparkles, Mail, Lock, User } from "lucide-react";
import { z } from "zod";
import { lovable } from "@/integrations/lovable";
import authCharacter from "@/assets/auth-character.png";

async function handleGoogle() {
  try {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/dashboard`,
    });
    if (result.error) {
      toast.error(result.error.message ?? "Google sign-in failed");
      return;
    }
    if (result.redirected) return;
    window.location.href = "/dashboard";
  } catch (e: any) {
    toast.error(e?.message ?? "Google sign-in failed");
  }
}

type Search = { mode?: "signup" | "login" };

export const Route = createFileRoute("/auth")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>): Search => ({
    mode: s.mode === "signup" ? "signup" : "login",
  }),
  head: () => ({
    meta: [
      { title: "Sign in or Sign up — QuizGen" },
      {
        name: "description",
        content:
          "Log in to QuizGen or create a free account to turn your study notes into AI-generated quizzes with instant scoring and explanations.",
      },
      { property: "og:title", content: "Sign in or Sign up — QuizGen" },
      {
        property: "og:description",
        content: "Create a free QuizGen account to turn study notes into adaptive AI quizzes.",
      },
      { property: "og:url", content: "https://lnct-tech-bharat.lovable.app/auth" },
    ],
    links: [{ rel: "canonical", href: "https://lnct-tech-bharat.lovable.app/auth" }],
  }),
  component: AuthPage,
});

const signupSchema = z.object({
  name: z.string().trim().min(1, "Name required").max(80),
  email: z.string().trim().email("Valid email required").max(255),
  password: z.string().min(6, "At least 6 characters").max(72),
});
const loginSchema = signupSchema.pick({ email: true, password: true });

function AuthPage() {
  const router = useRouter();
  const search = Route.useSearch();
  const [mode, setMode] = useState<"login" | "signup">(search.mode ?? "login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.navigate({ to: "/dashboard", replace: true });
    });
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        if (password !== confirm) {
          toast.error("Passwords do not match");
          return;
        }
        const parsed = signupSchema.safeParse({ name, email, password });
        if (!parsed.success) {
          toast.error(parsed.error.issues[0].message);
          return;
        }
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            data: { name: parsed.data.name },
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });
        if (error) throw error;
        toast.success("Account created!");
        router.navigate({ to: "/dashboard", replace: true });
      } else {
        const parsed = loginSchema.safeParse({ email, password });
        if (!parsed.success) {
          toast.error(parsed.error.issues[0].message);
          return;
        }
        const { error } = await supabase.auth.signInWithPassword(parsed.data);
        if (error) throw error;
        toast.success("Welcome back!");
        router.navigate({ to: "/dashboard", replace: true });
      }
    } catch (err: any) {
      const msg = String(err?.message ?? "");
      if (msg.toLowerCase().includes("invalid")) {
        toast.error(
          "Wrong email or password. If you signed up with Google, use the Google button below.",
          { duration: 6000 },
        );
      } else {
        toast.error(msg || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden px-4 py-12">
      {/* Soft pastel gradient background */}
      <div className="absolute inset-0 -z-10 bg-gradient-clay opacity-90" />
      <div className="absolute -left-20 top-10 -z-10 h-72 w-72 rounded-full bg-tint-pink blur-3xl" />
      <div className="absolute -right-20 bottom-10 -z-10 h-80 w-80 rounded-full bg-tint-purple blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Floating clay character */}
        <div className="pointer-events-none relative mx-auto mb-[-72px] flex w-full justify-center">
          <img
            src={authCharacter}
            alt="Friendly study character"
            width={768}
            height={768}
            className="h-56 w-auto drop-shadow-2xl"
          />
          <span className="absolute left-6 top-2 text-2xl">✨</span>
          <span className="absolute right-8 top-6 text-xl">⭐</span>
        </div>

        <div className="relative rounded-[2rem] border border-white/60 bg-white/80 p-8 shadow-clay backdrop-blur-xl">
          <Link
            to="/"
            className="absolute -top-3 left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-bold shadow-soft"
          >
            <Sparkles className="h-3 w-3 text-primary" /> QuizGen
          </Link>

          <h1 className="text-center font-display text-3xl font-black text-foreground">
            {mode === "signup" ? "Hello, learner!" : "Welcome Back!"}
          </h1>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            {mode === "signup" ? "Create an account to start" : "Login to continue studying"}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-3">
            {mode === "signup" && (
              <div className="relative">
                <Label htmlFor="name" className="sr-only">
                  Name
                </Label>
                <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  maxLength={80}
                  className="h-12 rounded-full border-transparent bg-white/90 pl-11 shadow-soft"
                />
              </div>
            )}
            <div className="relative">
              <Label htmlFor="email" className="sr-only">
                Email
              </Label>
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Username / Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                maxLength={255}
                className="h-12 rounded-full border-transparent bg-white/90 pl-11 shadow-soft"
              />
            </div>
            <div className="relative">
              <Label htmlFor="password" className="sr-only">
                Password
              </Label>
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                maxLength={72}
                className="h-12 rounded-full border-transparent bg-white/90 pl-11 shadow-soft"
              />
            </div>
            {mode === "signup" && (
              <div className="relative">
                <Label htmlFor="confirm" className="sr-only">
                  Confirm
                </Label>
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="confirm"
                  type="password"
                  placeholder="Confirm password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  minLength={6}
                  maxLength={72}
                  className="h-12 rounded-full border-transparent bg-white/90 pl-11 shadow-soft"
                />
              </div>
            )}

            <Button
              type="submit"
              className="mt-2 h-12 w-full rounded-full bg-gradient-primary text-base font-bold text-primary-foreground shadow-pop hover:opacity-95"
              disabled={loading}
            >
              {loading ? "Please wait…" : mode === "signup" ? "Create account" : "Login"}
            </Button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium text-muted-foreground">or continue with</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <Button
            type="button"
            onClick={handleGoogle}
            variant="outline"
            className="h-12 w-full rounded-full border-2 bg-white text-base font-bold shadow-soft hover:bg-white"
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#EA4335"
                d="M12 10.2v3.9h5.5c-.2 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3.3 14.7 2.3 12 2.3 6.7 2.3 2.5 6.6 2.5 12s4.2 9.7 9.5 9.7c5.5 0 9.1-3.9 9.1-9.4 0-.6-.1-1.1-.2-1.6H12z"
              />
            </svg>
            Continue with Google
          </Button>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signup" ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              className="font-bold text-primary hover:underline"
              onClick={() => setMode(mode === "signup" ? "login" : "signup")}
            >
              {mode === "signup" ? "Log in" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
