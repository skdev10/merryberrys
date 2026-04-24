'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Package } from 'lucide-react';

export default function AdminOrderDetailPage() {
  const params = useParams();
  const id = params?.id;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/admin/orders/${id}`, { cache: 'no-store' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load order');
        if (!cancelled) setOrder(data.order);
      } catch (e) {
        if (!cancelled) setError(e.message || 'Something went wrong');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="p-12 text-center text-zinc-500">
        <div className="w-12 h-12 border-2 border-berry-500/30 border-t-berry-500 rounded-full animate-spin mx-auto mb-4" />
        Loading order…
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="space-y-4">
        <p className="text-red-400">{error || 'Order not found'}</p>
        <Link href="/admin/orders" className="text-berry-400 hover:text-berry-300 inline-flex items-center gap-2">
          <ArrowLeft size={18} /> Back to orders
        </Link>
      </div>
    );
  }

  let address = {};
  try {
    address = typeof order.address === 'string' ? JSON.parse(order.address || '{}') : order.address || {};
  } catch {
    address = {};
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/orders"
          className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <ArrowLeft size={22} />
        </Link>
        <div>
          <h1 className="text-3xl font-serif text-white">Order #{order.id?.slice(-8).toUpperCase()}</h1>
          <p className="text-zinc-500 text-sm">{new Date(order.createdAt).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="glass-card rounded-2xl p-6 border border-white/5">
          <h2 className="text-white font-medium mb-4">Customer</h2>
          <p className="text-white">{order.user?.name}</p>
          <p className="text-zinc-400 text-sm">{order.user?.email}</p>
        </div>
        <div className="glass-card rounded-2xl p-6 border border-white/5">
          <h2 className="text-white font-medium mb-4">Shipping</h2>
          <p className="text-zinc-300 text-sm">
            {[address.line1, address.city, address.postalCode, address.country].filter(Boolean).join(', ') ||
              order.address ||
              '—'}
          </p>
          <p className="text-zinc-500 text-xs mt-2">Payment: {order.paymentMethod}</p>
          <p className="text-zinc-500 text-xs">Status: {order.status}</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center gap-2 text-white font-medium">
          <Package size={18} className="text-berry-400" />
          Line items
        </div>
        <ul className="divide-y divide-white/5">
          {(order.orderItems || []).map((item) => (
            <li key={item.id} className="p-4 flex justify-between gap-4 text-sm">
              <span className="text-white">{item.product?.name || 'Product'}</span>
              <span className="text-zinc-400">
                ×{item.quantity} @ ${Number(item.price).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
        <div className="p-4 bg-zinc-900/40 text-right text-white font-semibold">
          Total: ${Number(order.total).toFixed(2)}
        </div>
      </div>
    </div>
  );
}
