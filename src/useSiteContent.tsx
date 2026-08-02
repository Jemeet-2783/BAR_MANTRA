/**
 * Barmantra — Site Content Context Hook
 */


import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { SERVICES, PORTFOLIO_ITEMS, TEAM, TESTIMONIALS, FAQS } from './data';
import { Service, PortfolioItem, TeamMember, Testimonial, FAQItem } from './types';

export interface SiteSettings {
  siteTitle: string;
  heroHeadline: string;
  heroSubheadline: string;
  phone: string;
  email: string;
  address: string;
  tagline: string;
  whatsappNumber: string;
}

export interface HeroSlide {
  id: string;
  image: string;
  title: string;
}

export interface SiteContentContextType {
  siteSettings: SiteSettings;
  heroSlides: HeroSlide[];
  services: Service[];
  portfolioItems: PortfolioItem[];
  team: TeamMember[];
  testimonials: Testimonial[];
  faqs: FAQItem[];
  loading: boolean;
  refreshContent: () => Promise<void>;
}

const DEFAULT_SETTINGS: SiteSettings = {
  siteTitle: 'Barmantra | Luxury Mobile Bar & Mixology Jaipur',
  heroHeadline: 'Luxury Bar Experiences',
  heroSubheadline: 'We weave royal Rajasthani heritage, modern artisanal mixology, and immaculate bar showmanship into high-end celebrations that linger in memories forever.',
  phone: '+91 98290 12345',
  email: 'concierge@barmantra.com',
  address: 'Barmantra Royal Studio, Raja Park, Jaipur, Rajasthan 302004',
  tagline: 'The Premiere Luxury Bartending Service of Jaipur',
  whatsappNumber: '+919829012345'
};

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: 'hs-1',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1920&q=80',
    title: 'Royal Wedding Bar Curation',
  },

  {
    id: 'hs-2',
    image: 'https://images.unsplash.com/photo-1575444758702-4a6b9222336e?auto=format&fit=crop&w=1920&q=80',
    title: 'Exquisite Mixology Showcase',
  },
  {
    id: 'hs-3',
    image: 'https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&w=1920&q=80',
    title: 'Heritage Palace Lounge Bar',
  },
];

const SiteContentContext = createContext<SiteContentContextType>({
  siteSettings: DEFAULT_SETTINGS,
  heroSlides: DEFAULT_SLIDES,
  services: SERVICES,
  portfolioItems: PORTFOLIO_ITEMS,
  team: TEAM,
  testimonials: TESTIMONIALS,
  faqs: FAQS,
  loading: false,
  refreshContent: async () => {},
});

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(DEFAULT_SLIDES);
  const [services, setServices] = useState<Service[]>(SERVICES);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(PORTFOLIO_ITEMS);
  const [team, setTeam] = useState<TeamMember[]>(TEAM);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(TESTIMONIALS);
  const [faqs, setFaqs] = useState<FAQItem[]>(FAQS);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/site-content');
      if (res.ok) {
        const data = await res.json();
        if (data.siteSettings) setSiteSettings(data.siteSettings);
        if (data.heroSlides && data.heroSlides.length > 0) setHeroSlides(data.heroSlides);
        if (data.services && data.services.length > 0) setServices(data.services);
        if (data.portfolioItems && data.portfolioItems.length > 0) setPortfolioItems(data.portfolioItems);
        if (data.team && data.team.length > 0) setTeam(data.team);
        if (data.testimonials && data.testimonials.length > 0) setTestimonials(data.testimonials);
        if (data.faqs && data.faqs.length > 0) setFaqs(data.faqs);
      }
    } catch (err) {
      console.error('Failed to fetch dynamic CMS content, utilizing default fallback data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  return (
    <SiteContentContext.Provider
      value={{
        siteSettings,
        heroSlides,
        services,
        portfolioItems,
        team,
        testimonials,
        faqs,
        loading,
        refreshContent: fetchContent,
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}
