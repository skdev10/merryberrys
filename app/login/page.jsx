'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import LuxuryNavbar from '@/components/LuxuryNavbar';
import { Lock, Mail, ArrowRight } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Login failed');
        setLoading(false);
        return;
      }
      router.push(redirect);
      router.refresh();
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-luxury-white pt-28 pb-20">
      <div className="container-luxury max-w-lg">
        <div className="text-center mb-10">
          <Lock className="mx-auto mb-4 text-luxury-gold" size={40} strokeWidth={1} />
          <p className="text-luxury-caption text-luxury-taupe mb-2">Welcome back</p>
          <h1 className="font-serif text-4xl text-luxury-black">Sign in</h1>
        </div>

        <div className="bg-luxury-cream p-8 md:p-10 border border-luxury-light-gray/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-4 py-3 border border-red-100">{error}</p>
            )}
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] text-luxury-taupe mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-taupe" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-luxury-white border border-luxury-light-gray/20 text-luxury-black focus:outline-none focus:border-luxury-gold"
                  required
                  autoComplete="email"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] text-luxury-taupe mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-luxury-white border border-luxury-light-gray/20 text-luxury-black focus:outline-none focus:border-luxury-gold"
                required
                autoComplete="current-password"
              />
            </div>
            <button type="submit" disabled={loading} className="w-full btn-luxury disabled:opacity-50">
              <span className="flex items-center justify-center gap-2">
                {loading ? 'Signing in…' : 'Sign in'}
                <ArrowRight size={18} />
              </span>
            </button>
          </form>

          <p className="text-center text-sm text-luxury-taupe mt-8">
            New to Merry Berry?{' '}
            <Link href={`/register?redirect=${encodeURIComponent(redirect)}`} className="text-luxury-black underline underline-offset-4 hover:text-luxury-gold">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <>
      <LuxuryNavbar />
      <Suspense
        fallback={
          <div className="min-h-screen bg-luxury-white pt-32 flex justify-center text-luxury-taupe">
            Loading…
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </>
  );
}
