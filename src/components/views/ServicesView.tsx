/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SEO } from '../SEO';
import { useHashRoute } from '../../useHashRoute';
import { 
  Sparkles, 
  BookOpen, 
  Calculator, 
  HelpCircle, 
  Sliders, 
  ArrowRight, 
  Download, 
  Check, 
  Crown, 
  Wine, 
  ShieldCheck, 
  MessageSquare,
  Flame,
  ArrowLeft
} from 'lucide-react';

interface CustomDrink {
  name: string;
  history: string;
  ingredients: string[];
  instructions: string[];
  glassware: string;
  garnish: string;
}

export function ServicesView() {
  const { navigateTo } = useHashRoute();

  // Tier Packages
  const packages = [
    {
      id: 'heritage',
      name: 'Heritage Classic Curation',
      tagline: 'Ideal for upscale private soirées & intimate milestones',
      priceRange: '₹1,50,000 - ₹2,50,000',
      basePrice: 150000,
      perGuestRate: 1200,
      accent: 'border-gold-600/30',
      features: [
        'Premium hand-curated craft cocktail menu (4 signature drinks)',
        'Standard mobile bar counter with luxury jaali screen styling',
        '2 Certified Master Mixologists & 2 barbacks',
        'Fine crystal glassware pairing',
        'Traditional Rajasthani welcome aperitifs served in earthen kulhads',
        'All fresh native purees, local citrus, and custom spice syrups'
      ]
    },
    {
      id: 'imperial',
      name: 'Imperial Liquid Artistry',
      tagline: 'Our signature destination wedding & gala package',
      priceRange: '₹3,00,000 - ₹5,50,000',
      basePrice: 300000,
      perGuestRate: 1800,
      featured: true,
      accent: 'border-gold-500 shadow-[0_0_25px_rgba(212,175,55,0.15)] bg-maroon-950 text-white',
      features: [
        'Bespoke culinary beverage menu (6 signature & molecular cocktails)',
        'Premium custom-fabricated double-lane brass and marble bar counter',
        'Laser-etched personalized clear ice blocks with your initials/logo',
        'Award-winning Tandem Flair show (15-minute high-energy performance)',
        '4 certified elite mixologists, 4 bar backs, and 1 Bar Producer',
        'Exclusive vintage glassware, copper vessels, and custom linen mats'
      ]
    },
    {
      id: 'maharaja',
      name: 'Royal Maharaja Ultimate',
      tagline: 'An uncompromising pinnacle of palace luxury execution',
      priceRange: '₹7,00,000 - ₹12,00,000',
      basePrice: 700000,
      perGuestRate: 2500,
      accent: 'border-gold-400 bg-gradient-to-b from-maroon-950 to-black text-ivory-50',
      features: [
        'Unlimited custom themed cocktail formulas with edible gold leaf',
        'Bespoke palace floral sculptures & custom theme bar architecture',
        '3D bar renders & physical construction at our Jaipur workshop',
        'Interactive Nitrogen & Fire-Flair performances throughout the night',
        'Full premium single-malt tasting bar & vintage cigar lounge pairing',
        'Dedicated Royal Butler-style cocktail delivery for VIP tables'
      ]
    }
  ];

  // Lookbook Gated download state
  const [downloadEmail, setDownloadEmail] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const handleLookbookDownload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!downloadEmail) return;
    setDownloadLoading(true);
    setTimeout(() => {
      setDownloadLoading(false);
      setDownloadSuccess(true);
      // Trigger a simulated PDF download
      const link = document.createElement('a');
      link.href = 'https://images.unsplash.com/photo-1572116553112-75d7767d6c51?auto=format&fit=crop&w=1200&q=80';
      link.download = 'Barmantra_Luxury_Lookbook_2026.pdf';
      document.body.appendChild(link);
      // Simulating a file prompt (We can trigger lookbook download nicely)
      setDownloadEmail('');
    }, 1500);
  };

  // Calculator State
  const [selectedPkg, setSelectedPkg] = useState(packages[1]);
  const [guestCount, setGuestCount] = useState(250);
  const [serviceHours, setServiceHours] = useState(5);
  const [includeFlair, setIncludeFlair] = useState(true);
  const [includeIceSculpt, setIncludeIceSculpt] = useState(false);

  // Price Calculation Formula
  const calculateTotalEstimate = () => {
    const guestCost = guestCount * selectedPkg.perGuestRate;
    const hourMultiplier = serviceHours <= 4 ? 1 : 1 + (serviceHours - 4) * 0.12;
    let setupFee = selectedPkg.basePrice * 0.25; // 25% of base price for styling & custom logistics
    
    let total = (guestCost + setupFee) * hourMultiplier;
    
    if (includeFlair) total += 45000; // Tandem Flair show upgrade
    if (includeIceSculpt) total += 35000; // Custom ice block carving
    
    return Math.round(total);
  };

  // AI Mixologist State
  const [aiSpirit, setAiSpirit] = useState('Gin');
  const [aiFlavorProfile, setAiFlavorProfile] = useState('');
  const [aiDrink, setAiDrink] = useState<CustomDrink | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const generateAICocktail = async () => {
    setAiLoading(true);
    setAiError('');
    setAiDrink(null);
    try {
      const response = await fetch('/api/ai/suggest-cocktail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spirit: aiSpirit, flavorProfile: aiFlavorProfile })
      });
      if (!response.ok) {
        throw new Error('Mixology matrix is temporarily offline.');
      }
      const data = await response.json();
      if (data.success) {
        setAiDrink(data.drink);
      } else {
        setAiError(data.error || 'Unable to curate formula.');
      }
    } catch (err: any) {
      setAiError(err.message || 'Transmission error. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="pt-24 animate-fade-in pb-20 bg-ivory-50">
      <SEO
        title="Services & Pricing Packages | Barmantra Mobile Bar Curation"
        description="Explore Barmantra's royal wedding bar setups, corporate mixology packages, and interactive cocktail flair bar services in Jaipur with transparent pricing."
        url="https://barmantra.com/#/services"
      />
      
      {/* Editorial Page Header */}
      <section className="relative py-28 bg-maroon-950 text-ivory-50 text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?auto=format&fit=crop&w=1920&q=80"
            alt="Palace Service Setup"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-maroon-950 via-maroon-950/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <span className="text-xs font-mono uppercase tracking-widest text-gold-400 font-bold mb-3 block">
            Curation & Pricing
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-ivory-50 tracking-tight leading-tight">
            Luxury Services <span className="shimmer-gold font-semibold italic">& Packages</span>
          </h1>
          <p className="font-sans text-sm sm:text-base text-ivory-200 mt-4 max-w-2xl mx-auto leading-relaxed font-light">
            We operate on a transparent ledger model. Our custom bar curations, flair events, and pricing plans are fully open and handcrafted to perfection.
          </p>
        </div>
      </section>

      {/* Package Tiers Grid */}
      <section className="py-20 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-jaali-pattern opacity-5 pointer-events-none" />
        
        <div className="text-center mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-gold-700 font-bold block mb-1">
            The Curation Formulas
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-maroon-950 font-medium">
            Select Your Entertainment Tier
          </h2>
          <div className="w-16 h-[1px] bg-gold-600 mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`rounded-3xl border p-8 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl ${
                pkg.featured 
                  ? 'bg-maroon-950 text-white border-gold-500 shadow-[0_15px_40px_rgba(42,4,13,0.3)] relative' 
                  : 'bg-white text-maroon-950 border-gold-600/15'
              }`}
            >
              {pkg.featured && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-gold-600 to-gold-400 text-maroon-950 font-mono text-[9px] uppercase tracking-widest font-bold shadow-md flex items-center space-x-1">
                  <Crown size={10} />
                  <span>Most Celebrated Curation</span>
                </div>
              )}

              <div>
                <span className={`text-[10px] font-mono uppercase tracking-widest ${pkg.featured ? 'text-gold-400' : 'text-gold-700'} block mb-2 font-bold`}>
                  {pkg.tagline}
                </span>
                <h3 className="font-serif text-2xl font-bold mb-4">{pkg.name}</h3>
                
                <div className="mb-6 pb-6 border-b border-gold-600/10">
                  <span className="text-xs font-sans text-gray-400 block uppercase tracking-wider mb-1">Estimated Range</span>
                  <span className={`text-2xl sm:text-3xl font-serif font-bold ${pkg.featured ? 'text-gold-400' : 'text-maroon-900'}`}>
                    {pkg.priceRange}
                  </span>
                  <span className="text-[10px] font-mono text-gray-500 block mt-1">Based on standard hospitality blocks</span>
                </div>

                <ul className="space-y-4 mb-8 text-sm leading-relaxed font-light">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <Check className={`w-4.5 h-4.5 flex-shrink-0 mt-0.5 ${pkg.featured ? 'text-gold-400' : 'text-gold-600'}`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => {
                  setSelectedPkg(pkg);
                  const calcSection = document.getElementById('calculator-section');
                  if (calcSection) {
                    calcSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className={`w-full py-3.5 rounded-xl font-sans font-bold text-xs uppercase tracking-wider transition-all cursor-pointer text-center ${
                  pkg.featured
                    ? 'bg-gradient-to-r from-gold-600 to-gold-500 text-maroon-950 hover:from-gold-500 shadow-md'
                    : 'bg-maroon-950 text-gold-400 hover:bg-maroon-900 border border-gold-500/20 shadow-sm'
                }`}
              >
                Configure Estimate
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Gated Lookbook & Brochure Download */}
      <section className="py-16 bg-maroon-900/5 border-y border-gold-600/15">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex-1">
            <div className="flex items-center space-x-2.5 mb-3">
              <BookOpen className="w-5 h-5 text-gold-600" />
              <span className="text-xs font-mono uppercase tracking-widest text-gold-700 font-bold">Design Portfolios</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-maroon-950 font-bold mb-3">
              Download the 2026 Mobile Bar Lookbook
            </h3>
            <p className="font-sans text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
              Unlock exclusive access to our handcrafted Rajasthani jaali counter sketches, 3D luxury bar facades, glassware pairing catalogs, and current corporate bar themes.
            </p>
          </div>

          <div className="w-full md:w-auto flex-shrink-0">
            {downloadSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-6 flex items-center space-x-3.5 max-w-md">
                <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                <div>
                  <span className="font-semibold block text-sm">Brochure Transmitted Successfully!</span>
                  <p className="text-xs font-light text-emerald-700 mt-0.5">Please check your downloads folder for Barmantra_Lookbook_2026.pdf.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleLookbookDownload} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                <input
                  type="email"
                  required
                  value={downloadEmail}
                  onChange={(e) => setDownloadEmail(e.target.value)}
                  placeholder="Enter corporate/personal email..."
                  className="px-5 py-3 rounded-xl border border-gray-200 focus:border-gold-600 focus:outline-none text-sm bg-white font-sans outline-none flex-grow w-full sm:w-64"
                />
                <button
                  type="submit"
                  disabled={downloadLoading}
                  className="px-6 py-3 rounded-xl bg-maroon-950 text-gold-400 hover:bg-maroon-900 border border-gold-500/20 font-sans font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer flex-shrink-0 shadow-sm"
                >
                  {downloadLoading ? (
                    <span className="w-4 h-4 rounded-full border-2 border-gold-400 border-t-transparent animate-spin" />
                  ) : (
                    <>
                      <Download size={13} />
                      <span>Fetch Lookbook</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Interactive Booking Estimate Calculator */}
      <section id="calculator-section" className="py-20 relative bg-ivory-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-gold-700 font-bold block mb-1">
              Live Price transparency
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-maroon-950 font-medium">
              Bespoke Booking Ledger Calculator
            </h2>
            <div className="w-16 h-[1px] bg-gold-600 mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left sliders control */}
            <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-gold-600/10 shadow-sm space-y-8">
              
              {/* Step 1: Select Tier Formula */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-maroon-950 mb-4 font-bold">
                  Step 1: Select Curation Tier Package
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {packages.map((pkg) => (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => setSelectedPkg(pkg)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        selectedPkg.id === pkg.id
                          ? 'border-gold-500 bg-maroon-950/5 shadow-sm text-maroon-950'
                          : 'border-gray-100 hover:border-gold-600/30 bg-gray-50/50 text-gray-600'
                      }`}
                    >
                      <span className="font-serif text-xs font-bold block mb-1">{pkg.name}</span>
                      <span className="text-[10px] font-mono text-gold-700 font-semibold block">₹{pkg.perGuestRate}/guest rate</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Guest count slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-mono uppercase tracking-widest text-maroon-950 font-bold">
                    Step 2: Total Invited Guests
                  </label>
                  <span className="font-serif text-lg font-bold text-maroon-950">{guestCount} Pax</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1200"
                  step="25"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-maroon-950"
                />
                <div className="flex justify-between text-[10px] font-mono text-gray-400 mt-2">
                  <span>50 guests (Boutique)</span>
                  <span>1200 guests (Royal Palace)</span>
                </div>
              </div>

              {/* Step 3: Service hours slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-mono uppercase tracking-widest text-maroon-950 font-bold">
                    Step 3: Service Duration
                  </label>
                  <span className="font-serif text-lg font-bold text-maroon-950">{serviceHours} Hours</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="12"
                  step="1"
                  value={serviceHours}
                  onChange={(e) => setServiceHours(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-maroon-950"
                />
                <div className="flex justify-between text-[10px] font-mono text-gray-400 mt-2">
                  <span>3 Hours minimum</span>
                  <span>12 Hours (All-Night Banquet)</span>
                </div>
              </div>

              {/* Step 4: Showmanship enhancements */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-maroon-950 mb-3 font-bold">
                  Step 4: Elite Curation Upgrades
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Upgrade 1: Tandem Flair */}
                  <label className="flex items-start space-x-3.5 p-4 rounded-2xl border border-gray-100 bg-gray-50/20 hover:bg-gray-50/50 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={includeFlair}
                      onChange={(e) => setIncludeFlair(e.target.checked)}
                      className="w-4.5 h-4.5 rounded border-gray-300 text-maroon-950 focus:ring-maroon-900 mt-0.5 accent-maroon-950"
                    />
                    <div>
                      <span className="font-sans font-semibold text-xs text-maroon-950 block">Tandem Fire-Flair Show</span>
                      <span className="text-[10px] text-gray-500 font-light block mt-0.5">Award-winning 15m synchronized bar show (+₹45,000)</span>
                    </div>
                  </label>

                  {/* Upgrade 2: Ice Carving */}
                  <label className="flex items-start space-x-3.5 p-4 rounded-2xl border border-gray-100 bg-gray-50/20 hover:bg-gray-50/50 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={includeIceSculpt}
                      onChange={(e) => setIncludeIceSculpt(e.target.checked)}
                      className="w-4.5 h-4.5 rounded border-gray-300 text-maroon-950 focus:ring-maroon-900 mt-0.5 accent-maroon-950"
                    />
                    <div>
                      <span className="font-sans font-semibold text-xs text-maroon-950 block">Laser Custom Ice Carving</span>
                      <span className="text-[10px] text-gray-500 font-light block mt-0.5">Custom-designed logo ice blocks & towers (+₹35,000)</span>
                    </div>
                  </label>

                </div>
              </div>

            </div>

            {/* Right Invoice Receipt Rendering */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl border border-gold-600/20 shadow-xl overflow-hidden relative font-mono text-xs text-gray-800 p-8 flex flex-col justify-between">
                
                {/* Vintage torn stamp overlay */}
                <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none opacity-10">
                  <span className="absolute transform rotate-45 bg-maroon-900 text-gold-400 font-bold py-1.5 text-[8px] text-center w-36 top-5 -right-5 tracking-widest uppercase border border-gold-500">
                    Barmantra
                  </span>
                </div>

                {/* Receipt Header */}
                <div className="text-center pb-6 border-b border-dashed border-gray-200">
                  <h3 className="font-serif text-xl font-bold text-maroon-950 tracking-wide uppercase">Barmantra Ledger</h3>
                  <p className="text-[10px] text-gray-400 tracking-wider uppercase mt-1">Jaipur, India · Est. 2014</p>
                  <p className="text-[9px] text-gray-400 mt-0.5">Reference ID: {`LGR-${Date.now().toString().substring(7)}`}</p>
                </div>

                {/* Receipt Items breakdown */}
                <div className="py-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-bold text-maroon-950 uppercase">{selectedPkg.name}</span>
                      <p className="text-[10px] text-gray-400 mt-0.5">Base curation retainer logistics</p>
                    </div>
                    <span className="font-bold">₹{selectedPkg.basePrice.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-bold text-maroon-950 uppercase">Beverage Catering Fee</span>
                      <p className="text-[10px] text-gray-400 mt-0.5">₹{selectedPkg.perGuestRate} per guest x {guestCount} Pax</p>
                    </div>
                    <span className="font-bold">₹{(selectedPkg.perGuestRate * guestCount).toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-bold text-maroon-950 uppercase">Duration multiplier</span>
                      <p className="text-[10px] text-gray-400 mt-0.5">Duration: {serviceHours} hours block</p>
                    </div>
                    <span className="font-bold">{serviceHours <= 4 ? '1.00x (Included)' : `${(1 + (serviceHours - 4) * 0.12).toFixed(2)}x rate`}</span>
                  </div>

                  {includeFlair && (
                    <div className="flex items-start justify-between text-maroon-900 font-semibold">
                      <div>
                        <span>+ Tandem Flair Fire Show</span>
                        <p className="text-[10px] text-gray-400 mt-0.5">15m performance sequence</p>
                      </div>
                      <span>₹45,000</span>
                    </div>
                  )}

                  {includeIceSculpt && (
                    <div className="flex items-start justify-between text-maroon-900 font-semibold">
                      <div>
                        <span>+ Logo Clear Ice Carvings</span>
                        <p className="text-[10px] text-gray-400 mt-0.5">In-house premium carving molds</p>
                      </div>
                      <span>₹35,000</span>
                    </div>
                  )}
                </div>

                {/* Receipt Total */}
                <div className="pt-6 border-t border-dashed border-gray-200 mt-2">
                  <div className="flex items-baseline justify-between mb-6">
                    <span className="text-sm font-bold uppercase tracking-wider text-maroon-950">Total Live Estimate:</span>
                    <div className="text-right">
                      <span className="text-2xl font-serif font-bold text-maroon-950">
                        ₹{calculateTotalEstimate().toLocaleString('en-IN')}
                      </span>
                      <span className="text-[8px] text-gray-400 block tracking-normal mt-0.5">*Subject to final menu ingredients selection</span>
                    </div>
                  </div>

                  {/* Booking Link */}
                  <button
                    onClick={() => {
                      navigateTo(`#/contact?package=${selectedPkg.id}&guests=${guestCount}&hours=${serviceHours}&flair=${includeFlair}&ice=${includeIceSculpt}`);
                    }}
                    className="w-full py-3 rounded-xl bg-maroon-950 text-gold-400 hover:bg-maroon-900 border border-gold-500/20 font-sans font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center space-x-2 cursor-pointer shadow-md"
                  >
                    <span>Secure Booking Date</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* AI-Powered Royal Mixologist Custom Cocktail Generator */}
      <section className="py-20 bg-gradient-to-b from-ivory-50 to-ivory-100 relative overflow-hidden">
        
        {/* Decorative ambient background flares */}
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-maroon-800/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          
          <div className="text-center mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-gold-700 font-bold block mb-1">
              Interactive AI Laboratory
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-maroon-950 font-medium">
              The Royal AI Mixologist Studio
            </h2>
            <p className="font-sans text-xs sm:text-sm text-gray-600 max-w-xl mx-auto mt-2 font-light">
              Craft a completely bespoke, theme-appropriate signature beverage. Our custom-trained mixology model fuses global spirits with heritage Rajasthani ingredients.
            </p>
            <div className="w-16 h-[1px] bg-gold-600 mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            
            {/* Control Panel (left) */}
            <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-gold-600/15 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2.5 mb-6 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-xl bg-maroon-950 text-gold-400 flex items-center justify-center border border-gold-500/20 shadow-md">
                    <Wine size={18} />
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-gold-700 font-bold block">Artisanal Blends</span>
                    <span className="text-[10px] text-gray-400">Specify your flavor palette</span>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Base Spirit */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-maroon-950 mb-2 font-bold">
                      Select Base Spirit Base
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Gin', 'Whiskey', 'Vodka', 'Tequila'].map((spirit) => (
                        <button
                          key={spirit}
                          type="button"
                          onClick={() => setAiSpirit(spirit)}
                          className={`py-3.5 px-4 rounded-xl border text-center font-sans font-semibold text-xs tracking-wide transition-all cursor-pointer ${
                            aiSpirit === spirit
                              ? 'bg-maroon-950 text-gold-400 border-gold-500 shadow-md'
                              : 'bg-white text-gray-600 border-gray-100 hover:border-gold-600/30'
                          }`}
                        >
                          {spirit}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Flavor Nuance Input */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-maroon-950 mb-2 font-bold">
                      Add Custom Flavor Profile & Themes
                    </label>
                    <textarea
                      value={aiFlavorProfile}
                      onChange={(e) => setAiFlavorProfile(e.target.value)}
                      placeholder="e.g. Saffron-infused honey, sandalwood smoke, wild rose nectar, organic marigold, dry ice fog..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold-600 focus:outline-none text-xs bg-ivory-50/50 outline-none resize-none font-sans leading-relaxed"
                    />
                    <p className="text-[9px] text-gray-400 font-light mt-1.5 leading-normal">
                      The AI will blend these with royal Jaipur ingredients (Kashmiri saffron, cardamom, sandalwood) to design a themed masterpiece.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="button"
                  onClick={generateAICocktail}
                  disabled={aiLoading}
                  className="w-full py-4 rounded-xl bg-maroon-950 text-gold-400 hover:bg-maroon-900 border border-gold-500/20 font-sans font-bold text-xs uppercase tracking-widest flex items-center justify-center space-x-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
                >
                  {aiLoading ? (
                    <>
                      <Flame className="w-4 h-4 animate-bounce text-gold-400" />
                      <span>Shaking Mixology Matrix...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} className="text-gold-400" />
                      <span>Concoct Royal Drink</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Cocktail Recipe Output Card (right) */}
            <div className="lg:col-span-7">
              {aiLoading ? (
                <div className="h-full min-h-[400px] rounded-3xl border border-gold-600/10 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center shadow-inner">
                  <div className="relative w-20 h-20 mb-6">
                    {/* Shaker shaker animation */}
                    <div className="w-16 h-16 bg-maroon-950 rounded-full border border-gold-500 flex items-center justify-center text-gold-400 animate-bounce shadow-lg mx-auto">
                      <Wine size={26} />
                    </div>
                    <div className="absolute inset-0 border border-dashed border-gold-500/40 rounded-full animate-spin" />
                  </div>
                  <span className="text-xs font-mono uppercase tracking-widest text-gold-700 font-bold block mb-1">
                    Curation under process...
                  </span>
                  <p className="font-sans text-[11px] text-gray-500 max-w-xs font-light leading-relaxed">
                    Infusing the botanical matrices, balancing the sweetness ratios, and preparing the hand-carved ice sphere template...
                  </p>
                </div>
              ) : aiDrink ? (
                <div className="bg-white rounded-3xl border-2 border-gold-500/30 p-8 shadow-xl relative overflow-hidden animate-scale-in flex flex-col justify-between h-full">
                  
                  {/* Decorative golden framing corners */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-gold-500 opacity-60" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-gold-500 opacity-60" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-gold-500 opacity-60" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-gold-500 opacity-60" />

                  <div>
                    {/* Card Header */}
                    <div className="text-center pb-5 border-b border-gold-600/15 mb-6">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-gold-700 font-bold block mb-1">
                        Barmantra Custom Laboratory Formula
                      </span>
                      <h3 className="font-serif text-2xl sm:text-3xl text-maroon-950 font-bold tracking-tight">
                        {aiDrink.name}
                      </h3>
                      <div className="w-12 h-[1px] bg-gold-600 mx-auto mt-3" />
                    </div>

                    {/* Poetic History description */}
                    <div className="mb-6">
                      <p className="font-sans text-xs text-gray-700 italic font-light leading-relaxed bg-maroon-900/5 px-4 py-3.5 rounded-xl border-l-2 border-gold-500">
                        "{aiDrink.history}"
                      </p>
                    </div>

                    {/* Ingredients & instructions split */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start text-xs font-sans">
                      <div>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-maroon-950 font-bold block mb-3">
                          Ingredient Curation
                        </span>
                        <ul className="space-y-2 text-gray-700 font-light list-disc list-inside">
                          {aiDrink.ingredients.map((ing, idx) => (
                            <li key={idx} className="leading-relaxed">
                              {ing}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-maroon-950 font-bold block mb-3">
                          Mixology Instructions
                        </span>
                        <ol className="space-y-2 text-gray-700 font-light list-decimal list-inside">
                          {aiDrink.instructions.map((step, idx) => (
                            <li key={idx} className="leading-relaxed">
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>

                    {/* Presentation Glassware details */}
                    <div className="mt-6 pt-5 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                      <div>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-maroon-950 font-bold block mb-1">
                          Recommended Vessel
                        </span>
                        <p className="text-gray-600 font-light">{aiDrink.glassware}</p>
                      </div>
                      <div>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-maroon-950 font-bold block mb-1">
                          Bespoke Garnish & Ice
                        </span>
                        <p className="text-gray-600 font-light">{aiDrink.garnish}</p>
                      </div>
                    </div>
                  </div>

                  {/* Add to my event button */}
                  <div className="mt-8 pt-4 border-t border-gray-100 text-center">
                    <p className="text-[10px] text-gray-400 font-sans mb-3 font-light">
                      Would you like our bar team to serve this bespoke formula at your celebration?
                    </p>
                    <button
                      onClick={() => {
                        navigateTo(`#/contact?drink=${encodeURIComponent(aiDrink.name)}&base=${aiSpirit}`);
                      }}
                      className="px-6 py-2.5 rounded-full bg-maroon-950 text-gold-400 hover:bg-maroon-900 border border-gold-500/20 font-sans font-bold text-xs uppercase tracking-wider cursor-pointer shadow-sm inline-flex items-center space-x-2"
                    >
                      <Wine size={12} />
                      <span>Incorporate Into My Bar Menu</span>
                    </button>
                  </div>

                </div>
              ) : (
                <div className="h-full min-h-[400px] rounded-3xl border border-dashed border-gold-600/20 bg-white flex flex-col items-center justify-center p-8 text-center shadow-sm">
                  <div className="w-16 h-16 rounded-full bg-maroon-900/5 text-gold-600 border border-gold-500/10 flex items-center justify-center mb-4">
                    <Wine size={24} />
                  </div>
                  <h4 className="font-serif text-lg text-maroon-950 font-bold mb-1">Unleash the Mixology</h4>
                  <p className="font-sans text-xs text-gray-500 max-w-xs font-light leading-relaxed">
                    Select a base spirit and custom flavor profile in the control panel, then press <strong>Concoct Royal Drink</strong> to compile your signature recipe card instantly.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
