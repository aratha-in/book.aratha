import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FAQ } from '../types';
import { api } from '../services/api';
import { SectionHeading } from '../components/common/SectionHeading';
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react';

export const FaqPage: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getFaqs().then((res) => {
      setFaqs(res);
      setLoading(false);
    }).catch(console.error);
  }, []);

  const categories = ['All', ...Array.from(new Set(faqs.map((f) => f.category)))];

  const filteredFaqs = selectedCategory === 'All'
    ? faqs
    : faqs.filter((f) => f.category === selectedCategory);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      <SectionHeading
        tag="Clarity & Guidance"
        title="Frequently Asked Questions"
        subtitle="Explore practical answers regarding editorial appraisal, copyright retention, print production standards, ISBN allocation, and publishing contracts."
      />

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 pt-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              selectedCategory === cat
                ? 'bg-charcoal-900 text-ivory-100 shadow-sm'
                : 'bg-white border border-[#E5DFD5] text-charcoal-700 hover:bg-ivory-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ Accordion List */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-ivory-200 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFaqs.map((faq) => {
            const isOpen = activeId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-xl border border-[#E5DFD5] overflow-hidden shadow-subtle transition-all"
              >
                <button
                  onClick={() => setActiveId(isOpen ? null : faq.id)}
                  className="w-full p-5 text-left flex items-center justify-between text-base font-serif font-bold text-charcoal-900 hover:text-gold-700 transition-colors"
                >
                  <span className="pr-4">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-gold-600 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-charcoal-700 leading-relaxed font-sans border-t border-ivory-200 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Still Have Questions CTA */}
      <div className="bg-ivory-50 p-8 rounded-xl border border-[#E5DFD5] text-center space-y-3">
        <h3 className="font-serif text-lg font-bold text-charcoal-900">
          Have a Question Not Answered Here?
        </h3>
        <p className="text-xs text-charcoal-600 max-w-md mx-auto">
          Our editorial team will gladly answer specific queries regarding your manuscript or publishing goals.
        </p>
        <div className="pt-2">
          <Link
            to="/contact"
            className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-charcoal-900 hover:text-gold-700 underline"
          >
            <span>Contact Editorial Office</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

    </div>
  );
};
