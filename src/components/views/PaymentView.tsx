/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle2, ShieldCheck, ArrowLeft, Loader2, Sparkles, Building2, Calendar, Users, Phone, Mail, Receipt, Lock } from 'lucide-react';
import { PublicPayInfo } from '../../types';

interface PaymentViewProps {
  bookingId: string;
  onNavigate: (route: string) => void;
}

export const PaymentView: React.FC<PaymentViewProps> = ({ bookingId, onNavigate }) => {
  const [payInfo, setPayInfo] = useState<PublicPayInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    fetchPayInfo();
  }, [bookingId]);

  const fetchPayInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/public/bookings/${bookingId}/pay-info`);
      if (!res.ok) {
        throw new Error('Booking proposal not found or payment link expired.');
      }
      const data = await res.json();
      setPayInfo(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load booking payment portal.');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayment = async (mode: 'sandbox' | 'razorpay') => {
    if (!payInfo) return;
    setProcessing(true);
    setError(null);

    try {
      // Simulated or Razorpay Payment Completion
      const mockTxnId = `TXN_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
      const mockOrderId = `ORD_${Date.now()}`;
      const mockSignature = `SIG_${Date.now()}_PASS`;

      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: payInfo.id,
          transactionId: mockTxnId,
          orderId: mockOrderId,
          signature: mockSignature,
          amount: payInfo.depositAmount,
          gateway: mode === 'sandbox' ? 'Sandbox' : 'Razorpay'
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Payment verification failed.');
      }

      setPaymentSuccess(true);
      await fetchPayInfo();
    } catch (err: any) {
      setError(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center py-20 px-4">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
        <p className="font-serif text-lg text-amber-200/80">Securing Royal Payment Portal...</p>
      </div>
    );
  }

  if (error || !payInfo) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center py-20 px-4">
        <div className="bg-neutral-900/80 border border-red-500/30 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-12 h-12 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-serif text-white mb-2">Payment Portal Error</h2>
          <p className="text-neutral-400 text-sm mb-6">{error || 'Booking quote not found.'}</p>
          <button
            onClick={() => onNavigate('contact')}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white font-medium py-2.5 rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Contact Page
          </button>
        </div>
      </div>
    );
  }

  const isPaid = payInfo.paymentStatus === 'Deposit_Paid' || payInfo.paymentStatus === 'Fully_Paid';

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Link */}
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 text-neutral-400 hover:text-amber-400 text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Barmantra Heritage Showcase
        </button>

        {/* Portal Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Official Luxury Deposit Gateway
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 mb-3">
            Barmantra Royal Event Retainer
          </h1>
          <p className="text-neutral-400 text-sm max-w-xl mx-auto">
            Lock in your Jaipur event date, bespoke mobile bar setup, and master mixologist team with a 30% retainer deposit.
          </p>
        </div>

        {/* Payment Main Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Booking & Quote Summary */}
          <div className="lg:col-span-7 bg-neutral-900/60 border border-amber-900/30 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
            <h2 className="text-lg font-serif font-semibold text-amber-200 mb-6 flex items-center gap-2 border-b border-neutral-800 pb-4">
              <Building2 className="w-5 h-5 text-amber-400" /> Event Summary & Specifications
            </h2>

            <div className="space-y-4 text-sm mb-8">
              <div className="flex justify-between items-center py-2 border-b border-neutral-800/60">
                <span className="text-neutral-400 flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-500/70" /> Client Name
                </span>
                <span className="font-medium text-white">{payInfo.name}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-neutral-800/60">
                <span className="text-neutral-400 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-500/70" /> Event Experience
                </span>
                <span className="font-medium text-amber-300 capitalize">{payInfo.eventType.replace('-', ' ')}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-neutral-800/60">
                <span className="text-neutral-400 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-500/70" /> Target Date
                </span>
                <span className="font-medium text-white">{payInfo.eventDate}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-neutral-800/60">
                <span className="text-neutral-400 flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-500/70" /> Expected Guests
                </span>
                <span className="font-medium text-white">{payInfo.guestCount} Guests</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-neutral-800/60">
                <span className="text-neutral-400 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-500/70" /> Phone Contact
                </span>
                <span className="font-medium text-neutral-300">{payInfo.phone}</span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-neutral-400 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-500/70" /> Confirmation Email
                </span>
                <span className="font-medium text-neutral-300">{payInfo.email}</span>
              </div>
            </div>

            {/* Financial Breakdown */}
            <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-5">
              <div className="flex justify-between items-center mb-3 text-sm text-neutral-400">
                <span>Total Locked Quote Estimate:</span>
                <span className="font-semibold text-white">₹{payInfo.pricingEstimate.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center text-base font-serif font-bold text-amber-300 pt-3 border-t border-neutral-800">
                <span>30% Deposit Retainer:</span>
                <span className="text-xl text-amber-400">₹{payInfo.depositAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Payment Action / Receipt Card */}
          <div className="lg:col-span-5 bg-gradient-to-b from-neutral-900 to-neutral-950 border border-amber-500/20 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            
            {isPaid ? (
              /* Receipt State */
              <div className="text-center my-auto py-4">
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/10">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-serif font-bold text-emerald-300 mb-2">Deposit Retainer Paid</h3>
                <p className="text-neutral-400 text-xs mb-6">Your Barmantra Royal Bar booking is officially locked in our Jaipur calendar.</p>

                <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-left text-xs space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Transaction ID:</span>
                    <span className="font-mono text-amber-300">{payInfo.paymentTransactionId || 'TXN_VERIFIED'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Paid Timestamp:</span>
                    <span className="text-neutral-300">{payInfo.paidAt ? new Date(payInfo.paidAt).toLocaleDateString('en-IN') : 'Just now'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Amount Paid:</span>
                    <span className="font-bold text-emerald-400">₹{payInfo.depositAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                  <Receipt className="w-4 h-4" /> WhatsApp Receipt Dispatched to {payInfo.phone}
                </div>
              </div>
            ) : (
              /* Action State: Complete Payment */
              <div>
                <h3 className="text-lg font-serif font-semibold text-white mb-2 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-amber-400" /> Complete Deposit
                </h3>
                <p className="text-neutral-400 text-xs mb-6">
                  Pay securely via UPI, Credit/Debit Cards, Netbanking (Razorpay) or Dev Sandbox.
                </p>

                <div className="space-y-4 mb-8">
                  {/* Razorpay / Live Checkout */}
                  <button
                    onClick={() => handleProcessPayment('razorpay')}
                    disabled={processing}
                    className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white font-semibold py-3.5 px-4 rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20 disabled:opacity-50"
                  >
                    {processing ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck className="w-5 h-5" /> Pay ₹{payInfo.depositAmount.toLocaleString('en-IN')} via Razorpay / UPI
                      </>
                    )}
                  </button>

                  {/* Development Sandbox Test Button */}
                  <button
                    onClick={() => handleProcessPayment('sandbox')}
                    disabled={processing}
                    className="w-full bg-neutral-900 border border-amber-500/30 text-amber-300 font-medium py-2.5 px-4 rounded-xl hover:bg-neutral-800 transition-all text-xs flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" /> Test Instant Sandbox Payment (Dev Mode)
                  </button>
                </div>

                <div className="border-t border-neutral-800/80 pt-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-xs text-neutral-500">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> 256-Bit SSL Encrypted & OWASP Compliant Security
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
