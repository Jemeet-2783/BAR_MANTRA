/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SEO } from '../SEO';
import { TeamSection } from '../TeamSection';
import { Sparkles, Star, Shield, Award } from 'lucide-react';

export function AboutView() {
  const pillars = [
    {
      title: 'Artisanal Mixology',
      description: 'We curate spirits with native Rajasthani ingredients—local saffron, rose petals, cardamoms, and hand-cut clear ice spheres—for a royal sensory adventure.',
      icon: Award
    },
    {
      title: 'Pouring Precision',
      description: 'We approach bar management like a high-end ritual. Pouring volumes, temperature control, glass selection, and speed-of-service are tightly calibrated.',
      icon: Sparkles
    },
    {
      title: 'Absolute Trust & Transparency',
      description: 'No markups, no hidden commissions. Our ledger spreadsheet sheets are completely open, giving you absolute financial control over every rupee.',
      icon: Shield
    }
  ];

  return (
    <div className="pt-24 animate-fade-in">
      <SEO
        title="About Barmantra | Royal Jaipur Heritage & Mixology Mastermind"
        description="Learn about Barmantra's founder Kartik Arora and our master mixology team dedicated to revolutionizing mobile bar experiences in Jaipur and Rajasthan."
        url="https://barmantra.com/#/about"
      />
      
      {/* Editorial Page Hero Banner */}
      <section className="relative py-28 bg-maroon-950 text-ivory-50 text-center overflow-hidden">
        {/* Background photo */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1572116553112-75d7767d6c51?auto=format&fit=crop&w=1920&q=80"
            alt="Royal Heritage Bar Setup"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.dataset.fallback) {
                target.dataset.fallback = 'true';
                target.src = 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1920&q=80';
              }
            }}
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-maroon-950 via-maroon-950/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <span className="text-xs font-mono uppercase tracking-widest text-gold-400 font-bold mb-3 block">
            Inside Barmantra
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-ivory-50 tracking-tight leading-tight">
            Our Brand Story <span className="shimmer-gold font-semibold italic">& Heritage</span>
          </h1>
          <p className="font-sans text-sm sm:text-base text-ivory-200 mt-4 max-w-xl mx-auto leading-relaxed font-light">
            Crafting legendary, culturally authentic, and custom-designed luxury bar experiences in Jaipur, Rajasthan, and beyond.
          </p>
        </div>
      </section>

      {/* Brand Narrative Section */}
      <section className="py-20 bg-ivory-50 relative">
        <div className="absolute inset-0 bg-jaali-pattern opacity-5 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl text-maroon-950 mb-6 font-medium">
            The Ritual Behind <span className="italic text-maroon-700">The Splendor</span>
          </h2>
          <div className="w-16 h-[1px] bg-gold-600 mx-auto mb-8" />

          <div className="space-y-6 font-sans text-sm sm:text-base text-gray-700 leading-relaxed font-light text-left">
            <p>
              Barmantra was founded in <strong>2014</strong> inside Raja Park, Jaipur, by an alliance of passionate mixologists and designers who felt modern celebrations lacked artistic, custom-tailored beverage experiences. 
            </p>
            <p>
              Our founders wanted to establish a mixology studio that operated like a classic guild of master craftsmen. We built our own custom design workshop where designers construct bespoke mobile bar counters, custom vintage brass fixtures, and curated lighting specifically for luxury drink presentation.
            </p>
            <p>
              Today, Barmantra represents the gold standard of premium luxury bartending in India. We combine rich native flavors, world-class ice curation, and professional flair bartending with elite mobile bar structures. The result is an experience that flows with absolute, effortless grace.
            </p>
          </div>
        </div>
      </section>

      {/* Core Pillars */}
      <section className="py-20 bg-ivory-100 border-y border-gold-600/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {pillars.map((pillar, idx) => {
              const IconComp = pillar.icon;
              return (
                <div
                  key={idx}
                  className="bg-ivory-50 p-8 rounded-2xl border border-gold-600/15 text-center shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-maroon-900 flex items-center justify-center text-gold-400 mx-auto mb-6 shadow-sm">
                    <IconComp size={22} />
                  </div>
                  <h3 className="font-serif text-xl text-maroon-950 font-semibold mb-3">
                    {pillar.title}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-gray-600 leading-relaxed font-light">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team grid section */}
      <TeamSection />

    </div>
  );
}
