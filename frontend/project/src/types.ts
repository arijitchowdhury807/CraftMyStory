// src/types.ts
export interface User {
  id: string;
  name: string;
  email: string;
  isArtist: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  artistId: string;
  createdAt: string;
}
