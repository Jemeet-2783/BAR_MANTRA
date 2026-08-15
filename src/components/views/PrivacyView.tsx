/**
 * Barmantra — Privacy Protocol & Data Security View Component
 */

import React from 'react';
import { ArrowLeft, Shield, Lock, Eye, Database, Server, FileText, Mail, CheckCircle2 } from 'lucide-react';
import { SEO } from '../SEO';

export const PrivacyView: React.FC = () => {
  return (
    <>
      <SEO 
        title="Privacy Protocol | Barmantra Luxury Mixology"
        description="Learn how Barmantra protects client confidentiality, event specifications, and guest data with bank-grade security and non-disclosure standards."
        canonicalUrl="https://barmantra.com/#/privacy"
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
              <Shield size={28} />
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl text-gold-200 font-bold mb-4">
              Privacy & Confidentiality Protocol
            </h1>
            <p className="font-sans text-sm sm:text-base text-gold-100/80 font-light leading-relaxed max-w-2xl">
              At Barmantra, based in Raja Park, Jaipur, we enforce strict non-disclosure parameters for high-profile weddings, corporate galas, and private royal soirées.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-xs font-mono uppercase tracking-wider text-gold-400">
              <span className="flex items-center gap-1.5 bg-maroon-950/60 px-3 py-1.5 rounded-full border border-gold-500/20">
                <CheckCircle2 size={13} /> OWASP 600K Iterations PBKDF2 Hashing
              </span>
              <span className="flex items-center gap-1.5 bg-maroon-950/60 px-3 py-1.5 rounded-full border border-gold-500/20">
                <CheckCircle2 size={13} /> Strict NDA Compliance
              </span>
            </div>
          </div>

          {/* Policy Sections Grid */}
          <div className="space-y-8 font-sans text-sm sm:text-base text-gray-700 leading-relaxed font-light">
            
            {/* Section 1 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gold-600/10 shadow-sm">
              <div className="flex items-center space-x-3 mb-4 text-maroon-900">
                <Lock size={20} className="text-gold-600" />
                <h2 className="font-serif text-xl sm:text-2xl text-maroon-950 font-bold">
                  1. Information We Collect
                </h2>
              </div>
              <p className="mb-4">
                To engineer bespoke mobile bar experiences and calculate locked quote estimates, we collect personal and logistical details submitted through our inquiry forms:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 text-sm">
                <li><strong>Identity & Contact:</strong> Full Name, Corporate/Personal Email Address, Phone Number.</li>
                <li><strong>Event Specifications:</strong> Event Type, Target Date, Expected Guest Count, Palace/Venue Location, and Custom Cocktail preferences.</li>
                <li><strong>Technical Logs:</strong> Anonymized IP addresses (for rate-limiting public inquiry submissions to max 10 requests per 15 minutes) and security session logs.</li>
              </ul>
            </div>

            {/* Section 2 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gold-600/10 shadow-sm">
              <div className="flex items-center space-x-3 mb-4 text-maroon-900">
                <Eye size={20} className="text-gold-600" />
                <h2 className="font-serif text-xl sm:text-2xl text-maroon-950 font-bold">
                  2. Non-Disclosure & Confidentiality
                </h2>
                </div>
              <p className="mb-4">
                We understand that high-profile palace weddings and corporate galas demand absolute discretion. 
              </p>
              <div className="bg-ivory-100/70 border-l-4 border-gold-600 p-4 rounded-r-xl text-xs sm:text-sm text-maroon-950 space-y-2">
                <p>
                  <strong>Zero Commercial Data Trading:</strong> We never sell, lease, trade, or distribute client contact lists or event details to external commercial syndicates or third-party advertisers.
                </p>
                <p>
                  <strong>Vendor NDA Protocols:</strong> All auxiliary mixologists, ice sculptors, and logistics staff operates under signed bilateral non-disclosure agreements regarding guest lists and event photography.
                </p>
              </div>
            </div>

            {/* Section 3 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gold-600/10 shadow-sm">
              <div className="flex items-center space-x-3 mb-4 text-maroon-900">
                <Database size={20} className="text-gold-600" />
                <h2 className="font-serif text-xl sm:text-2xl text-maroon-950 font-bold">
                  3. Data Retention & Soft Delete Lifecycle
                </h2>
              </div>
              <p className="mb-4">
                Inquiries and confirmed booking proposals are stored in our secure database ledger. Administrative deletion follows a strict <strong>Soft Delete</strong> protocol: records marked for deletion are archived with audit timestamps (`deletedAt` and `deletedBy`) allowing operational recovery while preventing accidental data loss.
              </p>
              <p className="text-xs text-gray-500">
                Clients may request permanent record erasure at any time following the conclusion of their event.
              </p>
            </div>

            {/* Section 4 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gold-600/10 shadow-sm">
              <div className="flex items-center space-x-3 mb-4 text-maroon-900">
                <Server size={20} className="text-gold-600" />
                <h2 className="font-serif text-xl sm:text-2xl text-maroon-950 font-bold">
                  4. Cookies & Session Security
                </h2>
              </div>
              <p className="mb-4">
                Barmantra uses minimal HTTP-only session cookies (`barmantra_session`) strictly for administrative authentication within our Command Studio. Public visitors are not subjected to invasive tracking cookies or persistent third-party analytics pixels.
              </p>
            </div>

            {/* Section 5 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gold-600/10 shadow-sm">
              <div className="flex items-center space-x-3 mb-4 text-maroon-900">
                <FileText size={20} className="text-gold-600" />
                <h2 className="font-serif text-xl sm:text-2xl text-maroon-950 font-bold">
                  5. Third-Party Sub-Processors
                </h2>
              </div>
              <p className="mb-4 text-sm">
                We integrate with trusted enterprise platforms to facilitate payment processing, media delivery, and client communication:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <li className="p-3 rounded-xl bg-ivory-100/60 border border-gold-500/10">
                  <strong className="text-maroon-950 block mb-1">Razorpay / Stripe:</strong>
                  256-Bit SSL encrypted payment gateways for retainer deposits.
                </li>
                <li className="p-3 rounded-xl bg-ivory-100/60 border border-gold-500/10">
                  <strong className="text-maroon-950 block mb-1">WhatsApp (Meta Graph API):</strong>
                  Automated instant booking status receipts sent to verified phone numbers.
                </li>
                <li className="p-3 rounded-xl bg-ivory-100/60 border border-gold-500/10">
                  <strong className="text-maroon-950 block mb-1">Cloudinary:</strong>
                  Dynamic responsive image optimization for gallery portfolio case studies.
                </li>
                <li className="p-3 rounded-xl bg-ivory-100/60 border border-gold-500/10">
                  <strong className="text-maroon-950 block mb-1">Google Gemini AI:</strong>
                  Formulates bespoke cocktail flavor pairings based on user input.
                </li>
              </ul>
            </div>

            {/* Section 6 */}
            <div className="bg-maroon-950 text-ivory-100 rounded-2xl p-6 sm:p-8 border border-gold-500/20 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="font-serif text-lg font-bold text-gold-300 mb-1 flex items-center gap-2">
                  <Mail size={18} /> Privacy Compliance Contact
                </h3>
                <p className="text-xs text-gold-100/70">
                  For privacy audits, NDA execution, or data deletion inquiries, contact our Jaipur compliance desk.
                </p>
              </div>
              <a
                href="mailto:privacy@barmantra.com"
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-maroon-950 font-sans font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shrink-0 cursor-pointer shadow-md"
              >
                privacy@barmantra.com
              </a>
            </div>

          </div>

        </div>
      </div>
    </>
  );
};
