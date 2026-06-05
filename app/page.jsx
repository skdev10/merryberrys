'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import LuxuryNavbar from '../components/LuxuryNavbar';
import Footer from '../components/Footer';
import RemoteImg from '@/components/RemoteImg';
import HeroCarousel from '../components/HeroCarousel';
import Reveal from '@/components/Reveal';
import { ArrowRight, ArrowDown, Truck, Shield, RefreshCw } from 'lucide-react';
import { primaryProductImage, parseProductImages } from '@/lib/productImages';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/cart';
import { formatPrice } from '@/lib/currency';
import { addCartItem } from '@/lib/cart';
import { notifyAddedToCart } from '@/lib/cartNotify';

const collectionImages = [
  {
    src: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=1200&q=85&auto=format&fit=crop',
    title: "Men's Lower",
    subtitle: 'Baggy, Cargo & Straight Fit',
    href: '/shop?category=baggy-jeans'
  },
  {
    src: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1200&q=85&auto=format&fit=crop',
    title: "Men's Upper",
    subtitle: 'Polos, Graphic Tees & More',
    href: '/shop?category=basic-t-shirt'
  },
  {
    src: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=1200&q=85&auto=format&fit=crop',
    title: 'Winter Edit',
    subtitle: 'Puffers, Hoodies & Jackets',
    href: '/shop?category=hoodie'
  },
  {
    src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=85&auto=format&fit=crop',
    title: 'Women & Kids',
    subtitle: 'Long Shirts & Kids Wear',
    href: '/shop?category=long-shirt'
  },
];

export default function LuxuryHome() {
  const [featured, setFeatured] = useState([]);

  const handleAddToCart = (product, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    addCartItem({
      ...product,
      image: primaryProductImage(product.images),
    });
    notifyAddedToCart(product.name);
  };

  useEffect(() => {
    fetch('/api/products?limit=8', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setFeatured(d.products || []))
      .catch(() => setFeatured([]));
  }, []);

  return (
    <>
      <LuxuryNavbar />
      
      <main className="bg-luxury-white">
        <HeroCarousel />

        <div className="flex justify-center py-6 bg-luxury-white border-b border-luxury-light-gray/10">
          <div className="flex flex-col items-center gap-2 text-luxury-taupe">
            <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
            <ArrowDown size={16} className="animate-bounce" />
          </div>
        </div>

        {/* Featured Collections */}
        <section className="section-luxury bg-luxury-cream">
          <div className="container-luxury">
            <Reveal className="text-center mb-16">
              <p className="text-luxury-caption text-luxury-taupe mb-4">Curated Selection</p>
              <h2 className="text-luxury-subheading text-luxury-black">
                Featured Collections
              </h2>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {collectionImages.map((collection, index) => (
                <Reveal
                  key={index}
                  as={Link}
                  href={collection.href || '/shop'}
                  className="group relative aspect-[3/4] overflow-hidden block"
                  style={{ transitionDelay: `${index * 0.1}s` }}
                  data-group
                >
                  <RemoteImg
                    src={collection.src}
                    alt={collection.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <p className="text-luxury-caption text-luxury-white/70 mb-2">
                      {collection.subtitle}
                    </p>
                    <h3 className="font-serif text-2xl text-luxury-white">
                      {collection.title}
                    </h3>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* New Arrivals */}
        <section className="section-luxury">
          <div className="container-luxury">
            <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
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
            </Reveal>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {featured.map((product, index) => {
                const imgs = parseProductImages(product.images);
                const hoverSrc = imgs[1] || imgs[0] || primaryProductImage(product.images);
                return (
                <Reveal
                  key={product.id}
                  className="group"
                  style={{ transitionDelay: `${index * 0.1}s` }}
                >
                  <Link href={`/product/${product.id}`} prefetch={false} className="block group">
                    <div className="relative aspect-[3/4] mb-4 overflow-hidden bg-luxury-cream">
                      <RemoteImg
                        src={primaryProductImage(product.images)}
                        alt={product.name}
                        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-0"
                      />
                      <RemoteImg
                        src={hoverSrc}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-0 opacity-100 transition-all duration-500 md:translate-y-full md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={(e) => handleAddToCart(product, e)}
                          className="w-full py-3 bg-luxury-black text-luxury-white text-xs uppercase tracking-[0.15em] hover:bg-luxury-gold transition-colors"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                    <h3 className="font-serif text-lg text-luxury-black mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-luxury-taupe">
                      {formatPrice(product.price)}
                    </p>
                  </Link>
                </Reveal>
              );
              })}
            </div>
          </div>
        </section>

        {/* Editorial Banner */}
        <section className="relative h-[80vh] min-h-[600px] flex items-center">
          <div className="absolute inset-0">
            <RemoteImg
              src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&q=80&auto=format&fit=crop"
              alt="Editorial"
              className="absolute inset-0 h-full w-full object-cover"
              priority
            />
            <div className="absolute inset-0 bg-luxury-black/30" />
          </div>
          <div className="container-luxury relative z-10">
            <Reveal className="max-w-2xl mx-auto text-center">
              <p className="text-luxury-caption text-luxury-white/70 mb-6">
                The Art of Dressing
              </p>
              <h2 className="font-serif text-5xl md:text-7xl text-luxury-white mb-8 leading-tight">
                Dress with<br />
                <span className="italic font-light">Confidence</span>
              </h2>
              <p className="text-luxury-white/80 text-lg mb-10 max-w-lg mx-auto">
                Each piece is thoughtfully designed in Pakistan to transcend seasons, offering enduring style for the modern wardrobe.
              </p>
              <Link href="/about" className="btn-luxury-outline border-luxury-white text-luxury-white hover:text-luxury-black">
                <span>Our Story</span>
              </Link>
            </Reveal>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-luxury-black">
          <div className="container-luxury">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { icon: Truck, title: 'Complimentary Shipping', desc: `On all orders over ${formatPrice(FREE_SHIPPING_THRESHOLD)} nationwide` },
                { icon: RefreshCw, title: 'Easy Returns', desc: '7-day return policy for peace of mind' },
                { icon: Shield, title: 'Secure Payment', desc: 'Secure bank and card payments' },
              ].map((feature, index) => (
                <Reveal
                  key={index}
                  className="text-center"
                  style={{ transitionDelay: `${index * 0.1}s` }}
                >
                  <feature.icon size={32} className="mx-auto mb-6 text-luxury-gold" strokeWidth={1} />
                  <h3 className="font-serif text-xl text-luxury-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-luxury-white/60">
                    {feature.desc}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="section-luxury bg-luxury-cream">
          <div className="container-luxury">
            <Reveal className="max-w-2xl mx-auto text-center">
              <p className="text-luxury-caption text-luxury-taupe mb-4">Stay Connected</p>
              <h2 className="text-luxury-subheading text-luxury-black mb-6">
                Join Our World
              </h2>
              <p className="text-luxury-body text-luxury-taupe mb-10">
                Subscribe to receive exclusive offers, early access to new collections, and styling inspiration from Pakistan.
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-6 py-4 bg-luxury-white border border-luxury-light-gray/20 text-luxury-black placeholder:text-luxury-taupe focus:outline-none focus:border-luxury-gold transition-colors"
                />
                <button type="submit" className="btn-luxury whitespace-nowrap">
                  <span>Subscribe</span>
                </button>
              </form>
            </Reveal>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
