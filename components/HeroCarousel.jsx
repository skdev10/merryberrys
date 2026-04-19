'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import RemoteImg from '@/components/RemoteImg';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AUTO_MS = 8000;

export default function HeroCarousel({ slides: initialSlides }) {
  const [slides, setSlides] = useState(initialSlides || []);
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(!!initialSlides?.length);

  useEffect(() => {
    if (initialSlides?.length) {
      setReady(true);
      return;
    }
    fetch('/api/hero-slides', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setSlides(d.slides || []))
      .catch(() => setSlides([]))
      .finally(() => setReady(true));
  }, [initialSlides]);

  const len = slides.length;
  const current = len ? slides[index % len] : null;

  const next = useCallback(() => {
    if (!len) return;
    setIndex((i) => (i + 1) % len);
  }, [len]);

  const prev = useCallback(() => {
    if (!len) return;
    setIndex((i) => (i - 1 + len) % len);
  }, [len]);

  useEffect(() => {
    if (len <= 1) return;
    const t = setInterval(next, AUTO_MS);
    return () => clearInterval(t);
  }, [len, next]);

  if (!ready) {
    return (
      <section className="hero-shell relative flex min-h-[520px] items-center justify-center bg-luxury-charcoal">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-luxury-white/20 border-t-luxury-gold" />
      </section>
    );
  }

  if (!len || !current) {
    return (
      <section className="hero-shell relative overflow-hidden bg-luxury-black">
        <RemoteImg
          src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1920&q=85"
          alt="Streetwear"
          className="hero-bg-img absolute inset-0 h-full w-full object-cover"
          priority
        />
        <div className="hero-vignette pointer-events-none absolute inset-0" />
        <div className="relative z-10 flex min-h-[560px] items-center px-6 py-28 md:px-12">
          <div className="container-luxury max-w-xl">
            <p className="text-luxury-caption mb-4 text-luxury-gold/90">Merry Berry</p>
            <h1 className="font-serif text-4xl leading-[1.1] text-luxury-white md:text-6xl">Baggy fits & streetwear</h1>
            <p className="mt-6 text-sm text-luxury-white/75 md:text-base">
              Add slides in Admin → Banners. High‑res JPG/PNG URLs work best.
            </p>
            <Link href="/shop" className="btn-luxury mt-10 inline-flex">
              <span>Shop now</span>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="hero-shell relative overflow-hidden bg-luxury-black text-luxury-white">
      {/* Crossfade layers — only images (no autoplay video) for a cleaner look */}
      <div className="pointer-events-none absolute inset-0">
        {slides.map((s, i) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-[1100ms] ease-out ${
              i === index % len ? 'z-[1] opacity-100' : 'z-0 opacity-0'
            }`}
            aria-hidden={i !== index % len}
          >
            <RemoteImg
              src={s.imageUrl}
              alt={s.title || ''}
              className={`hero-bg-img absolute inset-0 h-full w-full object-cover ${i === index % len ? 'hero-ken' : ''}`}
              priority={i === 0}
            />
          </div>
        ))}
        <div className="hero-vignette pointer-events-none absolute inset-0 z-[2]" />
      </div>

      <div className="relative z-10 flex min-h-[min(88vh,900px)] flex-col justify-end pb-20 pt-36 md:justify-center md:pb-16 md:pt-28">
        <div className="container-luxury px-4 md:px-0">
          <div key={current.id} className="hero-text-enter max-w-2xl">
            {current.subtitle && (
              <p className="text-luxury-caption mb-3 text-luxury-gold/95">{current.subtitle}</p>
            )}
            <h1 className="font-serif text-4xl leading-[1.08] tracking-tight text-luxury-white drop-shadow-sm md:text-6xl md:leading-[1.05]">
              {current.title}
            </h1>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href={current.ctaHref || '/shop'} className="btn-luxury">
                <span>{current.ctaLabel || 'Shop'}</span>
              </Link>
              <Link
                href="/collections"
                className="btn-luxury-outline border-luxury-white/80 text-luxury-white hover:border-luxury-white"
              >
                <span>Collections</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {len > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white backdrop-blur-sm transition hover:bg-white hover:text-luxury-black md:left-6 md:h-12 md:w-12"
            aria-label="Previous slide"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white backdrop-blur-sm transition hover:bg-white hover:text-luxury-black md:right-6 md:h-12 md:w-12"
            aria-label="Next slide"
          >
            <ChevronRight size={22} />
          </button>
          <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2 md:bottom-8">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index % len ? 'w-9 bg-luxury-gold' : 'w-2 bg-white/35 hover:bg-white/60'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
