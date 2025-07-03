import React from 'react';
import { Category } from '../../types/blog';
import { Folder, FolderOpen } from 'lucide-react';

interface CategoryListProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange 
}) => {
  // Filter out categories with 0 posts for public view
  const visibleCategories = categories.filter(category => category.post_count > 0);

  return (
    <div 
      className="rounded-2xl p-6 shadow-xl border"
      style={{
        backgroundColor: 'var(--card-bg)',
        borderColor: 'var(--border-color)'
      }}
    >
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary">
        <FolderOpen className="h-5 w-5" />
        Categorías
      </h3>
      <ul className="space-y-2">
        <li>
          <button
            onClick={() => onCategoryChange('')}
            className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
              selectedCategory === '' 
                ? 'bg-primary text-white shadow-lg' 
                : 'hover:bg-primary/10 hover:text-primary'
            }`}
            style={selectedCategory === '' ? {} : { color: 'var(--text-secondary)' }}
          >
            <div className="flex items-center gap-2">
              <Folder className="h-4 w-4" />
              <span>Todas las categorías</span>
            </div>
          </button>
        </li>
        {visibleCategories.map((category) => (
          <li key={category.id}>
            <button
              onClick={() => onCategoryChange(category.id)}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                selectedCategory === category.id 
                  ? 'bg-primary text-white shadow-lg' 
                  : 'hover:bg-primary/10 hover:text-primary'
              }`}
              style={selectedCategory === category.id ? {} : { color: 'var(--text-secondary)' }}
            >
              <div className="flex items-center gap-2">
                <Folder className="h-4 w-4" />
                <span>{category.name}</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                selectedCategory === category.id 
                  ? 'bg-white/20 text-white' 
                  : 'bg-primary/10 text-primary'
              }`}>
                {category.post_count}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;