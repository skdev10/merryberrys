'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import LuxuryNavbar from '@/components/LuxuryNavbar';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { formatPKR, FREE_SHIPPING_MIN_PKR, STANDARD_SHIPPING_PKR } from '@/lib/currency';
import { PRODUCT_IMAGE_FALLBACK } from '@/lib/brandAssets';

function parseImages(product) {
  try {
    return JSON.parse(product?.images || '[]');
  } catch {
    return [];
  }
}

export default function CartPage() {
  const router = useRouter();
  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCart = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cart', { credentials: 'include' });
      if (res.status === 401) {
        router.push('/login?redirect=/cart');
        return;
      }
      const data = await res.json();
      setLines(data.items || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const updateQuantity = async (lineId, delta) => {
    const line = lines.find((l) => l.id === lineId);
    if (!line) return;
    const next = Math.max(1, line.quantity + delta);
    const res = await fetch('/api/cart', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ lineId, quantity: next }),
    });
    if (res.ok) {
      const data = await res.json();
      setLines((prev) => prev.map((l) => (l.id === lineId ? data.item : l)));
    }
  };

  const removeItem = async (lineId) => {
    const res = await fetch(`/api/cart?lineId=${encodeURIComponent(lineId)}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.ok) {
      setLines((prev) => prev.filter((l) => l.id !== lineId));
    }
  };

  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_MIN_PKR ? 0 : STANDARD_SHIPPING_PKR;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-luxury-white pt-20">
      <LuxuryNavbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-serif text-center mb-8 text-luxury-black">Shopping Cart</h1>

        {loading ? (
          <div className="animate-pulse h-64 bg-luxury-cream rounded max-w-4xl mx-auto" />
        ) : lines.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag size={64} className="mx-auto mb-6 text-luxury-taupe" strokeWidth={1} />
            <h2 className="font-serif text-2xl text-luxury-black mb-4">Your cart is empty</h2>
            <p className="text-luxury-taupe mb-8">Discover our collection and add items to your cart</p>
            <Link href="/shop" className="inline-block px-8 py-4 bg-luxury-black text-luxury-white text-sm uppercase tracking-[0.15em] hover:bg-luxury-gold transition-colors">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-0">
              {lines.map((line) => {
                const imgs = parseImages(line.product);
                const img = imgs[0] || PRODUCT_IMAGE_FALLBACK;
                return (
                  <div key={line.id} className="flex gap-4 py-6 border-b border-luxury-light-gray/20">
                    <div className="relative w-24 h-32 bg-luxury-cream flex-shrink-0">
                      <Image src={img} alt={line.product.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-serif font-semibold text-lg text-luxury-black">{line.product.name}</h3>
                      <p className="text-sm text-luxury-taupe">
                        {line.size && `Size ${line.size}`}
                        {line.size && line.color ? ' · ' : ''}
                        {line.color && line.color}
                      </p>
                      <p className="text-luxury-black mt-1">{formatPKR(line.product.price)}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          type="button"
                          onClick={() => updateQuantity(line.id, -1)}
                          className="w-8 h-8 border border-luxury-light-gray/30 flex items-center justify-center hover:border-luxury-black transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm">{line.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(line.id, 1)}
                          className="w-8 h-8 border border-luxury-light-gray/30 flex items-center justify-center hover:border-luxury-black transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeItem(line.id)}
                          className="ml-auto text-red-600 hover:text-red-800 p-2"
                          aria-label="Remove"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-luxury-cream p-6 h-fit border border-luxury-light-gray/20">
              <h2 className="font-serif text-xl text-luxury-black mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-luxury-taupe">Subtotal</span>
                  <span className="text-luxury-black">{formatPKR(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-luxury-taupe">Shipping</span>
                  <span className="text-luxury-black">{shipping === 0 ? 'Free' : formatPKR(shipping)}</span>
                </div>
                <div className="flex justify-between font-serif text-lg pt-2 border-t border-luxury-light-gray/20">
                  <span className="text-luxury-black">Total</span>
                  <span className="text-luxury-black">{formatPKR(total)}</span>
                </div>
              </div>
              <Link
                href="/checkout"
                className="block w-full py-3 bg-luxury-black text-luxury-white text-center text-sm uppercase tracking-[0.12em] hover:bg-luxury-gold transition-colors"
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
