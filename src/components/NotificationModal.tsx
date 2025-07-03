import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, XCircle, Info, X } from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  autoClose?: boolean;
  duration?: number;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  type,
  title,
  message,
  autoClose = true,
  duration = 3000
}) => {
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, duration, onClose]);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case 'error':
        return <XCircle className="h-8 w-8 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-8 w-8 text-yellow-500" />;
      case 'info':
        return <Info className="h-8 w-8 text-blue-500" />;
      default:
        return <Info className="h-8 w-8 text-blue-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20';
      case 'error':
        return 'from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20';
      case 'warning':
        return 'from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20';
      case 'info':
        return 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20';
      default:
        return 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20';
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return 'border-green-200 dark:border-green-700';
      case 'error':
        return 'border-red-200 dark:border-red-700';
      case 'warning':
        return 'border-yellow-200 dark:border-yellow-700';
      case 'info':
        return 'border-blue-200 dark:border-blue-700';
      default:
        return 'border-blue-200 dark:border-blue-700';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
      <div className={`bg-gradient-to-br ${getBackgroundColor()} rounded-2xl max-w-md w-full border-2 ${getBorderColor()} shadow-2xl transform transition-all duration-300 scale-100`}>
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              {getIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {title}
              </h3>
              <p className="text-text-secondary leading-relaxed">
                {message}
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-200"
            >
              <X className="h-5 w-5 text-text-secondary" />
            </button>
          </div>
          
          {autoClose && (
            <div className="mt-4">
              <div className="w-full bg-black/10 dark:bg-white/10 rounded-full h-1">
                <div 
                  className={`h-1 rounded-full transition-all duration-${duration} ease-linear ${
                    type === 'success' ? 'bg-green-500' :
                    type === 'error' ? 'bg-red-500' :
                    type === 'warning' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`}
                  style={{
                    animation: `shrink ${duration}ms linear forwards`
                  }}
                />
              </div>
            </div>
          )}
          
          <div className="flex justify-end mt-4">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                type === 'success' ? 'bg-green-500 hover:bg-green-600 text-white' :
                type === 'error' ? 'bg-red-500 hover:bg-red-600 text-white' :
                type === 'warning' ? 'bg-yellow-500 hover:bg-yellow-600 text-white' :
                'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default NotificationModal;