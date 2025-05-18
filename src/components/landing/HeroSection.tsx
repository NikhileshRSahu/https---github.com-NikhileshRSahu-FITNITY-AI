
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image'; // Keep Image for poster if video fails

export default function HeroSection() {
  return (
    <section id="hero" className="relative w-full overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          src="/vedios/73798-549555720_medium.mp4" 
          autoPlay
          loop
          muted
          playsInline // Important for autoplay on mobile
          className="w-full h-full object-cover"
          poster="https://placehold.co/1200x800.png" 
        />
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 flex flex-col items-center justify-center text-center min-h-[70vh] py-20 md:py-32 lg:py-40 xl:py-48">
        <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-foreground leading-tight animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            Your Ultimate AI Fitness Coach — Anytime, Anywhere
          </h1>
          <p className="mx-auto max-w-xl sm:max-w-2xl md:max-w-3xl text-lg text-foreground/80 md:text-xl animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            Real-time form correction, personalized AI workouts, and smart health tracking — all in one app.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-[hsl(var(--accent)_/_0.9)] via-[hsl(var(--primary)_/_0.9)] to-[hsl(var(--accent)_/_0.9)] hover:shadow-[0_0_15px_3px_hsl(var(--accent)_/_0.7)] hover:scale-105 cta-glow-pulse active:scale-95 px-8 py-3 sm:py-4 md:py-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out text-base sm:text-lg text-accent-foreground"
            >
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-accent text-accent hover:bg-accent/10 px-8 py-3 sm:py-4 md:py-6 rounded-lg shadow-md transition-transform duration-300 hover:scale-105 text-base sm:text-lg hover:text-accent-foreground active:scale-95"
            >
              <Link href="#how-it-works">See How It Works</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
