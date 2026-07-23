/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SERVICES } from '../../data';
import { useHashRoute } from '../../useHashRoute';
import { DynamicIcon } from '../DynamicIcon';
import { ArrowLeft, Star, Clock, Sparkles, CheckCircle, Eye, X } from 'lucide-react';

interface ServicesDetailViewProps {
  slug: string;
}

export function ServicesDetailView({ slug }: ServicesDetailViewProps) {
  const { navigateTo } = useHashRoute();
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  // Find the requested service matching the slug
  const service = SERVICES.find((s) => s.slug === slug);

  if (!service) {
    return (
      <div className="pt-32 pb-24 max-w-4xl mx-auto px-4 text-center">
        <div className="w-16 h-16 bg-maroon-900 rounded-full flex items-center justify-center text-gold-400 mx-auto mb-6 shadow-md">
          <Star size={30} />
        </div>
        <h2 className="font-serif text-3xl text-maroon-950 font-bold mb-3">
          Service Formula Not Found
        </h2>
        <p className="font-sans text-gray-600 max-w-md mx-auto mb-8 font-light">
          The requested service theme matches a custom formula. Please connect with our concierge team directly to compile a custom design schedule.
        </p>
        <button
          onClick={() => navigateTo('#/')}
          className="px-6 py-2.5 rounded-full bg-maroon-900 text-gold-400 font-sans font-bold text-sm shadow-md hover:bg-maroon-800 transition-colors cursor-pointer"
        >
          Return to Home Showcase
        </button>
      </div>
    );
  }

  return (
    <div className="pt-24 animate-fade-in">
      
      {/* Dynamic Service Hero Banner */}
      <section className="relative py-28 bg-maroon-950 text-ivory-50 overflow-hidden">
        {/* Dynamic cover photo background */}
        <div className="absolute inset-0 z-0">
          <img
            src={service.images[0]}
            alt={service.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-maroon-950 via-maroon-950/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4">
          <button
            onClick={() => navigateTo('#/')}
            className="inline-flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-widest text-gold-400 hover:text-gold-300 transition-colors mb-6 cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Back to All Services</span>
          </button>
          
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gold-600/20 border border-gold-500/30 flex items-center justify-center text-gold-400">
              <DynamicIcon name={service.iconName} className="w-5.5 h-5.5" />
            </div>
            <span className="text-xs font-mono uppercase tracking-widest text-gold-400 font-bold">
              Premium Event Formats
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-ivory-50 tracking-tight leading-tight max-w-4xl font-medium">
            {service.title}
          </h1>
        </div>
      </section>

      {/* Narrative & Core Features Block */}
      <section className="py-20 bg-ivory-50 relative">
        <div className="absolute inset-0 bg-jaali-pattern opacity-5 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Narrative Description */}
            <div className="lg:col-span-7">
              <h2 className="font-serif text-2xl sm:text-3xl text-maroon-950 font-medium mb-6 pb-3 border-b border-gold-600/15">
                The Philosophy
              </h2>
              <p className="font-sans text-base text-gray-700 leading-relaxed font-light mb-8">
                {service.longDescription}
              </p>

              {/* Service Features checklist */}
              <h3 className="font-serif text-xl text-maroon-950 font-semibold mb-4">
                What We Deliver
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start space-x-3 text-sm text-gray-700">
                    <CheckCircle className="w-4.5 h-4.5 text-gold-600 flex-shrink-0 mt-0.5" />
                    <span className="font-sans font-light">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Mini Photo Gallery */}
            <div className="lg:col-span-5 space-y-6">
              <h2 className="font-serif text-2xl sm:text-3xl text-maroon-950 font-medium mb-6">
                Service Gallery
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.images.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActivePhoto(img)}
                    className="group relative rounded-2xl overflow-hidden aspect-[4/3] border border-gold-600/10 shadow-md cursor-pointer"
                  >
                    <img
                      src={img}
                      alt={`${service.title} view ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-maroon-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-85 transition-opacity" />
                    <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-maroon-900/80 border border-gold-500/20 flex items-center justify-center text-gold-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Eye size={13} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Call to bind them to contact page */}
              <div className="bg-maroon-900/5 p-6 rounded-2xl border border-gold-600/15 text-center">
                <span className="font-mono text-[10px] uppercase tracking-widest text-maroon-950 block mb-1">
                  Secure Your Booking
                </span>
                <p className="font-sans text-xs text-gray-600 mb-4 font-light">
                  Our custom props are handcrafted. We only accept <strong>2 major weddings</strong> per calendar week to maintain absolute execution standards.
                </p>
                <button
                  onClick={() => navigateTo('#/contact')}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-600 to-gold-500 text-maroon-950 font-sans font-bold text-xs shadow-md hover:from-gold-500 transition-all cursor-pointer uppercase tracking-wider"
                >
                  Consult Our Producer
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Specific Service Chronological Timeline */}
      <section className="py-20 bg-ivory-100 border-t border-gold-600/10 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-gold-700 font-bold block mb-1">
              Operational Flow
            </span>
            <h2 className="font-serif text-3xl text-maroon-950 font-medium">
              Bespoke Execution Schedule
            </h2>
            <div className="w-16 h-[1px] bg-gold-600 mx-auto mt-4" />
          </div>

          <div className="space-y-8 relative">
            {/* Connecting line */}
            <div className="absolute top-[20px] bottom-[20px] left-[15px] sm:left-[24px] w-[1.5px] bg-gold-600/30 z-0" />

            {service.timeline.map((step, idx) => (
              <div key={idx} className="flex items-start space-x-4 sm:space-x-6 relative z-10">
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full border border-gold-500 bg-maroon-900 text-gold-400 flex items-center justify-center text-xs sm:text-sm font-mono font-bold flex-shrink-0 shadow-md">
                  {idx + 1}
                </div>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-semibold text-maroon-950 mb-1">
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
      </section>

      {/* MINI GALLERY EXPANDED PHOTO LIGHTBOX */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-100 bg-maroon-950/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActivePhoto(null)}
        >
          <button
            onClick={() => setActivePhoto(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-maroon-900 border border-gold-500/20 text-gold-400 hover:text-gold-300 transition-colors cursor-pointer z-101"
            aria-label="Close photo"
          >
            <X size={24} />
          </button>
          
          <img
            src={activePhoto}
            alt="Service Expanded View"
            referrerPolicy="no-referrer"
            className="max-w-full max-h-[85vh] object-contain rounded-lg border-2 border-gold-500/30 shadow-2xl"
          />
        </div>
      )}

    </div>
  );
}
