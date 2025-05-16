
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { generateNutritionPlan, type GenerateNutritionPlanInput } from '@/ai/flows/generate-nutrition-plan';
import { Loader2, Apple as NutritionIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const nutritionPlanFormSchema = z.object({
  dietaryPreferences: z.string().min(10, { message: 'Please describe your dietary preferences in at least 10 characters (e.g., vegetarian, likes chicken, avoids red meat).' }),
  healthGoals: z.string().min(10, { message: 'Please describe your health goals in at least 10 characters (e.g., lose 5kg, build lean muscle, increase energy).' }),
  allergies: z.string().optional(),
  cuisinePreferences: z.string().optional(),
  dailyActivityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very_active'], {
    required_error: 'Please select your daily activity level.',
  }),
});

type NutritionPlanFormValues = z.infer<typeof nutritionPlanFormSchema>;

export default function NutritionPlanPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [nutritionPlanResult, setNutritionPlanResult] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<NutritionPlanFormValues>({
    resolver: zodResolver(nutritionPlanFormSchema),
    defaultValues: {
      dietaryPreferences: '',
      healthGoals: '',
      allergies: '',
      cuisinePreferences: '',
    },
  });

  async function onSubmit(data: NutritionPlanFormValues) {
    setIsLoading(true);
    setNutritionPlanResult(null);
    try {
      const input: GenerateNutritionPlanInput = {
        dietaryPreferences: data.dietaryPreferences,
        healthGoals: data.healthGoals,
        allergies: data.allergies,
        cuisinePreferences: data.cuisinePreferences,
        dailyActivityLevel: data.dailyActivityLevel,
      };
      const result = await generateNutritionPlan(input);
      setNutritionPlanResult(result.nutritionPlan);
      toast({
        title: 'Nutrition Plan Generated!',
        description: 'Your personalized nutrition plan is ready.',
      });
    } catch (error) {
      console.error('Error generating nutrition plan:', error);
      let errorMessage = 'Failed to generate nutrition plan. Please try again.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        variant: 'destructive',
        title: 'Error Generating Plan',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <Card className="max-w-2xl mx-auto glassmorphic-card">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center">
            <NutritionIcon className="mr-3 h-8 w-8 text-accent" /> AI Nutrition Planner
          </CardTitle>
          <CardDescription>
            Tell us about your dietary needs and goals, and our AI will create a personalized nutrition plan for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="dietaryPreferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dietary Preferences</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Vegetarian, prefer eggs, occasionally eat fish. Enjoy Indian and Thai food."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="healthGoals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Health & Fitness Goals</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Lose 5kg in 2 months, gain lean muscle, improve energy for running."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="dailyActivityLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Daily Activity Level</FormLabel>
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
                    <FormLabel>Allergies or Intolerances (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Gluten, lactose, peanuts"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cuisinePreferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cuisine Preferences (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Indian, Mediterranean, Mexican"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg transition-transform duration-300 hover:scale-105 cta-glow-pulse">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Generate Nutrition Plan
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {nutritionPlanResult && (
        <Card className="max-w-2xl mx-auto mt-12 glassmorphic-card">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Your Personalized Nutrition Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none text-card-foreground/90 whitespace-pre-wrap p-4 bg-background/20 rounded-md">
              {nutritionPlanResult}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
