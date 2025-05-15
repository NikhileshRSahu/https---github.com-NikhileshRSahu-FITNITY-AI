import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

interface Plan {
  name: string;
  price: string;
  priceFrequency: string;
  description: string;
  features: string[];
  ctaText: string;
  isPopular?: boolean;
}

const plans: Plan[] = [
  {
    name: 'Free',
    price: '$0',
    priceFrequency: '/month',
    description: 'Get started with basic AI workout generation and progress tracking.',
    features: [
      'Limited AI workout plans',
      'Basic progress dashboard',
      'Community access',
      'Email support',
    ],
    ctaText: 'Start for Free',
  },
  {
    name: 'Premium AI Coaching',
    price: '$19',
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
    isPopular: true,
  },
];

export default function PricingPlansSection() {
  return (
    <section id="pricing" className="py-16 md:py-24 bg-white/5">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tight text-center sm:text-4xl md:text-5xl text-primary-foreground mb-12">
          Choose Your Fitnity Plan
        </h2>
        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <Card key={plan.name} className={`glassmorphic-card flex flex-col ${plan.isPopular ? 'border-accent ring-2 ring-accent shadow-2xl' : ''} hover:shadow-2xl transition-shadow duration-300`}>
              <CardHeader className="pb-4">
                {plan.isPopular && (
                  <div className="text-xs font-semibold uppercase tracking-wide text-accent bg-accent/10 py-1 px-3 rounded-full self-start mb-2">
                    Most Popular
                  </div>
                )}
                <CardTitle className="text-2xl font-semibold text-primary-foreground">{plan.name}</CardTitle>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-primary-foreground">{plan.price}</span>
                  <span className="text-sm font-medium text-primary-foreground/70">{plan.priceFrequency}</span>
                </div>
                <CardDescription className="pt-2 text-primary-foreground/80">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-primary-foreground/90">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild size="lg" className={`w-full ${plan.isPopular ? 'bg-accent hover:bg-accent/90 text-accent-foreground' : 'bg-primary hover:bg-primary/90 text-primary-foreground'} px-8 py-6 rounded-lg shadow-md transition-transform duration-300 hover:scale-105 text-lg`}>
                  <Link href="#">{plan.ctaText}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
