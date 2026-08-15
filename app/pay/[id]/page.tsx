'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PaymentView } from '../../../../src/components/views/PaymentView';

export default function PayPage() {
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

  return <PaymentView bookingId={bookingId} onNavigate={handleNavigate} />;
}
