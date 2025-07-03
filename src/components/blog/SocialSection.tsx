import React from 'react';
import { SocialLink } from '../../types/blog';

interface SocialSectionProps {
  socialLinks: SocialLink[];
}

const SocialSection: React.FC<SocialSectionProps> = ({ socialLinks }) => {
  return (
    <section id="contacto" className="social-section">
      <div className="container">
        <h2 className="social-title">Síguenos en redes sociales</h2>
        <div className="social-links">
          {socialLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              className="social-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className={link.icon}></i>
              Síguenos en {link.platform}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialSection;