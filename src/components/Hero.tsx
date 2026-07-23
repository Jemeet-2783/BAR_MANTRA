/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Star, MapPin, Sparkles, ChevronRight } from 'lucide-react';
import { useHashRoute } from '../useHashRoute';
import { getResponsiveImageUrl } from '../utils/cloudinary';

const HERO_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1920&q=80',
    title: 'Royal Wedding Bar Curation',
  },
  {
    image: 'https://images.unsplash.com/photo-1575444758702-4a6b9222336e?auto=format&fit=crop&w=1920&q=80',
    title: 'Exquisite Mixology Showcase',
  },
  {
    image: 'https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&w=1920&q=80',
    title: 'Heritage Palace Lounge Bar',
  },
];

export function Hero() {
  const { navigateTo } = useHashRoute();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="hero-section"
      className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-maroon-950 bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(to top, rgba(61, 2, 18, 0.95), rgba(61, 2, 18, 0.6), rgba(61, 2, 18, 0.4)), url(${HERO_SLIDES[0].image})`,
      }}
    >
      {/* Background slideshow with absolute sizing and crossfade */}
      <div className="absolute inset-0 z-0">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.image}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ transitionProperty: 'opacity' }}
          >
            {/* Dark overlay to ensure text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-maroon-950 via-maroon-950/60 to-maroon-950/40 z-10" />
            <img
              src={getResponsiveImageUrl(slide.image, 1920)}
              alt={slide.title}
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover transition-transform duration-[6000ms] ease-out ${
                index === currentSlide ? 'animate-ken-burns' : 'scale-100'
              }`}
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
      </div>

      {/* Decorative Subtle Jaali Overlay on whole Hero */}
      <div className="absolute inset-0 bg-jaali-dark z-10 pointer-events-none" />

      {/* Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Small uppercase label */}
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gold-600/20 border border-gold-500/30 mb-6 animate-fade-in-down">
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          <span className="text-xs uppercase tracking-widest text-gold-400 font-mono font-semibold">
            The Premiere Luxury Bartending Service of Jaipur
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-ivory-50 tracking-tight leading-[1.1] mb-6 max-w-4xl font-medium">
          Luxury <span className="shimmer-gold font-semibold italic">Bar</span> Experiences
        </h1>

        {/* Subheadline */}
        <p className="font-sans text-base sm:text-lg md:text-xl text-ivory-200 max-w-2xl mb-10 leading-relaxed font-light">
          We weave royal Rajasthani heritage, modern artisanal mixology, and immaculate bar showmanship into high-end celebrations that linger in memories forever.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-16">
          <button
            onClick={() => navigateTo('#/contact')}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-gold-600 to-gold-500 text-maroon-950 font-sans font-bold text-base shadow-lg hover:from-gold-500 hover:to-gold-400 transform hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2 group"
          >
            Get a Free Consultation
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={() => navigateTo('#/gallery')}
            className="w-full sm:w-auto px-8 py-4 rounded-full border border-gold-500/50 bg-transparent text-gold-400 hover:text-maroon-950 hover:bg-gold-500/10 hover:border-gold-500 font-sans font-semibold text-base transition-all cursor-pointer"
          >
            View Our Work
          </button>
        </div>

        {/* Trust Badges */}
        <div className="w-full border-t border-gold-500/20 pt-8 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-ivory-300 text-sm font-medium">
            <div className="flex items-center justify-center space-x-2">
              <div className="flex text-gold-400">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={15} fill="currentColor" />
                ))}
              </div>
              <span className="font-sans">
                <strong>5.0 ★</strong> (25 Google Reviews)
              </span>
            </div>
            
            <div className="flex items-center justify-center space-x-2">
              <MapPin className="w-4 h-4 text-gold-400" />
              <span className="font-sans">Based in Raja Park, Jaipur</span>
            </div>
            
            <div className="flex items-center justify-center space-x-2">
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span className="font-sans">Weddings · Corporate · Soirées</span>
            </div>
          </div>
        </div>
      </div>

      {/* Elegant bottom section divider */}
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-ivory-50 to-transparent z-10" />
    </section>
  );
}
