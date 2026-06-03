import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, MessageSquare, Phone } from "lucide-react";
import { Kicker } from "@/components/site/Section";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Northbound" },
      { name: "description", content: "Get in touch with Northbound. Email, chat, or just send your brief." },
      { property: "og:title", content: "Contact — Northbound" },
      { property: "og:description", content: "Get in touch with Northbound. Email, chat, or just send your brief." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 pt-24 pb-16">
          <Kicker>Talk to us</Kicker>
          <h1 className="font-display mt-6 text-5xl md:text-7xl">
            We answer fast. <span className="italic text-primary">Usually too fast.</span>
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Mail, title: "Email", value: "hello@northbound.studio", href: "mailto:hello@northbound.studio" },
            { icon: Phone, title: "Phone", value: "+1 (555) 010-0420", href: "tel:+15550100420" },
            { icon: MessageSquare, title: "Chat", value: "@northbound on Instagram", href: "#" },
          ].map((c) => (
            <a
              key={c.title}
              href={c.href}
              className="group block rounded-2xl border border-border bg-card p-8 transition-colors hover:border-primary/40"
            >
              <c.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-6 font-display text-2xl">{c.title}</h3>
              <p className="mt-1 text-muted-foreground">{c.value}</p>
            </a>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-border bg-card p-10 md:p-14">
          <h2 className="font-display text-3xl md:text-4xl">Or skip the back-and-forth.</h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Send us your project brief and we'll come back to you with a real mockup, not a sales pitch.
          </p>
          <Link
            to="/start"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
          >
            Start a project
          </Link>
        </div>
      </section>
    </>
  );
}