'use client';

import { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/adminClient';
import { Save, Image as ImageIcon } from 'lucide-react';
import { DEFAULT_SITE_MEDIA } from '@/lib/siteSettingsDefaults';

function ImagePreview({ url, label }) {
  if (!url) return null;
  return (
    <div className="space-y-1">
      <p className="text-xs text-zinc-500">{label}</p>
      <img
        src={url}
        alt=""
        className="h-20 w-full max-w-xs rounded-lg border border-white/10 object-cover bg-zinc-900"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
    </div>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-zinc-500 uppercase tracking-wider">{label}</label>
      <input
        className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

export default function AdminSiteImagesPage() {
  const [settings, setSettings] = useState(DEFAULT_SITE_MEDIA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    adminFetch('/api/admin/site-settings')
      .then((r) => r.json())
      .then((d) => {
        if (d.settings) setSettings(d.settings);
      })
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    setMessage('');
    try {
      const res = await adminFetch('/api/admin/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || 'Save failed');
        return;
      }
      setSettings(data.settings);
      setMessage('Saved! Refresh the website to see changes.');
    } finally {
      setSaving(false);
    }
  };

  const updateCollection = (index, field, value) => {
    setSettings((prev) => ({
      ...prev,
      homepageCollections: prev.homepageCollections.map((c, i) =>
        i === index ? { ...c, [field]: value } : c
      ),
    }));
  };

  const updateCollectionsPage = (index, field, value) => {
    setSettings((prev) => ({
      ...prev,
      collectionsPage: prev.collectionsPage.map((c, i) =>
        i === index ? { ...c, [field]: value } : c
      ),
    }));
  };

  const updateAbout = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      aboutImages: { ...prev.aboutImages, [key]: value },
    }));
  };

  if (loading) {
    return <div className="py-20 text-center text-zinc-500">Loading site images…</div>;
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-serif text-white mb-1">Site images & logo</h1>
        <p className="text-zinc-500 text-sm max-w-2xl">
          Change logo and all homepage, collections, and about page images. Paste a hosted image URL
          (ImgBB, Cloudinary, your server). Product images are under Products; hero carousel under
          Banners.
        </p>
      </div>

      {message && (
        <p className="text-sm text-berry-300 bg-berry-500/10 border border-berry-500/20 rounded-xl px-4 py-3">
          {message}
        </p>
      )}

      <section className="glass-card rounded-2xl border border-white/5 p-6 space-y-4">
        <h2 className="text-lg text-white flex items-center gap-2">
          <ImageIcon size={18} className="text-berry-400" /> Logo
        </h2>
        <Field
          label="Logo image URL (optional — leave empty for text logo)"
          value={settings.logoUrl}
          onChange={(v) => setSettings({ ...settings, logoUrl: v })}
          placeholder="https://…"
        />
        <ImagePreview url={settings.logoUrl} label="Preview" />
        <Field
          label="Logo text (shown when no image)"
          value={settings.logoText}
          onChange={(v) => setSettings({ ...settings, logoText: v })}
        />
        <Field
          label="Footer logo URL (optional)"
          value={settings.footerLogoUrl}
          onChange={(v) => setSettings({ ...settings, footerLogoUrl: v })}
        />
        <ImagePreview url={settings.footerLogoUrl} label="Footer preview" />
      </section>

      <section className="glass-card rounded-2xl border border-white/5 p-6 space-y-6">
        <h2 className="text-lg text-white">Homepage category tiles</h2>
        {settings.homepageCollections.map((col, i) => (
          <div key={i} className="border border-white/5 rounded-xl p-4 space-y-3">
            <p className="text-xs text-zinc-500 uppercase">Tile {i + 1}</p>
            <Field label="Image URL" value={col.src} onChange={(v) => updateCollection(i, 'src', v)} />
            <ImagePreview url={col.src} label="Preview" />
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Title" value={col.title} onChange={(v) => updateCollection(i, 'title', v)} />
              <Field label="Subtitle" value={col.subtitle} onChange={(v) => updateCollection(i, 'subtitle', v)} />
            </div>
            <Field label="Link" value={col.href} onChange={(v) => updateCollection(i, 'href', v)} />
          </div>
        ))}
      </section>

      <section className="glass-card rounded-2xl border border-white/5 p-6 space-y-4">
        <h2 className="text-lg text-white">Homepage editorial banner</h2>
        <Field
          label="Image URL"
          value={settings.homepageEditorialImage}
          onChange={(v) => setSettings({ ...settings, homepageEditorialImage: v })}
        />
        <ImagePreview url={settings.homepageEditorialImage} label="Preview" />
      </section>

      <section className="glass-card rounded-2xl border border-white/5 p-6 space-y-6">
        <h2 className="text-lg text-white">Collections page</h2>
        {settings.collectionsPage.map((col, i) => (
          <div key={col.id || i} className="border border-white/5 rounded-xl p-4 space-y-3">
            <p className="text-xs text-zinc-500 uppercase">Collection {i + 1}</p>
            <Field label="Image URL" value={col.image} onChange={(v) => updateCollectionsPage(i, 'image', v)} />
            <ImagePreview url={col.image} label="Preview" />
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Name" value={col.name} onChange={(v) => updateCollectionsPage(i, 'name', v)} />
              <Field label="Description" value={col.description} onChange={(v) => updateCollectionsPage(i, 'description', v)} />
            </div>
            <Field label="Link" value={col.href} onChange={(v) => updateCollectionsPage(i, 'href', v)} />
          </div>
        ))}
      </section>

      <section className="glass-card rounded-2xl border border-white/5 p-6 space-y-6">
        <h2 className="text-lg text-white">About page images</h2>
        {[
          ['hero', 'Hero banner'],
          ['craftsmanship', 'Craftsmanship section'],
          ['quality', 'Quality section'],
          ['team', 'Team section'],
          ['promise', 'Brand promise banner'],
        ].map(([key, label]) => (
          <div key={key} className="space-y-2">
            <Field
              label={label}
              value={settings.aboutImages[key]}
              onChange={(v) => updateAbout(key, v)}
            />
            <ImagePreview url={settings.aboutImages[key]} label="Preview" />
          </div>
        ))}
      </section>

      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-berry-600 to-berry-500 text-white font-medium disabled:opacity-50"
      >
        <Save size={18} /> {saving ? 'Saving…' : 'Save all site images'}
      </button>
    </div>
  );
}
