'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, usePathname } from 'next/navigation';
import LuxuryNavbar from '../../../components/LuxuryNavbar';
import {
  Heart,
  Truck,
  Shield,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Star,
  ShoppingBag,
  Lock,
} from 'lucide-react';
import { formatPKR, FREE_SHIPPING_MIN_PKR } from '@/lib/currency';
import { PRODUCT_IMAGE_FALLBACK } from '@/lib/brandAssets';

export default function ProductPage() {
  const params = useParams();
  const pathname = usePathname();
  const id = params?.id;

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adding, setAdding] = useState(false);

  const refreshAuth = useCallback(async () => {
    const res = await fetch('/api/auth/me', { credentials: 'include' });
    const data = await res.json();
    setIsLoggedIn(!!data.user);
  }, []);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        setProduct(data);

        const sizes = JSON.parse(data.sizes || '[]');
        const colors = JSON.parse(data.colors || '[]');

        if (sizes.length > 0) setSelectedSize(sizes[0]);
        if (colors.length > 0) setSelectedColor(colors[0]);

        const relatedResponse = await fetch(`/api/products?category=${data.categoryId}&limit=8`);
        const relatedData = await relatedResponse.json();
        setRelatedProducts(
          relatedData.products?.filter((p) => p.id !== data.id).slice(0, 3) || []
        );
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    if (!product) return;

    setAdding(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          productId: product.id,
          quantity,
          size: selectedSize || null,
          color: selectedColor || null,
        }),
      });

      if (res.status === 401) {
        setShowLoginModal(true);
        return;
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.message || 'Could not add to cart');
        return;
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('gocart-cart'));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAdding(false);
    }
  };

  const galleryImages = () => {
    let imgs = [];
    try {
      imgs = JSON.parse(product?.images || '[]');
    } catch {
      imgs = [];
    }
    return imgs.length ? imgs : [PRODUCT_IMAGE_FALLBACK];
  };

  const nextImage = () => {
    const images = galleryImages();
    if (images.length < 2) return;
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    const images = galleryImages();
    if (images.length < 2) return;
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  if (isLoading) {
    return (
      <>
        <LuxuryNavbar />
        <div className="pt-32 pb-20 bg-luxury-white min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-luxury-taupe">Loading...</div>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <LuxuryNavbar />
        <div className="pt-32 pb-20 bg-luxury-white min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="font-serif text-2xl text-luxury-black mb-4">Product Not Found</h2>
            <Link href="/shop" className="btn-luxury">
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>
      </>
    );
  }

  let images = [];
  try {
    images = JSON.parse(product.images || '[]');
  } catch {
    images = [];
  }
  if (!images.length) images = [PRODUCT_IMAGE_FALLBACK];
  const sizes = JSON.parse(product.sizes || '[]');
  const colors = JSON.parse(product.colors || '[]');

  return (
    <>
      <LuxuryNavbar />

      <main className="pt-32 pb-20 bg-luxury-white min-h-screen">
        <div className="container-luxury">
          <nav className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-luxury-taupe">
              <li>
                <Link href="/" className="hover:text-luxury-black transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/shop" className="hover:text-luxury-black transition-colors">
                  Shop
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link
                  href={`/shop?category=${product.category?.id || ''}`}
                  className="hover:text-luxury-black transition-colors"
                >
                  {product.category?.name}
                </Link>
              </li>
              <li>/</li>
              <li className="text-luxury-black">{product.name}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <div className="space-y-4">
              <div className="relative aspect-[3/4] bg-luxury-cream overflow-hidden">
                <Image
                  src={images[selectedImage] || images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-luxury-white/90 flex items-center justify-center hover:bg-luxury-white transition-colors"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-luxury-white/90 flex items-center justify-center hover:bg-luxury-white transition-colors"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                <div className="absolute bottom-4 right-4 px-3 py-1 bg-luxury-white/90 text-xs">
                  {selectedImage + 1} / {images.length || 1}
                </div>
              </div>

              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedImage(index)}
                      className={`relative w-20 h-24 shrink-0 overflow-hidden ${
                        selectedImage === index ? 'ring-2 ring-luxury-black' : ''
                      }`}
                    >
                      <Image src={img} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:sticky lg:top-32 lg:self-start">
              <div className="mb-8">
                <p className="text-luxury-caption text-luxury-taupe mb-3">{product.category?.name}</p>
                <h1 className="font-serif text-4xl md:text-5xl text-luxury-black mb-4">{product.name}</h1>
                <div className="flex items-center gap-4">
                  <p className="text-2xl text-luxury-black">{formatPKR(product.price)}</p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="fill-luxury-gold text-luxury-gold" />
                    ))}
                    <span className="text-sm text-luxury-taupe ml-2">(24 reviews)</span>
                  </div>
                </div>
              </div>

              <p className="text-luxury-body text-luxury-taupe mb-8">{product.description}</p>

              {colors.length > 0 && (
                <div className="mb-6">
                  <label className="text-xs uppercase tracking-[0.15em] text-luxury-taupe mb-3 block">
                    Color: <span className="text-luxury-black">{selectedColor}</span>
                  </label>
                  <div className="flex gap-3 flex-wrap">
                    {colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 text-sm border transition-colors ${
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
                  <label className="text-xs uppercase tracking-[0.15em] text-luxury-taupe mb-3 block">Size</label>
                  <div className="flex flex-wrap gap-3">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 text-sm border transition-colors ${
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
                    className="text-xs text-luxury-taupe underline mt-3 hover:text-luxury-black transition-colors"
                  >
                    Size Guide
                  </button>
                </div>
              )}

              <div className="flex gap-4 mb-8 flex-wrap">
                <div className="flex items-center border border-luxury-light-gray/30">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center text-luxury-taupe hover:text-luxury-black transition-colors"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-luxury-black">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center text-luxury-taupe hover:text-luxury-black transition-colors"
                  >
                    +
                  </button>
                </div>
                <button type="button" onClick={handleAddToCart} disabled={adding} className="flex-1 btn-luxury min-w-[200px] disabled:opacity-60">
                  <span className="flex items-center justify-center gap-2">
                    <ShoppingBag size={18} />
                    {isLoggedIn ? (adding ? 'Adding…' : 'Add to Cart') : 'Login to Add'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`w-14 h-14 border flex items-center justify-center transition-colors ${
                    isWishlisted
                      ? 'border-luxury-gold bg-luxury-gold/10 text-luxury-gold'
                      : 'border-luxury-light-gray/30 text-luxury-taupe hover:border-luxury-black'
                  }`}
                >
                  <Heart size={20} className={isWishlisted ? 'fill-current' : ''} />
                </button>
              </div>

              <div className="space-y-4 pt-8 border-t border-luxury-light-gray/20">
                <div className="flex items-start gap-3">
                  <Truck size={18} className="text-luxury-taupe mt-0.5" />
                  <div>
                    <p className="text-sm text-luxury-black font-medium">
                      Complimentary shipping on orders over {formatPKR(FREE_SHIPPING_MIN_PKR)}
                    </p>
                    <p className="text-xs text-luxury-taupe">Delivered in 3-5 business days</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <RefreshCw size={18} className="text-luxury-taupe mt-0.5" />
                  <div>
                    <p className="text-sm text-luxury-black font-medium">Free returns within 30 days</p>
                    <p className="text-xs text-luxury-taupe">Hassle-free return process</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield size={18} className="text-luxury-taupe mt-0.5" />
                  <div>
                    <p className="text-sm text-luxury-black font-medium">Secure Payment</p>
                    <p className="text-xs text-luxury-taupe">Your data is protected</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <div className="mt-24">
              <h2 className="font-serif text-3xl text-luxury-black mb-12 text-center">You May Also Like</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                {relatedProducts.map((rp) => (
                  <Link key={rp.id} href={`/product/${rp.id}`} className="group">
                    <div className="relative aspect-[3/4] mb-4 overflow-hidden bg-luxury-cream">
                      <Image
                        src={(() => {
                          try {
                            const a = JSON.parse(rp.images || '[]');
                            return a[0] || PRODUCT_IMAGE_FALLBACK;
                          } catch {
                            return PRODUCT_IMAGE_FALLBACK;
                          }
                        })()}
                        alt={rp.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="font-serif text-lg text-luxury-black mb-1 group-hover:text-luxury-gold transition-colors">
                      {rp.name}
                    </h3>
                    <p className="text-sm text-luxury-taupe">{formatPKR(rp.price)}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {showLoginModal && (
        <div className="fixed inset-0 bg-luxury-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-luxury-white max-w-md w-full p-8 relative">
            <button
              type="button"
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-luxury-taupe hover:text-luxury-black"
            >
              ✕
            </button>

            <div className="text-center mb-8">
              <Lock size={48} className="mx-auto mb-4 text-luxury-gold" strokeWidth={1} />
              <h2 className="font-serif text-2xl text-luxury-black mb-2">Login Required</h2>
              <p className="text-luxury-taupe text-sm">Please login or create an account to add items to cart</p>
            </div>

            <div className="space-y-4">
              <Link href={`/login?redirect=${encodeURIComponent(pathname || '/shop')}`} className="block w-full btn-luxury text-center">
                <span>Login</span>
              </Link>
              <Link
                href={`/register?redirect=${encodeURIComponent(pathname || '/shop')}`}
                className="block w-full btn-luxury-outline text-center"
              >
                <span>Create Account</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-luxury-black text-luxury-white py-12">
        <div className="container-luxury text-center">
          <h2 className="font-serif text-2xl tracking-[0.15em] mb-4">MERRY BERRY</h2>
          <p className="text-sm text-luxury-white/60">© 2026 Merry Berry. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
