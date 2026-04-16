'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowDown } from 'lucide-react';

export default function HeroCarousel({ slides, intervalMs = 7000 }) {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    setIndex((i) => (slides.length ? (i + 1) % slides.length : 0));
  }, [slides.length]);

  const prev = useCallback(() => {
    setIndex((i) => (slides.length ? (i - 1 + slides.length) % slides.length : 0));
  }, [slides.length]);

  useEffect(() => {
    if (!slides.length) return undefined;
    const t = setInterval(next, intervalMs);
    return () => clearInterval(t);
  }, [slides.length, intervalMs, next]);

  if (!slides.length) return null;

  const slide = slides[index];

  return (
    <section
      className="relative w-full overflow-hidden bg-luxury-black min-h-[max(580px,min(100svh,920px))] md:min-h-[720px] lg:min-h-[780px] max-h-[940px]"
      aria-roledescription="carousel"
      aria-label="Featured collections"
    >
      {slides.map((s, i) => (
        <div
          key={s.id || s.src}
          className={`absolute inset-0 transition-opacity duration-[1100ms] ease-in-out motion-reduce:duration-300 ${
            i === index ? 'z-[1] opacity-100' : 'z-0 opacity-0 pointer-events-none'
          }`}
          aria-hidden={i !== index}
        >
          <Image
            src={s.src}
            alt=""
            fill
            className="object-cover object-[center_22%] md:object-center"
            priority={i === 0}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-luxury-white/96 via-luxury-white/55 to-transparent sm:via-luxury-white/40 md:from-luxury-white/92 md:via-luxury-white/38 md:to-luxury-white/5" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-luxury-black/20 md:to-luxury-black/10" />
        </div>
      ))}

      <div className="absolute inset-0 z-[2] flex flex-col justify-end md:justify-center pb-24 sm:pb-28 md:pb-0">
        <div className="container-luxury pt-20 sm:pt-24 md:pt-28">
          <div key={slide.id || `slide-${index}`} className="max-w-2xl hero-slide-copy">
            {slide.caption && (
              <p className="text-luxury-caption text-luxury-taupe mb-3 md:mb-6">{slide.caption}</p>
            )}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-medium tracking-tight text-luxury-black leading-[1.08] mb-4 md:mb-8">
              {slide.headingLine1}
              <br />
              <span className="italic font-light">{slide.headingLine2}</span>
            </h1>
            {slide.subtitle && (
              <p className="text-luxury-body text-luxury-taupe mb-7 md:mb-10 max-w-md text-sm sm:text-base leading-relaxed">
                {slide.subtitle}
              </p>
            )}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
              {slide.primaryHref && (
                <Link href={slide.primaryHref} className="btn-luxury inline-flex text-center justify-center">
                  <span>{slide.primaryLabel || 'Shop'}</span>
                </Link>
              )}
              {slide.secondaryHref && (
                <Link href={slide.secondaryHref} className="btn-luxury-outline inline-flex text-center justify-center">
                  <span>{slide.secondaryLabel || 'Explore'}</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={prev}
        className="absolute left-2 sm:left-4 bottom-[5.5rem] sm:bottom-20 md:bottom-auto md:top-1/2 md:-translate-y-1/2 z-[3] w-10 h-10 sm:w-12 sm:h-12 bg-luxury-white/95 flex items-center justify-center hover:bg-luxury-white active:scale-95 transition-all shadow-md border border-luxury-light-gray/10"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} className="text-luxury-black sm:w-[22px] sm:h-[22px]" />
      </button>
      <button
        type="button"
        onClick={next}
        className="absolute right-2 sm:right-4 bottom-[5.5rem] sm:bottom-20 md:bottom-auto md:top-1/2 md:-translate-y-1/2 z-[3] w-10 h-10 sm:w-12 sm:h-12 bg-luxury-white/95 flex items-center justify-center hover:bg-luxury-white active:scale-95 transition-all shadow-md border border-luxury-light-gray/10"
        aria-label="Next slide"
      >
        <ChevronRight size={20} className="text-luxury-black sm:w-[22px] sm:h-[22px]" />
      </button>

      <div className="absolute bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 z-[3] flex flex-col items-center gap-2 sm:gap-3">
        <div className="flex gap-2" role="tablist" aria-label="Slides">
          {slides.map((s, i) => (
            <button
              key={s.id || i}
              type="button"
              role="tab"
              aria-selected={i === index}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 min-h-[6px] ${
                i === index ? 'w-8 bg-luxury-black' : 'w-1.5 bg-luxury-taupe/50 hover:bg-luxury-taupe'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <div className="hidden sm:flex flex-col items-center gap-1.5 text-luxury-taupe pt-1">
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <ArrowDown size={16} className="animate-bounce motion-reduce:animate-none" />
        </div>
      </div>
    </section>
  );
}
