
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Plan {
  name: string;
  priceUsd: string;
  priceInr: string;
  priceFrequency: string;
  description: string;
  features: string[];
  ctaText: string;
  ctaLink: string;
  isPopular?: boolean;
}

const plans: Plan[] = [
  {
    name: 'Free',
    priceUsd: '$0',
    priceInr: '₹0',
    priceFrequency: '/month',
    description: 'Get started with basic AI workout generation and progress tracking.',
    features: [
      'Limited AI workout plans',
      'Basic progress dashboard',
      'Community access',
      'Email support',
    ],
    ctaText: 'Start for Free',
    ctaLink: '/auth/sign-up', // Changed to sign-up
  },
  {
    name: 'Premium AI Coaching',
    priceUsd: '$19',
    priceInr: '₹1599', // Approx $19 based on ~₹84/$
    priceFrequency: '/month',
    description: 'Unlock the full power of Fitnity AI with advanced features and coaching.',
    features: [
      'Unlimited adaptive AI workouts',
      'Real-time form analysis',
      'AI Coach (Chat & Voice)',
      'Advanced progress tracking & insights',
      'Gamified workouts & challenges',
      'Priority support',
    ],
    ctaText: 'Start Free Trial',
    ctaLink: '/auth/sign-up', // Changed to sign-up
    isPopular: true,
  },
];

export default function PricingPlansSection() {
  return (
    <section id="pricing" className="py-16 md:py-24 bg-background/5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-xl mx-auto text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-foreground">
            Choose Your Fitnity Plan
          </h2>
          <p className="mt-4 text-lg text-foreground/80">
            Select the perfect plan to kickstart your AI-powered fitness journey. All plans start with a free trial period.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={plan.name} 
              className={cn(
                "glassmorphic-card flex flex-col hover:-translate-y-2 transition-all duration-300 ease-in-out animate-fade-in-up",
                plan.isPopular ? 'border-accent/50 ring-2 ring-accent shadow-[0_0_30px_3px_hsl(var(--accent)/0.3)]' : 'border-border/30',
              )}
              style={{ animationDelay: `${index * 0.1 + 0.2}s` }}
            >
              <CardHeader className="pb-4 relative">
                {plan.isPopular && (
                  <div className="absolute -top-4 right-4 bg-accent text-accent-foreground px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg flex items-center gap-1">
                    <Star className="h-4 w-4" /> Most Popular
                  </div>
                )}
                <CardTitle className="text-2xl sm:text-3xl font-bold text-foreground">{plan.name}</CardTitle>
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 mt-2">
                  <span className="text-4xl sm:text-5xl font-extrabold text-accent">{plan.priceInr}</span>
                  <span className="text-xl font-semibold text-foreground/80">/ {plan.priceUsd}</span>
                  <span className="text-sm font-medium text-card-foreground/70 self-end sm:self-baseline">{plan.priceFrequency}</span>
                </div>
                <CardDescription className="pt-3 text-card-foreground/80 min-h-[3em]">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow py-6">
                <h4 className="mb-4 text-lg font-semibold text-foreground">What's included:</h4>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 group">
                      <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5 group-hover:text-accent/80 transition-colors" />
                      <span className="text-card-foreground/90 group-hover:text-card-foreground transition-colors">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="pt-6">
                <Button 
                  asChild 
                  size="lg" 
                  className={cn(
                    "w-full text-lg py-3 h-auto transition-all duration-300 ease-in-out hover:shadow-lg active:scale-95",
                    plan.isPopular 
                      ? 'bg-accent hover:bg-accent/90 text-accent-foreground cta-glow-pulse' 
                      : 'bg-primary hover:bg-primary/90 text-primary-foreground hover:scale-105'
                  )}
                >
                  <Link href={plan.ctaLink}>{plan.ctaText}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
         <p className="text-center mt-12 text-sm text-foreground/70 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            Currency conversions are approximate. All subscriptions are billed in USD or equivalent local currency.
          </p>
      </div>
    </section>
  );
}
