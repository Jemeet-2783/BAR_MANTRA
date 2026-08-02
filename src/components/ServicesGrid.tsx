/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SERVICES } from '../data';
import { DynamicIcon } from './DynamicIcon';
import { useHashRoute } from '../useHashRoute';

export function ServicesGrid() {
  const { navigateTo } = useHashRoute();

  return (
    <section id="services-section" className="relative py-24 bg-ivory-100 border-y border-gold-600/10">
      {/* Decorative Jaali Lattice background inside Services section */}
      <div className="absolute inset-0 bg-jaali-pattern opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold-700 mb-2 block">
            Our Magic Formula
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-maroon-950 font-medium tracking-tight mb-4">
            Elite Mixology & Bar <span className="italic text-maroon-700">Curation</span>
          </h2>
          <div className="w-24 h-[1px] bg-gold-600 mx-auto my-4" />
          <p className="font-sans text-sm sm:text-base text-gray-600 leading-relaxed font-light">
            Barmantra designs and manages every aspect of your luxury beverage experience. Explore our specialized bar concepts, all custom-tailored to the theme of your celebration.
          </p>
        </div> 

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service) => (
            <div
              key={service.slug}
              onClick={() => navigateTo(`#/services/${service.slug}`)}
              className="group relative bg-ivory-50 rounded-2xl p-8 border border-gold-600/10 hover:border-gold-500 hover:shadow-xl transform hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              {/* Inner ambient glow on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gold-500/0 via-gold-500/0 to-gold-500/5 group-hover:to-gold-500/10 transition-colors duration-300 pointer-events-none" />

              <div>
                {/* Icon wrapper */}
                <div className="w-12 h-12 rounded-xl bg-maroon-900 flex items-center justify-center text-gold-400 mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  <DynamicIcon name={service.iconName} className="w-6 h-6" />
                </div>
        
                {/* Title */}
                <h3 className="font-serif text-xl sm:text-2xl text-maroon-950 font-medium group-hover:text-maroon-700 transition-colors mb-3">
                  {service.title}
                </h3>

                {/* Short description */}
                <p className="font-sans text-sm text-gray-600 leading-relaxed mb-6 font-normal">
                  {service.description}
                </p>
              </div>

              {/* Read More link */}
              <div className="flex items-center text-xs font-mono font-bold uppercase tracking-wider text-maroon-900 group-hover:text-gold-700 transition-colors">
                <span>Explore Details</span>
                <span className="ml-1.5 transform group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
