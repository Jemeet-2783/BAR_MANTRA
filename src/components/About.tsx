/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Award, Compass, Heart, Users } from 'lucide-react';
import { useHashRoute } from '../useHashRoute';

export function About() {
  const { navigateTo } = useHashRoute();
  
  // Simple reactive counting states for stats
  const [stats, setStats] = useState({
    years: 0,
    events: 0,
    cities: 0,
    vendors: 0
  });

  useEffect(() => {
    const duration = 2000; // 2 seconds animation
    const steps = 50;
    const stepTime = duration / steps;
    let count = 0;

    const timer = setInterval(() => {
      count++;
      setStats({
        years: Math.min(Math.floor((12 / steps) * count), 12),
        events: Math.min(Math.floor((350 / steps) * count), 350),
        cities: Math.min(Math.floor((15 / steps) * count), 15),
        vendors: Math.min(Math.floor((120 / steps) * count), 120)
      });

      if (count >= steps) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <section id="about-section" className="relative py-24 bg-ivory-50 overflow-hidden">
      {/* Subtle background Jaali overlay */}
      <div className="absolute inset-0 bg-jaali-pattern pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Asymmetric Image Collage */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-start">
            <div className="relative w-full max-w-[400px] aspect-[4/5]">
              {/* Primary large image (Palace / Haveli detail) */}
              <div className="absolute top-0 left-0 w-[85%] h-[85%] rounded-lg overflow-hidden shadow-2xl border-4 border-white transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                <img
                  src="https://image.wedmegood.com/resized/1000X/uploads/member/1146941/1739044120_image3892.jpg"
                  alt="Bespoke Royal Bar Design"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.fallback) {
                      target.dataset.fallback = 'true';
                      target.src = 'https://image.wedmegood.com/resized/1000X/uploads/member/1146941/1738672358_image6125.jpg';
                    }
                  }}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Secondary overlapping image (Bridal styling / Marigold arrangement) */}
              <div className="absolute bottom-0 right-0 w-[60%] h-[60%] rounded-lg overflow-hidden shadow-2xl border-4 border-white transform rotate-6 hover:rotate-0 transition-transform duration-500">
                <img
                  src="https://image.wedmegood.com/resized/1000X/uploads/member/1146941/1741436277_image1090.jpg"
                  alt="Exquisite Artisanal Cocktails"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.fallback) {
                      target.dataset.fallback = 'true';
                      target.src = 'https://image.wedmegood.com/resized/1000X/uploads/member/1146941/1738672359_image3467.jpg';
                    }
                  }}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Decorative gold circular mark behind the collage */}
              <div className="absolute -z-10 -bottom-6 -left-6 w-32 h-32 rounded-full border border-gold-600/30 flex items-center justify-center animate-pulse">
                <div className="w-24 h-24 rounded-full border border-gold-600/10" />
              </div>
            </div>
          </div>

          {/* Right Column: Brand Story and Stats */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold-700 mb-2">
              Our Legacy & Heritage
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-maroon-950 font-medium tracking-tight mb-6">
              Blending <span className="text-maroon-700 italic">Royal Traditions</span> with Elite Mixology
            </h2>
            
            <p className="font-sans text-base text-gray-700 leading-relaxed mb-6 font-normal">
              In Sanskrit, <strong className="text-maroon-900">Mantra</strong> signifies a sacred formula, a sequence designed to manifest magical realities. At <strong>Barmantra</strong>, we operate as architects of that liquid magic, bringing luxury mobile bar setups to Jaipur, Rajasthan, and nationwide.
            </p>

            <p className="font-sans text-base text-gray-700 leading-relaxed mb-8">
              We merge the opulent aesthetics of Rajputana history—grand palaces, handcrafted jaalis, and vintage brass ornaments—with contemporary mixology, custom-carved ice, native botanicals, and professional bar showmanship. Whether planning a 3-day royal destination wedding or a high-profile corporate gala, we ensure every drink is poured with absolute, ritualistic perfection.
            </p>

            {/* Stats Counter Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 rounded-2xl bg-ivory-100 border border-gold-600/20 shadow-sm">
              <div className="text-center">
                <div className="flex items-center justify-center text-maroon-900 mb-1">
                  <Award className="w-5 h-5 text-gold-600 mr-1" />
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-maroon-950">{stats.years}+</span>
                </div>
                <div className="font-sans text-xs uppercase tracking-wider text-gray-500">Years of Craft</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center text-maroon-900 mb-1">
                  <Heart className="w-5 h-5 text-gold-600 mr-1" />
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-maroon-950">{stats.events}+</span>
                </div>
                <div className="font-sans text-xs uppercase tracking-wider text-gray-500">Bars Managed</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center text-maroon-900 mb-1">
                  <Compass className="w-5 h-5 text-gold-600 mr-1" />
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-maroon-950">{stats.cities}+</span>
                </div>
                <div className="font-sans text-xs uppercase tracking-wider text-gray-500">Cities Served</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center text-maroon-900 mb-1">
                  <Users className="w-5 h-5 text-gold-600 mr-1" />
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-maroon-950">{stats.vendors}+</span>
                </div>
                <div className="font-sans text-xs uppercase tracking-wider text-gray-500">Vendor Partners</div>
              </div>
            </div>

            {/* Read More button navigating to about */}
            <div className="mt-8 self-start">
              <button
                onClick={() => navigateTo('#/about')}
                className="inline-flex items-center justify-center text-maroon-800 font-sans font-bold hover:text-gold-700 transition-colors cursor-pointer group"
              >
                <span>Read More About Our Story</span>
                <span className="ml-2 group-hover:translate-x-1.5 transition-transform">→</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
