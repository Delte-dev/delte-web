import React from 'react';
import { MessageCircle, Calendar, Phone } from 'lucide-react';
import { SiteSettings } from '../../types/blog';

interface HeroProps {
  siteSettings: SiteSettings | null;
}

const Hero: React.FC<HeroProps> = ({ siteSettings }) => {
  return (
    <section className="blog-hero">
      <div className="blog-hero-content">
        <h1>Blog de {siteSettings?.site_title || 'Chacha Guayas Driver'}</h1>
        <p className="blog-hero-subtitle">
          {siteSettings?.site_subtitle || 'Consejos de viaje, noticias locales y beneficios del taxi privado'}
        </p>
        
        <div className="cta-buttons">
          {siteSettings?.whatsapp_url && (
            <a href={siteSettings.whatsapp_url} className="btn btn-whatsapp" target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5" />
              Solicita tu taxi
            </a>
          )}
          {siteSettings?.reservation_url && (
            <a href={siteSettings.reservation_url} className="btn btn-reserve" target="_blank" rel="noopener noreferrer">
              <Calendar className="h-5 w-5" />
              Reserva ahora
            </a>
          )}
          {siteSettings?.contact_phone && (
            <a href={`tel:${siteSettings.contact_phone}`} className="btn btn-call">
              <Phone className="h-5 w-5" />
              Llámanos
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;