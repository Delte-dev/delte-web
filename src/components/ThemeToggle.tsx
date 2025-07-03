import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Theme } from '../types';

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="bg-blue-600 hover:bg-blue-700 text-white w-12 h-12 rounded-full shadow-lg hover:scale-110 transition-all duration-300 flex items-center justify-center hover:shadow-xl"
      title={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
      aria-label={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
      style={{
        backgroundColor: '#2563eb',
        color: 'white',
        border: 'none',
        zIndex: 9999
      }}
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );
};

export default ThemeToggle;