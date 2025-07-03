/*
  # Chacha Guayas Driver Blog Database Setup

  1. New Tables
    - `categories` - Blog post categories
    - `blog_posts` - Blog articles with rich content
    - `faqs` - Frequently asked questions
    - `social_links` - Social media links
    - `site_settings` - Site configuration

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Add policies for public write access (for admin functionality)

  3. Initial Data
    - Sample blog posts with content from HTML
    - Categories with proper counts
    - FAQs from the original design
    - Social links and site settings
*/

-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.blog_posts CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.faqs CASCADE;
DROP TABLE IF EXISTS public.social_links CASCADE;
DROP TABLE IF EXISTS public.site_settings CASCADE;

-- Create categories table
CREATE TABLE public.categories (
    id text PRIMARY KEY,
    name text NOT NULL,
    slug text UNIQUE NOT NULL,
    description text,
    post_count integer DEFAULT 0,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create blog_posts table
CREATE TABLE public.blog_posts (
    id text PRIMARY KEY,
    title text NOT NULL,
    slug text UNIQUE NOT NULL,
    excerpt text NOT NULL,
    content text NOT NULL,
    featured_image text,
    featured_video text,
    category_id text REFERENCES public.categories(id),
    is_published boolean DEFAULT true,
    published_at timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
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
    site_title text DEFAULT 'Chacha Guayas Driver',
    site_subtitle text DEFAULT 'Consejos de viaje, noticias locales y beneficios del taxi privado',
    hero_image text,
    contact_phone text DEFAULT '+51975483456',
    contact_email text,
    whatsapp_url text,
    reservation_url text,
    footer_text text DEFAULT 'Chacha Guayas Driver. Todos los derechos reservados.',
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Blog posts policies (public access for all operations)
CREATE POLICY "blog_posts_select_policy" ON public.blog_posts FOR SELECT USING (true);
CREATE POLICY "blog_posts_insert_policy" ON public.blog_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "blog_posts_update_policy" ON public.blog_posts FOR UPDATE USING (true);
CREATE POLICY "blog_posts_delete_policy" ON public.blog_posts FOR DELETE USING (true);

-- Categories policies (public access for all operations)
CREATE POLICY "categories_select_policy" ON public.categories FOR SELECT USING (true);
CREATE POLICY "categories_insert_policy" ON public.categories FOR INSERT WITH CHECK (true);
CREATE POLICY "categories_update_policy" ON public.categories FOR UPDATE USING (true);
CREATE POLICY "categories_delete_policy" ON public.categories FOR DELETE USING (true);

-- FAQs policies (public access for all operations)
CREATE POLICY "faqs_select_policy" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "faqs_insert_policy" ON public.faqs FOR INSERT WITH CHECK (true);
CREATE POLICY "faqs_update_policy" ON public.faqs FOR UPDATE USING (true);
CREATE POLICY "faqs_delete_policy" ON public.faqs FOR DELETE USING (true);

-- Social links policies (public access for all operations)
CREATE POLICY "social_links_select_policy" ON public.social_links FOR SELECT USING (true);
CREATE POLICY "social_links_insert_policy" ON public.social_links FOR INSERT WITH CHECK (true);
CREATE POLICY "social_links_update_policy" ON public.social_links FOR UPDATE USING (true);
CREATE POLICY "social_links_delete_policy" ON public.social_links FOR DELETE USING (true);

-- Site settings policies (public access for all operations)
CREATE POLICY "site_settings_select_policy" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "site_settings_insert_policy" ON public.site_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "site_settings_update_policy" ON public.site_settings FOR UPDATE USING (true);
CREATE POLICY "site_settings_delete_policy" ON public.site_settings FOR DELETE USING (true);

-- Insert initial categories
INSERT INTO public.categories (id, name, slug, description, post_count) VALUES
('cat-1', 'Consejos de Viaje', 'consejos-de-viaje', 'Tips y recomendaciones para viajes seguros y cómodos', 1),
('cat-2', 'Noticias Locales', 'noticias-locales', 'Últimas noticias y eventos de la ciudad', 1),
('cat-3', 'Seguridad', 'seguridad', 'Información sobre seguridad en el transporte', 1),
('cat-4', 'Promociones', 'promociones', 'Ofertas especiales y descuentos', 0),
('cat-5', 'Testimonios', 'testimonios', 'Experiencias de nuestros clientes', 0);

-- Insert initial blog posts
INSERT INTO public.blog_posts (id, title, slug, excerpt, content, featured_image, category_id, published_at) VALUES
(
  'post-1',
  '5 Consejos para Viajes Seguros en Taxi',
  '5-consejos-para-viajes-seguros-en-taxi',
  'Descubre cómo garantizar tu seguridad durante tus viajes en taxi con estos consejos prácticos que todo pasajero debería conocer...',
  '<h2>5 Consejos Esenciales para Viajes Seguros en Taxi</h2>

<p>La seguridad durante los viajes en taxi es una prioridad fundamental tanto para pasajeros como para conductores. En Chacha Guayas Driver, nos comprometemos a brindar un servicio seguro y confiable. Aquí te compartimos cinco consejos esenciales para garantizar tu seguridad:</p>

<h3>1. Verifica la Identidad del Conductor</h3>
<p>Antes de subir al vehículo, asegúrate de que el conductor coincida con la información proporcionada. En nuestro servicio, siempre proporcionamos el nombre del conductor y la placa del vehículo antes del viaje.</p>

<h3>2. Comparte tu Ubicación</h3>
<p>Informa a un familiar o amigo sobre tu viaje, incluyendo la hora de salida, destino y datos del taxi. Esto es especialmente importante para viajes nocturnos o a lugares remotos.</p>

<h3>3. Mantén tus Pertenencias Seguras</h3>
<p>Guarda tus objetos de valor en lugares seguros y mantén tu teléfono móvil siempre a mano. Evita mostrar grandes cantidades de dinero o dispositivos costosos.</p>

<h3>4. Conoce tu Ruta</h3>
<p>Familiarízate con la ruta más común a tu destino. Si notas que el conductor toma un camino inusual, no dudes en preguntar o solicitar una explicación.</p>

<h3>5. Confía en tu Instinto</h3>
<p>Si algo no se siente bien durante el viaje, no dudes en expresar tus preocupaciones. Un conductor profesional siempre estará dispuesto a aclarar cualquier duda.</p>

<p><strong>En Chacha Guayas Driver, tu seguridad es nuestra prioridad. Contacta con nosotros para un servicio de taxi seguro y confiable.</strong></p>',
  'https://drive.google.com/thumbnail?id=1PCfCYL60YOhdoc4QSF9uOZoY7AOQQ0HD&sz=w1000',
  'cat-3',
  '2025-06-15 10:00:00'
),
(
  'post-2',
  'Ventajas del Servicio de Taxi Privado',
  'ventajas-del-servicio-de-taxi-privado',
  'Te explicamos por qué elegir un servicio de taxi privado como Chacha Guayas Driver puede mejorar significativamente tu experiencia de viaje...',
  '<h2>¿Por Qué Elegir un Servicio de Taxi Privado?</h2>

<p>En un mundo donde la movilidad urbana se vuelve cada vez más compleja, los servicios de taxi privado emergen como una solución superior para el transporte personal. Chacha Guayas Driver ofrece ventajas únicas que transforman tu experiencia de viaje.</p>

<h3>Comodidad y Conveniencia</h3>
<p>Con nuestro servicio privado, no necesitas esperar en largas filas o competir por un taxi disponible. Reservas tu viaje con anticipación y nosotros llegamos puntualmente a recogerte.</p>

<h3>Seguridad Garantizada</h3>
<p>Conoces al conductor antes del viaje, el vehículo está identificado y mantenemos un registro completo de todos los trayectos. Tu seguridad es nuestra máxima prioridad.</p>

<h3>Tarifas Transparentes</h3>
<p>Sin sorpresas en el precio final. Conoces el costo de tu viaje antes de iniciarlo, sin recargos ocultos ni tarifas variables por tráfico.</p>

<h3>Servicio Personalizado</h3>
<p>Adaptamos nuestro servicio a tus necesidades específicas: viajes al aeropuerto, eventos especiales, traslados corporativos o simplemente movilidad diaria.</p>

<h3>Vehículos en Óptimas Condiciones</h3>
<p>Nuestros vehículos reciben mantenimiento regular y están equipados con todas las medidas de seguridad necesarias para un viaje cómodo y seguro.</p>

<p><strong>Experimenta la diferencia de viajar con Chacha Guayas Driver. Reserva tu próximo viaje y descubre por qué somos la opción preferida.</strong></p>',
  'https://drive.google.com/file/d/1PCfCYL60YOhdoc4QSF9uOZoY7AOQQ0HD/preview',
  'cat-1',
  '2025-06-10 14:30:00'
),
(
  'post-3',
  'Eventos Locales: Cómo Llegar sin Problemas',
  'eventos-locales-como-llegar-sin-problemas',
  'Conoce los próximos eventos en la ciudad y cómo nuestro servicio de taxi puede llevarte allí sin preocupaciones por el estacionamiento...',
  '<h2>Disfruta de los Eventos Locales sin Preocupaciones</h2>

<p>La ciudad está llena de eventos emocionantes durante todo el año: conciertos, festivales, eventos deportivos y celebraciones culturales. Sin embargo, llegar a estos eventos puede ser un desafío debido al tráfico y la falta de estacionamiento.</p>

<h3>Próximos Eventos Destacados</h3>
<ul>
<li><strong>Festival de Música Local</strong> - Centro de la ciudad, 25 de Junio</li>
<li><strong>Feria Gastronómica</strong> - Parque Central, 2-4 de Julio</li>
<li><strong>Partido de Fútbol Local</strong> - Estadio Municipal, 8 de Julio</li>
<li><strong>Exposición de Arte</strong> - Museo de la Ciudad, Todo Julio</li>
</ul>

<h3>Ventajas de Usar Nuestro Servicio para Eventos</h3>

<h4>Sin Estrés por Estacionamiento</h4>
<p>Olvídate de buscar estacionamiento en zonas congestionadas. Te dejamos en la puerta del evento y te recogemos cuando termines.</p>

<h4>Evita el Tráfico</h4>
<p>Conocemos las mejores rutas y horarios para evitar las horas pico. Llegamos a tiempo para que no te pierdas nada del evento.</p>

<h4>Servicio de Recogida Programada</h4>
<p>Programa tu recogida para el final del evento. No tendrás que esperar o caminar largas distancias hasta tu vehículo.</p>

<h4>Viajes Grupales</h4>
<p>¿Vas con amigos? Podemos coordinar el transporte para grupos, asegurando que todos lleguen juntos y seguros.</p>

<h3>Tarifas Especiales para Eventos</h3>
<p>Ofrecemos tarifas preferenciales para eventos locales. Consulta nuestras promociones especiales para grupos y viajes de ida y vuelta.</p>

<p><strong>No dejes que el transporte arruine tu diversión. Reserva con Chacha Guayas Driver y disfruta al máximo de cada evento.</strong></p>',
  'https://drive.google.com/thumbnail?id=1PCfCYL60YOhdoc4QSF9uOZoY7AOQQ0HD&sz=w1000',
  'cat-2',
  '2025-06-05 09:15:00'
);

-- Insert initial FAQs (from the original HTML)
INSERT INTO public.faqs (id, question, answer, order_index) VALUES
('faq-1', '¿Cómo reservar un taxi con anticipación?', 'Puedes reservar con anticipación llamando al +51 975 483 456 o enviando un mensaje por WhatsApp. Recomendamos reservar al menos con 1 hora de anticipación para garantizar disponibilidad.', 1),
('faq-2', '¿Qué métodos de pago aceptan?', 'Aceptamos efectivo, transferencias bancarias y pagos con tarjeta a través de nuestro sistema seguro. También puedes pagar mediante Yape o Plin.', 2),
('faq-3', '¿Ofrecen servicio para aeropuertos?', 'Sí, ofrecemos servicio especializado para aeropuertos con seguimiento de vuelos incluido. Nos aseguramos de llegar puntualmente para tu recogida, sin importar retrasos en tu vuelo.', 3),
('faq-4', '¿Tienen tarifas fijas para destinos comunes?', 'Sí, contamos con tarifas fijas para los destinos más solicitados en la ciudad. Puedes consultar nuestras tarifas especiales llamando o enviando un mensaje.', 4);

-- Insert social links (from the original HTML)
INSERT INTO public.social_links (id, platform, url, icon, order_index) VALUES
('social-1', 'Facebook', 'https://www.facebook.com/daniel.melendezfernandez.7', 'fab fa-facebook-f', 1);

-- Insert site settings (from the original HTML)
INSERT INTO public.site_settings (id, site_title, site_subtitle, hero_image, contact_phone, whatsapp_url, reservation_url, footer_text) VALUES
(
  'settings-1',
  'Chacha Guayas Driver',
  'Consejos de viaje, noticias locales y beneficios del taxi privado',
  'https://drive.google.com/thumbnail?id=1PCfCYL60YOhdoc4QSF9uOZoY7AOQQ0HD&sz=w1000',
  '+51975483456',
  'https://wa.me/51975483456?text=%C2%A1Hola%2C%20Daniel%21%20%F0%9F%91%8B.%20Te%20saluda%20*%5BIngresa%20tu%20nombre%5D*.%20%F0%9F%9A%96%20Te%20escribo%20porque%20deseo%20solicitar%20tu%20servicio%20de%20taxi.%20Me%20gustar%C3%ADa%20conocer%20%F0%9F%93%8D*%5BNombre%20del%20lugar%5D*.%20%C2%BFPodr%C3%ADamos%20coordinar%20y%20as%C3%AD%20concretar%20el%20servicio%2C%20por%20favor%3F%20%F0%9F%98%8A.%20%C2%A1Quedo%20atento(a)%20a%20tu%20respuesta%21%20%E2%9C%85',
  'https://ejemplo-reservas.com',
  'Chacha Guayas Driver. Todos los derechos reservados.'
);

-- Function to update category post count automatically
CREATE OR REPLACE FUNCTION update_category_post_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.categories 
        SET post_count = post_count + 1 
        WHERE id = NEW.category_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.categories 
        SET post_count = post_count - 1 
        WHERE id = OLD.category_id;
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.category_id != NEW.category_id THEN
            UPDATE public.categories 
            SET post_count = post_count - 1 
            WHERE id = OLD.category_id;
            UPDATE public.categories 
            SET post_count = post_count + 1 
            WHERE id = NEW.category_id;
        END IF;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic category post count updates
CREATE TRIGGER category_post_count_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_category_post_count();