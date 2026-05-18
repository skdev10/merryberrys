'use client';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { formatPrice } from '@/lib/currency';

export default function ConfirmationPage() {
  const orderNumber = `MB-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center pt-10 pb-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          
          <div className="flex justify-center mb-6">
            <CheckCircle size={80} className="text-berry-500" />
          </div>
          
          <h1 className="font-serif text-5xl mb-4 text-gold-400">Order Confirmed!</h1>
          <p className="text-zinc-400 text-lg mb-8">Thank you for shopping with Merry Berry. Your premium fashion is on its way.</p>
          
          <div className="bg-zinc-900 border border-white/10 rounded-xl p-8 mb-10 text-left">
            <h2 className="text-lg font-medium mb-4">Order Details</h2>
            <div className="flex justify-between border-b border-zinc-800 pb-4 mb-4">
              <span className="text-zinc-400">Order Number</span>
              <span className="font-mono text-white">{orderNumber}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800 pb-4 mb-4">
              <span className="text-zinc-400">Date</span>
              <span className="text-white">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800 pb-4 mb-4">
              <span className="text-zinc-400">Total Amount</span>
              <span className="text-white font-serif text-xl">{formatPrice(0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Payment Method</span>
              <span className="text-white">Payment confirmation sent</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/shop" className="px-8 py-4 bg-berry-600 hover:bg-berry-500 rounded font-medium transition shadow-lg inline-block">
              Continue Shopping
            </Link>
            <Link href="/account" className="px-8 py-4 bg-zinc-800 hover:bg-zinc-700 rounded font-medium transition shadow-lg inline-block text-white">
              View Order in Account
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
