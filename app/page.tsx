import { EstimateForm } from "./components/estimate-form";
import { FloatingCallButton } from "./components/floating-call";
import { HeroSection } from "./components/hero-section";
import { ImpactSection } from "./components/impact-section";
import { ServiceGrid } from "./components/service-grid";
import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";
import { SocialProof } from "./components/social-proof";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background font-body text-foreground">
      <a
        href="#main-content"
        className="fixed left-4 top-0 z-[100] -translate-y-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-md transition-transform focus:translate-y-4"
      >
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main-content" className="flex-1">
        <HeroSection />
        <SocialProof />
        <ServiceGrid />
        <ImpactSection />
        <EstimateForm />
      </main>
      <SiteFooter />
      <FloatingCallButton />
    </div>
  );
}
