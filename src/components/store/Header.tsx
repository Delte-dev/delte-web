import React from 'react';
import { Play, User, LogOut, Headphones } from 'lucide-react';
import { SiteSettings, User as UserType } from '../../types/store';

interface HeaderProps {
  siteSettings: SiteSettings | null;
  currentUser: UserType | null;
  onLogin: () => void;
  onLogout: () => void;
  onShowSupport: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  siteSettings, 
  currentUser, 
  onLogin, 
  onLogout,
  onShowSupport 
}) => {
  return (
    <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 md:gap-3">
            <Play className="h-6 w-6 md:h-8 md:w-8 text-yellow-400" />
            <div>
              <h1 className="text-lg md:text-2xl font-bold">
                {siteSettings?.site_title || 'Delte Streaming'}
              </h1>
              <p className="text-xs md:text-sm text-purple-200 hidden sm:block">
                {siteSettings?.site_subtitle || 'Tu proveedor de confianza'}
              </p>
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {currentUser ? (
              <div className="flex items-center gap-2 md:gap-4">
                <div className="text-right hidden md:block">
                  <p className="font-medium text-sm md:text-base">¡Hola, {currentUser.name}!</p>
                  <p className="text-xs md:text-sm text-purple-200">@{currentUser.username}</p>
                </div>
                <div className="text-right md:hidden">
                  <p className="font-medium text-sm">{currentUser.name}</p>
                </div>
                <button
                  onClick={onShowSupport}
                  className="flex items-center gap-1 md:gap-2 bg-green-500 hover:bg-green-600 px-2 md:px-4 py-1 md:py-2 rounded-lg transition-colors duration-200 text-xs md:text-sm"
                >
                  <Headphones className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden sm:inline">Soporte</span>
                </button>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1 md:gap-2 bg-red-500 hover:bg-red-600 px-2 md:px-4 py-1 md:py-2 rounded-lg transition-colors duration-200 text-xs md:text-sm"
                >
                  <LogOut className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden sm:inline">Cerrar</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 md:gap-3">
                <button
                  onClick={onLogin}
                  className="flex items-center gap-1 md:gap-2 bg-blue-500 hover:bg-blue-600 px-3 md:px-4 py-1 md:py-2 rounded-lg transition-colors duration-200 text-xs md:text-sm"
                >
                  <User className="h-3 w-3 md:h-4 md:w-4" />
                  Iniciar Sesión
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