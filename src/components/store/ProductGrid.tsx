import React, { useState } from 'react';
import { Product, Category, User } from '../../types/store';
import ProductCard from './ProductCard';
import CategoryFilter from './CategoryFilter';
import { Package } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  currentUser: User | null;
  onLoginRequired: () => void;
  onNotification: (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  categories,
  selectedCategory,
  onCategoryChange,
  currentUser,
  onLoginRequired,
  onNotification
}) => {
  // Filter products by category
  const filteredProducts = selectedCategory
    ? products.filter(product => product.category_id === selectedCategory)
    : products;

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="bg-card rounded-2xl p-8 shadow-xl border border-border">
            <Package className="h-16 w-16 mx-auto mb-6 text-gray-400" />
            <h3 className="text-xl font-semibold mb-4 text-text-primary">
              No hay productos disponibles
            </h3>
            <p className="mb-6 leading-relaxed text-text-secondary">
              Actualmente no tenemos productos en stock. ¡Vuelve pronto para ver nuestras ofertas!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Category Filter */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
      />

      {/* Products count */}
      <div className="text-center">
        <p className="text-text-secondary">
          Mostrando {filteredProducts.length} de {products.length} productos
        </p>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="bg-card rounded-2xl p-8 shadow-xl border border-border">
              <Package className="h-16 w-16 mx-auto mb-6 text-gray-400" />
              <h3 className="text-xl font-semibold mb-4 text-text-primary">
                No hay productos en esta categoría
              </h3>
              <p className="mb-6 leading-relaxed text-text-secondary">
                No se encontraron productos en la categoría seleccionada.
              </p>
              <button
                onClick={() => onCategoryChange('')}
                className="btn btn-primary"
              >
                Ver todos los productos
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              currentUser={currentUser}
              onLoginRequired={onLoginRequired}
              onNotification={onNotification}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;