/**
 * Fashion imagery from Pexels & Pixabay (free use per site licenses).
 * Editorial / luxury retail aesthetic (similar mood to premium lookbooks); CDN URLs load reliably worldwide.
 */
export const pexelsPhoto = (id, w = 1920) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

const px = pexelsPhoto;

/** Path after /photo/ e.g. 2016/11/29/13/14/attractive-1869564_1280.jpg */
const pixabay = (path) => `https://cdn.pixabay.com/photo/${path}`;

/** Fallback when a product has no image */
export const PRODUCT_IMAGE_FALLBACK = px('5701645', 800);

export const heroSlides = [
  {
    id: 'hero-1',
    src: px('1040945', 1920),
    caption: 'Spring / Summer 2026',
    headingLine1: 'Quiet',
    headingLine2: 'Luxury',
    subtitle:
      'Editorial tailoring, fluid fabrics, and refined essentials—designed for wardrobes that favor longevity over noise.',
    primaryHref: '/shop',
    primaryLabel: 'Shop the edit',
    secondaryHref: '/collections',
    secondaryLabel: 'Collections',
  },
  {
    id: 'hero-2',
    src: px('1926764', 1920),
    caption: 'New arrivals weekly',
    headingLine1: 'Modern',
    headingLine2: 'Silhouettes',
    subtitle:
      'Sculpted lines, premium fibers, and a restrained palette—pieces that move effortlessly from day to evening.',
    primaryHref: '/shop?sort=new',
    primaryLabel: 'New arrivals',
    secondaryHref: '/about',
    secondaryLabel: 'Our craft',
  },
  {
    id: 'hero-3',
    src: pixabay('2016/11/29/13/14/attractive-1869564_1280.jpg'),
    caption: 'Outerwear & layers',
    headingLine1: 'Built',
    headingLine2: 'To Endure',
    subtitle:
      'Investment outerwear and knit layers chosen for drape, comfort, and years of wear—not a single season.',
    primaryHref: '/shop',
    primaryLabel: 'Explore',
    secondaryHref: '/collections',
    secondaryLabel: 'Lookbook',
  },
];

export const collectionTiles = [
  {
    id: 'col-1',
    src: px('1536619', 1200),
    title: 'Summer 2026',
    subtitle: 'Light layers',
    href: '/shop?sort=new',
  },
  {
    id: 'col-2',
    src: px('1346187', 1200),
    title: 'Evening',
    subtitle: 'After dark',
    href: '/shop',
  },
  {
    id: 'col-3',
    src: pixabay('2016/11/29/09/16/clothes-1867833_1280.jpg'),
    title: 'Essentials',
    subtitle: 'Everyday',
    href: '/shop',
  },
];

export const editorialBannerSrc = px('1462637', 1920);

/** Full-bleed backgrounds (admin login, etc.) */
export const adminLoginBackdropSrc = px('1926764', 1920);

/** Collections grid cards — four distinct editorial shots */
export const COLLECTION_CARD_IMAGES = [
  px('1536619', 1400),
  px('1346187', 1400),
  px('1484822', 1400),
  px('5701645', 1400),
];

/** Custom print page — sample “uploaded” artwork preview */
export const CUSTOM_PRINT_SAMPLE_SRC = px('1188750', 800);
