import { ImpactBeforeAfter } from "./impact-before-after";
import { portfolioGallery } from "../lib/site-images";

export function ProjectsShowcase() {
  return (
    <section
      id="portfolio"
      className="border-b border-border bg-background px-8 py-20 text-foreground md:px-16 md:py-28"
      aria-labelledby="portfolio-gallery-heading"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-2xl">
          <span className="mb-3 block font-body text-sm font-semibold uppercase tracking-wider text-primary">
            Portfolio
          </span>
          <h2
            id="portfolio-gallery-heading"
            className="mb-4 font-headings text-3xl font-bold tracking-tight md:text-4xl"
          >
            Recent projects across the property
          </h2>
          <p className="font-body text-lg leading-relaxed text-muted-foreground">
            From hardscaping and water features to full outdoor rooms—each engagement is tailored to the architecture of
            your home and the way you live outside.
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {portfolioGallery.map((project) => (
            <li key={project.title}>
              <article className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-xl)] border border-border bg-secondary/30 shadow-[0_4px_18px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)]">
                <ImpactBeforeAfter
                  beforeSrc={project.beforeImage}
                  afterSrc={project.afterImage}
                  beforeAlt={project.beforeAlt}
                  afterAlt={project.afterAlt}
                  label={`${project.title} before and after comparison`}
                  className="rounded-none shadow-none"
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                />
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-headings text-xl font-semibold tracking-tight">{project.title}</h3>
                  <p className="mt-2 flex-1 font-body text-sm leading-relaxed text-muted-foreground">{project.subtitle}</p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
