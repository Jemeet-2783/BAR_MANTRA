/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useHashRoute } from '../useHashRoute';
import { Instagram, Facebook, Phone, MessageSquare, MapPin, Mail, Sparkles } from 'lucide-react';
import { BarmantraLogo } from './BarmantraLogo';
import { useSiteContent } from '../useSiteContent';

export function Footer() {
  const { currentRoute, navigateTo } = useHashRoute();
  const { siteSettings } = useSiteContent();

  const handleLinkClick = (hashPath: string, targetId?: string) => {
    navigateTo(hashPath);
    if (targetId) {
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <>
      <footer className="relative bg-maroon-950 border-t border-gold-600/30 text-ivory-100 pt-20 pb-10 overflow-hidden">
        {/* Background Jaali Grid */}
        <div className="absolute inset-0 bg-jaali-dark opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-gold-500/10">
            
            {/* Logo and Tagline Column */}
            <div className="lg:col-span-4 space-y-6">
              <div
                className="cursor-pointer group"
                onClick={() => navigateTo('#/')}
              >
                <BarmantraLogo iconSize={40} />
              </div>
              <p className="font-sans text-sm text-ivory-300 leading-relaxed font-light">
                A high-end, boutique luxury bartending service blending the luxurious royal legacy of Jaipur with modern mixology, creating spectacular bar experiences across India.
              </p>
              <div className="flex items-center space-x-1.5 text-xs text-gold-400 font-mono">
                <Sparkles className="w-3.5 h-3.5 fill-current animate-pulse" />
                <span>Luxury Bar Experiences</span>
              </div>
            </div>

            {/* Company Directory links Column */}
            <div className="lg:col-span-2.5 space-y-5">
              <h4 className="font-serif text-lg text-gold-400 font-semibold uppercase tracking-wider">
                Our Showcase
              </h4>
              <ul className="space-y-3 font-sans text-sm text-ivory-300">
                <li>
                  <button
                    onClick={() => handleLinkClick('#/')}
                    className="hover:text-gold-500 transition-colors text-left cursor-pointer"
                  >
                    Home Overview
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLinkClick('#/about')}
                    className="hover:text-gold-500 transition-colors text-left cursor-pointer"
                  >
                    Our Founders & Bio
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLinkClick('#/', 'services-section')}
                    className="hover:text-gold-500 transition-colors text-left cursor-pointer"
                  >
                    Bar Services
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLinkClick('#/gallery')}
                    className="hover:text-gold-500 transition-colors text-left cursor-pointer"
                  >
                    Full Gallery Portfolio
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLinkClick('#/contact')}
                    className="hover:text-gold-500 transition-colors text-left cursor-pointer"
                  >
                    Enquire Consultation
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLinkClick('#/lookup')}
                    className="hover:text-gold-500 transition-colors text-left cursor-pointer text-gold-400 font-medium flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-gold-400" /> Track Proposal Status
                  </button>
                </li>
              </ul>
            </div>

            {/* Direct Contact coordinates Column */}
            <div className="lg:col-span-3 space-y-5">
              <h4 className="font-serif text-lg text-gold-400 font-semibold uppercase tracking-wider">
                Jaipur Concierge
              </h4>
              <ul className="space-y-3.5 font-sans text-sm text-ivory-300">
                <li className="flex items-start space-x-3">
                  <MapPin className="w-4.5 h-4.5 text-gold-500 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-light">
                    {siteSettings.address || 'D-45, Raja Park, Jaipur, Rajasthan 302020'}
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <Phone className="w-4.5 h-4.5 text-gold-500 flex-shrink-0" />
                  <a href={`tel:${(siteSettings.phone || '+91 73576 52737').replace(/\s+/g, '')}`} className="hover:text-gold-500 transition-colors font-mono">
                    {siteSettings.phone || '+91 73576 52737'}
                  </a>
                </li>
                <li className="flex items-center space-x-3">
                  <Mail className="w-4.5 h-4.5 text-gold-500 flex-shrink-0" />
                  <a href={`mailto:${siteSettings.email}`} className="hover:text-gold-500 transition-colors font-mono">
                    {siteSettings.email || 'concierge@barmantra.com'}
                  </a>
                </li>
              </ul>

              {/* Operating Hours Summary */}
              <div className="pt-2 border-t border-gold-600/15">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-gold-400 block mb-1.5">
                  Studio Operating Hours
                </span>
                <div className="text-xs text-ivory-300 space-y-0.5 font-mono font-light">
                  <p><span className="text-gold-500 font-semibold">Mon:</span> Open 24 Hours</p>
                  <p><span className="text-gold-500 font-semibold">Tue:</span> 8:00 PM – 12:00 AM</p>
                  <p><span className="text-gold-500 font-semibold">Wed:</span> 12:00 AM – 8:00 PM</p>
                  <p><span className="text-gold-500 font-semibold">Thu:</span> 9:00 AM – 8:00 PM</p>
                  <p><span className="text-gold-500 font-semibold">Fri:</span> 9:00 AM – 5:00 PM</p>
                  <p><span className="text-gold-500 font-semibold">Sat:</span> 9:00 AM – 9:00 PM</p>
                  <p><span className="text-gold-500 font-semibold">Sun:</span> 8:00 AM – 8:30 PM</p>
                </div>
              </div>
            </div>

            {/* Social Channels Column */}
            <div className="lg:col-span-2.5 space-y-5">
              <h4 className="font-serif text-lg text-gold-400 font-semibold uppercase tracking-wider">
                Follow the Magic
              </h4>
              <p className="font-sans text-xs text-ivory-300 leading-relaxed font-light">
                Follow our channels for actual daily production diaries, behind-the-scenes set fabrications, and wedding reels.
              </p>
              <div className="flex items-center space-x-4">
                {/* Instagram */}
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-maroon-900 border border-gold-500/20 flex items-center justify-center text-gold-400 hover:text-gold-300 hover:border-gold-500 transition-all shadow-md cursor-pointer"
                  aria-label="Follow Barmantra on Instagram"
                >
                  <Instagram size={18} />
                </a>

                {/* Facebook */}
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-maroon-900 border border-gold-500/20 flex items-center justify-center text-gold-400 hover:text-gold-300 hover:border-gold-500 transition-all shadow-md cursor-pointer"
                  aria-label="Follow Barmantra on Facebook"
                >
                  <Facebook size={18} />
                </a>

                {/* Google reviews */}
                <a
                  href="https://google.com/search?q=Barmantra+Jaipur"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-maroon-900 border border-gold-500/20 flex items-center justify-center text-gold-400 hover:text-gold-300 hover:border-gold-500 transition-all shadow-md cursor-pointer font-serif font-bold text-xs"
                  aria-label="Review Barmantra on Google Search"
                >
                  G
                </a>
              </div>
            </div>

          </div>

          {/* Bottom Copyright bar */}
          <div className="mt-10 flex flex-col md:flex-row items-center justify-between text-xs text-ivory-400 gap-4">
            <p className="font-sans font-light">
              © {new Date().getFullYear()} Barmantra. All rights reserved.
            </p>
            <div className="flex space-x-6 font-sans font-light">
              <a href="#/privacy" className="hover:text-gold-500 transition-colors">Privacy Policy</a>
              <a href="#/terms" className="hover:text-gold-500 transition-colors">Terms of Service</a>
              <span className="text-gold-600/50">|</span>
              <span className="font-mono text-[10px]">Based in Jaipur, India</span>
            </div>
          </div>
        </div>
      </footer>

      {/* FLOATING PERSISTENT WHATSAPP BUBBLE */}
      <a
        href="https://wa.me/917357652737?text=Hello%20Barmantra,%20I%20would%20like%20to%20enquire%20about%20booking%20a%20luxury%20bar%20experience."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-45 bg-emerald-600 hover:bg-emerald-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl border border-white/20 transform hover:-translate-y-1 hover:scale-105 active:translate-y-0 transition-all group cursor-pointer"
        aria-label="Chat with Barmantra on WhatsApp"
      >
        <MessageSquare size={26} className="group-hover:rotate-6 transition-transform" />
        {/* Pulsing notification dot */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full animate-ping" />
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full" />
      </a>
    </>
  );
}
