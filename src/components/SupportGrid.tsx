import React from 'react';
import { SupportCard as SupportCardType } from '../types';
import SupportCard from './SupportCard';
import { Search } from 'lucide-react';

interface SupportGridProps {
  cards: SupportCardType[];
  searchTerm: string;
  onMediaClick: (mediaId: string, mediaType: 'image' | 'video') => void;
  onWhatsAppClick: (card: SupportCardType) => void;
  onClearSearch: () => void;
}

const SupportGrid: React.FC<SupportGridProps> = ({ 
  cards, 
  searchTerm, 
  onMediaClick, 
  onWhatsAppClick, 
  onClearSearch 
}) => {
  const filteredCards = cards.filter(card => {
    const searchLower = searchTerm.toLowerCase();
    return (
      card.title.toLowerCase().includes(searchLower) ||
      card.description.toLowerCase().includes(searchLower) ||
      card.provider?.toLowerCase().includes(searchLower) ||
      card.domains?.toLowerCase().includes(searchLower) ||
      card.compatibility?.toLowerCase().includes(searchLower) ||
      card.type?.toLowerCase().includes(searchLower) ||
      card.commands?.toLowerCase().includes(searchLower) ||
      card.warning?.toLowerCase().includes(searchLower)
    );
  });

  if (filteredCards.length === 0 && searchTerm) {
    return (
      <div className="text-center py-16">
        <Search className="h-16 w-16 text-text-secondary/50 mx-auto mb-6" />
        <p className="text-xl text-text-secondary mb-6">No se encontraron resultados para tu búsqueda.</p>
        <button
          onClick={onClearSearch}
          className="btn btn-primary"
        >
          Mostrar todos
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
      {filteredCards.map((card) => (
        <SupportCard
          key={card.id}
          card={card}
          onMediaClick={onMediaClick}
          onWhatsAppClick={onWhatsAppClick}
        />
      ))}
    </div>
  );
};

export default SupportGrid;