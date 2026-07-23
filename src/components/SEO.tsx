/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
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
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1572116553112-75d7767d6c51?auto=format&fit=crop&w=1200&q=80';
const SITE_NAME = 'Barmantra | Luxury Mobile Bar & Mixology Jaipur';

export function SEO({
  title,
  description,
  image = DEFAULT_IMAGE,
  url = 'https://barmantra.com',
  type = 'website',
  noindex = false,
}: SEOProps) {
  const fullTitle = title.includes('Barmantra') ? title : `${title} | Barmantra`;

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
    </Helmet>
  );
}
