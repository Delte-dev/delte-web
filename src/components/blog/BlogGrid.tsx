import React from 'react';
import { BlogPost, PaginationInfo } from '../../types/blog';
import BlogPostCard from './BlogPostCard';
import Pagination from './Pagination';
import { FileText } from 'lucide-react';

interface BlogGridProps {
  posts: BlogPost[];
  paginationInfo: PaginationInfo;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const BlogGrid: React.FC<BlogGridProps> = ({ 
  posts, 
  paginationInfo, 
  currentPage, 
  onPageChange 
}) => {
  console.log('BlogGrid rendering with posts:', posts.length);
  console.log('Posts data:', posts);

  // Show loading state if posts array is empty but we're expecting data
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div 
            className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200"
            style={{
              backgroundColor: 'white',
              color: '#333333',
              border: '1px solid #e5e7eb'
            }}
          >
            <FileText className="h-16 w-16 mx-auto mb-6 text-gray-400" />
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              No hay publicaciones disponibles
            </h3>
            <p className="mb-6 leading-relaxed text-gray-600">
              {paginationInfo.totalPosts === 0 
                ? "Aún no se han publicado artículos en el blog. ¡Vuelve pronto para ver contenido nuevo!"
                : "No se encontraron publicaciones que coincidan con los filtros aplicados."
              }
            </p>
            {/* Removed admin instructions - they should only be visible to admins */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Posts count indicator */}
      <div className="text-center">
        <p className="text-gray-600">
          Mostrando {posts.length} de {paginationInfo.totalPosts} publicaciones
        </p>
      </div>

      {/* Posts grid */}
      <div className="space-y-6">
        {posts.map((post, index) => {
          console.log(`Rendering post ${index + 1}:`, post.title);
          return (
            <div 
              key={post.id} 
              style={{ 
                minHeight: '500px',
                backgroundColor: 'transparent',
                position: 'relative',
                zIndex: 1
              }}
            >
              <BlogPostCard post={post} />
            </div>
          );
        })}
      </div>
      
      {/* Pagination */}
      {paginationInfo.totalPages > 1 && (
        <div className="mt-12">
          <Pagination
            currentPage={currentPage}
            totalPages={paginationInfo.totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default BlogGrid;