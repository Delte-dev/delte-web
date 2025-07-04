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
  duration = 4000
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
        return 'from-green-50 via-green-100 to-emerald-50 dark:from-green-900/30 dark:via-green-800/20 dark:to-emerald-900/30';
      case 'error':
        return 'from-red-50 via-red-100 to-rose-50 dark:from-red-900/30 dark:via-red-800/20 dark:to-rose-900/30';
      case 'warning':
        return 'from-yellow-50 via-yellow-100 to-amber-50 dark:from-yellow-900/30 dark:via-yellow-800/20 dark:to-amber-900/30';
      case 'info':
        return 'from-blue-50 via-blue-100 to-cyan-50 dark:from-blue-900/30 dark:via-blue-800/20 dark:to-cyan-900/30';
      default:
        return 'from-blue-50 via-blue-100 to-cyan-50 dark:from-blue-900/30 dark:via-blue-800/20 dark:to-cyan-900/30';
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

  const getButtonColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 hover:bg-green-600 focus:ring-green-500';
      case 'error':
        return 'bg-red-500 hover:bg-red-600 focus:ring-red-500';
      case 'warning':
        return 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500';
      case 'info':
        return 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500';
      default:
        return 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
      <div className={`bg-gradient-to-br ${getBackgroundColor()} rounded-2xl max-w-md w-full border-2 ${getBorderColor()} shadow-2xl transform transition-all duration-300 scale-100 animate-pulse`}>
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 animate-bounce">
              {getIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-text-primary mb-2 leading-tight">
                {title}
              </h3>
              <p className="text-text-secondary leading-relaxed text-sm">
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
                  className={`h-1 rounded-full transition-all ease-linear ${
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
          
          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-105 ${getButtonColor()}`}
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