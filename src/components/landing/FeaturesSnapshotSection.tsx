
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, ScanLine, MicVocal, LineChart, Apple as NutritionIcon, type Icon, Sparkles, Lock } from 'lucide-react';
import Link from 'next/link';
import { useSubscription } from '@/contexts/SubscriptionContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: Icon;
  title: string;
  description: string;
  isPremium?: boolean;
  isLocked?: boolean;
}

function FeatureCard({ icon: IconComponent, title, description, isPremium, isLocked }: FeatureCardProps) {
  return (
    <Card className={cn(
        "glassmorphic-card hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-in-out flex flex-col h-full",
        isLocked && "opacity-70 hover:opacity-90"
      )}
    >
      <CardHeader className="flex flex-row items-center gap-3 sm:gap-4 pb-3 relative">
        <IconComponent className="h-8 w-8 sm:h-10 sm:w-10 text-accent flex-shrink-0" />
        <CardTitle className="text-lg sm:text-xl font-semibold">{title}</CardTitle> 
        {isPremium && (
          <Sparkles className="h-5 w-5 text-yellow-400 absolute top-2 right-2" />
        )}
        {isLocked && (
           <Lock className="h-4 w-4 text-amber-500 absolute top-2 right-2" />
        )}
      </CardHeader>
      <CardContent className="flex-grow pt-0">
        <p className="text-card-foreground/80 text-sm sm:text-base">{description}</p>
      </CardContent>
    </Card>
  );
}

interface Feature extends FeatureCardProps {
  href: string;
  featureKey: 'workoutPlan' | 'formAnalysis' | 'aiCoach' | 'dashboard' | 'nutritionPlan' | 'videos' | 'shop';
}

export default function FeaturesSnapshotSection() {
  const { isFeatureAccessible } = useSubscription();

  const features: Feature[] = [
    {
      icon: Brain,
      title: 'Adaptive AI Workouts',
      description: 'Personalized plans that evolve with your progress, fitness level, and goals.',
      href: '/workout-plan',
      featureKey: 'workoutPlan',
    },
    {
      icon: ScanLine,
      title: 'Real-time Form Analysis',
      description: 'Instant feedback on your exercise form via webcam to maximize results and prevent injury.',
      href: '/form-analysis',
      featureKey: 'formAnalysis',
      isPremium: true,
    },
    {
      icon: MicVocal,
      title: 'AI Coach & Voice Assistant',
      description: 'Get guidance, motivation, and answers in English & Hindi through chat or voice.',
      href: '/ai-coach',
      featureKey: 'aiCoach',
    },
    {
      icon: LineChart,
      title: 'Progress Tracking Dashboard',
      description: 'Visualize your journey with comprehensive metrics for workouts, health, and habits.',
      href: '/dashboard',
      featureKey: 'dashboard',
    },
    {
      icon: NutritionIcon,
      title: 'AI Nutrition Planner',
      description: 'Get personalized meal plans and dietary advice tailored to your goals and preferences.',
      href: '/nutrition-plan',
      featureKey: 'nutritionPlan',
      isPremium: true,
    },
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-background/5">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-center text-foreground mb-12 md:mb-16 animate-fade-in-up">
          Unlock Your Fitness Potential
        </h2>
        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {features.map((feature, index) => {
            const accessible = isFeatureAccessible(feature.featureKey);
            const isLockedForDisplay = feature.isPremium && !accessible;

            const cardContent = (
                <FeatureCard 
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  isPremium={feature.isPremium}
                  isLocked={isLockedForDisplay}
                />
            );

            if (accessible) {
              return (
                <Link 
                  key={feature.title} 
                  href={feature.href} 
                  className="flex h-full animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1 + 0.2}s` }}
                >
                  {cardContent}
                </Link>
              );
            } else {
              return (
                <AlertDialog key={feature.title}>
                  <AlertDialogTrigger asChild>
                    <div 
                      className="flex h-full animate-fade-in-up cursor-pointer" 
                      style={{ animationDelay: `${index * 0.1 + 0.2}s` }}
                    >
                      {cardContent}
                    </div>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="glassmorphic-card">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <Sparkles className="h-6 w-6 text-yellow-400"/> Premium Feature Locked
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        The "{feature.title}" feature requires a Premium or Unlimited subscription. Upgrade your plan to unlock access and supercharge your fitness journey!
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                        <Link href="/#pricing">View Plans</Link>
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              );
            }
          })}
        </div>
      </div>
    </section>
  );
}
