'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Upload, Trash2, Loader2 } from 'lucide-react';

function slugify(name) {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `${base || 'product'}-${Date.now().toString(36).slice(-5)}`;
}

export default function AdminProductForm({ productId }) {
  const router = useRouter();
  const isEdit = Boolean(productId);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [sizesStr, setSizesStr] = useState('S, M, L, XL');
  const [colorsStr, setColorsStr] = useState('Black, White, Navy');
  const [inStock, setInStock] = useState(true);
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    fetch(`/api/admin/products/${productId}`, { credentials: 'include' })
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(({ product }) => {
        setName(product.name || '');
        setSlug(product.slug || '');
        setDescription(product.description || '');
        setPrice(String(product.price ?? ''));
        setCategoryId(product.categoryId || '');
        setSizesStr(Array.isArray(product.sizes) ? product.sizes.join(', ') : '');
        setColorsStr(Array.isArray(product.colors) ? product.colors.join(', ') : '');
        setInStock(product.inStock !== false);
        setImages(Array.isArray(product.images) ? product.images : []);
      })
      .catch(() => router.push('/admin/products'))
      .finally(() => setLoading(false));
  }, [productId, router]);

  const parseList = (s) =>
    s
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean);

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      const next = [...images];
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: fd,
          credentials: 'include',
        });
        if (!res.ok) continue;
        const data = await res.json();
        if (data.url) next.push(data.url);
      }
      setImages(next);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (url) => {
    setImages((prev) => prev.filter((u) => u !== url));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name,
        slug: slug || slugify(name),
        description,
        price: parseFloat(price),
        categoryId,
        images,
        sizes: parseList(sizesStr),
        colors: parseList(colorsStr),
        inStock,
      };

      const url = isEdit ? `/api/admin/products/${productId}` : '/api/admin/products';
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.message || 'Save failed');
        return;
      }

      router.push('/admin/products');
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isEdit || !confirm('Delete this product permanently?')) return;
    const res = await fetch(`/api/admin/products/${productId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.ok) {
      router.push('/admin/products');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="animate-spin text-berry-500" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="text-zinc-400 hover:text-white p-2">
          <ArrowLeft size={22} />
        </Link>
        <div>
          <h1 className="text-3xl font-serif text-white">{isEdit ? 'Edit product' : 'New product'}</h1>
          <p className="text-zinc-500 text-sm">Images are stored under /public/uploads/products</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 glass-card rounded-2xl p-8 border border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-zinc-400 text-sm mb-2">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-3 px-4 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-zinc-400 text-sm mb-2">Slug</label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="auto if empty"
              className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-3 px-4 text-white"
            />
          </div>
          <div>
            <label className="block text-zinc-400 text-sm mb-2">Price (PKR)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-3 px-4 text-white"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-zinc-400 text-sm mb-2">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-3 px-4 text-white"
              required
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-zinc-400 text-sm mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-3 px-4 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-zinc-400 text-sm mb-2">Sizes (comma-separated)</label>
            <input
              value={sizesStr}
              onChange={(e) => setSizesStr(e.target.value)}
              className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-3 px-4 text-white"
            />
          </div>
          <div>
            <label className="block text-zinc-400 text-sm mb-2">Colors (comma-separated)</label>
            <input
              value={colorsStr}
              onChange={(e) => setColorsStr(e.target.value)}
              className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-3 px-4 text-white"
            />
          </div>
          <div className="md:col-span-2 flex items-center gap-3">
            <input
              type="checkbox"
              id="inStock"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
              className="w-4 h-4 rounded border-white/20 bg-zinc-900 text-berry-500"
            />
            <label htmlFor="inStock" className="text-zinc-300">
              In stock
            </label>
          </div>
        </div>

        <div>
          <label className="block text-zinc-400 text-sm mb-3">Product images</label>
          <div className="flex flex-wrap gap-4 mb-4">
            {images.map((url) => (
              <div key={url} className="relative w-24 h-32 rounded-lg overflow-hidden border border-white/10 group">
                <Image src={url} alt="" fill className="object-cover" unoptimized />
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
          <label className="inline-flex items-center gap-2 px-4 py-3 bg-zinc-900/50 border border-dashed border-white/20 rounded-xl cursor-pointer hover:border-berry-500/50 transition-colors text-zinc-400">
            <Upload size={18} />
            {uploading ? 'Uploading…' : 'Upload images'}
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>

        <div className="flex flex-wrap gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-gradient-to-r from-berry-600 to-berry-500 text-white rounded-xl font-medium disabled:opacity-50"
          >
            {saving ? 'Saving…' : isEdit ? 'Update product' : 'Create product'}
          </button>
          {isEdit && (
            <button
              type="button"
              onClick={handleDelete}
              className="px-8 py-3 border border-red-500/40 text-red-400 rounded-xl hover:bg-red-500/10"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
