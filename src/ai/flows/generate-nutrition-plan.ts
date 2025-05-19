
'use server';
/**
 * @fileOverview Generates a personalized nutrition plan based on user dietary preferences and health goals.
 *
 * - generateNutritionPlan - A function that generates a nutrition plan.
 * - GenerateNutritionPlanInput - The input type for the generateNutritionPlan function.
 * - GenerateNutritionPlanOutput - The return type for the generateNutritionPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateNutritionPlanInputSchema = z.object({
  dietaryPreferences: z
    .string()
    .min(10, { message: 'Dietary preferences must be at least 10 characters.' })
    .describe('The user\'s primary dietary preferences, e.g., vegetarian, vegan, omnivore, specific restrictions.'),
  healthGoals: z
    .string()
    .min(10, { message: 'Health goals must be at least 10 characters.' })
    .describe('The user\'s health and fitness goals, e.g., weight loss, muscle gain, improved energy levels, managing a condition.'),
  allergies: z
    .string()
    .optional()
    .describe('Any food allergies or intolerances the user has, e.g., gluten, dairy, nuts.'),
  cuisinePreferences: z
    .string()
    .optional()
    .describe('Preferred types of cuisine, e.g., Indian, Mediterranean, Italian, Mexican.'),
  dailyActivityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very_active']).describe('User\'s general daily activity level.'),
  currentMood: z.enum(['positive', 'neutral', 'stressed', 'low_energy']).optional().describe('User\'s current mood, which can affect appetite or food choices.'),
  lifestyleContext: z.string().optional().describe('Brief description of daily routine or lifestyle factors relevant to diet, e.g., busy schedule, frequent travel, works night shifts, specific mealtime constraints.')
});
export type GenerateNutritionPlanInput = z.infer<typeof GenerateNutritionPlanInputSchema>;

const GenerateNutritionPlanOutputSchema = z.object({
  nutritionPlan: z.string().describe('The detailed, personalized nutrition plan generated for the user, including meal suggestions and guidelines.'),
});
export type GenerateNutritionPlanOutput = z.infer<typeof GenerateNutritionPlanOutputSchema>;

export async function generateNutritionPlan(
  input: GenerateNutritionPlanInput
): Promise<GenerateNutritionPlanOutput> {
  return generateNutritionPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateNutritionPlanPrompt',
  input: {schema: GenerateNutritionPlanInputSchema},
  output: {schema: GenerateNutritionPlanOutputSchema},
  prompt: `You are an expert nutritionist and dietitian. Your task is to create a comprehensive, personalized 7-day nutrition plan for a user.
The plan should be practical, balanced, sustainable, and tailored to their specific dietary preferences, health goals, allergies, cuisine preferences, daily activity level, current mood, and lifestyle context.
Provide example meal ideas for breakfast, lunch, dinner, and snacks for each of the 7 days. Include general dietary guidelines and tips relevant to their goals.
Consider the user's mood: if stressed or low energy, suggest comfort foods that are still healthy or energy-boosting options.
Factor in lifestyle context: if they have a busy schedule, suggest quick and easy meals.

User Details:
- Dietary Preferences: {{{dietaryPreferences}}}
- Health Goals: {{{healthGoals}}}
- Allergies/Intolerances: {{#if allergies}}{{{allergies}}}{{else}}None specified{{/if}}
- Cuisine Preferences: {{#if cuisinePreferences}}{{{cuisinePreferences}}}{{else}}Any suitable cuisine{{/if}}
- Daily Activity Level: {{{dailyActivityLevel}}}
{{#if currentMood}}- Current Mood: {{{currentMood}}}{{/if}}
{{#if lifestyleContext}}- Lifestyle Context: {{{lifestyleContext}}}{{/if}}

Generate a detailed 7-day nutrition plan based on this information.
Nutrition Plan:
`,
});

const generateNutritionPlanFlow = ai.defineFlow(
  {
    name: 'generateNutritionPlanFlow',
    inputSchema: GenerateNutritionPlanInputSchema,
    outputSchema: GenerateNutritionPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
