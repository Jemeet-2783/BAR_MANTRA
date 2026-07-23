/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PORTFOLIO_ITEMS } from '../data';
import { Search, X, MapPin, Calendar, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useHashRoute } from '../useHashRoute';
import { getResponsiveImageUrl } from '../utils/cloudinary';

export function PortfolioGallery() {
  const { navigateTo } = useHashRoute();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'cocktails' | 'event-bars' | 'guest-experiences'>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories: { label: string; value: typeof selectedCategory }[] = [
    { label: 'All Work', value: 'all' },
    { label: 'Cocktails', value: 'cocktails' },
    { label: 'Event Bars', value: 'event-bars' },
    { label: 'Guest Experiences', value: 'guest-experiences' }
  ];

  // Filtering the portfolio items based on selection
  const filteredItems = PORTFOLIO_ITEMS.filter(
    (item) => selectedCategory === 'all' || item.category === selectedCategory
  );

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
    }
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  return (
    <section id="portfolio-section" className="relative py-24 bg-ivory-50 overflow-hidden">
      {/* Background jaali ornament */}
      <div className="absolute inset-0 bg-jaali-pattern opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold-700 mb-2 block">
              Visual Chronicles
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-maroon-950 font-medium tracking-tight">
              Galas of <span className="italic text-maroon-700">Flawless Harmony</span>
            </h2>
            <div className="w-16 h-[2px] bg-gold-600 my-4" />
            <p className="font-sans text-sm sm:text-base text-gray-600 leading-relaxed font-light">
              Explore actual high-contrast layouts of our signature weddings, brand launch nights, and intimate high-end banquets set across Rajasthan.
            </p>
          </div>

          {/* Categories Filter Menu */}
          <div className="flex flex-wrap gap-2.5">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => {
                  setSelectedCategory(cat.value);
                  setLightboxIndex(null);
                }}
                className={`px-4 sm:px-5 py-2.5 rounded-full font-sans text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 cursor-pointer border ${
                  selectedCategory === cat.value
                    ? 'bg-maroon-900 border-maroon-900 text-gold-400 shadow-md'
                    : 'bg-ivory-100 border-gold-600/15 text-maroon-950 hover:border-gold-600/50 hover:bg-ivory-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid (Teaser of 8 items) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => openLightbox(index)}
              className="group relative h-[300px] rounded-2xl overflow-hidden border border-gold-600/10 shadow-sm cursor-pointer"
            >
              {/* Image */}
              <img
                src={getResponsiveImageUrl(item.image, 600)}
                alt={item.title}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Hover Dark Shading overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-maroon-950/90 via-maroon-950/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300" />

              {/* Eye zoom indicator icon */}
              <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-maroon-900/80 border border-gold-500/20 flex items-center justify-center text-gold-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Eye size={16} />
              </div>

              {/* Hover Content Details */}
              <div className="absolute bottom-0 left-0 w-full p-5 z-20 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-[10px] font-mono tracking-widest text-gold-400 uppercase block mb-1">
                  {item.category.replace('-', ' ')}
                </span>
                <h3 className="font-serif text-lg text-ivory-50 leading-tight font-medium mb-2.5">
                  {item.title}
                </h3>
                <div className="flex items-center space-x-3 text-ivory-300 text-xs">
                  <div className="flex items-center space-x-1">
                    <MapPin size={12} className="text-gold-500" />
                    <span className="font-sans font-light">{item.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Link to Dedicated Full Gallery Page */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigateTo('#/gallery')}
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full border border-maroon-900 text-maroon-900 hover:bg-maroon-900 hover:text-gold-400 font-sans font-bold text-sm transition-all duration-300 shadow-sm cursor-pointer"
          >
            <span>View All 16+ Gallery Masterpieces</span>
            <span className="ml-2 font-serif">→</span>
          </button>
        </div>

      </div>

      {/* FULL-SCREEN LIGHTBOX */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-100 bg-maroon-950/98 backdrop-blur-md flex flex-col items-center justify-center p-4 md:p-8"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-gold-400 hover:text-gold-300 p-2 cursor-pointer z-101 bg-maroon-900/50 rounded-full"
            aria-label="Close Lightbox"
          >
            <X size={28} />
          </button>

          {/* Lightbox Slider container */}
          <div className="relative w-full max-w-4xl h-[70vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {/* Prev arrow */}
            <button
              onClick={prevSlide}
              className="absolute left-2 md:-left-16 p-3 rounded-full bg-maroon-900/50 border border-gold-500/30 text-gold-400 hover:text-gold-300 hover:bg-maroon-900 transition-colors z-10 cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Slider image */}
            <img
              src={filteredItems[lightboxIndex].image}
              alt={filteredItems[lightboxIndex].title}
              referrerPolicy="no-referrer"
              className="max-w-full max-h-full object-contain rounded-lg border-2 border-gold-500/30 shadow-2xl"
            />

            {/* Next arrow */}
            <button
              onClick={nextSlide}
              className="absolute right-2 md:-right-16 p-3 rounded-full bg-maroon-900/50 border border-gold-500/30 text-gold-400 hover:text-gold-300 hover:bg-maroon-900 transition-colors z-10 cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Image description block in Lightbox */}
          <div className="mt-6 text-center max-w-xl text-ivory-100" onClick={(e) => e.stopPropagation()}>
            <span className="text-xs font-mono uppercase tracking-widest text-gold-400">
              {filteredItems[lightboxIndex].category} · {filteredItems[lightboxIndex].location}
            </span>
            <h3 className="font-serif text-2xl font-semibold text-ivory-50 mt-1 mb-2">
              {filteredItems[lightboxIndex].title}
            </h3>
            <p className="font-sans text-sm text-ivory-300 leading-relaxed font-light">
              {filteredItems[lightboxIndex].description}
            </p>
          </div>
        </div>
      )}

    </section>
  );
}
