
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

export default function HeroSection() {
  return (
    <section id="hero" className="relative w-full overflow-hidden bg-background text-foreground">
      {/* Removed video background for cleaner light/dark theme adaptation */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 flex flex-col items-center justify-center text-center min-h-[70vh] py-20 md:py-32 lg:py-32">
        <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <Zap className="mx-auto h-16 w-16 sm:h-20 md:h-24 text-primary hero-icon-pulse animate-fade-in-up" style={{ animationDelay: '0.3s' }} />
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-foreground leading-tight animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            Built For Faster Fitness Success
          </h1>
          <p className="mx-auto max-w-xl sm:max-w-2xl md:max-w-3xl text-lg text-foreground/80 md:text-xl animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            AI-powered solutions for your peak performance. Real-time form correction, personalized workouts, and smart health tracking.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            <Button
              asChild
              size="lg"
              className="px-8 py-3 sm:py-4 md:py-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out text-base sm:text-lg 
                         active:scale-95 active:brightness-90
                         dark:bg-gradient-to-r dark:from-[hsl(var(--accent)_/_0.9)] dark:via-[hsl(var(--primary)_/_0.9)] dark:to-[hsl(var(--accent)_/_0.9)] 
                         dark:hover:shadow-[0_0_15px_3px_hsl(var(--accent)_/_0.7)] dark:hover:scale-105 dark:cta-glow-pulse dark:text-accent-foreground
                         light:bg-primary light:text-primary-foreground 
                         light:hover:bg-gradient-to-r light:hover:from-primary light:hover:to-accent light:hover:scale-105"
            >
              <Link href="/auth/sign-up">Get Started Today</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="px-8 py-3 sm:py-4 md:py-6 rounded-lg shadow-md transition-transform duration-300 hover:scale-105 text-base sm:text-lg 
                         active:scale-95 active:brightness-90
                         dark:border-accent dark:text-accent dark:hover:bg-accent/10 dark:hover:text-accent-foreground
                         light:border-primary light:text-primary light:hover:bg-primary/10 light:hover:text-primary-foreground"
            >
              <Link href="#how-it-works">See How It Works</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
