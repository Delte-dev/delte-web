import React, { useState } from 'react';
import { Product, User } from '../../types/store';
import { ShoppingCart, FileText, MessageCircle, Package } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import MediaDisplay from '../MediaDisplay';
import TermsModal from './TermsModal';

interface ProductCardProps {
  product: Product;
  currentUser: User | null;
  onLoginRequired: () => void;
  onNotification: (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currentUser,
  onLoginRequired,
  onNotification
}) => {
  const [showTerms, setShowTerms] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  const handlePurchase = async () => {
    if (!currentUser) {
      onLoginRequired();
      return;
    }

    if (product.stock <= 0) {
      onNotification('warning', 'Sin stock', 'Este producto no tiene stock disponible.');
      return;
    }

    setPurchasing(true);

    try {
      // Create purchase record
      const { error: purchaseError } = await supabase
        .from('purchases')
        .insert({
          id: `purchase-${Date.now()}`,
          user_id: currentUser.id,
          product_id: product.id,
          product_name: product.name,
          price: product.price
        });

      if (purchaseError) {
        throw purchaseError;
      }

      // Format WhatsApp message
      const message = `Hola, *Delte*. Te escribe *${currentUser.name}*... Deseo adquirir *${product.name}*, por favor.`;
      const whatsappUrl = `https://wa.me/51936992107?text=${encodeURIComponent(message)}`;
      
      // Open WhatsApp
      window.open(whatsappUrl, '_blank');
      
      onNotification('success', '¡Compra iniciada!', 'Serás redirigido a WhatsApp para completar tu compra.');
    } catch (error) {
      console.error('Error creating purchase:', error);
      onNotification('error', 'Error', 'No se pudo procesar la compra. Inténtalo de nuevo.');
    } finally {
      setPurchasing(false);
    }
  };

  const handleConsult = () => {
    const message = `Hola, *Delte*. Tengo una consulta sobre *${product.name}*. ¿Podrías ayudarme?`;
    const whatsappUrl = `https://wa.me/51936992107?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
        {/* Product Image */}
        <div className="relative">
          {product.image_id ? (
            <MediaDisplay
              mediaId={product.image_id}
              mediaType="image"
              alt={product.name}
              className="w-full h-48 object-cover"
              showControls={false}
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
              <Package className="h-16 w-16 text-purple-400" />
            </div>
          )}
          
          {/* Stock badge */}
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              product.stock > 0 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
            }`}>
              {product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}
            </span>
          </div>

          {/* Category badge */}
          {product.category && (
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-purple-500 text-white rounded-full text-sm font-medium">
                {product.category.name}
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-text-primary mb-2">
            {product.name}
          </h3>
          
          {product.description && (
            <p className="text-text-secondary mb-4 line-clamp-2">
              {product.description}
            </p>
          )}

          {/* Price */}
          <div className="mb-6">
            <span className="text-3xl font-bold text-primary">
              S/ {product.price.toFixed(2)}
            </span>
            <span className="text-text-secondary ml-2">por 30 días</span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Terms and Conditions */}
            {product.terms_conditions && (
              <button
                onClick={() => setShowTerms(true)}
                className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg transition-colors duration-200"
              >
                <FileText className="h-4 w-4" />
                Términos y Condiciones
              </button>
            )}

            {/* Purchase Button */}
            <button
              onClick={handlePurchase}
              disabled={!currentUser || product.stock <= 0 || purchasing}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-colors duration-200 ${
                !currentUser
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : product.stock <= 0
                  ? 'bg-red-400 text-white cursor-not-allowed'
                  : purchasing
                  ? 'bg-green-400 text-white cursor-wait'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              <ShoppingCart className="h-4 w-4" />
              {!currentUser 
                ? 'Inicia sesión para comprar'
                : product.stock <= 0
                ? 'Sin stock'
                : purchasing
                ? 'Procesando...'
                : 'Comprar'
              }
            </button>

            {/* Consult Button */}
            <button
              onClick={handleConsult}
              className="w-full flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-lg transition-colors duration-200"
            >
              <MessageCircle className="h-4 w-4" />
              Consultar
            </button>
          </div>
        </div>
      </div>

      {/* Terms Modal */}
      <TermsModal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        product={product}
      />
    </>
  );
};

export default ProductCard;