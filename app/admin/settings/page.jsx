'use client';

import Link from 'next/link';
import { Image as ImageIcon, Package, Shield } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif text-white">Settings</h1>
      <p className="max-w-2xl text-zinc-500 text-sm">
        Manage images, products, and admin access from the links below.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href="/admin/site-images"
          className="glass-card rounded-2xl border border-white/5 p-6 hover:border-berry-500/30 transition-colors"
        >
          <ImageIcon className="text-berry-400 mb-3" size={24} />
          <h2 className="text-white font-medium mb-1">Site images & logo</h2>
          <p className="text-zinc-500 text-sm">Logo, homepage tiles, about page, collections</p>
        </Link>
        <Link
          href="/admin/banners"
          className="glass-card rounded-2xl border border-white/5 p-6 hover:border-berry-500/30 transition-colors"
        >
          <ImageIcon className="text-berry-400 mb-3" size={24} />
          <h2 className="text-white font-medium mb-1">Homepage carousel</h2>
          <p className="text-zinc-500 text-sm">Hero banner slides on the homepage</p>
        </Link>
        <Link
          href="/admin/products"
          className="glass-card rounded-2xl border border-white/5 p-6 hover:border-berry-500/30 transition-colors"
        >
          <Package className="text-berry-400 mb-3" size={24} />
          <h2 className="text-white font-medium mb-1">Product images</h2>
          <p className="text-zinc-500 text-sm">Add or edit product photo URLs</p>
        </Link>
      </div>

      <div className="glass-card rounded-2xl border border-white/5 p-8 text-zinc-400 text-sm space-y-3">
        <p className="flex items-center gap-2 text-white">
          <Shield size={16} className="text-berry-400" /> Admin login
        </p>
        <p>
          URL: <span className="text-zinc-200">/admin/login</span> (e.g. https://your-domain.com/admin/login)
        </p>
        <p>
          Email: <span className="text-zinc-200">admin@merryberry.com</span>
        </p>
        <p>
          Password: <span className="text-zinc-200">admin123</span> — change after first login in production.
        </p>
      </div>
    </div>
  );
}
