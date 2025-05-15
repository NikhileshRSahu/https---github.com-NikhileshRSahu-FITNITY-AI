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
    .describe('The fitness goals of the user, e.g., weight loss, muscle gain, general fitness.'),
  workoutPreferences: z
    .string()
    .describe(
      'The workout preferences of the user, e.g., preferred workout types, equipment availability, time commitment.'
    ),
  currentFitnessLevel: z
    .string()
    .describe('The current fitness level of the user, e.g., beginner, intermediate, advanced.'),
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
  prompt: `You are an expert fitness coach. Generate a workout plan based on the user's fitness goals, workout preferences, and current fitness level.

Fitness Goals: {{{fitnessGoals}}}
Workout Preferences: {{{workoutPreferences}}}
Current Fitness Level: {{{currentFitnessLevel}}}

Workout Plan:`,
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
