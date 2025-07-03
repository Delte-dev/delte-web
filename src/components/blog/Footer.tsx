import React from 'react';
import { SiteSettings } from '../../types/blog';

interface FooterProps {
  siteSettings: SiteSettings | null;
}

const Footer: React.FC<FooterProps> = ({ siteSettings }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {currentYear} {siteSettings?.footer_text || 'Chacha Guayas Driver. Todos los derechos reservados.'}</p>
        {siteSettings?.contact_phone && (
          <p>Teléfono: {siteSettings.contact_phone}</p>
        )}
      </div>
    </footer>
  );
};

export default Footer;