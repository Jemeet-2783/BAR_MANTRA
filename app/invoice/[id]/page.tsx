'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { InvoicePrintView } from '../../../../src/components/views/InvoicePrintView';

export default function InvoicePage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = (params?.id as string) || '';

  const handleNavigate = (route: string) => {
    if (route.startsWith('#/')) {
      const cleanPath = route.replace('#/', '/');
      router.push(cleanPath);
    } else {
      router.push(`/${route}`);
    }
  };

  return <InvoicePrintView bookingId={bookingId} onNavigate={handleNavigate} />;
}
