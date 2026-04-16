'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LuxuryNavbar from '../../components/LuxuryNavbar';
import { SlidersHorizontal, X, ChevronDown, Grid3X3, LayoutGrid } from 'lucide-react';

const sortOptions = ['Featured', 'Newest', 'Price: Low to High', 'Price: High to Low'];

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('Featured');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [gridCols, setGridCols] = useState(3);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
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
      const url = categoryId 
        ? `/api/products?category=${categoryId}` 
        : '/api/products';
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

  const filteredProducts = [...products].sort((a, b) => {
    switch(sortBy) {
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

  return (
    <>
      <LuxuryNavbar />
      
      <main className="pt-32 pb-20 bg-luxury-white min-h-screen">
        {/* Header */}
        <div className="container-luxury mb-12">
          <div className="text-center mb-12">
            <p className="text-luxury-caption text-luxury-taupe mb-4">Collection</p>
            <h1 className="text-luxury-subheading text-luxury-black">
              All Products
            </h1>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 py-6 border-t border-b border-luxury-light-gray/20">
            {/* Left - Category Filters */}
            <div className="flex items-center gap-6 overflow-x-auto pb-2 md:pb-0">
              <button 
                onClick={() => setMobileFiltersOpen(true)}
                className="md:hidden flex items-center gap-2 text-sm uppercase tracking-[0.1em]"
              >
                <SlidersHorizontal size={16} /> Filters
              </button>
              
              <div className="hidden md:flex items-center gap-6">
                <button
                  onClick={() => handleCategoryChange('')}
                  className={`text-sm uppercase tracking-[0.1em] transition-colors ${
                    selectedCategory === '' 
                      ? 'text-luxury-black border-b border-luxury-black pb-1' 
                      : 'text-luxury-taupe hover:text-luxury-black'
                  }`}
                >
                  All
                </button>
                {categories.slice(0, 8).map((cat) => (
                  <button
                    key={cat.id}
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

            {/* Right - Sort & View */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <button className="flex items-center gap-2 text-sm text-luxury-taupe hover:text-luxury-black transition-colors peer">
                  Sort by: <span className="text-luxury-black">{sortBy}</span>
                  <ChevronDown size={14} />
                </button>
                <div className="absolute top-full right-0 mt-2 w-48 bg-luxury-white border border-luxury-light-gray/20 shadow-lg opacity-0 invisible peer-hover:opacity-100 peer-hover:visible hover:opacity-100 hover:visible transition-all z-10">
                  {sortOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => setSortBy(option)}
                      className={`block w-full text-left px-4 py-3 text-sm hover:bg-luxury-cream transition-colors ${
                        sortBy === option ? 'text-luxury-black' : 'text-luxury-taupe'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="hidden md:flex items-center gap-2 border-l border-luxury-light-gray/20 pl-6">
                <button 
                  onClick={() => setGridCols(2)}
                  className={`p-2 transition-colors ${gridCols === 2 ? 'text-luxury-black' : 'text-luxury-taupe'}`}
                >
                  <LayoutGrid size={18} />
                </button>
                <button 
                  onClick={() => setGridCols(3)}
                  className={`p-2 transition-colors ${gridCols === 3 ? 'text-luxury-black' : 'text-luxury-taupe'}`}
                >
                  <Grid3X3 size={18} />
                </button>
              </div>
            </div>
          </div>

          <p className="mt-6 text-sm text-luxury-taupe">
            Showing {filteredProducts.length} products
          </p>
        </div>

        {/* Products Grid */}
        <div className="container-luxury">
          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-luxury-cream mb-4" />
                  <div className="h-4 bg-luxury-cream w-3/4 mb-2" />
                  <div className="h-4 bg-luxury-cream w-1/4" />
                </div>
              ))}
            </div>
          ) : (
            <div className={`grid gap-6 md:gap-8 ${
              gridCols === 2 ? 'grid-cols-2 lg:grid-cols-2' : 'grid-cols-2 lg:grid-cols-3'
            }`}>
              {filteredProducts.map((product, index) => {
                const images = JSON.parse(product.images || '[]');
                return (
                  <div 
                    key={product.id}
                    className="group"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <Link href={`/product/${product.id}`} className="block group">
                      <div className="relative aspect-[3/4] mb-4 overflow-hidden bg-luxury-cream">
                        <Image
                          src={images[0] || '/placeholder.jpg'}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
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
                      <p className="text-sm text-luxury-taupe">
                        ${product.price}
                      </p>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}

          {!isLoading && filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-luxury-taupe text-lg">No products found</p>
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
                    onClick={() => { handleCategoryChange(cat.id); setMobileFiltersOpen(false); }}
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

      {/* Footer */}
      <footer className="bg-luxury-black text-luxury-white py-12">
        <div className="container-luxury text-center">
          <h2 className="font-serif text-2xl tracking-[0.15em] mb-4">MERRY BERRY</h2>
          <p className="text-sm text-luxury-white/60">
            © 2026 Merry Berry. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
