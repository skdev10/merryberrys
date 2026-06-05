'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LuxuryNavbar from '../../components/LuxuryNavbar';
import { Check, Truck, CreditCard, ShieldCheck, ChevronRight } from 'lucide-react';
import { FREE_SHIPPING_THRESHOLD, readCart, summarizeCart, writeCart } from '@/lib/cart';
import { formatPrice } from '@/lib/currency';
import { authHeaders, fetchCurrentUser, isLoggedIn as checkLoggedIn } from '@/lib/auth';
import toast from 'react-hot-toast';
import Footer from '@/components/Footer';

const bankName = process.env.NEXT_PUBLIC_BANK_NAME || 'Meezan / HBL supported';
const bankAccountTitle = process.env.NEXT_PUBLIC_BANK_ACCOUNT_TITLE || 'Merry Berry Pakistan';
const bankAccountNumber = process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER || 'Configure in Vercel';
const walletTitle = process.env.NEXT_PUBLIC_WALLET_TITLE || 'Merry Berry Pakistan';
const walletNumber = process.env.NEXT_PUBLIC_WALLET_NUMBER || 'Configure in Vercel';

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [step, setStep] = useState(1);
  const [authReady, setAuthReady] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Pakistan',
    phone: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    paymentReference: '',
  });

  useEffect(() => {
    if (!checkLoggedIn()) {
      router.push('/login?redirect=/checkout');
      return;
    }

    (async () => {
      const userData = await fetchCurrentUser();
      if (!userData) {
        router.push('/login?redirect=/checkout');
        return;
      }
      setAuthReady(true);
      const parts = (userData.name || '').trim().split(/\s+/);
      const firstName = parts[0] || '';
      const lastName = parts.slice(1).join(' ');
      setFormData((prev) => ({
        ...prev,
        email: userData.email,
        firstName,
        lastName,
      }));
    })();

    const cartItems = readCart();
    if (cartItems.length === 0) {
      router.push('/cart');
      return;
    }
    setCart(cartItems);
  }, [router]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { subtotal, shipping, total } = summarizeCart(cart);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsSubmitting(true);
      try {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...authHeaders(),
          },
          body: JSON.stringify({
            cart,
            address: {
              firstName: formData.firstName,
              lastName: formData.lastName,
              address: formData.address,
              city: formData.city,
              postalCode: formData.postalCode,
              country: formData.country,
              phone: formData.phone,
            },
            paymentMethod,
            paymentReference: formData.paymentReference,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (typeof window !== 'undefined' && data.order) {
            sessionStorage.setItem('lastOrder', JSON.stringify(data.order));
          }
          writeCart([]);
          toast.success('Order placed successfully!');
          router.push('/confirmation');
        } else {
          const err = await response.json().catch(() => ({}));
          toast.error(err.error || 'Failed to place order.');
        }
      } catch (error) {
        console.error('Checkout error:', error);
        toast.error('An error occurred during checkout.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (!authReady) {
    return (
      <>
        <LuxuryNavbar />
        <div className="pt-32 pb-20 bg-luxury-white min-h-screen flex items-center justify-center">
          <div className="text-luxury-taupe">Redirecting to login...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <LuxuryNavbar />
      
      <main className="pt-32 pb-20 bg-luxury-white min-h-screen">
        <div className="container-luxury">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-luxury-caption text-luxury-taupe mb-4">Secure Checkout</p>
            <h1 className="text-luxury-subheading text-luxury-black">
              Complete Your Order
            </h1>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center gap-4">
              {['Information', 'Shipping', 'Payment'].map((label, index) => (
                <div key={label} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    step > index + 1 ? 'bg-luxury-gold text-luxury-white' :
                    step === index + 1 ? 'bg-luxury-black text-luxury-white' :
                    'bg-luxury-cream text-luxury-taupe'
                  }`}>
                    {step > index + 1 ? <Check size={18} /> : index + 1}
                  </div>
                  <span className={`ml-2 text-sm ${
                    step >= index + 1 ? 'text-luxury-black' : 'text-luxury-taupe'
                  }`}>
                    {label}
                  </span>
                  {index < 2 && (
                    <ChevronRight size={16} className="mx-4 text-luxury-taupe" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-8">
                {step === 1 && (
                  <div className="bg-luxury-cream p-8">
                    <h2 className="font-serif text-xl text-luxury-black mb-6">Contact Information</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs uppercase tracking-[0.15em] text-luxury-taupe mb-2">
                          Email
                        </label>
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
                  </div>
                )}

                {(step === 1 || step === 2) && (
                  <div className="bg-luxury-cream p-8">
                    <h2 className="font-serif text-xl text-luxury-black mb-6">Shipping Address</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-[0.15em] text-luxury-taupe mb-2">
                          First Name
                        </label>
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
                        <label className="block text-xs uppercase tracking-[0.15em] text-luxury-taupe mb-2">
                          Last Name
                        </label>
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
                        <label className="block text-xs uppercase tracking-[0.15em] text-luxury-taupe mb-2">
                          Address
                        </label>
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
                        <label className="block text-xs uppercase tracking-[0.15em] text-luxury-taupe mb-2">
                          City
                        </label>
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
                        <label className="block text-xs uppercase tracking-[0.15em] text-luxury-taupe mb-2">
                          Postal Code
                        </label>
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
                        <label className="block text-xs uppercase tracking-[0.15em] text-luxury-taupe mb-2">
                          Phone
                        </label>
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
                    
                    <div className="grid gap-4 mb-6 sm:grid-cols-3">
                      <label className={`flex-1 flex items-center justify-center gap-2 p-4 border cursor-pointer transition-colors ${paymentMethod === 'bank_transfer' ? 'border-luxury-gold bg-luxury-white text-luxury-black' : 'border-luxury-light-gray/20 text-luxury-taupe hover:border-luxury-gold'}`}>
                        <input type="radio" name="payment_method" value="bank_transfer" checked={paymentMethod === 'bank_transfer'} onChange={() => setPaymentMethod('bank_transfer')} className="hidden" />
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg> Bank Transfer
                      </label>
                      <label className={`flex-1 flex items-center justify-center gap-2 p-4 border cursor-pointer transition-colors ${paymentMethod === 'digital_wallet' ? 'border-luxury-gold bg-luxury-white text-luxury-black' : 'border-luxury-light-gray/20 text-luxury-taupe hover:border-luxury-gold'}`}>
                        <input type="radio" name="payment_method" value="digital_wallet" checked={paymentMethod === 'digital_wallet'} onChange={() => setPaymentMethod('digital_wallet')} className="hidden" />
                        <CreditCard size={18} /> JazzCash / Easypaisa
                      </label>
                      <label className={`flex-1 flex items-center justify-center gap-2 p-4 border cursor-pointer transition-colors ${paymentMethod === 'cash_on_delivery' ? 'border-luxury-gold bg-luxury-white text-luxury-black' : 'border-luxury-light-gray/20 text-luxury-taupe hover:border-luxury-gold'}`}>
                        <input type="radio" name="payment_method" value="cash_on_delivery" checked={paymentMethod === 'cash_on_delivery'} onChange={() => setPaymentMethod('cash_on_delivery')} className="hidden" />
                        Cash on Delivery
                      </label>
                    </div>

                    <div className="p-4 border border-luxury-gold/30 bg-luxury-gold/5 text-luxury-black text-sm leading-relaxed">
                      {paymentMethod === 'bank_transfer' && (
                        <>
                          <p className="mb-2 font-medium">Transfer the total amount to the configured bank account:</p>
                          <p className="font-serif">Bank Name: {bankName}</p>
                          <p className="font-serif">Account Name: {bankAccountTitle}</p>
                          <p className="font-serif">Account Number: {bankAccountNumber}</p>
                        </>
                      )}
                      {paymentMethod === 'digital_wallet' && (
                        <>
                          <p className="mb-2 font-medium">Pay via JazzCash or Easypaisa, then add the transaction/reference ID below.</p>
                          <p className="font-serif">Wallet Title: {walletTitle}</p>
                          <p className="font-serif">Wallet Number: {walletNumber}</p>
                        </>
                      )}
                      {paymentMethod === 'cash_on_delivery' && (
                        <p className="font-medium">Cash on Delivery is available for eligible Pakistan service areas.</p>
                      )}
                      {paymentMethod !== 'cash_on_delivery' && (
                        <div className="mt-4">
                          <label className="block text-xs uppercase tracking-[0.15em] text-luxury-taupe mb-2">
                            Payment Reference / Transaction ID
                          </label>
                          <input
                            type="text"
                            name="paymentReference"
                            value={formData.paymentReference}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-luxury-white border border-luxury-light-gray/20 text-luxury-black focus:outline-none focus:border-luxury-gold transition-colors"
                            placeholder="Enter transfer or wallet reference"
                          />
                        </div>
                      )}
                      <p className="mt-3 text-luxury-taupe text-xs">Order will ship after payment confirmation.</p>
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="btn-luxury-outline"
                      disabled={isSubmitting}
                    >
                      <span>Back</span>
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`btn-luxury ${step === 1 ? 'ml-auto' : ''} ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                  >
                    <span>
                      {isSubmitting ? 'Processing...' : (step === 3 ? `Pay ${formatPrice(total)}` : 'Continue')}
                    </span>
                  </button>
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-luxury-cream p-8 sticky top-32">
                <h2 className="font-serif text-xl text-luxury-black mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {cart.map((item, index) => (
                    <div key={`${item.id}-${item.size}-${item.color}-${index}`} className="flex gap-4">
                      <div className="w-16 h-20 bg-luxury-white flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="text-sm text-luxury-black">{item.name}</h4>
                        <p className="text-xs text-luxury-taupe">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm text-luxury-black">
                        {formatPrice((Number(item.price) || 0) * (Number(item.quantity) || 1))}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-luxury-light-gray/20 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-luxury-taupe">Subtotal</span>
                    <span className="text-luxury-black">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-luxury-taupe">Shipping</span>
                    <span className="text-luxury-black">
                      {shipping === 0 ? 'Free' : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between font-serif text-lg pt-2 border-t border-luxury-light-gray/20">
                    <span className="text-luxury-black">Total</span>
                    <span className="text-luxury-black">{formatPrice(total)}</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-luxury-light-gray/20 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-luxury-taupe">
                    <Truck size={14} />
                    <span>Free shipping on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}</span>
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

      <Footer />
    </>
  );
}
