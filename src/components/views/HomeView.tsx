/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SEO } from '../SEO';
import { Hero } from '../Hero';
import { About } from '../About';
import { ServicesGrid } from '../ServicesGrid';
import { Process } from '../Process';
import { SignatureEvents } from '../SignatureEvents';
import { PortfolioGallery } from '../PortfolioGallery';
import { TestimonialsCarousel } from '../TestimonialsCarousel';
import { TeamSection } from '../TeamSection';
import { WhyBarmantra } from '../WhyBarmantra';
import { FAQAccordion } from '../FAQAccordion';
import { ContactForm } from '../ContactForm';

export function HomeView() {
  return (
    <div className="animate-fade-in">
      <SEO
        title="Barmantra | Premiere Luxury Mobile Bar & Mixology Jaipur"
        description="Barmantra is Jaipur's premiere luxury mobile bar and artisanal mixology service, specializing in royal weddings, corporate banquets, and high-end private celebrations across Rajasthan."
        url="https://barmantra.com/"
      />
      <Hero />
      <About />
      <ServicesGrid />
      <Process />
      <SignatureEvents />
      <PortfolioGallery />
      <TestimonialsCarousel />
      <TeamSection />
      <WhyBarmantra />
      <FAQAccordion />
      <ContactForm />
    </div>
  );
}
