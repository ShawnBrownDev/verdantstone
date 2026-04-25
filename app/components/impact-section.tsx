import Image from "next/image";
import { ChevronsLeftRight } from "lucide-react";
import { siteImages } from "../lib/site-images";

export function ImpactSection() {
  return (
    <section
      id="portfolio"
      className="border-b border-primary/20 bg-primary px-8 py-24 text-primary-foreground md:px-16 md:py-32"
      aria-labelledby="impact-heading"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-16 md:flex-row">
        <div className="w-full md:w-1/2" id="testimonials">
          <span className="mb-4 block font-body text-sm font-semibold uppercase tracking-wider text-accent">
            The Transformation
          </span>
          <h2
            id="impact-heading"
            className="mb-6 font-headings text-4xl md:text-5xl"
          >
            From Muddy Yard to Premium Living Space.
          </h2>
          <p className="mb-10 font-body text-lg leading-relaxed text-primary-foreground/80">
            Experience the true potential of your property. We handle everything
            from grading and drainage to the final placement of architectural
            lighting.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-4" aria-hidden>
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-accent text-sm font-bold text-accent-foreground">
                4.9
              </div>
              <Image
                src={siteImages.impact.homeownerA}
                alt=""
                width={48}
                height={48}
                className="size-12 rounded-full border-2 border-primary object-cover"
              />
              <Image
                src={siteImages.impact.homeownerB}
                alt=""
                width={48}
                height={48}
                className="size-12 rounded-full border-2 border-primary object-cover"
              />
            </div>
            <p className="font-body text-sm font-medium">
              Join 500+ satisfied homeowners
            </p>
          </div>
        </div>
        <div
          className="relative aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-xl)] bg-secondary shadow-2xl md:w-1/2"
          aria-label="Before and after comparison: unfinished backyard versus finished luxury patio with fire pit"
        >
          <div className="absolute inset-0 z-10 w-1/2 overflow-hidden border-r-4 border-white">
            <div className="relative h-full w-[200%] min-h-0">
              <Image
                src={siteImages.impact.before}
                alt="Before: muddy unfinished backyard with patchy grass"
                fill
                sizes="50vw"
                className="object-cover grayscale filter"
              />
            </div>
            <div className="absolute left-4 top-4 rounded bg-black/60 px-3 py-1 font-body text-xs font-bold uppercase tracking-wider text-white">
              Before
            </div>
          </div>
          <div className="absolute inset-0 h-full w-full">
            <Image
              src={siteImages.impact.after}
              alt="After: luxury outdoor patio with fire pit and ambient lighting"
              fill
              sizes="50vw"
              className="object-cover"
            />
            <div className="absolute right-4 top-4 rounded bg-accent/90 px-3 py-1 font-body text-xs font-bold uppercase tracking-wider text-accent-foreground">
              After
            </div>
          </div>
          <div className="absolute inset-y-0 left-1/2 z-20 flex w-1 -translate-x-1/2 items-center justify-center bg-white shadow-md">
            <div className="flex size-10 items-center justify-center rounded-full bg-white text-primary shadow-lg ring-4 ring-black/10">
              <ChevronsLeftRight className="size-5" aria-hidden />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
