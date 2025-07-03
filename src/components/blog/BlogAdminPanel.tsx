import React, { useState, useEffect } from 'react';
import { BlogPost, Category, FAQ } from '../../types/blog';
import { X, Plus, Trash2, Save, Edit, Image, Video, Eye } from 'lucide-react';
import NotificationModal from '../NotificationModal';
import MediaDisplay from '../MediaDisplay';
import { isValidGoogleDriveId, getGoogleDriveMediaUrl } from '../../utils/googleDrive';

interface BlogAdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  posts: BlogPost[];
  categories: Category[];
  faqs: FAQ[];
  onSavePost: (post: Partial<BlogPost>) => Promise<boolean>;
  onDeletePost: (postId: string) => Promise<boolean>;
  onSaveCategory: (category: Partial<Category>) => Promise<boolean>;
  onSaveFaq: (faq: Partial<FAQ>) => Promise<boolean>;
  onDeleteFaq: (faqId: string) => Promise<boolean>;
}

type TabType = 'posts' | 'categories' | 'faqs';

interface NotificationState {
  isOpen: boolean;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

interface MediaField {
  id: string;
  type: 'image' | 'video';
}

const BlogAdminPanel: React.FC<BlogAdminPanelProps> = ({
  isOpen,
  onClose,
  posts,
  categories,
  faqs,
  onSavePost,
  onDeletePost,
  onSaveCategory,
  onSaveFaq,
  onDeleteFaq
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('posts');
  const [selectedPostId, setSelectedPostId] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [selectedFaqId, setSelectedFaqId] = useState<string>('');
  const [notification, setNotification] = useState<NotificationState>({
    isOpen: false,
    type: 'info',
    title: '',
    message: ''
  });

  // Media preview states
  const [mediaPreview, setMediaPreview] = useState<MediaField | null>(null);

  // Post form data
  const [postForm, setPostForm] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    featured_video: '',
    category_id: '',
    is_published: true
  });

  // Media form fields for easier management
  const [mediaFields, setMediaFields] = useState({
    featured_image_id: '',
    featured_image_type: 'image' as 'image' | 'video',
    featured_video_id: '',
    featured_video_type: 'video' as 'image' | 'video'
  });

  // Category form data
  const [categoryForm, setCategoryForm] = useState<Partial<Category>>({
    name: '',
    slug: '',
    description: ''
  });

  // FAQ form data
  const [faqForm, setFaqForm] = useState<Partial<FAQ>>({
    question: '',
    answer: '',
    order_index: 0,
    is_active: true
  });

  const showNotification = (type: NotificationState['type'], title: string, message: string) => {
    setNotification({
      isOpen: true,
      type,
      title,
      message
    });
  };

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[áàäâ]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/[ñ]/g, 'n')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Update URLs when media IDs change
  useEffect(() => {
    if (mediaFields.featured_image_id && isValidGoogleDriveId(mediaFields.featured_image_id)) {
      const url = getGoogleDriveMediaUrl(mediaFields.featured_image_id, mediaFields.featured_image_type);
      setPostForm(prev => ({ ...prev, featured_image: url }));
    } else {
      setPostForm(prev => ({ ...prev, featured_image: '' }));
    }
  }, [mediaFields.featured_image_id, mediaFields.featured_image_type]);

  useEffect(() => {
    if (mediaFields.featured_video_id && isValidGoogleDriveId(mediaFields.featured_video_id)) {
      const url = getGoogleDriveMediaUrl(mediaFields.featured_video_id, mediaFields.featured_video_type);
      setPostForm(prev => ({ ...prev, featured_video: url }));
    } else {
      setPostForm(prev => ({ ...prev, featured_video: '' }));
    }
  }, [mediaFields.featured_video_id, mediaFields.featured_video_type]);

  // Load selected post
  useEffect(() => {
    if (selectedPostId) {
      const post = posts.find(p => p.id === selectedPostId);
      if (post) {
        setPostForm(post);
        // Reset media fields when loading a post
        setMediaFields({
          featured_image_id: '',
          featured_image_type: 'image',
          featured_video_id: '',
          featured_video_type: 'video'
        });
      }
    } else {
      setPostForm({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        featured_image: '',
        featured_video: '',
        category_id: '',
        is_published: true
      });
      setMediaFields({
        featured_image_id: '',
        featured_image_type: 'image',
        featured_video_id: '',
        featured_video_type: 'video'
      });
    }
  }, [selectedPostId, posts]);

  // Load selected category
  useEffect(() => {
    if (selectedCategoryId) {
      const category = categories.find(c => c.id === selectedCategoryId);
      if (category) {
        setCategoryForm(category);
      }
    } else {
      setCategoryForm({
        name: '',
        slug: '',
        description: ''
      });
    }
  }, [selectedCategoryId, categories]);

  // Load selected FAQ
  useEffect(() => {
    if (selectedFaqId) {
      const faq = faqs.find(f => f.id === selectedFaqId);
      if (faq) {
        setFaqForm(faq);
      }
    } else {
      setFaqForm({
        question: '',
        answer: '',
        order_index: faqs.length,
        is_active: true
      });
    }
  }, [selectedFaqId, faqs]);

  // Handle post save
  const handleSavePost = async () => {
    if (!postForm.title || !postForm.excerpt || !postForm.content) {
      showNotification('warning', 'Campos requeridos', 'Por favor completa todos los campos obligatorios');
      return;
    }

    const post: Partial<BlogPost> = {
      ...postForm,
      id: selectedPostId || `post-${Date.now()}`,
      slug: postForm.slug || generateSlug(postForm.title!),
      published_at: postForm.is_published ? new Date().toISOString() : null
    };

    const success = await onSavePost(post);
    if (success) {
      setSelectedPostId('');
      showNotification('success', '¡Éxito!', 'Publicación guardada exitosamente');
    } else {
      showNotification('error', 'Error', 'No se pudo guardar la publicación');
    }
  };

  // Handle category save
  const handleSaveCategory = async () => {
    if (!categoryForm.name) {
      showNotification('warning', 'Campo requerido', 'Por favor ingresa el nombre de la categoría');
      return;
    }

    const category: Partial<Category> = {
      ...categoryForm,
      id: selectedCategoryId || `cat-${Date.now()}`,
      slug: categoryForm.slug || generateSlug(categoryForm.name!),
      post_count: categoryForm.post_count || 0
    };

    const success = await onSaveCategory(category);
    if (success) {
      setSelectedCategoryId('');
      showNotification('success', '¡Éxito!', 'Categoría guardada exitosamente');
    } else {
      showNotification('error', 'Error', 'No se pudo guardar la categoría');
    }
  };

  // Handle FAQ save
  const handleSaveFaq = async () => {
    if (!faqForm.question || !faqForm.answer) {
      showNotification('warning', 'Campos requeridos', 'Por favor completa la pregunta y respuesta');
      return;
    }

    const faq: Partial<FAQ> = {
      ...faqForm,
      id: selectedFaqId || `faq-${Date.now()}`
    };

    const success = await onSaveFaq(faq);
    if (success) {
      setSelectedFaqId('');
      showNotification('success', '¡Éxito!', 'Pregunta frecuente guardada exitosamente');
    } else {
      showNotification('error', 'Error', 'No se pudo guardar la pregunta frecuente');
    }
  };

  // Handle delete operations
  const handleDeletePost = async () => {
    if (selectedPostId && confirm('¿Estás seguro de eliminar esta publicación?')) {
      const success = await onDeletePost(selectedPostId);
      if (success) {
        setSelectedPostId('');
        showNotification('success', '¡Eliminado!', 'Publicación eliminada exitosamente');
      } else {
        showNotification('error', 'Error', 'No se pudo eliminar la publicación');
      }
    }
  };

  const handleDeleteFaq = async () => {
    if (selectedFaqId && confirm('¿Estás seguro de eliminar esta pregunta frecuente?')) {
      const success = await onDeleteFaq(selectedFaqId);
      if (success) {
        setSelectedFaqId('');
        showNotification('success', '¡Eliminado!', 'Pregunta frecuente eliminada exitosamente');
      } else {
        showNotification('error', 'Error', 'No se pudo eliminar la pregunta frecuente');
      }
    }
  };

  const handlePreviewMedia = (id: string, type: 'image' | 'video') => {
    if (isValidGoogleDriveId(id)) {
      setMediaPreview({ id, type });
    } else {
      showNotification('warning', 'ID inválido', 'El ID de Google Drive no tiene un formato válido');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-card rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden border-2 border-primary">
          <div className="sticky top-0 bg-card border-b border-border p-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-primary">Panel de Administración del Blog</h2>
            <button onClick={onClose} className="btn btn-secondary p-2">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-border">
            <div className="flex">
              <button
                onClick={() => setActiveTab('posts')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'posts'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-text-secondary hover:text-primary'
                }`}
              >
                Publicaciones
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'categories'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-text-secondary hover:text-primary'
                }`}
              >
                Categorías
              </button>
              <button
                onClick={() => setActiveTab('faqs')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'faqs'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-text-secondary hover:text-primary'
                }`}
              >
                Preguntas Frecuentes
              </button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Posts Tab */}
            {activeTab === 'posts' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Seleccionar publicación existente (opcional)
                  </label>
                  <select
                    value={selectedPostId}
                    onChange={(e) => setSelectedPostId(e.target.value)}
                    className="w-full p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
                  >
                    <option value="">Nueva publicación</option>
                    {posts.map(post => (
                      <option key={post.id} value={post.id}>{post.title}</option>
                    ))}
                  </select>
                  {selectedPostId && (
                    <button
                      onClick={handleDeletePost}
                      className="mt-2 btn btn-danger flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Eliminar publicación
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Título *
                    </label>
                    <input
                      type="text"
                      value={postForm.title || ''}
                      onChange={(e) => {
                        setPostForm(prev => ({
                          ...prev,
                          title: e.target.value,
                          slug: generateSlug(e.target.value)
                        }));
                      }}
                      className="w-full p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Slug
                    </label>
                    <input
                      type="text"
                      value={postForm.slug || ''}
                      onChange={(e) => setPostForm(prev => ({ ...prev, slug: e.target.value }))}
                      className="w-full p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Extracto *
                  </label>
                  <textarea
                    value={postForm.excerpt || ''}
                    onChange={(e) => setPostForm(prev => ({ ...prev, excerpt: e.target.value }))}
                    rows={3}
                    className="w-full p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Contenido *
                  </label>
                  <textarea
                    value={postForm.content || ''}
                    onChange={(e) => setPostForm(prev => ({ ...prev, content: e.target.value }))}
                    rows={10}
                    className="w-full p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
                    required
                  />
                </div>

                {/* Media Fields with Google Drive ID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Featured Image */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-text-primary">
                      Imagen Destacada (ID de Google Drive)
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={mediaFields.featured_image_type}
                        onChange={(e) => setMediaFields(prev => ({ 
                          ...prev, 
                          featured_image_type: e.target.value as 'image' | 'video' 
                        }))}
                        className="p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
                      >
                        <option value="image">Imagen</option>
                        <option value="video">Video</option>
                      </select>
                      <input
                        type="text"
                        value={mediaFields.featured_image_id}
                        onChange={(e) => setMediaFields(prev => ({ 
                          ...prev, 
                          featured_image_id: e.target.value 
                        }))}
                        placeholder="Ej: 1uqpvdVOqYs7bfzPi9lETFPi7oa18dvDe"
                        className="flex-1 p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
                      />
                      {mediaFields.featured_image_id && (
                        <button
                          type="button"
                          onClick={() => handlePreviewMedia(mediaFields.featured_image_id, mediaFields.featured_image_type)}
                          className="btn btn-secondary p-3"
                          title="Vista previa"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    {mediaFields.featured_image_id && !isValidGoogleDriveId(mediaFields.featured_image_id) && (
                      <p className="text-accent-red text-sm">ID de Google Drive inválido</p>
                    )}
                  </div>

                  {/* Featured Video */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-text-primary">
                      Video Destacado (ID de Google Drive)
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={mediaFields.featured_video_type}
                        onChange={(e) => setMediaFields(prev => ({ 
                          ...prev, 
                          featured_video_type: e.target.value as 'image' | 'video' 
                        }))}
                        className="p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
                      >
                        <option value="video">Video</option>
                        <option value="image">Imagen</option>
                      </select>
                      <input
                        type="text"
                        value={mediaFields.featured_video_id}
                        onChange={(e) => setMediaFields(prev => ({ 
                          ...prev, 
                          featured_video_id: e.target.value 
                        }))}
                        placeholder="Ej: 1uqpvdVOqYs7bfzPi9lETFPi7oa18dvDe"
                        className="flex-1 p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
                      />
                      {mediaFields.featured_video_id && (
                        <button
                          type="button"
                          onClick={() => handlePreviewMedia(mediaFields.featured_video_id, mediaFields.featured_video_type)}
                          className="btn btn-secondary p-3"
                          title="Vista previa"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    {mediaFields.featured_video_id && !isValidGoogleDriveId(mediaFields.featured_video_id) && (
                      <p className="text-accent-red text-sm">ID de Google Drive inválido</p>
                    )}
                  </div>
                </div>

                {/* Legacy URL fields (read-only for reference) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      URL de imagen generada (solo lectura)
                    </label>
                    <input
                      type="text"
                      value={postForm.featured_image || ''}
                      readOnly
                      className="w-full p-3 border border-border rounded-lg bg-gray-100 text-text-secondary text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      URL de video generada (solo lectura)
                    </label>
                    <input
                      type="text"
                      value={postForm.featured_video || ''}
                      readOnly
                      className="w-full p-3 border border-border rounded-lg bg-gray-100 text-text-secondary text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Categoría
                    </label>
                    <select
                      value={postForm.category_id || ''}
                      onChange={(e) => setPostForm(prev => ({ ...prev, category_id: e.target.value }))}
                      className="w-full p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
                    >
                      <option value="">Sin categoría</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-text-primary">
                      <input
                        type="checkbox"
                        checked={postForm.is_published || false}
                        onChange={(e) => setPostForm(prev => ({ ...prev, is_published: e.target.checked }))}
                        className="rounded"
                      />
                      Publicar inmediatamente
                    </label>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSavePost}
                    className="btn btn-primary flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {selectedPostId ? 'Actualizar' : 'Crear'} Publicación
                  </button>
                </div>
              </div>
            )}

            {/* Categories Tab */}
            {activeTab === 'categories' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Seleccionar categoría existente (opcional)
                  </label>
                  <select
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                    className="w-full p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
                  >
                    <option value="">Nueva categoría</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      value={categoryForm.name || ''}
                      onChange={(e) => {
                        setCategoryForm(prev => ({
                          ...prev,
                          name: e.target.value,
                          slug: generateSlug(e.target.value)
                        }));
                      }}
                      className="w-full p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Slug
                    </label>
                    <input
                      type="text"
                      value={categoryForm.slug || ''}
                      onChange={(e) => setCategoryForm(prev => ({ ...prev, slug: e.target.value }))}
                      className="w-full p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={categoryForm.description || ''}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveCategory}
                    className="btn btn-primary flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {selectedCategoryId ? 'Actualizar' : 'Crear'} Categoría
                  </button>
                </div>
              </div>
            )}

            {/* FAQs Tab */}
            {activeTab === 'faqs' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Seleccionar pregunta existente (opcional)
                  </label>
                  <select
                    value={selectedFaqId}
                    onChange={(e) => setSelectedFaqId(e.target.value)}
                    className="w-full p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
                  >
                    <option value="">Nueva pregunta frecuente</option>
                    {faqs.map(faq => (
                      <option key={faq.id} value={faq.id}>{faq.question}</option>
                    ))}
                  </select>
                  {selectedFaqId && (
                    <button
                      onClick={handleDeleteFaq}
                      className="mt-2 btn btn-danger flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Eliminar pregunta
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Pregunta *
                  </label>
                  <input
                    type="text"
                    value={faqForm.question || ''}
                    onChange={(e) => setFaqForm(prev => ({ ...prev, question: e.target.value }))}
                    className="w-full p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Respuesta *
                  </label>
                  <textarea
                    value={faqForm.answer || ''}
                    onChange={(e) => setFaqForm(prev => ({ ...prev, answer: e.target.value }))}
                    rows={5}
                    className="w-full p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Orden
                    </label>
                    <input
                      type="number"
                      value={faqForm.order_index || 0}
                      onChange={(e) => setFaqForm(prev => ({ ...prev, order_index: parseInt(e.target.value) }))}
                      className="w-full p-3 border border-border rounded-lg bg-bg-secondary text-text-primary"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-text-primary">
                      <input
                        type="checkbox"
                        checked={faqForm.is_active || false}
                        onChange={(e) => setFaqForm(prev => ({ ...prev, is_active: e.target.checked }))}
                        className="rounded"
                      />
                      Activa
                    </label>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveFaq}
                    className="btn btn-primary flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {selectedFaqId ? 'Actualizar' : 'Crear'} Pregunta
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Media Preview Modal */}
      {mediaPreview && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] p-4">
          <div className="bg-card rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border-2 border-primary">
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                {mediaPreview.type === 'video' ? <Video className="h-5 w-5" /> : <Image className="h-5 w-5" />}
                Vista Previa - {mediaPreview.type === 'video' ? 'Video' : 'Imagen'}
              </h3>
              <button
                onClick={() => setMediaPreview(null)}
                className="btn btn-secondary p-2"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <MediaDisplay
                mediaId={mediaPreview.id}
                mediaType={mediaPreview.type}
                alt="Vista previa"
                className="max-h-[60vh]"
              />
            </div>
          </div>
        </div>
      )}

      <NotificationModal
        isOpen={notification.isOpen}
        onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />
    </>
  );
};

export default BlogAdminPanel;