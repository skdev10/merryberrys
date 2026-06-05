'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import LuxuryNavbar from '@/components/LuxuryNavbar';
import Footer from '@/components/Footer';
import { CheckCircle } from 'lucide-react';
import { formatPrice } from '@/lib/currency';

export default function ConfirmationPage() {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('lastOrder');
      if (raw) setOrder(JSON.parse(raw));
    } catch {
      setOrder(null);
    }
  }, []);

  const orderId = order?.id ? order.id.slice(-8).toUpperCase() : '—';
  const total = Number(order?.total) || 0;
  const paymentLabel =
    order?.paymentMethod === 'cash_on_delivery'
      ? 'Cash on Delivery'
      : order?.paymentMethod === 'digital_wallet'
        ? 'Digital Wallet'
        : 'Bank Transfer';

  return (
    <>
      <LuxuryNavbar />
      <main className="min-h-screen bg-luxury-white pt-32 pb-20">
        <div className="container-luxury max-w-2xl text-center">
          <CheckCircle size={72} className="mx-auto mb-6 text-luxury-gold" strokeWidth={1} />
          <h1 className="font-serif mb-4 text-4xl text-luxury-black md:text-5xl">Order Confirmed</h1>
          <p className="mb-10 text-luxury-taupe">
            Thank you for shopping with Merry Berry. We will process your order shortly.
          </p>

          <div className="mb-10 border border-luxury-light-gray/20 bg-luxury-cream p-8 text-left">
            <h2 className="font-serif mb-6 text-xl text-luxury-black">Order Details</h2>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between border-b border-luxury-light-gray/20 pb-3">
                <span className="text-luxury-taupe">Order ID</span>
                <span className="font-mono text-luxury-black">#{orderId}</span>
              </div>
              <div className="flex justify-between border-b border-luxury-light-gray/20 pb-3">
                <span className="text-luxury-taupe">Date</span>
                <span className="text-luxury-black">
                  {order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between border-b border-luxury-light-gray/20 pb-3">
                <span className="text-luxury-taupe">Total</span>
                <span className="font-serif text-xl text-luxury-black">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-luxury-taupe">Payment</span>
                <span className="text-luxury-black">{paymentLabel}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/shop" className="btn-luxury inline-flex">
              <span>Continue Shopping</span>
            </Link>
            <Link href="/account" className="btn-luxury-outline inline-flex">
              <span>View My Orders</span>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
