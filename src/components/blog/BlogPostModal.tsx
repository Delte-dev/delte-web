import React, { useEffect } from 'react';
import { X, Calendar, Tag, Clock, User } from 'lucide-react';
import { BlogPost } from '../../types/blog';
import MediaDisplay from '../MediaDisplay';
import { extractGoogleDriveId, isValidGoogleDriveId } from '../../utils/googleDrive';

interface BlogPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: BlogPost | null;
}

const BlogPostModal: React.FC<BlogPostModalProps> = ({ isOpen, onClose, post }) => {
  // Handle Escape key press
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !post) return null;

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Fecha no disponible';
    }
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min de lectura`;
  };

  // Función para determinar si una URL es de Google Drive y extraer información
  const getMediaInfo = (url: string) => {
    if (!url) return null;

    // Si es una URL de Google Drive, extraer el ID
    if (url.includes('drive.google.com')) {
      const id = extractGoogleDriveId(url);
      if (isValidGoogleDriveId(id)) {
        // Determinar el tipo basándose en la URL
        const isVideo = url.includes('/preview') || url.includes('video');
        return {
          id,
          type: isVideo ? 'video' as const : 'image' as const
        };
      }
    }

    return null;
  };

  const featuredImageInfo = getMediaInfo(post.featured_image || '');
  const featuredVideoInfo = getMediaInfo(post.featured_video || '');

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl relative">
        {/* Header with close button */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex justify-between items-center z-10">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Artículo Completo
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            title="Cerrar (Esc)"
          >
            <X className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
        
        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
          {/* Featured Media */}
          {featuredVideoInfo ? (
            <MediaDisplay
              mediaId={featuredVideoInfo.id}
              mediaType="video"
              alt={post.title}
              className="w-full h-64 md:h-80"
              showControls={true}
            />
          ) : featuredImageInfo ? (
            <MediaDisplay
              mediaId={featuredImageInfo.id}
              mediaType="image"
              alt={post.title}
              className="w-full h-64 md:h-80"
              showControls={true}
            />
          ) : post.featured_video ? (
            <div className="relative">
              <iframe
                src={post.featured_video}
                className="w-full h-64 md:h-80"
                allow="autoplay"
                title={post.title}
                loading="lazy"
              />
            </div>
          ) : post.featured_image ? (
            <div className="relative">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-64 md:h-80 object-cover"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="h-64 md:h-80 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-200 dark:bg-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8 text-blue-600 dark:text-gray-300" />
                </div>
                <p className="text-gray-600 dark:text-gray-300">Sin imagen destacada</p>
              </div>
            </div>
          )}

          {/* Article Content */}
          <div className="p-6">
            {/* Meta Information */}
            <div className="flex items-center gap-4 mb-6 text-sm flex-wrap text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.published_at)}</span>
              </div>
              
              {post.category && (
                <div className="flex items-center gap-1">
                  <Tag className="h-4 w-4" />
                  <span className="font-medium text-blue-600 dark:text-blue-400">{post.category.name}</span>
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{getReadingTime(post.content)}</span>
              </div>
            </div>
            
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white leading-tight">
              {post.title}
            </h1>
            
            {/* Excerpt */}
            <div className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border-l-4 border-blue-500">
              {post.excerpt}
            </div>
            
            {/* Full Content */}
            <div 
              className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 leading-relaxed"
              style={{
                lineHeight: '1.8'
              }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </div>
        
        {/* Footer with close hint */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Presiona <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs">Esc</kbd> para cerrar o haz clic fuera del modal
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlogPostModal;