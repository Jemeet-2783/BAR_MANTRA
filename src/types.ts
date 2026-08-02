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

export type PaymentStatus = 'Unpaid' | 'Deposit_Paid' | 'Fully_Paid' | 'Refunded';
export type PaymentGateway = 'Razorpay' | 'Stripe' | 'Sandbox';

export interface WhatsAppLogEntry {
  id: string;
  timestamp: string;
  template: 'BOOKING_CONFIRMATION' | 'ADMIN_NEW_BOOKING_ALERT' | 'PROPOSAL_APPROVED_PAYMENT_REQUEST' | 'PAYMENT_RECEIPT_CONFIRMATION' | 'CUSTOM';
  recipient: string;
  status: 'Sent' | 'Failed' | 'Simulated';
  messageSnippet: string;
}

export interface PublicPayInfo {
  id: string;
  name: string;
  phone: string;
  email: string;
  eventType: string;
  eventDate: string;
  guestCount: number;
  pricingEstimate: number;
  depositAmount: number;
  paymentStatus: PaymentStatus;
  paymentLink?: string;
  paidAt?: string;
  paymentTransactionId?: string;
  razorpayKeyId?: string;
}

export type PageRoute = 'home' | 'about' | 'services' | 'gallery' | 'contact' | 'pay' | string;

