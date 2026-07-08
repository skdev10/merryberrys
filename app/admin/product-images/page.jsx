'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { adminFetch } from '@/lib/adminClient';
import { parseProductImages } from '@/lib/productImages';
import ProductImagesField from '@/components/admin/ProductImagesField';
import {
  Search,
  Save,
  Package,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ImageIcon,
  Loader2,
} from 'lucide-react';

export default function ProductImagesPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [drafts, setDrafts] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [messages, setMessages] = useState({});

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminFetch('/api/admin/products');
      const data = await res.json();
      const list = data.products || [];
      setProducts(list);
      const initial = {};
      list.forEach((p) => {
        initial[p.id] = parseProductImages(p.images);
      });
      setDrafts(initial);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    const productId = searchParams.get('product');
    if (productId) setExpandedId(productId);
  }, [searchParams]);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const updateDraft = (id, images) => {
    setDrafts((prev) => ({ ...prev, [id]: images }));
    setMessages((prev) => ({ ...prev, [id]: '' }));
  };

  const saveImages = async (id) => {
    setSavingId(id);
    setMessages((prev) => ({ ...prev, [id]: '' }));
    try {
      const images = (drafts[id] || []).map((s) => String(s).trim()).filter(Boolean);
      const res = await adminFetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessages((prev) => ({ ...prev, [id]: data.message || 'Save failed' }));
        return;
      }
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, images: data.product.images } : p))
      );
      setDrafts((prev) => ({ ...prev, [id]: data.product.images }));
      toast.success('Photos save ho gayi');
      setMessages((prev) => ({ ...prev, [id]: '✓ Photos saved — website refresh karein' }));
    } catch {
      setMessages((prev) => ({ ...prev, [id]: 'Save failed — try again' }));
    } finally {
      setSavingId(null);
    }
  };

  const hasChanges = (id) => {
    const original = parseProductImages(products.find((p) => p.id === id)?.images);
    const draft = drafts[id] || [];
    return JSON.stringify(original) !== JSON.stringify(draft);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-serif text-white mb-1">Product Images</h1>
        <p className="text-zinc-500 text-sm max-w-2xl">
          Yahan se <strong className="text-zinc-300">saari products ki photos</strong> change karein —
          upload, URL paste, reorder, delete. Har product ke neeche <strong className="text-zinc-300">Save photos</strong> dabayein.
        </p>
      </div>

      <div className="glass-card rounded-2xl p-4 border border-white/5">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
          <input
            type="text"
            placeholder="Product search karein..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-zinc-600 focus:outline-none focus:border-berry-500/50"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-zinc-500">
          <Loader2 className="mx-auto mb-3 animate-spin" size={32} />
          Products load ho rahe hain…
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center">
          <Package size={48} className="text-zinc-600 mx-auto mb-4" />
          <p className="text-zinc-500">Koi product nahi mila</p>
          <Link href="/admin/products/new" className="text-berry-400 text-sm mt-2 inline-block hover:underline">
            Pehla product add karein →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((product) => {
            const imgs = drafts[product.id] || [];
            const expanded = expandedId === product.id;
            const thumb = imgs[0] || parseProductImages(product.images)[0];

            return (
              <div
                key={product.id}
                className="glass-card rounded-2xl border border-white/5 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(expanded ? null : product.id)}
                  className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/5 transition-colors"
                >
                  <div className="w-14 h-14 rounded-lg bg-zinc-800 overflow-hidden shrink-0 border border-white/5">
                    {thumb ? (
                      <img src={thumb} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600">
                        <ImageIcon size={22} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{product.name}</p>
                    <p className="text-zinc-500 text-sm">
                      {product.category?.name || 'Uncategorized'} · {imgs.length || parseProductImages(product.images).length} photo(s)
                      {hasChanges(product.id) && (
                        <span className="text-amber-400 ml-2">· unsaved changes</span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/admin/products/edit/${product.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 text-zinc-500 hover:text-berry-400 rounded-lg"
                      title="Full edit"
                    >
                      <ExternalLink size={18} />
                    </Link>
                    {expanded ? (
                      <ChevronUp className="text-zinc-400" size={20} />
                    ) : (
                      <ChevronDown className="text-zinc-400" size={20} />
                    )}
                  </div>
                </button>

                {expanded && (
                  <div className="border-t border-white/5 p-4 sm:p-6 space-y-4 bg-zinc-950/30">
                    <ProductImagesField
                      images={imgs.length ? imgs : ['']}
                      onChange={(next) => updateDraft(product.id, next)}
                      compact
                    />

                    {messages[product.id] && (
                      <p
                        className={`text-sm rounded-xl px-4 py-2 ${
                          messages[product.id].startsWith('✓')
                            ? 'text-green-400 bg-green-500/10 border border-green-500/20'
                            : 'text-red-400 bg-red-500/10 border border-red-500/20'
                        }`}
                      >
                        {messages[product.id]}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={() => saveImages(product.id)}
                      disabled={savingId === product.id || !hasChanges(product.id)}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-berry-600 to-berry-500 text-white text-sm font-medium disabled:opacity-40"
                    >
                      {savingId === product.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Save size={16} />
                      )}
                      {savingId === product.id ? 'Saving…' : 'Save photos'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <p className="text-xs text-zinc-600">
        Tip: Product name, price, stock change karne ke liye{' '}
        <Link href="/admin/products" className="text-berry-400 hover:underline">
          Products
        </Link>{' '}
        page use karein.
      </p>
    </div>
  );
}
