/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TESTIMONIALS } from '../data';
import { Star, ChevronLeft, ChevronRight, MessageSquare, Pause, Play } from 'lucide-react';
import { useSiteContent } from '../useSiteContent';

export function TestimonialsCarousel() {
  const { testimonials } = useSiteContent();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const reviewsList = testimonials && testimonials.length > 0 ? testimonials : TESTIMONIALS;

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviewsList.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [isPaused, reviewsList.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + reviewsList.length) % reviewsList.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reviewsList.length);
  };

  return (
    <section id="testimonials-section" className="relative py-24 bg-maroon-950 border-y border-gold-600/20 text-ivory-100 overflow-hidden">
      {/* Background Jaali ornament */}
      <div className="absolute inset-0 bg-jaali-dark opacity-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-1.5 text-gold-400 font-mono text-xs uppercase tracking-widest bg-maroon-900 border border-gold-500/20 px-3 py-1.5 rounded-full mb-3">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>5.0 ★ Google Rating (25 reviews)</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ivory-50 font-medium tracking-tight mb-4">
            Feathered in <span className="shimmer-gold italic font-semibold">Gratitude</span>
          </h2>
          <p className="font-sans text-sm sm:text-base text-ivory-300 leading-relaxed font-light">
            Read first-hand accounts from our couples and corporate brand managers who have experienced Barmantra\'s ritual planning magic.
          </p>
        </div>

        {/* Carousel Slider Panel */}
        <div
          className="relative max-w-4xl mx-auto min-h-[280px] flex items-center group focus-within:outline-none"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              setIsPaused(false);
            }
          }}
        >
          
          {/* Navigation Controls */}
          <div className="absolute -left-4 md:-left-12 z-20">
            <button
              onClick={handlePrev}
              className="p-3 rounded-full bg-maroon-900/80 hover:bg-maroon-900 border border-gold-500/30 text-gold-400 hover:text-gold-300 transition-colors cursor-pointer shadow-md focus:ring-2 focus:ring-gold-400"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} />
            </button>
          </div>

          <div className="absolute -right-4 md:-right-12 z-20">
            <button
              onClick={handleNext}
              className="p-3 rounded-full bg-maroon-900/80 hover:bg-maroon-900 border border-gold-500/30 text-gold-400 hover:text-gold-300 transition-colors cursor-pointer shadow-md focus:ring-2 focus:ring-gold-400"
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Testimonial card container with transition */}
          <div className="w-full">
            {reviewsList.map((t, idx) => (
              <div
                key={t.id}
                tabIndex={0}
                aria-label={`Testimonial ${idx + 1} of ${TESTIMONIALS.length}: ${t.name}`}
                className={`transition-all duration-700 ease-in-out focus:outline-none focus:ring-2 focus:ring-gold-400/50 rounded-3xl ${
                  idx === currentIndex
                    ? 'opacity-100 translate-x-0 scale-100 relative block'
                    : 'opacity-0 translate-x-8 scale-95 absolute inset-0 pointer-events-none hidden'
                }`}
              >
                <div className="bg-maroon-900/50 rounded-3xl p-8 md:p-12 border border-gold-500/20 shadow-xl flex flex-col justify-between items-center text-center relative">
                  
                  {/* Backdrop Quote Icon */}
                  <MessageSquare className="absolute -top-6 -left-6 w-16 h-16 text-gold-600/10 rotate-12" />

                  {/* Rating Stars */}
                  <div className="flex text-gold-400 mb-6 space-x-1 justify-center">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={18} className="fill-current" />
                    ))}
                  </div>

                  {/* Testimonial Quote */}
                  <blockquote className="font-serif text-lg sm:text-xl md:text-2xl italic text-ivory-100 leading-relaxed font-light mb-8 max-w-2xl">
                    "{t.quote}"
                  </blockquote>

                  {/* Author profile & meta */}
                  <div className="border-t border-gold-500/10 pt-6 w-full max-w-sm">
                    <cite className="not-italic block font-serif text-base sm:text-lg text-gold-400 font-medium">
                      {t.name}
                    </cite>
                    <span className="font-sans text-xs uppercase tracking-wider text-ivory-300/80 block mt-1 font-mono">
                      {t.eventType} · {t.date}
                    </span>
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Controls: Dots & Play/Pause Button */}
        <div className="flex items-center justify-center space-x-4 mt-8">
          <div className="flex items-center space-x-2">
            {reviewsList.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold-400 ${
                  idx === currentIndex ? 'bg-gold-500 w-6' : 'bg-gold-500/30 w-2.5'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-maroon-900 border border-gold-500/30 text-gold-400 hover:text-gold-300 text-xs font-mono font-semibold transition-colors cursor-pointer focus:ring-2 focus:ring-gold-400"
            aria-label={isPaused ? 'Resume testimonial slideshow' : 'Pause testimonial slideshow'}
            aria-live="polite"
          >
            {isPaused ? <Play size={12} className="fill-current" /> : <Pause size={12} className="fill-current" />}
            <span>{isPaused ? 'Play' : 'Pause'}</span>
          </button>
        </div>

        {/* CTA out to Google profile */}
        <div className="mt-12 text-center">
          <a
            href="https://google.com/search?q=Barmantra+Jaipur"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-gold-400 hover:text-gold-300 transition-colors"
          >
            <span>Verify on Google Business Reviews</span>
            <span className="text-xs">↗</span>
          </a>
        </div>

      </div>
    </section>
  );
}
