import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Sparkles, Zap, Eye, MessageSquare } from "lucide-react";
import { Section, Kicker } from "@/components/site/Section";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Northbound — Custom websites built in a weekend" },
      { name: "description", content: "We design, build, and ship custom websites for local businesses. See a working mockup before you pay." },
      { property: "og:title", content: "Northbound — Custom websites built in a weekend" },
      { property: "og:description", content: "We design, build, and ship custom websites for local businesses. See a working mockup before you pay." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 grain" />
        <div className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-28 md:pt-32 md:pb-36">
          <Kicker>A web studio for the people who actually run things</Kicker>
          <h1 className="font-display mt-6 text-5xl leading-[1.02] tracking-tight md:text-7xl lg:text-[88px]">
            We build the website
            <br />
            <span className="italic text-primary">before you pay a cent.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Tell us about your business. We'll design, build, and send you a live website draft within 72 hours. If you love it, you keep it. If you don't, you owe us nothing.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              to="/start"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:scale-[1.02]"
            >
              Get my free mockup
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/examples"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              See live examples
            </Link>
          </div>

          <div className="mt-16 grid max-w-3xl grid-cols-2 gap-8 border-t border-border pt-8 md:grid-cols-4">
            {[
              { stat: "72h", label: "First draft" },
              { stat: "0$", label: "Until you approve" },
              { stat: "150+", label: "Sites shipped" },
              { stat: "4.9★", label: "Average rating" },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-display text-4xl text-primary md:text-5xl">{s.stat}</div>
                <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUE PROP */}
      <Section>
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <Kicker>Why us</Kicker>
            <h2 className="font-display mt-4 text-4xl md:text-5xl">
              Most agencies sell <span className="italic">promises</span>.
              <br />We sell <span className="italic text-primary">finished work</span>.
            </h2>
          </div>
          <div className="space-y-6 text-muted-foreground md:text-lg">
            <p>
              We flipped the model. Instead of pitching you on what we <em>could</em> build,
              we hand you a real, working website with your name on it — and you decide.
            </p>
            <p>
              No proposals. No discovery calls that go nowhere. No invoices for "strategy."
              You see the thing, you click around the thing, and only then do we talk money.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {[
            { icon: Eye, title: "See it first", body: "Get a working draft of your site before any contract or invoice." },
            { icon: Zap, title: "Live in days", body: "Most sites ship in under a week. No 3-month timelines." },
            { icon: Sparkles, title: "Built to convert", body: "Every site is tuned to turn visitors into calls, bookings, and customers." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-card p-8 transition-colors hover:border-primary/40">
              <f.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-6 text-xl font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* HOW IT WORKS */}
      <section className="border-y border-border bg-secondary/30">
        <Section className="py-20 md:py-28">
          <Kicker>How it works</Kicker>
          <h2 className="font-display mt-4 text-4xl md:text-5xl">Four steps. One week.</h2>

          <div className="mt-14 grid gap-6 md:grid-cols-4">
            {[
              { n: "01", title: "Tell us about you", body: "Fill out a 2-minute form. Your business, your customers, the vibe you want." },
              { n: "02", title: "We build it", body: "72 hours later, we send you a real, live website draft to click through." },
              { n: "03", title: "Tweak together", body: "We jump on a 15-minute call. You say what to change. We change it live." },
              { n: "04", title: "Launch & host", body: "We point it to your domain and keep it running. You get the keys." },
            ].map((s) => (
              <div key={s.n} className="relative rounded-2xl border border-border bg-card p-7">
                <div className="font-mono text-xs text-primary">{s.n}</div>
                <h3 className="mt-4 font-display text-2xl">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link to="/process" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
              Read the full process <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Section>
      </section>

      {/* WHO IT'S FOR */}
      <Section>
        <div className="grid gap-12 md:grid-cols-[1fr_2fr] md:gap-20">
          <div>
            <Kicker>Who we build for</Kicker>
            <h2 className="font-display mt-4 text-4xl md:text-5xl">Local businesses that mean business.</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-3">
            {[
              "Roofers", "Plumbers", "Electricians", "Dentists", "Salons", "Photographers",
              "Pool installers", "Dog groomers", "Restaurants", "Law firms", "Med spas", "Trades",
            ].map((t) => (
              <div key={t} className="rounded-full border border-border bg-card px-4 py-2 text-center">
                {t}
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* TESTIMONIALS */}
      <section className="border-y border-border bg-card/40">
        <Section className="py-20">
          <Kicker>Word on the street</Kicker>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { quote: "They sent me a working site before I'd even signed anything. Closed three jobs the first week it went live.", name: "Marcus T.", role: "Storm damage contractor, CO" },
              { quote: "I'd been quoted $9k by an agency. Northbound built mine in four days for a fraction of that. It just works.", name: "Priya R.", role: "Dental practice, TX" },
              { quote: "I genuinely don't know how they did it that fast. Site looks better than my competitors who paid 10x more.", name: "Jordan K.", role: "Photographer, NY" },
            ].map((t) => (
              <figure key={t.name} className="rounded-2xl border border-border bg-background p-7">
                <blockquote className="font-display text-xl leading-snug">"{t.quote}"</blockquote>
                <figcaption className="mt-6 text-sm">
                  <div className="font-medium">{t.name}</div>
                  <div className="text-muted-foreground">{t.role}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>
      </section>

      {/* INCLUDED */}
      <Section>
        <Kicker>What you get</Kicker>
        <h2 className="font-display mt-4 text-4xl md:text-5xl">Every site, fully loaded.</h2>
        <div className="mt-12 grid gap-3 md:grid-cols-2">
          {[
            "Custom design tailored to your brand",
            "Mobile-first responsive layout",
            "Lightning-fast page speed",
            "SEO setup so you can be found",
            "Contact form, booking links, click-to-call",
            "Hosting & SSL included",
            "Analytics dashboard",
            "Unlimited revisions in week 1",
          ].map((item) => (
            <div key={item} className="flex items-start gap-3 rounded-xl border border-border bg-card px-5 py-4">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* CLOSING CTA */}
      <section className="relative overflow-hidden border-t border-border bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-8 px-6 py-20 md:flex-row md:items-center md:justify-between md:py-28">
          <div>
            <h2 className="font-display text-4xl md:text-6xl">
              Let's build it. <span className="italic">Then talk.</span>
            </h2>
            <p className="mt-4 max-w-xl text-base md:text-lg opacity-80">
              Fill out the form. Get a real mockup of your new site in 72 hours. Free, no strings.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/start"
              className="inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-semibold text-foreground transition-transform hover:scale-[1.02]"
            >
              Start my project <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 px-6 py-3 text-sm font-semibold transition-colors hover:bg-primary-foreground/10"
            >
              <MessageSquare className="h-4 w-4" /> Talk to us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
