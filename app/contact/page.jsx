'use client';

import { useState } from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import LuxuryNavbar from '@/components/LuxuryNavbar';
import Footer from '@/components/Footer';

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'merryberrytshirts@gmail.com';
const contactPhone = process.env.NEXT_PUBLIC_CONTACT_PHONE || '+92 300 0000000';

export default function ContactPage() {
  const [status, setStatus] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setStatus('Thank you. Our Pakistan support team will contact you shortly.');
    event.currentTarget.reset();
  };

  return (
    <>
      <LuxuryNavbar />

      <main className="min-h-screen bg-luxury-white pt-32">
        <section className="container-luxury pb-20">
          <div className="mb-14 max-w-3xl">
            <p className="text-luxury-caption mb-4 text-luxury-taupe">Contact Us</p>
            <h1 className="font-serif mb-6 text-5xl text-luxury-black md:text-6xl">
              We are here to help across Pakistan.
            </h1>
            <p className="text-luxury-body text-luxury-taupe">
              Questions about sizing, custom printing, delivery, payments, or wholesale orders?
              Message our Lahore-based team and we will guide you quickly.
            </p>
          </div>

          <div className="grid gap-10 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-1">
              {[
                {
                  icon: MapPin,
                  title: 'Location',
                  value: 'Lahore, Punjab, Pakistan',
                },
                {
                  icon: Phone,
                  title: 'Phone / WhatsApp',
                  value: contactPhone,
                },
                {
                  icon: Mail,
                  title: 'Email',
                  value: contactEmail,
                },
              ].map((item) => (
                <div key={item.title} className="border border-luxury-light-gray/20 bg-luxury-cream p-6">
                  <item.icon className="mb-4 text-luxury-gold" size={24} strokeWidth={1.5} />
                  <h2 className="font-serif mb-2 text-xl text-luxury-black">{item.title}</h2>
                  <p className="text-sm text-luxury-taupe">{item.value}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="bg-luxury-cream p-8 lg:col-span-2">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="text-luxury-caption mb-2 block text-luxury-taupe">Name</label>
                  <input
                    name="name"
                    type="text"
                    required
                    className="w-full border border-luxury-light-gray/20 bg-luxury-white px-4 py-3 text-luxury-black outline-none transition-colors focus:border-luxury-gold"
                  />
                </div>
                <div>
                  <label className="text-luxury-caption mb-2 block text-luxury-taupe">Email</label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full border border-luxury-light-gray/20 bg-luxury-white px-4 py-3 text-luxury-black outline-none transition-colors focus:border-luxury-gold"
                  />
                </div>
                <div>
                  <label className="text-luxury-caption mb-2 block text-luxury-taupe">Phone</label>
                  <input
                    name="phone"
                    type="tel"
                    className="w-full border border-luxury-light-gray/20 bg-luxury-white px-4 py-3 text-luxury-black outline-none transition-colors focus:border-luxury-gold"
                  />
                </div>
                <div>
                  <label className="text-luxury-caption mb-2 block text-luxury-taupe">Subject</label>
                  <select
                    name="subject"
                    className="w-full border border-luxury-light-gray/20 bg-luxury-white px-4 py-3 text-luxury-black outline-none transition-colors focus:border-luxury-gold"
                  >
                    <option>Order support</option>
                    <option>Custom print</option>
                    <option>Wholesale</option>
                    <option>General question</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-luxury-caption mb-2 block text-luxury-taupe">Message</label>
                  <textarea
                    name="message"
                    rows={6}
                    required
                    className="w-full border border-luxury-light-gray/20 bg-luxury-white px-4 py-3 text-luxury-black outline-none transition-colors focus:border-luxury-gold"
                  />
                </div>
              </div>

              <button type="submit" className="btn-luxury mt-6">
                <span className="flex items-center gap-2">
                  Send Message <Send size={16} />
                </span>
              </button>

              {status && <p className="mt-4 text-sm text-luxury-taupe">{status}</p>}
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

