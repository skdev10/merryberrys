'use client';

import { useSiteSettings } from '@/components/SiteSettingsProvider';

export function NavbarLogo({ scrolled, variant = 'default' }) {
  const { logoUrl, logoText } = useSiteSettings();

  const imageClassName =
    variant === 'menu'
      ? 'h-14 sm:h-16 md:h-[4.5rem] w-auto max-w-[280px] sm:max-w-[340px] object-contain'
      : 'h-12 sm:h-14 md:h-16 lg:h-[4.5rem] w-auto max-w-[240px] sm:max-w-[300px] md:max-w-[340px] lg:max-w-[380px] object-contain';

  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={logoText || 'Logo'}
        className={imageClassName}
      />
    );
  }

  return (
    <h1
      className={`font-serif text-2xl md:text-3xl tracking-[0.15em] font-medium transition-colors ${
        scrolled ? 'text-luxury-black' : 'text-luxury-black'
      }`}
    >
      {logoText || 'MERRY BERRY'}
    </h1>
  );
}

export function FooterLogo() {
  const { footerLogoUrl, logoUrl, logoText } = useSiteSettings();
  const src = footerLogoUrl || logoUrl;

  if (src) {
    return (
      <img
        src={src}
        alt={logoText || 'Merry Berry'}
        className="h-14 sm:h-16 md:h-[4.5rem] w-auto max-w-[240px] sm:max-w-[300px] md:max-w-[360px] object-contain"
      />
    );
  }

  return (
    <>
      <div className="w-10 h-10 bg-gradient-to-br from-berry-500 to-gold-500 rounded-full flex items-center justify-center">
        <span className="text-white font-bold text-lg">M</span>
      </div>
      <span className="font-serif text-2xl font-bold tracking-tight text-white">
        MERRY <span className="text-berry-500">BERRY</span>
      </span>
    </>
  );
}
