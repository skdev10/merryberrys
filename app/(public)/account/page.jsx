'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import LuxuryNavbar from '../../../components/LuxuryNavbar';
import { useRouter } from 'next/navigation';
import { formatPKR } from '@/lib/currency';

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const meRes = await fetch('/api/auth/me', { credentials: 'include' });
        const meData = await meRes.json();
        if (!meData.user) {
          router.replace('/login?redirect=/account');
          return;
        }
        if (cancelled) return;
        setUser(meData.user);

        const ordRes = await fetch('/api/orders', { credentials: 'include' });
        if (ordRes.ok) {
          const ordData = await ordRes.json();
          setOrders(ordData.orders || []);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    router.push('/');
    router.refresh();
  };

  if (loading) {
    return (
      <>
        <LuxuryNavbar />
        <div className="min-h-screen bg-luxury-white pt-32 flex justify-center text-luxury-taupe">Loading…</div>
      </>
    );
  }

  if (!user) return null;

  return (
    <>
      <LuxuryNavbar />
      <main className="min-h-screen bg-luxury-white pt-28 pb-20">
        <div className="container-luxury max-w-5xl">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 border-b border-luxury-light-gray/20 pb-8">
            <div>
              <p className="text-luxury-caption text-luxury-taupe mb-2">Account</p>
              <h1 className="font-serif text-4xl text-luxury-black">Hello, {user.name?.split(' ')[0]}</h1>
              <p className="text-luxury-taupe text-sm mt-2">{user.email}</p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="btn-luxury-outline self-start md:self-auto"
            >
              <span>Log out</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1 space-y-3">
              <p className="text-xs uppercase tracking-[0.2em] text-luxury-taupe">Quick links</p>
              <Link href="/shop" className="block text-luxury-black hover:text-luxury-gold">
                Shop
              </Link>
              <Link href="/orders" className="block text-luxury-black hover:text-luxury-gold">
                Order history
              </Link>
              <Link href="/cart" className="block text-luxury-black hover:text-luxury-gold">
                Cart
              </Link>
            </div>

            <div className="lg:col-span-2">
              <h2 className="font-serif text-2xl text-luxury-black mb-6">Recent orders</h2>
              {orders.length === 0 ? (
                <p className="text-luxury-taupe">No orders yet. <Link href="/shop" className="underline">Start shopping</Link>.</p>
              ) : (
                <div className="space-y-4">
                  {orders.map((o) => (
                    <div
                      key={o.id}
                      className="bg-luxury-cream border border-luxury-light-gray/20 p-6 flex flex-wrap justify-between gap-4"
                    >
                      <div>
                        <p className="text-xs uppercase tracking-[0.15em] text-luxury-taupe">Order</p>
                        <p className="font-mono text-luxury-black">{o.id.slice(0, 8).toUpperCase()}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.15em] text-luxury-taupe">Date</p>
                        <p className="text-luxury-black" suppressHydrationWarning>
                          {new Date(o.createdAt).toLocaleDateString('en-GB')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.15em] text-luxury-taupe">Status</p>
                        <p className="text-luxury-black">{o.status}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.15em] text-luxury-taupe">Total</p>
                        <p className="font-serif text-lg text-luxury-black">{formatPKR(o.total)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
