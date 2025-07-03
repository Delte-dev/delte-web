import React from 'react';
import { SupportCard as SupportCardType } from '../types';
import { Play, FileText, ExternalLink, MessageCircle, Notebook as Robot, Tv, Unlock, Link as LinkIcon, Key, CircuitBoard } from 'lucide-react';

interface SupportCardProps {
  card: SupportCardType;
  onMediaClick: (mediaId: string, mediaType: 'image' | 'video') => void;
  onWhatsAppClick: (card: SupportCardType) => void;
}

const SupportCard: React.FC<SupportCardProps> = ({ card, onMediaClick, onWhatsAppClick }) => {
  const getCardIcon = (title: string) => {
    if (title.includes('PDF') || title.includes('Tutorial')) return FileText;
    if (title.includes('Bot') || title.includes('Telegram')) return Robot;
    if (title.includes('TV')) return Tv;
    if (title.includes('Código') || title.includes('PIN')) return Key;
    if (title.includes('Prime Video')) return Play;
    if (title.includes('Links') || title.includes('Activación')) return LinkIcon;
    if (title.includes('Netflix')) return CircuitBoard;
    return Unlock;
  };

  const IconComponent = getCardIcon(card.title);

  const formatTextWithFormatting = (text: string) => {
    // Convert line breaks to HTML and apply formatting
    return text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        // Apply formatting to each line
        return line
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/__(.*?)__/g, '<u>$1</u>');
      })
      .join('<br><br>'); // Double break for paragraph separation
  };

  const formatSimpleText = (text: string) => {
    // For simple fields, just convert line breaks
    return text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('<br>');
  };

  return (
    <div className="bg-card border-2 border-border rounded-2xl p-6 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-primary relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent-blue2"></div>
      
      <div className="flex items-center gap-3 mb-4">
        <IconComponent className="h-6 w-6 text-primary" />
        <h3 
          className="text-xl font-bold text-primary" 
          dangerouslySetInnerHTML={{ __html: formatTextWithFormatting(card.title) }} 
        />
      </div>
      
      <div 
        className="text-text-secondary mb-4 leading-relaxed" 
        dangerouslySetInnerHTML={{ __html: formatTextWithFormatting(card.description) }} 
      />
      
      <div className="space-y-2 mb-6">
        {card.type && (
          <div className="flex">
            <span className="font-bold text-accent-blue min-w-[120px]">Tipo:</span>
            <span 
              className="text-text-secondary"
              dangerouslySetInnerHTML={{ __html: formatSimpleText(card.type) }}
            />
          </div>
        )}
        {card.provider && (
          <div className="flex">
            <span className="font-bold text-accent-blue min-w-[120px]">Proveedor:</span>
            <span 
              className="text-text-secondary"
              dangerouslySetInnerHTML={{ __html: formatSimpleText(card.provider) }}
            />
          </div>
        )}
        {card.domains && (
          <div className="flex">
            <span className="font-bold text-accent-blue min-w-[120px]">Dominios:</span>
            <span 
              className="text-text-secondary"
              dangerouslySetInnerHTML={{ __html: formatSimpleText(card.domains) }}
            />
          </div>
        )}
        {card.commands && (
          <div className="flex">
            <span className="font-bold text-accent-blue min-w-[120px]">Comandos:</span>
            <span 
              className="text-text-secondary break-all"
              dangerouslySetInnerHTML={{ __html: formatSimpleText(card.commands) }}
            />
          </div>
        )}
        {card.email && (
          <div className="flex">
            <span className="font-bold text-accent-blue min-w-[120px]">Correo:</span>
            <span className="text-text-secondary break-all">{card.email}</span>
          </div>
        )}
        {card.password && (
          <div className="flex">
            <span className="font-bold text-accent-blue min-w-[120px]">Contraseña:</span>
            <span className="text-text-secondary">{card.password}</span>
          </div>
        )}
        {card.steps && card.steps.length > 0 && (
          <div className="flex flex-col">
            <span className="font-bold text-accent-blue mb-1">Pasos:</span>
            <ol className="text-text-secondary pl-4">
              {card.steps.map((step, index) => (
                <li key={index} className="mb-1">{index + 1}. {step}</li>
              ))}
            </ol>
          </div>
        )}
        {card.services && card.services.length > 0 && (
          <div className="flex flex-col">
            <span className="font-bold text-accent-blue mb-1">Servicios:</span>
            <div className="text-text-secondary pl-4 space-y-1">
              {card.services.map((service, index) => (
                <div key={index}>
                  {index + 1}. <a href={service.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{service.name}</a>
                </div>
              ))}
            </div>
          </div>
        )}
        {card.compatibility && (
          <div className="flex flex-col">
            <span className="font-bold text-accent-blue mb-1">Compatibilidad:</span>
            <div 
              className="text-text-secondary"
              dangerouslySetInnerHTML={{ __html: formatTextWithFormatting(card.compatibility) }}
            />
          </div>
        )}
        {card.warning && (
          <div className="flex flex-col">
            <span className="font-bold text-accent-red mb-1">Advertencia:</span>
            <div 
              className="text-text-secondary"
              dangerouslySetInnerHTML={{ __html: formatTextWithFormatting(card.warning) }}
            />
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap justify-center gap-3">
        {card.buttons.map((button, index) => {
          if (button.type === 'media') {
            return (
              <button
                key={index}
                onClick={() => onMediaClick(button.mediaId!, button.mediaType!)}
                className="btn btn-primary flex items-center gap-2"
              >
                {button.mediaType === 'video' ? <Play className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                {button.text}
              </button>
            );
          } else if (button.type === 'link') {
            return (
              <a
                key={index}
                href={button.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                {button.text}
              </a>
            );
          } else if (button.type === 'whatsapp') {
            return (
              <button
                key={index}
                onClick={() => onWhatsAppClick(card)}
                className="btn btn-whatsapp flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                {button.text}
              </button>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default SupportCard;