'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import LuxuryNavbar from '@/components/LuxuryNavbar';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { isLoggedIn, setAuth } from '@/lib/auth';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/shop';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) {
      router.replace(redirect === '/login' ? '/account' : redirect);
    }
  }, [router, redirect]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Login failed');
        return;
      }
      setAuth(data.token, data.user);
      router.push(redirect === '/login' ? '/account' : redirect);
      router.refresh();
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LuxuryNavbar />
      <main className="min-h-screen bg-luxury-cream pt-32 pb-24">
        <div className="container-luxury max-w-md">
          <div className="border border-luxury-light-gray/20 bg-luxury-white p-8 md:p-10 shadow-sm">
            <div className="mb-8 text-center">
              <Lock className="mx-auto mb-4 text-luxury-gold" size={36} strokeWidth={1} />
              <h1 className="font-serif text-3xl text-luxury-black">Sign in</h1>
              <p className="mt-2 text-sm text-luxury-taupe">Access your account and checkout faster.</p>
            </div>

            {error && (
              <div className="mb-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
            )}

            <form onSubmit={onSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-luxury-taupe">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-taupe" size={18} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-luxury-light-gray/30 py-3 pl-10 pr-4 text-luxury-black outline-none focus:border-luxury-black"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-luxury-taupe">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-taupe" size={18} />
                  <input
                    type={showPw ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-luxury-light-gray/30 py-3 pl-10 pr-12 text-luxury-black outline-none focus:border-luxury-black"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-luxury-taupe hover:text-luxury-black"
                    onClick={() => setShowPw(!showPw)}
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                  >
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="flex justify-end">
                <Link href="/forgot-password" className="text-xs text-luxury-taupe underline hover:text-luxury-black">
                  Forgot password?
                </Link>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-luxury w-full disabled:opacity-60"
              >
                <span>{loading ? 'Signing in…' : 'Sign in'}</span>
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-luxury-taupe">
              New here?{' '}
              <Link href={`/register?redirect=${encodeURIComponent(redirect)}`} className="text-luxury-black underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-luxury-cream pt-40 text-center text-luxury-taupe">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
