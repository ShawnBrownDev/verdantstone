import { Leaf, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

const year = new Date().getFullYear();

const serviceLinks = [
  "Luxury Hardscaping",
  "Outdoor Kitchens",
  "Water Features",
  "Architectural Lighting",
  "Estate Maintenance",
] as const;

const companyLinks = [
  { label: "Our Story", href: "#about" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Careers", href: "#estimate" },
  { label: "Contact Us", href: "#estimate" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-primary/20 bg-primary px-8 py-20 text-primary-foreground md:px-16">
      <div className="mx-auto mb-16 grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-4">
        <div className="md:col-span-1" id="about">
          <div className="mb-6 flex items-center gap-2 font-headings text-2xl font-bold tracking-tight">
            <Leaf className="size-7 shrink-0" aria-hidden />
            <span>Verdant &amp; Stone</span>
          </div>
          <p className="mb-8 font-body leading-relaxed text-primary-foreground/70">
            Architectural landscaping and premium hardscaping for the most
            discerning homeowners.
          </p>
          <ul className="flex gap-4" aria-label="Social media">
            <li>
              <a
                href="https://instagram.com"
                className="flex size-10 items-center justify-center rounded-full border border-primary-foreground/20 font-body text-xs font-semibold text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                aria-label="Instagram"
              >
                IG
              </a>
            </li>
            <li>
              <a
                href="https://facebook.com"
                className="flex size-10 items-center justify-center rounded-full border border-primary-foreground/20 font-body text-xs font-semibold text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                aria-label="Facebook"
              >
                FB
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com"
                className="flex size-10 items-center justify-center rounded-full border border-primary-foreground/20 font-body text-xs font-semibold text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                aria-label="X (Twitter)"
              >
                X
              </a>
            </li>
          </ul>
        </div>
        <div className="md:col-span-1">
          <h2 className="mb-6 font-headings text-xl">Services</h2>
          <ul className="space-y-4 font-body text-primary-foreground/70">
            {serviceLinks.map((label) => (
              <li key={label}>
                <Link href="#services" className="hover:text-primary-foreground">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-1">
          <h2 className="mb-6 font-headings text-xl">Company</h2>
          <ul className="space-y-4 font-body text-primary-foreground/70">
            {companyLinks.map(({ label, href }) => (
              <li key={label}>
                <Link href={href} className="hover:text-primary-foreground">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-1">
          <h2 className="mb-6 font-headings text-xl">Contact</h2>
          <ul className="space-y-4 font-body text-primary-foreground/70">
            <li className="flex items-start gap-3">
              <MapPin className="mt-1 size-5 shrink-0" aria-hidden />
              <span>123 Luxury Lane, Beverly Hills, CA 90210</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="size-5 shrink-0" aria-hidden />
              <a href="tel:+15551234567" className="hover:text-primary-foreground">
                (555) 123-4567
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="size-5 shrink-0" aria-hidden />
              <a
                href="mailto:design@verdantandstone.com"
                className="hover:text-primary-foreground"
              >
                design@verdantandstone.com
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 border-t border-primary-foreground/10 pt-8 md:flex-row md:items-center md:justify-between md:gap-4">
        <p className="order-2 text-center font-body text-sm text-primary-foreground/50 md:order-1 md:text-left">
          © {year}  Verdant &amp; Stone. All rights reserved.
        </p>
        <Link
          href="https://nextwaveweb.tech/"
          target="_blank"
          rel="noopener noreferrer"
          className="order-1 group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-accent/60 bg-accent/15 px-5 py-2.5 font-body text-sm shadow-[0_0_24px_rgba(212,175,55,0.2),inset_0_1px_0_rgba(255,255,255,0.12)] transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:bg-accent/25 hover:shadow-[0_0_32px_rgba(212,175,55,0.35),0_8px_24px_rgba(0,0,0,0.15)] md:order-2"
        >
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-accent/0 via-white/10 to-accent/0 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
          <span className="relative text-[10px] font-bold uppercase tracking-[0.2em] text-primary-foreground/80">
            Built by
          </span>
          <span className="relative font-headings text-base font-bold tracking-tight text-accent">
            NextWaveWeb
          </span>
        </Link>
        <div className="order-3 flex gap-6 font-body text-sm text-primary-foreground/50">
          <Link href="#" className="transition-colors hover:text-primary-foreground">
            Privacy Policy
          </Link>
          <Link href="#" className="transition-colors hover:text-primary-foreground">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
