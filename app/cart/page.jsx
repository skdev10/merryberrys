'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import RemoteImg from '@/components/RemoteImg';
import LuxuryNavbar from '@/components/LuxuryNavbar';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import {
  FREE_SHIPPING_THRESHOLD,
  readCart,
  removeCartItem,
  summarizeCart,
  updateCartItemQuantity,
  writeCart,
} from '@/lib/cart';
import { formatPrice } from '@/lib/currency';
import { AUTH_CHANGED_EVENT, isLoggedIn as checkLoggedIn } from '@/lib/auth';

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [ready, setReady] = useState(false);

  const refreshCart = useCallback(() => {
    setCart(readCart());
  }, []);

  useEffect(() => {
    setLoggedIn(checkLoggedIn());
    refreshCart();
    setReady(true);

    const onAuth = () => setLoggedIn(checkLoggedIn());
    const onCart = () => refreshCart();

    window.addEventListener(AUTH_CHANGED_EVENT, onAuth);
    window.addEventListener('cart-updated', onCart);
    window.addEventListener('storage', onCart);

    return () => {
      window.removeEventListener(AUTH_CHANGED_EVENT, onAuth);
      window.removeEventListener('cart-updated', onCart);
      window.removeEventListener('storage', onCart);
    };
  }, [refreshCart]);

  const updateQuantity = (index, delta) => {
    const currentQuantity = Number(cart[index]?.quantity) || 1;
    const updatedCart = updateCartItemQuantity(cart, index, currentQuantity + delta);
    setCart(updatedCart);
    writeCart(updatedCart);
  };

  const removeItem = (index) => {
    const updatedCart = removeCartItem(cart, index);
    setCart(updatedCart);
    writeCart(updatedCart);
  };

  const handleCheckout = () => {
    if (!loggedIn) {
      setShowLoginModal(true);
      return;
    }
    router.push('/checkout');
  };

  const { subtotal, shipping, total } = summarizeCart(cart);

  if (!ready) {
    return (
      <>
        <LuxuryNavbar />
        <div className="flex min-h-screen items-center justify-center bg-luxury-white pt-32">
          <div className="text-luxury-taupe animate-pulse">Loading cart…</div>
        </div>
      </>
    );
  }

  return (
    <>
      <LuxuryNavbar />

      <main className="min-h-screen bg-luxury-white pt-32 pb-20">
        <div className="container-luxury">
          <div className="mb-12 text-center">
            <p className="text-luxury-caption mb-3 text-luxury-taupe">Your Bag</p>
            <h1 className="font-serif text-4xl text-luxury-black md:text-5xl">Shopping Cart</h1>
          </div>

          {cart.length === 0 ? (
            <div className="border border-luxury-light-gray/20 bg-luxury-cream py-20 text-center">
              <ShoppingBag size={56} className="mx-auto mb-6 text-luxury-taupe opacity-60" strokeWidth={1} />
              <h2 className="font-serif mb-4 text-2xl text-luxury-black">Your cart is empty</h2>
              <p className="mb-8 text-luxury-taupe">Discover our collection and add your favourite pieces.</p>
              <Link href="/shop" className="btn-luxury inline-flex">
                <span className="flex items-center gap-2">
                  Continue Shopping <ArrowRight size={16} />
                </span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-0">
                {cart.map((item, index) => (
                  <div
                    key={`${item.id}-${item.size}-${item.color}-${index}`}
                    className="flex gap-5 border-b border-luxury-light-gray/20 py-8"
                  >
                    <div className="relative h-32 w-24 flex-shrink-0 overflow-hidden bg-luxury-cream">
                      <RemoteImg
                        src={item.image}
                        alt={item.name}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h3 className="font-serif text-lg text-luxury-black">{item.name}</h3>
                        <p className="mt-1 text-sm text-luxury-taupe">{formatPrice(item.price)}</p>
                        {(item.size || item.color) && (
                          <p className="mt-1 text-xs text-luxury-taupe">
                            {item.size && `Size: ${item.size}`}
                            {item.size && item.color && ' · '}
                            {item.color && `Color: ${item.color}`}
                          </p>
                        )}
                      </div>
                      <div className="mt-4 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => updateQuantity(index, -1)}
                          className="flex h-9 w-9 items-center justify-center border border-luxury-light-gray/30 hover:border-luxury-gold"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="min-w-[2rem] text-center text-sm">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(index, 1)}
                          className="flex h-9 w-9 items-center justify-center border border-luxury-light-gray/30 hover:border-luxury-gold"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="ml-auto text-luxury-taupe hover:text-red-600"
                          aria-label="Remove item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="h-fit border border-luxury-light-gray/20 bg-luxury-cream p-8">
                <h2 className="font-serif mb-6 text-xl text-luxury-black">Order Summary</h2>
                <div className="mb-6 space-y-3 text-sm">
                  <div className="flex justify-between text-luxury-taupe">
                    <span>Subtotal</span>
                    <span className="text-luxury-black">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-luxury-taupe">
                    <span>Shipping</span>
                    <span className="text-luxury-black">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between border-t border-luxury-light-gray/20 pt-3 font-serif text-lg text-luxury-black">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <p className="text-xs text-luxury-taupe">
                    Free nationwide shipping above {formatPrice(FREE_SHIPPING_THRESHOLD)}.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="btn-luxury w-full"
                >
                  <span>{loggedIn ? 'Proceed to Checkout' : 'Login to Checkout'}</span>
                </button>
                <Link
                  href="/shop"
                  className="mt-4 block text-center text-xs uppercase tracking-[0.15em] text-luxury-taupe hover:text-luxury-gold"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-luxury-black/60 p-4">
          <div className="w-full max-w-md border border-luxury-light-gray/20 bg-luxury-white p-8">
            <h2 className="font-serif mb-4 text-2xl text-luxury-black">Sign in required</h2>
            <p className="mb-6 text-sm text-luxury-taupe">Please sign in to complete your checkout.</p>
            <div className="space-y-3">
              <Link
                href="/login?redirect=/checkout"
                className="btn-luxury block w-full text-center"
              >
                <span>Sign In</span>
              </Link>
              <button
                type="button"
                onClick={() => setShowLoginModal(false)}
                className="btn-luxury-outline w-full"
              >
                <span>Cancel</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
