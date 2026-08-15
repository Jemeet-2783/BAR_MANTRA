/**
 * Barmantra — Terms of Royal Engagement View Component
 */

import React from 'react';
import { ArrowLeft, ShieldCheck, Scale, FileSignature, AlertCircle, Sparkles, Building, Coins, HelpCircle } from 'lucide-react';
import { SEO } from '../SEO';

export const TermsView: React.FC = () => {
  return (
    <>
      <SEO 
        title="Terms of Royal Engagement | Barmantra Luxury Mixology"
        description="Comprehensive terms governing Barmantra's luxury mobile bar fabrications, retainer deposit protocols, liquor licensing disclaimers, and event logistics."
        canonicalUrl="https://barmantra.com/#/terms"
      />
      <div className="pt-28 pb-24 min-h-screen bg-ivory-50 text-maroon-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Back Navigation */}
          <a
            href="#/"
            className="inline-flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-widest text-maroon-900 hover:text-gold-700 transition-colors mb-8 cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Return to Barmantra Heritage</span>
          </a>

          {/* Hero Header Card */}
          <div className="bg-gradient-to-br from-maroon-950 via-maroon-900 to-neutral-900 text-ivory-100 rounded-3xl p-8 sm:p-12 border border-gold-500/20 shadow-2xl relative overflow-hidden mb-10">
            <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="w-14 h-14 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 mb-6 shadow-inner">
              <Scale size={28} />
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl text-gold-200 font-bold mb-4">
              Terms of Royal Engagement
            </h1>
            <p className="font-sans text-sm sm:text-base text-gold-100/80 font-light leading-relaxed max-w-2xl">
              All luxury mixology engagements, mobile bar fabrications, and event curations executed by Barmantra are governed under formal bilateral contracts.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-xs font-mono uppercase tracking-wider text-gold-400">
              <span className="flex items-center gap-1.5 bg-maroon-950/60 px-3 py-1.5 rounded-full border border-gold-500/20">
                <ShieldCheck size={13} /> Open-Ledger Price Protection
              </span>
              <span className="flex items-center gap-1.5 bg-maroon-950/60 px-3 py-1.5 rounded-full border border-gold-500/20">
                <Sparkles size={13} /> 12-Month Calendar Transfer Policy
              </span>
            </div>
          </div>

          {/* Policy Sections */}
          <div className="space-y-8 font-sans text-sm sm:text-base text-gray-700 leading-relaxed font-light">
            
            {/* Section 1 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gold-600/10 shadow-sm">
              <div className="flex items-center space-x-3 mb-4 text-maroon-900">
                <Coins size={20} className="text-gold-600" />
                <h2 className="font-serif text-xl sm:text-2xl text-maroon-950 font-bold">
                  1. Booking Retainer & Locked Quotations
                </h2>
              </div>
              <p className="mb-4">
                To reserve an event date in our Jaipur fabrication workshop and lock lead mixologists:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 text-sm mb-4">
                <li><strong>30% Deposit Retainer:</strong> An initial retainer deposit equal to 30% of the calculated locked quote is required upon proposal approval.</li>
                <li><strong>Server-Side Price Lock:</strong> Quoted prices are server-validated and locked against market fluctuations for 30 calendar days from issuance.</li>
                <li><strong>Final Settlement:</strong> The remaining 70% balance must be settled 7 business days prior to the event date.</li>
              </ul>
            </div>

            {/* Section 2 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gold-600/10 shadow-sm">
              <div className="flex items-center space-x-3 mb-4 text-maroon-900">
                <FileSignature size={20} className="text-gold-600" />
                <h2 className="font-serif text-xl sm:text-2xl text-maroon-950 font-bold">
                  2. Cancellation & Date Rescheduling
                </h2>
              </div>
              <p className="mb-4">
                We accommodate schedule changes for palace and destination wedding venues:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-4 rounded-xl bg-ivory-100/70 border border-gold-500/20">
                  <strong className="text-maroon-950 block mb-1 text-sm font-sans font-bold">12-Month Calendar Transfer:</strong>
                  If notice is given at least 30 days prior to the event, 100% of your deposit is transferable to any new date within a 12-month calendar window, subject to venue team availability.
                </div>
                <div className="p-4 rounded-xl bg-red-50/50 border border-red-200">
                  <strong className="text-red-900 block mb-1 text-sm font-sans font-bold">Cancellations Under 14 Days:</strong>
                  Cancellations requested under 14 days from the event date forfeit the 30% retainer to cover custom cocktail ingredient preparation and artisan labor reservation.
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gold-600/10 shadow-sm">
              <div className="flex items-center space-x-3 mb-4 text-maroon-900">
                <AlertCircle size={20} className="text-gold-600" />
                <h2 className="font-serif text-xl sm:text-2xl text-maroon-950 font-bold">
                  3. State Excise & Liquor Licensing Disclaimer
                </h2>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-xs sm:text-sm text-maroon-950 space-y-2 mb-4">
                <p className="font-medium text-amber-900 flex items-center gap-1.5">
                  <AlertCircle size={16} className="text-amber-700 shrink-0" />
                  <strong>Regulatory Compliance Notice:</strong>
                </p>
                <p className="text-gray-700">
                  Barmantra provides luxury mixology consultation, custom bar counters, professional certified bartenders, artisanal ice, garnishes, and non-alcoholic infusions.
                </p>
                <p className="text-gray-700">
                  Per State Excise Laws in Rajasthan and across India, <strong>liquor permits (FL-4 / temporary event licenses) and actual spirits purchases remain the responsibility of the event host or palace venue</strong>. Barmantra aids in estimating exact alcohol requirements and procuring legal permits on client behalf where permitted.
                </p>
              </div>
            </div>

            {/* Section 4 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gold-600/10 shadow-sm">
              <div className="flex items-center space-x-3 mb-4 text-maroon-900">
                <Building size={20} className="text-gold-600" />
                <h2 className="font-serif text-xl sm:text-2xl text-maroon-950 font-bold">
                  4. Custom Bar Facades & Intellectual Property
                </h2>
              </div>
              <p className="mb-4">
                All 3D mockups, custom mobile bar facade blueprints, signature cocktail recipe formulation specs, and custom glassware curation designs drafted by Barmantra remain the sole intellectual property of Barmantra.
              </p>
              <p className="text-xs text-gray-500">
                Clients are granted an exclusive license to feature these bar setups during their contract event date. Reproduction of bar blueprints by third-party fabricators is strictly prohibited.
              </p>
            </div>

            {/* Section 5 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gold-600/10 shadow-sm">
              <div className="flex items-center space-x-3 mb-4 text-maroon-900">
                <Scale size={20} className="text-gold-600" />
                <h2 className="font-serif text-xl sm:text-2xl text-maroon-950 font-bold">
                  5. Jurisdiction & Dispute Resolution
                </h2>
              </div>
              <p className="mb-2 text-sm">
                These terms are governed under the laws of India. Any legal disputes or claims arising out of services rendered by Barmantra shall be subject to the exclusive jurisdiction of the courts in <strong>Jaipur, Rajasthan</strong>.
              </p>
            </div>

            {/* Support CTA */}
            <div className="bg-maroon-950 text-ivory-100 rounded-2xl p-6 sm:p-8 border border-gold-500/20 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="font-serif text-lg font-bold text-gold-300 mb-1 flex items-center gap-2">
                  <HelpCircle size={18} /> Direct Contract & Legal Inquiries
                </h3>
                <p className="text-xs text-gold-100/70">
                  Need a customized corporate contract or venue agreement? Contact our Jaipur desk.
                </p>
              </div>
              <a
                href="mailto:legal@barmantra.com"
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-maroon-950 font-sans font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shrink-0 cursor-pointer shadow-md"
              >
                legal@barmantra.com
              </a>
            </div>

          </div>

        </div>
      </div>
    </>
  );
};
