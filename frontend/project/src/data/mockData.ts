import type { Artist, Product } from '../types';

export const mockArtists: Artist[] = [
  {
    id: '1',
    name: 'Elena Rodriguez',
    email: 'elena@example.com',
    bio: 'Contemporary digital artist specializing in surreal landscapes and abstract compositions.',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
    specialties: ['Digital Art', 'Abstract', 'Surrealism'],
    location: 'Barcelona, Spain',
    verified: true
  },
  {
    id: '2',
    name: 'Marcus Chen',
    email: 'marcus@example.com',
    bio: 'Traditional oil painter with modern twists. Focuses on portraiture and urban scenes.',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    specialties: ['Oil Painting', 'Portraits', 'Urban Art'],
    location: 'San Francisco, CA',
    verified: true
  },
  {
    id: '3',
    name: 'Amara Johnson',
    email: 'amara@example.com',
    bio: 'Mixed media artist exploring themes of identity and culture through vibrant colors.',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    specialties: ['Mixed Media', 'Cultural Art', 'Collage'],
    location: 'Brooklyn, NY',
    verified: false
  }
];

export const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Ethereal Dreamscape',
    description: 'A mesmerizing digital composition that explores the boundaries between reality and dreams.',
    price: 350,
    images: [
      'https://images.pexels.com/photos/1303081/pexels-photo-1303081.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1070945/pexels-photo-1070945.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    category: 'Digital Art',
    artistId: '1',
    tags: ['abstract', 'surreal', 'digital'],
    aiGenerated: false,
    createdAt: '2024-01-15T10:30:00Z',
    likes: 124,
    views: 1205
  },
  {
    id: '2',
    title: 'Urban Solitude',
    description: 'Oil on canvas capturing the quiet moments in busy city life.',
    price: 750,
    images: [
      'https://images.pexels.com/photos/1612351/pexels-photo-1612351.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    category: 'Oil Painting',
    artistId: '2',
    tags: ['urban', 'realism', 'contemporary'],
    aiGenerated: true,
    videoReel: 'https://example.com/reel1.mp4',
    createdAt: '2024-01-14T16:45:00Z',
    likes: 89,
    views: 542
  },
  {
    id: '3',
    title: 'Cultural Mosaic',
    description: 'Mixed media piece celebrating diversity and cultural heritage.',
    price: 420,
    images: [
      'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    category: 'Mixed Media',
    artistId: '3',
    tags: ['cultural', 'diversity', 'mixed-media'],
    aiGenerated: false,
    createdAt: '2024-01-13T09:20:00Z',
    likes: 67,
    views: 398
  },
  {
    id: '4',
    title: 'Cosmic Journey',
    description: 'AI-generated reel showcasing a journey through space and time.',
    price: 280,
    images: [
      'https://images.pexels.com/photos/1274260/pexels-photo-1274260.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    category: 'Digital Art',
    artistId: '1',
    tags: ['space', 'cosmic', 'ai-generated'],
    aiGenerated: true,
    videoReel: 'https://example.com/reel2.mp4',
    createdAt: '2024-01-12T14:15:00Z',
    likes: 156,
    views: 923
  },
  {
    id: '5',
    title: 'Abstract Emotions',
    description: 'A vibrant exploration of human emotions through abstract forms and colors.',
    price: 510,
    images: [
      'https://images.pexels.com/photos/1193743/pexels-photo-1193743.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    category: 'Abstract',
    artistId: '2',
    tags: ['emotions', 'abstract', 'colorful'],
    aiGenerated: true,
    videoReel: 'https://example.com/reel3.mp4',
    createdAt: '2024-01-11T11:30:00Z',
    likes: 203,
    views: 1456
  }
];