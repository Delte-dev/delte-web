import React from 'react';
import { AlertCircle, RefreshCw, Database, Wifi } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  const isConnectionError = message.toLowerCase().includes('conexión') || 
                           message.toLowerCase().includes('connection') ||
                           message.toLowerCase().includes('network');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent-red/10 to-accent-red/5 p-4">
      <div className="text-center max-w-lg mx-auto">
        <div className="bg-card rounded-2xl p-8 shadow-2xl border-2 border-accent-red/20">
          <div className="flex justify-center mb-6">
            {isConnectionError ? (
              <div className="relative">
                <Wifi className="h-16 w-16 text-accent-red" />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent-red rounded-full flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 text-white" />
                </div>
              </div>
            ) : (
              <div className="relative">
                <Database className="h-16 w-16 text-accent-red" />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent-red rounded-full flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 text-white" />
                </div>
              </div>
            )}
          </div>
          
          <h2 className="text-2xl font-bold text-accent-red mb-4">
            {isConnectionError ? 'Error de Conexión' : 'Error del Sistema'}
          </h2>
          
          <div className="bg-accent-red/10 border border-accent-red/20 rounded-lg p-4 mb-6">
            <p className="text-text-secondary leading-relaxed">{message}</p>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={onRetry}
              className="w-full btn btn-primary flex items-center justify-center gap-2 hover:scale-105 transition-transform duration-200"
            >
              <RefreshCw className="h-4 w-4" />
              Reintentar Conexión
            </button>
            
            <div className="text-sm text-text-secondary">
              <p className="mb-2">Si el problema persiste:</p>
              <ul className="text-left space-y-1">
                <li>• Verifica tu conexión a internet</li>
                <li>• Recarga la página completamente</li>
                <li>• Contacta al administrador del sistema</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;