'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, User, Menu, X, ChevronDown, Heart, LogOut } from 'lucide-react';
import { formatPKR, FREE_SHIPPING_MIN_PKR } from '@/lib/currency';

/** All routes exist under app/ — no placeholder /shop/[slug] 404s */
const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'New Arrivals', href: '/shop?sort=new' },
  {
    name: 'Shop',
    href: '/shop',
    megaMenu: [
      {
        title: 'Browse',
        links: [
          { label: 'All products', href: '/shop' },
          { label: 'New arrivals', href: '/shop?sort=new' },
          { label: 'Collections', href: '/collections' },
        ],
      },
      {
        title: 'Discover',
        links: [
          { label: 'Our story', href: '/about' },
          { label: 'Lookbook', href: '/collections' },
          { label: 'Wishlist', href: '/wishlist' },
        ],
      },
      {
        title: 'Account',
        links: [
          { label: 'Sign in', href: '/login' },
          { label: 'Register', href: '/register' },
          { label: 'Order history', href: '/account' },
        ],
      },
    ],
  },
  { name: 'Collections', href: '/collections' },
  { name: 'About', href: '/about' },
];

export default function LuxuryNavbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);

  const refreshSession = useCallback(async () => {
    try {
      const meRes = await fetch('/api/auth/me', { credentials: 'include' });
      const meData = await meRes.json();
      const u = meData.user || null;
      setUser(u);

      if (!u) {
        setCartCount(0);
        return;
      }

      const cartRes = await fetch('/api/cart', { credentials: 'include' });
      if (cartRes.ok) {
        const cartData = await cartRes.json();
        const items = cartData.items || [];
        const count = items.reduce((n, line) => n + line.quantity, 0);
        setCartCount(count);
      } else {
        setCartCount(0);
      }
    } catch {
      setUser(null);
      setCartCount(0);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  useEffect(() => {
    const onCart = () => refreshSession();
    window.addEventListener('gocart-cart', onCart);
    return () => window.removeEventListener('gocart-cart', onCart);
  }, [refreshSession]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen || searchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen, searchOpen]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
    setCartCount(0);
    router.refresh();
  };

  return (
    <>
      <div className="bg-luxury-black text-luxury-white text-center py-2.5 px-4 text-[10px] sm:text-[11px] uppercase tracking-[0.18em] sm:tracking-[0.2em]">
        Complimentary shipping on orders over {formatPKR(FREE_SHIPPING_MIN_PKR)} (Pakistan)
      </div>

      <header
        className={`fixed top-8 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-luxury-white/95 backdrop-blur-md shadow-sm' : 'bg-luxury-white/80 md:bg-transparent md:backdrop-blur-0'
        }`}
      >
        <nav className="container-luxury" aria-label="Main">
          <div className="flex items-center justify-between h-[4.25rem] sm:h-20">
            <div className="flex items-center gap-2 sm:gap-6">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 -ml-2 text-luxury-black hover:text-luxury-gold transition-colors"
                aria-label="Open menu"
              >
                <Menu size={22} strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="p-2 text-luxury-black hover:text-luxury-gold transition-colors"
                aria-label="Search"
              >
                <Search size={20} strokeWidth={1.5} />
              </button>
            </div>

            <Link href="/" className="absolute left-1/2 -translate-x-1/2 max-w-[55vw] text-center">
              <span className="font-serif text-xl sm:text-2xl md:text-3xl tracking-[0.12em] sm:tracking-[0.15em] font-medium text-luxury-black block truncate">
                MERRY BERRY
              </span>
            </Link>

            <div className="flex items-center gap-2 sm:gap-4 md:gap-5">
              {user ? (
                <div className="hidden lg:flex items-center gap-3 text-xs uppercase tracking-[0.12em] text-luxury-black">
                  <span className="max-w-[120px] xl:max-w-[140px] truncate">Hi, {user.name?.split(' ')[0]}</span>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-1 text-luxury-taupe hover:text-luxury-black"
                  >
                    <LogOut size={16} aria-hidden />
                    Log out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden lg:inline-flex items-center gap-1 text-xs uppercase tracking-[0.12em] text-luxury-black hover:text-luxury-gold"
                >
                  <User size={18} strokeWidth={1.5} aria-hidden />
                  Sign in
                </Link>
              )}
              <Link
                href="/wishlist"
                className="hidden sm:block p-2 text-luxury-black hover:text-luxury-gold transition-colors"
                aria-label="Wishlist"
              >
                <Heart size={20} strokeWidth={1.5} />
              </Link>
              <Link href="/cart" className="relative p-2 text-luxury-black hover:text-luxury-gold transition-colors" aria-label="Shopping bag">
                <ShoppingBag size={20} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[1rem] h-4 px-0.5 bg-luxury-gold text-luxury-white text-[10px] flex items-center justify-center rounded-full font-medium">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          <div className="hidden lg:flex items-center justify-center gap-8 xl:gap-10 pb-4">
            {navLinks.map((link) => (
              <div
                key={link.name}
                className="relative"
                onMouseEnter={() => link.megaMenu && setActiveMegaMenu(link.name)}
                onMouseLeave={() => setActiveMegaMenu(null)}
              >
                <Link
                  href={link.href}
                  className="flex items-center gap-1 text-xs uppercase tracking-[0.15em] text-luxury-black hover:text-luxury-gold transition-colors py-2"
                >
                  {link.name}
                  {link.megaMenu && <ChevronDown size={14} aria-hidden />}
                </Link>

                {link.megaMenu && activeMegaMenu === link.name && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50">
                    <div
                      className="bg-luxury-white border border-luxury-light-gray/15 shadow-2xl p-8 w-[min(100vw-2rem,640px)] max-w-[640px]"
                      role="navigation"
                      aria-label={`${link.name} menu`}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                        {link.megaMenu.map((section) => (
                          <div key={section.title}>
                            <h3 className="text-xs uppercase tracking-[0.2em] text-luxury-taupe mb-4">{section.title}</h3>
                            <ul className="space-y-3">
                              {section.links.map((item) => (
                                <li key={item.label}>
                                  <Link
                                    href={item.href}
                                    className="text-sm text-luxury-black hover:text-luxury-gold transition-colors underline-luxury"
                                  >
                                    {item.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>
      </header>

      <div
        className={`fixed inset-0 bg-luxury-white z-[100] transform transition-transform duration-500 ease-out lg:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="container-luxury py-6 h-full flex flex-col overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="font-serif text-xl tracking-[0.15em] text-luxury-black" onClick={() => setMobileMenuOpen(false)}>
              MERRY BERRY
            </Link>
            <button type="button" onClick={() => setMobileMenuOpen(false)} className="p-2 -mr-2" aria-label="Close menu">
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>

          <nav className="space-y-1 flex-1" aria-label="Mobile">
            {navLinks.map((link) => (
              <div key={link.name} className="border-b border-luxury-light-gray/15 last:border-0">
                <Link
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-4 text-xl font-serif text-luxury-black hover:text-luxury-gold transition-colors"
                >
                  {link.name}
                </Link>
                {link.megaMenu && (
                  <ul className="pb-4 pl-2 space-y-2">
                    {link.megaMenu.flatMap((s) =>
                      s.links.map((l) => (
                        <li key={l.href + l.label}>
                          <Link
                            href={l.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-sm text-luxury-taupe hover:text-luxury-black"
                          >
                            {l.label}
                          </Link>
                        </li>
                      ))
                    )}
                  </ul>
                )}
              </div>
            ))}
          </nav>

          <div className="pt-6 mt-auto border-t border-luxury-light-gray/20 flex flex-col gap-3">
            {user ? (
              <button
                type="button"
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-sm uppercase tracking-[0.1em] text-luxury-black"
              >
                <LogOut size={18} strokeWidth={1.5} /> Log out
              </button>
            ) : (
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-sm uppercase tracking-[0.1em]">
                <User size={18} strokeWidth={1.5} /> Sign in
              </Link>
            )}
            <Link href="/wishlist" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-sm uppercase tracking-[0.1em] sm:hidden">
              <Heart size={18} strokeWidth={1.5} /> Wishlist
            </Link>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 bg-luxury-black/95 z-[110] flex flex-col items-center justify-center transition-opacity duration-300 ${
          searchOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Search"
      >
        <button
          type="button"
          onClick={() => setSearchOpen(false)}
          className="absolute top-6 right-6 sm:top-8 sm:right-8 text-luxury-white hover:text-luxury-gold transition-colors p-2"
          aria-label="Close search"
        >
          <X size={28} strokeWidth={1} />
        </button>
        <div className="w-full max-w-3xl px-6 mt-8">
          <label htmlFor="site-search" className="sr-only">
            Search products
          </label>
          <input
            id="site-search"
            type="search"
            placeholder="Search the collection…"
            className="w-full bg-transparent border-b-2 border-luxury-white/30 focus:border-luxury-gold text-luxury-white text-2xl sm:text-3xl md:text-5xl font-serif py-4 outline-none placeholder:text-luxury-white/30"
            autoFocus={searchOpen}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const q = e.currentTarget.value.trim();
                setSearchOpen(false);
                router.push(q ? `/shop?q=${encodeURIComponent(q)}` : '/shop');
              }
            }}
          />
          <p className="text-luxury-white/50 text-xs sm:text-sm mt-4 uppercase tracking-[0.15em]">Press enter to search, or browse all in Shop.</p>
        </div>
      </div>
    </>
  );
}
