import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Globe, ShoppingBag, CalendarCheck, LayoutDashboard, Wrench, Sparkles } from "lucide-react";
import { Section, Kicker } from "@/components/site/Section";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Northbound" },
      { name: "description", content: "Custom websites, online stores, booking sites, and web apps for small businesses. Built fast, built right." },
      { property: "og:title", content: "Services — Northbound" },
      { property: "og:description", content: "Custom websites, online stores, booking sites, and web apps for small businesses." },
    ],
  }),
  component: ServicesPage,
});

const services = [
  {
    icon: Globe,
    title: "Marketing websites",
    body: "A landing page or full multi-page site that turns visitors into customers. Built for speed, search, and trust.",
    bullets: ["Custom design, no templates", "SEO setup baked in", "Mobile-first responsive"],
    from: "from $1,800",
  },
  {
    icon: ShoppingBag,
    title: "Online stores",
    body: "Sell products online with a clean storefront, secure checkout, and stock management you can actually use.",
    bullets: ["Stripe & PayPal checkout", "Inventory dashboard", "Order notifications"],
    from: "from $3,500",
  },
  {
    icon: CalendarCheck,
    title: "Booking & scheduling",
    body: "Let customers book appointments, classes, or services online. Synced to your calendar. Payments optional.",
    bullets: ["Calendar integration", "Email & SMS reminders", "Deposit collection"],
    from: "from $2,400",
  },
  {
    icon: LayoutDashboard,
    title: "Custom web apps",
    body: "Internal tools, portals, dashboards. If your business runs on spreadsheets, we can replace them.",
    bullets: ["Logins & user roles", "Database & reports", "Built for your workflow"],
    from: "from $5,000",
  },
  {
    icon: Wrench,
    title: "Redesigns & rescues",
    body: "Have a site that's slow, ugly, or just broken? We rebuild it without losing what's already working.",
    bullets: ["SEO preserved", "Content migrated", "Faster page loads"],
    from: "from $1,500",
  },
  {
    icon: Sparkles,
    title: "Care & growth plans",
    body: "Monthly retainers for ongoing updates, hosting, copy tweaks, and small feature work. Keep the lights on.",
    bullets: ["Updates within 48h", "Hosting & SSL", "Monthly analytics"],
    from: "from $250/mo",
  },
];

function ServicesPage() {
  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 pt-24 pb-16">
          <Kicker>What we make</Kicker>
          <h1 className="font-display mt-6 text-5xl md:text-7xl">Six ways we can help.</h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Whether you need a single landing page or a custom internal tool, we build it the same way: fast, by hand, and tuned to your business.
          </p>
        </div>
      </section>

      <Section>
        <div className="grid gap-4 md:grid-cols-2">
          {services.map((s) => (
            <div key={s.title} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/40">
              <div className="flex items-start justify-between">
                <s.icon className="h-7 w-7 text-primary" />
                <span className="font-mono text-xs text-muted-foreground">{s.from}</span>
              </div>
              <h3 className="mt-6 font-display text-3xl">{s.title}</h3>
              <p className="mt-3 text-muted-foreground">{s.body}</p>
              <ul className="mt-6 space-y-2 text-sm">
                {s.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-muted-foreground">
                    <span className="h-1 w-1 rounded-full bg-primary" /> {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap items-center gap-3">
          <Link
            to="/start"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
          >
            Start a project <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold"
          >
            See pricing
          </Link>
        </div>
      </Section>
    </>
  );
}