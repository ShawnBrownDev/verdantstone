"use client";

import { Leaf, Menu, Phone, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";

const navLinks = [
  { href: "#services", label: "Services" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#about", label: "About" },
] as const;

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const panelId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [mobileOpen, closeMenu]);

  useEffect(() => {
    if (mobileOpen) panelRef.current?.focus();
  }, [mobileOpen]);

  return (
    <header className="relative sticky top-0 z-50 flex w-full items-center justify-between border-b border-border bg-background px-8 py-4 md:px-16">
      <Link
        href="/"
        className="flex items-center gap-2 font-headings text-2xl font-bold tracking-tight text-primary"
      >
        <Leaf className="size-7 shrink-0" aria-hidden />
        <span>Verdant &amp; Stone</span>
      </Link>

      <nav
        className="hidden items-center gap-8 font-body text-sm font-medium text-foreground md:flex"
        aria-label="Primary"
      >
        {navLinks.map(({ href, label }) => (
          <Link key={href} href={href} className="text-foreground hover:underline">
            {label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <div className="mr-4 hidden items-center gap-2 font-body text-sm text-muted-foreground lg:flex">
          <Phone className="size-4 shrink-0" aria-hidden />
          <a href="tel:+15551234567" className="hover:text-foreground">
            (555) 123-4567
          </a>
        </div>

        <Link
          href="#estimate"
          className="hidden rounded-full bg-primary px-5 py-2 text-center font-body text-sm font-medium uppercase tracking-wider text-primary-foreground sm:inline-flex sm:items-center sm:justify-center"
        >
          Request Quote
        </Link>

        <button
          type="button"
          className="inline-flex rounded-md border border-border p-2 text-foreground md:hidden"
          aria-expanded={mobileOpen}
          aria-controls={panelId}
          onClick={() => setMobileOpen((o) => !o)}
        >
          <span className="sr-only">{mobileOpen ? "Close menu" : "Open menu"}</span>
          {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {mobileOpen ? (
        <div
          ref={panelRef}
          id={panelId}
          tabIndex={-1}
          className="absolute inset-x-0 top-full border-b border-border bg-background px-8 py-6 shadow-lg outline-none md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col gap-4 font-body text-base font-medium">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="py-1 text-foreground"
                onClick={closeMenu}
              >
                {label}
              </Link>
            ))}
            <a href="tel:+15551234567" className="py-1 text-muted-foreground">
              (555) 123-4567
            </a>
            <Link
              href="#estimate"
              className="mt-2 rounded-full bg-primary px-5 py-3 text-center text-sm font-medium uppercase tracking-wider text-primary-foreground"
              onClick={closeMenu}
            >
              Request Quote
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
