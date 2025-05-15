
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { generateWorkoutPlan, type GenerateWorkoutPlanInput } from '@/ai/flows/generate-workout-plan';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const workoutPlanFormSchema = z.object({
  fitnessGoals: z.string().min(10, { message: 'Please describe your fitness goals in at least 10 characters.' }),
  workoutPreferences: z.string().min(10, { message: 'Please describe your workout preferences in at least 10 characters.' }),
  currentFitnessLevel: z.enum(['beginner', 'intermediate', 'advanced'], {
    required_error: 'Please select your current fitness level.',
  }),
});

type WorkoutPlanFormValues = z.infer<typeof workoutPlanFormSchema>;

export default function WorkoutPlanPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [workoutPlanResult, setWorkoutPlanResult] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<WorkoutPlanFormValues>({
    resolver: zodResolver(workoutPlanFormSchema),
    defaultValues: {
      fitnessGoals: '',
      workoutPreferences: '',
    },
  });

  async function onSubmit(data: WorkoutPlanFormValues) {
    setIsLoading(true);
    setWorkoutPlanResult(null);
    try {
      const input: GenerateWorkoutPlanInput = {
        fitnessGoals: data.fitnessGoals,
        workoutPreferences: data.workoutPreferences,
        currentFitnessLevel: data.currentFitnessLevel,
      };
      const result = await generateWorkoutPlan(input);
      setWorkoutPlanResult(result.workoutPlan);
      toast({
        title: 'Workout Plan Generated!',
        description: 'Your personalized workout plan is ready.',
      });
    } catch (error) {
      console.error('Error generating workout plan:', error);
      let errorMessage = 'Failed to generate workout plan. Please try again.';
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
          <CardTitle className="text-3xl font-bold text-primary-foreground">Generate Your Workout Plan</CardTitle>
          <CardDescription className="text-primary-foreground/80">
            Fill in your details below, and our AI will create a personalized workout plan for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fitnessGoals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary-foreground">Fitness Goals</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., lose 10 pounds, build muscle in arms and chest, run a 5k"
                        className="bg-white/20 text-primary-foreground placeholder:text-primary-foreground/60 border-white/30 focus:ring-accent focus:border-accent"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="workoutPreferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary-foreground">Workout Preferences</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 30-minute home workouts, no equipment, enjoy HIIT and yoga"
                        className="bg-white/20 text-primary-foreground placeholder:text-primary-foreground/60 border-white/30 focus:ring-accent focus:border-accent"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currentFitnessLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary-foreground">Current Fitness Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/20 text-primary-foreground border-white/30 focus:ring-accent focus:border-accent">
                          <SelectValue placeholder="Select your fitness level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Generate Plan
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {workoutPlanResult && (
        <Card className="max-w-2xl mx-auto mt-12 glassmorphic-card">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary-foreground">Your Personalized Workout Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none text-primary-foreground/90 whitespace-pre-wrap p-4 bg-black/20 rounded-md">
              {workoutPlanResult}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
