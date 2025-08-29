export interface User {
  id: string;
  name: string;
  email: string;
  isArtist: boolean;
}

export interface Product {
  id: string;
  artistId: string;
  name: string;              // maps from "title" in form
  description: string;
  price: number;
  createdAt: string;
  images: string[];          // product images
  audio: string | null;      // optional audio file
  category: string;          // category of the product
  tags: string[];            // tags for the product
  aiGenerated: boolean;      // AI generated or not
  likes: number;             // number of likes
  views: number;             // number of views
}
