export type TabType = 'home' | 'brand' | 'products' | 'news' | 'contact' | 'checkout' | 'account' | 'login' | 'register' | 'admin' | 'policy' | 'reset-password';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  specs: {
    label: string;
    value: string;
  }[];
  colors?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  category: string;
  date: string;
  summary: string;
  content: string;
  image: string;
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}


