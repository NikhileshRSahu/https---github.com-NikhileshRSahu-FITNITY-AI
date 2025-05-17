
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Sparkles, Star, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface Plan {
  id: string;
  name: string; // e.g. "Base", "Premium", "Unlimited" - internal identifier
  displayName: string; // e.g. "FREE", "Premium", "Unlimited" - for display
  icon?: React.ElementType;
  priceMonthlyUsd: number;
  priceMonthlyInr: number;
  description: string;
  features: string[];
  ctaText: string;
  ctaLink: string;
  isPopular?: boolean;
  isCurrent?: boolean; // For the "Selected plan" style
  planAccentClass?: string; // For specific accent colors
  buttonGradientClass?: string; // For gradient button
}

const plansData: Plan[] = [
  {
    id: 'free',
    name: 'Base',
    displayName: 'FREE',
    priceMonthlyUsd: 0,
    priceMonthlyInr: 0,
    description: 'Get started with core AI workout generation and basic tracking.',
    features: [
      'Limited AI workout plans',
      'Basic progress dashboard',
      'Community access (read-only)',
    ],
    ctaText: 'Current Plan',
    ctaLink: '#', // Link to dashboard or stay on page
    isCurrent: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    displayName: 'Premium',
    icon: Sparkles, // Placeholder for the unique icon
    priceMonthlyUsd: 10, // Updated price
    priceMonthlyInr: 799, // Updated price
    description: 'Unlock powerful AI tools to optimize your fitness journey.',
    features: [
      'Unlimited adaptive AI workouts',
      'Real-time form analysis',
      'AI Coach (Chat & Voice)',
      'Priority support',
    ],
    ctaText: 'Upgrade to Premium',
    ctaLink: '/auth/sign-up',
    isPopular: true,
    planAccentClass: 'premium-accent-glow', // Custom class for gold/yellow glow
  },
  {
    id: 'unlimited',
    name: 'Unlimited',
    displayName: 'Unlimited',
    icon: Zap, // Placeholder, could be different
    priceMonthlyUsd: 25, // Updated price
    priceMonthlyInr: 1999, // Updated price
    description: 'The ultimate AI fitness experience with every feature unlocked.',
    features: [
      'All Premium features',
      'Advanced progress tracking & insights',
      'Personalized nutrition guidance',
      'Exclusive early access to new features',
    ],
    ctaText: 'Go Unlimited',
    ctaLink: '/auth/sign-up',
    planAccentClass: 'unlimited-accent-text', // Custom class for green text
    buttonGradientClass: 'unlimited-button-gradient', // Custom class for gradient button
  },
];

export default function PricingPlansSection() {
  const [isAnnual, setIsAnnual] = useState(false);

  const getPrice = (plan: Plan) => {
    const factor = isAnnual ? 0.8 * 12 : 1; // 20% discount for annual, then multiply by 12 if annual
    const monthlyFactor = isAnnual ? 0.8 : 1; // for /month text with discount

    return {
      usd: plan.priceMonthlyUsd === 0 ? 0 : Math.round(plan.priceMonthlyUsd * monthlyFactor),
      inr: plan.priceMonthlyInr === 0 ? 0 : Math.round(plan.priceMonthlyInr * monthlyFactor),
    };
  };

  return (
    <section id="pricing" className="py-16 md:py-24 bg-pricing-section-dark relative overflow-hidden">
      <div className="animated-bg-waves"></div>
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-xl mx-auto text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-foreground">
            Choose Your Fitnity Plan
          </h2>
          <p className="mt-4 text-lg text-foreground/80">
            Flexible plans designed for every step of your fitness journey.
          </p>
        </div>

        <div className="flex justify-center items-center gap-4 mb-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <Label htmlFor="billing-cycle" className={cn("font-medium", !isAnnual ? "text-accent" : "text-foreground/70")}>
            MONTHLY
          </Label>
          <Switch
            id="billing-cycle"
            checked={isAnnual}
            onCheckedChange={setIsAnnual}
            className="pricing-toggle"
          />
          <Label htmlFor="billing-cycle" className={cn("font-medium", isAnnual ? "text-accent" : "text-foreground/70")}>
            ANNUALLY
          </Label>
          {isAnnual && (
            <div className="ml-2 px-3 py-1 bg-accent/20 text-accent text-xs font-semibold rounded-full">
              SAVE 20%
            </div>
          )}
        </div>

        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3 max-w-5xl mx-auto items-stretch">
          {plansData.map((plan, index) => {
            const currentPrice = getPrice(plan);
            return (
              <Card
                key={plan.id}
                className={cn(
                  "flex flex-col bg-neutral-800/80 backdrop-blur-sm text-neutral-200 rounded-2xl shadow-xl border border-neutral-700/70 hover:-translate-y-2 transition-all duration-300 ease-in-out animate-fade-in-up relative overflow-hidden",
                  plan.isPopular ? 'border-2 border-yellow-400/70 popular-plan-glow' : '',
                  plan.isCurrent ? 'opacity-80' : ''
                )}
                style={{ animationDelay: `${index * 0.15 + 0.2}s` }}
              >
                {plan.isPopular && (
                  <div className="absolute top-4 right-4 bg-yellow-500 text-neutral-900 px-3 py-1 rounded-full text-xs font-bold shadow-md">
                    MOST POPULAR
                  </div>
                )}
                <CardHeader className="pb-4 pt-8 text-center">
                  {plan.icon && <plan.icon className={cn("h-12 w-12 mx-auto mb-4", plan.planAccentClass || 'text-yellow-400')} />}
                  <CardTitle className={cn(
                      "text-lg font-semibold uppercase tracking-wider mb-1",
                      plan.id === 'free' ? 'text-neutral-400' : plan.planAccentClass || 'text-yellow-400'
                    )}
                  >
                    {plan.id === 'free' ? plan.name : plan.displayName}
                  </CardTitle>
                  {plan.id === 'free' && <p className="text-5xl font-extrabold text-foreground">{plan.displayName}</p>}
                  
                  {plan.id !== 'free' && (
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-5xl font-extrabold text-foreground">
                        <span className="text-3xl align-top mr-0.5">₹</span>
                        {currentPrice.inr}
                        <span className="text-lg text-neutral-400">
                          {plan.priceMonthlyUsd > 0 ? (isAnnual ? '/yr' : '/mo') : ''}
                        </span>
                      </span>
                       {plan.priceMonthlyUsd > 0 && <span className="text-sm text-neutral-500 mt-1">(${currentPrice.usd}{isAnnual ? '/yr' : '/mo'})</span>}
                    </div>
                  )}
                   <CardDescription className="pt-3 text-neutral-400 text-sm min-h-[3.5em] px-4">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow py-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 group">
                        <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5 group-hover:text-green-300 transition-colors" />
                        <span className="text-neutral-300 group-hover:text-neutral-100 transition-colors text-sm">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-6 pb-8 px-6">
                  <Button
                    asChild
                    size="lg"
                    className={cn(
                      "w-full text-base py-3 h-auto font-semibold transition-all duration-300 ease-in-out hover:shadow-lg active:scale-95 rounded-lg",
                      plan.isCurrent
                        ? 'bg-neutral-700 text-neutral-400 cursor-default hover:bg-neutral-700'
                        : plan.buttonGradientClass 
                          ? `${plan.buttonGradientClass} text-neutral-900 hover:opacity-90`
                          : 'bg-yellow-500 hover:bg-yellow-400 text-neutral-900',
                       plan.id === 'free' && !plan.isCurrent ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : '' // For non-current free plan if needed
                    )}
                    disabled={plan.isCurrent}
                  >
                    <Link href={plan.ctaLink}>{plan.ctaText}</Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
        <p className="text-center mt-12 text-xs text-neutral-500 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          {isAnnual ? 'Annual prices shown. ' : 'Monthly prices shown. '}
          All subscriptions are processed securely. You can cancel anytime.
        </p>
      </div>
    </section>
  );
}
