
// src/ai/flows/generate-workout-plan.ts
'use server';

/**
 * @fileOverview Generates a personalized workout plan based on user fitness goals and preferences.
 *
 * - generateWorkoutPlan - A function that generates a workout plan.
 * - GenerateWorkoutPlanInput - The input type for the generateWorkoutPlan function.
 * - GenerateWorkoutPlanOutput - The return type for the generateWorkoutPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWorkoutPlanInputSchema = z.object({
  fitnessGoals: z
    .string()
    .min(10, { message: 'Fitness goals must be at least 10 characters.'})
    .describe('The fitness goals of the user, e.g., weight loss, muscle gain, general fitness.'),
  workoutPreferences: z
    .string()
    .min(10, { message: 'Workout preferences must be at least 10 characters.'})
    .describe(
      'The workout preferences of the user, e.g., preferred workout types, equipment availability, time commitment.'
    ),
  currentFitnessLevel: z
    .enum(['beginner', 'intermediate', 'advanced'])
    .describe('The current fitness level of the user, e.g., beginner, intermediate, advanced.'),
  mood: z.enum(['energetic', 'neutral', 'tired', 'stressed']).optional().describe('The user\'s current mood, which can influence workout intensity or type.'),
  lifestyleNotes: z.string().optional().describe('Any lifestyle factors to consider, e.g., desk job, physically active job, prefers morning workouts, limited time on weekdays.')
});
export type GenerateWorkoutPlanInput = z.infer<typeof GenerateWorkoutPlanInputSchema>;

const GenerateWorkoutPlanOutputSchema = z.object({
  workoutPlan: z.string().describe('The generated workout plan.'),
});
export type GenerateWorkoutPlanOutput = z.infer<typeof GenerateWorkoutPlanOutputSchema>;

export async function generateWorkoutPlan(
  input: GenerateWorkoutPlanInput
): Promise<GenerateWorkoutPlanOutput> {
  return generateWorkoutPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWorkoutPlanPrompt',
  input: {schema: GenerateWorkoutPlanInputSchema},
  output: {schema: GenerateWorkoutPlanOutputSchema},
  prompt: `You are an expert fitness coach. Generate a detailed and actionable 7-day workout plan based on the user's fitness goals, workout preferences, current fitness level, current mood, and lifestyle notes.
Consider the user's mood: if tired or stressed, suggest lighter or restorative activities. If energetic, the plan can be more challenging.
Factor in lifestyle notes: if they have a desk job, include mobility. If time is limited on certain days, suggest shorter, effective workouts.

User Details:
- Fitness Goals: {{{fitnessGoals}}}
- Workout Preferences: {{{workoutPreferences}}}
- Current Fitness Level: {{{currentFitnessLevel}}}
{{#if mood}}- Current Mood: {{{mood}}}{{/if}}
{{#if lifestyleNotes}}- Lifestyle Notes: {{{lifestyleNotes}}}{{/if}}

Workout Plan (7-day schedule):`,
});

const generateWorkoutPlanFlow = ai.defineFlow(
  {
    name: 'generateWorkoutPlanFlow',
    inputSchema: GenerateWorkoutPlanInputSchema,
    outputSchema: GenerateWorkoutPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
