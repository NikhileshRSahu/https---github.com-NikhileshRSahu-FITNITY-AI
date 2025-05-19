
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, LayoutDashboard, Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getPlanById, type Plan } from '@/lib/plans'; // Import plan data

export default function SubscriptionConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [planDetails, setPlanDetails] = useState<Plan | null>(null);
  const [billingCycle, setBillingCycle] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const planId = searchParams.get('plan');
    const cycle = searchParams.get('cycle');

    if (!planId || !cycle) {
      router.replace('/#pricing'); // Redirect if params are missing
      return;
    }

    const foundPlan = getPlanById(planId);
    if (!foundPlan) {
        router.replace('/#pricing'); // Redirect if plan not found
        return;
    }

    setPlanDetails(foundPlan);
    setBillingCycle(cycle);
    setIsLoading(false);
  }, [searchParams, router]);

  if (isLoading || !planDetails) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <Card className="w-full max-w-md sm:max-w-lg glassmorphic-card text-center p-6 sm:p-8">
          <Skeleton className="h-16 w-16 sm:h-20 sm:w-20 rounded-full mx-auto mb-5 sm:mb-6 bg-muted/50" />
          <Skeleton className="h-8 w-3/4 sm:h-9 mx-auto mb-4 sm:mb-5 bg-muted/50" />
          <Skeleton className="h-6 w-full sm:h-6 mx-auto mb-3 sm:mb-4 bg-muted/50" />
          <Skeleton className="h-6 w-2/3 sm:h-6 mx-auto mb-6 sm:mb-8 bg-muted/50" />
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Skeleton className="h-11 w-full sm:w-44 sm:h-12 bg-muted/50" />
            <Skeleton className="h-11 w-full sm:w-44 sm:h-12 bg-muted/50" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 flex items-center justify-center min-h-[calc(100vh-10rem)] animate-fade-in-up">
      <Card className="w-full max-w-lg sm:max-w-xl glassmorphic-card text-center p-6 md:p-10">
        <CardHeader className="p-0">
          <CheckCircle2 className="mx-auto h-16 w-16 sm:h-20 sm:w-20 text-green-400 mb-5 sm:mb-6 animate-pulse" />
          <CardTitle className="text-3xl sm:text-4xl font-bold text-foreground">
            Subscription Confirmed!
          </CardTitle>
          <CardDescription className="text-foreground/80 mt-3 mb-6 sm:mb-8 text-base sm:text-lg">
            You've successfully subscribed to the <strong>Fitnity AI {planDetails.displayName}</strong> plan ({billingCycle}).
            Get ready to unlock your potential!
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 space-y-5 sm:space-y-6">
           <p className="text-sm sm:text-base text-foreground/70">
            You can now access all the features included in your new plan. A confirmation email has been sent (simulated).
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-6 sm:mt-8">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground cta-glow-pulse active:scale-95 text-base sm:text-lg px-5 py-2.5 sm:px-6 sm:py-3 sm:h-auto">
              <Link href="/dashboard">
                <LayoutDashboard className="mr-2 h-4.5 w-4.5 sm:h-5 sm:w-5" /> Go to Dashboard
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-accent text-accent hover:bg-accent/10 hover:text-accent-foreground active:scale-95 text-base sm:text-lg px-5 py-2.5 sm:px-6 sm:py-3 sm:h-auto">
              <Link href="/#features">
                <Sparkles className="mr-2 h-4.5 w-4.5 sm:h-5 sm:w-5" /> Explore Features
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
