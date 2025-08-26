// This file is machine-generated - edit at your own risk.

'use server';

/**
 * @fileOverview A translation AI agent for artisan stories.
 *
 * - translateArtisanStory - A function that handles the translation of artisan stories.
 * - TranslateArtisanStoryInput - The input type for the translateArtisanStory function.
 * - TranslateArtisanStoryOutput - The return type for the translateArtisanStory function.
 */

import {ai} from '../genkit';
import {z} from 'genkit';

const TranslateArtisanStoryInputSchema = z.object({
  story: z.string().describe('The artisan story to translate.'),
  targetLanguage: z.string().describe('The target language for the translation.'),
});
export type TranslateArtisanStoryInput = z.infer<
  typeof TranslateArtisanStoryInputSchema
>;

const TranslateArtisanStoryOutputSchema = z.object({
  translatedStory: z.string().describe('The translated artisan story.'),
});
export type TranslateArtisanStoryOutput = z.infer<
  typeof TranslateArtisanStoryOutputSchema
>;

export async function translateArtisanStory(
  input: TranslateArtisanStoryInput
): Promise<TranslateArtisanStoryOutput> {
  return translateArtisanStoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateArtisanStoryPrompt',
  input: {schema: TranslateArtisanStoryInputSchema},
  output: {schema: TranslateArtisanStoryOutputSchema},
  prompt: `Translate the following artisan story into {{targetLanguage}}:

{{{story}}} `,
});

const translateArtisanStoryFlow = ai.defineFlow(
  {
    name: 'translateArtisanStoryFlow',
    inputSchema: TranslateArtisanStoryInputSchema,
    outputSchema: TranslateArtisanStoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
