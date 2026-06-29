'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { DEFAULT_SITE_MEDIA } from '@/lib/siteSettingsDefaults';

const SiteSettingsContext = createContext(DEFAULT_SITE_MEDIA);

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SITE_MEDIA);

  const reload = useCallback(() => {
    fetch('/api/site-settings', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (d.settings) setSettings(d.settings);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    reload();
    const onUpdate = () => reload();
    window.addEventListener('site-settings-updated', onUpdate);
    return () => window.removeEventListener('site-settings-updated', onUpdate);
  }, [reload]);

  return (
    <SiteSettingsContext.Provider value={settings}>{children}</SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
