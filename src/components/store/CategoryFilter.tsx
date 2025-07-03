import React from 'react';
import { Category } from '../../types/store';
import { Grid, Folder } from 'lucide-react';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange
}) => {
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      <button
        onClick={() => onCategoryChange('')}
        className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-200 ${
          selectedCategory === ''
            ? 'bg-primary text-white shadow-lg'
            : 'bg-card text-text-primary border border-border hover:bg-primary/10'
        }`}
      >
        <Grid className="h-4 w-4" />
        Todos los productos
      </button>
      
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-200 ${
            selectedCategory === category.id
              ? 'bg-primary text-white shadow-lg'
              : 'bg-card text-text-primary border border-border hover:bg-primary/10'
          }`}
        >
          <Folder className="h-4 w-4" />
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;