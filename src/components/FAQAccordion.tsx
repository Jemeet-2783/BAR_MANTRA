/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FAQS } from '../data';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { useSiteContent } from '../useSiteContent';

export function FAQAccordion() {
  const { faqs } = useSiteContent();
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const faqList = faqs && faqs.length > 0 ? faqs : FAQS;

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq-section" className="relative py-24 bg-ivory-50 overflow-hidden">
      <div className="absolute inset-0 bg-jaali-pattern opacity-5 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold-700 mb-2 block">
            Clear Counsel
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-maroon-950 font-medium tracking-tight mb-4">
            Frequently Asked <span className="italic text-maroon-700">Inquiries</span>
          </h2>
          <div className="w-24 h-[1px] bg-gold-600 mx-auto my-4" />
          <p className="font-sans text-sm sm:text-base text-gray-600 leading-relaxed font-light">
            We believe in complete clarity. If your specific question is not listed below, please do not hesitate to contact our customer concierge desks.
          </p>
        </div>

        {/* Accordions List */}
        <div className="space-y-4">
          {faqList.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div
                key={faq.id}
                className="bg-ivory-100 rounded-2xl border border-gold-600/10 hover:border-gold-500/40 overflow-hidden transition-all duration-300"
              >
                {/* Trigger Button */}
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-left px-6 py-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center space-x-4">
                    <HelpCircle className="w-5 h-5 text-gold-700 flex-shrink-0" />
                    <span className="font-serif text-base sm:text-lg text-maroon-950 font-medium leading-tight">
                      {faq.question}
                    </span>
                  </div>
                  <div className="flex-shrink-0 text-gold-700">
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </button>

                {/* Collapsible Content */}
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-[300px] border-t border-gold-600/10' : 'max-h-0'
                  }`}
                >
                  <div className="p-6 bg-ivory-50 text-gray-700 font-sans text-sm sm:text-base leading-relaxed font-light">
                    {faq.answer}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
