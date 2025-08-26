import { getArtisanById } from '../../../lib/artisans-data';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Badge } from '../../../components/ui/badge';
import { Globe, Palette } from 'lucide-react';

interface ArtisanPageProps {
  params: {
    id: string;
  };
}

export default function ArtisanPage({ params }: ArtisanPageProps) {
  const artisan = getArtisanById(params.id);

  if (!artisan) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Image
            src={artisan.image}
            alt={`Portrait of ${artisan.name}`}
            data-ai-hint="artisan portrait"
            width={400}
            height={400}
            className="rounded-lg object-cover w-full aspect-square shadow-md"
          />
           <div className="mt-4 space-y-2">
            <h1 className="text-3xl font-bold font-headline">{artisan.name}</h1>
            <div className="flex flex-wrap gap-2">
                 <Badge variant="secondary" className="flex items-center gap-1">
                    <Palette className="h-3 w-3" />
                    {artisan.craft}
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    {artisan.country}
                </Badge>
            </div>
          </div>
        </div>
        <div className="md:col-span-2">
          <div className="prose prose-lg max-w-none text-foreground/90">
            <h2 className="text-2xl font-semibold font-headline text-primary mb-4">My Story</h2>
            {artisan.story.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-justify leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
