'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import LuxuryNavbar from '../../../components/LuxuryNavbar';
import { CheckCircle } from 'lucide-react';
import { formatPKR } from '@/lib/currency';

function ConfirmationInner() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || '';
  const total = searchParams.get('total');

  /** Random fallback must run only on the client — server vs client Math.random breaks hydration. */
  const [fallbackRef, setFallbackRef] = useState('');
  useEffect(() => {
    if (!orderId) {
      setFallbackRef(`MB-${Math.floor(100000 + Math.random() * 900000)}`);
    }
  }, [orderId]);

  const orderLabel = orderId
    ? orderId.slice(0, 8).toUpperCase()
    : fallbackRef || '—';

  return (
    <main className="min-h-screen bg-luxury-white flex items-center justify-center pt-28 pb-20 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle size={80} className="text-luxury-gold" strokeWidth={1} />
        </div>

        <h1 className="font-serif text-4xl md:text-5xl mb-4 text-luxury-black">Order Confirmed</h1>
        <p className="text-luxury-taupe text-lg mb-10">
          Thank you for shopping with Merry Berry. You will receive a confirmation email shortly.
        </p>

        <div className="bg-luxury-cream border border-luxury-light-gray/20 p-8 mb-10 text-left">
          <h2 className="font-serif text-xl text-luxury-black mb-6">Order details</h2>
          <div className="flex justify-between border-b border-luxury-light-gray/20 pb-4 mb-4 text-sm">
            <span className="text-luxury-taupe">Order reference</span>
            <span className="font-mono text-luxury-black">{orderLabel}</span>
          </div>
          <div className="flex justify-between border-b border-luxury-light-gray/20 pb-4 mb-4 text-sm">
            <span className="text-luxury-taupe">Date</span>
            <span className="text-luxury-black" suppressHydrationWarning>
              {new Date().toLocaleDateString('en-GB')}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-luxury-taupe">Total</span>
            <span className="font-serif text-xl text-luxury-black">
              {total != null && total !== '' ? formatPKR(total) : '—'}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/shop" className="btn-luxury text-center">
            <span>Continue shopping</span>
          </Link>
          <Link href="/account" className="btn-luxury-outline text-center">
            <span>Account</span>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function ConfirmationPage() {
  return (
    <>
      <LuxuryNavbar />
      <Suspense
        fallback={
          <div className="min-h-screen bg-luxury-white pt-32 flex justify-center text-luxury-taupe">Loading…</div>
        }
      >
        <ConfirmationInner />
      </Suspense>
    </>
  );
}
