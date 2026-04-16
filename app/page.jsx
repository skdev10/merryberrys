'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LuxuryNavbar from '../components/LuxuryNavbar';
import { ArrowRight, ArrowDown, Star, Truck, Shield, RefreshCw } from 'lucide-react';

// Premium fashion images from reference websites
const heroImages = [
  'https://innovecouture.vamtam.com/wp-content/uploads/2024/02/1034336401_1_1_1-683x1024.jpg',
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1600&q=80',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&q=80',
];

const collectionImages = [
  { 
    src: 'https://innovecouture.vamtam.com/wp-content/uploads/2024/02/1034336401_1_1_1-683x1024.jpg',
    title: 'Summer Collection',
    subtitle: '2026'
  },
  { 
    src: 'https://images.unsplash.com/photo-1515886657613-9f751a206bb1?w=800&q=80',
    title: 'Evening Wear',
    subtitle: 'Exclusive'
  },
  { 
    src: 'https://images.unsplash.com/photo-1496745911865-6eaf0df0dc4b?w=800&q=80',
    title: 'Essentials',
    subtitle: 'New In'
  },
];

const products = [
  { 
    id: 1, 
    name: 'Silk Evening Dress', 
    price: 485, 
    image: 'https://innovecouture.vamtam.com/wp-content/uploads/2024/02/1034336401_1_1_1-683x1024.jpg',
    hoverImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80'
  },
  { 
    id: 2, 
    name: 'Tailored Wool Coat', 
    price: 650, 
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce268581?w=600&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1544022613-e19bbf6e1e1b?w=600&q=80'
  },
  { 
    id: 3, 
    name: 'Cashmere Sweater', 
    price: 295, 
    image: 'https://images.unsplash.com/photo-1578587018459-a29373b36ff0?w=600&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d933?w=600&q=80'
  },
  { 
    id: 4, 
    name: 'Linen Blazer', 
    price: 420, 
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80'
  },
];

export default function LuxuryHome() {
  const revealRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    revealRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const addToRefs = (el) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  return (
    <>
      <LuxuryNavbar />
      
      <main className="bg-luxury-white">
        {/* Hero Section */}
        <section className="relative h-screen min-h-[700px] flex items-center">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={heroImages[0]}
              alt="Luxury Fashion"
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-luxury-white/90 via-luxury-white/40 to-transparent" />
          </div>

          {/* Hero Content */}
          <div className="container-luxury relative z-10 pt-20">
            <div className="max-w-2xl">
              <p className="text-luxury-caption text-luxury-taupe mb-6 fade-in">
                New Collection 2026
              </p>
              <h1 className="text-luxury-heading text-luxury-black mb-8 fade-in fade-in-delay-1">
                Elegance<br />
                <span className="italic font-light">Redefined</span>
              </h1>
              <p className="text-luxury-body text-luxury-taupe mb-10 max-w-md fade-in fade-in-delay-2">
                Discover our latest collection of premium garments crafted with meticulous attention to detail and timeless sophistication.
              </p>
              <div className="flex flex-wrap gap-4 fade-in fade-in-delay-3">
                <Link href="/shop" className="btn-luxury">
                  <span>Shop Collection</span>
                </Link>
                <Link href="/collections" className="btn-luxury-outline">
                  <span>View Lookbook</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-luxury-taupe">
            <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
            <ArrowDown size={16} className="animate-bounce" />
          </div>
        </section>

        {/* Featured Collections */}
        <section className="section-luxury bg-luxury-cream">
          <div className="container-luxury">
            <div ref={addToRefs} className="reveal text-center mb-16">
              <p className="text-luxury-caption text-luxury-taupe mb-4">Curated Selection</p>
              <h2 className="text-luxury-subheading text-luxury-black">
                Featured Collections
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {collectionImages.map((collection, index) => (
                <Link 
                  key={index}
                  href="/shop"
                  ref={addToRefs}
                  className="reveal group relative aspect-[3/4] overflow-hidden"
                  style={{ transitionDelay: `${index * 0.1}s` }}
                  data-group
                >
                  <Image
                    src={collection.src}
                    alt={collection.title}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <p className="text-luxury-caption text-luxury-white/70 mb-2">
                      {collection.subtitle}
                    </p>
                    <h3 className="font-serif text-3xl text-luxury-white">
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
            <div ref={addToRefs} className="reveal flex flex-col md:flex-row md:items-end md:justify-between mb-16">
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

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {products.map((product, index) => (
                <div 
                  key={product.id}
                  ref={addToRefs}
                  className="reveal group"
                  style={{ transitionDelay: `${index * 0.1}s` }}
                >
                  <Link href={`/product/${product.id}`} className="block group">
                    <div className="relative aspect-[3/4] mb-4 overflow-hidden bg-luxury-cream">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-opacity duration-500 group-hover:opacity-0"
                      />
                      <Image
                        src={product.hoverImage}
                        alt={product.name}
                        fill
                        className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <button className="w-full py-3 bg-luxury-black text-luxury-white text-xs uppercase tracking-[0.15em] hover:bg-luxury-gold transition-colors">
                          Quick View
                        </button>
                      </div>
                    </div>
                    <h3 className="font-serif text-lg text-luxury-black mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-luxury-taupe">
                      ${product.price}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Editorial Banner */}
        <section className="relative h-[80vh] min-h-[600px] flex items-center">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&q=80"
              alt="Editorial"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-luxury-black/30" />
          </div>
          <div className="container-luxury relative z-10">
            <div ref={addToRefs} className="reveal max-w-2xl mx-auto text-center">
              <p className="text-luxury-caption text-luxury-white/70 mb-6">
                The Art of Dressing
              </p>
              <h2 className="font-serif text-5xl md:text-7xl text-luxury-white mb-8 leading-tight">
                Timeless<br />
                <span className="italic font-light">Sophistication</span>
              </h2>
              <p className="text-luxury-white/80 text-lg mb-10 max-w-lg mx-auto">
                Each piece is thoughtfully designed to transcend seasons, offering enduring style for the modern wardrobe.
              </p>
              <Link href="/about" className="btn-luxury-outline border-luxury-white text-luxury-white hover:text-luxury-black">
                <span>Our Story</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-luxury-black">
          <div className="container-luxury">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { icon: Truck, title: 'Complimentary Shipping', desc: 'On all orders over $200 worldwide' },
                { icon: RefreshCw, title: 'Easy Returns', desc: '30-day return policy for peace of mind' },
                { icon: Shield, title: 'Secure Payment', desc: 'Your data is protected with us' },
              ].map((feature, index) => (
                <div 
                  key={index}
                  ref={addToRefs}
                  className="reveal text-center"
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
            <div ref={addToRefs} className="reveal max-w-2xl mx-auto text-center">
              <p className="text-luxury-caption text-luxury-taupe mb-4">Stay Connected</p>
              <h2 className="text-luxury-subheading text-luxury-black mb-6">
                Join Our World
              </h2>
              <p className="text-luxury-body text-luxury-taupe mb-10">
                Subscribe to receive exclusive offers, early access to new collections, and styling inspiration.
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
            </div>
          </div>
        </section>

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
                  <li>hello@merryberry.com</li>
                  <li>+1 (800) 123-4567</li>
                  <li>123 Fashion Avenue<br />New York, NY 10001</li>
                </ul>
              </div>
            </div>
            
            <div className="pt-8 border-t border-luxury-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-xs text-luxury-white/40">
                © 2026 Merry Berry. All rights reserved.
              </p>
              <div className="flex gap-6">
                {['Instagram', 'Facebook', 'Pinterest'].map((social) => (
                  <Link 
                    key={social}
                    href="#"
                    className="text-xs uppercase tracking-[0.15em] text-luxury-white/40 hover:text-luxury-gold transition-colors"
                  >
                    {social}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
