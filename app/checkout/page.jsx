'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import LuxuryNavbar from '../../components/LuxuryNavbar';
import { Check, Truck, CreditCard, ShieldCheck, ChevronRight } from 'lucide-react';
import { formatPKR, FREE_SHIPPING_MIN_PKR, STANDARD_SHIPPING_PKR } from '@/lib/currency';
import { PRODUCT_IMAGE_FALLBACK } from '@/lib/brandAssets';

function parseImages(product) {
  try {
    return JSON.parse(product?.images || '[]');
  } catch {
    return [];
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cartLines, setCartLines] = useState([]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'US',
    phone: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const loadCart = useCallback(async () => {
    setLoading(true);
    try {
      const meRes = await fetch('/api/auth/me', { credentials: 'include' });
      const meData = await meRes.json();
      if (!meData.user) {
        router.push('/login?redirect=/checkout');
        return;
      }
      setFormData((prev) => ({ ...prev, email: meData.user.email || '' }));

      const cartRes = await fetch('/api/cart', { credentials: 'include' });
      if (!cartRes.ok) {
        router.push('/cart');
        return;
      }
      const cartData = await cartRes.json();
      const items = cartData.items || [];
      if (items.length === 0) {
        router.push('/cart');
        return;
      }
      setCartLines(items);
    } catch {
      router.push('/cart');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          paymentMethod: 'card',
          shipping: {
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            city: formData.city,
            postalCode: formData.postalCode,
            country: formData.country,
            phone: formData.phone,
          },
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.message || 'Order failed');
        return;
      }

      const data = await res.json();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('gocart-cart'));
      }
      router.push(`/confirmation?orderId=${encodeURIComponent(data.orderId)}&total=${encodeURIComponent(String(data.total))}`);
    } catch {
      alert('Something went wrong');
    }
  };

  const subtotal = cartLines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_MIN_PKR ? 0 : STANDARD_SHIPPING_PKR;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <>
        <LuxuryNavbar />
        <div className="pt-32 pb-20 bg-luxury-white min-h-screen flex items-center justify-center">
          <div className="text-luxury-taupe">Loading checkout…</div>
        </div>
      </>
    );
  }

  return (
    <>
      <LuxuryNavbar />

      <main className="pt-32 pb-20 bg-luxury-white min-h-screen">
        <div className="container-luxury">
          <div className="text-center mb-12">
            <p className="text-luxury-caption text-luxury-taupe mb-4">Secure Checkout</p>
            <h1 className="text-luxury-subheading text-luxury-black">Complete Your Order</h1>
          </div>

          <div className="flex justify-center mb-12">
            <div className="flex items-center gap-4 flex-wrap justify-center">
              {['Information', 'Shipping', 'Payment'].map((label, index) => (
                <div key={label} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                      step > index + 1
                        ? 'bg-luxury-gold text-luxury-white'
                        : step === index + 1
                          ? 'bg-luxury-black text-luxury-white'
                          : 'bg-luxury-cream text-luxury-taupe'
                    }`}
                  >
                    {step > index + 1 ? <Check size={18} /> : index + 1}
                  </div>
                  <span className={`ml-2 text-sm ${step >= index + 1 ? 'text-luxury-black' : 'text-luxury-taupe'}`}>
                    {label}
                  </span>
                  {index < 2 && <ChevronRight size={16} className="mx-4 text-luxury-taupe" />}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-8">
                {step === 1 && (
                  <div className="bg-luxury-cream p-8">
                    <h2 className="font-serif text-xl text-luxury-black mb-6">Contact Information</h2>
                    <div>
                      <label className="block text-xs uppercase tracking-[0.15em] text-luxury-taupe mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-luxury-white border border-luxury-light-gray/20 text-luxury-black focus:outline-none focus:border-luxury-gold transition-colors"
                        required
                      />
                    </div>
                  </div>
                )}

                {(step === 1 || step === 2) && (
                  <div className="bg-luxury-cream p-8">
                    <h2 className="font-serif text-xl text-luxury-black mb-6">Shipping Address</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-[0.15em] text-luxury-taupe mb-2">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-luxury-white border border-luxury-light-gray/20 text-luxury-black focus:outline-none focus:border-luxury-gold transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-[0.15em] text-luxury-taupe mb-2">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-luxury-white border border-luxury-light-gray/20 text-luxury-black focus:outline-none focus:border-luxury-gold transition-colors"
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs uppercase tracking-[0.15em] text-luxury-taupe mb-2">Address</label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-luxury-white border border-luxury-light-gray/20 text-luxury-black focus:outline-none focus:border-luxury-gold transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-[0.15em] text-luxury-taupe mb-2">City</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-luxury-white border border-luxury-light-gray/20 text-luxury-black focus:outline-none focus:border-luxury-gold transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-[0.15em] text-luxury-taupe mb-2">Postal Code</label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-luxury-white border border-luxury-light-gray/20 text-luxury-black focus:outline-none focus:border-luxury-gold transition-colors"
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs uppercase tracking-[0.15em] text-luxury-taupe mb-2">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-luxury-white border border-luxury-light-gray/20 text-luxury-black focus:outline-none focus:border-luxury-gold transition-colors"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="bg-luxury-cream p-8">
                    <h2 className="font-serif text-xl text-luxury-black mb-6">Payment Information</h2>
                    <p className="text-sm text-luxury-taupe mb-6">
                      Demo checkout — card details are not processed by a live gateway.
                    </p>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs uppercase tracking-[0.15em] text-luxury-taupe mb-2">Card Number</label>
                        <div className="relative">
                          <CreditCard size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-taupe" />
                          <input
                            type="text"
                            name="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-3 bg-luxury-white border border-luxury-light-gray/20 text-luxury-black focus:outline-none focus:border-luxury-gold transition-colors"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-[0.15em] text-luxury-taupe mb-2">Cardholder Name</label>
                        <input
                          type="text"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-luxury-white border border-luxury-light-gray/20 text-luxury-black focus:outline-none focus:border-luxury-gold transition-colors"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs uppercase tracking-[0.15em] text-luxury-taupe mb-2">Expiry Date</label>
                          <input
                            type="text"
                            name="expiryDate"
                            placeholder="MM/YY"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-luxury-white border border-luxury-light-gray/20 text-luxury-black focus:outline-none focus:border-luxury-gold transition-colors"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-[0.15em] text-luxury-taupe mb-2">CVV</label>
                          <input
                            type="text"
                            name="cvv"
                            placeholder="123"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-luxury-white border border-luxury-light-gray/20 text-luxury-black focus:outline-none focus:border-luxury-gold transition-colors"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  {step > 1 && (
                    <button type="button" onClick={() => setStep(step - 1)} className="btn-luxury-outline">
                      <span>Back</span>
                    </button>
                  )}
                  <button type="submit" className={`btn-luxury ${step === 1 ? 'ml-auto' : ''}`}>
                    <span>{step === 3 ? `Pay ${formatPKR(total)}` : 'Continue'}</span>
                  </button>
                </div>
              </form>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-luxury-cream p-8 sticky top-32">
                <h2 className="font-serif text-xl text-luxury-black mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {cartLines.map((line) => {
                    const imgs = parseImages(line.product);
                    const thumb = imgs[0] || PRODUCT_IMAGE_FALLBACK;
                    return (
                      <div key={line.id} className="flex gap-4">
                        <div className="relative w-16 h-20 bg-luxury-white shrink-0">
                          <Image src={thumb} alt={line.product.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm text-luxury-black truncate">{line.product.name}</h4>
                          <p className="text-xs text-luxury-taupe">Qty: {line.quantity}</p>
                        </div>
                        <p className="text-sm text-luxury-black">{formatPKR(line.product.price * line.quantity)}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-luxury-light-gray/20 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-luxury-taupe">Subtotal</span>
                    <span className="text-luxury-black">{formatPKR(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-luxury-taupe">Shipping</span>
                    <span className="text-luxury-black">{shipping === 0 ? 'Free' : formatPKR(shipping)}</span>
                  </div>
                  <div className="flex justify-between font-serif text-lg pt-2 border-t border-luxury-light-gray/20">
                    <span className="text-luxury-black">Total</span>
                    <span className="text-luxury-black">{formatPKR(total)}</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-luxury-light-gray/20 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-luxury-taupe">
                    <Truck size={14} />
                    <span>Free shipping on orders over {formatPKR(FREE_SHIPPING_MIN_PKR)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-luxury-taupe">
                    <ShieldCheck size={14} />
                    <span>Secure checkout</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-luxury-black text-luxury-white py-12">
        <div className="container-luxury text-center">
          <h2 className="font-serif text-2xl tracking-[0.15em] mb-4">MERRY BERRY</h2>
          <p className="text-sm text-luxury-white/60">© 2026 Merry Berry. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
