// src/ai/flows/provide-ai-coach.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing an AI fitness coach.
 *
 * - aiCoach - A function that provides personalized fitness guidance and motivation.
 * - AiCoachInput - The input type for the aiCoach function.
 * - AiCoachOutput - The return type for the aiCoach function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiCoachInputSchema = z.object({
  language: z.enum(['English', 'Hindi']).describe('The language to use for the AI coach.'),
  fitnessGoal: z.string().describe('The user\u2019s fitness goal (e.g., lose weight, gain muscle).'),
  workoutHistory: z.string().describe('A summary of the user\u2019s workout history.'),
  userMessage: z.string().describe('The user\u2019s message to the AI coach.'),
});
export type AiCoachInput = z.infer<typeof AiCoachInputSchema>;

const AiCoachOutputSchema = z.object({
  coachResponse: z.string().describe('The AI coach\u2019s response to the user.'),
});
export type AiCoachOutput = z.infer<typeof AiCoachOutputSchema>;

export async function aiCoach(input: AiCoachInput): Promise<AiCoachOutput> {
  return aiCoachFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiCoachPrompt',
  input: {schema: AiCoachInputSchema},
  output: {schema: AiCoachOutputSchema},
  prompt: `You are an AI fitness coach providing personalized guidance and motivation to users.

  Your responses should be encouraging and tailored to the user's fitness goal and workout history. Use the specified language.

  Language: {{{language}}}
  Fitness Goal: {{{fitnessGoal}}}
  Workout History: {{{workoutHistory}}}

  User Message: {{{userMessage}}}

  Coach Response:`,
});

const aiCoachFlow = ai.defineFlow(
  {
    name: 'aiCoachFlow',
    inputSchema: AiCoachInputSchema,
    outputSchema: AiCoachOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
