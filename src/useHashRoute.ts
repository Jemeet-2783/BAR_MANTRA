/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { PageRoute } from './types';

export function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash || '#/');
      // Scroll to top on navigation
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const navigateTo = (path: string) => {
    window.location.hash = path;
  };

  // Parsing the current page path
  // #/ -> home
  // #/about -> about
  // #/gallery -> gallery
  // #/contact -> contact
  // #/services/wedding-planning -> service slug
  let currentRoute: PageRoute = 'home';
  let serviceSlug: string | null = null;

  const cleanHash = hash.replace(/^#/, '');

  if (cleanHash === '/' || cleanHash === '') {
    currentRoute = 'home';
  } else if (cleanHash === '/about') {
    currentRoute = 'about';
  } else if (cleanHash === '/gallery') {
    currentRoute = 'gallery';
  } else if (cleanHash === '/services') {
    currentRoute = 'services';
  } else if (cleanHash === '/contact') {
    currentRoute = 'contact';
  } else if (cleanHash === '/admin') {
    currentRoute = 'admin';
  } else if (cleanHash.startsWith('/services/')) {
    currentRoute = 'services/detail';
    serviceSlug = cleanHash.replace('/services/', '');
  }

  return {
    hash,
    currentRoute,
    serviceSlug,
    navigateTo,
  };
}
