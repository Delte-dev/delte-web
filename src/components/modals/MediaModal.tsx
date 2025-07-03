import React, { useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';

interface MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaId: string;
  mediaType: 'image' | 'video';
}

const MediaModal: React.FC<MediaModalProps> = ({ isOpen, onClose, mediaId, mediaType }) => {
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

  if (!isOpen) return null;

  const previewUrl = `https://drive.google.com/file/d/${mediaId}/preview`;
  const directUrl = `https://drive.google.com/file/d/${mediaId}/view`;

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-card rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border-2 border-primary shadow-2xl relative">
        {/* Header with close button */}
        <div className="flex justify-between items-center p-6 border-b border-border bg-card relative z-10">
          <h2 className="text-2xl font-bold text-primary">
            {mediaType === 'video' ? 'Video Tutorial' : 'Tutorial PDF'}
          </h2>
          <button 
            onClick={onClose} 
            className="btn btn-secondary p-2 hover:bg-accent-red transition-colors duration-200"
            title="Cerrar (Esc)"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={previewUrl}
              className="absolute inset-0 w-full h-full border-none rounded-lg shadow-lg"
              allow="autoplay"
              title={mediaType === 'video' ? 'Video Tutorial' : 'Tutorial PDF'}
            />
          </div>
          
          <div className="text-center mt-6">
            <a
              href={directUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary inline-flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Abrir en Google Drive
            </a>
          </div>
          
          {/* Escape key hint */}
          <div className="text-center mt-4">
            <p className="text-xs text-text-secondary">
              Presiona <kbd className="px-2 py-1 bg-bg-secondary border border-border rounded text-xs">Esc</kbd> para cerrar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaModal;