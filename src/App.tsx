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

const PrivacyView = lazy(() => import('./components/views/PrivacyView').then(m => ({ default: m.PrivacyView })));
const TermsView = lazy(() => import('./components/views/TermsView').then(m => ({ default: m.TermsView })));
const BookingLookupView = lazy(() => import('./components/views/BookingLookupView').then(m => ({ default: m.BookingLookupView })));
const InvoicePrintView = lazy(() => import('./components/views/InvoicePrintView').then(m => ({ default: m.InvoicePrintView })));

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
      case 'invoice':
        return <InvoicePrintView bookingId={bookingId || ''} onNavigate={navigateTo} />;
      case 'lookup':
      case '/lookup':
        return <BookingLookupView />;
      case 'services/detail':
        return <ServicesDetailView slug={serviceSlug || ''} />;

      // Dynamic Privacy Policy and Terms of Royal Engagement views
      case 'privacy':
      case '/privacy':
        return <PrivacyView />;

      case 'terms':
      case '/terms':
        return <TermsView />;

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
