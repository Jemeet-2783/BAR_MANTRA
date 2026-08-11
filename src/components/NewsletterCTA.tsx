/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Phone, Sparkles } from 'lucide-react';

export function NewsletterCTA() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section id="newsletter-section" className="relative py-20 bg-gradient-to-r from-maroon-950 via-maroon-900 to-maroon-950 border-t border-gold-600/30 overflow-hidden text-ivory-100">
      {/* Subtle background Jaali overlay */}
      <div className="absolute inset-0 bg-jaali-dark opacity-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Sparkles top badge */}
        <div className="inline-flex items-center justify-center space-x-1.5 text-gold-400 mb-6">
          <Sparkles className="w-4 h-4 fill-current animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-widest font-bold">Secure Your Date Range</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ivory-50 tracking-tight leading-tight mb-4 max-w-3xl mx-auto font-medium">
          Ready to Secure Your Next <span className="shimmer-gold italic font-semibold">Luxury Bar</span> Experience?
        </h2>
        
        <p className="font-sans text-sm sm:text-base text-ivory-300 max-w-xl mx-auto mb-10 font-light">
          Join our exclusive guest list to receive bespoke cocktail menu suggestions, seasonal mixology concepts, and luxury mobile bar styling previews.
        </p>

        {isSubscribed ? (
          <div className="max-w-md mx-auto p-6 rounded-2xl bg-maroon-900/60 border border-gold-500/30 animate-scale-in">
            <span className="text-gold-400 font-serif text-xl font-bold block mb-1">✓ You are on the Guest List</span>
            <p className="font-sans text-xs sm:text-sm text-ivory-200 font-light">
              We have dispatched our curated Jaipur Heritage Bar Catalog directly to your inbox.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="max-w-lg mx-auto flex flex-col sm:flex-row items-center gap-3 mb-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gold-500/60">
                <Mail size={16} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                required
                className="w-full pl-11 pr-4 py-3.5 rounded-full bg-maroon-900/40 border border-gold-500/20 text-ivory-100 placeholder-ivory-400 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto flex-shrink-0 px-8 py-3.5 rounded-full bg-gradient-to-r from-gold-600 to-gold-500 text-maroon-950 font-sans font-bold text-sm shadow-md hover:from-gold-500 hover:to-gold-400 transition-all cursor-pointer"
            >
              Subscribe
            </button>
          </form>
        )}

        {/* Instant callback citation */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-4 text-xs font-mono tracking-wider text-ivory-300">
          <span className="uppercase">Or jump on an instant call:</span>
          <a
            href="tel:+917357652737"
            className="inline-flex items-center space-x-2 text-gold-400 hover:text-gold-300 transition-colors font-bold"
          >
            <Phone size={13} />
            <span>+91 73576 52737</span>
          </a>
        </div>

      </div>
    </section>
  );
}
