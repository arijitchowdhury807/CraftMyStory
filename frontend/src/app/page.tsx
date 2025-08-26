import { Button } from '../components/ui/button';
import { HandHeart, ShoppingBag, BookHeart, Sparkles, Languages } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="relative w-full py-24 md:py-32 lg:py-40 bg-card">
        <div className="container px-4 md:px-6 grid md:grid-cols-2 gap-10 items-center">
          <div className="flex flex-col items-start space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline text-primary">
              Artisan Story Showcase
            </h1>
            <p className="max-w-[600px] text-foreground/80 md:text-xl">
              Discover the soul behind the craft. We empower artisans by transforming their unique stories into compelling brand narratives, connecting their heritage with the global market.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Button asChild size="lg">
                <Link href="/artisans">
                  <ShoppingBag className="mr-2 h-5 w-5" /> Explore the Storefront
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/tools">
                  <HandHeart className="mr-2 h-5 w-5" /> Use AI Crafting Tools
                </Link>
              </Button>
            </div>
          </div>
          <div className="hidden md:block">
            <Image
              src="https://placehold.co/600x400.png"
              alt="Artisan crafts"
              data-ai-hint="artisan crafts"
              width={600}
              height={400}
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover"
            />
          </div>
        </div>
      </section>

      <section className="w-full py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Features at a Glance</h2>
              <p className="max-w-[900px] text-foreground/80 md:text-lg">
                From story to storefront, our AI-powered tools help artisans shine.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:grid-cols-3 lg:gap-12 mt-12">
            <div className="grid gap-2 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <BookHeart className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold font-headline">Storytelling</h3>
              <p className="text-sm text-foreground/80">
                Capture artisan stories through text, voice, or images, creating a rich, personal profile.
              </p>
            </div>
            <div className="grid gap-2 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Sparkles className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold font-headline">AI Content Creation</h3>
              <p className="text-sm text-foreground/80">
                Generate compelling product descriptions and social media posts from artisan narratives.
              </p>
            </div>
            <div className="grid gap-2 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Languages className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold font-headline">Global Reach</h3>
              <p className="text-sm text-foreground/80">
                Translate stories into multiple languages to connect with a worldwide audience.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
