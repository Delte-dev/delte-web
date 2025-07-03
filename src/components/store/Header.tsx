import React from 'react';
import { Play, User, LogOut, Headphones } from 'lucide-react';
import { SiteSettings, User as UserType } from '../../types/store';

interface HeaderProps {
  siteSettings: SiteSettings | null;
  currentUser: UserType | null;
  onLogin: () => void;
  onRegister: () => void;
  onLogout: () => void;
  onShowSupport: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  siteSettings, 
  currentUser, 
  onLogin, 
  onRegister, 
  onLogout,
  onShowSupport 
}) => {
  return (
    <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Play className="h-8 w-8 text-yellow-400" />
            <div>
              <h1 className="text-2xl font-bold">
                {siteSettings?.site_title || 'Delte Streaming'}
              </h1>
              <p className="text-sm text-purple-200">
                {siteSettings?.site_subtitle || 'Tu proveedor de confianza'}
              </p>
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            {currentUser ? (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-medium">¡Hola, {currentUser.name}!</p>
                  <p className="text-sm text-purple-200">@{currentUser.username}</p>
                </div>
                <button
                  onClick={onShowSupport}
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  <Headphones className="h-4 w-4" />
                  Soporte
                </button>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={onLogin}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  <User className="h-4 w-4" />
                  Iniciar Sesión
                </button>
                <button
                  onClick={onRegister}
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  <User className="h-4 w-4" />
                  Registrarse
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;