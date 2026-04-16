'use client';

import { Suspense, useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import LuxuryNavbar from '../../components/LuxuryNavbar';
import { SlidersHorizontal, X, ChevronDown, Grid3X3, LayoutGrid } from 'lucide-react';
import { PRODUCT_IMAGE_FALLBACK } from '@/lib/brandAssets';
import { formatPKR } from '@/lib/currency';

const sortOptions = ['Featured', 'Newest', 'Price: Low to High', 'Price: High to Low'];

function ShopPageContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('Featured');
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [gridCols, setGridCols] = useState(3);
  const [isLoading, setIsLoading] = useState(true);
  const sortRef = useRef(null);

  useEffect(() => {
    const sort = searchParams.get('sort');
    if (sort === 'new') setSortBy('Newest');
  }, [searchParams]);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    const close = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) setSortMenuOpen(false);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async (categoryId = '') => {
    setIsLoading(true);
    try {
      const url = categoryId ? `/api/products?category=${categoryId}` : '/api/products';
      const response = await fetch(url);
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    fetchProducts(categoryId);
  };

  const searchQuery = (searchParams.get('q') || '').trim().toLowerCase();

  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => {
      if (!searchQuery) return true;
      const name = (p.name || '').toLowerCase();
      const desc = (p.description || '').toLowerCase();
      return name.includes(searchQuery) || desc.includes(searchQuery);
    });

    list = [...list].sort((a, b) => {
      switch (sortBy) {
        case 'Price: Low to High':
          return a.price - b.price;
        case 'Price: High to Low':
          return b.price - a.price;
        case 'Newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

    return list;
  }, [products, sortBy, searchQuery]);

  return (
    <>
      <LuxuryNavbar />

      <main className="pt-28 sm:pt-32 pb-16 sm:pb-20 bg-luxury-white min-h-screen">
        <div className="container-luxury mb-8 sm:mb-12">
          <div className="text-center mb-8 sm:mb-12 px-2">
            <p className="text-luxury-caption text-luxury-taupe mb-3 sm:mb-4">Collection</p>
            <h1 className="text-luxury-subheading text-luxury-black">All products</h1>
            {searchQuery && (
              <p className="text-sm text-luxury-taupe mt-4">
                Results for &ldquo;{searchParams.get('q')}&rdquo; —{' '}
                <Link href="/shop" className="underline hover:text-luxury-gold">
                  Clear search
                </Link>
              </p>
            )}
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6 py-6 border-t border-b border-luxury-light-gray/20">
            <div className="flex items-center gap-4 overflow-x-auto pb-2 md:pb-0 scrollbar-thin">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="md:hidden flex shrink-0 items-center gap-2 text-sm uppercase tracking-[0.1em] text-luxury-black"
              >
                <SlidersHorizontal size={16} /> Filters
              </button>

              <div className="hidden md:flex items-center gap-4 lg:gap-6 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleCategoryChange('')}
                  className={`text-sm uppercase tracking-[0.1em] transition-colors whitespace-nowrap ${
                    selectedCategory === ''
                      ? 'text-luxury-black border-b border-luxury-black pb-1'
                      : 'text-luxury-taupe hover:text-luxury-black'
                  }`}
                >
                  All
                </button>
                {categories.slice(0, 12).map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`text-sm uppercase tracking-[0.1em] transition-colors whitespace-nowrap ${
                      selectedCategory === cat.id
                        ? 'text-luxury-black border-b border-luxury-black pb-1'
                        : 'text-luxury-taupe hover:text-luxury-black'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
              <div className="relative" ref={sortRef}>
                <button
                  type="button"
                  onClick={() => setSortMenuOpen((o) => !o)}
                  className="flex items-center gap-2 text-sm text-luxury-taupe hover:text-luxury-black transition-colors"
                  aria-expanded={sortMenuOpen}
                  aria-haspopup="listbox"
                >
                  Sort: <span className="text-luxury-black">{sortBy}</span>
                  <ChevronDown size={14} className={sortMenuOpen ? 'rotate-180 transition-transform' : ''} />
                </button>
                {sortMenuOpen && (
                  <ul
                    className="absolute top-full right-0 mt-2 w-52 bg-luxury-white border border-luxury-light-gray/20 shadow-lg z-20 py-1"
                    role="listbox"
                  >
                    {sortOptions.map((option) => (
                      <li key={option}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={sortBy === option}
                          onClick={() => {
                            setSortBy(option);
                            setSortMenuOpen(false);
                          }}
                          className={`block w-full text-left px-4 py-3 text-sm hover:bg-luxury-cream transition-colors ${
                            sortBy === option ? 'text-luxury-black font-medium' : 'text-luxury-taupe'
                          }`}
                        >
                          {option}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="hidden md:flex items-center gap-2 border-l border-luxury-light-gray/20 pl-4 lg:pl-6">
                <button
                  type="button"
                  onClick={() => setGridCols(2)}
                  className={`p-2 transition-colors ${gridCols === 2 ? 'text-luxury-black' : 'text-luxury-taupe'}`}
                  aria-label="Two column grid"
                >
                  <LayoutGrid size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setGridCols(3)}
                  className={`p-2 transition-colors ${gridCols === 3 ? 'text-luxury-black' : 'text-luxury-taupe'}`}
                  aria-label="Three column grid"
                >
                  <Grid3X3 size={18} />
                </button>
              </div>
            </div>
          </div>

          <p className="mt-4 sm:mt-6 text-sm text-luxury-taupe">
            Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="container-luxury">
          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-luxury-cream mb-4 rounded-sm" />
                  <div className="h-4 bg-luxury-cream w-3/4 mb-2 rounded" />
                  <div className="h-4 bg-luxury-cream w-1/4 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div
              className={`grid gap-4 sm:gap-6 md:gap-8 ${
                gridCols === 2 ? 'grid-cols-2 lg:grid-cols-2' : 'grid-cols-2 lg:grid-cols-3'
              }`}
            >
              {filteredProducts.map((product, index) => {
                let images = [];
                try {
                  images = JSON.parse(product.images || '[]');
                } catch {
                  images = [];
                }
                const src = images[0] || PRODUCT_IMAGE_FALLBACK;
                return (
                  <div key={product.id} className="group" style={{ animationDelay: `${index * 0.05}s` }}>
                    <Link href={`/product/${product.id}`} className="block">
                      <div className="relative aspect-[3/4] mb-3 sm:mb-4 overflow-hidden bg-luxury-cream rounded-sm">
                        <Image
                          src={src}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 50vw, 33vw"
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 max-md:translate-y-0 max-md:opacity-100 transition-all duration-500">
                          <span className="block w-full py-2.5 sm:py-3 bg-luxury-black text-luxury-white text-[10px] sm:text-xs uppercase tracking-[0.15em] text-center">
                            View product
                          </span>
                        </div>
                      </div>
                      <h3 className="font-serif text-base sm:text-lg text-luxury-black mb-1 group-hover:text-luxury-gold transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-luxury-taupe">{formatPKR(product.price)}</p>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}

          {!isLoading && filteredProducts.length === 0 && (
            <div className="text-center py-16 sm:py-20 px-4">
              <p className="text-luxury-taupe text-lg mb-4">No products match your filters.</p>
              <Link href="/shop" className="btn-luxury-outline inline-flex">
                <span>View all products</span>
              </Link>
            </div>
          )}
        </div>
      </main>

      <div
        className={`fixed inset-0 bg-luxury-white z-[95] transform transition-transform duration-500 ease-out md:hidden ${
          mobileFiltersOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
        }`}
        aria-hidden={!mobileFiltersOpen}
      >
        <div className="container-luxury py-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-2xl">Filters</h2>
            <button type="button" onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6 overflow-y-auto flex-1">
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] text-luxury-taupe mb-4">Category</h3>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    handleCategoryChange('');
                    setMobileFiltersOpen(false);
                  }}
                  className={`block w-full text-left py-2 ${
                    selectedCategory === '' ? 'text-luxury-black font-medium' : 'text-luxury-taupe'
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      handleCategoryChange(cat.id);
                      setMobileFiltersOpen(false);
                    }}
                    className={`block w-full text-left py-2 ${
                      selectedCategory === cat.id ? 'text-luxury-black font-medium' : 'text-luxury-taupe'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-luxury-black text-luxury-white py-10 sm:py-12">
        <div className="container-luxury text-center px-4">
          <h2 className="font-serif text-xl sm:text-2xl tracking-[0.15em] mb-3">MERRY BERRY</h2>
          <p className="text-sm text-luxury-white/60">© 2026 Merry Berry. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-luxury-white pt-32 flex justify-center text-luxury-taupe">Loading shop…</div>
      }
    >
      <ShopPageContent />
    </Suspense>
  );
}
