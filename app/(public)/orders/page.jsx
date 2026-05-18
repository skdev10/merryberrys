'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isLoggedIn } from '@/lib/auth';

/** Track orders — logged-in users go to account order history (database-backed). */
export default function OrdersRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn()) {
      router.replace('/account');
    } else {
      router.replace('/login?redirect=/account');
    }
  }, [router]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center text-luxury-taupe">
      Redirecting…
    </div>
  );
}
