export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  isPopular?: boolean;
  isNew?: boolean;
  isSpicy?: boolean;
  ingredients?: string[];
  calories?: number;
  prepTime?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  count: number;
}
