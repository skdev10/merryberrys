'use client';

import { useState } from 'react';
import Link from 'next/link';
import LuxuryNavbar from '@/components/LuxuryNavbar';
import { Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <>
      <LuxuryNavbar />
      <main className="min-h-screen bg-luxury-cream pt-32 pb-24">
        <div className="container-luxury max-w-md">
          <div className="border border-luxury-light-gray/20 bg-luxury-white p-8 md:p-10 shadow-sm text-center">
            <Mail className="mx-auto mb-4 text-luxury-gold" size={36} strokeWidth={1} />
            <h1 className="font-serif text-3xl text-luxury-black mb-2">Reset password</h1>
            <p className="text-sm text-luxury-taupe mb-8">
              Enter the email you used at checkout. When email delivery is connected, you will receive a reset link.
            </p>

            {sent ? (
              <p className="text-luxury-body text-luxury-black">
                If an account exists for <strong>{email}</strong>, reset instructions will be sent. (Demo: no email is sent yet.)
              </p>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5 text-left">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-luxury-light-gray/30 py-3 px-4 text-luxury-black outline-none focus:border-luxury-black"
                  placeholder="Email address"
                />
                <button type="submit" className="btn-luxury w-full">
                  <span>Send reset link</span>
                </button>
              </form>
            )}

            <Link href="/login" className="mt-8 inline-block text-sm text-luxury-taupe underline hover:text-luxury-black">
              Back to sign in
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
