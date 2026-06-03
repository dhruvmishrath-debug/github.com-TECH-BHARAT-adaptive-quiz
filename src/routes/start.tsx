import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Kicker } from "@/components/site/Section";

export const Route = createFileRoute("/start")({
  head: () => ({
    meta: [
      { title: "Start a project — Northbound" },
      { name: "description", content: "Tell us about your business. We'll send a free working website mockup within 72 hours." },
      { property: "og:title", content: "Start a project — Northbound" },
      { property: "og:description", content: "Tell us about your business. We'll send a free working website mockup within 72 hours." },
    ],
  }),
  component: StartPage,
});

const projectTypes = [
  "Marketing website",
  "Online store",
  "Booking / scheduling",
  "Custom web app",
  "Redesign / rescue",
  "Not sure yet",
];

const budgets = ["Under $2k", "$2k – $5k", "$5k – $10k", "$10k+", "Need help deciding"];
const timelines = ["ASAP (this week)", "Within 2 weeks", "Within a month", "Flexible"];

function StartPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    business: "",
    website: "",
    type: projectTypes[0],
    budget: budgets[1],
    timeline: timelines[1],
    goals: "",
  });

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate submission. Hook up to backend later.
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="mx-auto flex min-h-[70vh] max-w-2xl items-center px-6 py-24">
        <div className="w-full rounded-2xl border border-primary/40 bg-primary/5 p-10 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground">
            <Check className="h-6 w-6" />
          </div>
          <h1 className="font-display mt-6 text-4xl">Brief received.</h1>
          <p className="mt-4 text-muted-foreground">
            We just sent a confirmation to <span className="text-foreground">{form.email}</span>. Expect a real, working
            mockup of <span className="text-foreground">{form.business || "your site"}</span> within 72 hours — usually
            sooner.
          </p>
          <p className="mt-6 font-mono text-xs text-muted-foreground">Reference · NB-{Date.now().toString().slice(-6)}</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto max-w-3xl px-6 pt-24 pb-12">
          <Kicker>Start a project</Kicker>
          <h1 className="font-display mt-6 text-5xl md:text-6xl">
            Tell us about your business.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Takes 2 minutes. We reply within a few hours and ship your free mockup in 72.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16">
        <form onSubmit={onSubmit} className="space-y-6 rounded-2xl border border-border bg-card p-8 md:p-10">
          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Your name" required>
              <input
                required
                value={form.name}
                onChange={update("name")}
                className={inputCls}
                placeholder="Jane Cooper"
              />
            </Field>
            <Field label="Email" required>
              <input
                required
                type="email"
                value={form.email}
                onChange={update("email")}
                className={inputCls}
                placeholder="jane@business.com"
              />
            </Field>
            <Field label="Business name" required>
              <input
                required
                value={form.business}
                onChange={update("business")}
                className={inputCls}
                placeholder="Cooper Roofing Co."
              />
            </Field>
            <Field label="Current website (if any)">
              <input
                value={form.website}
                onChange={update("website")}
                className={inputCls}
                placeholder="https://"
              />
            </Field>
            <Field label="What do you need?">
              <select value={form.type} onChange={update("type")} className={inputCls}>
                {projectTypes.map((p) => <option key={p}>{p}</option>)}
              </select>
            </Field>
            <Field label="Budget">
              <select value={form.budget} onChange={update("budget")} className={inputCls}>
                {budgets.map((p) => <option key={p}>{p}</option>)}
              </select>
            </Field>
            <Field label="Timeline" className="md:col-span-2">
              <select value={form.timeline} onChange={update("timeline")} className={inputCls}>
                {timelines.map((p) => <option key={p}>{p}</option>)}
              </select>
            </Field>
          </div>

          <Field label="What's the site supposed to do?">
            <textarea
              value={form.goals}
              onChange={update("goals")}
              rows={4}
              className={`${inputCls} resize-none`}
              placeholder="e.g. Generate leads for storm damage roofing, look more trustworthy than competitors, get found on Google for 'roofer in Boulder'…"
            />
          </Field>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <p className="text-xs text-muted-foreground">By submitting you agree to receive a response by email. No spam, ever.</p>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] disabled:opacity-60"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? "Sending…" : "Send my brief"}
            </button>
          </div>
        </form>
      </section>
    </>
  );
}

const inputCls =
  "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30";

function Field({
  label,
  children,
  required,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {label} {required && <span className="text-primary">*</span>}
      </span>
      {children}
    </label>
  );
}