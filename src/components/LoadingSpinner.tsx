import React from 'react';
import { Loader2, Database, Wifi } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent-blue2/10 p-4">
      <div className="text-center max-w-md mx-auto">
        <div className="bg-card rounded-2xl p-8 shadow-2xl border-2 border-primary/20">
          <div className="relative mb-6">
            <div className="flex justify-center">
              <Database className="h-16 w-16 text-primary/30" />
            </div>
            <div className="absolute inset-0 flex justify-center items-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-primary mb-4">Cargando Sistema</h2>
          
          <div className="space-y-3 text-text-secondary">
            <div className="flex items-center justify-center gap-2">
              <Wifi className="h-4 w-4 text-primary" />
              <span>Conectando con la base de datos...</span>
            </div>
            
            <div className="bg-primary/10 rounded-lg p-3">
              <p className="text-sm">
                Cargando publicaciones, categorías y configuración del blog
              </p>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="w-full bg-primary/20 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;