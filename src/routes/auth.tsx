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
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 0 0 1 12c0 1.94.46 3.77 1.18 5.07l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
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
