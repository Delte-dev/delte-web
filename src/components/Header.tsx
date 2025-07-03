import React from 'react';
import { Headphones } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="text-center mb-10 p-10 bg-gradient-to-br from-primary to-accent-blue2 rounded-2xl shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
      <div className="relative z-10">
        <h1 className="text-white text-4xl font-bold mb-3 text-shadow flex items-center justify-center gap-3">
          <Headphones className="h-10 w-10" />
          Sistema de Soporte Técnico Luna
        </h1>
        <p className="text-white/90 text-lg max-w-2xl mx-auto">
          Centro de ayuda y asistencia técnica especializada
        </p>
      </div>
    </header>
  );
};

export default Header;