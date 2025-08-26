'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating product descriptions and social media posts from an artisan's story.
 *
 * - generateProductDescriptions - A function that triggers the product description generation process.
 * - GenerateProductDescriptionsInput - The input type for the generateProductDescriptions function.
 * - GenerateProductDescriptionsOutput - The return type for the generateProductDescriptions function.
 */

import {ai} from '../genkit';
import {z} from 'genkit';

const GenerateProductDescriptionsInputSchema = z.object({
  artisanStory: z.string().describe('The artisan\'s story, including details about their craft, inspiration, and background.'),
  productName: z.string().describe('The name of the product.'),
  productCategory: z.string().describe('The category of the product (e.g., jewelry, pottery, textiles).'),
  targetAudience: z.string().describe('Description of the ideal customer for this product.'),
});
export type GenerateProductDescriptionsInput = z.infer<typeof GenerateProductDescriptionsInputSchema>;

const GenerateProductDescriptionsOutputSchema = z.object({
  productDescription: z.string().describe('A compelling product description suitable for an online marketplace.'),
  socialMediaPost: z.string().describe('A short and engaging social media post to promote the product.'),
  seoKeywords: z.string().describe('A comma separated list of relevant SEO keywords'),
});
export type GenerateProductDescriptionsOutput = z.infer<typeof GenerateProductDescriptionsOutputSchema>;

export async function generateProductDescriptions(input: GenerateProductDescriptionsInput): Promise<GenerateProductDescriptionsOutput> {
  return generateProductDescriptionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProductDescriptionsPrompt',
  input: {schema: GenerateProductDescriptionsInputSchema},
  output: {schema: GenerateProductDescriptionsOutputSchema},
  prompt: `You are an expert marketing copywriter specializing in crafting compelling product descriptions and social media posts for artisan goods.

  Given the following information about an artisan's story, product name, product category, and target audience, generate a product description, a social media post, and some SEO keywords.

  Artisan Story: {{{artisanStory}}}
  Product Name: {{{productName}}}
  Product Category: {{{productCategory}}}
  Target Audience: {{{targetAudience}}}

  Product Description:
  Social Media Post:
  SEO Keywords: `,
});

const generateProductDescriptionsFlow = ai.defineFlow(
  {
    name: 'generateProductDescriptionsFlow',
    inputSchema: GenerateProductDescriptionsInputSchema,
    outputSchema: GenerateProductDescriptionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
