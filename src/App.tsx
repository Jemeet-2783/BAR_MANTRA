/**
 * Barmantra — Root Application View Component
 */


import React, { Suspense, lazy } from 'react';
import { useHashRoute } from './useHashRoute';
import { Navbar } from './components/Navbar';
import { NewsletterCTA } from './components/NewsletterCTA';
import { Footer } from './components/Footer';
import { Star, Shield, ArrowLeft, Loader2 } from 'lucide-react';

const HomeView = lazy(() => import('./components/views/HomeView').then(m => ({ default: m.HomeView })));
const AboutView = lazy(() => import('./components/views/AboutView').then(m => ({ default: m.AboutView })));
const GalleryView = lazy(() => import('./components/views/GalleryView').then(m => ({ default: m.GalleryView })));
const ServicesDetailView = lazy(() => import('./components/views/ServicesDetailView').then(m => ({ default: m.ServicesDetailView })));
const ContactView = lazy(() => import('./components/views/ContactView').then(m => ({ default: m.ContactView })));
const AdminView = lazy(() => import('./components/views/AdminView').then(m => ({ default: m.AdminView })));
const ServicesView = lazy(() => import('./components/views/ServicesView').then(m => ({ default: m.ServicesView })));
const PaymentView = lazy(() => import('./components/views/PaymentView').then(m => ({ default: m.PaymentView })));

export default function App() {
  const { currentRoute, serviceSlug, bookingId, navigateTo } = useHashRoute();

  // Route selector to render proper page
  const renderCurrentView = () => {
    switch (currentRoute) {
      case 'home':
        return <HomeView />;
      case 'about':
        return <AboutView />;
      case 'gallery':
        return <GalleryView />;
      case 'services':
        return <ServicesView />;
      case 'contact':
        return <ContactView />;
      case 'admin':
        return <AdminView />;
      case 'pay':
        return <PaymentView bookingId={bookingId || ''} onNavigate={navigateTo} />;
      case 'services/detail':
        return <ServicesDetailView slug={serviceSlug || ''} />;

      
      // Fallback for Privacy Policy and Terms of Service hash routes
      case 'privacy':
      case '/privacy':
        return (
          <div className="pt-32 pb-24 max-w-4xl mx-auto px-4">
            <button
              onClick={() => navigateTo('#/')}
              className="inline-flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-widest text-maroon-900 hover:text-gold-700 transition-colors mb-6 cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Back to Home</span>
            </button>
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gold-600/10 shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-maroon-900 flex items-center justify-center text-gold-400 mb-6">
                <Shield size={22} />
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl text-maroon-950 font-bold mb-4">
                Privacy Protocol
              </h1>
              <span className="font-mono text-xs uppercase text-gold-700 tracking-wider block mb-6">
                Effective: July 2026
              </span>
              <div className="font-sans text-sm sm:text-base text-gray-700 leading-relaxed font-light space-y-4">
                <p>
                  At <strong>Barmantra</strong>, based in Raja Park, Jaipur, we take the confidentiality of your personal, logistical, and bar booking specifications with absolute seriousness.
                </p>
                <p>
                  We collect your Name, Phone, Email, and Event Specifications exclusively to curate your customized design schedule. We do not distribute, lease, or trade your personal information to external commercial syndicates or third-party advertisers. All vendor communication is governed under strict non-disclosure parameters.
                </p>
                <p>
                  For deep inquiries regarding your data security, please contact our privacy compliance desk at <strong>privacy@barmantra.com</strong>.
                </p>
              </div>
            </div>
          </div>
        );

      case 'terms':
      case '/terms':
        return (
          <div className="pt-32 pb-24 max-w-4xl mx-auto px-4">
            <button
              onClick={() => navigateTo('#/')}
              className="inline-flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-widest text-maroon-900 hover:text-gold-700 transition-colors mb-6 cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Back to Home</span>
            </button>
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gold-600/10 shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-maroon-900 flex items-center justify-center text-gold-400 mb-6">
                <Shield size={22} />
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl text-maroon-950 font-bold mb-4">
                Terms of Royal Engagement
              </h1>
              <span className="font-mono text-xs uppercase text-gold-700 tracking-wider block mb-6">
                Effective: July 2026
              </span>
              <div className="font-sans text-sm sm:text-base text-gray-700 leading-relaxed font-light space-y-4">
                <p>
                  All curation engagements executed by <strong>Barmantra</strong> are governed under formal bilateral contracts. 
                </p>
                <p>
                  <strong>Deposits & Booking:</strong> To secure a date range within our Jaipur fabrication workshop, an initial retainer deposit is required. Retainers are non-refundable but fully transferable to alternate dates within a 12-month calendar window, subject to palace venue availability.
                </p>
                <p>
                  <strong>Accounting Integrity:</strong> In accordance with our open-ledger policy, all actual vendor prices are passed directly to clients. Technical specifications and stage blueprints are proprietary artistic creations of Barmantra and may not be distributed without design licenses.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="pt-32 pb-24 text-center max-w-md mx-auto px-4">
            <div className="w-16 h-16 bg-maroon-900 rounded-full flex items-center justify-center text-gold-400 mx-auto mb-6 shadow-md">
              <Star size={28} />
            </div>
            <h1 className="font-serif text-3xl text-maroon-950 font-bold mb-2">
              Route Not Found
            </h1>
            <p className="font-sans text-gray-600 text-sm mb-6 font-light">
              We could not compile this route path. Please let our concierge guide you back.
            </p>
            <button
              onClick={() => navigateTo('#/')}
              className="px-6 py-2 rounded-full bg-maroon-900 text-gold-400 font-sans font-bold text-xs shadow-md hover:bg-maroon-800 transition-colors cursor-pointer"
            >
              Return Home
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-ivory-50 text-maroon-950 antialiased selection:bg-gold-500 selection:text-maroon-950">
      {/* Sticky navigation header */}
      <Navbar />

      {/* Main viewport */}
      <main className="flex-grow">
        <Suspense
          fallback={
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-12">
              <Loader2 className="w-10 h-10 text-gold-600 animate-spin mb-4" />
              <span className="font-mono text-xs uppercase tracking-widest text-maroon-900 font-bold">
                Loading Barmantra Royal Experience...
              </span>
            </div>
          }
        >
          {renderCurrentView()}
        </Suspense>
      </main>

      {/* Newsletter signup & direct callback callout */}
      <NewsletterCTA />

      {/* Global footer & Persistent floating WhatsApp widget */}
      <Footer />
    </div>
  );
}
