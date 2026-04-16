'use client';
import Link from 'next/link';
import Image from 'next/image';
import LuxuryNavbar from '../../components/LuxuryNavbar';

const collections = [
  {
    id: 1,
    name: 'Summer 2026',
    description: 'Light, airy pieces for the warm season',
    image: 'https://innovecouture.vamtam.com/wp-content/uploads/2024/02/1034336401_1_1_1-683x1024.jpg',
    itemCount: 24,
  },
  {
    id: 2,
    name: 'Evening Edit',
    description: 'Elegant pieces for special occasions',
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80',
    itemCount: 18,
  },
  {
    id: 3,
    name: 'Essentials',
    description: 'Timeless staples for every wardrobe',
    image: 'https://images.unsplash.com/photo-1496745911865-6eaf0df0dc4b?w=800&q=80',
    itemCount: 32,
  },
  {
    id: 4,
    name: 'Winter Collection',
    description: 'Cozy luxury for cold days',
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce268581?w=800&q=80',
    itemCount: 28,
  },
];

export default function CollectionsPage() {
  return (
    <>
      <LuxuryNavbar />
      
      <main className="pt-32 pb-20 bg-luxury-white min-h-screen">
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
    </>
  );
}
