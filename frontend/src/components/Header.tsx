'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HandHeart, PenSquare, ShoppingBag } from 'lucide-react';
import { cn } from '../lib/utils';

export function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/artisans', label: 'Storefront', icon: ShoppingBag },
    { href: '/tools', label: 'AI Tools', icon: HandHeart },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <PenSquare className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline text-lg">Artisan Story Showcase</span>
          </Link>
        </div>
        <nav className="flex items-center gap-6 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'transition-colors hover:text-foreground/80',
                pathname === link.href ? 'text-foreground font-semibold' : 'text-foreground/60'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
