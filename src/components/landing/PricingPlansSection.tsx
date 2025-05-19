
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Sparkles, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useSubscription, type SubscriptionTier } from '@/contexts/SubscriptionContext';
import { plansData, type Plan } from '@/lib/plans'; // Import plansData
import { useToast } from '@/hooks/use-toast';


export default function PricingPlansSection() {
  const [isAnnual, setIsAnnual] = useState(false);
  const { subscriptionTier, setSubscriptionTier, mounted: subscriptionMounted } = useSubscription();
  const { toast } = useToast();
  const [currentPlans, setCurrentPlans] = useState<Plan[]>([]);

  useEffect(() => {
    if (subscriptionMounted) {
      const updatedPlans = plansData.map(plan => ({
        ...plan,
        isCurrent: plan.id === subscriptionTier,
      }));
      setCurrentPlans(updatedPlans);
    } else {
      // Fallback or initial state before context is fully mounted
      setCurrentPlans(plansData.map(plan => ({...plan, isCurrent: plan.id === 'free' }) ));
    }
  }, [subscriptionTier, subscriptionMounted]);


  const getPriceText = (plan: Plan) => {
    const discountFactor = 0.8; // 20% discount for annual

    let inrPrice, usdPrice, billingCycleText, monthlyEquivalentInr, monthlyEquivalentUsd;

    if (isAnnual && plan.priceMonthlyInr > 0) {
      inrPrice = Math.round(plan.priceMonthlyInr * 12 * discountFactor);
      usdPrice = Math.round(plan.priceMonthlyUsd * 12 * discountFactor);
      monthlyEquivalentInr = Math.round(plan.priceMonthlyInr * discountFactor);
      monthlyEquivalentUsd = Math.round(plan.priceMonthlyUsd * discountFactor);
      billingCycleText = '/yr';
    } else {
      inrPrice = plan.priceMonthlyInr;
      usdPrice = plan.priceMonthlyUsd;
      billingCycleText = '/mo';
    }
    
    const displayIcon = plan.id === 'premium' ? Sparkles : plan.id === 'unlimited' ? Zap : null;

    return {
      inrPrice,
      usdPrice,
      billingCycleText,
      monthlyEquivalentInr,
      monthlyEquivalentUsd,
      displayIcon,
    };
  };
  
  const handleUpgradeClick = (planId: SubscriptionTier) => {
    // This function is now primarily for navigation, payment simulation will be on the checkout page
    // But we can still update the context for direct "Free" plan selection if needed or other logic
    if (planId === 'free') {
      setSubscriptionTier('free');
      toast({
        title: 'Switched to Free Plan',
        description: 'You are now on the Free plan.',
      });
    }
    // For premium/unlimited, navigation handles it
  };


  if (!subscriptionMounted || currentPlans.length === 0) {
    // Basic skeleton or loading state
    return (
      <section id="pricing" className="py-16 md:py-24 bg-pricing-section-dark relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 text-center text-foreground">Loading pricing plans...</div>
      </section>
    );
  }


  return (
    <section id="pricing" className="py-16 md:py-24 bg-pricing-section-dark relative overflow-hidden">
      <div className="animated-bg-waves"></div>
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-xl mx-auto text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Choose Your Fitnity Plan
          </h2>
          <p className="mt-4 text-lg text-foreground/80">
            Flexible plans designed for every step of your fitness journey.
          </p>
        </div>

        <div className="flex justify-center items-center gap-3 sm:gap-4 mb-10 md:mb-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <Label htmlFor="billing-cycle" className={cn("font-medium text-sm sm:text-base", !isAnnual ? "text-[hsl(var(--pricing-premium-accent-color))]" : "text-foreground/70")}>
            MONTHLY
          </Label>
          <Switch
            id="billing-cycle"
            checked={isAnnual}
            onCheckedChange={setIsAnnual}
            className="pricing-toggle"
          />
          <Label htmlFor="billing-cycle" className={cn("font-medium text-sm sm:text-base", isAnnual ? "text-[hsl(var(--pricing-premium-accent-color))]" : "text-foreground/70")}>
            ANNUALLY
          </Label>
          {isAnnual && (
            <div className="ml-2 px-2 py-1 sm:px-3 sm:py-1 bg-accent/20 text-accent text-xs font-semibold rounded-full">
              SAVE 20%
            </div>
          )}
        </div>

        <div className="grid gap-6 md:gap-8 grid-cols-1 lg:grid-cols-3 max-w-xs sm:max-w-none mx-auto sm:max-w-5xl items-stretch justify-center">
          {currentPlans.map((plan, index) => {
            const { 
              inrPrice, 
              usdPrice, 
              billingCycleText, 
              monthlyEquivalentInr, 
              monthlyEquivalentUsd,
              displayIcon: PlanIconComp,
            } = getPriceText(plan);
            const PlanIcon = plan.icon || (plan.id === 'premium' ? Sparkles : plan.id === 'unlimited' ? Zap : null);


            return (
              <Card
                key={plan.id}
                className={cn(
                  "flex flex-col bg-neutral-800/80 backdrop-blur-sm text-neutral-200 rounded-2xl shadow-xl border border-neutral-700/70 hover:-translate-y-2 transition-all duration-300 ease-in-out animate-fade-in-up relative overflow-hidden w-full max-w-xs mx-auto",
                  plan.isPopular ? 'border-2 border-[hsl(var(--pricing-premium-accent-color))] popular-plan-glow' : '',
                )}
                style={{ animationDelay: `${index * 0.15 + 0.2}s` }}
              >
                <CardHeader className={cn(
                    "text-center relative pt-6 sm:pt-8 pb-2 sm:pb-3",
                    plan.isPopular ? "pt-10 sm:pt-12" : "pt-6 sm:pt-8"
                  )}
                >
                  {plan.isPopular && (
                     <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10">
                        <div className="relative bg-yellow-400 text-neutral-900 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-bold shadow-md uppercase">
                            Most Popular
                        </div>
                    </div>
                  )}
                  {PlanIcon && <PlanIcon className={cn("h-6 w-6 sm:h-7 sm:w-7 mx-auto mb-2", plan.planAccentClass ? plan.planAccentClass : "text-neutral-400")} />}
                   <CardTitle className={cn(
                      "text-xl sm:text-2xl font-extrabold uppercase tracking-wider mb-1",
                      plan.id === 'free' ? 'text-neutral-300' : plan.planAccentClass
                    )}
                  >
                    {plan.displayName}
                  </CardTitle>

                  {plan.id === 'free' ? (
                     <p className="text-4xl sm:text-5xl font-extrabold text-foreground my-1 sm:my-2">FREE</p> 
                  ) : (
                    <div className="flex flex-col items-center justify-center my-1">
                      <div className="flex items-baseline justify-center">
                        <span className="text-3xl sm:text-4xl font-extrabold text-foreground">
                          <span className="text-xl sm:text-2xl align-baseline mr-0.5">₹</span>
                          {isAnnual ? monthlyEquivalentInr : inrPrice}
                        </span>
                        <span className="text-base sm:text-lg font-medium text-neutral-400 ml-0.5 self-end leading-tight pb-[0.2rem]">
                           {isAnnual ? '/mo' : billingCycleText}
                        </span>
                      </div>
                       <span className="text-xs text-neutral-500 mt-0">
                         (${isAnnual ? monthlyEquivalentUsd : usdPrice}{isAnnual ? '/mo, billed annually' : billingCycleText})
                       </span>
                    </div>
                  )}
                   <CardDescription className="pt-1 sm:pt-2 text-neutral-400 text-xs sm:text-sm min-h-[2.5em] px-2 max-w-xs mx-auto">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow py-2 sm:py-3"> 
                  <ul className="space-y-1 sm:space-y-1.5"> 
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-1.5 sm:gap-2 group"> 
                        <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-400 flex-shrink-0 mt-0.5 group-hover:text-green-300 transition-colors" /> 
                        <span className="text-neutral-300 group-hover:text-neutral-100 transition-colors text-xs sm:text-sm">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-2 sm:pt-3 pb-4 sm:pb-6 px-3 sm:px-4 mt-auto"> 
                  <Button
                    asChild={!plan.isCurrent && plan.id !== 'free'}
                    size="default" 
                    className={cn(
                      "w-full text-sm py-2.5 sm:py-2.5 h-auto font-semibold transition-all duration-300 ease-in-out hover:shadow-lg active:scale-95 rounded-lg",
                      plan.isCurrent
                        ? 'bg-neutral-700 text-neutral-400 cursor-default hover:bg-neutral-700'
                        : plan.id === 'free'
                          ? 'bg-primary hover:bg-primary/90 text-primary-foreground' // Or a link to sign up
                          : plan.buttonGradientClass
                            ? `${plan.buttonGradientClass} text-neutral-900 hover:opacity-90`
                            : plan.isPopular
                              ? 'bg-[hsl(var(--pricing-premium-accent-color))] hover:bg-[hsl(var(--pricing-premium-accent-color),0.9)] text-neutral-900'
                              : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                    )}
                    disabled={plan.isCurrent}
                    onClick={plan.isCurrent || plan.id !== 'free' ? undefined : () => handleUpgradeClick('free')}
                  >
                    {plan.isCurrent ? (
                      <span>Current Plan</span>
                    ) : plan.id === 'free' ? (
                       <Link href={plan.ctaLink}>{plan.ctaText}</Link> // Assuming free links to signup
                    ) : (
                      <Link href={`${plan.ctaLink}&cycle=${isAnnual ? 'annual' : 'monthly'}`}>{plan.ctaText}</Link>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
        <p className="text-center mt-8 md:mt-10 text-xs text-neutral-500 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          {isAnnual ? `Annual plans are billed upfront for the year.` : 'Monthly prices shown.'}
          All subscriptions are processed securely (simulated). You can cancel anytime.
          <br/>
          USD prices are approximate and may vary based on conversion rates.
        </p>
      </div>
    </section>
  );
}
