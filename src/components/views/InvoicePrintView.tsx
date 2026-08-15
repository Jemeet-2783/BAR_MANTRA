/**
 * Barmantra — Printable GST Quotation & Official Invoice Generator
 */

import React, { useState, useEffect } from 'react';
import { Printer, ArrowLeft, Download, ShieldCheck, CheckCircle2, Building, Calendar, Users, FileText, Phone, Mail, Sparkles, Loader2, Lock } from 'lucide-react';
import { PublicPayInfo } from '../../types';
import { BarmantraLogo } from '../BarmantraLogo';
import { SEO } from '../SEO';

interface InvoicePrintViewProps {
  bookingId: string;
  onNavigate: (route: string) => void;
}

export const InvoicePrintView: React.FC<InvoicePrintViewProps> = ({ bookingId, onNavigate }) => {
  const [payInfo, setPayInfo] = useState<PublicPayInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPayInfo();
  }, [bookingId]);

  const fetchPayInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/public/bookings/${bookingId}/pay-info`);
      if (!res.ok) {
        throw new Error('Booking quotation record not found or link expired.');
      }
      const data = await res.json();
      setPayInfo(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load booking quotation.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center py-20 px-4">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
        <p className="font-serif text-lg text-amber-200/80">Compiling Official Printable Invoice...</p>
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
          <h2 className="text-xl font-serif text-white mb-2">Invoice Not Found</h2>
          <p className="text-neutral-400 text-sm mb-6">{error || 'Booking reference ID is invalid.'}</p>
          <button
            onClick={() => onNavigate('#/lookup')}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white font-medium py-2.5 rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Booking Lookup
          </button>
        </div>
      </div>
    );
  }

  const isPaid = payInfo.paymentStatus === 'Deposit_Paid' || payInfo.paymentStatus === 'Fully_Paid';
  const totalAmount = payInfo.pricingEstimate;
  
  // Calculate itemized financial breakdown (Base 84.75% + 18% GST = 100%)
  const subtotal = Math.round(totalAmount / 1.18);
  const totalGst = totalAmount - subtotal;
  const cgst = Math.round(totalGst / 2);
  const sgst = totalGst - cgst;
  const depositAmount = payInfo.depositAmount;
  const balanceDue = isPaid ? totalAmount - depositAmount : totalAmount;

  const invoiceNo = `INV-BM-${payInfo.id.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(-8)}`;
  const invoiceDate = payInfo.paidAt ? new Date(payInfo.paidAt).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN');

  return (
    <>
      <SEO
        title={`Tax Invoice ${invoiceNo} | Barmantra Luxury Mixology`}
        description="Official Barmantra GST Invoice and Proforma Event Quotation for luxury mobile bar services."
        canonicalUrl={`https://barmantra.com/#/invoice/${bookingId}`}
      />
      <style>{`
        @media print {
          nav, footer, .no-print, header {
            display: none !important;
          }
          body {
            background-color: white !important;
            color: black !important;
          }
          .print-area {
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          .print-card {
            border: 1px solid #e5e7eb !important;
            box-shadow: none !important;
            background: white !important;
            color: black !important;
          }
          .print-text-dark {
            color: #111827 !important;
          }
        }
      `}</style>

      <div className="min-h-screen bg-neutral-950 text-neutral-100 pt-28 pb-20 px-4 sm:px-6 lg:px-8 print-area">
        <div className="max-w-4xl mx-auto">

          {/* Action Bar (Hidden during print) */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-neutral-900/80 border border-amber-500/20 rounded-2xl p-4 sm:px-6 no-print backdrop-blur-sm">
            <button
              onClick={() => onNavigate(`#/pay/${bookingId}`)}
              className="inline-flex items-center gap-2 text-neutral-400 hover:text-amber-400 text-xs font-mono uppercase tracking-widest transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Payment Portal
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-sans font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-2 shadow-lg shadow-amber-600/20 cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Print / Save PDF
              </button>
            </div>
          </div>

          {/* Printable Invoice Container */}
          <div className="bg-white text-gray-900 rounded-2xl p-6 sm:p-10 border border-gold-600/20 shadow-2xl print-card">
            
            {/* Header: Company Letterhead */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-8 mb-8 gap-6">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-maroon-950 flex items-center justify-center text-gold-400">
                    <Sparkles className="w-5 h-5 text-gold-400" />
                  </div>
                  <div>
                    <h1 className="font-serif text-2xl font-bold text-maroon-950 tracking-wide">BARMANTRA</h1>
                    <span className="font-mono text-[10px] uppercase text-gold-700 tracking-widest block font-semibold">Luxury Bartending & Mixology</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 font-sans leading-relaxed max-w-sm">
                  420 Royal Palace Road, Raja Park, Jaipur, Rajasthan 302004<br />
                  <strong>GSTIN:</strong> 08AAACB1234F1Z9 | <strong>Contact:</strong> +91 73576 52737
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="inline-block px-3 py-1 bg-maroon-950 text-gold-300 font-mono text-xs uppercase font-bold rounded-md mb-2">
                  {isPaid ? 'OFFICIAL TAX RECEIPT' : 'ROYAL PROFORMA QUOTATION'}
                </span>
                <div className="text-xs text-gray-600 space-y-1">
                  <p><strong>Document Ref:</strong> <span className="font-mono text-gray-900 font-bold">{invoiceNo}</span></p>
                  <p><strong>Issue Date:</strong> {invoiceDate}</p>
                  <p><strong>Booking Ref:</strong> <span className="font-mono text-gray-900">{payInfo.id}</span></p>
                </div>
              </div>
            </div>

            {/* Client Bill To & Event Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-50 rounded-xl p-5 border border-gray-200/80 mb-8 text-xs sm:text-sm">
              <div>
                <h3 className="font-mono text-xs uppercase text-maroon-900 font-bold tracking-wider mb-2">
                  Billed To (Client Details)
                </h3>
                <p className="font-semibold text-gray-900 text-base">{payInfo.name}</p>
                <p className="text-gray-600">Phone: {payInfo.phone}</p>
                <p className="text-gray-600">Email: {payInfo.email}</p>
              </div>

              <div>
                <h3 className="font-mono text-xs uppercase text-maroon-900 font-bold tracking-wider mb-2">
                  Event Curation Specifications
                </h3>
                <p className="text-gray-900 capitalize font-medium"><strong>Experience:</strong> {payInfo.eventType.replace('-', ' ')}</p>
                <p className="text-gray-900"><strong>Target Date:</strong> {payInfo.eventDate}</p>
                <p className="text-gray-900"><strong>Guest Count:</strong> {payInfo.guestCount} Guests</p>
              </div>
            </div>

            {/* Itemized Services Table */}
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-maroon-900 bg-maroon-950 text-gold-300 font-serif">
                    <th className="py-3 px-4 rounded-tl-lg">Description of Services</th>
                    <th className="py-3 px-4 text-center">Qty / Guests</th>
                    <th className="py-3 px-4 text-right rounded-tr-lg">Amount (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-700">
                  <tr>
                    <td className="py-4 px-4">
                      <strong className="text-gray-900 block font-sans">Master Mixologist & Beverage Curation Team</strong>
                      <span className="text-xs text-gray-500 font-light">Lead mixologists, signature cocktail menu design, molecular smoke infusion tools, & flair bartending execution.</span>
                    </td>
                    <td className="py-4 px-4 text-center">{payInfo.guestCount} Pax</td>
                    <td className="py-4 px-4 text-right font-mono font-medium">₹{Math.round(subtotal * 0.50).toLocaleString('en-IN')}</td>
                  </tr>

                  <tr>
                    <td className="py-4 px-4">
                      <strong className="text-gray-900 block font-sans">Bespoke Mobile Bar Facade Fabrication & Logistics</strong>
                      <span className="text-xs text-gray-500 font-light">Royal Rajasthani carved facade bar counter, LED back-bar display, transport & workshop assembly in Jaipur.</span>
                    </td>
                    <td className="py-4 px-4 text-center">1 Unit</td>
                    <td className="py-4 px-4 text-right font-mono font-medium">₹{Math.round(subtotal * 0.35).toLocaleString('en-IN')}</td>
                  </tr>

                  <tr>
                    <td className="py-4 px-4">
                      <strong className="text-gray-900 block font-sans">Artisanal Crystal Glassware & Botanical Infusion Curation</strong>
                      <span className="text-xs text-gray-500 font-light">Custom glassware pairing, crystal clear ice blocks, organic botanical cordials, gold-leaf garnishes.</span>
                    </td>
                    <td className="py-4 px-4 text-center">Included</td>
                    <td className="py-4 px-4 text-right font-mono font-medium">₹{Math.round(subtotal * 0.15).toLocaleString('en-IN')}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Financial Summary Calculation */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-t border-gray-200 pt-6 mb-8">
              
              {/* Payment Details / Bank Details */}
              <div className="w-full sm:w-1/2 bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs">
                <h4 className="font-mono uppercase font-bold text-maroon-950 mb-2">Banking Details for Retainer Settlement</h4>
                <div className="space-y-1 text-gray-700 font-mono">
                  <p><strong>Bank:</strong> HDFC Bank, Raja Park Branch, Jaipur</p>
                  <p><strong>A/C Name:</strong> Barmantra Luxury Bartending Services</p>
                  <p><strong>A/C No:</strong> 50200088991122</p>
                  <p><strong>IFSC Code:</strong> HDFC0000420</p>
                  <p><strong>UPI ID:</strong> barmantra@hdfcbank</p>
                </div>
              </div>

              {/* Totals Table */}
              <div className="w-full sm:w-1/2 space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between text-gray-600 font-mono">
                  <span>Subtotal (Base Value):</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-600 font-mono">
                  <span>CGST (9%):</span>
                  <span>₹{cgst.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-600 font-mono">
                  <span>SGST (9%):</span>
                  <span>₹{sgst.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-base font-serif font-bold text-maroon-950 pt-2 border-t border-gray-300">
                  <span>Total Locked Quote Estimate:</span>
                  <span className="font-mono text-lg text-maroon-900">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-xs font-mono font-bold text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
                  <span>Required 30% Retainer Deposit:</span>
                  <span>₹{depositAmount.toLocaleString('en-IN')}</span>
                </div>

                {isPaid && (
                  <div className="flex justify-between text-xs font-mono font-bold text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                    <span>Retainer Deposit Paid ({payInfo.paymentTransactionId || 'TXN_VERIFIED'}):</span>
                    <span>-₹{depositAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm font-serif font-bold text-gray-900 pt-2 border-t border-gray-300">
                  <span>Estimated Balance Due:</span>
                  <span className="font-mono text-base text-gray-900">₹{balanceDue.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Terms Footer & Authorized Signatory */}
            <div className="border-t border-gray-200 pt-6 text-[11px] text-gray-500 font-light flex flex-col sm:flex-row justify-between items-end gap-6">
              <div className="max-w-md space-y-1">
                <p className="font-bold text-gray-700 uppercase font-mono">Terms & Retainer Policy:</p>
                <p>1. The 30% retainer deposit locks your date and mobile bar fabrication schedule in Jaipur.</p>
                <p>2. Retainer deposits are transferable to alternate dates within a 12-month calendar window.</p>
                <p>3. Per State Excise laws, actual liquor permits and alcohol procurement remain client responsibility.</p>
              </div>

              <div className="text-center sm:text-right border-t sm:border-t-0 pt-4 sm:pt-0 w-full sm:w-auto">
                <div className="font-serif font-bold italic text-maroon-950 text-base mb-1">Barmantra Studio Jaipur</div>
                <div className="w-32 h-0.5 bg-gold-600 ml-auto mb-1"></div>
                <p className="font-mono text-[10px] uppercase text-gray-400">Authorized Signatory & Stamp</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </>
  );
};
