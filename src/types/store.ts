export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  image_id?: string;
  terms_conditions?: string;
  category_id?: string;
  category?: Category;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  country_code: string;
  email: string;
  username: string;
  password_hash: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Purchase {
  id: string;
  user_id: string;
  product_id: string;
  product_name: string;
  price: number;
  purchase_date: string;
  status: string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  purchase_id: string;
  product_name: string;
  support_type: string;
  status: string;
  created_at: string;
  resolved_at?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id: string;
  site_title: string;
  site_subtitle: string;
  hero_image?: string;
  contact_phone: string;
  whatsapp_url: string;
  footer_text: string;
  developer_text: string;
  created_at: string;
  updated_at: string;
}

export interface CountryCode {
  code: string;
  flag: string;
  name: string;
}

export type Theme = 'light' | 'dark';

export type SupportType = 'Codigo' | 'Hogar' | 'Email' | 'Pago' | 'Geo' | 'Otros';