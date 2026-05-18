'use client';
import { Star } from 'lucide-react';
import Link from 'next/link';
import RemoteImg from './RemoteImg';
import { primaryProductImage, parseProductImages } from '@/lib/productImages';
import { formatPrice } from '@/lib/currency';
import Reveal from '@/components/Reveal';

const ProductCard = ({ product }) => {
  const images = parseProductImages(product.images);
  const hoverSrc = images[1] || images[0] || primaryProductImage(product.images);

  return (
    <Reveal className="group" data-group>
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
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
            <button className="w-full py-3 bg-luxury-black text-luxury-white text-xs uppercase tracking-[0.15em] hover:bg-luxury-gold transition-colors">
              Quick View
            </button>
          </div>
        </div>
        <h3 className="font-serif text-lg text-luxury-black mb-1 group-hover:text-luxury-gold transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-sm text-luxury-taupe">
            {formatPrice(product.price)}
          </p>
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={10} className="fill-luxury-gold text-luxury-gold" />
            ))}
          </div>
        </div>
      </Link>
    </Reveal>
  );
};

export default ProductCard;