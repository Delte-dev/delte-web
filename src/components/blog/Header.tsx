import React from 'react';
import { Car } from 'lucide-react';
import { SiteSettings } from '../../types/blog';

interface HeaderProps {
  siteSettings: SiteSettings | null;
}

const Header: React.FC<HeaderProps> = ({ siteSettings }) => {
  return (
    <header className="header">
      <div className="nav-container">
        <a href="#" className="logo">
          <Car className="h-7 w-7" />
          {siteSettings?.site_title || 'Chacha Guayas Driver'}
        </a>
      </div>
    </header>
  );
};

export default Header;