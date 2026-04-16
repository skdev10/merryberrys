'use client';
import Link from 'next/link';
import { ShoppingCart, Search, User, Menu, X, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-zinc-950/95 backdrop-blur-xl border-b border-white/5 shadow-xl' 
        : 'bg-zinc-950/80 backdrop-blur-md'
    }`}>
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-berry-900 via-berry-800 to-berry-900 text-white text-center py-2 text-sm">
        <p className="flex items-center justify-center gap-2">
          <span className="hidden sm:inline">✨</span>
          Free Shipping on Orders Over $50 | Use Code <span className="font-bold text-gold-400">MERRY20</span> for 20% Off
          <span className="hidden sm:inline">✨</span>
        </p>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <div className="flex-1 flex items-center md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-zinc-300 hover:text-berry-500 transition-colors">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <div className="flex-shrink-0 flex items-center justify-center">
            <Link href="/" className="group flex items-center gap-1">
              <div className="w-10 h-10 bg-gradient-to-br from-berry-500 to-gold-500 rounded-full flex items-center justify-center mr-2">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-white group-hover:text-berry-400 transition-colors">
                MERRY <span className="text-berry-500 group-hover:text-gold-400 transition-colors">BERRY</span>
              </span>
            </Link>
          </div>

          <nav className="hidden lg:flex flex-1 justify-center space-x-8">
            <Link href="/" className="text-zinc-300 hover:text-white font-medium transition-colors relative group">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-berry-500 group-hover:w-full transition-all"></span>
            </Link>
            <div className="group relative">
              <Link href="/shop" className="text-zinc-300 hover:text-white font-medium transition-colors inline-flex items-center gap-1">
                Shop
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-berry-500 group-hover:w-full transition-all"></span>
              </Link>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[600px] bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 p-6 grid grid-cols-3 gap-6">
                <div>
                  <h3 className="text-gold-400 font-serif mb-4 text-lg flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-berry-500/20 flex items-center justify-center text-sm">👨</span>
                    Men
                  </h3>
                  <ul className="space-y-2">
                    <li><Link href="/shop/men-lower" className="text-sm text-zinc-400 hover:text-white transition-colors">Lower Body</Link></li>
                    <li><Link href="/shop/men-upper" className="text-sm text-zinc-400 hover:text-white transition-colors">Upper Body</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-gold-400 font-serif mb-4 text-lg flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-berry-500/20 flex items-center justify-center text-sm">👩</span>
                    Women & Kids
                  </h3>
                  <ul className="space-y-2">
                    <li><Link href="/shop/women" className="text-sm text-zinc-400 hover:text-white transition-colors">Women Collection</Link></li>
                    <li><Link href="/shop/kids" className="text-sm text-zinc-400 hover:text-white transition-colors">Kids Collection</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-gold-400 font-serif mb-4 text-lg flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-berry-500/20 flex items-center justify-center text-sm">❄️</span>
                    Winter
                  </h3>
                  <ul className="space-y-2">
                    <li><Link href="/shop/winter-collection" className="text-sm text-zinc-400 hover:text-white transition-colors">Winter Collection</Link></li>
                  </ul>
                </div>
              </div>
            </div>
            <Link href="/custom-print" className="text-berry-400 hover:text-berry-300 font-medium transition-colors relative group">
              Custom Print
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold-400 group-hover:w-full transition-all"></span>
            </Link>
            <Link href="/about" className="text-zinc-300 hover:text-white font-medium transition-colors relative group">
              About Us
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-berry-500 group-hover:w-full transition-all"></span>
            </Link>
            <Link href="/contact" className="text-zinc-300 hover:text-white font-medium transition-colors relative group">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-berry-500 group-hover:w-full transition-all"></span>
            </Link>
          </nav>

          <div className="flex-1 flex items-center justify-end space-x-3 md:space-x-5">
            <button className="text-zinc-300 hover:text-white transition-colors hidden sm:block hover:scale-110 transform">
              <Search size={20} />
            </button>
            <Link href="/wishlist" className="text-zinc-300 hover:text-white transition-colors hidden sm:block hover:scale-110 transform">
              <Heart size={20} />
            </Link>
            <Link href="/account" className="text-zinc-300 hover:text-white transition-colors hover:scale-110 transform">
              <User size={20} />
            </Link>
            <Link href="/cart" className="text-zinc-300 hover:text-white transition-colors relative flex items-center group hover:scale-110 transform">
              <ShoppingCart size={20} />
              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-berry-500 to-gold-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg group-hover:scale-110 transition-transform">0</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-zinc-900/95 backdrop-blur-xl border-t border-white/5 animate-fade-in">
          <div className="px-4 py-6 space-y-4">
            <Link href="/" className="block px-4 py-3 rounded-xl text-base font-medium text-white hover:bg-white/5 transition-colors">Home</Link>
            <Link href="/shop" className="block px-4 py-3 rounded-xl text-base font-medium text-white hover:bg-white/5 transition-colors">Shop</Link>
            <Link href="/custom-print" className="block px-4 py-3 rounded-xl text-base font-medium text-berry-400 hover:bg-white/5 transition-colors">Custom Print</Link>
            <Link href="/about" className="block px-4 py-3 rounded-xl text-base font-medium text-white hover:bg-white/5 transition-colors">About Us</Link>
            <Link href="/contact" className="block px-4 py-3 rounded-xl text-base font-medium text-white hover:bg-white/5 transition-colors">Contact</Link>
          </div>
        </div>
      )}
    </header>
  );
}
