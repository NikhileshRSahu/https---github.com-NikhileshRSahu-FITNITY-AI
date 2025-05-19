'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { generateWorkoutPlan, type GenerateWorkoutPlanInput } from '@/ai/flows/generate-workout-plan';
import { Loader2, ClipboardList, AlertTriangle, Smile, Briefcase } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const workoutPlanFormSchema = z.object({
  fitnessGoals: z.string().min(10, { message: 'Fitness goals must be at least 10 characters.' }),
  workoutPreferences: z.string().min(10, { message: 'Workout preferences must be at least 10 characters.' }),
  currentFitnessLevel: z.enum(['beginner', 'intermediate', 'advanced'], {
    required_error: 'Please select your current fitness level.',
  }),
  mood: z.enum(['energetic', 'neutral', 'tired', 'stressed']).optional(),
  lifestyleNotes: z.string().optional(),
});

type WorkoutPlanFormValues = z.infer<typeof workoutPlanFormSchema>;

export default function WorkoutPlanPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [workoutPlanResult, setWorkoutPlanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<WorkoutPlanFormValues>({
    resolver: zodResolver(workoutPlanFormSchema),
    defaultValues: {
      fitnessGoals: '',
      workoutPreferences: '',
      lifestyleNotes: '',
    },
  });

  async function onSubmit(data: WorkoutPlanFormValues) {
    setIsLoading(true);
    setWorkoutPlanResult(null);
    setError(null);
    try {
      const input: GenerateWorkoutPlanInput = {
        fitnessGoals: data.fitnessGoals,
        workoutPreferences: data.workoutPreferences,
        currentFitnessLevel: data.currentFitnessLevel,
        mood: data.mood,
        lifestyleNotes: data.lifestyleNotes,
      };
      const result = await generateWorkoutPlan(input);
      if (result && result.workoutPlan) {
        setWorkoutPlanResult(result.workoutPlan);
        toast({
          title: 'Workout Plan Generated!',
          description: 'Your personalized workout plan is ready.',
        });
      } else {
        setError('The AI did not return a workout plan. Please try again with different inputs or refine your preferences.');
        toast({
          variant: 'destructive',
          title: 'No Plan Generated',
          description: 'The AI could not generate a plan based on your input. Please try adjusting your preferences.',
        });
      }
    } catch (err) {
      console.error('Error generating workout plan:', err);
      let errorMessage = 'Failed to generate workout plan. Please check your inputs or try again later.';
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

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 animate-fade-in-up">
      <Card className="max-w-2xl mx-auto glassmorphic-card">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center">
            <ClipboardList className="mr-3 h-8 w-8 text-primary dark:text-accent" /> Generate Your Workout Plan
          </CardTitle>
          <CardDescription className="text-base sm:text-lg">
            Fill in your details below, and our AI will create a personalized workout plan for you. The more details you provide, the better the plan!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="fitnessGoals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">Fitness Goals</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Achieve a 10k run, sculpt lean muscle, boost daily energy levels."
                        {...field}
                        rows={3}
                      />
                    </FormControl>
                    <FormDescription>
                      Describe what you want to achieve with your fitness routine (min. 10 characters).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="workoutPreferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">Workout Preferences</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Prefer 45-min gym sessions with free weights, enjoy outdoor cycling, need low-impact options for recovery days."
                        {...field}
                        rows={3}
                      />
                    </FormControl>
                    <FormDescription>
                      Tell us about your preferred workout styles, duration, location, and any equipment availability (min. 10 characters).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currentFitnessLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">Current Fitness Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your fitness level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner (New to exercise or returning after a long break)</SelectItem>
                        <SelectItem value="intermediate">Intermediate (Exercise regularly, comfortable with moderate intensity)</SelectItem>
                        <SelectItem value="advanced">Advanced (Very experienced, comfortable with high intensity and complex exercises)</SelectItem>
                      </SelectContent>
                    </Select>
                     <FormDescription>
                      Honest assessment helps in creating a suitable plan.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="mood"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold flex items-center"><Smile className="mr-2 h-5 w-5 text-primary dark:text-accent/80"/> Current Mood (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="How are you feeling today?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="energetic">Energetic & Ready to Go!</SelectItem>
                        <SelectItem value="neutral">Neutral / Average</SelectItem>
                        <SelectItem value="tired">A Bit Tired / Low Energy</SelectItem>
                        <SelectItem value="stressed">Stressed / Need to Unwind</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      This helps the AI tailor workout intensity or suggest restorative activities if needed.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lifestyleNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold flex items-center"><Briefcase className="mr-2 h-5 w-5 text-primary dark:text-accent/80"/> Lifestyle Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Desk job with long sitting hours, limited time on weekdays, prefer outdoor workouts on weekends."
                        {...field}
                        rows={3}
                      />
                    </FormControl>
                    <FormDescription>
                      Any details about your daily routine, work, or time constraints that might affect your workouts.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                disabled={isLoading} 
                size="lg" 
                className="w-full text-lg transition-transform duration-300 hover:scale-105 active:scale-95 active:brightness-90
                           light:bg-primary light:text-primary-foreground light:hover:bg-gradient-to-r light:hover:from-primary light:hover:to-accent
                           dark:bg-accent dark:text-accent-foreground dark:hover:bg-accent/90 dark:cta-glow-pulse"
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Generate Plan
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {(isLoading || workoutPlanResult || error) && (
        <Card className="max-w-2xl mx-auto mt-12 glassmorphic-card result-card-animate">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              {isLoading ? 'Generating Your Plan...' : (error ? 'Error Generating Plan' : 'Your Personalized Workout Plan')}
            </CardTitle>
          </CardHeader>
          <CardContent>
             {isLoading && (
              <div className="flex flex-col items-center justify-center p-8 text-card-foreground">
                <Loader2 className="h-12 w-12 text-primary dark:text-accent animate-spin mb-4" />
                <p className="text-lg">AI is crafting your personalized plan...</p>
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
            {workoutPlanResult && !isLoading && !error && (
              <div className="prose dark:prose-invert max-w-none text-card-foreground/90 whitespace-pre-wrap p-4 bg-background/20 rounded-md">
                {workoutPlanResult}
              </div>
            )}
            {!isLoading && !error && !workoutPlanResult && ( 
                <Alert variant="destructive" className="bg-destructive/20 border-destructive/50 text-destructive-foreground">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <AlertTitle>No Plan Available</AlertTitle>
                    <AlertDescription>
                    The AI did not return a workout plan. Please try again with different inputs or refine your preferences.
                    </AlertDescription>
                </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
