/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PROCESS_STEPS } from '../data';
import { DynamicIcon } from './DynamicIcon';

export function Process() {
  return (
    <section id="process-section" className="relative py-24 bg-ivory-50 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-jaali-pattern opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold-700 mb-2 block">
            Our Execution Blueprint
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-maroon-950 font-medium tracking-tight mb-4">
            The Ritual Behind <span className="italic text-maroon-700">The Magic</span>
          </h2>
          <div className="w-24 h-[1px] bg-gold-600 mx-auto my-4" />
          <p className="font-sans text-sm sm:text-base text-gray-600 leading-relaxed font-light">
            We operate like a well-choreographed symphony. Every step of our workflow is mapped with structural precision, keeping your financial bookkeeping completely transparent.
          </p>
        </div>

        {/* Timeline container */}
        <div className="relative">
          {/* Horizontal Connecting line for Desktops */}
          <div className="hidden lg:block absolute top-[40px] left-[5%] right-[5%] h-[2px] bg-gradient-to-r from-gold-600/20 via-gold-500/80 to-gold-600/20 z-0" />

          {/* Vertical Connecting line for Mobile/Tablet */}
          <div className="lg:hidden absolute top-[40px] bottom-[40px] left-[28px] w-[2px] bg-gradient-to-b from-gold-600/20 via-gold-500/80 to-gold-600/20 z-0" />

          {/* Timeline Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8 relative z-10">
            {PROCESS_STEPS.map((step) => (
              <div key={step.number} className="flex flex-row lg:flex-col items-start lg:items-center text-left lg:text-center group">
                
                {/* Step Circle & Icon */}
                <div className="flex-shrink-0 relative">
                  <div className="w-14 h-14 rounded-full border-2 border-gold-500 bg-maroon-900 text-gold-400 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform z-10 relative">
                    <DynamicIcon name={step.iconName} className="w-6 h-6" />
                  </div>
                  {/* Step Number Badge */}
                  <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-gold-500 text-maroon-950 flex items-center justify-center font-mono text-xs font-bold shadow-md">
                    {step.number}
                  </div>
                </div>

                {/* Text Block */}
                <div className="ml-6 lg:ml-0 lg:mt-6">
                  <h3 className="font-serif text-lg sm:text-xl font-medium text-maroon-950 group-hover:text-maroon-700 transition-colors mb-2">
                    {step.title}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-gray-600 leading-relaxed font-light">
                    {step.description}
                  </p>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
