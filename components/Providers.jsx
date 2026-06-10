'use client';

import { Toaster } from 'react-hot-toast';
import { SiteSettingsProvider } from '@/components/SiteSettingsProvider';

export default function Providers({ children }) {
  return (
    <SiteSettingsProvider>
      {children}
      <Toaster
        position="top-center"
        containerStyle={{ zIndex: 99999 }}
        toastOptions={{
          duration: 2800,
          style: {
            background: '#0a0a0a',
            color: '#fafafa',
            fontSize: '14px',
          },
        }}
      />
    </SiteSettingsProvider>
  );
}
