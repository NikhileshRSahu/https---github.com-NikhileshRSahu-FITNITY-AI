import HeroSection from '@/components/landing/HeroSection';
import FeaturesSnapshotSection from '@/components/landing/FeaturesSnapshotSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import ProgressMotivationSection from '@/components/landing/ProgressMotivationSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import PricingPlansSection from '@/components/landing/PricingPlansSection';
import NewsletterSignupSection from '@/components/landing/NewsletterSignupSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSnapshotSection />
      <HowItWorksSection />
      <ProgressMotivationSection />
      <TestimonialsSection />
      <PricingPlansSection />
      <NewsletterSignupSection />
    </>
  );
}
