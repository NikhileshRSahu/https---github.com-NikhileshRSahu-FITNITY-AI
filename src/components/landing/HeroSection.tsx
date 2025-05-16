
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
  return (
    <section id="hero" className="relative w-full overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          src="/videos/hero-background.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          poster="https://placehold.co/1200x800.png?text=Loading+Video..."
        />
        {/* Overlay for text readability - Increased opacity */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 flex flex-col items-center justify-center text-center min-h-[70vh] py-20 md:py-32 lg:py-40 xl:py-48">
        <div className="space-y-6 animate-fade-in-up">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-foreground leading-tight">
            Your Ultimate AI Fitness Coach — Anytime, Anywhere
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-foreground/80 md:text-xl">
            Real-time form correction, personalized AI workouts, and smart health tracking — all in one app.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-[hsl(var(--accent)_/_0.9)] via-[hsl(var(--primary)_/_0.9)] to-[hsl(var(--accent)_/_0.9)] hover:shadow-[0_0_15px_3px_hsl(var(--accent)_/_0.7)] hover:scale-105 cta-glow-pulse active:scale-95 px-8 py-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out text-lg text-accent-foreground"
            >
              <Link href="/auth/sign-up">Get Started Free</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-accent text-accent hover:bg-accent/10 px-8 py-6 rounded-lg shadow-md transition-transform duration-300 hover:scale-105 text-lg hover:text-accent-foreground"
            >
              <Link href="#how-it-works">See How It Works</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
