import React from 'react';
import { Category, FAQ } from '../../types/blog';
import CategoryList from './CategoryList';
import FaqList from './FaqList';

interface SidebarProps {
  categories: Category[];
  faqs: FAQ[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  categories, 
  faqs, 
  selectedCategory, 
  onCategoryChange 
}) => {
  return (
    <aside className="blog-sidebar">
      <CategoryList
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
      />
      
      <FaqList faqs={faqs} />
    </aside>
  );
};

export default Sidebar;