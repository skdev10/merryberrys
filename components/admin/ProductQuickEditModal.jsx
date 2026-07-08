'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X, Save, ExternalLink, Loader2 } from 'lucide-react';
import { adminFetch } from '@/lib/adminClient';
import { slugify } from '@/lib/adminProduct';

export default function ProductQuickEditModal({ product, categories, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: '',
    slug: '',
    price: '',
    categoryId: '',
    stockQuantity: '',
    inStock: true,
    autoSlug: false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!product) return;
    setForm({
      name: product.name || '',
      slug: product.slug || '',
      price: String(product.price ?? ''),
      categoryId: product.categoryId || product.category?.id || '',
      stockQuantity: String(product.stockQuantity ?? 0),
      inStock: !!product.inStock,
      autoSlug: false,
    });
    setError('');
  }, [product]);

  if (!product) return null;

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await adminFetch(`/api/admin/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          slug: form.autoSlug ? undefined : form.slug,
          autoSlug: form.autoSlug,
          price: parseFloat(form.price),
          categoryId: form.categoryId,
          stockQuantity: parseInt(form.stockQuantity, 10) || 0,
          inStock: form.inStock,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Save failed');
        return;
      }
      onSaved(data.product);
      onClose();
    } catch {
      setError('Save failed — try again');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button type="button" aria-label="Close" className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-full max-w-lg glass-card rounded-2xl border border-white/10 p-6 space-y-4 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-serif text-white">Quick edit</h2>
            <p className="text-zinc-500 text-sm mt-1">Name, price, stock, category — yahan se turant change karein</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 text-zinc-400 hover:text-white rounded-lg">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={save} className="space-y-3">
          <div>
            <label className="text-xs text-zinc-500 uppercase tracking-wider">Product name</label>
            <input
              required
              className="mt-1 w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white"
              value={form.name}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  name: e.target.value,
                  slug: f.autoSlug ? slugify(e.target.value) : f.slug,
                }))
              }
            />
          </div>

          <div>
            <div className="flex items-center justify-between gap-2">
              <label className="text-xs text-zinc-500 uppercase tracking-wider">URL slug</label>
              <label className="flex items-center gap-2 text-xs text-zinc-400">
                <input
                  type="checkbox"
                  checked={form.autoSlug}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      autoSlug: e.target.checked,
                      slug: e.target.checked ? slugify(f.name) : f.slug,
                    }))
                  }
                />
                Name se auto update
              </label>
            </div>
            <input
              required
              disabled={form.autoSlug}
              className="mt-1 w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white disabled:opacity-60"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-zinc-500 uppercase tracking-wider">Price</label>
              <input
                required
                type="number"
                step="0.01"
                min="0"
                className="mt-1 w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-xs text-zinc-500 uppercase tracking-wider">Stock</label>
              <input
                required
                type="number"
                min="0"
                className="mt-1 w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white"
                value={form.stockQuantity}
                onChange={(e) => setForm((f) => ({ ...f, stockQuantity: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-zinc-500 uppercase tracking-wider">Category</label>
            <select
              required
              className="mt-1 w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white"
              value={form.categoryId}
              onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 text-zinc-400 text-sm">
            <input
              type="checkbox"
              checked={form.inStock}
              onChange={(e) => setForm((f) => ({ ...f, inStock: e.target.checked }))}
            />
            In stock (website par dikhega)
          </label>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex flex-1 items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-berry-600 to-berry-500 text-white font-medium disabled:opacity-50"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            <Link
              href={`/admin/products/edit/${product.id}`}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 text-zinc-300 hover:text-white text-sm"
            >
              <ExternalLink size={16} /> Full edit
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
