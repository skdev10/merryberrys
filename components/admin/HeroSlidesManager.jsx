'use client';

import { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/adminClient';
import { Plus, Trash2, Save } from 'lucide-react';
import ImageUrlField from './ImageUrlField';

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

export default function HeroSlidesManager() {
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
    setSlides((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
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
    return <div className="py-8 text-center text-zinc-500">Loading hero slides…</div>;
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-500">
        Homepage top par jo bari rotating banners hain — yahan se change karein. Kam slides ho to &quot;Hero
        fallback&quot; tab use hota hai.
      </p>

      <form onSubmit={addSlide} className="glass-card rounded-2xl border border-white/5 p-5 space-y-4">
        <h3 className="text-white font-medium flex items-center gap-2">
          <Plus size={18} className="text-berry-400" /> Naya slide add karein
        </h3>
        <ImageUrlField
          label="Slide image"
          value={form.imageUrl}
          onChange={(v) => setForm({ ...form, imageUrl: v })}
        />
        <div className="grid gap-3 md:grid-cols-2">
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
            placeholder="Button text"
            value={form.ctaLabel}
            onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })}
          />
          <input
            className="bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white"
            placeholder="Button link e.g. /shop"
            value={form.ctaHref}
            onChange={(e) => setForm({ ...form, ctaHref: e.target.value })}
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-berry-600 text-white text-sm"
        >
          <Plus size={16} /> Add slide
        </button>
      </form>

      {slides.map((slide) => (
        <div key={slide.id} className="glass-card rounded-2xl border border-white/5 p-5 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-zinc-500 uppercase">Slide #{slide.sortOrder}</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => saveSlide(slide)}
                disabled={savingId === slide.id}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-berry-600/80 text-white text-sm disabled:opacity-50"
              >
                <Save size={14} /> {savingId === slide.id ? 'Saving…' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => deleteSlide(slide.id)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/20 text-red-300 text-sm"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          <ImageUrlField
            label="Image"
            value={slide.imageUrl}
            onChange={(v) => updateField(slide.id, 'imageUrl', v)}
          />
          <div className="grid gap-3 md:grid-cols-2">
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
          </div>
          <label className="flex items-center gap-2 text-zinc-400 text-sm">
            <input
              type="checkbox"
              checked={slide.active}
              onChange={(e) => updateField(slide.id, 'active', e.target.checked)}
            />
            Active (website par dikhe)
          </label>
        </div>
      ))}
    </div>
  );
}
