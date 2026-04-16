'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LuxuryNavbar from '../components/LuxuryNavbar';
import HeroCarousel from '../components/HeroCarousel';
import { ArrowRight, Truck, Shield, RefreshCw } from 'lucide-react';
import {
  heroSlides,
  collectionTiles,
  editorialBannerSrc,
  PRODUCT_IMAGE_FALLBACK,
} from '@/lib/brandAssets';
import { formatPKR, FREE_SHIPPING_MIN_PKR } from '@/lib/currency';
import { SITE } from '@/lib/site';

const px800 = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=800`;

const fallbackProducts = [
  {
    id: 1,
    name: 'Silk Evening Dress',
    price: 12999,
    image: px800('1040945'),
    hoverImage: px800('1536619'),
  },
  {
    id: 2,
    name: 'Tailored Wool Coat',
    price: 18999,
    image: px800('1926764'),
    hoverImage: px800('1462637'),
  },
  {
    id: 3,
    name: 'Cashmere Sweater',
    price: 9999,
    image: px800('1346187'),
    hoverImage: PRODUCT_IMAGE_FALLBACK,
  },
  {
    id: 4,
    name: 'Linen Blazer',
    price: 14999,
    image: px800('1484822'),
    hoverImage: px800('1188750'),
  },
];

export default function LuxuryHome() {
  const revealRefs = useRef([]);
  const [products, setProducts] = useState(fallbackProducts);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/products?limit=8');
        const data = await res.json();
        const list = data.products || [];
        if (!list.length || cancelled) return;
        const mapped = list.slice(0, 8).map((p) => {
          let imgs = [];
          try {
            imgs = JSON.parse(p.images || '[]');
          } catch {
            imgs = [];
          }
          const hover = imgs[1] || imgs[0] || PRODUCT_IMAGE_FALLBACK;
          return {
            id: p.id,
            name: p.name,
            price: p.price,
            image: imgs[0] || hover,
            hoverImage: hover,
          };
        });
        setProducts(mapped);
      } catch {
        /* keep fallback */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    const nodes = revealRefs.current.filter(Boolean);
    nodes.forEach((el) => observer.observe(el));

    return () => {
      nodes.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [products]);

  const addToRefs = (el) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  return (
    <>
      <LuxuryNavbar />
      
      <main className="bg-luxury-white">
        {/* Hero Carousel */}
        <HeroCarousel slides={heroSlides} intervalMs={6500} />

        {/* Featured Collections */}
        <section className="section-luxury bg-luxury-cream">
          <div className="container-luxury">
            <div ref={addToRefs} className="reveal reveal-on-scroll text-center mb-12 md:mb-16">
              <p className="text-luxury-caption text-luxury-taupe mb-4">Curated selection</p>
              <h2 className="text-luxury-subheading text-luxury-black px-2">
                Featured collections
              </h2>
              <p className="text-luxury-body text-luxury-taupe mt-4 max-w-xl mx-auto">
                Three edits to start browsing—each link takes you to the shop with the right context.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {collectionTiles.map((collection, index) => (
                <Link 
                  key={collection.id}
                  href={collection.href}
                  ref={addToRefs}
                  className="reveal reveal-on-scroll group relative aspect-[3/4] min-h-[280px] overflow-hidden rounded-sm"
                  style={{ transitionDelay: `${index * 0.1}s` }}
                >
                  <Image
                    src={collection.src}
                    alt={collection.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/70 via-luxury-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                    <p className="text-luxury-caption text-luxury-white/75 mb-2">
                      {collection.subtitle}
                    </p>
                    <h3 className="font-serif text-2xl sm:text-3xl text-luxury-white">
                      {collection.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* New Arrivals */}
        <section className="section-luxury">
          <div className="container-luxury">
            <div ref={addToRefs} className="reveal reveal-on-scroll flex flex-col md:flex-row md:items-end md:justify-between mb-10 md:mb-16 gap-4">
              <div>
                <p className="text-luxury-caption text-luxury-taupe mb-4">Just In</p>
                <h2 className="text-luxury-subheading text-luxury-black">
                  New Arrivals
                </h2>
              </div>
              <Link 
                href="/shop" 
                className="mt-6 md:mt-0 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-luxury-black hover:text-luxury-gold transition-colors underline-luxury"
              >
                View All <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
              {products.map((product, index) => (
                <div 
                  key={product.id}
                  ref={addToRefs}
                  className="reveal reveal-on-scroll group"
                  style={{ transitionDelay: `${index * 0.1}s` }}
                >
                  <Link href={`/product/${product.id}`} className="block group">
                    <div className="relative aspect-[3/4] mb-3 md:mb-4 overflow-hidden bg-luxury-cream">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-opacity duration-500 group-hover:opacity-0"
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                      <Image
                        src={product.hoverImage}
                        alt=""
                        fill
                        className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 max-md:translate-y-0 max-md:opacity-100 transition-all duration-500">
                        <span className="block w-full py-2.5 sm:py-3 bg-luxury-black text-luxury-white text-[10px] sm:text-xs uppercase tracking-[0.12em] text-center">
                          View product
                        </span>
                      </div>
                    </div>
                    <h3 className="font-serif text-base sm:text-lg text-luxury-black mb-1 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-luxury-taupe">
                      {formatPKR(product.price)}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Editorial Banner */}
        <section className="relative min-h-[70vh] sm:min-h-[80vh] flex items-center py-16 sm:py-0">
          <div className="absolute inset-0">
            <Image
              src={editorialBannerSrc}
              alt="Merry Berry atelier and craftsmanship"
              fill
              className="object-cover object-center"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-luxury-black/40 md:bg-luxury-black/35" />
          </div>
          <div className="container-luxury relative z-10 w-full">
            <div ref={addToRefs} className="reveal reveal-on-scroll max-w-2xl mx-auto text-center px-2">
              <p className="text-luxury-caption text-luxury-white/80 mb-4 sm:mb-6">
                The art of dressing
              </p>
              <h2 className="font-serif text-4xl sm:text-5xl md:text-7xl text-luxury-white mb-6 sm:mb-8 leading-tight">
                Timeless<br />
                <span className="italic font-light">sophistication</span>
              </h2>
              <p className="text-luxury-white/90 text-base sm:text-lg mb-8 sm:mb-10 max-w-lg mx-auto leading-relaxed">
                Garments made to carry you through seasons and settings—with fabrics, cuts, and finishes chosen for longevity, not trends alone.
              </p>
              <Link href="/about" className="btn-luxury-outline border-luxury-white text-luxury-white hover:text-luxury-black inline-flex">
                <span>Our story</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-luxury-black">
          <div className="container-luxury">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  icon: Truck,
                  title: 'Complimentary Shipping',
                  desc: `On Pakistan orders over ${formatPKR(FREE_SHIPPING_MIN_PKR)}`,
                },
                { icon: RefreshCw, title: 'Easy Returns', desc: '30-day return policy for peace of mind' },
                { icon: Shield, title: 'Secure Payment', desc: 'Your data is protected with us' },
              ].map((feature, index) => (
                <div 
                  key={index}
                  ref={addToRefs}
                  className="reveal reveal-on-scroll text-center px-2"
                  style={{ transitionDelay: `${index * 0.1}s` }}
                >
                  <feature.icon size={32} className="mx-auto mb-6 text-luxury-gold" strokeWidth={1} />
                  <h3 className="font-serif text-xl text-luxury-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-luxury-white/60">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="section-luxury bg-luxury-cream">
          <div className="container-luxury">
            <div ref={addToRefs} className="reveal reveal-on-scroll max-w-2xl mx-auto text-center px-2">
              <p className="text-luxury-caption text-luxury-taupe mb-4">Stay connected</p>
              <h2 className="text-luxury-subheading text-luxury-black mb-6">
                Join our world
              </h2>
              <p className="text-luxury-body text-luxury-taupe mb-10">
                Be first to hear about private sales, new drops, and studio notes from Merry Berry—unsubscribe anytime.
              </p>
              <form className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  name="email"
                  placeholder="Your email address"
                  autoComplete="email"
                  className="flex-1 min-h-[52px] px-5 sm:px-6 py-3 sm:py-4 bg-luxury-white border border-luxury-light-gray/20 text-luxury-black placeholder:text-luxury-taupe focus:outline-none focus:border-luxury-gold transition-colors text-base"
                />
                <button type="submit" className="btn-luxury whitespace-nowrap min-h-[52px] justify-center">
                  <span>Subscribe</span>
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-luxury-black text-luxury-white pt-16 sm:pt-20 pb-8">
          <div className="container-luxury">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12 md:mb-16">
              <div className="sm:col-span-2 lg:col-span-1">
                <h2 className="font-serif text-2xl tracking-[0.15em] mb-6">MERRY BERRY</h2>
                <p className="text-sm text-luxury-white/60 leading-relaxed max-w-sm">
                  Independent luxury fashion since 2016—thoughtful design, responsible partners, and pieces meant to stay in your wardrobe for years.
                </p>
              </div>
              
              <div>
                <h3 className="text-xs uppercase tracking-[0.2em] text-luxury-gold mb-6">Shop</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/shop?sort=new" className="text-sm text-luxury-white/60 hover:text-luxury-gold transition-colors">
                      New arrivals
                    </Link>
                  </li>
                  <li>
                    <Link href="/shop" className="text-sm text-luxury-white/60 hover:text-luxury-gold transition-colors">
                      All products
                    </Link>
                  </li>
                  <li>
                    <Link href="/collections" className="text-sm text-luxury-white/60 hover:text-luxury-gold transition-colors">
                      Collections
                    </Link>
                  </li>
                  <li>
                    <Link href="/cart" className="text-sm text-luxury-white/60 hover:text-luxury-gold transition-colors">
                      Cart
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xs uppercase tracking-[0.2em] text-luxury-gold mb-6">Help</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href={`mailto:${SITE.email}`} className="text-sm text-luxury-white/60 hover:text-luxury-gold transition-colors">
                      Contact us
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="text-sm text-luxury-white/60 hover:text-luxury-gold transition-colors">
                      Shipping &amp; returns
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="text-sm text-luxury-white/60 hover:text-luxury-gold transition-colors">
                      Size guide &amp; care
                    </Link>
                  </li>
                  <li>
                    <Link href="/account" className="text-sm text-luxury-white/60 hover:text-luxury-gold transition-colors">
                      Account
                    </Link>
                  </li>
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
            
            <div className="pt-8 border-t border-luxury-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
              <p className="text-xs text-luxury-white/40">
                © 2026 Merry Berry. All rights reserved.
              </p>
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-[0.15em] text-luxury-white/40 hover:text-luxury-gold transition-colors">
                  Instagram
                </a>
                <a href={SITE.facebook} target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-[0.15em] text-luxury-white/40 hover:text-luxury-gold transition-colors">
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
