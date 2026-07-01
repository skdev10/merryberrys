'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { adminFetch } from '@/lib/adminClient';
import { Save, Image as ImageIcon, Layout, Home, BookOpen, Sparkles } from 'lucide-react';
import { DEFAULT_SITE_MEDIA } from '@/lib/siteSettingsDefaults';
import ImageUrlField from '@/components/admin/ImageUrlField';
import HeroSlidesManager from '@/components/admin/HeroSlidesManager';

const TABS = [
  { id: 'logo', label: 'Logo', icon: Sparkles },
  { id: 'hero', label: 'Hero banners', icon: Layout },
  { id: 'home', label: 'Homepage', icon: Home },
  { id: 'collections', label: 'Collections', icon: BookOpen },
  { id: 'about', label: 'About', icon: ImageIcon },
];

function TextField({ label, value, onChange, multiline }) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-zinc-500 uppercase tracking-wider">{label}</label>
      {multiline ? (
        <textarea
          rows={3}
          className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm resize-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

export default function AdminMediaPage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'logo';
  const [tab, setTab] = useState(initialTab);
  const [settings, setSettings] = useState(DEFAULT_SITE_MEDIA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    adminFetch('/api/admin/site-settings')
      .then((r) => r.json())
      .then((d) => {
        if (d.settings) setSettings(d.settings);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const t = searchParams.get('tab');
    if (t) setTab(t);
  }, [searchParams]);

  const save = async () => {
    setSaving(true);
    setMessage('');
    const payload = {
      ...settings,
      homepageEditorialImage: settings.homepageEditorial?.image || settings.homepageEditorialImage,
    };
    try {
      const res = await adminFetch('/api/admin/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: payload }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || 'Save failed');
        return;
      }
      setSettings(data.settings);
      setMessage('✓ Saved! Website refresh karein (Ctrl+F5) changes dekhne ke liye.');
      window.dispatchEvent(new Event('site-settings-updated'));
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

  const updateEditorial = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      homepageEditorial: { ...prev.homepageEditorial, [field]: value },
    }));
  };

  const updateHeroFallback = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      heroFallback: { ...prev.heroFallback, [field]: value },
    }));
  };

  if (loading) {
    return <div className="py-20 text-center text-zinc-500">Loading media center…</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl w-full">
      <div>
        <h1 className="text-3xl font-serif text-white mb-1">Media Center</h1>
        <p className="text-zinc-500 text-sm max-w-2xl">
          Yahan se website ki <strong className="text-zinc-300">sari images</strong> change karein.
          Photo select karein → <strong className="text-zinc-300">Save page settings</strong> — website par
          permanently update ho jayegi. Product photos → Products menu.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-colors ${
              tab === id
                ? 'bg-berry-600 text-white'
                : 'bg-zinc-900/50 text-zinc-400 hover:text-white border border-white/5'
            }`}
          >
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      {message && (
        <p className="text-sm text-berry-300 bg-berry-500/10 border border-berry-500/20 rounded-xl px-4 py-3">
          {message}
        </p>
      )}

      {tab === 'logo' && (
        <section className="glass-card rounded-2xl border border-white/5 p-6 space-y-5">
          <h2 className="text-lg text-white">Logo & branding</h2>
          <ImageUrlField
            label="Website logo (navbar)"
            hint="Khali chhoro to text logo dikhega"
            value={settings.logoUrl}
            onChange={(v) => setSettings({ ...settings, logoUrl: v })}
          />
          <TextField
            label="Logo text (jab image nahi)"
            value={settings.logoText}
            onChange={(v) => setSettings({ ...settings, logoText: v })}
          />
          <ImageUrlField
            label="Footer logo (optional)"
            value={settings.footerLogoUrl}
            onChange={(v) => setSettings({ ...settings, footerLogoUrl: v })}
          />
          <ImageUrlField
            label="Admin login page background"
            value={settings.adminLoginBackground}
            onChange={(v) => setSettings({ ...settings, adminLoginBackground: v })}
          />
        </section>
      )}

      {tab === 'hero' && <HeroSlidesManager />}

      {tab === 'hero' && (
        <section className="glass-card rounded-2xl border border-white/5 p-6 space-y-4">
          <h2 className="text-lg text-white">Hero fallback (jab slides nahi hon)</h2>
          <p className="text-xs text-zinc-500">Agar koi active slide nahi, ye image + text dikhega</p>
          <ImageUrlField
            label="Fallback image"
            value={settings.heroFallback?.image}
            onChange={(v) => updateHeroFallback('image', v)}
          />
          <div className="grid gap-3 md:grid-cols-2">
            <TextField label="Badge text" value={settings.heroFallback?.badge} onChange={(v) => updateHeroFallback('badge', v)} />
            <TextField label="Title" value={settings.heroFallback?.title} onChange={(v) => updateHeroFallback('title', v)} />
            <TextField label="Subtitle" value={settings.heroFallback?.subtitle} onChange={(v) => updateHeroFallback('subtitle', v)} multiline />
            <TextField label="Button text" value={settings.heroFallback?.ctaLabel} onChange={(v) => updateHeroFallback('ctaLabel', v)} />
            <TextField label="Button link" value={settings.heroFallback?.ctaHref} onChange={(v) => updateHeroFallback('ctaHref', v)} />
          </div>
        </section>
      )}

      {tab === 'home' && (
        <>
          <section className="glass-card rounded-2xl border border-white/5 p-6 space-y-6">
            <h2 className="text-lg text-white">Homepage — 4 category boxes</h2>
            {settings.homepageCollections.map((col, i) => (
              <div key={i} className="border border-white/5 rounded-xl p-4 space-y-3">
                <p className="text-xs text-zinc-500 uppercase">Box {i + 1}</p>
                <ImageUrlField value={col.src} onChange={(v) => updateCollection(i, 'src', v)} />
                <div className="grid gap-3 md:grid-cols-2">
                  <TextField label="Title" value={col.title} onChange={(v) => updateCollection(i, 'title', v)} />
                  <TextField label="Subtitle" value={col.subtitle} onChange={(v) => updateCollection(i, 'subtitle', v)} />
                </div>
                <TextField label="Link" value={col.href} onChange={(v) => updateCollection(i, 'href', v)} />
              </div>
            ))}
          </section>
          <section className="glass-card rounded-2xl border border-white/5 p-6 space-y-4">
            <h2 className="text-lg text-white">Homepage — big editorial banner</h2>
            <ImageUrlField
              label="Background image"
              value={settings.homepageEditorial?.image}
              onChange={(v) => updateEditorial('image', v)}
            />
            <TextField label="Small caption" value={settings.homepageEditorial?.caption} onChange={(v) => updateEditorial('caption', v)} />
            <div className="grid gap-3 md:grid-cols-2">
              <TextField label="Title line 1" value={settings.homepageEditorial?.titleLine1} onChange={(v) => updateEditorial('titleLine1', v)} />
              <TextField label="Title line 2 (italic)" value={settings.homepageEditorial?.titleLine2} onChange={(v) => updateEditorial('titleLine2', v)} />
            </div>
            <TextField label="Paragraph" value={settings.homepageEditorial?.body} onChange={(v) => updateEditorial('body', v)} multiline />
            <div className="grid gap-3 md:grid-cols-2">
              <TextField label="Button text" value={settings.homepageEditorial?.buttonLabel} onChange={(v) => updateEditorial('buttonLabel', v)} />
              <TextField label="Button link" value={settings.homepageEditorial?.buttonHref} onChange={(v) => updateEditorial('buttonHref', v)} />
            </div>
          </section>
        </>
      )}

      {tab === 'collections' && (
        <section className="glass-card rounded-2xl border border-white/5 p-6 space-y-6">
          <h2 className="text-lg text-white">Collections page</h2>
          {settings.collectionsPage.map((col, i) => (
            <div key={col.id || i} className="border border-white/5 rounded-xl p-4 space-y-3">
              <p className="text-xs text-zinc-500 uppercase">Collection {i + 1}</p>
              <ImageUrlField value={col.image} onChange={(v) => updateCollectionsPage(i, 'image', v)} />
              <div className="grid gap-3 md:grid-cols-2">
                <TextField label="Name" value={col.name} onChange={(v) => updateCollectionsPage(i, 'name', v)} />
                <TextField label="Description" value={col.description} onChange={(v) => updateCollectionsPage(i, 'description', v)} />
              </div>
              <TextField label="Link" value={col.href} onChange={(v) => updateCollectionsPage(i, 'href', v)} />
            </div>
          ))}
        </section>
      )}

      {tab === 'about' && (
        <section className="glass-card rounded-2xl border border-white/5 p-6 space-y-6">
          <h2 className="text-lg text-white">About page — all images</h2>
          {[
            ['hero', 'Top hero banner'],
            ['craftsmanship', 'Our story section'],
            ['quality', 'Quality section'],
            ['team', 'Team section'],
            ['promise', 'Brand promise (wide banner)'],
          ].map(([key, label]) => (
            <ImageUrlField
              key={key}
              label={label}
              value={settings.aboutImages[key]}
              onChange={(v) => updateAbout(key, v)}
            />
          ))}
        </section>
      )}

      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-berry-600 to-berry-500 text-white font-medium disabled:opacity-50"
      >
        <Save size={18} /> {saving ? 'Saving…' : 'Save page settings'}
      </button>
      <p className="text-xs text-zinc-600">Hero slides upar apne Save button se save hoti hain.</p>
    </div>
  );
}
