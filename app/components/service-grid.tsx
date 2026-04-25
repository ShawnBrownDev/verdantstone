import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteImages } from "../lib/site-images";

const services = [
  {
    title: "Luxury Hardscaping",
    description:
      "Architectural patios, retaining walls, and custom stonework designed to anchor your outdoor living space.",
    image: siteImages.services.hardscaping,
    imageAlt:
      "Luxury custom stone patio and retaining wall with modern hardscaping",
  },
  {
    title: "Outdoor Kitchens",
    description:
      "Fully-equipped culinary spaces outdoors, featuring premium appliances, granite countertops, and ambient lighting.",
    image: siteImages.services.outdoorKitchen,
    imageAlt: "Modern outdoor kitchen with grill and ambient lighting",
  },
  {
    title: "Water Features",
    description:
      "Serene koi ponds, modern geometric fountains, and cascading waterfalls that introduce tranquility to your garden.",
    image: siteImages.services.waterFeature,
    imageAlt: "Geometric water feature fountain in a luxury garden",
  },
] as const;

export function ServiceGrid() {
  return (
    <section
      id="services"
      className="border-b border-border bg-background px-8 py-24 md:px-16 md:py-32"
      aria-labelledby="services-heading"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-20 max-w-3xl text-center">
          <span className="mb-4 block font-body text-sm font-semibold uppercase tracking-wider text-accent">
            Our Expertise
          </span>
          <h2
            id="services-heading"
            className="font-headings text-4xl text-foreground md:text-5xl"
          >
            Bespoke Services for the Discerning Homeowner.
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
          {services.map(({ title, description, image, imageAlt }) => (
            <article
              key={title}
              className="group flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border bg-input shadow-sm"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src={image}
                  alt={imageAlt}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-primary/80 to-transparent p-6">
                  <h3 className="font-headings text-2xl text-primary-foreground">
                    {title}
                  </h3>
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-between p-8">
                <p className="mb-8 font-body leading-relaxed text-muted-foreground">
                  {description}
                </p>
                <Link
                  href="#estimate"
                  className="flex items-center gap-2 border-b border-transparent font-body font-semibold text-primary hover:border-primary"
                >
                  Explore Details
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
