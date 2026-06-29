'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { adminFetch } from '@/lib/adminClient';
import { ArrowLeft } from 'lucide-react';
import ProductImagesField from '@/components/admin/ProductImagesField';

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    categoryId: '',
    inStock: true,
    stockQuantity: '',
    images: [],
    sizes: '',
    colors: '',
  });

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []));
  }, []);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      try {
        const res = await adminFetch(`/api/admin/products/${id}`);
        const data = await res.json();
        const p = data.product;
        if (!p) return;
        const imgs = Array.isArray(p.images) ? p.images : [];
        setForm({
          name: p.name || '',
          slug: p.slug || '',
          description: p.description || '',
          price: String(p.price ?? ''),
          categoryId: p.categoryId || '',
          inStock: !!p.inStock,
          stockQuantity: String(p.stockQuantity ?? 0),
          images: imgs,
          sizes: (p.sizes || []).join(', '),
          colors: (p.colors || []).join(', '),
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const images = form.images.map((s) => String(s).trim()).filter(Boolean);
      const sizes = form.sizes.split(',').map((s) => s.trim()).filter(Boolean);
      const colors = form.colors.split(',').map((s) => s.trim()).filter(Boolean);
      await adminFetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          slug: form.slug,
          description: form.description,
          price: parseFloat(form.price),
          categoryId: form.categoryId,
          stockQuantity: parseInt(form.stockQuantity, 10) || 0,
          images: images.length ? images : ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=900&q=80'],
          sizes,
          colors,
          inStock: form.inStock,
        }),
      });
      router.push('/admin/products');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-zinc-500">Loading product…</div>;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <Link href="/admin/products" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-sm">
        <ArrowLeft size={16} /> Back to products
      </Link>
      <h1 className="text-3xl font-serif text-white">Edit product</h1>
      <form onSubmit={submit} className="glass-card rounded-2xl border border-white/5 p-6 space-y-4">
        <input
          required
          className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white"
          placeholder="Product name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          required
          className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white"
          placeholder="URL slug"
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
        />
        <textarea
          required
          rows={4}
          className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white resize-none"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          required
          type="number"
          step="0.01"
          className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <select
          className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white"
          value={form.categoryId}
          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          required
          type="number"
          min="0"
          className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white"
          placeholder="Stock quantity"
          value={form.stockQuantity}
          onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
        />
        <ProductImagesField
          images={form.images}
          onChange={(images) => setForm({ ...form, images })}
        />
        <input
          className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white"
          value={form.sizes}
          onChange={(e) => setForm({ ...form, sizes: e.target.value })}
        />
        <input
          className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white"
          value={form.colors}
          onChange={(e) => setForm({ ...form, colors: e.target.value })}
        />
        <label className="flex items-center gap-2 text-zinc-400 text-sm">
          <input
            type="checkbox"
            checked={form.inStock}
            onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
          />
          In stock
        </label>
        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-berry-600 to-berry-500 text-white font-medium disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}
