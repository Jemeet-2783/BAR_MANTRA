/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Map, DollarSign, Users, ShieldCheck, Palette, Star } from 'lucide-react';

interface Differentiator {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const DIFFERENTIATORS: Differentiator[] = [
  {
    title: 'Local Jaipur Expertise, Pan-India Execution',
    description: 'Deep ancestral roots in Rajasthan allow us to source native royal ingredients and premium mobile bar equipment, while our scalable network executes bar services seamlessly in Delhi, Udaipur, or Mumbai.',
    icon: Map
  },
  {
    title: 'Absolute Budget Transparency',
    description: 'We host our accounting on a fully auditable open ledger. Direct contracts are signed between you and vendors with zero hidden markups or supplier commission kickbacks.',
    icon: DollarSign
  },
  {
    title: 'End-to-End Certified Vendor Network',
    description: 'Gain instant access to India\'s most requested artisanal distilleries, organic syrup makers, custom glassware blowers, and ice-carvers vetted over 12+ years.',
    icon: Users
  },
  {
    title: 'Dedicated On-Ground Zone Managers',
    description: 'We deploy specialized managers to supervise individual bar zones (drink preparation, glass service, bar back replenishing) ensuring instant problem-solving during live days.',
    icon: ShieldCheck
  },
  {
    title: 'Authentic Heritage + Modern Fusion',
    description: 'We specialize in interpreting royal architectural shapes (jaali screens, royal domes) using lightweight modern materials, balancing cultural authenticity with safety and high design.',
    icon: Palette
  }
];

export function WhyBarmantra() {
  return (
    <section id="why-section" className="relative py-24 bg-ivory-100 border-y border-gold-600/10">
      <div className="absolute inset-0 bg-jaali-pattern opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Block: Image & Heading */}
          <div className="lg:col-span-5">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold-700 mb-2 block">
              The Barmantra Difference
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-maroon-950 font-medium tracking-tight mb-6">
              The Formula Behind <span className="italic text-maroon-700">Flawless Prestige</span>
            </h2>
            <p className="font-sans text-sm sm:text-base text-gray-600 leading-relaxed font-light mb-8">
              Executing luxury bar experiences requires more than just premium spirits—it requires highly calibrated operational workflows. We make the beverage service as magnificent as the celebration.
            </p>

            {/* Decorative Quote block with Unsplash visual */}
            <div className="relative rounded-2xl overflow-hidden aspect-video shadow-lg border border-gold-600/20">
              <img
                src="https://image.wedmegood.com/resized/1000X/uploads/member/1146941/1738672358_image6125.jpg"
                alt="Barmantra Elite Bar Setup"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.fallback) {
                    target.dataset.fallback = 'true';
                    target.src = 'https://image.wedmegood.com/resized/1000X/uploads/member/1146941/1739044120_image3892.jpg';
                  }
                }}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-maroon-950 via-maroon-950/40 to-transparent flex items-end p-5">
                <div className="flex items-center space-x-2 text-gold-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-serif text-sm tracking-wide text-ivory-100 font-medium italic">
                    "Luxury bar experiences since 2014."
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Block: Accordion / Cards List */}
          <div className="lg:col-span-7 space-y-6">
            {DIFFERENTIATORS.map((diff, index) => {
              const IconComp = diff.icon;
              return (
                <div
                  key={index}
                  className="bg-ivory-50 p-6 rounded-2xl border border-gold-600/10 hover:border-gold-500 hover:shadow-md transition-all duration-300 flex items-start space-x-5"
                >
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-maroon-900 flex items-center justify-center text-gold-400 shadow-sm">
                    <IconComp className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl font-medium text-maroon-950 mb-1.5">
                      {diff.title}
                    </h3>
                    <p className="font-sans text-xs sm:text-sm text-gray-600 leading-relaxed font-light">
                      {diff.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
