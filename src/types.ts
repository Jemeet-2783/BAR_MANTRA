/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Service {
  slug: string;
  title: string;
  iconName: string; // Lucide icon name
  description: string;
  longDescription: string;
  features: string[];
  images: string[];
  timeline: {
    title: string;
    description: string;
  }[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'cocktails' | 'event-bars' | 'guest-experiences';
  image: string;
  location: string;
  date: string;
  description: string;
}

export interface Testimonial {
  id: string;
  name: string;
  eventType: string;
  rating: number;
  quote: string;
  date: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface ProcessStep {
  number: number;
  title: string;
  description: string;
  iconName: string;
}

export type PageRoute = 'home' | 'about' | 'services' | 'gallery' | 'contact' | string;
