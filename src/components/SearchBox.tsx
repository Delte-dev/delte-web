import React from 'react';
import { Search } from 'lucide-react';

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ value, onChange }) => {
  return (
    <div className="relative max-w-3xl mx-auto mb-10">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar por título, proveedor, dominio, compatibilidad, tipo..."
        className="w-full py-4 px-6 pr-14 border-2 border-border rounded-full text-lg bg-card text-text-primary transition-all duration-300 shadow-lg focus:outline-none focus:border-primary focus:shadow-primary/30 focus:shadow-xl"
      />
      <Search className="absolute right-5 top-1/2 transform -translate-y-1/2 text-primary h-6 w-6" />
    </div>
  );
};

export default SearchBox;