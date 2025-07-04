import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Product, Category, FAQ, SocialLink, SiteSettings } from '../types/store';

export function useStore() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Load all data
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Loading store data from Supabase...');

      // Load products with categories
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (productsError) {
        console.error('Products error:', productsError);
        throw new Error(`Error cargando productos: ${productsError.message}`);
      }

      // Load categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (categoriesError) {
        console.error('Categories error:', categoriesError);
        throw new Error(`Error cargando categorías: ${categoriesError.message}`);
      }

      // Load FAQs
      const { data: faqsData, error: faqsError } = await supabase
        .from('faqs')
        .select('*')
        .eq('is_active', true)
        .order('order_index');

      if (faqsError) {
        console.error('FAQs error:', faqsError);
        throw new Error(`Error cargando FAQs: ${faqsError.message}`);
      }

      // Load social links
      const { data: socialData, error: socialError } = await supabase
        .from('social_links')
        .select('*')
        .eq('is_active', true)
        .order('order_index');

      if (socialError) {
        console.error('Social links error:', socialError);
        throw new Error(`Error cargando enlaces sociales: ${socialError.message}`);
      }

      // Load site settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1)
        .single();

      if (settingsError && settingsError.code !== 'PGRST116') {
        console.error('Site settings error:', settingsError);
      }

      setProducts(productsData || []);
      setCategories(categoriesData || []);
      setFaqs(faqsData || []);
      setSocialLinks(socialData || []);
      setSiteSettings(settingsData || {
        id: 'default',
        site_title: 'Delte Streaming',
        site_subtitle: 'Tu proveedor de confianza para servicios de streaming premium',
        contact_phone: '+51936992107',
        whatsapp_url: 'https://wa.me/51936992107',
        footer_text: '©️ 2025 - Delte Streaming',
        developer_text: 'Desarrollado por: CyberLink Express 360 Sure',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      console.log('Store data loaded successfully');
    } catch (err) {
      console.error('Error loading store data:', err);
      setError(`Error al cargar los datos: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('store_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        () => {
          console.log('Real-time update: products');
          loadData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'categories'
        },
        () => {
          console.log('Real-time update: categories');
          loadData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'faqs'
        },
        () => {
          console.log('Real-time update: faqs');
          loadData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'social_links'
        },
        () => {
          console.log('Real-time update: social_links');
          loadData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_settings'
        },
        () => {
          console.log('Real-time update: site_settings');
          loadData();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    products,
    categories,
    faqs,
    socialLinks,
    siteSettings,
    loading,
    error,
    selectedCategory,
    setSelectedCategory,
    reloadData: loadData
  };
}