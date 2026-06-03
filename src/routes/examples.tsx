import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Section, Kicker } from "@/components/site/Section";

export const Route = createFileRoute("/examples")({
  head: () => ({
    meta: [
      { title: "Examples — Northbound" },
      { name: "description", content: "A sample of websites we've built for local businesses across trades, hospitality, health, and creative." },
      { property: "og:title", content: "Examples — Northbound" },
      { property: "og:description", content: "A sample of websites we've built for local businesses across trades, hospitality, health, and creative." },
    ],
  }),
  component: ExamplesPage,
});

const examples = [
  { name: "Ridgeline Roofing", category: "Trades · Colorado", result: "+312% leads in 60 days", color: "from-orange-500/30 to-orange-500/5" },
  { name: "North Avenue Dental", category: "Healthcare · Texas", result: "Booking fully online", color: "from-cyan-400/30 to-cyan-400/5" },
  { name: "Field & Flame", category: "Restaurant · Brooklyn", result: "Reservations up 4×", color: "from-rose-400/30 to-rose-400/5" },
  { name: "Atlas Plumbing", category: "Trades · Arizona", result: "Top 3 on Maps in 90 days", color: "from-emerald-400/30 to-emerald-400/5" },
  { name: "Jordan Kohli Photography", category: "Creative · NYC", result: "Doubled bookings", color: "from-violet-400/30 to-violet-400/5" },
  { name: "Bayside Pool Co.", category: "Trades · Florida", result: "$48k pipeline in week 1", color: "from-sky-400/30 to-sky-400/5" },
];

function ExamplesPage() {
  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 pt-24 pb-16">
          <Kicker>Recent work</Kicker>
          <h1 className="font-display mt-6 text-5xl md:text-7xl">
            Sites that <span className="italic text-primary">actually moved the needle.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            A small sample. Every project gets a measurable outcome — calls, bookings, revenue, search rank.
          </p>
        </div>
      </section>

      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          {examples.map((e) => (
            <a
              key={e.name}
              href="#"
              onClick={(ev) => ev.preventDefault()}
              className="group relative block overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/40"
            >
              <div className={`aspect-[16/10] bg-gradient-to-br ${e.color} relative`}>
                <div className="absolute inset-0 grain opacity-40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-5xl text-foreground/30 md:text-6xl">{e.name.split(" ")[0]}</span>
                </div>
              </div>
              <div className="flex items-start justify-between gap-4 p-7">
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">{e.category}</div>
                  <h3 className="mt-2 font-display text-2xl">{e.name}</h3>
                  <p className="mt-1 text-sm text-primary">{e.result}</p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
            </a>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-border bg-card p-10 text-center">
          <h3 className="font-display text-3xl md:text-4xl">Want yours on this list?</h3>
          <Link
            to="/start"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
          >
            Start a project
          </Link>
        </div>
      </Section>
    </>
  );
}