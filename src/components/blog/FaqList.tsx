import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQ } from '../../types/blog';

interface FaqListProps {
  faqs: FAQ[];
}

const FaqList: React.FC<FaqListProps> = ({ faqs }) => {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const toggleFaq = (faqId: string) => {
    setOpenFaq(openFaq === faqId ? null : faqId);
  };

  return (
    <div 
      className="rounded-2xl p-6 shadow-xl border"
      style={{
        backgroundColor: 'var(--card-bg)',
        borderColor: 'var(--border-color)'
      }}
    >
      <h3 className="text-xl font-bold mb-6 text-primary">Preguntas Frecuentes</h3>
      <div className="space-y-4">
        {faqs.map((faq) => (
          <div key={faq.id} className={`faq-item ${openFaq === faq.id ? 'active' : ''}`}>
            <div
              className={`faq-question ${openFaq === faq.id ? 'active' : ''}`}
              onClick={() => toggleFaq(faq.id)}
              style={{
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)'
              }}
            >
              <span>{faq.question}</span>
              <ChevronDown className="h-4 w-4" />
            </div>
            <div className="faq-answer" style={{ backgroundColor: 'var(--card-bg)' }}>
              <div className="faq-answer-content" style={{ color: 'var(--text-secondary)' }}>
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqList;