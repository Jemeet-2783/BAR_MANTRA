/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SEO } from '../SEO';
import { PortfolioItem } from '../../types';
import { MapPin, Calendar, X, Eye, ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';
import { getResponsiveImageUrl } from '../../utils/cloudinary';

const EXTENDED_PORTFOLIO: PortfolioItem[] = [
  {
    id: 'g-1',
    title: 'The Saffron Court Bar at City Palace',
    category: 'event-bars',
    image: 'https://images.unsplash.com/photo-1572116553112-75d7767d6c51?auto=format&fit=crop&w=800&q=80',
    location: 'City Palace, Jaipur',
    date: 'December 2025',
    description: 'A royal wedding mobile bar featuring deep crimson styling, saffron-infused gin cocktails, and bespoke hand-engraved clear ice blocks for 500 elite guests.'
  },
  {
    id: 'g-2',
    title: 'Modern Royal Lounge at Rambagh Palace',
    category: 'event-bars',
    image: 'https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?auto=format&fit=crop&w=800&q=80',
    location: 'Rambagh Palace, Jaipur',
    date: 'November 2025',
    description: 'An elite corporate banquet bar. Merged high-tech LED bar facades with custom whiskey infusions and premium crystal glassware.'
  },
  {
    id: 'g-3',
    title: 'The Marigold Canopy Beer & Cocktail Bar',
    category: 'event-bars',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    location: 'Samode Palace, Jaipur',
    date: 'January 2026',
    description: 'An outdoor garden wedding mehendi bar decorated with 10,000 meters of hand-strung marigolds, serving traditional cardamom-infused aperitifs in earthen kulhads.'
  },
  {
    id: 'g-4',
    title: 'High-Velocity Car Launch Cocktail Bar',
    category: 'event-bars',
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80',
    location: 'Jaipur Exhibition & Convention Centre',
    date: 'October 2025',
    description: 'A high-impact vehicle launch bar utilizing laser-lit backdrops, dry-ice smoked craft cocktails, and high-speed tandem flair bar shows.'
  },
  {
    id: 'g-5',
    title: 'A Golden Sitar Whiskey Tasting Lounge',
    category: 'cocktails',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    location: 'Private Heritage Haveli, Raja Park',
    date: 'February 2026',
    description: 'An intimate private haveli celebration featuring slow-aged single malt whiskey tastings paired with native Rajasthani spices and live classical sitar music.'
  },
  {
    id: 'g-6',
    title: 'Jaipur Literature Festival VIP Craft Bar',
    category: 'cocktails',
    image: 'https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&w=800&q=80',
    location: 'Diggi Palace, Jaipur',
    date: 'March 2026',
    description: 'A lively, premium VIP festival craft bar. Showcased local botanical distillates, organic marigold-honey syrups, and zero-waste edible flower garnishes.'
  },
  {
    id: 'g-7',
    title: 'Emerald Sufi Night Absinthe & Cocktail Bar',
    category: 'guest-experiences',
    image: 'https://images.unsplash.com/photo-1542849187-5ec6ea5e6a27?auto=format&fit=crop&w=800&q=80',
    location: 'Chomu Palace Resort, Jaipur',
    date: 'November 2025',
    description: 'A magical emerald-themed sangeet bar in a historic palace courtyard, filled with hundred brass lamps, serving premium signature rose-water cocktails.'
  },
  {
    id: 'g-8',
    title: 'Milestone Summit Golden Martini Bar',
    category: 'guest-experiences',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
    location: 'Marriott Hotel, Jaipur',
    date: 'September 2025',
    description: 'An elegant award ceremony martini bar for 300 international delegates, featuring custom-carved floating ice logos and choreographed cocktail showmanship.'
  },
  {
    id: 'g-9',
    title: 'Royal Mandap & Crystal Champagne Bar',
    category: 'event-bars',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    location: 'Samode Bagh, Jaipur',
    date: 'October 2025',
    description: 'A majestic champagne tower reception bar featuring custom laser-stamped clear ice shards and authentic saffron-scented French sparkling pours.'
  },
  {
    id: 'g-10',
    title: 'Molecular Mixology & Private Feast Bar',
    category: 'cocktails',
    image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=800&q=80',
    location: 'Taj Jai Mahal Palace, Jaipur',
    date: 'January 2026',
    description: 'A luxurious molecular gastronomy cocktail bar, featuring nitrogen-frozen fruit pearls, edible gold-leaf garnishes, and custom copper-mug punches.'
  },
  {
    id: 'g-11',
    title: 'The Marigold Folk Music Gin Counter',
    category: 'cocktails',
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80',
    location: 'Hawa Mahal Courtyard, Jaipur',
    date: 'February 2026',
    description: 'A colorful heritage gin bar featuring fresh local citrus, wild lavender infusions, and classical folk instrumental pairing sessions.'
  },
  {
    id: 'g-12',
    title: 'Neon Lights & Interactive Draft Bar',
    category: 'event-bars',
    image: 'https://images.unsplash.com/photo-1560512823-829485b8bf24?auto=format&fit=crop&w=800&q=80',
    location: 'Jaipur Convention Centre',
    date: 'August 2025',
    description: 'An ultra-modern, interactive corporate draft bar featuring custom IoT-enabled self-pour stations and fluorescent molecular shots.'
  },
  {
    id: 'g-13',
    title: 'Tandem Fire-Flair Festival Lounge',
    category: 'guest-experiences',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
    location: 'Chomu Palace, Jaipur',
    date: 'March 2026',
    description: 'An electric, high-energy festival bar show. Award-winning tandem flair bartenders performing fire-spin pouring sequences for 800 guests.'
  },
  {
    id: 'g-14',
    title: 'The Palace Jaali mobile Gin & Tonic Bar',
    category: 'event-bars',
    image: 'https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&w=800&q=80',
    location: 'Heritage Haveli, Jaipur',
    date: 'December 2025',
    description: 'Bespoke brass jaali mobile counter bar serving custom-infused Indian botanical tonic and local rose waters under floating oil lamps.'
  },
  {
    id: 'g-15',
    title: 'Royal Polo Club Single-Malt Lounge',
    category: 'guest-experiences',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    location: 'Jaipur Polo Grounds, Jaipur',
    date: 'October 2025',
    description: 'An executive single-malt whiskey and cigar bar catering to royal club members, with leather lounge seating and custom spices.'
  },
  {
    id: 'g-16',
    title: 'Sunset Rooftop Aperitivo Bar',
    category: 'guest-experiences',
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80',
    location: 'Historic Haveli Rooftop, Jaipur',
    date: 'November 2025',
    description: 'Rooftop craft spritz and botanical welcome bar for luxury celebrants, with sunset views and organic cardamom-grapefruit sodas.'
  }
];

export function GalleryView() {
  const [selectedCat, setSelectedCat] = useState<'all' | 'cocktails' | 'event-bars' | 'guest-experiences'>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filterItems = EXTENDED_PORTFOLIO.filter(
    (item) => selectedCat === 'all' || item.category === selectedCat
  );

  const openLightbox = (idx: number) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filterItems.length);
    }
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filterItems.length) % filterItems.length);
    }
  };

  return (
    <div className="pt-24 animate-fade-in">
      <SEO
        title="Portfolio Gallery & Case Studies | Barmantra Mobile Bar"
        description="Browse high-resolution photo archives of Barmantra's royal Jaipur wedding bars, brand launches, sufi nights, and cocktail flair shows."
        url="https://barmantra.com/#/gallery"
      />
      
      {/* Editorial Page Header */}
      <section className="relative py-28 bg-maroon-950 text-ivory-50 text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1572116553112-75d7767d6c51?auto=format&fit=crop&w=1920&q=80"
            alt="Luxury Bar Lounge"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-maroon-950 via-maroon-950/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <span className="text-xs font-mono uppercase tracking-widest text-gold-400 font-bold mb-3 block">
            The Portfolios
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-ivory-50 tracking-tight leading-tight">
            The Gallery of <span className="shimmer-gold font-semibold italic">Celebrated Legends</span>
          </h1>
          <p className="font-sans text-sm sm:text-base text-ivory-200 mt-4 max-w-2xl mx-auto leading-relaxed font-light">
            An extensive visual archive of our royal wedding bar curations, high-end corporate lounges, and intimate mixology soirées across India.
          </p>
        </div>
      </section>

      {/* Filterable Masonry Section */}
      <section className="py-20 bg-ivory-50 relative">
        <div className="absolute inset-0 bg-jaali-pattern opacity-5 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Filters pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
            {(['all', 'cocktails', 'event-bars', 'guest-experiences'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCat(cat);
                  setLightboxIndex(null);
                }}
                className={`px-6 py-2.5 rounded-full font-sans text-xs sm:text-sm font-bold tracking-wide uppercase transition-all duration-300 border cursor-pointer ${
                  selectedCat === cat
                    ? 'bg-maroon-900 border-maroon-900 text-gold-400 shadow-md'
                    : 'bg-white border-gold-600/15 text-maroon-950 hover:border-gold-600/50 hover:bg-ivory-100'
                }`}
              >
                {cat === 'all' ? 'All Masterpieces' : cat.replace('-', ' ')}
              </button>
            ))}
          </div>

          {/* Masonry-Style Grid of 16 Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filterItems.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => openLightbox(idx)}
                className="group relative rounded-2xl overflow-hidden border border-gold-600/10 shadow-sm cursor-pointer h-[320px] transition-all duration-300 hover:shadow-xl"
              >
                {/* Media Image */}
                <img
                  src={getResponsiveImageUrl(item.image, 600)}
                  alt={item.title}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.fallback) {
                      target.dataset.fallback = 'true';
                      target.src = 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80';
                    }
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Dark shading overlap */}
                <div className="absolute inset-0 bg-gradient-to-t from-maroon-950/95 via-maroon-950/40 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

                {/* Hover Eye indicator */}
                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-maroon-900/85 border border-gold-500/20 flex items-center justify-center text-gold-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye size={16} />
                </div>

                {/* Content details overlay */}
                <div className="absolute bottom-0 left-0 w-full p-5 z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                  <span className="text-[10px] font-mono tracking-widest text-gold-400 uppercase block mb-1">
                    {item.category.replace('-', ' ')} · {item.date}
                  </span>
                  <h3 className="font-serif text-lg text-ivory-50 leading-snug font-medium mb-2">
                    {item.title}
                  </h3>
                  <div className="flex items-center text-ivory-300 text-xs">
                    <MapPin size={11} className="text-gold-500 mr-1 flex-shrink-0" />
                    <span className="font-sans font-light truncate">{item.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* FULL-SCREEN SLIDESHOW LIGHTBOX */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-100 bg-maroon-950/98 backdrop-blur-md flex flex-col items-center justify-center p-4 md:p-8"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-gold-400 hover:text-gold-300 p-2 cursor-pointer z-101 bg-maroon-900/50 rounded-full"
            aria-label="Close Lightbox"
          >
            <X size={28} />
          </button>

          {/* Slider Container */}
          <div className="relative w-full max-w-4xl h-[70vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {/* Prev */}
            <button
              onClick={prevSlide}
              className="absolute left-2 md:-left-16 p-3 rounded-full bg-maroon-900/50 border border-gold-500/30 text-gold-400 hover:text-gold-300 hover:bg-maroon-900 transition-colors z-10 cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Slider image */}
            <img
              src={filterItems[lightboxIndex].image}
              alt={filterItems[lightboxIndex].title}
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.dataset.fallback) {
                  target.dataset.fallback = 'true';
                  target.src = 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80';
                }
              }}
              className="max-w-full max-h-full object-contain rounded-lg border-2 border-gold-500/30 shadow-2xl"
            />

            {/* Next */}
            <button
              onClick={nextSlide}
              className="absolute right-2 md:-right-16 p-3 rounded-full bg-maroon-900/50 border border-gold-500/30 text-gold-400 hover:text-gold-300 hover:bg-maroon-900 transition-colors z-10 cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Details below photo in Lightbox */}
          <div className="mt-6 text-center max-w-xl text-ivory-100 animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <span className="text-xs font-mono uppercase tracking-widest text-gold-400">
              {filterItems[lightboxIndex].category.replace('-', ' ')} · {filterItems[lightboxIndex].location} · {filterItems[lightboxIndex].date}
            </span>
            <h3 className="font-serif text-2xl font-semibold text-ivory-50 mt-1 mb-2">
              {filterItems[lightboxIndex].title}
            </h3>
            <p className="font-sans text-sm text-ivory-300 leading-relaxed font-light">
              {filterItems[lightboxIndex].description}
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
