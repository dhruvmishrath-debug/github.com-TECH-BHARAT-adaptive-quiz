import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground font-bold">N</span>
            <span className="font-display text-xl">Northbound</span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Custom websites for local businesses. Built in days, delivered with a working mockup before you pay a cent.
          </p>
        </div>
        <div>
          <h4 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Studio</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/services" className="hover:text-primary">Services</Link></li>
            <li><Link to="/process" className="hover:text-primary">Process</Link></li>
            <li><Link to="/pricing" className="hover:text-primary">Pricing</Link></li>
            <li><Link to="/examples" className="hover:text-primary">Examples</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Get in touch</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/start" className="hover:text-primary">Start a project</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
            <li><a href="mailto:hello@northbound.studio" className="hover:text-primary">hello@northbound.studio</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-6 py-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Northbound Studio. All rights reserved.</p>
          <p className="font-mono">Built for businesses that mean business.</p>
        </div>
      </div>
    </footer>
  );
}