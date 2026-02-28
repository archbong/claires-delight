// Basic typings for Claire's Delight project

// Product interface
export interface Product {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  category: Category[];
  origin: string;
  healthBenefit: string[];
  culinaryUses: string[];
  price: number;
  stock: number;
  images: string | null;
  createdAt: string;
  updatedAt: string;
  isNew?: boolean;
  discount?: number;
  rating?: number;
  reviewCount?: number;
  originalPrice?: number;
}

// Category interface
export interface Category {
  title: string;
  slug: string;
  stock: number;
}

// Cart item interface
export interface CartItem {
  product: Product;
  quantity: number;
}

// Wishlist item (same as Product for now)
export type WishlistItem = Product;

// User interface
export interface User {
  _id?: string;
  email: string;
  name?: string;
  role?: 'user' | 'admin';
}

// Order interface
export interface Order {
  _id?: string;
  items: CartItem[];
  totalAmount: number;
  user: User;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt?: string;
  updatedAt?: string;
}

// Blog post interface
export interface BlogPost {
  _id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author: string;
  publishedAt?: string;
  image?: string;
  tags?: string[];
}

// Recipe interface
export interface Recipe {
  _id?: string;
  title: string;
  slug: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  image?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}
