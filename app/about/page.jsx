'use client';
import Image from 'next/image';
import LuxuryNavbar from '../../components/LuxuryNavbar';

export default function AboutPage() {
  return (
    <>
      <LuxuryNavbar />
      
      <main className="pt-32 bg-luxury-white">
        {/* Hero Section */}
        <section className="container-luxury mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-luxury-caption text-luxury-taupe mb-6">Our Story</p>
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-luxury-black mb-8 leading-tight">
                Crafting<br />
                <span className="italic font-light">Timeless</span><br />
                Elegance
              </h1>
              <p className="text-luxury-body text-luxury-taupe mb-6">
                Founded in 2016, Merry Berry emerged from a passion for exceptional craftsmanship and timeless design. We believe that true luxury lies in the details—the perfect stitch, the finest fabric, the silhouette that flatters.
              </p>
              <p className="text-luxury-body text-luxury-taupe">
                Each piece in our collection is thoughtfully designed to transcend seasons, offering enduring style for the modern wardrobe. We work with skilled artisans and sustainable manufacturers to create garments that are as ethical as they are beautiful.
              </p>
            </div>
            <div className="relative aspect-[4/5] lg:aspect-[3/4]">
              <Image
                src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80"
                alt="Our Story"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="bg-luxury-cream py-24">
          <div className="container-luxury">
            <div className="text-center mb-16">
              <p className="text-luxury-caption text-luxury-taupe mb-4">Our Values</p>
              <h2 className="text-luxury-subheading text-luxury-black">
                What We Believe
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  title: 'Quality First',
                  description: 'We source only the finest materials and work with skilled artisans who share our commitment to excellence. Every garment undergoes rigorous quality checks before reaching you.'
                },
                {
                  title: 'Sustainable Fashion',
                  description: 'We are committed to reducing our environmental impact. From eco-friendly fabrics to ethical manufacturing, sustainability is woven into everything we do.'
                },
                {
                  title: 'Timeless Design',
                  description: 'We create pieces that transcend trends. Our designs are meant to be cherished for years, becoming staples in your wardrobe rather than fleeting fashion moments.'
                }
              ].map((value, index) => (
                <div key={index} className="text-center">
                  <h3 className="font-serif text-2xl text-luxury-black mb-4">{value.title}</h3>
                  <p className="text-luxury-body text-luxury-taupe">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Craftsmanship Section */}
        <section className="section-luxury">
          <div className="container-luxury">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
              <div className="relative aspect-[4/3]">
                <Image
                  src="https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80"
                  alt="Craftsmanship"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-luxury-caption text-luxury-taupe mb-6">The Process</p>
                <h2 className="font-serif text-4xl md:text-5xl text-luxury-black mb-8">
                  Artisanal<br />Craftsmanship
                </h2>
                <p className="text-luxury-body text-luxury-taupe mb-6">
                  Each Merry Berry piece begins with a sketch, evolves through careful pattern-making, and comes to life through the hands of skilled artisans. We work with family-owned ateliers in Italy and Portugal, preserving traditional techniques while embracing modern innovation.
                </p>
                <p className="text-luxury-body text-luxury-taupe">
                  From the initial cut to the final stitch, every step is executed with precision and care. This dedication to craft ensures that each garment not only looks beautiful but feels exceptional to wear.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-luxury-black text-luxury-white py-24">
          <div className="container-luxury">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { number: '8+', label: 'Years of Excellence' },
                { number: '50K+', label: 'Happy Customers' },
                { number: '370+', label: 'Products' },
                { number: '15+', label: 'Countries Shipped' },
              ].map((stat, index) => (
                <div key={index}>
                  <p className="font-serif text-4xl md:text-5xl text-luxury-gold mb-2">{stat.number}</p>
                  <p className="text-sm text-luxury-white/60 uppercase tracking-[0.15em]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="section-luxury bg-luxury-cream">
          <div className="container-luxury">
            <div className="text-center mb-16">
              <p className="text-luxury-caption text-luxury-taupe mb-4">The Team</p>
              <h2 className="text-luxury-subheading text-luxury-black">
                Meet Our Founders
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
              {[
                {
                  name: 'Sarah Mitchell',
                  role: 'Creative Director',
                  image: 'https://images.unsplash.com/photo-1494790108377-be9c29b593a4?w=400&q=80'
                },
                {
                  name: 'James Chen',
                  role: 'Founder & CEO',
                  image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80'
                }
              ].map((person, index) => (
                <div key={index} className="text-center">
                  <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden">
                    <Image
                      src={person.image}
                      alt={person.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-serif text-2xl text-luxury-black mb-2">{person.name}</h3>
                  <p className="text-luxury-caption text-luxury-taupe">{person.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="container-luxury text-center">
            <h2 className="font-serif text-4xl md:text-5xl text-luxury-black mb-6">
              Experience the Difference
            </h2>
            <p className="text-luxury-body text-luxury-taupe mb-10 max-w-2xl mx-auto">
              Discover our collection of meticulously crafted pieces designed to elevate your everyday style.
            </p>
            <a href="/shop" className="btn-luxury">
              <span>Shop Collection</span>
            </a>
          </div>
        </section>
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
                    <a href="/shop" className="text-sm text-luxury-white/60 hover:text-luxury-gold transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] text-luxury-gold mb-6">Help</h3>
              <ul className="space-y-3">
                {['Contact Us', 'Shipping Info', 'Returns', 'Size Guide', 'FAQ'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-luxury-white/60 hover:text-luxury-gold transition-colors">
                      {item}
                    </a>
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
                <a 
                  key={social}
                  href="#"
                  className="text-xs uppercase tracking-[0.15em] text-luxury-white/40 hover:text-luxury-gold transition-colors"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
