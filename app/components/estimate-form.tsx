"use client";

import Image from "next/image";
import { Check, ChevronDown } from "lucide-react";
import { useId, useMemo, useState } from "react";
import { createLeadAction } from "../actions/leads";
import { siteImages } from "../lib/site-images";

const TOTAL_STEPS = 3;

const projectOptions = [
  {
    id: "hardscaping" as const,
    label: "Hardscaping",
    image: siteImages.form.hardscaping,
    imageAlt: "Luxury stone patio and modern hardscaping",
  },
  {
    id: "lawn" as const,
    label: "Lawn Care",
    image: siteImages.form.lawn,
    imageAlt: "Manicured luxury lawn",
  },
  {
    id: "landscape" as const,
    label: "Landscape Design",
    image: siteImages.form.landscape,
    imageAlt: "Landscape design blueprint and plants",
  },
  {
    id: "outdoor" as const,
    label: "Outdoor Living",
    image: siteImages.form.outdoorLiving,
    imageAlt: "Outdoor kitchen and fire pit patio",
  },
];

const budgetOptions = ["$10k - $25k", "$25k - $50k", "$50k - $100k", "$100k+"] as const;
const timelineOptions = [
  "Within 3 months",
  "3–6 months",
  "6–12 months",
  "Planning ahead",
] as const;

type ProjectId = (typeof projectOptions)[number]["id"];
type BudgetOption = (typeof budgetOptions)[number];

const budgetOptionValues: Record<BudgetOption, number> = {
  "$10k - $25k": 17500,
  "$25k - $50k": 37500,
  "$50k - $100k": 75000,
  "$100k+": 100000,
};

export function EstimateForm() {
  const formId = useId();
  const [step, setStep] = useState(1);
  const [projectFocus, setProjectFocus] = useState<ProjectId>("hardscaping");
  const [budget, setBudget] = useState<string>(budgetOptions[0]);
  const [timeline, setTimeline] = useState<string>(timelineOptions[0]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const stepTitle = useMemo(() => {
    if (step === 1) return "Project Details";
    if (step === 2) return "Your Contact";
    return "Complete";
  }, [step]);

  const progressPercent = (step / TOTAL_STEPS) * 100;

  const handlePrimaryAction = async () => {
    if (step === 1) {
      setStep(2);
      return;
    }
    if (step === 2) {
      setSubmitting(true);
      setSubmitError(null);
      const selectedProject = projectOptions.find((project) => project.id === projectFocus)?.label ?? "Hardscaping";
      const budgetValue = budgetOptionValues[budget as BudgetOption] ?? 17500;

      try {
        await createLeadAction({
          name: fullName,
          email,
          phone,
          service: selectedProject,
          budget: budgetValue,
          status: "new",
        });
      } catch (error) {
        setSubmitError(error instanceof Error ? error.message : "Could not save your request.");
        setSubmitting(false);
        return;
      }

      setSubmitting(false);
      setStep(3);
      return;
    }
    setStep(1);
    setFullName("");
    setEmail("");
    setPhone("");
    setSubmitError(null);
  };

  const primaryLabel =
    step === 1
      ? "Continue"
      : step === 2
        ? "Send My Estimate Request"
        : "Start another request";

  return (
    <section
      id="estimate"
      className="relative border-b border-border bg-secondary px-8 py-24 md:px-16 md:py-32"
      aria-labelledby={`${formId}-heading`}
    >
      <div className="mx-auto max-w-4xl rounded-[var(--radius-xl)] bg-input p-8 shadow-xl md:p-12">
        <div className="mb-10 flex flex-col gap-4">
          <div className="flex items-center justify-between font-body text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            <span>{`Step ${step} of ${TOTAL_STEPS}`}</span>
            <span>{stepTitle}</span>
          </div>
          <div
            className="h-2 w-full overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuenow={step}
            aria-valuemin={1}
            aria-valuemax={TOTAL_STEPS}
            aria-label="Form progress"
            aria-valuetext={`Step ${step} of ${TOTAL_STEPS}`}
          >
            <div
              className="h-full rounded-full bg-accent transition-[width] duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {step === 1 ? (
          <>
            <div className="mb-10 text-center">
              <h2
                id={`${formId}-heading`}
                className="mb-4 font-headings text-3xl text-foreground md:text-4xl"
              >
                What kind of project do you have in mind?
              </h2>
              <p className="font-body text-muted-foreground">
                Select the primary focus of your property transformation.
              </p>
            </div>

            <fieldset className="mb-10">
              <legend className="sr-only">Project focus</legend>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {projectOptions.map(({ id, label, image }) => {
                    const selected = projectFocus === id;
                    return (
                      <label
                        key={id}
                        className={`relative aspect-square cursor-pointer overflow-hidden rounded-[var(--radius-lg)] border-2 bg-background shadow-md transition-colors ${
                          selected
                            ? "border-primary"
                            : "border-border hover:border-muted-foreground/30"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`${formId}-project`}
                          value={id}
                          checked={selected}
                          onChange={() => setProjectFocus(id)}
                          className="sr-only"
                        />
                        <span className="absolute right-3 top-3 z-10">
                          <span
                            className={`flex size-6 items-center justify-center rounded-full ${
                              selected
                                ? "bg-primary text-white"
                                : "border-2 border-muted bg-transparent"
                            }`}
                            aria-hidden
                          >
                            {selected ? (
                              <Check className="size-3.5" strokeWidth={3} />
                            ) : null}
                          </span>
                        </span>
                        <span className="relative block h-2/3 w-full overflow-hidden">
                          <Image
                            src={image}
                            alt=""
                            fill
                            sizes="(min-width: 768px) 25vw, 50vw"
                            className={`object-cover ${
                              selected ? "" : "opacity-60 grayscale"
                            }`}
                          />
                        </span>
                        <span className="flex h-1/3 flex-col items-center justify-center border-t border-border bg-background p-2">
                          <span
                            className={`font-body text-sm font-semibold ${
                              selected ? "text-primary" : "text-foreground"
                            }`}
                          >
                            {label}
                          </span>
                        </span>
                      </label>
                    );
                })}
              </div>
            </fieldset>

            <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor={`${formId}-budget`}
                  className="font-body text-sm font-semibold text-foreground"
                >
                  Estimated Budget
                </label>
                <div className="relative">
                  <select
                    id={`${formId}-budget`}
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full appearance-none rounded-[var(--radius-md)] border border-border bg-background py-3 pl-4 pr-10 font-body text-muted-foreground"
                  >
                    {budgetOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor={`${formId}-timeline`}
                  className="font-body text-sm font-semibold text-foreground"
                >
                  Project Timeline
                </label>
                <div className="relative">
                  <select
                    id={`${formId}-timeline`}
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className="w-full appearance-none rounded-[var(--radius-md)] border border-border bg-background py-3 pl-4 pr-10 font-body text-muted-foreground"
                  >
                    {timelineOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden
                  />
                </div>
              </div>
            </div>
          </>
        ) : null}

        {step === 2 ? (
          <div className="mb-10 space-y-6">
            <div className="text-center">
              <h2
                id={`${formId}-heading`}
                className="mb-2 font-headings text-3xl text-foreground md:text-4xl"
              >
                How should we reach you?
              </h2>
              <p className="font-body text-muted-foreground">
                We will follow up with a tailored estimate based on your
                selections.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label
                  htmlFor={`${formId}-name`}
                  className="mb-2 block font-body text-sm font-semibold text-foreground"
                >
                  Full name
                </label>
                <input
                  id={`${formId}-name`}
                  name="fullName"
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-[var(--radius-md)] border border-border bg-background px-4 py-3 font-body text-foreground"
                />
              </div>
              <div>
                <label
                  htmlFor={`${formId}-email`}
                  className="mb-2 block font-body text-sm font-semibold text-foreground"
                >
                  Email
                </label>
                <input
                  id={`${formId}-email`}
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-[var(--radius-md)] border border-border bg-background px-4 py-3 font-body text-foreground"
                />
              </div>
              <div>
                <label
                  htmlFor={`${formId}-phone`}
                  className="mb-2 block font-body text-sm font-semibold text-foreground"
                >
                  Phone
                </label>
                <input
                  id={`${formId}-phone`}
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-[var(--radius-md)] border border-border bg-background px-4 py-3 font-body text-foreground"
                />
              </div>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="mb-10 text-center">
            <h2
              id={`${formId}-heading`}
              className="mb-4 font-headings text-3xl text-foreground md:text-4xl"
            >
              Thank you
            </h2>
            <p className="mx-auto max-w-xl font-body text-muted-foreground">
              Your request has been received. A member of our team will contact
              you shortly to discuss your{" "}
              {projectOptions.find((p) => p.id === projectFocus)?.label ??
                "selected"}{" "}
              project and next steps.
            </p>
          </div>
        ) : null}

        <div className="flex flex-col items-end gap-3 border-t border-border pt-6">
          {submitError ? <p className="text-sm text-red-600">{submitError}</p> : null}
          <button
            type="button"
            onClick={handlePrimaryAction}
            disabled={submitting}
            className="w-full rounded-[var(--radius-xl)] bg-primary px-8 py-3 font-body text-lg font-medium text-primary-foreground md:w-auto"
          >
            {submitting ? "Submitting..." : primaryLabel}
          </button>
        </div>
      </div>
    </section>
  );
}
