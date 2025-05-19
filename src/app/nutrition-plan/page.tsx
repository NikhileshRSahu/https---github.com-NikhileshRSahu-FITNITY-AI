
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { generateNutritionPlan, type GenerateNutritionPlanInput } from '@/ai/flows/generate-nutrition-plan';
import { Loader2, Apple as NutritionIcon, AlertTriangle, Smile, Briefcase, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSubscription } from '@/contexts/SubscriptionContext';
import Link from 'next/link';

const nutritionPlanFormSchema = z.object({
  dietaryPreferences: z.string().min(10, { message: 'Dietary preferences must be at least 10 characters.' }),
  healthGoals: z.string().min(10, { message: 'Health goals must be at least 10 characters.' }),
  allergies: z.string().optional(),
  cuisinePreferences: z.string().optional(),
  dailyActivityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very_active'], {
    required_error: 'Please select your daily activity level.',
  }),
  currentMood: z.enum(['positive', 'neutral', 'stressed', 'low_energy']).optional(),
  lifestyleContext: z.string().optional(),
});

type NutritionPlanFormValues = z.infer<typeof nutritionPlanFormSchema>;

export default function NutritionPlanPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [nutritionPlanResult, setNutritionPlanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { isFeatureAccessible, mounted: subscriptionMounted } = useSubscription();
  const [pageMounted, setPageMounted] = useState(false);

  useEffect(() => {
    setPageMounted(true);
  }, []);

  const form = useForm<NutritionPlanFormValues>({
    resolver: zodResolver(nutritionPlanFormSchema),
    defaultValues: {
      dietaryPreferences: '',
      healthGoals: '',
      allergies: '',
      cuisinePreferences: '',
      lifestyleContext: '',
    },
  });

  async function onSubmit(data: NutritionPlanFormValues) {
    if (!isFeatureAccessible('nutritionPlan')) { // This check might be redundant due to page-level lock
      toast({
        title: 'Premium Feature',
        description: 'Please upgrade to a Premium or Unlimited plan to generate nutrition plans.',
        variant: 'destructive'
      });
      return;
    }
    setIsLoading(true);
    setNutritionPlanResult(null);
    setError(null);
    try {
      const input: GenerateNutritionPlanInput = {
        dietaryPreferences: data.dietaryPreferences,
        healthGoals: data.healthGoals,
        allergies: data.allergies,
        cuisinePreferences: data.cuisinePreferences,
        dailyActivityLevel: data.dailyActivityLevel,
        currentMood: data.currentMood,
        lifestyleContext: data.lifestyleContext,
      };
      const result = await generateNutritionPlan(input);
       if (result && result.nutritionPlan) {
        setNutritionPlanResult(result.nutritionPlan);
        toast({
          title: 'Nutrition Plan Generated!',
          description: 'Your personalized nutrition plan is ready.',
        });
      } else {
        setError('The AI did not return a nutrition plan. Please try again with different inputs.');
        toast({
          variant: 'destructive',
          title: 'No Plan Generated',
          description: 'The AI could not generate a plan based on your input. Please try adjusting your preferences.',
        });
      }
    } catch (err) {
      console.error('Error generating nutrition plan:', err);
      let errorMessage = 'Failed to generate nutrition plan. Please check your inputs or try again later.';
      if (err instanceof Error && err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Error Generating Plan',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  if (!pageMounted || !subscriptionMounted) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 text-accent animate-spin" />
      </div>
    );
  }

  if (!isFeatureAccessible('nutritionPlan')) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 flex flex-col items-center justify-center text-center min-h-[calc(100vh-10rem)] animate-fade-in-up">
        <Card className="w-full max-w-md glassmorphic-card p-8">
          <Sparkles className="h-16 w-16 text-yellow-400 mx-auto mb-6" />
          <CardTitle className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Unlock AI Nutrition Planner</CardTitle>
          <CardDescription className="text-foreground/80 mb-8 text-base sm:text-lg">
            Get personalized meal plans and dietary advice tailored to your goals. This is a Premium feature.
          </CardDescription>
          <Button asChild size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground cta-glow-pulse text-lg active:scale-95">
            <Link href="/#pricing">View Pricing Plans</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 animate-fade-in-up">
      <Card className="max-w-2xl mx-auto glassmorphic-card">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center">
            <NutritionIcon className="mr-3 h-8 w-8 text-accent" /> AI Nutrition Planner
          </CardTitle>
          <CardDescription className="text-base sm:text-lg">
            Tell us about your dietary needs and goals, and our AI will create a personalized nutrition plan for you. The more details you provide, the better the plan!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="dietaryPreferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">Dietary Preferences</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Vegetarian, prefer eggs, occasionally eat fish. Enjoy Indian and Thai food."
                        {...field}
                        rows={3}
                      />
                    </FormControl>
                     <FormDescription>
                      Describe your food choices, likes, dislikes, and any dietary restrictions (min. 10 characters).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="healthGoals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">Health & Fitness Goals</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Lose 5kg in 2 months, gain lean muscle, improve energy for running."
                        {...field}
                        rows={3}
                      />
                    </FormControl>
                    <FormDescription>
                      What are you aiming to achieve with your nutrition? (min. 10 characters)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="dailyActivityLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">Daily Activity Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your activity level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                        <SelectItem value="light">Light (light exercise/sports 1-3 days/week)</SelectItem>
                        <SelectItem value="moderate">Moderate (moderate exercise/sports 3-5 days/week)</SelectItem>
                        <SelectItem value="active">Active (hard exercise/sports 6-7 days a week)</SelectItem>
                        <SelectItem value="very_active">Very Active (very hard exercise/sports & physical job)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="allergies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">Allergies or Intolerances (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Gluten, lactose, peanuts"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      List any food allergies or intolerances you have.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cuisinePreferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">Cuisine Preferences (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Indian, Mediterranean, Mexican, prefer spicy food"
                        {...field}
                      />
                    </FormControl>
                     <FormDescription>
                      What types of food do you enjoy the most?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="currentMood"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold flex items-center"><Smile className="mr-2 h-5 w-5 text-accent/80"/> Current Mood (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="How are you feeling today?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="positive">Positive & Motivated</SelectItem>
                        <SelectItem value="neutral">Neutral / Balanced</SelectItem>
                        <SelectItem value="stressed">Stressed / Comfort Seeking</SelectItem>
                        <SelectItem value="low_energy">Low Energy / Fatigued</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Your mood can influence food choices and appetite.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lifestyleContext"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold flex items-center"><Briefcase className="mr-2 h-5 w-5 text-accent/80"/> Lifestyle Context (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Busy work schedule with limited cooking time, often eat out for lunch, work night shifts."
                        {...field}
                        rows={3}
                      />
                    </FormControl>
                    <FormDescription>
                      Any details about your daily routine or habits that impact your eating patterns.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                disabled={isLoading} 
                size="lg" 
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg transition-transform duration-300 hover:scale-105 cta-glow-pulse active:scale-95"
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Generate Nutrition Plan
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {(isLoading || nutritionPlanResult || error) && (
        <Card className="max-w-2xl mx-auto mt-12 glassmorphic-card result-card-animate">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
                {isLoading ? 'Generating Your Plan...' : (error ? 'Error Generating Plan' : 'Your Personalized Nutrition Plan')}
            </CardTitle>
          </CardHeader>
          <CardContent>
             {isLoading && (
              <div className="flex flex-col items-center justify-center p-8 text-card-foreground">
                <Loader2 className="h-12 w-12 text-accent animate-spin mb-4" />
                <p className="text-lg">AI is preparing your personalized nutrition advice...</p>
                <p className="text-sm text-card-foreground/70">This might take a few moments.</p>
              </div>
            )}
            {error && !isLoading && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-5 w-5" />
                <AlertTitle>Oops! Something went wrong.</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {nutritionPlanResult && !isLoading && !error && (
              <div className="prose dark:prose-invert max-w-none text-card-foreground/90 whitespace-pre-wrap p-4 bg-background/20 rounded-md">
                {nutritionPlanResult}
              </div>
            )}
            {!isLoading && !error && !nutritionPlanResult && (
                <Alert variant="destructive" className="bg-destructive/20 border-destructive/50 text-destructive-foreground">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <AlertTitle>No Plan Available</AlertTitle>
                    <AlertDescription>
                    The AI did not return a nutrition plan. Please try again with different inputs.
                    </AlertDescription>
                </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
