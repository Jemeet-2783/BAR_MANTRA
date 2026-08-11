/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SEO } from '../SEO';
import { ContactForm } from '../ContactForm';
import { Sparkles, Star } from 'lucide-react';

export function ContactView() {
  return (
    <div className="pt-24 animate-fade-in">
      <SEO
        title="Book an Event & Contact Concierge | Barmantra Mobile Bar"
        description="Book your luxury mobile bar service with Barmantra Jaipur. Submit your event date, guest count, and cocktail requirements for instant server quote generation."
        url="https://barmantra.com/#/contact"
      />
      
      {/* Editorial Page Header */}
      <section className="relative py-16 sm:py-24 md:py-28 bg-maroon-950 text-ivory-50 text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&w=1920&q=80"
            alt="Luxury bar experience"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.dataset.fallback) {
                target.dataset.fallback = 'true';
                target.src = 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1920&q=80';
              }
            }}
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-maroon-950 via-maroon-950/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <span className="text-xs font-mono uppercase tracking-widest text-gold-400 font-bold mb-2 sm:mb-3 block">
            Plan With Us
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-ivory-50 tracking-tight leading-tight">
            Connect with Our <span className="shimmer-gold italic font-semibold">Concierge</span>
          </h1>
          <p className="font-sans text-xs sm:text-base text-ivory-200 mt-3 sm:mt-4 max-w-2xl mx-auto leading-relaxed font-light">
            We are based in Raja Park, Jaipur, and planning majestic events pan-India. Complete our royal enquiry sheet to initialize your layout schedule.
          </p>
        </div>
      </section>

      {/* Main Form container */}
      <div className="bg-ivory-50">
        <ContactForm />
      </div>

    </div>
  );
}
