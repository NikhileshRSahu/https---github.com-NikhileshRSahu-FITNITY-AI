
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
  return (
    <section id="hero" className="w-full py-20 md:py-32 lg:py-40 xl:py-48">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-primary-foreground leading-tight">
              Your Ultimate AI Fitness Coach — Anytime, Anywhere
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-primary-foreground/80 md:text-xl lg:mx-0">
              Real-time form correction, personalized AI workouts, and smart health tracking — all in one app.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 text-lg">
                <Link href="#pricing">Get Started Free</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-accent text-accent hover:bg-accent/10 px-8 py-6 rounded-lg shadow-md transition-transform duration-300 hover:scale-105 text-lg">
                <Link href="#how-it-works">See How It Works</Link>
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <Image
              src="https://placehold.co/600x400.png"
              alt="AI Workout Form Analysis"
              width={600}
              height={400}
              className="rounded-xl shadow-2xl object-cover"
              data-ai-hint="fitness animation"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
