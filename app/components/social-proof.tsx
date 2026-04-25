import { Award, Leaf, ShieldCheck } from "lucide-react";

const items = [
  { icon: Award, label: "Best of Houzz" },
  { icon: ShieldCheck, label: "Certified Pro" },
  { icon: Leaf, label: "EcoScape" },
] as const;

export function SocialProof() {
  return (
    <section
      className="flex flex-col items-center justify-between border-b border-primary/20 bg-primary px-8 py-16 text-primary-foreground md:flex-row md:px-16"
      aria-labelledby="social-proof-heading"
    >
      <div className="mb-8 flex flex-col md:mb-0">
        <span className="mb-2 font-body text-sm uppercase tracking-widest text-primary-foreground/70">
          Trusted By
        </span>
        <h2
          id="social-proof-heading"
          className="font-headings text-2xl tracking-tight"
        >
          Industry Leaders &amp; Local Certifications
        </h2>
      </div>
      <div className="flex flex-wrap justify-center gap-12 opacity-80 md:gap-16">
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-3">
            <Icon className="size-8 shrink-0" aria-hidden />
            <span className="font-body text-lg font-semibold">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
