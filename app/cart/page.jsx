'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import RemoteImg from '@/components/RemoteImg';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Lock } from 'lucide-react';
import {
  FREE_SHIPPING_THRESHOLD,
  readCart,
  removeCartItem,
  summarizeCart,
  updateCartItemQuantity,
  writeCart,
} from '@/lib/cart';
import { formatPrice } from '@/lib/currency';
import { AUTH_CHANGED_EVENT, isLoggedIn } from '@/lib/auth';

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const syncAuth = () => setIsLoggedIn(isLoggedIn());
    syncAuth();
    setCart(readCart());
    window.addEventListener(AUTH_CHANGED_EVENT, syncAuth);
    return () => window.removeEventListener(AUTH_CHANGED_EVENT, syncAuth);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-8">Shopping Cart</h1>
          <div className="animate-pulse h-64 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

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
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    router.push('/checkout');
  };

  const { subtotal, shipping, total } = summarizeCart(cart);

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag size={64} className="mx-auto mb-6 text-gray-400" />
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Discover our collection and add items to your cart</p>
            <Link href="/shop" className="inline-block px-8 py-4 bg-black text-white rounded">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {cart.map((item, index) => (
                <div key={`${item.id}-${index}`} className="flex gap-4 py-6 border-b">
                  <div className="relative w-24 h-32 bg-gray-100 flex-shrink-0">
                    <RemoteImg
                      src={item.image}
                      alt={item.name}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-gray-500">{formatPrice(item.price)}</p>
                    {(item.size || item.color) && (
                      <p className="text-sm text-gray-400 mt-1">
                        {item.size && `Size: ${item.size}`} {item.size && item.color && '|'} {item.color && `Color: ${item.color}`}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(index, -1)} className="w-8 h-8 border rounded">
                        <Minus size={14} className="mx-auto" />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(index, 1)} className="w-8 h-8 border rounded">
                        <Plus size={14} className="mx-auto" />
                      </button>
                      <button onClick={() => removeItem(index)} className="ml-auto text-red-500">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 p-6 rounded-lg h-fit">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <p className="text-xs text-gray-500">
                  Free nationwide shipping above {formatPrice(FREE_SHIPPING_THRESHOLD)}.
                </p>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-black text-white rounded"
              >
                {isLoggedIn ? 'Checkout' : 'Login to Checkout'}
              </button>
            </div>
          </div>
        )}
      </div>

      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-4">Login Required</h2>
            <p className="text-gray-600 mb-6">Please login to proceed with checkout</p>
            <div className="space-y-3">
              <Link href="/login" className="block w-full py-3 bg-black text-white text-center rounded">
                Login
              </Link>
              <button
                onClick={() => setShowLoginModal(false)}
                className="block w-full py-3 border rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
