'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X, ShoppingCart } from 'lucide-react';
import LuxuryNavbar from '@/components/LuxuryNavbar';
import Footer from '@/components/Footer';
import { formatPrice } from '@/lib/currency';
import { addCartItem } from '@/lib/cart';
import { notifyAddedToCart } from '@/lib/cartNotify';

const WISHLIST_KEY = 'merryberry_wishlist';

function readWishlist() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeWishlist(items) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
}

export default function WishlistPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(readWishlist());
  }, []);

  const removeItem = (id) => {
    const next = items.filter((item) => item.id !== id);
    setItems(next);
    writeWishlist(next);
  };

  const quickAdd = (item) => {
    addCartItem(item, {
      quantity: 1,
      size: item.sizes?.[0] || 'M',
      color: item.colors?.[0] || 'Default',
    });
    notifyAddedToCart(item.name);
  };

  return (
    <>
      <LuxuryNavbar />
      <main className="min-h-screen bg-luxury-cream text-luxury-black pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl mb-12 border-b border-luxury-black/10 pb-6">My Wishlist</h1>

          {items.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-luxury-taupe text-lg mb-6">Your wishlist is currently empty.</p>
              <Link
                href="/shop"
                className="inline-block bg-luxury-black px-8 py-3 text-luxury-cream font-medium hover:bg-luxury-gold hover:text-luxury-black transition-colors"
              >
                Explore Collection
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-xl overflow-hidden group relative border border-luxury-black/10 shadow-sm">
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    <X size={16} />
                  </button>
                  <Link href={`/product/${item.id}`} className="block h-80 overflow-hidden">
                    <img
                      src={item.image}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt={item.name}
                    />
                  </Link>
                  <div className="p-5">
                    <Link
                      href={`/product/${item.id}`}
                      className="block font-medium text-lg mb-2 hover:text-luxury-gold truncate"
                    >
                      {item.name}
                    </Link>
                    <p className="text-luxury-gold font-serif mb-4">{formatPrice(item.price)}</p>
                    <button
                      type="button"
                      onClick={() => quickAdd(item)}
                      className="w-full bg-transparent border border-luxury-black hover:bg-luxury-black hover:text-luxury-cream py-2 rounded flex items-center justify-center transition-colors"
                    >
                      <ShoppingCart size={16} className="mr-2" /> Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
