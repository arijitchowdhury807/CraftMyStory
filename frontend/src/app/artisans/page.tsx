'use client';

import { useState, useMemo } from 'react';
import { artisans, getCountries, getCrafts } from '../../lib/artisans-data';
import { ArtisanCard } from '../../components/ArtisanCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Globe, Palette } from 'lucide-react';

export default function ArtisansPage() {
  const [countryFilter, setCountryFilter] = useState('all');
  const [craftFilter, setCraftFilter] = useState('all');

  const countries = useMemo(() => getCountries(), []);
  const crafts = useMemo(() => getCrafts(), []);

  const filteredArtisans = useMemo(() => {
    return artisans.filter((artisan) => {
      const countryMatch = countryFilter === 'all' || artisan.country === countryFilter;
      const craftMatch = craftFilter === 'all' || artisan.craft === craftFilter;
      return countryMatch && craftMatch;
    });
  }, [countryFilter, craftFilter]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline text-primary">Artisan Storefront</h1>
        <p className="mt-2 text-lg text-foreground/80">
          Explore the stories and crafts of talented artisans from around the world.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-card rounded-lg border">
        <div className="flex-1">
          <label className="flex items-center text-sm font-medium mb-1">
            <Globe className="w-4 h-4 mr-2" />
            Filter by Country
          </label>
          <Select value={countryFilter} onValueChange={setCountryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <label className="flex items-center text-sm font-medium mb-1">
             <Palette className="w-4 h-4 mr-2" />
            Filter by Craft
          </label>
          <Select value={craftFilter} onValueChange={setCraftFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Select a craft" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Crafts</SelectItem>
              {crafts.map((craft) => (
                <SelectItem key={craft} value={craft}>
                  {craft}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredArtisans.length > 0 ? (
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {filteredArtisans.map((artisan) => (
            <div key={artisan.id} className="break-inside-avoid">
              <ArtisanCard artisan={artisan} />
            </div>
          ))}
        </div>
      ) : (
         <div className="text-center py-16">
            <p className="text-foreground/70">No artisans found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
