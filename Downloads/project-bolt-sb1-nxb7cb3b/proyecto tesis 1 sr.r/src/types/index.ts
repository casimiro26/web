export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  brand: string;
  model: string;
  description: string;
  features: string[];
  rating: number;
  reviews: number;
  inStock: boolean;
  discount?: number;
  isFeatured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  dni: string;
  phone: string;
  address: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  paymentMethod: string;
  shippingAddress: string;
  createdAt: Date;
}

export type Theme = 'light' | 'dark';

export type CategoryType = 
  | 'auriculares'
  | 'cables'
  | 'fundas'
  | 'gamer'
  | 'monitores'
  | 'tablets'
  | 'cargadores'
  | 'mouse'
  | 'teclados';