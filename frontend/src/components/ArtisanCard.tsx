import Image from 'next/image';
import Link from 'next/link';
import type { Artisan } from '../lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

interface ArtisanCardProps {
  artisan: Artisan;
}

export function ArtisanCard({ artisan }: ArtisanCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="font-headline">{artisan.name}</CardTitle>
        <CardDescription className="text-primary font-semibold">{artisan.craft} from {artisan.country}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="aspect-w-16 aspect-h-9">
          <Image
            src={artisan.image}
            alt={`Work by ${artisan.name}`}
            data-ai-hint={`${artisan.craft} ${artisan.country}`}
            width={400}
            height={225}
            className="rounded-md object-cover w-full"
          />
        </div>
        <p className="text-sm text-foreground/80">{artisan.bio}</p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="link" className="p-0 h-auto text-accent hover:text-accent/80">
          <Link href={`/artisans/${artisan.id}`}>
            Read Their Story <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
