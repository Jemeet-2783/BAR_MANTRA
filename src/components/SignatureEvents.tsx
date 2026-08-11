/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Star, Sparkles } from 'lucide-react';

interface SignatureEvent {
  id: string;
  title: string;
  image: string;
  tag: string;
  description: string;
  highlights: string[];
}

const SIGNATURE_EVENTS: SignatureEvent[] = [
  {
    id: 'sig-1',
    title: 'Royal Wedding Bar Curation',
    image: 'https://image.wedmegood.com/resized/1000X/uploads/member/1146941/1739044120_image3892.jpg',
    tag: 'Palace Weddings',
    description: 'Transforming historic forts and palace venues with grand royal bars, delivering bespoke signature cocktails, custom ice stamps, and spectacular service.',
    highlights: ['Custom crystal glassware', 'Saffron-infused signature blends', 'Elite royal uniformed mixologists']
  },
  {
    id: 'sig-2',
    title: 'Destination Resort Bar Service',
    image: 'https://image.wedmegood.com/resized/1000X/uploads/member/1146941/1738672358_image6125.jpg',
    tag: 'Elite Hospitality',
    description: 'Bespoke multi-day resort bar setups with dedicated mixology carts, customized guest arrival welcome drinks, and daily themed poolside bars.',
    highlights: ['Liquid nitrogen culinary mixology', 'Themed morning hangover cures', '24/7 hospitality lounge setup']
  },
  {
    id: 'sig-3',
    title: 'Corporate Lounge & Brand Bars',
    image: 'https://image.wedmegood.com/resized/1000X/uploads/member/1146941/1739044117_image5514.jpg',
    tag: 'Brand Prestige',
    description: 'Ultra-luxurious cocktail lounges designed for corporate networks, combining custom company branded ice logos, state-of-the-art smoke-infusions, and rapid service.',
    highlights: ['Laser-etched logo ice blocks', 'Pre-batched draft cocktail systems', 'Choreographed flair bar shows']
  },
  {
    id: 'sig-4',
    title: 'Sangeet & Mehendi Craft Bars',
    image: 'https://image.wedmegood.com/resized/1000X/uploads/member/1146941/1741282366_image4645.jpg',
    tag: 'Vibrant Celebrations',
    description: 'High-energy colorful bars featuring fast-paced interactive cocktail counters, local native-infused mocktails, and spectacular flair bartending presentations.',
    highlights: ['Dual-lane high-speed service', 'Traditional marigold-dressed bar backdrops', 'Interactive DIY cocktail setups']
  },
  {
    id: 'sig-5',
    title: 'Cultural & Folk Festivity Bars',
    image: 'https://image.wedmegood.com/resized/1000X/uploads/member/1146941/1738668977_image2392.jpg',
    tag: 'Heritage Festive',
    description: 'Bringing the soul of Rajasthan to life through traditional earthenware (kulhad) cocktail serves, local herbal infusions, and candlelit vintage brass bars.',
    highlights: ['Earthen kulhad-style cocktails', 'Native cardamom & rose liquor blends', 'Brass-fitted antique bar aesthetics']
  },
  {
    id: 'sig-6',
    title: 'Private Haveli Cocktail Soirées',
    image: 'https://image.wedmegood.com/resized/1000X/uploads/member/1146941/1738672358_image6125.jpg',
    tag: 'Personal Milestones',
    description: 'Bespoke bar lounges set in private havelis, designed with romantic candlelight, custom-aged whiskey tastings, and personalized menu pairings.',
    highlights: ['Single-malt rare collection tastings', 'Personalized laser-engraved menus', 'Discreet, highly attentive bartenders']
  }
];

export function SignatureEvents() {
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);

  const handleCardClick = (id: string) => {
    setFlippedCardId(flippedCardId === id ? null : id);
  };

  return (
    <section id="signature-events-section" className="relative py-24 bg-ivory-100 border-b border-gold-600/10">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-jaali-pattern opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold-700 mb-2 block">
            Signature Formats
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-maroon-950 font-medium tracking-tight mb-4">
            Curated Bar <span className="italic text-maroon-700">Masterpieces</span>
          </h2>
          <div className="w-24 h-[1px] bg-gold-600 mx-auto my-4" />
          <p className="font-sans text-sm sm:text-base text-gray-600 leading-relaxed font-light">
            Each celebration scale represents a unique ritual template. Hover (or tap on mobile) each card to reveal our dedicated bar scopes and signature deliverables.
          </p>
        </div>

        {/* 3D Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SIGNATURE_EVENTS.map((event) => {
            const isFlipped = flippedCardId === event.id;

            return (
              <div
                key={event.id}
                onClick={() => handleCardClick(event.id)}
                className="relative h-[420px] w-full cursor-pointer perspective-1000 group"
                style={{ perspective: '1000px' }}
              >
                {/* Rotating Container */}
                <div
                  className={`relative w-full h-full duration-700 preserve-3d transition-transform ${
                    isFlipped ? 'rotate-y-180' : 'group-hover:rotate-y-12'
                  }`}
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : undefined
                  }}
                >
                  
                  {/* FRONT SIDE */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden shadow-lg border border-gold-600/20 backface-hidden flex flex-col justify-end p-6 bg-maroon-950"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    {/* Background image */}
                    <img
                      src={event.image}
                      alt={event.title}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.dataset.fallback) {
                          target.dataset.fallback = 'true';
                          target.src = 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80';
                        }
                      }}
                      className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Shadow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-maroon-950 via-maroon-950/40 to-transparent z-10" />

                    <div className="relative z-20">
                      <span className="inline-block text-[10px] font-mono font-bold uppercase tracking-widest text-gold-400 bg-maroon-900/80 px-2.5 py-1 rounded-md border border-gold-500/30 mb-3">
                        {event.tag}
                      </span>
                      <h3 className="font-serif text-2xl text-ivory-50 font-medium tracking-wide">
                        {event.title}
                      </h3>
                      <p className="text-xs text-gold-500/80 font-sans mt-2 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Tap to reveal details</span>
                      </p>
                    </div>
                  </div>

                  {/* BACK SIDE */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden shadow-xl border-2 border-gold-500 backface-hidden p-8 flex flex-col justify-between bg-maroon-950 text-ivory-100"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    {/* Subtle design mark inside the back */}
                    <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full border border-gold-500/10" />
                    
                    <div>
                      <span className="text-[10px] font-mono tracking-widest uppercase text-gold-400 mb-2 block">
                        Our Dedicated Scope
                      </span>
                      <h3 className="font-serif text-2xl text-gold-500 font-medium tracking-wide mb-4 pb-2 border-b border-gold-500/20">
                        {event.title}
                      </h3>
                      <p className="font-sans text-sm text-ivory-200 leading-relaxed font-light mb-6">
                        {event.description}
                      </p>
                      
                      {/* Highlight Bullets */}
                      <ul className="space-y-2.5">
                        {event.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-start text-xs text-ivory-300">
                            <span className="text-gold-500 mr-2.5">✦</span>
                            <span className="font-sans">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="text-xs text-gold-500 font-mono mt-4 flex items-center justify-between">
                      <span>Barmantra</span>
                      <span>Tap to flip back</span>
                    </div>

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
