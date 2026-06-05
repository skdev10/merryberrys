'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import LuxuryNavbar from '../../components/LuxuryNavbar';
import RemoteImg from '@/components/RemoteImg';
import { SlidersHorizontal, X, ChevronDown, Grid3X3, LayoutGrid, Search } from 'lucide-react';
import { primaryProductImage } from '@/lib/productImages';
import { addCartItem } from '@/lib/cart';
import { notifyAddedToCart } from '@/lib/cartNotify';
import { formatPrice } from '@/lib/currency';
import Reveal from '@/components/Reveal';
import Footer from '@/components/Footer';

const sortOptions = ['Featured', 'Newest', 'Price: Low to High', 'Price: High to Low'];

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('Featured');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [view, setView] = useState('grid-3');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const boot = async () => {
      let initialCat = '';
      let initialSearch = '';
      if (typeof window !== 'undefined') {
        const q = new URLSearchParams(window.location.search);
        if (q.get('category')) initialCat = q.get('category');
        if (q.get('search')) initialSearch = q.get('search');
        if (q.get('sort') === 'new') setSortBy('Newest');
      }
      await fetchCategories();
      if (initialCat) setSelectedCategory(initialCat);
      if (initialSearch) setSearchQuery(initialSearch);
      await fetchProducts(initialCat, initialSearch);
    };
    boot();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories', { cache: 'no-store' });
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async (categoryId = '', search = '') => {
    setIsLoading(true);
    try {
      let url = '/api/products?';
      if (categoryId) url += `category=${encodeURIComponent(categoryId)}&`;
      if (search) url += `search=${encodeURIComponent(search)}`;
      
      const response = await fetch(url, { cache: 'no-store' });
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
    fetchProducts(categoryId, searchQuery);
  };

  const filteredProducts = [...products].sort((a, b) => {
    switch(sortBy) {
      case 'Newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'Price: Low to High':
        return a.price - b.price;
      case 'Price: High to Low':
        return b.price - a.price;
      default:
        return 0;
    }
  });

  const handleAddToCart = (product) => {
    addCartItem({
      ...product,
      image: primaryProductImage(product.images),
    });
    notifyAddedToCart(product.name);
  };

  return (
    <>
      <LuxuryNavbar />
      
      <main className="pt-32 pb-20 bg-luxury-white min-h-screen">
        <div className="container-luxury">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-luxury-subheading text-luxury-black mb-4">
              {selectedCategory ? categories.find(c => c.slug === selectedCategory)?.name : 'Shop All'}
            </h1>
            <p className="text-luxury-taupe max-w-2xl">
              Explore our collection of meticulously crafted essentials, designed for the modern lifestyle.
            </p>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 py-6 border-t border-b border-luxury-light-gray/20">
            {/* Left - Search & Category Filters */}
            <div className="flex-1 flex flex-col md:flex-row md:items-center gap-6">
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    fetchProducts(selectedCategory, e.target.value);
                  }}
                  className="w-full pl-10 pr-4 py-2 bg-luxury-cream border border-luxury-light-gray/10 text-sm focus:outline-none focus:border-luxury-gold transition-colors"
                />
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-taupe" />
              </div>
            </div>

            {/* Right - Sort & View */}
            <div className="flex items-center gap-6">
              <div className="relative group">
                <button className="flex items-center gap-2 text-sm uppercase tracking-[0.1em] text-luxury-black">
                  Sort: <span className="text-luxury-taupe">{sortBy}</span>
                  <ChevronDown size={14} />
                </button>
                <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                  <div className="bg-luxury-white border border-luxury-light-gray/10 shadow-xl py-2 min-w-[200px]">
                    {sortOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => setSortBy(option)}
                        className="w-full text-left px-6 py-2 text-xs uppercase tracking-[0.1em] text-luxury-taupe hover:text-luxury-black hover:bg-luxury-cream transition-colors"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-2 pl-6 border-l border-luxury-light-gray/20">
                <button 
                  onClick={() => setView('grid-3')}
                  className={`p-1 transition-colors ${view === 'grid-3' ? 'text-luxury-black' : 'text-luxury-taupe'}`}
                >
                  <Grid3X3 size={20} />
                </button>
                <button 
                  onClick={() => setView('grid-2')}
                  className={`p-1 transition-colors ${view === 'grid-2' ? 'text-luxury-black' : 'text-luxury-taupe'}`}
                >
                  <LayoutGrid size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(selectedCategory || searchQuery) && (
            <div className="flex flex-wrap gap-3 py-6">
              {selectedCategory && (
                <button 
                  onClick={() => handleCategoryChange('')}
                  className="flex items-center gap-2 px-4 py-1.5 bg-luxury-cream border border-luxury-light-gray/10 text-xs uppercase tracking-[0.1em] text-luxury-black hover:border-luxury-gold transition-colors"
                >
                  {categories.find(c => c.slug === selectedCategory)?.name}
                  <X size={12} />
                </button>
              )}
              {searchQuery && (
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    fetchProducts(selectedCategory, '');
                  }}
                  className="flex items-center gap-2 px-4 py-1.5 bg-luxury-cream border border-luxury-light-gray/10 text-xs uppercase tracking-[0.1em] text-luxury-black hover:border-luxury-gold transition-colors"
                >
                  Search: {searchQuery}
                  <X size={12} />
                </button>
              )}
            </div>
          )}

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-12">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4 animate-pulse">
                  <div className="aspect-[3/4] bg-luxury-cream" />
                  <div className="h-4 bg-luxury-cream w-2/3" />
                  <div className="h-4 bg-luxury-cream w-1/3" />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className={`grid gap-8 py-12 ${
              view === 'grid-3' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'
            }`}>
              {products.map((product) => (
                <Reveal key={product.id} className="group flex flex-col" data-group>
                  <Link href={`/product/${product.id}`} className="block group flex-1">
                    <div className="relative aspect-[3/4] mb-4 overflow-hidden bg-luxury-cream">
                      <RemoteImg
                        src={primaryProductImage(product.images)}
                        alt={product.name}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="font-serif text-lg text-luxury-black mb-1 group-hover:text-luxury-gold transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-luxury-taupe mb-3">
                      {formatPrice(product.price)}
                    </p>
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    className="w-full py-3 bg-luxury-black text-luxury-white text-xs uppercase tracking-[0.15em] hover:bg-luxury-gold transition-colors"
                  >
                    Add to Cart
                  </button>
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-luxury-taupe">No products found matching your criteria.</p>
              <button 
                onClick={() => {
                  setSelectedCategory('');
                  setSearchQuery('');
                  fetchProducts('', '');
                }}
                className="mt-4 text-sm uppercase tracking-[0.1em] text-luxury-black border-b border-luxury-black pb-1"
              >
                Reset all filters
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Filters */}
      <div className={`fixed inset-0 bg-luxury-white z-50 transform transition-transform duration-500 md:hidden ${
        mobileFiltersOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="container-luxury py-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-2xl">Filters</h2>
            <button onClick={() => setMobileFiltersOpen(false)}>
              <X size={24} />
            </button>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] text-luxury-taupe mb-4">Category</h3>
              <div className="space-y-3">
                <button
                  onClick={() => { handleCategoryChange(''); setMobileFiltersOpen(false); }}
                  className={`block w-full text-left py-2 ${
                    selectedCategory === '' ? 'text-luxury-black font-medium' : 'text-luxury-taupe'
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { handleCategoryChange(cat.slug); setMobileFiltersOpen(false); }}
                    className={`block w-full text-left py-2 ${
                      selectedCategory === cat.slug ? 'text-luxury-black font-medium' : 'text-luxury-taupe'
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

      <Footer />
    </>
  );
}
