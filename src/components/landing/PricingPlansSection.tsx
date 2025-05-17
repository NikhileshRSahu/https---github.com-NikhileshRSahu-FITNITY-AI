
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Sparkles, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface Plan {
  id: string;
  name: string;
  displayName: string;
  priceMonthlyUsd: number;
  priceMonthlyInr: number;
  description: string;
  features: string[];
  ctaText: string;
  ctaLink: string;
  isPopular?: boolean;
  isCurrent?: boolean;
  planAccentClass?: string;
  buttonGradientClass?: string;
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
      'Basic AI workout plans',
      'Limited progress dashboard',
      'Community access (read-only)',
    ],
    ctaText: 'Start for Free',
    ctaLink: '/auth/sign-up',
    isCurrent: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    displayName: 'Premium',
    priceMonthlyUsd: 10,
    priceMonthlyInr: 799,
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
    planAccentClass: 'premium-accent-glow',
  },
  {
    id: 'unlimited',
    name: 'Unlimited',
    displayName: 'Unlimited',
    priceMonthlyUsd: 25,
    priceMonthlyInr: 1999,
    description: 'The ultimate AI fitness experience with every feature unlocked.',
    features: [
      'All Premium features',
      'Advanced progress tracking & insights',
      'Personalized nutrition guidance',
      'Exclusive early access to new features',
    ],
    ctaText: 'Go Unlimited',
    ctaLink: '/auth/sign-up',
    planAccentClass: 'unlimited-accent-text',
    buttonGradientClass: 'unlimited-button-gradient',
  },
];

export default function PricingPlansSection() {
  const [isAnnual, setIsAnnual] = useState(false);

  const getPrice = (plan: Plan) => {
    if (isAnnual) {
      return {
        inr: plan.priceMonthlyInr === 0 ? 0 : Math.round(plan.priceMonthlyInr * 0.8), // Discounted monthly equivalent
        usd: plan.priceMonthlyUsd === 0 ? 0 : Math.round(plan.priceMonthlyUsd * 0.8), // Discounted monthly equivalent
        billingCycleText: '/yr',
      };
    } else {
      return {
        inr: plan.priceMonthlyInr,
        usd: plan.priceMonthlyUsd,
        billingCycleText: '/mo',
      };
    }
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
                  plan.isPopular ? 'border-2 border-[hsl(var(--pricing-premium-accent-color))] popular-plan-glow' : '',
                  plan.isCurrent ? 'opacity-80' : ''
                )}
                style={{ animationDelay: `${index * 0.15 + 0.2}s` }}
              >
                <CardHeader className="pb-6 pt-10 text-center relative"> {/* Adjusted padding */}
                  {plan.isPopular && (
                     <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10"> {/* Simple positioning for badge */}
                        <div className="relative bg-yellow-400 text-neutral-900 px-3 py-1.5 rounded-full text-xs font-bold shadow-md uppercase">
                            Most Popular
                        </div>
                    </div>
                  )}
                  <CardTitle className={cn(
                      "text-2xl font-extrabold uppercase tracking-wider mb-2",
                       plan.isPopular ? "mt-5" : "mt-0", // Add margin top if popular badge is present
                      plan.id === 'free' ? 'text-neutral-400' : plan.planAccentClass
                    )}
                  >
                    {plan.displayName}
                  </CardTitle>

                  {plan.id === 'free' ? (
                     <p className="text-5xl font-extrabold text-foreground my-4">{plan.displayName}</p>
                  ) : (
                    <div className="flex flex-col items-center justify-center my-1">
                      <div className="flex items-baseline justify-center">
                        <span className="text-6xl font-extrabold text-foreground">
                          <span className="text-4xl align-baseline mr-0.5">₹</span>
                          {currentPrice.inr}
                        </span>
                        <span className="text-xl font-medium text-neutral-400 ml-0.5 self-end leading-tight pb-[0.4rem]">
                           {currentPrice.billingCycleText.toLowerCase()}
                        </span>
                      </div>
                       <span className="text-base text-neutral-500 mt-0">
                         (${currentPrice.usd}{currentPrice.billingCycleText.toLowerCase()})
                       </span>
                    </div>
                  )}
                   <CardDescription className="pt-3 text-neutral-400 text-sm min-h-[3em] px-4 max-w-xs mx-auto">
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
                          : plan.isPopular
                            ? 'bg-[hsl(var(--pricing-premium-accent-color))] hover:bg-[hsl(var(--pricing-premium-accent-color),0.9)] text-neutral-900'
                            : 'bg-primary hover:bg-primary/90 text-primary-foreground'
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
          {isAnnual ? 'Annual plans show the discounted monthly equivalent, billed upfront for the year. ' : 'Monthly prices shown. '}
          All subscriptions are processed securely. You can cancel anytime.
          <br/>
          USD prices are approximate and may vary based on conversion rates.
        </p>
      </div>
    </section>
  );
}

