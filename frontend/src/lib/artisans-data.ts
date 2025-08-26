import type { Artisan } from './types';

export const artisans: Artisan[] = [
  {
    id: '1',
    name: 'Elena Garcia',
    craft: 'Pottery',
    country: 'Mexico',
    bio: 'Award-winning potter from Oaxaca, preserving ancient Zapotec techniques.',
    story: 'From a young age, I was mesmerized by the way my grandmother could turn a simple lump of clay into a beautiful, functional piece of art. She taught me the ancient Zapotec firing techniques that give our pottery its distinctive black sheen. Each piece I create is a conversation with my ancestors, a story told through earth and fire. My workshop is nestled in the valleys of Oaxaca, where the clay is rich with history and the air is filled with inspiration.',
    image: 'https://placehold.co/600x400.png',
  },
  {
    id: '2',
    name: 'Kenji Tanaka',
    craft: 'Woodworking',
    country: 'Japan',
    bio: 'Master of Japanese joinery, creating minimalist furniture that breathes.',
    story: 'In my small workshop in Kyoto, the scent of hinoki cypress fills the air. I practice kigumi, the art of joining wood without nails or screws. It is a philosophy of patience and precision. Each joint must be perfect, a seamless union that respects the life of the tree. My designs are inspired by the tranquility of Japanese gardens, aiming to bring a sense of peace and balance into the home.',
    image: 'https://placehold.co/600x400.png',
  },
  {
    id: '3',
    name: 'Amina Yusuf',
    craft: 'Textiles',
    country: 'Nigeria',
    bio: 'Textile artist from Kano, known for vibrant, modern indigo-dyed fabrics.',
    story: 'The art of indigo dyeing is a legacy passed down through generations of women in my family. We cultivate the indigo plants, harvest the leaves, and ferment them to create the magical blue dye. Using traditional resist-dyeing techniques called Adire, I create patterns that tell stories of our culture, our proverbs, and our connection to the natural world. Each cloth is a canvas of deep blue, a testament to a rich and vibrant heritage.',
    image: 'https://placehold.co/600x400.png',
  },
  {
    id: '4',
    name: 'Marco Rossi',
    craft: 'Glassblowing',
    country: 'Italy',
    bio: 'Venetian glassblower from Murano, blending traditional methods with contemporary design.',
    story: 'The heat of the furnace is where I feel most at home. On the island of Murano, my family has been blowing glass for over 500 years. I am a guardian of that flame. While I honor the classic Venetian techniques—the intricate murrine and delicate filigrana—I push the boundaries with modern forms and bold colors. My work is a dance between fire and breath, tradition and innovation.',
    image: 'https://placehold.co/600x400.png',
  },
  {
    id: '5',
    name: 'Priya Sharma',
    craft: 'Jewelry',
    country: 'India',
    bio: 'Jaipur-based jewelry maker specializing in intricate Meenakari enamel work.',
    story: 'In the bustling lanes of Jaipur, the city of gems, I practice the royal art of Meenakari. It is the delicate process of painting and decorating metal with vibrant enamel colors, a craft that once adorned emperors and queens. My designs draw from Mughal architecture and the flora of Rajasthan. Each piece is a miniature painting, a story of color and light, meticulously handcrafted to be a timeless treasure.',
    image: 'https://placehold.co/600x400.png',
  },
   {
    id: '6',
    name: 'Bjorn Eriksson',
    craft: 'Leatherworking',
    country: 'Sweden',
    bio: 'Sámi artisan from Lapland, crafting durable goods from reindeer leather.',
    story: 'In the vast, silent landscapes of northern Sweden, my ancestors, the Sámi people, have lived in harmony with nature for millennia. I continue this tradition through my leatherwork. Using vegetable-tanned reindeer leather, a byproduct of our traditional herding, I create bags, belts, and pouches. Each item is hand-stitched and often embellished with patterns from our shaman drums, carrying the spirit of the Arctic with it.',
    image: 'https://placehold.co/600x400.png',
  }
];

export const getArtisanById = (id: string): Artisan | undefined => {
  return artisans.find((artisan) => artisan.id === id);
};

export const getCountries = (): string[] => {
  return [...new Set(artisans.map((artisan) => artisan.country))];
};

export const getCrafts = (): string[] => {
  return [...new Set(artisans.map((artisan) => artisan.craft))];
};
