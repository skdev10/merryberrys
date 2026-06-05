'use client';
import Link from 'next/link';
import LuxuryNavbar from '../../components/LuxuryNavbar';
import Footer from '../../components/Footer';
import RemoteImg from '@/components/RemoteImg';
import Reveal from '@/components/Reveal';
import { ArrowRight } from 'lucide-react';

const collections = [
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
];

export default function CollectionsPage() {
  return (
    <>
      <LuxuryNavbar />

      <main className="pt-32 pb-20 bg-luxury-white min-h-screen">
        {/* Header */}
        <div className="container-luxury mb-16">
          <Reveal className="text-center">
            <p className="text-luxury-caption text-luxury-taupe mb-4">Curated For You</p>
            <h1 className="text-luxury-subheading text-luxury-black mb-6">
              Our Collections
            </h1>
            <p className="text-luxury-body text-luxury-taupe max-w-2xl mx-auto">
              Explore our thoughtfully curated collections, each designed to bring timeless elegance to your wardrobe.
            </p>
          </Reveal>
        </div>

        {/* Collections Grid */}
        <div className="container-luxury">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {collections.map((collection, index) => (
              <Reveal
                key={collection.id}
                as={Link}
                href={collection.href}
                className="group relative aspect-[4/3] overflow-hidden block"
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <RemoteImg
                  src={collection.image}
                  alt={collection.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
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
                  <div className="mt-4 flex items-center gap-2 text-luxury-gold text-xs uppercase tracking-[0.15em] opacity-100 translate-y-0 transition-all duration-500 md:opacity-0 md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0">
                    Explore Collection <ArrowRight size={14} />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="container-luxury mt-24">
          <Reveal className="bg-luxury-cream py-16 px-8 text-center">
            <h2 className="font-serif text-3xl md:text-4xl text-luxury-black mb-4">
              Discover Your Style
            </h2>
            <p className="text-luxury-body text-luxury-taupe mb-8 max-w-xl mx-auto">
              Browse our complete collection of premium garments crafted with meticulous attention to detail.
            </p>
            <Link href="/shop" className="btn-luxury">
              <span>Shop All</span>
            </Link>
          </Reveal>
        </div>
      </main>

      <Footer />
    </>
  );
}
