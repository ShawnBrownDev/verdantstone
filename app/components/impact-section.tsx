import Image from "next/image";
import { siteImages } from "../lib/site-images";
import { ImpactBeforeAfter } from "./impact-before-after";

export function ImpactSection() {
  return (
    <section
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
        <div className="w-full md:w-1/2">
          <ImpactBeforeAfter
            beforeSrc={siteImages.impact.before}
            afterSrc={siteImages.impact.after}
            beforeAlt="Before: muddy unfinished backyard with patchy grass"
            afterAlt="After: luxury outdoor patio with fire pit and ambient lighting"
            label="Before and after comparison: unfinished backyard versus finished luxury patio with fire pit"
          />
        </div>
      </div>
    </section>
  );
}
