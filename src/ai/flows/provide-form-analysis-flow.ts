
'use server';

/**
 * @fileOverview Real-time form analysis using webcam/computer vision to provide biomechanical feedback.
 *
 * - provideFormAnalysis - A function that handles the form analysis process.
 * - ProvideFormAnalysisInput - The input type for the provideFormAnalysis function.
 * - ProvideFormAnalysisOutput - The return type for the provideFormAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideFormAnalysisInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "A video stream of the user performing an exercise, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  exerciseName: z.string().describe('The name of the exercise being performed.'),
  focusArea: z
    .enum([
      'overall',
      'back_posture',
      'knee_alignment',
      'elbow_position',
      'core_engagement',
      'foot_placement',
    ])
    .optional()
    .describe('Optional: A specific area the user wants the AI to focus on during analysis.'),
  notes: z
    .string()
    .optional()
    .describe('Optional: Any specific notes or concerns the user has about performing this exercise.'),
});
export type ProvideFormAnalysisInput = z.infer<typeof ProvideFormAnalysisInputSchema>;

const ProvideFormAnalysisOutputSchema = z.object({
  feedback: z.string().describe('The biomechanical feedback and corrections for the user.'),
  injuryPreventionAlert: z.string().optional().describe('Alert message if the form poses a risk of injury.'),
});
export type ProvideFormAnalysisOutput = z.infer<typeof ProvideFormAnalysisOutputSchema>;

export async function provideFormAnalysis(input: ProvideFormAnalysisInput): Promise<ProvideFormAnalysisOutput> {
  return provideFormAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideFormAnalysisPrompt',
  input: {schema: ProvideFormAnalysisInputSchema},
  output: {schema: ProvideFormAnalysisOutputSchema},
  prompt: `You are an AI-powered fitness coach that specializes in form analysis and injury prevention.

You will receive a video stream of the user performing the following exercise: {{{exerciseName}}}.
{{#if focusArea}}The user has requested a specific focus on: {{{focusArea}}}. Prioritize feedback related to this area if possible, while still providing an overall assessment.{{/if}}
{{#if notes}}The user has provided the following notes/concerns: "{{{notes}}}". Please consider these in your analysis.{{/if}}

You will analyze the user's form in real-time and provide biomechanical feedback and corrections. Be specific and actionable.
If the user's form poses a risk of injury, you will provide an alert message in the 'injuryPreventionAlert' field. Otherwise, this field can be omitted.

Video: {{media url=videoDataUri}}
`,
});

const provideFormAnalysisFlow = ai.defineFlow(
  {
    name: 'provideFormAnalysisFlow',
    inputSchema: ProvideFormAnalysisInputSchema,
    outputSchema: ProvideFormAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

