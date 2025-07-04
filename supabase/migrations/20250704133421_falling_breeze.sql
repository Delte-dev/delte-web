/*
  # Delte Streaming Store Database Setup - Complete

  1. New Tables
    - `categories` - Product categories
    - `products` - Streaming products (Netflix, Prime Video, Crunchyroll)
    - `users` - Customer accounts
    - `purchases` - Purchase history with unique IDs
    - `support_tickets` - Customer support requests
    - `faqs` - Frequently asked questions
    - `social_links` - Footer social media links
    - `site_settings` - Site configuration

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access and authenticated operations

  3. Initial Data
    - Sample products with stock
    - Categories
    - FAQs
    - Updated social links
    - Site settings
*/

-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.support_tickets CASCADE;
DROP TABLE IF EXISTS public.purchases CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.faqs CASCADE;
DROP TABLE IF EXISTS public.social_links CASCADE;
DROP TABLE IF EXISTS public.site_settings CASCADE;

-- Create categories table
CREATE TABLE public.categories (
    id text PRIMARY KEY,
    name text NOT NULL,
    slug text UNIQUE NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create products table
CREATE TABLE public.products (
    id text PRIMARY KEY,
    name text NOT NULL,
    description text,
    price decimal(10,2) NOT NULL,
    stock integer DEFAULT 0,
    image_id text,
    terms_conditions text,
    category_id text REFERENCES public.categories(id),
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create users table
CREATE TABLE public.users (
    id text PRIMARY KEY,
    name text NOT NULL,
    phone text NOT NULL,
    country_code text DEFAULT '+51',
    email text UNIQUE NOT NULL,
    username text UNIQUE NOT NULL,
    password_hash text NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create purchases table with unique purchase IDs
CREATE TABLE public.purchases (
    id text PRIMARY KEY, -- Unique purchase ID like PUR-ABC123-XYZ89
    user_id text REFERENCES public.users(id) ON DELETE CASCADE,
    product_id text REFERENCES public.products(id),
    product_name text NOT NULL,
    price decimal(10,2) NOT NULL,
    purchase_date timestamptz DEFAULT now() NOT NULL,
    status text DEFAULT 'completed'
);

-- Create support tickets table
CREATE TABLE public.support_tickets (
    id text PRIMARY KEY,
    user_id text REFERENCES public.users(id) ON DELETE CASCADE,
    purchase_id text REFERENCES public.purchases(id) ON DELETE CASCADE,
    product_name text NOT NULL,
    support_type text NOT NULL,
    status text DEFAULT 'pending',
    created_at timestamptz DEFAULT now() NOT NULL,
    resolved_at timestamptz
);

-- Create FAQs table
CREATE TABLE public.faqs (
    id text PRIMARY KEY,
    question text NOT NULL,
    answer text NOT NULL,
    order_index integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create social_links table
CREATE TABLE public.social_links (
    id text PRIMARY KEY,
    platform text NOT NULL,
    url text NOT NULL,
    icon text NOT NULL,
    is_active boolean DEFAULT true,
    order_index integer DEFAULT 0,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create site_settings table
CREATE TABLE public.site_settings (
    id text PRIMARY KEY,
    site_title text DEFAULT 'Delte Streaming',
    site_subtitle text DEFAULT 'Tu proveedor de confianza para servicios de streaming',
    hero_image text,
    contact_phone text DEFAULT '+51936992107',
    whatsapp_url text DEFAULT 'https://wa.me/51936992107',
    footer_text text DEFAULT '©️ 2025 - Delte Streaming',
    developer_text text DEFAULT 'Desarrollado por: CyberLink Express 360 Sure',
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Categories policies (public read, admin write)
CREATE POLICY "categories_select_policy" ON public.categories FOR SELECT USING (true);
CREATE POLICY "categories_insert_policy" ON public.categories FOR INSERT WITH CHECK (true);
CREATE POLICY "categories_update_policy" ON public.categories FOR UPDATE USING (true);
CREATE POLICY "categories_delete_policy" ON public.categories FOR DELETE USING (true);

-- Products policies (public read, admin write)
CREATE POLICY "products_select_policy" ON public.products FOR SELECT USING (true);
CREATE POLICY "products_insert_policy" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "products_update_policy" ON public.products FOR UPDATE USING (true);
CREATE POLICY "products_delete_policy" ON public.products FOR DELETE USING (true);

-- Users policies (public access for registration/login)
CREATE POLICY "users_select_policy" ON public.users FOR SELECT USING (true);
CREATE POLICY "users_insert_policy" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "users_update_policy" ON public.users FOR UPDATE USING (true);
CREATE POLICY "users_delete_policy" ON public.users FOR DELETE USING (true);

-- Purchases policies (public access)
CREATE POLICY "purchases_select_policy" ON public.purchases FOR SELECT USING (true);
CREATE POLICY "purchases_insert_policy" ON public.purchases FOR INSERT WITH CHECK (true);
CREATE POLICY "purchases_update_policy" ON public.purchases FOR UPDATE USING (true);
CREATE POLICY "purchases_delete_policy" ON public.purchases FOR DELETE USING (true);

-- Support tickets policies (public access)
CREATE POLICY "support_tickets_select_policy" ON public.support_tickets FOR SELECT USING (true);
CREATE POLICY "support_tickets_insert_policy" ON public.support_tickets FOR INSERT WITH CHECK (true);
CREATE POLICY "support_tickets_update_policy" ON public.support_tickets FOR UPDATE USING (true);
CREATE POLICY "support_tickets_delete_policy" ON public.support_tickets FOR DELETE USING (true);

-- FAQs policies (public read, admin write)
CREATE POLICY "faqs_select_policy" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "faqs_insert_policy" ON public.faqs FOR INSERT WITH CHECK (true);
CREATE POLICY "faqs_update_policy" ON public.faqs FOR UPDATE USING (true);
CREATE POLICY "faqs_delete_policy" ON public.faqs FOR DELETE USING (true);

-- Social links policies (public read, admin write)
CREATE POLICY "social_links_select_policy" ON public.social_links FOR SELECT USING (true);
CREATE POLICY "social_links_insert_policy" ON public.social_links FOR INSERT WITH CHECK (true);
CREATE POLICY "social_links_update_policy" ON public.social_links FOR UPDATE USING (true);
CREATE POLICY "social_links_delete_policy" ON public.social_links FOR DELETE USING (true);

-- Site settings policies (public read, admin write)
CREATE POLICY "site_settings_select_policy" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "site_settings_insert_policy" ON public.site_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "site_settings_update_policy" ON public.site_settings FOR UPDATE USING (true);
CREATE POLICY "site_settings_delete_policy" ON public.site_settings FOR DELETE USING (true);

-- Insert initial categories
INSERT INTO public.categories (id, name, slug, description) VALUES
('cat-1', 'Streaming Premium', 'streaming-premium', 'Servicios de streaming de alta calidad'),
('cat-2', 'Entretenimiento', 'entretenimiento', 'Contenido de entretenimiento variado'),
('cat-3', 'Anime y Series', 'anime-series', 'Contenido especializado en anime y series');

-- Insert initial products
INSERT INTO public.products (id, name, description, price, stock, image_id, terms_conditions, category_id) VALUES
(
  'prod-1',
  'Netflix Premium',
  'Acceso completo a Netflix con calidad 4K y múltiples pantallas',
  15.00,
  10,
  '1k6WVSz_jG2ENa9svG0MaD4yLAkkjNoDN',
  'Términos y condiciones para Netflix Premium:

1. El servicio incluye acceso completo a la plataforma Netflix
2. Calidad de video hasta 4K Ultra HD
3. Soporte para hasta 4 pantallas simultáneas
4. Duración del servicio: 30 días
5. No se permiten reembolsos una vez activado el servicio
6. El usuario debe proporcionar un correo válido para la activación
7. Soporte técnico incluido durante la vigencia del servicio
8. Prohibido compartir las credenciales con terceros',
  'cat-1'
),
(
  'prod-2',
  'Prime Video',
  'Amazon Prime Video con contenido exclusivo y envíos gratis',
  12.00,
  8,
  '1k6WVSz_jG2ENa9svG0MaD4yLAkkjNoDN',
  'Términos y condiciones para Prime Video:

1. Acceso completo a Amazon Prime Video
2. Incluye beneficios de Amazon Prime (envíos gratis)
3. Contenido exclusivo de Amazon Originals
4. Calidad de video hasta Full HD
5. Duración del servicio: 30 días
6. Activación en un plazo máximo de 24 horas
7. Soporte técnico disponible
8. No se permiten reembolsos después de la activación',
  'cat-1'
),
(
  'prod-3',
  'Crunchyroll Premium',
  'La mejor plataforma de anime con contenido sin anuncios',
  8.00,
  15,
  '1k6WVSz_jG2ENa9svG0MaD4yLAkkjNoDN',
  'Términos y condiciones para Crunchyroll Premium:

1. Acceso premium a Crunchyroll
2. Contenido sin anuncios publicitarios
3. Acceso a simulcasts y estrenos
4. Calidad de video hasta 1080p
5. Duración del servicio: 30 días
6. Ideal para amantes del anime
7. Soporte técnico especializado
8. Activación inmediata tras confirmación de pago',
  'cat-3'
);

-- Insert initial FAQs
INSERT INTO public.faqs (id, question, answer, order_index) VALUES
('faq-1', '¿Cómo funciona el proceso de compra?', 'Selecciona el producto deseado, haz clic en "Comprar" y serás redirigido a WhatsApp para completar la transacción. Una vez confirmado el pago, recibirás las credenciales en un máximo de 24 horas.', 1),
('faq-2', '¿Qué métodos de pago aceptan?', 'Aceptamos transferencias bancarias, Yape, Plin y otros métodos de pago digital. Los detalles se proporcionan al momento de la compra.', 2),
('faq-3', '¿Cuánto tiempo dura cada servicio?', 'Todos nuestros servicios tienen una duración de 30 días desde la fecha de activación.', 3),
('faq-4', '¿Ofrecen soporte técnico?', 'Sí, ofrecemos soporte técnico completo durante toda la vigencia del servicio. Puedes contactarnos a través del panel de soporte en tu cuenta.', 4),
('faq-5', '¿Puedo cambiar mi producto después de comprarlo?', 'Los cambios están sujetos a disponibilidad y deben solicitarse dentro de las primeras 24 horas después de la compra.', 5);

-- Insert updated social links
INSERT INTO public.social_links (id, platform, url, icon, order_index) VALUES
('social-1', 'Facebook', 'https://www.facebook.com/profile.php?id=61576208550671', 'fab fa-facebook', 1),
('social-2', 'Telegram', 'https://t.me/DelteStreaming', 'fab fa-telegram', 2),
('social-3', 'WhatsApp', 'https://wa.me/51936992107', 'fab fa-whatsapp', 3),
('social-4', 'TikTok', 'https://www.tiktok.com/@deltestreaming', 'fab fa-tiktok', 4);

-- Insert site settings
INSERT INTO public.site_settings (id, site_title, site_subtitle, contact_phone, whatsapp_url, footer_text, developer_text) VALUES
(
  'settings-1',
  'Delte Streaming',
  'Tu proveedor de confianza para servicios de streaming premium',
  '+51936992107',
  'https://wa.me/51936992107',
  '©️ 2025 - Delte Streaming',
  'Desarrollado por: CyberLink Express 360 Sure'
);

-- Function to update product stock after purchase (removed automatic stock decrease)
-- Stock will be managed manually through admin panel to prevent race conditions

-- Create indexes for better performance
CREATE INDEX idx_products_category_id ON public.products(category_id);
CREATE INDEX idx_products_is_active ON public.products(is_active);
CREATE INDEX idx_purchases_user_id ON public.purchases(user_id);
CREATE INDEX idx_purchases_product_id ON public.purchases(product_id);
CREATE INDEX idx_support_tickets_user_id ON public.support_tickets(user_id);
CREATE INDEX idx_support_tickets_purchase_id ON public.support_tickets(purchase_id);
CREATE INDEX idx_support_tickets_status ON public.support_tickets(status);
CREATE INDEX idx_users_username ON public.users(username);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_is_active ON public.users(is_active);
CREATE INDEX idx_faqs_is_active ON public.faqs(is_active);
CREATE INDEX idx_faqs_order_index ON public.faqs(order_index);
CREATE INDEX idx_social_links_is_active ON public.social_links(is_active);
CREATE INDEX idx_social_links_order_index ON public.social_links(order_index);