/**
 * Barmantra — Dynamic Route Meta & Schema.org JSON-LD SEO Component
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
  noindex?: boolean;
  schema?: Record<string, any> | Record<string, any>[];
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1572116553112-75d7767d6c51?auto=format&fit=crop&w=1200&q=80';
const SITE_NAME = 'Barmantra | Luxury Mobile Bar & Mixology Jaipur';

const DEFAULT_ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://barmantra.com/#organization',
  'name': 'Barmantra Luxury Bartending & Mixology',
  'alternateName': 'Barmantra Royal Bar Services',
  'url': 'https://barmantra.com',
  'logo': 'https://images.unsplash.com/photo-1572116553112-75d7767d6c51?auto=format&fit=crop&w=600&q=80',
  'image': DEFAULT_IMAGE,
  'description': 'Boutique luxury mobile bartending, custom bar facade fabrication, and royal mixology curation in Jaipur, Rajasthan.',
  'telephone': '+91-73576-52737',
  'email': 'concierge@barmantra.com',
  'priceRange': '₹₹₹₹',
  'address': {
    '@type': 'PostalAddress',
    'streetAddress': '420 Royal Palace Road, Raja Park',
    'addressLocality': 'Jaipur',
    'addressRegion': 'Rajasthan',
    'postalCode': '302004',
    'addressCountry': 'IN'
  },
  'geo': {
    '@type': 'GeoCoordinates',
    'latitude': 26.8927,
    'longitude': 75.8267
  },
  'openingHoursSpecification': {
    '@type': 'OpeningHoursSpecification',
    'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    'opens': '00:00',
    'closes': '23:59'
  },
  'sameAs': [
    'https://www.instagram.com/barmantra',
    'https://www.facebook.com/barmantra'
  ]
};

export function SEO({
  title,
  description,
  image = DEFAULT_IMAGE,
  url = 'https://barmantra.com',
  type = 'website',
  noindex = false,
  schema,
}: SEOProps) {
  const fullTitle = title.includes('Barmantra') ? title : `${title} | Barmantra`;

  const jsonLdSchemas = schema
    ? (Array.isArray(schema) ? [DEFAULT_ORGANIZATION_SCHEMA, ...schema] : [DEFAULT_ORGANIZATION_SCHEMA, schema])
    : [DEFAULT_ORGANIZATION_SCHEMA];

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data JSON-LD Schemas */}
      {jsonLdSchemas.map((s, idx) => (
        <script key={idx} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
}
