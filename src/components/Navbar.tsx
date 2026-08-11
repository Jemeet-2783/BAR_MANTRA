/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Menu, X, Heart } from 'lucide-react';
import { useHashRoute } from '../useHashRoute';
import { BarmantraLogo } from './BarmantraLogo';

export function Navbar() {
  const { currentRoute, navigateTo } = useHashRoute();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open to prevent page bleed-through
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { label: 'Home', path: '#/', type: 'route' },
    { label: 'About', path: '#/about', type: 'route' },
    { label: 'Services', path: '#/services', type: 'route' },
    { label: 'Portfolio', path: '#/gallery', type: 'route' },
    { label: 'Testimonials', path: '#/testimonials', targetId: 'testimonials-section', type: 'scroll' },
    { label: 'Our Process', path: '#/process', targetId: 'process-section', type: 'scroll' },
    { label: 'Contact', path: '#/contact', type: 'route' },
  ];

  const handleLinkClick = (link: typeof navLinks[0]) => {
    setIsMobileMenuOpen(false);
    if (link.type === 'scroll') {
      if (currentRoute === 'home') {
        const element = document.getElementById(link.targetId || '');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // Navigate home first, then scroll (using short timeout)
        navigateTo('#/');
        setTimeout(() => {
          const element = document.getElementById(link.targetId || '');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    } else {
      navigateTo(link.path);
    }
  };

  const isLinkActive = (link: typeof navLinks[0]) => {
    if (link.path === '#/') return currentRoute === 'home';
    if (link.path === '#/about') return currentRoute === 'about';
    if (link.path === '#/services') return currentRoute === 'services' || currentRoute === 'services/detail';
    if (link.path === '#/gallery') return currentRoute === 'gallery';
    if (link.path === '#/contact') return currentRoute === 'contact';
    return false;
  };

  const isSolid = isScrolled || currentRoute !== 'home';

  return (
    <>
      <nav
        id="navbar"
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isSolid
            ? 'bg-maroon-950/95 backdrop-blur-md border-b border-gold-600/20 py-3.5 shadow-lg'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo branding */}
            <div
              className="cursor-pointer group"
              onClick={() => navigateTo('#/')}
            >
              <BarmantraLogo iconSize={36} />
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleLinkClick(link)}
                  className={`relative font-sans text-sm font-medium tracking-wide transition-colors duration-200 cursor-pointer ${
                    isLinkActive(link)
                      ? 'text-gold-400'
                      : 'text-ivory-100 hover:text-gold-500'
                  }`}
                >
                  <span className="gold-draw-underline py-2">{link.label}</span>
                </button>
              ))}
            </div>

            {/* Plan My Event CTA Button */}
            <div className="hidden sm:block">
              <button
                onClick={() => navigateTo('#/contact')}
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-gradient-to-r from-gold-600 to-gold-500 text-maroon-950 font-sans font-semibold text-sm shadow-md hover:from-gold-500 hover:to-gold-400 transform hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              >
                Book Luxury Bar
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gold-500 hover:text-gold-400 p-2 focus:outline-none cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Fullscreen Overlay Navigation Drawer */}
      <div
        className={`fixed inset-0 w-screen h-screen bg-maroon-950/98 backdrop-blur-2xl z-[100] flex flex-col justify-between transition-all duration-300 ${
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto translate-y-0'
            : 'opacity-0 pointer-events-none -translate-y-4'
        }`}
      >
        {/* Drawer Top Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gold-600/20 bg-maroon-950">
          <div onClick={() => { setIsMobileMenuOpen(false); navigateTo('#/'); }} className="cursor-pointer">
            <BarmantraLogo iconSize={32} />
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2.5 rounded-full bg-gold-600/10 text-gold-400 hover:text-gold-300 hover:bg-gold-600/20 border border-gold-500/20 transition-all cursor-pointer"
            aria-label="Close navigation menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col justify-center space-y-2.5">
          {navLinks.map((link, idx) => {
            const active = isLinkActive(link);
            return (
              <button
                key={link.label}
                onClick={() => handleLinkClick(link)}
                style={{ transitionDelay: `${idx * 30}ms` }}
                className={`w-full text-left px-5 py-3.5 rounded-xl border transition-all duration-200 flex items-center justify-between cursor-pointer ${
                  active
                    ? 'bg-gradient-to-r from-gold-600/20 to-maroon-900/60 border-gold-500/50 text-gold-400 font-bold shadow-md'
                    : 'bg-maroon-900/20 border-gold-600/10 text-ivory-100 hover:bg-maroon-900/40 hover:border-gold-500/30'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={`text-xs ${active ? 'text-gold-400' : 'text-gold-600/60'}`}>✦</span>
                  <span className="font-serif text-lg tracking-wider uppercase">{link.label}</span>
                </div>
                {active && (
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-gold-400 bg-gold-500/20 px-2.5 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Drawer Bottom Footer CTA */}
        <div className="p-6 border-t border-gold-600/20 bg-maroon-950/90 flex flex-col space-y-4">
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              navigateTo('#/contact');
            }}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-gold-600 to-gold-500 text-maroon-950 font-sans font-bold text-base shadow-xl hover:from-gold-500 active:scale-98 transition-all cursor-pointer flex items-center justify-center space-x-2"
          >
            <span>Book Luxury Bar</span>
            <span className="font-serif text-lg">→</span>
          </button>

          <div className="text-center font-sans text-xs text-gold-400/80 tracking-wide font-light">
            📍 D-45, Raja Park, Jaipur · 📞 +91 73576 52737
          </div>
        </div>
      </div>
    </>
  );
}
