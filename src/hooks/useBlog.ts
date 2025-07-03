import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { BlogPost, Category, FAQ, SocialLink, SiteSettings, PaginationInfo } from '../types/blog';

export function useBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Load all data
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Loading data from Supabase...');

      // Test connection first
      const { data: testData, error: testError } = await supabase
        .from('categories')
        .select('count')
        .limit(1);

      if (testError) {
        console.error('Connection test failed:', testError);
        throw new Error(`Error de conexión: ${testError.message}`);
      }

      console.log('Connection test successful');

      // Load posts WITHOUT the complex join first
      const { data: postsData, error: postsError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (postsError) {
        console.error('Posts error:', postsError);
        throw new Error(`Error cargando publicaciones: ${postsError.message}`);
      }

      console.log('Posts loaded:', postsData?.length || 0);
      console.log('Posts data:', postsData);

      // Load categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (categoriesError) {
        console.error('Categories error:', categoriesError);
        throw new Error(`Error cargando categorías: ${categoriesError.message}`);
      }

      console.log('Categories loaded:', categoriesData?.length || 0);

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

      console.log('FAQs loaded:', faqsData?.length || 0);

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

      console.log('Social links loaded:', socialData?.length || 0);

      // Load site settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1)
        .single();

      if (settingsError && settingsError.code !== 'PGRST116') {
        console.error('Site settings error:', settingsError);
        // Don't throw error for settings, use defaults
      }

      console.log('Site settings loaded:', settingsData ? 'Yes' : 'Using defaults');

      // Process posts with category information
      const processedPosts = postsData?.map(post => {
        const category = categoriesData?.find(cat => cat.id === post.category_id);
        return {
          ...post,
          category: category || null
        };
      }) || [];

      console.log('Processed posts:', processedPosts);

      // Set all posts first
      setAllPosts(processedPosts);
      setCategories(categoriesData || []);
      setFaqs(faqsData || []);
      setSocialLinks(socialData || []);
      setSiteSettings(settingsData || {
        id: 'default',
        site_title: 'Chacha Guayas Driver',
        site_subtitle: 'Consejos de viaje, noticias locales y beneficios del taxi privado',
        contact_phone: '+51975483456',
        footer_text: 'Chacha Guayas Driver. Todos los derechos reservados.',
        whatsapp_url: 'https://wa.me/51975483456',
        reservation_url: 'https://chachaguayasdriver-reserva.netlify.app/',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      console.log('All data loaded successfully');
    } catch (err) {
      console.error('Error loading blog data:', err);
      setError(`Error al cargar los datos del blog: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  // Filter posts based on search and category
  const getFilteredPosts = () => {
    let filtered = allPosts;

    console.log('Filtering posts. Total posts:', filtered.length);
    console.log('Search term:', searchTerm);
    console.log('Selected category:', selectedCategory);

    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log('After search filter:', filtered.length);
    }

    if (selectedCategory) {
      filtered = filtered.filter(post => post.category_id === selectedCategory);
      console.log('After category filter:', filtered.length);
    }

    return filtered;
  };

  // Get paginated posts
  const getPaginatedPosts = () => {
    const filtered = getFilteredPosts();
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const paginated = filtered.slice(startIndex, endIndex);
    
    console.log('Paginated posts:', paginated.length, 'from', startIndex, 'to', endIndex);
    
    return paginated;
  };

  // Get pagination info
  const getPaginationInfo = (): PaginationInfo => {
    const filtered = getFilteredPosts();
    const totalPosts = filtered.length;
    const totalPages = Math.ceil(totalPosts / postsPerPage);

    return {
      currentPage,
      totalPages,
      totalPosts,
      postsPerPage
    };
  };

  // Update posts when filters change
  useEffect(() => {
    const paginatedPosts = getPaginatedPosts();
    setPosts(paginatedPosts);
    console.log('Posts updated:', paginatedPosts.length);
  }, [allPosts, searchTerm, selectedCategory, currentPage]);

  // Save blog post
  const savePost = async (post: Partial<BlogPost>) => {
    try {
      setError(null);
      const existingPost = allPosts.find(p => p.id === post.id);

      if (existingPost) {
        const { error } = await supabase
          .from('blog_posts')
          .update({
            ...post,
            updated_at: new Date().toISOString()
          })
          .eq('id', post.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert({
            ...post,
            id: post.id || `post-${Date.now()}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (error) throw error;
      }

      await loadData();
      return true;
    } catch (err) {
      console.error('Error saving post:', err);
      setError('Error al guardar la publicación');
      return false;
    }
  };

  // Delete blog post
  const deletePost = async (postId: string) => {
    try {
      setError(null);
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      setAllPosts(prev => prev.filter(p => p.id !== postId));
      return true;
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('Error al eliminar la publicación');
      return false;
    }
  };

  // Save category
  const saveCategory = async (category: Partial<Category>) => {
    try {
      setError(null);
      const existingCategory = categories.find(c => c.id === category.id);

      if (existingCategory) {
        const { error } = await supabase
          .from('categories')
          .update({
            ...category,
            updated_at: new Date().toISOString()
          })
          .eq('id', category.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('categories')
          .insert({
            ...category,
            id: category.id || `cat-${Date.now()}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (error) throw error;
      }

      await loadData();
      return true;
    } catch (err) {
      console.error('Error saving category:', err);
      setError('Error al guardar la categoría');
      return false;
    }
  };

  // Save FAQ
  const saveFaq = async (faq: Partial<FAQ>) => {
    try {
      setError(null);
      const existingFaq = faqs.find(f => f.id === faq.id);

      if (existingFaq) {
        const { error } = await supabase
          .from('faqs')
          .update({
            ...faq,
            updated_at: new Date().toISOString()
          })
          .eq('id', faq.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('faqs')
          .insert({
            ...faq,
            id: faq.id || `faq-${Date.now()}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (error) throw error;
      }

      await loadData();
      return true;
    } catch (err) {
      console.error('Error saving FAQ:', err);
      setError('Error al guardar la pregunta frecuente');
      return false;
    }
  };

  // Delete FAQ
  const deleteFaq = async (faqId: string) => {
    try {
      setError(null);
      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', faqId);

      if (error) throw error;

      setFaqs(prev => prev.filter(f => f.id !== faqId));
      return true;
    } catch (err) {
      console.error('Error deleting FAQ:', err);
      setError('Error al eliminar la pregunta frecuente');
      return false;
    }
  };

  useEffect(() => {
    loadData();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('blog_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'blog_posts'
        },
        () => {
          console.log('Real-time update: blog_posts');
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
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Reset pagination when search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  return {
    posts,
    allPosts,
    categories,
    faqs,
    socialLinks,
    siteSettings,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    currentPage,
    setCurrentPage,
    paginationInfo: getPaginationInfo(),
    savePost,
    deletePost,
    saveCategory,
    saveFaq,
    deleteFaq,
    reloadData: loadData
  };
}