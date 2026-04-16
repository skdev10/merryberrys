'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LuxuryNavbar from '../../components/LuxuryNavbar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SITE } from '@/lib/site';
import { COLLECTION_CARD_IMAGES } from '@/lib/brandAssets';

const px2000 = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=2000`;

const bannerSlides = [
  {
    src: px2000('1040945'),
    title: 'Seasonal Stories',
    subtitle: 'Editorial picks from our design studio',
  },
  {
    src: px2000('1926764'),
    title: 'Runway to Reality',
    subtitle: 'Luxury you can live in every day',
  },
  {
    src: px2000('1462637'),
    title: 'Texture & Light',
    subtitle: 'Fabrics chosen for drape, hand-feel, and longevity',
  },
];

const collections = [
  {
    id: 1,
    name: 'Summer 2026',
    description: 'Light, airy pieces for the warm season',
    image: COLLECTION_CARD_IMAGES[0],
    itemCount: 24,
  },
  {
    id: 2,
    name: 'Evening Edit',
    description: 'Elegant pieces for special occasions',
    image: COLLECTION_CARD_IMAGES[1],
    itemCount: 18,
  },
  {
    id: 3,
    name: 'Essentials',
    description: 'Timeless staples for every wardrobe',
    image: COLLECTION_CARD_IMAGES[2],
    itemCount: 32,
  },
  {
    id: 4,
    name: 'Winter Collection',
    description: 'Cozy luxury for cold days',
    image: COLLECTION_CARD_IMAGES[3],
    itemCount: 28,
  },
];

export default function CollectionsPage() {
  const [bannerIdx, setBannerIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setBannerIdx((i) => (i + 1) % bannerSlides.length),
      5500
    );
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <LuxuryNavbar />
      
      <main className="pt-32 pb-20 bg-luxury-white min-h-screen">
        <section className="relative h-[42vh] min-h-[280px] max-h-[480px] w-full overflow-hidden mb-16">
          {bannerSlides.map((b, i) => (
            <div
              key={b.src}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                i === bannerIdx ? 'opacity-100 z-0' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <Image src={b.src} alt="" fill className="object-cover" sizes="100vw" priority={i === 0} />
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/55 via-luxury-black/15 to-transparent" />
            </div>
          ))}
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6">
            <p className="text-luxury-caption text-luxury-white/80 mb-3">{bannerSlides[bannerIdx].subtitle}</p>
            <h2 className="font-serif text-4xl md:text-5xl text-luxury-white drop-shadow-sm">
              {bannerSlides[bannerIdx].title}
            </h2>
          </div>
          <button
            type="button"
            onClick={() =>
              setBannerIdx((i) => (i - 1 + bannerSlides.length) % bannerSlides.length)
            }
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-luxury-white/90 flex items-center justify-center hover:bg-white"
            aria-label="Previous"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            onClick={() => setBannerIdx((i) => (i + 1) % bannerSlides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-luxury-white/90 flex items-center justify-center hover:bg-white"
            aria-label="Next"
          >
            <ChevronRight size={22} />
          </button>
        </section>

        {/* Header */}
        <div className="container-luxury mb-16">
          <div className="text-center">
            <p className="text-luxury-caption text-luxury-taupe mb-4">Curated For You</p>
            <h1 className="text-luxury-subheading text-luxury-black mb-6">
              Our Collections
            </h1>
            <p className="text-luxury-body text-luxury-taupe max-w-2xl mx-auto">
              Explore our thoughtfully curated collections, each designed to bring timeless elegance to your wardrobe.
            </p>
          </div>
        </div>

        {/* Collections Grid */}
        <div className="container-luxury">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {collections.map((collection, index) => (
              <Link
                key={collection.id}
                href="/shop"
                className="group relative aspect-[4/3] overflow-hidden"
              >
                <Image
                  src={collection.image}
                  alt={collection.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/70 via-luxury-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <p className="text-luxury-caption text-luxury-white/70 mb-2">
                    {collection.itemCount} Items
                  </p>
                  <h2 className="font-serif text-3xl md:text-4xl text-luxury-white mb-2">
                    {collection.name}
                  </h2>
                  <p className="text-luxury-white/80">
                    {collection.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="container-luxury mt-24">
          <div className="bg-luxury-cream py-16 px-8 text-center">
            <h2 className="font-serif text-3xl md:text-4xl text-luxury-black mb-4">
              Discover Your Style
            </h2>
            <p className="text-luxury-body text-luxury-taupe mb-8 max-w-xl mx-auto">
              Browse our complete collection of premium garments crafted with meticulous attention to detail.
            </p>
            <Link href="/shop" className="btn-luxury">
              <span>Shop All</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-luxury-black text-luxury-white pt-20 pb-8">
        <div className="container-luxury">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <h2 className="font-serif text-2xl tracking-[0.15em] mb-6">MERRY BERRY</h2>
              <p className="text-sm text-luxury-white/60 leading-relaxed">
                Crafting timeless elegance since 2016. Each piece tells a story of meticulous craftsmanship and enduring style.
              </p>
            </div>
            
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] text-luxury-gold mb-6">Shop</h3>
              <ul className="space-y-3">
                {['New Arrivals', 'Women', 'Men', 'Accessories', 'Sale'].map((item) => (
                  <li key={item}>
                    <Link href="/shop" className="text-sm text-luxury-white/60 hover:text-luxury-gold transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] text-luxury-gold mb-6">Help</h3>
              <ul className="space-y-3">
                {['Contact Us', 'Shipping Info', 'Returns', 'Size Guide', 'FAQ'].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-sm text-luxury-white/60 hover:text-luxury-gold transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] text-luxury-gold mb-6">Contact</h3>
              <ul className="space-y-3 text-sm text-luxury-white/60">
                <li>
                  <a href={`mailto:${SITE.email}`} className="hover:text-luxury-gold transition-colors">{SITE.email}</a>
                </li>
                <li>
                  <a href={`tel:${SITE.phoneTel}`} className="hover:text-luxury-gold transition-colors">{SITE.phoneDisplay}</a>
                </li>
                <li>Pakistan</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-luxury-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-luxury-white/40">
              © 2026 Merry Berry. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs uppercase tracking-[0.15em] text-luxury-white/40 hover:text-luxury-gold transition-colors"
              >
                Instagram
              </a>
              <a
                href={SITE.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs uppercase tracking-[0.15em] text-luxury-white/40 hover:text-luxury-gold transition-colors"
              >
                Facebook
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
