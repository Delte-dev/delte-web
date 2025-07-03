import React from 'react';
import { X, FileText } from 'lucide-react';
import { Product } from '../../types/store';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, product }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border-2 border-primary shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Términos y Condiciones - {product.name}
          </h2>
          <button onClick={onClose} className="btn btn-secondary p-2">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {product.terms_conditions ? (
            <div className="prose prose-lg max-w-none text-text-primary">
              {product.terms_conditions.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-text-secondary text-center py-8">
              No hay términos y condiciones disponibles para este producto.
            </p>
          )}
        </div>
        
        <div className="p-6 border-t border-border text-center">
          <button
            onClick={onClose}
            className="btn btn-primary"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;