import React from 'react';
import { Search } from 'lucide-react';

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ value, onChange }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="search-container">
      <form className="search-form" onSubmit={handleSubmit}>
        <input
          type="search"
          className="search-input"
          placeholder="Buscar en el blog..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            borderColor: 'var(--border-color)'
          }}
        />
        <button type="submit" className="search-button">
          <Search className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};

export default SearchBox;