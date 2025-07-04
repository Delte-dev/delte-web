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

  const generateUniqueId = () => {
    return 'PUR-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
  };

  const handlePurchase = async () => {
    if (!currentUser) {
      onLoginRequired();
      return;
    }

    if (product.stock <= 0) {
      onNotification('warning', '⚠️ Sin Stock Disponible', 'Este producto no tiene stock disponible en este momento.');
      return;
    }

    setPurchasing(true);

    try {
      // Generate unique purchase ID
      const purchaseId = generateUniqueId();

      // Check current stock before purchase
      const { data: currentProduct, error: stockError } = await supabase
        .from('products')
        .select('stock')
        .eq('id', product.id)
        .single();

      if (stockError) throw stockError;

      if (currentProduct.stock <= 0) {
        onNotification('warning', '⚠️ Sin Stock', 'El producto se agotó mientras procesábamos tu solicitud.');
        return;
      }

      // Create purchase record with unique ID
      const { error: purchaseError } = await supabase
        .from('purchases')
        .insert({
          id: purchaseId,
          user_id: currentUser.id,
          product_id: product.id,
          product_name: product.name,
          price: product.price
        });

      if (purchaseError) {
        throw purchaseError;
      }

      // Update stock by decreasing by 1
      const { error: stockUpdateError } = await supabase
        .from('products')
        .update({ 
          stock: currentProduct.stock - 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', product.id);

      if (stockUpdateError) {
        // If stock update fails, delete the purchase record
        await supabase.from('purchases').delete().eq('id', purchaseId);
        throw stockUpdateError;
      }

      // Format WhatsApp message with purchase ID
      const message = `🛒 *NUEVA COMPRA - DELTE STREAMING*

👤 *Cliente:* ${currentUser.name}
📱 *Usuario:* @${currentUser.username}
🎬 *Producto:* ${product.name}
💰 *Precio:* S/ ${product.price.toFixed(2)}
🆔 *ID de Compra:* ${purchaseId}

📧 *Correo del cliente:* ${currentUser.email}
📞 *Teléfono:* ${currentUser.country_code} ${currentUser.phone}

✅ _Compra confirmada - Proceder con la activación del servicio_`;

      const whatsappUrl = `https://wa.me/51936992107?text=${encodeURIComponent(message)}`;
      
      // Open WhatsApp
      window.open(whatsappUrl, '_blank');
      
      onNotification('success', '🎉 ¡Compra Realizada!', `Tu compra ha sido procesada exitosamente. ID: ${purchaseId}. Serás contactado pronto para la activación.`);
      
      // Reload page to show updated stock
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Error creating purchase:', error);
      onNotification('error', '❌ Error en la Compra', 'No se pudo procesar la compra. Por favor, inténtalo de nuevo.');
    } finally {
      setPurchasing(false);
    }
  };

  const handleConsult = () => {
    const message = `💬 *CONSULTA - DELTE STREAMING*

👤 *Cliente:* ${currentUser?.name || 'Usuario Invitado'}
🎬 *Producto de Interés:* ${product.name}
💰 *Precio:* S/ ${product.price.toFixed(2)}

❓ *Consulta:* Tengo una pregunta sobre este producto. ¿Podrías ayudarme?

📞 _Esperando tu respuesta para aclarar mis dudas_`;

    const whatsappUrl = `https://wa.me/51936992107?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full">
        {/* Product Image Container - Fixed Height */}
        <div className="relative flex-shrink-0">
          <div className="w-full h-48 md:h-56 lg:h-64 overflow-hidden">
            {product.image_id ? (
              <MediaDisplay
                mediaId={product.image_id}
                mediaType="image"
                alt={product.name}
                className="w-full h-full object-cover"
                showControls={false}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                <Package className="h-16 w-16 text-purple-400" />
              </div>
            )}
          </div>
          
          {/* Stock badge */}
          <div className="absolute top-3 right-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium shadow-lg ${
              product.stock > 0 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
            }`}>
              {product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}
            </span>
          </div>

          {/* Category badge */}
          {product.category && (
            <div className="absolute top-3 left-3">
              <span className="px-3 py-1 bg-purple-500 text-white rounded-full text-sm font-medium shadow-lg">
                {product.category.name}
              </span>
            </div>
          )}
        </div>

        {/* Product Info - Flexible Content */}
        <div className="p-4 md:p-6 flex flex-col flex-grow">
          <h3 className="text-lg md:text-xl font-bold text-text-primary mb-2 line-clamp-2">
            {product.name}
          </h3>
          
          {product.description && (
            <p className="text-text-secondary mb-4 line-clamp-3 text-sm md:text-base flex-grow">
              {product.description}
            </p>
          )}

          {/* Price */}
          <div className="mb-4 md:mb-6">
            <span className="text-2xl md:text-3xl font-bold text-primary">
              S/ {product.price.toFixed(2)}
            </span>
            <span className="text-text-secondary ml-2 text-sm md:text-base">por 30 días</span>
          </div>

          {/* Action Buttons - Fixed at bottom */}
          <div className="space-y-2 md:space-y-3 mt-auto">
            {/* Terms and Conditions */}
            {product.terms_conditions && (
              <button
                onClick={() => setShowTerms(true)}
                className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 md:py-3 px-3 md:px-4 rounded-lg transition-colors duration-200 text-sm md:text-base"
              >
                <FileText className="h-4 w-4" />
                Términos y Condiciones
              </button>
            )}

            {/* Purchase Button */}
            <button
              onClick={handlePurchase}
              disabled={!currentUser || product.stock <= 0 || purchasing}
              className={`w-full flex items-center justify-center gap-2 py-2 md:py-3 px-3 md:px-4 rounded-lg transition-colors duration-200 text-sm md:text-base font-medium ${
                !currentUser
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : product.stock <= 0
                  ? 'bg-red-400 text-white cursor-not-allowed'
                  : purchasing
                  ? 'bg-green-400 text-white cursor-wait'
                  : 'bg-green-500 hover:bg-green-600 text-white hover:scale-105 transform'
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
              className="w-full flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 text-white py-2 md:py-3 px-3 md:px-4 rounded-lg transition-colors duration-200 hover:scale-105 transform text-sm md:text-base"
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