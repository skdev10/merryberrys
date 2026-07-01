'use client';

import Link from 'next/link';
import { Image as ImageIcon, Package, Shield, Upload } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif text-white">Settings</h1>
      <p className="max-w-2xl text-zinc-500 text-sm">
        Quick links — sab images ek jagah <strong className="text-zinc-300">Media Center</strong> se.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href="/admin/media"
          className="glass-card rounded-2xl border border-berry-500/30 p-6 hover:border-berry-500/50 transition-colors"
        >
          <ImageIcon className="text-berry-400 mb-3" size={24} />
          <h2 className="text-white font-medium mb-1">Media Center</h2>
          <p className="text-zinc-500 text-sm">Logo, hero, homepage, collections, about — upload + save</p>
        </Link>
        <Link
          href="/admin/products"
          className="glass-card rounded-2xl border border-white/5 p-6 hover:border-berry-500/30 transition-colors"
        >
          <Package className="text-berry-400 mb-3" size={24} />
          <h2 className="text-white font-medium mb-1">Product photos</h2>
          <p className="text-zinc-500 text-sm">Har product ki images upload ya URL</p>
        </Link>
      </div>

      <div className="glass-card rounded-2xl border border-white/5 p-6 text-sm text-zinc-400 space-y-3">
        <p className="flex items-center gap-2 text-white">
          <Upload size={16} className="text-berry-400" /> Image upload tip
        </p>
        <p>
          Admin mein photo choose karein — automatically save hoti hai database mein. Koi URL paste ki
          zaroorat nahi.
        </p>
      </div>

      <div className="glass-card rounded-2xl border border-white/5 p-8 text-zinc-400 text-sm space-y-3">
        <p className="flex items-center gap-2 text-white">
          <Shield size={16} className="text-berry-400" /> Admin login
        </p>
        <p>URL: <span className="text-zinc-200">/admin/login</span></p>
        <p>Email: <span className="text-zinc-200">admin@merryberry.com</span></p>
        <p>Password: <span className="text-zinc-200">admin123</span></p>
      </div>
    </div>
  );
}
