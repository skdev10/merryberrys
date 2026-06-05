'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import LuxuryNavbar from '../../../components/LuxuryNavbar';
import RemoteImg from '@/components/RemoteImg';
import { Heart, Truck, Shield, RefreshCw, ChevronLeft, ChevronRight, Star, ShoppingBag } from 'lucide-react';
import { parseProductImages, primaryProductImage, PLACEHOLDER_IMAGE } from '@/lib/productImages';
import { segmentId } from '@/lib/routeParams';
import { addCartItem, FREE_SHIPPING_THRESHOLD } from '@/lib/cart';
import { notifyAddedToCart } from '@/lib/cartNotify';
import { formatPrice } from '@/lib/currency';

export default function ProductPage() {
  const params = useParams();
  const productId = segmentId(params?.id);

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!productId) {
      setProduct(null);
      setRelatedProducts([]);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setProduct(null);
    setRelatedProducts([]);
    setSelectedImage(0);
    setQuantity(1);

    (async () => {
      try {
        const response = await fetch(`/api/products/${encodeURIComponent(productId)}`, {
          cache: 'no-store',
          headers: { Accept: 'application/json' },
        });
        if (!response.ok) {
          if (!cancelled) setProduct(null);
          return;
        }
        const data = await response.json();
        if (cancelled) return;

        setProduct(data);

        const sizes = JSON.parse(data.sizes || '[]');
        const colors = JSON.parse(data.colors || '[]');
        if (sizes.length > 0) setSelectedSize(sizes[0]);
        if (colors.length > 0) setSelectedColor(colors[0]);

        const relatedResponse = await fetch(
          `/api/products?category=${encodeURIComponent(data.categoryId)}&limit=12`,
          { cache: 'no-store' }
        );
        const relatedData = await relatedResponse.json();
        if (!cancelled) {
          setRelatedProducts(
            (relatedData.products || []).filter((p) => p.id !== data.id).slice(0, 3)
          );
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) setProduct(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [productId]);

  const handleAddToCart = () => {
    addCartItem(
      {
        ...product,
        image: primaryProductImage(product.images),
      },
      {
      size: selectedSize,
      color: selectedColor,
      quantity,
      }
    );
    notifyAddedToCart(product.name);
  };

  const nextImage = () => {
    const images = parseProductImages(product?.images);
    if (!images.length) return;
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    const images = parseProductImages(product?.images);
    if (!images.length) return;
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  if (isLoading) {
    return (
      <>
        <LuxuryNavbar />
        <div className="flex min-h-screen items-center justify-center bg-luxury-white pb-20 pt-32">
          <div className="text-luxury-taupe animate-pulse">Loading…</div>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <LuxuryNavbar />
        <div className="flex min-h-screen flex-col items-center justify-center bg-luxury-white pb-20 pt-32">
          <h2 className="font-serif mb-4 text-2xl text-luxury-black">Product not found</h2>
          <Link href="/shop" className="btn-luxury">
            <span>Continue shopping</span>
          </Link>
        </div>
      </>
    );
  }

  const images = parseProductImages(product.images);
  const sizes = JSON.parse(product.sizes || '[]');
  const colors = JSON.parse(product.colors || '[]');
  const mainSrc = images[selectedImage] || PLACEHOLDER_IMAGE;

  return (
    <>
      <LuxuryNavbar />

      <main key={productId} className="min-h-screen bg-luxury-white pb-20 pt-32">
        <div className="container-luxury">
          <nav className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-luxury-taupe">
              <li>
                <Link href="/" className="transition-colors hover:text-luxury-black">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/shop" className="transition-colors hover:text-luxury-black">
                  Shop
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link
                  href={`/shop?category=${encodeURIComponent(product.categoryId)}`}
                  className="transition-colors hover:text-luxury-black"
                >
                  {product.category?.name}
                </Link>
              </li>
              <li>/</li>
              <li className="text-luxury-black">{product.name}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="space-y-4">
              <div className="relative aspect-[3/4] overflow-hidden bg-luxury-cream">
                <RemoteImg
                  key={`${productId}-${mainSrc}`}
                  src={mainSrc}
                  alt={product.name}
                  className="absolute inset-0 h-full w-full object-cover"
                  priority
                />

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center bg-luxury-white/90 transition-colors hover:bg-luxury-white"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center bg-luxury-white/90 transition-colors hover:bg-luxury-white"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                <div className="absolute bottom-4 right-4 bg-luxury-white/90 px-3 py-1 text-xs">
                  {images.length ? `${selectedImage + 1} / ${images.length}` : '—'}
                </div>
              </div>

              {images.length > 1 && (
                <div className="flex gap-3">
                  {images.map((img, idx) => (
                    <button
                      key={`${idx}-${img}`}
                      type="button"
                      onClick={() => setSelectedImage(idx)}
                      className={`relative h-24 w-20 shrink-0 overflow-hidden ${
                        selectedImage === idx ? 'ring-2 ring-luxury-black' : ''
                      }`}
                    >
                      <RemoteImg
                        src={img}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:sticky lg:top-32 lg:self-start">
              <div className="mb-8">
                <p className="text-luxury-caption mb-3 text-luxury-taupe">{product.category?.name}</p>
                <h1 className="font-serif mb-4 text-4xl text-luxury-black md:text-5xl">{product.name}</h1>
                <div className="flex flex-wrap items-center gap-4">
                  <p className="text-2xl text-luxury-black">{formatPrice(product.price)}</p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="fill-luxury-gold text-luxury-gold" />
                    ))}
                    <span className="ml-2 text-sm text-luxury-taupe">(24 reviews)</span>
                  </div>
                </div>
              </div>

              <p className="text-luxury-body mb-8 text-luxury-taupe">{product.description}</p>

              {colors.length > 0 && (
                <div className="mb-6">
                  <label className="text-luxury-caption mb-3 block text-luxury-taupe">
                    Color: <span className="text-luxury-black">{selectedColor}</span>
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`border px-4 py-2 text-sm transition-colors ${
                          selectedColor === color
                            ? 'border-luxury-black text-luxury-black'
                            : 'border-luxury-light-gray/30 text-luxury-taupe hover:border-luxury-black'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {sizes.length > 0 && (
                <div className="mb-6">
                  <label className="text-luxury-caption mb-3 block text-luxury-taupe">Size</label>
                  <div className="flex flex-wrap gap-3">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`h-12 w-12 border text-sm transition-colors ${
                          selectedSize === size
                            ? 'border-luxury-black bg-luxury-black text-luxury-white'
                            : 'border-luxury-light-gray/30 text-luxury-taupe hover:border-luxury-black'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="mt-3 text-xs text-luxury-taupe underline transition-colors hover:text-luxury-black"
                  >
                    Size guide
                  </button>
                </div>
              )}

              <div className="mb-8 flex gap-4">
                <div className="flex items-center border border-luxury-light-gray/30">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-12 w-12 items-center justify-center text-luxury-taupe transition-colors hover:text-luxury-black"
                  >
                    -
                  </button>
                  <span className="flex w-12 items-center justify-center text-luxury-black">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="flex h-12 w-12 items-center justify-center text-luxury-taupe transition-colors hover:text-luxury-black"
                  >
                    +
                  </button>
                </div>
                <button type="button" onClick={handleAddToCart} className="btn-luxury flex-1">
                  <span className="flex items-center justify-center gap-2">
                    <ShoppingBag size={18} />
                    Add to cart
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`flex h-14 w-14 items-center justify-center border transition-colors ${
                    isWishlisted
                      ? 'border-luxury-gold bg-luxury-gold/10 text-luxury-gold'
                      : 'border-luxury-light-gray/30 text-luxury-taupe hover:border-luxury-black'
                  }`}
                >
                  <Heart size={20} className={isWishlisted ? 'fill-current' : ''} />
                </button>
              </div>

              <div className="space-y-4 border-t border-luxury-light-gray/20 pt-8">
                <div className="flex items-start gap-3">
                  <Truck size={18} className="mt-0.5 text-luxury-taupe" />
                  <div>
                    <p className="text-sm font-medium text-luxury-black">
                      Free shipping over {formatPrice(FREE_SHIPPING_THRESHOLD)}
                    </p>
                    <p className="text-xs text-luxury-taupe">Delivered nationwide in 2–4 business days</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <RefreshCw size={18} className="mt-0.5 text-luxury-taupe" />
                  <div>
                    <p className="text-sm font-medium text-luxury-black">7-day easy returns</p>
                    <p className="text-xs text-luxury-taupe">Hassle‑free return process in Pakistan</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield size={18} className="mt-0.5 text-luxury-taupe" />
                  <div>
                    <p className="text-sm font-medium text-luxury-black">Secure payment</p>
                    <p className="text-xs text-luxury-taupe">Bank-grade security for your data</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <div className="mt-24">
              <h2 className="font-serif mb-12 text-center text-3xl text-luxury-black">You may also like</h2>
              <div className="grid grid-cols-2 gap-6 md:grid-cols-3 md:gap-8">
                {relatedProducts.map((rp) => (
                  <Link
                    key={rp.id}
                    href={`/product/${rp.id}`}
                    prefetch={false}
                    className="group"
                  >
                    <div className="relative mb-4 aspect-[3/4] overflow-hidden bg-luxury-cream">
                      <RemoteImg
                        src={primaryProductImage(rp.images)}
                        alt={rp.name}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="font-serif mb-1 text-lg text-luxury-black transition-colors group-hover:text-luxury-gold">
                      {rp.name}
                    </h3>
                    <p className="text-sm text-luxury-taupe">{formatPrice(rp.price)}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-luxury-black py-12 text-luxury-white">
        <div className="container-luxury text-center">
          <h2 className="font-serif mb-4 text-2xl tracking-[0.15em]">MERRY BERRY</h2>
          <p className="text-sm text-luxury-white/60">© 2026 Merry Berry. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
