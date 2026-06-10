'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import LuxuryNavbar from '../../components/LuxuryNavbar';
import Footer from '../../components/Footer';
import RemoteImg from '@/components/RemoteImg';
import Reveal from '@/components/Reveal';
import { ArrowRight, Heart, Scissors, Leaf, Award, Sparkles, Star, Quote, ChevronLeft, ChevronRight, Phone, Mail, MapPin } from 'lucide-react';
import { SITE } from '@/lib/site';
import SocialLinks from '@/components/SocialLinks';
import { useSiteSettings } from '@/components/SiteSettingsProvider';

/* ─── Animated counter for stats ─── */
function AnimatedCounter({ target, suffix = '', duration = 2000 }) {
  const numTarget = parseInt(String(target).replace(/[^0-9]/g, ''), 10) || 0;
  const [count, setCount] = useState(numTarget);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || started.current) return;

    const run = () => {
      if (started.current) return;
      started.current = true;
      setCount(0);
      const increment = numTarget / (duration / 16);
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= numTarget) {
          setCount(numTarget);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, 16);
    };

    if (typeof IntersectionObserver === 'undefined') {
      run();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) run();
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );
    observer.observe(el);

    const fallback = setTimeout(() => {
      if (!started.current) setCount(numTarget);
    }, 3000);

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, [numTarget, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

/* ─── Testimonial carousel ─── */
const testimonials = [
  {
    name: 'Ahmed Raza',
    location: 'Karachi',
    text: 'The quality of Merry Berry is unmatched. I ordered baggy jeans and a graphic tee — the fabric, the stitching, everything is premium. Will definitely order again!',
    rating: 5,
  },
  {
    name: 'Ayesha Khan',
    location: 'Islamabad',
    text: 'Finally, a Pakistani brand that delivers on its promises. The night suit I ordered for my daughter was so soft and beautifully finished. Fast delivery too!',
    rating: 5,
  },
  {
    name: 'Bilal Sheikh',
    location: 'Lahore',
    text: 'I have been buying from Merry Berry for over a year now. Their hoodies and puffer jackets are on par with international brands at a fraction of the price.',
    rating: 5,
  },
  {
    name: 'Fatima Noor',
    location: 'Faisalabad',
    text: 'Ordered a custom print polo for a corporate event — the team delivered exactly what we wanted. Professional service and outstanding quality.',
    rating: 5,
  },
];

export default function AboutPage() {
  const { aboutImages } = useSiteSettings();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  /* Auto-advance testimonials */
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <LuxuryNavbar />

      <main className="bg-luxury-white">
        {/* ═══════════════════════════════════════════
            HERO — Full-bleed cinematic header
        ═══════════════════════════════════════════ */}
        <section className="about-hero-banner relative flex min-h-[520px] h-[72vh] sm:h-[78vh] md:h-[85vh] md:min-h-[600px] items-end overflow-hidden">
          <div className="absolute inset-0">
            <RemoteImg
              src={aboutImages.hero}
              alt="Merry Berry premium men's solid color t-shirt"
              className="absolute inset-0 h-full w-full object-cover object-center md:object-[center_30%] hero-ken"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/90 via-luxury-black/45 to-luxury-black/15 md:from-luxury-black/80 md:via-luxury-black/30 md:to-transparent" />
          </div>
          <div className="container-luxury relative z-10 w-full pb-12 pt-28 sm:pb-16 sm:pt-32 md:pb-28 md:pt-0">
            <p
              className="text-luxury-caption text-luxury-gold mb-4 sm:mb-6 hero-text-enter"
              style={{ animationDelay: '0.2s' }}
            >
              Est. 2019 — Karachi, Pakistan
            </p>
            <h1
              className="font-serif text-3xl sm:text-5xl md:text-7xl lg:text-8xl text-luxury-white leading-[1.05] mb-5 sm:mb-8 hero-text-enter max-w-4xl"
              style={{ animationDelay: '0.5s' }}
            >
              Premium<br />
              <span className="italic font-light">Men&apos;s T-Shirts</span><br />
              <span className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light">Dress with Confidence</span>
            </h1>
            <p
              className="text-luxury-white/80 text-base sm:text-lg md:text-xl max-w-xl leading-relaxed hero-text-enter"
              style={{ animationDelay: '0.8s' }}
            >
              {SITE.welcomeTitle}
            </p>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            BRAND INTRODUCTION
        ═══════════════════════════════════════════ */}
        <section className="section-luxury">
          <div className="container-luxury">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              <Reveal>
                <p className="text-luxury-caption text-luxury-taupe mb-6">Our Story</p>
                <h2 className="font-serif text-4xl md:text-5xl text-luxury-black mb-8 leading-tight">
                  Merry Berry<br />
                  <span className="italic font-light text-luxury-gold">{SITE.tagline}</span>
                </h2>
                {SITE.description.split('\n\n').map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} className="text-luxury-body text-luxury-taupe mb-6 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
                <p className="font-serif text-xl text-luxury-black italic">
                  {SITE.name} – {SITE.tagline}.
                </p>
              </Reveal>

              <Reveal className="relative" style={{ transitionDelay: '0.2s' }}>
                <div className="relative aspect-[4/5] overflow-hidden">
                  <RemoteImg
                    src={aboutImages.craftsmanship}
                    alt="Merry Berry craftsmanship and quality fabrics"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
                {/* Floating accent card */}
                <div className="mt-6 bg-luxury-black text-luxury-white p-6 sm:p-8 max-w-full md:absolute md:-bottom-8 md:-left-8 md:mt-0 md:max-w-[260px]">
                  <p className="font-serif text-4xl text-luxury-gold mb-2">5+</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-luxury-white/60">
                    Years of dedicated craftsmanship in Pakistan
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Contact strip */}
        <section className="bg-luxury-black py-14 md:py-16">
          <div className="container-luxury">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
                <div className="w-12 h-12 border border-luxury-gold/40 flex items-center justify-center flex-shrink-0">
                  <Phone size={20} className="text-luxury-gold" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-luxury-white/50 mb-2">Call / WhatsApp</p>
                  <a href={`tel:${SITE.phone.replace(/\s/g, '')}`} className="font-serif text-xl text-luxury-white hover:text-luxury-gold transition-colors">
                    {SITE.phone}
                  </a>
                  <a
                    href={SITE.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-luxury-gold mt-2 hover:underline"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
                <div className="w-12 h-12 border border-luxury-gold/40 flex items-center justify-center flex-shrink-0">
                  <Mail size={20} className="text-luxury-gold" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-luxury-white/50 mb-2">Email</p>
                  <a href={`mailto:${SITE.email}`} className="text-luxury-white hover:text-luxury-gold transition-colors break-all">
                    {SITE.email}
                  </a>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
                <div className="w-12 h-12 border border-luxury-gold/40 flex items-center justify-center flex-shrink-0">
                  <MapPin size={20} className="text-luxury-gold" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-luxury-white/50 mb-2">Location</p>
                  <p className="text-luxury-white">{SITE.location}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            CORE VALUES — 4-column grid
        ═══════════════════════════════════════════ */}
        <section className="bg-luxury-cream py-24 md:py-32">
          <div className="container-luxury">
            <Reveal className="text-center mb-20">
              <p className="text-luxury-caption text-luxury-taupe mb-4">What Drives Us</p>
              <h2 className="text-luxury-subheading text-luxury-black">
                The Merry Berry Philosophy
              </h2>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {[
                {
                  icon: Scissors,
                  title: 'Master Craftsmanship',
                  description: 'Our Karachi-based tailors bring decades of expertise to every garment. Each piece is cut, stitched, and finished by hand with painstaking attention to detail.',
                },
                {
                  icon: Heart,
                  title: 'Honest Pricing',
                  description: 'By selling directly to you — no middlemen, no inflated markups — we deliver international-grade fashion at prices that respect your budget.',
                },
                {
                  icon: Leaf,
                  title: 'Ethical Production',
                  description: 'Fair wages, safe working conditions, and sustainable sourcing are not aspirations — they are non-negotiable standards in our production unit.',
                },
                {
                  icon: Award,
                  title: 'Quality Guarantee',
                  description: 'Every garment undergoes a rigorous 12-point quality check before it leaves our facility. We stand behind every product we sell.',
                },
              ].map((value, index) => (
                <Reveal
                  key={index}
                  className="text-center group"
                  style={{ transitionDelay: `${index * 0.1}s` }}
                >
                  <div className="w-16 h-16 mx-auto mb-6 border border-luxury-gold/30 flex items-center justify-center group-hover:bg-luxury-gold group-hover:border-luxury-gold transition-all duration-500">
                    <value.icon
                      size={24}
                      strokeWidth={1.5}
                      className="text-luxury-gold group-hover:text-luxury-white transition-colors duration-500"
                    />
                  </div>
                  <h3 className="font-serif text-xl text-luxury-black mb-4">{value.title}</h3>
                  <p className="text-luxury-body text-luxury-taupe text-sm leading-relaxed">{value.description}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            THE PROCESS — Side-by-side
        ═══════════════════════════════════════════ */}
        <section className="section-luxury">
          <div className="container-luxury">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
              <Reveal className="relative aspect-[4/3] overflow-hidden order-2 lg:order-1">
                <RemoteImg
                  src={aboutImages.quality}
                  alt="Merry Berry t-shirt production"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </Reveal>

              <Reveal className="flex flex-col justify-center order-1 lg:order-2" style={{ transitionDelay: '0.15s' }}>
                <p className="text-luxury-caption text-luxury-taupe mb-6">Behind The Scenes</p>
                <h2 className="font-serif text-4xl md:text-5xl text-luxury-black mb-8 leading-tight">
                  From Sketch<br />to Your Doorstep
                </h2>

                <div className="space-y-8">
                  {[
                    {
                      step: '01',
                      title: 'Design & Research',
                      desc: 'Our design team studies global trends and adapts them for the Pakistani market — ensuring every piece is both on-trend and culturally resonant.',
                    },
                    {
                      step: '02',
                      title: 'Sourcing Premium Fabrics',
                      desc: 'We source high-grade cotton, denim, and fleece from trusted Pakistani mills, ensuring durability and comfort in every garment.',
                    },
                    {
                      step: '03',
                      title: 'Artisanal Production',
                      desc: 'Our Karachi production unit houses over 50 skilled artisans who bring each design to life with precision stitching and hand-finishing.',
                    },
                    {
                      step: '04',
                      title: 'Quality Check & Delivery',
                      desc: 'Every item passes our rigorous 12-point inspection before being carefully packaged and shipped to your doorstep via our nationwide delivery network.',
                    },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-6 group">
                      <div className="flex-shrink-0">
                        <span className="font-serif text-3xl text-luxury-gold/40 group-hover:text-luxury-gold transition-colors duration-500">
                          {item.step}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-serif text-lg text-luxury-black mb-2">{item.title}</h3>
                        <p className="text-sm text-luxury-taupe leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            STATS BANNER — Dark section with counters
        ═══════════════════════════════════════════ */}
        <section className="bg-luxury-black py-24 md:py-32">
          <div className="container-luxury">
            <Reveal className="text-center mb-16">
              <p className="text-luxury-caption text-luxury-gold mb-4">By The Numbers</p>
              <h2 className="font-serif text-3xl md:text-4xl text-luxury-white">
                Our Impact Across Pakistan
              </h2>
            </Reveal>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { number: '25000', suffix: '+', label: 'Happy Customers' },
                { number: '50', suffix: '+', label: 'Skilled Artisans' },
                { number: '18', suffix: '+', label: 'Product Categories' },
                { number: '120', suffix: '+', label: 'Cities Served' },
              ].map((stat, index) => (
                <Reveal
                  key={index}
                  className="py-6"
                  style={{ transitionDelay: `${index * 0.1}s` }}
                >
                  <p className="font-serif text-4xl md:text-5xl lg:text-6xl text-luxury-gold mb-3">
                    <AnimatedCounter target={stat.number} suffix={stat.suffix} />
                  </p>
                  <p className="text-xs md:text-sm text-luxury-white/50 uppercase tracking-[0.15em]">
                    {stat.label}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            WHAT MAKES US DIFFERENT — Split layout
        ═══════════════════════════════════════════ */}
        <section className="section-luxury bg-luxury-cream">
          <div className="container-luxury">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              <Reveal className="order-2 lg:order-1">
                <p className="text-luxury-caption text-luxury-taupe mb-6">Why Merry Berry</p>
                <h2 className="font-serif text-4xl md:text-5xl text-luxury-black mb-10 leading-tight">
                  More Than<br />
                  <span className="italic font-light">Just Clothing</span>
                </h2>

                <div className="space-y-8">
                  {[
                    {
                      icon: Sparkles,
                      title: 'Custom Print Studio',
                      desc: 'Got a design in mind? Our in-house printing studio turns your ideas into wearable art — from corporate uniforms to personalized gifts.',
                    },
                    {
                      icon: Star,
                      title: 'Nationwide Free Shipping',
                      desc: 'Orders over Rs. 5,000 ship free to any city in Pakistan. We partner with top couriers for 2-5 day delivery nationwide.',
                    },
                    {
                      icon: Heart,
                      title: 'Easy 7-Day Returns',
                      desc: 'Not the right fit? No problem. Our hassle-free return policy ensures you can shop with complete confidence.',
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex gap-5 group">
                      <div className="flex-shrink-0 w-12 h-12 border border-luxury-gold/20 flex items-center justify-center group-hover:bg-luxury-black group-hover:border-luxury-black transition-all duration-500">
                        <item.icon
                          size={20}
                          strokeWidth={1.5}
                          className="text-luxury-gold group-hover:text-luxury-gold transition-colors"
                        />
                      </div>
                      <div>
                        <h3 className="font-serif text-lg text-luxury-black mb-2">{item.title}</h3>
                        <p className="text-sm text-luxury-taupe leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>

              <Reveal className="order-1 lg:order-2 relative" style={{ transitionDelay: '0.2s' }}>
                <div className="relative aspect-[3/4] overflow-hidden">
                  <RemoteImg
                    src={aboutImages.team}
                    alt="Merry Berry winter collection"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            TESTIMONIALS — Carousel
        ═══════════════════════════════════════════ */}
        <section className="section-luxury">
          <div className="container-luxury">
            <Reveal className="text-center mb-16">
              <p className="text-luxury-caption text-luxury-taupe mb-4">What Our Customers Say</p>
              <h2 className="text-luxury-subheading text-luxury-black">
                Loved Across Pakistan
              </h2>
            </Reveal>

            <div className="max-w-3xl mx-auto relative">
              <Quote
                size={48}
                className="text-luxury-gold/20 mx-auto mb-8"
                strokeWidth={1}
              />

              {/* Testimonial content */}
              <div className="text-center min-h-[200px] flex flex-col items-center justify-center">
                <p className="font-serif text-xl md:text-2xl text-luxury-black mb-8 leading-relaxed italic transition-opacity duration-500">
                  &ldquo;{testimonials[activeTestimonial].text}&rdquo;
                </p>

                {/* Star rating */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonials[activeTestimonial].rating }).map((_, i) => (
                    <Star key={i} size={16} className="text-luxury-gold fill-luxury-gold" />
                  ))}
                </div>

                <p className="font-serif text-lg text-luxury-black">
                  {testimonials[activeTestimonial].name}
                </p>
                <p className="text-xs uppercase tracking-[0.2em] text-luxury-taupe mt-1">
                  {testimonials[activeTestimonial].location}
                </p>
              </div>

              {/* Navigation dots */}
              <div className="flex justify-center gap-3 mt-10">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                      index === activeTestimonial
                        ? 'bg-luxury-gold w-8'
                        : 'bg-luxury-taupe/30 hover:bg-luxury-taupe/60'
                    }`}
                    aria-label={`View testimonial ${index + 1}`}
                  />
                ))}
              </div>

              {/* Arrow navigation */}
              <button
                onClick={() => setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-16 p-3 text-luxury-taupe hover:text-luxury-gold transition-colors hidden md:block"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={24} strokeWidth={1} />
              </button>
              <button
                onClick={() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length)}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-16 p-3 text-luxury-taupe hover:text-luxury-gold transition-colors hidden md:block"
                aria-label="Next testimonial"
              >
                <ChevronRight size={24} strokeWidth={1} />
              </button>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            BRAND PROMISE — Full-bleed image + text
        ═══════════════════════════════════════════ */}
        <section className="relative flex min-h-[420px] h-[60vh] sm:h-[65vh] md:h-[70vh] md:min-h-[500px] items-center">
          <div className="absolute inset-0">
            <RemoteImg
              src={aboutImages.promise}
              alt="Merry Berry streetwear"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-luxury-black/50" />
          </div>
          <div className="container-luxury relative z-10">
            <Reveal className="max-w-2xl">
              <p className="text-luxury-caption text-luxury-gold mb-6">Our Promise</p>
              <h2 className="font-serif text-5xl md:text-7xl text-luxury-white mb-8 leading-[0.95]">
                Dress with<br />
                <span className="italic font-light">Confidence</span>
              </h2>
              <p className="text-luxury-white/80 text-lg mb-10 max-w-lg leading-relaxed">
                When you wear Merry Berry, you are wearing the pride of Pakistani craftsmanship. Every thread, every stitch, every design decision is made to help you look and feel your absolute best.
              </p>
              <Link href="/shop" className="btn-luxury">
                <span className="flex items-center gap-3">
                  Explore Our Collection <ArrowRight size={16} />
                </span>
              </Link>
            </Reveal>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            FINAL CTA — Newsletter/Join
        ═══════════════════════════════════════════ */}
        <section className="py-24 md:py-32">
          <div className="container-luxury text-center">
            <Reveal>
              <p className="text-luxury-caption text-luxury-taupe mb-4">Be Part of Our Story</p>
              <h2 className="font-serif text-4xl md:text-5xl text-luxury-black mb-6">
                Join the Merry Berry Family
              </h2>
              <p className="text-luxury-body text-luxury-taupe mb-8 max-w-2xl mx-auto">
                Follow us on Instagram and Facebook for new drops, styling tips, and special offers.
              </p>
              <div className="flex justify-center mb-10">
                <SocialLinks />
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/shop" className="btn-luxury">
                  <span>Shop Now</span>
                </Link>
                <a
                  href={SITE.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-luxury-outline inline-flex items-center justify-center"
                >
                  <span>{SITE.phone}</span>
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
