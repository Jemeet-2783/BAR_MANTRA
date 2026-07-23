/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';
import { reportErrorAlert } from '../utils/monitoring';

const enquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  phone: z.string().regex(/^[0-9+\s-]{10,15}$/, 'Enter a valid phone number (10-15 digits).'),
  email: z.string().email('Please enter a valid email address.'),
  eventType: z.string().min(1, 'Please select an event type.'),
  eventDate: z.string().min(1, 'Please select an event date.'),
  guestCount: z.string()
    .min(1, 'Please specify guest count.')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Guest count must be a positive number.',
    }),
  message: z.string().min(10, 'Message must be at least 10 characters.'),
});

type EnquiryFormValues = z.infer<typeof enquirySchema>;

export function ContactForm() {
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [submissionError, setSubmissionError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryFormValues>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      eventType: '',
      eventDate: '',
      guestCount: '',
      message: '',
    }
  });

  React.useEffect(() => {
    const hashParts = window.location.hash.split('?');
    if (hashParts.length > 1) {
      const params = new URLSearchParams(hashParts[1]);
      const pkg = params.get('package') || '';
      const guests = params.get('guests') || '';
      const drink = params.get('drink') || '';
      const base = params.get('base') || '';
      
      let prefilledEventType = '';
      if (pkg === 'heritage') prefilledEventType = 'private-bar';
      else if (pkg === 'imperial') prefilledEventType = 'wedding-bar';
      else if (pkg === 'maharaja') prefilledEventType = 'wedding-bar';
      else if (base) {
        if (base.toLowerCase() === 'gin' || base.toLowerCase() === 'vodka') {
          prefilledEventType = 'flair-bar';
        } else {
          prefilledEventType = 'private-bar';
        }
      }
      
      let prefilledMessage = '';
      if (drink) {
        prefilledMessage = `We would love to incorporate your bespoke AI-concocted cocktail "${decodeURIComponent(drink)}" (Base Spirit: ${base}) into our celebration menu. Please share any additional specifications here!`;
      } else if (pkg) {
        prefilledMessage = `I am interested in securing a luxury booking with Barmantra's custom "${pkg.toUpperCase()}" package curation tier. Please share availability details!`;
      }
      
      reset({
        name: '',
        phone: '',
        email: '',
        eventType: prefilledEventType,
        eventDate: '',
        guestCount: guests || '',
        message: prefilledMessage,
      });
    }
  }, [reset]);

  const onSubmit = async (data: EnquiryFormValues) => {
    setSubmissionError('');
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const resData = await response.json();
      
      if (response.ok) {
        setIsSubmitSuccess(true);
        reset();
      } else {
        const errorMsg = resData.error || 'Failed to submit booking specifications.';
        setSubmissionError(errorMsg);
        reportErrorAlert({
          source: 'public_form',
          action: 'booking_submission',
          error: errorMsg,
          context: { email: data.email, eventType: data.eventType, guestCount: data.guestCount }
        });
      }
    } catch (error: any) {
      const errorMsg = error.message || 'Unable to connect to the Barmantra Full-Stack API.';
      console.error('Submission error:', error);
      setSubmissionError('Unable to connect to the Barmantra Full-Stack API.');
      reportErrorAlert({
        source: 'public_form',
        action: 'booking_submission_network',
        error: errorMsg,
        context: { email: data.email }
      });
    }
  };

  return (
    <section id="contact-section" className="relative py-24 bg-ivory-50 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-jaali-pattern opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold-800 mb-2 block">
            Initiate the Ritual
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-maroon-950 font-medium tracking-tight mb-4">
            Begin Your <span className="italic text-maroon-700">Magical Journey</span>
          </h2>
          <div className="w-24 h-[1px] bg-gold-600 mx-auto my-4" />
          <p className="font-sans text-sm sm:text-base text-gray-600 leading-relaxed font-light">
            Whether planning an intimate golden milestone celebration or a grand 3-day royal wedding, share your specifications and let us craft the formula.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
          
          {/* LEFT: Contact & Enquiry Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-gold-600/10 shadow-xl flex flex-col justify-center">
            
            {isSubmitSuccess ? (
              <div className="text-center py-10 animate-scale-in">
                <div className="w-20 h-20 bg-maroon-900 rounded-full flex items-center justify-center text-gold-400 mx-auto mb-6 shadow-md">
                  <CheckCircle size={44} />
                </div>
                <h3 className="font-serif text-3xl text-maroon-950 font-semibold mb-3">
                  Mantra Received!
                </h3>
                <p className="font-sans text-gray-600 max-w-md mx-auto mb-8 font-light">
                  Thank you for sharing your vision. Our Chief Event Producer and creative designers will review your specs and connect via call or WhatsApp within the next <strong>4 business hours</strong>.
                </p>
                <button
                  onClick={() => setIsSubmitSuccess(false)}
                  className="px-6 py-2.5 rounded-full border border-maroon-900 text-maroon-900 font-sans font-bold text-sm hover:bg-maroon-900 hover:text-gold-400 transition-colors cursor-pointer"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                {submissionError && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start space-x-2.5 font-sans animate-shake">
                    <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                    <span>{submissionError}</span>
                  </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name field */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-maroon-950 mb-1.5 font-bold">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      {...register('name')}
                      placeholder="e.g. Aditya Singhania"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold-600 focus:ring-1 focus:ring-gold-500 bg-ivory-50/50 outline-none text-sm transition-all placeholder:text-gray-500"
                    />
                    {errors.name && (
                      <p className="text-red-600 text-xs mt-1 font-sans font-medium">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Phone field */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-maroon-950 mb-1.5 font-bold">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      {...register('phone')}
                      placeholder="e.g. +91 98290 12345"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold-600 focus:ring-1 focus:ring-gold-500 bg-ivory-50/50 outline-none text-sm transition-all placeholder:text-gray-500"
                    />
                    {errors.phone && (
                      <p className="text-red-600 text-xs mt-1 font-sans font-medium">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Email field */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-maroon-950 mb-1.5 font-bold">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      {...register('email')}
                      placeholder="e.g. aditya@gmail.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold-600 focus:ring-1 focus:ring-gold-500 bg-ivory-50/50 outline-none text-sm transition-all placeholder:text-gray-500"
                    />
                    {errors.email && (
                      <p className="text-red-600 text-xs mt-1 font-sans font-medium">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Event Type */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-maroon-950 mb-1.5 font-bold">
                      Desired Service *
                    </label>
                    <select
                      {...register('eventType')}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold-600 focus:ring-1 focus:ring-gold-500 bg-ivory-50/50 outline-none text-sm transition-all cursor-pointer"
                    >
                      <option value="">Select Service Scope...</option>
                      <option value="wedding-bar">Royal Wedding Bar Curation</option>
                      <option value="corporate-bar">Corporate Lounge & Brand Bars</option>
                      <option value="private-bar">Private Parties & Craft Cocktail Bars</option>
                      <option value="bar-styling">Mobile Bar Styling & Themes</option>
                      <option value="flair-bar">Flair Bartending & Bar Shows</option>
                      <option value="other">Other Bespoke Curation</option>
                    </select>
                    {errors.eventType && (
                      <p className="text-red-600 text-xs mt-1 font-sans font-medium">{errors.eventType.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Event Date */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-maroon-950 mb-1.5 font-bold">
                      Target Date *
                    </label>
                    <input
                      type="date"
                      {...register('eventDate')}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold-600 focus:ring-1 focus:ring-gold-500 bg-ivory-50/50 outline-none text-sm transition-all cursor-pointer"
                    />
                    {errors.eventDate && (
                      <p className="text-red-600 text-xs mt-1 font-sans font-medium">{errors.eventDate.message}</p>
                    )}
                  </div>

                  {/* Guest Count */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-maroon-950 mb-1.5 font-bold">
                      Approx. Guest Count *
                    </label>
                    <input
                      type="number"
                      {...register('guestCount')}
                      placeholder="e.g. 250"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold-600 focus:ring-1 focus:ring-gold-500 bg-ivory-50/50 outline-none text-sm transition-all placeholder:text-gray-500"
                    />
                    {errors.guestCount && (
                      <p className="text-red-600 text-xs mt-1 font-sans font-medium">{errors.guestCount.message}</p>
                    )}
                  </div>
                </div>

                {/* Message / Details */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-maroon-950 mb-1.5 font-bold">
                    Describe Your Vision *
                  </label>
                  <textarea
                    rows={4}
                    {...register('message')}
                    placeholder="Provide details about the location, vibe, and any specific custom elements you'd like to integrate..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold-600 focus:ring-1 focus:ring-gold-500 bg-ivory-50/50 outline-none text-sm transition-all resize-none"
                  />
                  {errors.message && (
                    <p className="text-red-600 text-xs mt-1 font-sans font-medium">{errors.message.message}</p>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-gold-600 to-gold-500 text-maroon-950 hover:from-gold-500 hover:to-gold-400 font-sans font-bold text-base shadow-md transform active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">Analyzing Specifications...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Royal Inquiry</span>
                    </>
                  )}
                </button>

              </form>
            )}

          </div>

          {/* RIGHT: Info Block and Interactive Google Map */}
          <div className="lg:col-span-5 bg-maroon-950 text-ivory-100 rounded-3xl p-6 sm:p-10 border border-gold-500/20 shadow-xl flex flex-col justify-between">
            
            {/* Info details */}
            <div className="space-y-6">
              <h3 className="font-serif text-2xl text-gold-400 font-medium">
                Jaipur Design Studio
              </h3>

              {/* Address block */}
              <div className="flex items-start space-x-4">
                <MapPin className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-mono text-[10px] uppercase tracking-wider text-gold-500 font-bold">
                    Location Address
                  </h4>
                  <p className="font-sans text-sm text-ivory-200 mt-1 leading-relaxed">
                    D-45, Raja Park, Jaipur,<br />Rajasthan 302020, India
                  </p>
                </div>
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start space-x-4">
                  <Phone className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-mono text-[10px] uppercase tracking-wider text-gold-500 font-bold">
                      Direct Hotline
                    </h4>
                    <a href="tel:+919829012345" className="font-sans text-sm text-ivory-200 mt-1 block hover:text-gold-400 transition-colors">
                      +91 98290 12345
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Mail className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-mono text-[10px] uppercase tracking-wider text-gold-500 font-bold">
                      Email Concierge
                    </h4>
                    <a href="mailto:plan@barmantra.com" className="font-sans text-sm text-ivory-200 mt-1 block hover:text-gold-400 transition-colors">
                      plan@barmantra.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="flex items-start space-x-4">
                <Clock className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-mono text-[10px] uppercase tracking-wider text-gold-500 font-bold">
                    Business Hours
                  </h4>
                  <p className="font-sans text-sm text-ivory-200 mt-1">
                    Monday – Saturday: 10:00 AM – 7:00 PM (IST)
                  </p>
                </div>
              </div>

              {/* WhatsApp direct chat CTA */}
              <div className="pt-2">
                <a
                  href="https://wa.me/919829012345?text=Hello%20Barmantra,%20I%20would%20like%20to%20enquire%20about%20booking%20a%20luxury%20bar%20experience."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2.5 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-xs font-bold shadow-md transition-colors cursor-pointer"
                >
                  <MessageSquare size={16} />
                  <span>Start Live WhatsApp Chat</span>
                </a>
              </div>
            </div>

            {/* Embedded Interactive Map */}
            <div className="mt-8">
              <div className="w-full h-44 rounded-2xl overflow-hidden border border-gold-500/20 shadow-md">
                <iframe
                  title="Barmantra Office Map Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3558.1189476088276!2d75.82869181146399!3d26.899712060377048!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db664fa414349%3A0xb35fc9fe01460e0a!2sD-45%2C%20Raja%20Park%2C%20Jaipur%2C%20Rajasthan%20302020%2C%20India!5e0!3m2!1sen!2sus!4v1710000000000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400/80">
                  Raja Park Business Block
                </span>
                <a
                  href="https://maps.google.com/?q=Barmantra+D-45+Raja+Park+Jaipur"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 text-xs font-mono font-bold uppercase tracking-wider text-gold-400 hover:text-gold-300 transition-colors"
                >
                  <span>Get Directions</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
