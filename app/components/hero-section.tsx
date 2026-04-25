import Image from "next/image";
import Link from "next/link";
import { siteImages } from "../lib/site-images";

export function HeroSection() {
  return (
    <section className="flex w-full flex-col border-b border-border bg-background md:flex-row">
      <div className="flex w-full flex-col justify-center px-8 py-24 md:w-[60%] md:px-16 md:py-32">
        <h1 className="mb-6 font-headings text-5xl leading-tight tracking-tighter text-foreground md:text-6xl">
          Masterful Hardscaping &amp; Luxury Outdoor Living.
        </h1>
        <p className="mb-10 max-w-xl font-body text-xl leading-relaxed text-muted-foreground">
          Transforming properties into architectural masterpieces. Experience
          unparalleled craftsmanship, tailored exactly to your vision.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="#estimate"
            className="inline-flex items-center justify-center rounded-[var(--radius-xl)] bg-primary px-6 py-3 text-center font-body font-medium text-primary-foreground"
          >
            Request a Consultation
          </Link>
          <Link
            href="#portfolio"
            className="inline-flex items-center justify-center rounded-[var(--radius-xl)] border border-border bg-background px-6 py-3 text-center font-body font-medium text-foreground"
          >
            View Our Portfolio
          </Link>
        </div>
      </div>
      <div className="relative h-[600px] w-full md:h-[min(40rem,70vh)] md:w-[40%]">
        <div className="absolute inset-0 h-full w-full">
          <Image
            src={siteImages.hero}
            alt="Luxury hardscape patio at golden hour with architectural landscaping and ambient lighting"
            fill
            priority
            sizes="(min-width: 768px) 40vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
