'use client';
import Image from 'next/image';
import LuxuryNavbar from '../../components/LuxuryNavbar';
import Footer from '../../components/Footer';

export default function AboutPage() {
  return (
    <>
      <LuxuryNavbar />
      
      <main className="pt-32 bg-luxury-white">
        {/* Hero Section */}
        <section className="container-luxury mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-luxury-caption text-luxury-taupe mb-6">Our Roots</p>
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-luxury-black mb-8 leading-tight">
                Crafted in<br />
                <span className="italic font-light">Pakistan</span><br />
                with Pride
              </h1>
              <p className="text-luxury-body text-luxury-taupe mb-6 text-lg font-medium">
                Luxury Fashion, Local Excellence.
              </p>
              <p className="text-luxury-body text-luxury-taupe mb-6">
                Merry Berry is a premium e-commerce brand based in the heart of Pakistan. We bridge the gap between traditional craftsmanship and modern luxury, bringing you apparel that is both timeless and sophisticated.
              </p>
              <p className="text-luxury-body text-luxury-taupe">
                Our mission is to showcase the incredible skill of Pakistani artisans while maintaining international standards of quality and design. Every stitch is a testament to our dedication to excellence.
              </p>
            </div>
            <div className="relative aspect-[4/5] lg:aspect-[3/4]">
              <Image
                src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80"
                alt="Pakistani Craftsmanship"
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
                The Merry Berry Difference
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  title: 'Local Artistry',
                  description: 'We collaborate with skilled local artisans in Pakistan, empowering communities while preserving age-old techniques that define our heritage.'
                },
                {
                  title: 'Premium Quality',
                  description: 'From high-grade cotton to luxurious denim, we source the finest materials to ensure every piece feels as good as it looks.'
                },
                {
                  title: 'Modern Vision',
                  description: 'While rooted in tradition, our designs are global. We create fashion that resonates with the modern trendsetter in Pakistan and beyond.'
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
                  alt="Production in Pakistan"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-luxury-caption text-luxury-taupe mb-6">The Process</p>
                <h2 className="font-serif text-4xl md:text-5xl text-luxury-black mb-8">
                  Artisanal<br />Production
                </h2>
                <p className="text-luxury-body text-luxury-taupe mb-6">
                  Based in Lahore, our production unit is where the magic happens. We maintain a zero-compromise policy on quality, ensuring that every garment meets our high standards before it reaches your doorstep.
                </p>
                <p className="text-luxury-body text-luxury-taupe">
                  Our team of tailors and designers work in a state-of-the-art facility that prioritizes ethical labor practices and environmental responsibility, making us a leader in sustainable fashion in Pakistan.
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
                { number: '5+', label: 'Years in Pakistan' },
                { number: '25K+', label: 'Local Customers' },
                { number: '18+', label: 'Categories' },
                { number: 'Cities', label: 'Delivered Nationwide' },
              ].map((stat, index) => (
                <div key={index}>
                  <p className="font-serif text-4xl md:text-5xl text-luxury-gold mb-2">{stat.number}</p>
                  <p className="text-sm text-luxury-white/60 uppercase tracking-[0.15em]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="container-luxury text-center">
            <h2 className="font-serif text-4xl md:text-5xl text-luxury-black mb-6">
              Join Our Journey
            </h2>
            <p className="text-luxury-body text-luxury-taupe mb-10 max-w-2xl mx-auto">
              Experience the best of Pakistani luxury. Discover pieces that are designed for comfort and built for style.
            </p>
            <a href="/shop" className="btn-luxury">
              <span>Shop Collection</span>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
