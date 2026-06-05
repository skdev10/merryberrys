'use client';

import { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/adminClient';
import { Plus, Trash2, Save } from 'lucide-react';

const emptyForm = {
  imageUrl: '',
  videoUrl: '',
  title: '',
  subtitle: '',
  ctaLabel: 'Shop now',
  ctaHref: '/shop',
  sortOrder: 0,
  active: true,
};

export default function AdminBannersPage() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [savingId, setSavingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminFetch('/api/admin/hero-slides');
      const data = await res.json();
      setSlides(data.slides || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateField = (id, field, value) => {
    setSlides((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const saveSlide = async (slide) => {
    setSavingId(slide.id);
    try {
      await adminFetch(`/api/admin/hero-slides/${slide.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slide),
      });
      await load();
    } finally {
      setSavingId(null);
    }
  };

  const deleteSlide = async (id) => {
    if (!confirm('Delete this slide?')) return;
    await adminFetch(`/api/admin/hero-slides/${id}`, { method: 'DELETE' });
    await load();
  };

  const addSlide = async (e) => {
    e.preventDefault();
    await adminFetch('/api/admin/hero-slides', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm(emptyForm);
    await load();
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-zinc-500">Loading homepage banners…</div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-white mb-1">Homepage carousel</h1>
        <p className="text-zinc-500 text-sm max-w-2xl">
          Images and optional background video for the storefront hero. Changes apply immediately after save. Use your
          own hosted assets for production (respect copyright on third‑party sites).
        </p>
      </div>

      <div className="glass-card rounded-2xl border border-white/5 p-6">
        <h2 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
          <Plus size={18} className="text-berry-400" /> New slide
        </h2>
        <form onSubmit={addSlide} className="grid gap-4 md:grid-cols-2">
          <input
            className="bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white md:col-span-2"
            placeholder="Image URL (required)"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            required
          />
          <input
            className="bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white md:col-span-2"
            placeholder="Video URL (optional .mp4)"
            value={form.videoUrl}
            onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
          />
          <input
            className="bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            className="bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white"
            placeholder="Subtitle"
            value={form.subtitle}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
          />
          <input
            className="bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white"
            placeholder="Button label"
            value={form.ctaLabel}
            onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })}
          />
          <input
            className="bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white"
            placeholder="Button link e.g. /shop"
            value={form.ctaHref}
            onChange={(e) => setForm({ ...form, ctaHref: e.target.value })}
          />
          <input
            type="number"
            className="bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white"
            placeholder="Sort order"
            value={form.sortOrder}
            onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
          />
          <label className="flex items-center gap-2 text-zinc-400 text-sm">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            Active
          </label>
          <button
            type="submit"
            className="md:col-span-2 inline-flex justify-center items-center gap-2 py-3 rounded-xl bg-gradient-to-r from-berry-600 to-berry-500 text-white font-medium"
          >
            <Plus size={18} /> Add slide
          </button>
        </form>
      </div>

      <div className="space-y-6">
        {slides.map((slide) => (
          <div key={slide.id} className="glass-card rounded-2xl border border-white/5 p-6 space-y-4">
            <div className="flex flex-wrap justify-between gap-4">
              <span className="text-xs uppercase tracking-wider text-zinc-500">Slide #{slide.sortOrder}</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => saveSlide(slide)}
                  disabled={savingId === slide.id}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-berry-600/80 text-white text-sm disabled:opacity-50"
                >
                  <Save size={16} /> {savingId === slide.id ? 'Saving…' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => deleteSlide(slide.id)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-300 text-sm"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <input
                className="bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white md:col-span-2"
                value={slide.imageUrl}
                onChange={(e) => updateField(slide.id, 'imageUrl', e.target.value)}
              />
              <input
                className="bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white md:col-span-2"
                placeholder="Video URL (optional)"
                value={slide.videoUrl || ''}
                onChange={(e) => updateField(slide.id, 'videoUrl', e.target.value || null)}
              />
              <input
                className="bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white"
                value={slide.title}
                onChange={(e) => updateField(slide.id, 'title', e.target.value)}
              />
              <input
                className="bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white"
                value={slide.subtitle || ''}
                onChange={(e) => updateField(slide.id, 'subtitle', e.target.value)}
              />
              <input
                className="bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white"
                value={slide.ctaLabel}
                onChange={(e) => updateField(slide.id, 'ctaLabel', e.target.value)}
              />
              <input
                className="bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white"
                value={slide.ctaHref}
                onChange={(e) => updateField(slide.id, 'ctaHref', e.target.value)}
              />
              <input
                type="number"
                className="bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white"
                value={slide.sortOrder}
                onChange={(e) => updateField(slide.id, 'sortOrder', Number(e.target.value))}
              />
              <label className="flex items-center gap-2 text-zinc-400 text-sm">
                <input
                  type="checkbox"
                  checked={slide.active}
                  onChange={(e) => updateField(slide.id, 'active', e.target.checked)}
                />
                Active
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
