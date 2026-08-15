/**
 * Barmantra — Public Client Booking & Proposal Lookup Portal
 */

import React, { useState, useEffect } from 'react';
import { Search, Loader2, Calendar, Users, Building2, CheckCircle2, ArrowRight, Clock, ShieldAlert, Phone, Mail, Sparkles, Receipt, ArrowLeft } from 'lucide-react';
import { PublicPayInfo } from '../../types';
import { SEO } from '../SEO';

interface BookingLookupResult extends PublicPayInfo {
  status: 'Pending' | 'Approved' | 'Contacted' | 'Cancelled';
  createdAt: string;
}

export const BookingLookupView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState<BookingLookupResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Check URL query param if user arrived via direct link (e.g. #/lookup?ref=bk_123)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('?ref=') || hash.includes('?query=')) {
      const match = hash.match(/\?(?:ref|query)=([^&]+)/);
      if (match && match[1]) {
        const initialQuery = decodeURIComponent(match[1]);
        setQuery(initialQuery);
        handleLookup(initialQuery);
      }
    }
  }, []);

  const handleLookup = async (searchQuery?: string) => {
    const q = (searchQuery !== undefined ? searchQuery : query).trim();
    if (!q) {
      setError('Please enter your phone number or booking reference ID.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSearched(true);

      const res = await fetch('/api/public/bookings/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to search booking proposals.');
      }

      setResults(data.bookings || []);
    } catch (err: any) {
      setError(err.message || 'Lookup failed. Please check your query or contact concierge.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold uppercase tracking-wider"><CheckCircle2 size={13} /> Approved Proposal</span>;
      case 'Contacted':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-semibold uppercase tracking-wider"><Phone size={13} /> In Concierge Review</span>;
      case 'Cancelled':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 text-xs font-semibold uppercase tracking-wider"><ShieldAlert size={13} /> Proposal Cancelled</span>;
      case 'Pending':
      default:
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-semibold uppercase tracking-wider"><Clock size={13} /> Review Pending</span>;
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'Deposit_Paid':
      case 'Fully_Paid':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold"><CheckCircle2 size={12} /> Retainer Paid</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-950 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold"><Clock size={12} /> Retainer Unpaid</span>;
    }
  };

  return (
    <>
      <SEO
        title="Client Booking & Quote Lookup | Barmantra"
        description="Track your luxury event proposal, view locked quote estimates, check date availability status, and access secure retainer deposit payments."
        canonicalUrl="https://barmantra.com/#/lookup"
      />
      <div className="pt-28 pb-24 min-h-screen bg-neutral-950 text-neutral-100 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">

          {/* Back Button */}
          <a
            href="#/"
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-amber-400 text-xs font-mono uppercase tracking-widest mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Barmantra Heritage Showcase
          </a>

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Client Self-Service Portal
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 mb-3">
              Proposal & Booking Tracker
            </h1>
            <p className="text-neutral-400 text-sm sm:text-base max-w-xl mx-auto font-light">
              Enter your registered phone number or booking reference ID to view your customized Jaipur event specifications and retainer payment options.
            </p>
          </div>

          {/* Search Box */}
          <div className="bg-neutral-900/80 border border-amber-500/20 rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-2xl mb-10 max-w-2xl mx-auto">
            <form onSubmit={(e) => { e.preventDefault(); handleLookup(); }} className="space-y-4">
              <label className="block text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                Phone Number or Booking Reference ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. +91 98290 12345 or bk_1720000000000_1234"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3.5 pl-11 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm font-mono"
                />
                <Search className="w-5 h-5 text-neutral-500 absolute left-3.5 top-3.5" />
              </div>

              {error && (
                <p className="text-xs text-red-400 bg-red-950/40 border border-red-500/30 rounded-lg p-3">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white font-semibold py-3.5 rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Search className="w-4 h-4" /> Track Proposal Status
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results Container */}
          {searched && (
            <div className="space-y-6">
              {results.length === 0 ? (
                <div className="text-center bg-neutral-900/40 border border-neutral-800 rounded-2xl p-8 max-w-md mx-auto">
                  <ShieldAlert className="w-10 h-10 text-amber-500 mx-auto mb-3 opacity-60" />
                  <h3 className="text-lg font-serif text-white font-semibold mb-1">No Matching Proposals Found</h3>
                  <p className="text-xs text-neutral-400 mb-6 font-light">
                    We could not find any active proposal matching "<span className="text-amber-300">{query}</span>". Please verify your phone number or reach out to our concierge desk.
                  </p>
                  <a
                    href="#/contact"
                    className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:underline"
                  >
                    Submit New Inquiry <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              ) : (
                results.map((booking) => (
                  <div key={booking.id} className="bg-neutral-900/80 border border-amber-900/30 rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-xl hover:border-amber-500/40 transition-all">
                    
                    {/* Header bar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-5 mb-6">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs text-amber-400 font-bold uppercase tracking-wider">Ref ID: {booking.id}</span>
                          {getPaymentBadge(booking.paymentStatus)}
                        </div>
                        <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">{booking.name}</h2>
                      </div>
                      <div>
                        {getStatusBadge(booking.status)}
                      </div>
                    </div>

                    {/* Event Specifications */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 text-sm">
                      <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                        <span className="text-xs text-neutral-500 flex items-center gap-1.5 mb-1">
                          <Building2 className="w-3.5 h-3.5 text-amber-500" /> Experience
                        </span>
                        <span className="font-medium text-amber-200 capitalize block truncate">
                          {booking.eventType.replace('-', ' ')}
                        </span>
                      </div>

                      <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                        <span className="text-xs text-neutral-500 flex items-center gap-1.5 mb-1">
                          <Calendar className="w-3.5 h-3.5 text-amber-500" /> Target Date
                        </span>
                        <span className="font-medium text-white block">
                          {booking.eventDate}
                        </span>
                      </div>

                      <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                        <span className="text-xs text-neutral-500 flex items-center gap-1.5 mb-1">
                          <Users className="w-3.5 h-3.5 text-amber-500" /> Guest Count
                        </span>
                        <span className="font-medium text-white block">
                          {booking.guestCount} Guests
                        </span>
                      </div>

                      <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                        <span className="text-xs text-neutral-500 flex items-center gap-1.5 mb-1">
                          <Receipt className="w-3.5 h-3.5 text-amber-500" /> 30% Retainer
                        </span>
                        <span className="font-serif font-bold text-amber-400 block text-base">
                          ₹{booking.depositAmount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Financial Summary & Actions */}
                    <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
                      <div className="text-xs text-neutral-400">
                        Total Quoted Estimate: <strong className="text-white text-sm">₹{booking.pricingEstimate.toLocaleString('en-IN')}</strong>
                        <span className="block text-[11px] text-neutral-500 mt-0.5">Submitted on: {new Date(booking.createdAt).toLocaleDateString('en-IN')}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        {booking.paymentStatus !== 'Deposit_Paid' && booking.paymentStatus !== 'Fully_Paid' ? (
                          <a
                            href={`#/pay/${booking.id}`}
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-sans font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-1.5 shadow-md"
                          >
                            Pay Deposit Retainer <ArrowRight className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <a
                            href={`#/pay/${booking.id}`}
                            className="px-5 py-2.5 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-sans font-bold text-xs uppercase tracking-wider hover:bg-emerald-900 transition-all flex items-center gap-1.5"
                          >
                            View Digital Receipt <CheckCircle2 className="w-3.5 h-3.5" />
                          </a>
                        )}

                        <a
                          href="https://wa.me/917357652737"
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2.5 rounded-xl bg-neutral-900 text-neutral-300 border border-neutral-800 font-sans font-medium text-xs hover:text-amber-300 transition-all flex items-center gap-1.5"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp Concierge
                        </a>
                      </div>
                    </div>

                  </div>
                ))
              )}
            </div>
          )}

        </div>
      </div>
    </>
  );
};
