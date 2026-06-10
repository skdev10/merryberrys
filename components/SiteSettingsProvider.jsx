'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { DEFAULT_SITE_MEDIA } from '@/lib/siteSettingsDefaults';

const SiteSettingsContext = createContext(DEFAULT_SITE_MEDIA);

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SITE_MEDIA);

  useEffect(() => {
    fetch('/api/site-settings', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (d.settings) setSettings(d.settings);
      })
      .catch(() => {});
  }, []);

  return (
    <SiteSettingsContext.Provider value={settings}>{children}</SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
