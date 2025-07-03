import React from 'react';
import { Star, Shield, Clock } from 'lucide-react';
import { SiteSettings } from '../../types/store';

interface HeroProps {
  siteSettings: SiteSettings | null;
}

const Hero: React.FC<HeroProps> = ({ siteSettings }) => {
  return (
    <section className="bg-gradient-to-br from-purple-700 via-blue-600 to-indigo-800 text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          {siteSettings?.site_title || 'Delte Streaming'}
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-purple-100 max-w-3xl mx-auto">
          {siteSettings?.site_subtitle || 'Tu proveedor de confianza para servicios de streaming premium'}
        </p>
        
        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-4xl mx-auto">
          <div className="flex flex-col items-center">
            <div className="bg-yellow-500 p-4 rounded-full mb-4">
              <Star className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Calidad Premium</h3>
            <p className="text-purple-200">Servicios de streaming de la más alta calidad</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="bg-green-500 p-4 rounded-full mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">100% Seguro</h3>
            <p className="text-purple-200">Transacciones seguras y soporte garantizado</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="bg-blue-500 p-4 rounded-full mb-4">
              <Clock className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Activación Rápida</h3>
            <p className="text-purple-200">Recibe tus credenciales en máximo 24 horas</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;