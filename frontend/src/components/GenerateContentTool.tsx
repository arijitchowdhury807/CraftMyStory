'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateProductDescriptions } from '../ai/flows/generate-product-descriptions';
import type { GenerateProductDescriptionsOutput } from '../ai/flows/generate-product-descriptions';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useToast } from '../hooks/use-toast';
import { Loader2, Sparkles } from 'lucide-react';

const formSchema = z.object({
  artisanStory: z.string().min(20, 'Please enter a story of at least 20 characters.'),
  productName: z.string().min(2, 'Please enter a product name.'),
  productCategory: z.string().min(2, 'Please enter a product category.'),
  targetAudience: z.string().min(2, 'Please describe your target audience.'),
});

export function GenerateContentTool() {
  const [generatedContent, setGeneratedContent] = useState<GenerateProductDescriptionsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      artisanStory: '',
      productName: '',
      productCategory: '',
      targetAudience: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setGeneratedContent(null);
    try {
      const result = await generateProductDescriptions(values);
      setGeneratedContent(result);
    } catch (error) {
      console.error('Content generation failed:', error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: 'There was an error creating content. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Product Content</CardTitle>
        <CardDescription>Create compelling descriptions, social media posts, and keywords from your story.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="artisanStory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Artisan Story</FormLabel>
                  <FormControl>
                    <Textarea placeholder="The story behind your craft..." {...field} rows={6} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="productName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 'Oaxacan Sunrise' Vase" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="productCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Category</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Pottery, Jewelry" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="targetAudience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Audience</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Lovers of handmade, ethical decor" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" /> Generate Content
                </>
              )}
            </Button>
          </form>
        </Form>

        {(isLoading || generatedContent) && (
          <div className="mt-6 space-y-4">
            <h3 className="text-xl font-headline font-bold text-primary">Generated Content</h3>
            {isLoading && <div className="text-foreground/70">Our AI is crafting your content...</div>}
            {generatedContent && (
              <div className="space-y-4">
                <Card className="bg-secondary">
                  <CardHeader>
                    <CardTitle>Product Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/90 whitespace-pre-wrap">{generatedContent.productDescription}</p>
                  </CardContent>
                </Card>
                <Card className="bg-secondary">
                  <CardHeader>
                    <CardTitle>Social Media Post</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/90 whitespace-pre-wrap">{generatedContent.socialMediaPost}</p>
                  </CardContent>
                </Card>
                 <Card className="bg-secondary">
                  <CardHeader>
                    <CardTitle>SEO Keywords</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/90">{generatedContent.seoKeywords}</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
