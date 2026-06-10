/** Default site media — used when DB has no row or partial data. */
export const DEFAULT_SITE_MEDIA = {
  logoUrl: '',
  logoText: 'MERRY BERRY',
  footerLogoUrl: '',
  homepageCollections: [
    {
      src: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=1200&q=85&auto=format&fit=crop',
      title: "Men's Lower",
      subtitle: 'Baggy, Cargo & Straight Fit',
      href: '/shop?category=baggy-jeans',
    },
    {
      src: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1200&q=85&auto=format&fit=crop',
      title: "Men's Upper",
      subtitle: 'Polos, Graphic Tees & More',
      href: '/shop?category=basic-t-shirt',
    },
    {
      src: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=1200&q=85&auto=format&fit=crop',
      title: 'Winter Edit',
      subtitle: 'Puffers, Hoodies & Jackets',
      href: '/shop?category=hoodie',
    },
    {
      src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=85&auto=format&fit=crop',
      title: 'Women & Kids',
      subtitle: 'Long Shirts & Kids Wear',
      href: '/shop?category=long-shirt',
    },
  ],
  homepageEditorialImage:
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&q=80&auto=format&fit=crop',
  collectionsPage: [
    {
      id: 1,
      name: 'Summer 2026',
      description: 'Light, airy pieces for the warm season',
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=1200&q=85&auto=format&fit=crop',
      itemCount: 24,
      href: '/shop?sort=new',
    },
    {
      id: 2,
      name: 'Evening Edit',
      description: 'Elegant pieces for special occasions',
      image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80',
      itemCount: 18,
      href: '/shop?category=formal-shirt',
    },
    {
      id: 3,
      name: 'Essentials',
      description: 'Timeless staples for every wardrobe',
      image: 'https://images.unsplash.com/photo-1496745911865-6eaf0dc4b?w=800&q=80',
      itemCount: 32,
      href: '/shop?category=basic-t-shirt',
    },
    {
      id: 4,
      name: 'Winter Collection',
      description: 'Cozy luxury for cold days',
      image: 'https://images.unsplash.com/photo-1539533018447-63fcce268581?w=800&q=80',
      itemCount: 28,
      href: '/shop?category=hoodie',
    },
  ],
  aboutImages: {
    hero: '/images/about-premium-tshirt.png',
    craftsmanship:
      'https://images.unsplash.com/photo-1618354691373-d851c43c8a0a?w=800&q=90&auto=format&fit=crop',
    quality:
      'https://images.unsplash.com/photo-1586105256595-7d9c9c4e8c0c?w=800&q=90&auto=format&fit=crop',
    team: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=90&auto=format&fit=crop',
    promise:
      'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=1600&q=90&auto=format&fit=crop',
  },
};

export const SITE_MEDIA_KEY = 'site_media';

export function mergeSiteMedia(parsed) {
  if (!parsed || typeof parsed !== 'object') return { ...DEFAULT_SITE_MEDIA };
  return {
    logoUrl: parsed.logoUrl ?? DEFAULT_SITE_MEDIA.logoUrl,
    logoText: parsed.logoText ?? DEFAULT_SITE_MEDIA.logoText,
    footerLogoUrl: parsed.footerLogoUrl ?? DEFAULT_SITE_MEDIA.footerLogoUrl,
    homepageCollections: Array.isArray(parsed.homepageCollections)
      ? parsed.homepageCollections
      : DEFAULT_SITE_MEDIA.homepageCollections,
    homepageEditorialImage:
      parsed.homepageEditorialImage ?? DEFAULT_SITE_MEDIA.homepageEditorialImage,
    collectionsPage: Array.isArray(parsed.collectionsPage)
      ? parsed.collectionsPage
      : DEFAULT_SITE_MEDIA.collectionsPage,
    aboutImages: {
      ...DEFAULT_SITE_MEDIA.aboutImages,
      ...(parsed.aboutImages || {}),
    },
  };
}
