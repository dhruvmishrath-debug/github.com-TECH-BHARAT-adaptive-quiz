import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ArrowRight } from "lucide-react";
import { Section, Kicker } from "@/components/site/Section";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Northbound" },
      { name: "description", content: "Flat-rate website pricing. No hourly billing, no scope creep, no surprises." },
      { property: "og:title", content: "Pricing — Northbound" },
      { property: "og:description", content: "Flat-rate website pricing. No hourly billing, no scope creep, no surprises." },
    ],
  }),
  component: PricingPage,
});

const tiers = [
  {
    name: "Starter",
    tag: "One-page site",
    price: "$1,800",
    monthly: "+$95/mo hosting",
    blurb: "A focused landing page that drives calls, bookings, or signups for a single service or product.",
    features: [
      "1 page, custom design",
      "Mobile responsive",
      "Contact form & click-to-call",
      "SEO basics & analytics",
      "1 round of revisions",
      "Launch in 5 days",
    ],
    cta: "Start with Starter",
    highlight: false,
  },
  {
    name: "Studio",
    tag: "Most popular",
    price: "$3,500",
    monthly: "+$150/mo care plan",
    blurb: "A full multi-page website for established businesses ready to look the part.",
    features: [
      "Up to 6 pages, custom design",
      "Bookings or e-commerce add-on",
      "Blog or news section",
      "Full SEO setup",
      "Unlimited revisions in week 1",
      "Launch in 7 days",
    ],
    cta: "Start with Studio",
    highlight: true,
  },
  {
    name: "Bespoke",
    tag: "Custom builds",
    price: "from $7,500",
    monthly: "Care plan starts $300/mo",
    blurb: "Custom web apps, internal tools, multi-location sites, integrations, or anything we haven't thought of yet.",
    features: [
      "Discovery & spec session",
      "Custom design system",
      "User logins & dashboards",
      "Third-party integrations",
      "Dedicated project lead",
      "Timeline tailored to scope",
    ],
    cta: "Talk to us",
    highlight: false,
  },
];

function PricingPage() {
  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 pt-24 pb-16">
          <Kicker>Pricing</Kicker>
          <h1 className="font-display mt-6 text-5xl md:text-7xl">
            Flat rates. <span className="italic text-primary">No surprises.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            We quote one number up front. You see the work before you pay. If you don't love it, you don't pay.
          </p>
        </div>
      </section>

      <Section>
        <div className="grid gap-6 md:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative flex flex-col rounded-2xl border bg-card p-8 ${
                t.highlight ? "border-primary shadow-[0_0_0_1px_var(--primary)]" : "border-border"
              }`}
            >
              {t.highlight && (
                <span className="absolute -top-3 left-8 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  {t.tag}
                </span>
              )}
              <div className="text-xs uppercase tracking-widest text-muted-foreground">{t.name}</div>
              <div className="mt-4 font-display text-5xl">{t.price}</div>
              <div className="mt-1 text-sm text-muted-foreground">{t.monthly}</div>
              <p className="mt-5 text-sm text-muted-foreground">{t.blurb}</p>
              <ul className="mt-6 space-y-3 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/start"
                className={`mt-8 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-colors ${
                  t.highlight
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : "border border-border hover:bg-secondary"
                }`}
              >
                {t.cta} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-6 rounded-2xl border border-border bg-card p-10 md:grid-cols-3">
          {[
            { q: "What if I don't like it?", a: "You pay nothing. We only charge once you've approved the design and want to go live." },
            { q: "Do you offer payment plans?", a: "Yes. 50% to launch, 50% within 30 days. Or split over 3 months on Studio and Bespoke builds." },
            { q: "Who owns the site?", a: "You do. Code, content, domain, hosting access — all yours. Walk away any time." },
          ].map((f) => (
            <div key={f.q}>
              <div className="font-display text-xl">{f.q}</div>
              <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}