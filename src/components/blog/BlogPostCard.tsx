import React, { useState } from 'react';
import { BlogPost } from '../../types/blog';
import { Calendar, User, Tag, Clock } from 'lucide-react';
import MediaDisplay from '../MediaDisplay';
import BlogPostModal from './BlogPostModal';
import { extractGoogleDriveId, isValidGoogleDriveId } from '../../utils/googleDrive';

interface BlogPostCardProps {
  post: BlogPost;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  const [showModal, setShowModal] = useState(false);

  console.log('Rendering BlogPostCard for:', post.title);

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

  const handleReadMore = () => {
    setShowModal(true);
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
    <>
      <article 
        className="blog-post fade-in"
        style={{
          minHeight: '500px',
          display: 'block',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Featured Media */}
        {featuredVideoInfo ? (
          <MediaDisplay
            mediaId={featuredVideoInfo.id}
            mediaType="video"
            alt={post.title}
            className="post-video"
            showControls={false}
          />
        ) : featuredImageInfo ? (
          <MediaDisplay
            mediaId={featuredImageInfo.id}
            mediaType="image"
            alt={post.title}
            className="post-image"
            showControls={false}
          />
        ) : post.featured_video ? (
          <div className="relative">
            <iframe
              src={post.featured_video}
              className="post-video"
              allow="autoplay"
              title={post.title}
              loading="lazy"
            />
            <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
              Video
            </div>
          </div>
        ) : post.featured_image ? (
          <div className="relative">
            <img
              src={post.featured_image}
              alt={post.title}
              className="post-image"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                console.error('Error loading image:', post.featured_image);
              }}
            />
            <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
              Artículo
            </div>
          </div>
        ) : (
          <div className="h-64 md:h-80 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-gray-600">Sin imagen destacada</p>
            </div>
          </div>
        )}
        
        {/* Post Content - Always visible */}
        <div className="post-content">
          {/* Meta Information */}
          <div className="post-date-meta">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span className="post-date">{formatDate(post.published_at)}</span>
            </div>
            
            {post.category && (
              <div className="flex items-center gap-1">
                <Tag className="h-4 w-4" />
                <span className="post-category">{post.category.name}</span>
              </div>
            )}
            
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span className="post-reading-time">{getReadingTime(post.content)}</span>
            </div>
          </div>
          
          {/* Title - Always visible */}
          <h2 
            className="post-title"
            onClick={handleReadMore}
          >
            {post.title}
          </h2>
          
          {/* Excerpt - Always visible */}
          <p className="post-excerpt">
            {post.excerpt}
          </p>
          
          {/* Footer - Always visible */}
          <div className="post-footer">
            <button 
              onClick={handleReadMore} 
              className="read-more"
            >
              Leer más
            </button>
            
            <div className="post-reading-indicator">
              {post.content.length > 1000 ? 'Lectura larga' : 'Lectura rápida'}
            </div>
          </div>
        </div>
      </article>

      {/* Modal */}
      <BlogPostModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        post={post}
      />
    </>
  );
};

export default BlogPostCard;