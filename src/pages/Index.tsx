import { lazy, Suspense } from "react";
import HeroSection from "@/components/HeroSection";

// Lazy load below-the-fold components for better initial load performance
const StorytellingSection = lazy(() => import("@/components/StorytellingSection"));
const FeaturesSection = lazy(() => import("@/components/FeaturesSection"));
const WorkflowSection = lazy(() => import("@/components/WorkflowSection"));
const CTASection = lazy(() => import("@/components/CTASection"));
const Footer = lazy(() => import("@/components/Footer"));

// Loading fallback for lazy components
const SectionLoader = () => (
  <div className="min-h-[400px] flex items-center justify-center">
    <div className="animate-pulse text-muted-foreground">Loading...</div>
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <HeroSection />
      <Suspense fallback={<SectionLoader />}>
        <StorytellingSection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <FeaturesSection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <WorkflowSection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <CTASection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
