import React, { useState } from 'react';
import { SocialLink, SiteSettings, FAQ } from '../../types/store';
import { ChevronDown } from 'lucide-react';

interface FooterProps {
  socialLinks: SocialLink[];
  siteSettings: SiteSettings | null;
  faqs: FAQ[];
}

const Footer: React.FC<FooterProps> = ({ socialLinks, siteSettings, faqs }) => {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const toggleFaq = (faqId: string) => {
    setOpenFaq(openFaq === faqId ? null : faqId);
  };

  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      {/* FAQs Section */}
      {faqs.length > 0 && (
        <div className="border-b border-gray-700">
          <div className="container mx-auto px-4 py-8 md:py-12">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">Preguntas Frecuentes</h2>
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq) => (
                <div key={faq.id} className="bg-gray-800 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex items-center justify-between p-4 md:p-6 text-left hover:bg-gray-700 transition-colors duration-200"
                  >
                    <span className="font-semibold text-sm md:text-lg pr-4">{faq.question}</span>
                    <ChevronDown 
                      className={`h-4 w-4 md:h-5 md:w-5 transition-transform duration-200 flex-shrink-0 ${
                        openFaq === faq.id ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                  {openFaq === faq.id && (
                    <div className="px-4 md:px-6 pb-4 md:pb-6">
                      <p className="text-gray-300 leading-relaxed text-sm md:text-base">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Social Links and Footer Info */}
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="text-center">
          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="mb-6 md:mb-8">
              <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Síguenos en nuestras redes</h3>
              <div className="flex flex-wrap justify-center gap-3 md:gap-6">
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 md:gap-2 bg-purple-600 hover:bg-purple-700 px-3 md:px-4 py-2 rounded-lg transition-colors duration-200 text-xs md:text-sm"
                  >
                    <i className={link.icon}></i>
                    <span className="hidden sm:inline">{link.platform}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Footer Text */}
          <div className="space-y-2">
            <p className="text-base md:text-lg font-medium">
              {siteSettings?.footer_text || '©️ 2025 - Delte Streaming'}
            </p>
            <p className="text-gray-400 text-xs md:text-sm">
              {siteSettings?.developer_text || 'Desarrollado por: CyberLink Express 360 Sure'}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;