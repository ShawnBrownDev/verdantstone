import { Phone } from "lucide-react";

export function FloatingCallButton() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <a
        href="tel:+15551234567"
        className="flex size-16 items-center justify-center rounded-full border-4 border-background bg-accent text-accent-foreground shadow-2xl transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        aria-label="Call Verdant and Stone"
      >
        <Phone className="size-6" aria-hidden />
      </a>
    </div>
  );
}
