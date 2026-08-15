import React from 'react';
import type { Metadata } from 'next';
import { Inter, Cinzel, Playfair_Display } from 'next/font/google';
import '../src/index.css';
import { Navbar } from '../src/components/Navbar';
import { NewsletterCTA } from '../src/components/NewsletterCTA';
import { Footer } from '../src/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Barmantra | Luxury Mobile Bar & Mixology Jaipur',
  description: 'Boutique luxury mobile bartending, custom bar facade fabrication, and royal mixology curation for palace weddings and galas in Jaipur, Rajasthan.',
  openGraph: {
    title: 'Barmantra | Luxury Mobile Bar & Mixology Jaipur',
    description: 'Boutique luxury mobile bartending, custom bar facade fabrication, and royal mixology curation in Jaipur.',
    url: 'https://barmantra.com',
    siteName: 'Barmantra',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1572116553112-75d7767d6c51?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Barmantra Royal Mixology Experience',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Barmantra | Luxury Mobile Bar Services',
    description: 'Boutique luxury mobile bartending, custom bar facade fabrication, and royal mixology curation in Jaipur.',
    images: ['https://images.unsplash.com/photo-1572116553112-75d7767d6c51?auto=format&fit=crop&w=1200&q=80'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${cinzel.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col justify-between bg-ivory-50 text-maroon-950 antialiased selection:bg-gold-500 selection:text-maroon-950">
        <Navbar />
        <main className="flex-grow pt-16">
          {children}
        </main>
        <NewsletterCTA />
        <Footer />
      </body>
    </html>
  );
}
