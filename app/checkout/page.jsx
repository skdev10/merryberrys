'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LuxuryNavbar from '../../components/LuxuryNavbar';
import { Check, Truck, CreditCard, ShieldCheck, ChevronRight } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [step, setStep] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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

  useEffect(() => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!user || !token) {
      router.push('/login?redirect=/checkout');
      return;
    }
    
    setIsLoggedIn(true);
    const userData = JSON.parse(user);
    setFormData(prev => ({ ...prev, email: userData.email }));

    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const cartItems = JSON.parse(savedCart);
      if (cartItems.length === 0) {
        router.push('/cart');
        return;
      }
      setCart(cartItems);
    } else {
      router.push('/cart');
    }
  }, [router]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Process order
      alert('Order placed successfully!');
      localStorage.removeItem('cart');
      router.push('/order-confirmation');
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 200 ? 0 : 15;
  const total = subtotal + shipping;

  if (!isLoggedIn) {
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
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs uppercase tracking-[0.15em] text-luxury-taupe mb-2">
                          Card Number
                        </label>
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
                        <label className="block text-xs uppercase tracking-[0.15em] text-luxury-taupe mb-2">
                          Cardholder Name
                        </label>
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
                          <label className="block text-xs uppercase tracking-[0.15em] text-luxury-taupe mb-2">
                            Expiry Date
                          </label>
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
                          <label className="block text-xs uppercase tracking-[0.15em] text-luxury-taupe mb-2">
                            CVV
                          </label>
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
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="btn-luxury-outline"
                    >
                      <span>Back</span>
                    </button>
                  )}
                  <button
                    type="submit"
                    className={`btn-luxury ${step === 1 ? 'ml-auto' : ''}`}
                  >
                    <span>
                      {step === 3 ? `Pay $${total.toFixed(2)}` : 'Continue'}
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
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-20 bg-luxury-white flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="text-sm text-luxury-black">{item.name}</h4>
                        <p className="text-xs text-luxury-taupe">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm text-luxury-black">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-luxury-light-gray/20 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-luxury-taupe">Subtotal</span>
                    <span className="text-luxury-black">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-luxury-taupe">Shipping</span>
                    <span className="text-luxury-black">
                      {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-serif text-lg pt-2 border-t border-luxury-light-gray/20">
                    <span className="text-luxury-black">Total</span>
                    <span className="text-luxury-black">${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-luxury-light-gray/20 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-luxury-taupe">
                    <Truck size={14} />
                    <span>Free shipping on orders over $200</span>
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

      {/* Footer */}
      <footer className="bg-luxury-black text-luxury-white py-12">
        <div className="container-luxury text-center">
          <h2 className="font-serif text-2xl tracking-[0.15em] mb-4">MERRY BERRY</h2>
          <p className="text-sm text-luxury-white/60">
            © 2026 Merry Berry. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
