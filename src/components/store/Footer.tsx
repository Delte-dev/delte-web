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
          <div className="container mx-auto px-4 py-12">
            <h2 className="text-3xl font-bold text-center mb-8">Preguntas Frecuentes</h2>
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq) => (
                <div key={faq.id} className="bg-gray-800 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-700 transition-colors duration-200"
                  >
                    <span className="font-semibold text-lg">{faq.question}</span>
                    <ChevronDown 
                      className={`h-5 w-5 transition-transform duration-200 ${
                        openFaq === faq.id ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                  {openFaq === faq.id && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Social Links and Footer Info */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Síguenos en nuestras redes</h3>
              <div className="flex justify-center gap-6">
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    <i className={link.icon}></i>
                    {link.platform}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Footer Text */}
          <div className="space-y-2">
            <p className="text-lg font-medium">
              {siteSettings?.footer_text || '©️ 2025 - Delte Streaming'}
            </p>
            <p className="text-gray-400 text-sm">
              {siteSettings?.developer_text || 'Desarrollado por: CyberLink Express 360 Sure'}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;