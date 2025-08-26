'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { TranslateTool } from '../../components/TranslateTool';
import { GenerateContentTool } from '../../components/GenerateContentTool';
import { Languages, Sparkles } from 'lucide-react';

export default function ToolsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline text-primary">AI Crafting Tools</h1>
        <p className="mt-2 text-lg text-foreground/80">
          Amplify your story and reach a global audience with our powerful AI assistants.
        </p>
      </div>
      <Tabs defaultValue="translate" className="w-full max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="translate">
            <Languages className="mr-2 h-4 w-4" />
            Translate Story
          </TabsTrigger>
          <TabsTrigger value="generate-content">
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Content
          </TabsTrigger>
        </TabsList>
        <TabsContent value="translate" className="mt-6">
          <TranslateTool />
        </TabsContent>
        <TabsContent value="generate-content" className="mt-6">
          <GenerateContentTool />
        </TabsContent>
      </Tabs>
    </div>
  );
}
