'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { translateArtisanStory } from '../ai/flows/translate-artisan-story';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { useToast } from '../hooks/use-toast';
import { Languages, Loader2, Sparkles } from 'lucide-react';

const formSchema = z.object({
  story: z.string().min(20, 'Please enter a story of at least 20 characters.'),
  targetLanguage: z.string({ required_error: 'Please select a language.' }),
});

export function TranslateTool() {
  const [translation, setTranslation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      story: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setTranslation('');
    try {
      const result = await translateArtisanStory(values);
      setTranslation(result.translatedStory);
    } catch (error) {
      console.error('Translation failed:', error);
      toast({
        variant: 'destructive',
        title: 'Translation Failed',
        description: 'There was an error processing your request. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Translate Your Story</CardTitle>
        <CardDescription>Reach a global audience by translating your story into different languages.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="story"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Artisan Story</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tell us your story, your inspiration, your craft..." {...field} rows={8} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="targetLanguage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Translate to</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Spanish">Spanish</SelectItem>
                      <SelectItem value="French">French</SelectItem>
                      <SelectItem value="German">German</SelectItem>
                      <SelectItem value="Japanese">Japanese</SelectItem>
                      <SelectItem value="Mandarin Chinese">Mandarin Chinese</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Translating...
                </>
              ) : (
                <>
                  <Languages className="mr-2 h-4 w-4" /> Translate
                </>
              )}
            </Button>
          </form>
        </Form>

        {(isLoading || translation) && (
          <Card className="mt-6 bg-secondary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" /> AI-Powered Translation
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading && <div className="text-foreground/70">Generating translation...</div>}
              {translation && <p className="text-foreground/90 whitespace-pre-wrap">{translation}</p>}
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
