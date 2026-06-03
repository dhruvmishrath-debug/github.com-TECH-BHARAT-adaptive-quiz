import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Section, Kicker } from "@/components/site/Section";

export const Route = createFileRoute("/process")({
  head: () => ({
    meta: [
      { title: "Process — Northbound" },
      { name: "description", content: "Our 4-step process for building websites that actually ship. See exactly how we work, day by day." },
      { property: "og:title", content: "Process — Northbound" },
      { property: "og:description", content: "Our 4-step process for building websites that actually ship." },
    ],
  }),
  component: ProcessPage,
});

const steps = [
  {
    n: "01",
    day: "Day 1",
    title: "The brief",
    body: "You fill out a short form: business, customers, vibe, and what you want the site to do. We follow up with 2–3 sharp questions, never a discovery call marathon.",
    deliverables: ["Project brief", "Goal & success metric", "Brand & content checklist"],
  },
  {
    n: "02",
    day: "Days 2–4",
    title: "Design & build",
    body: "We design and develop your site in parallel. No static mockups in Figma that you have to imagine — you'll get a real, clickable site at a private preview URL.",
    deliverables: ["Live preview site", "Mobile + desktop layouts", "Working contact form"],
  },
  {
    n: "03",
    day: "Day 5",
    title: "Review call",
    body: "We jump on a 15-minute call. You tell us what to change. We change most of it live on the screen with you. Anything bigger goes into a same-day revision round.",
    deliverables: ["Live review session", "Same-day revisions", "Final approval"],
  },
  {
    n: "04",
    day: "Day 6–7",
    title: "Launch",
    body: "We point the site to your domain, set up email, install analytics, and hand you a 5-minute Loom showing how to edit anything yourself. Then we stay on as long as you want.",
    deliverables: ["Domain & SSL setup", "Analytics installed", "Edit-it-yourself walkthrough"],
  },
];

function ProcessPage() {
  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 pt-24 pb-16">
          <Kicker>How we work</Kicker>
          <h1 className="font-display mt-6 text-5xl md:text-7xl">
            From brief to live <span className="italic text-primary">in one week.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Most agencies take months because most agencies are structured to bill hours. We're structured to ship.
          </p>
        </div>
      </section>

      <Section>
        <div className="space-y-6">
          {steps.map((s) => (
            <div key={s.n} className="grid gap-6 rounded-2xl border border-border bg-card p-8 md:grid-cols-[180px_1fr_220px] md:gap-10 md:p-10">
              <div>
                <div className="font-mono text-xs text-primary">{s.day}</div>
                <div className="font-display mt-2 text-5xl">{s.n}</div>
              </div>
              <div>
                <h3 className="font-display text-3xl">{s.title}</h3>
                <p className="mt-3 text-muted-foreground">{s.body}</p>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">You get</div>
                <ul className="mt-3 space-y-1.5 text-sm">
                  {s.deliverables.map((d) => (
                    <li key={d}>· {d}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-primary/40 bg-primary/5 p-10 text-center">
          <h3 className="font-display text-3xl md:text-4xl">Ready when you are.</h3>
          <p className="mt-3 text-muted-foreground">Submit your brief and we'll start today.</p>
          <Link
            to="/start"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
          >
            Start a project <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>
    </>
  );
}