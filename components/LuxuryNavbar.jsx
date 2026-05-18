'use client';

import { useState, useEffect, useCallback } from 'react';

import Link from 'next/link';

import { useRouter } from 'next/navigation';

import { Search, ShoppingBag, User, Menu, X, ChevronDown, Heart, LogOut } from 'lucide-react';

import {

  AUTH_CHANGED_EVENT,

  clearAuth,

  displayName,

  fetchCurrentUser,

  getStoredUser,

  isLoggedIn,

} from '@/lib/auth';



const navLinks = [

  { name: 'Home', href: '/' },

  { name: 'New Arrivals', href: '/shop?sort=new' },

  { 

    name: 'Shop', 

    href: '/shop',

    megaMenu: [

      { title: "Men's Lower", items: [{name: 'Baggy Jeans', slug: 'baggy-jeans'}, {name: 'Cargo Jeans', slug: 'cargo-jeans'}, {name: 'Straight Fit', slug: 'straight-fit'}, {name: 'Tracksuit', slug: 'tracksuit'}, {name: 'Trouser', slug: 'trouser'}] },

      { title: "Men's Upper", items: [{name: 'Basic T Shirt', slug: 'basic-t-shirt'}, {name: 'Polo', slug: 'polo'}, {name: 'Over Sized', slug: 'over-sized'}, {name: 'Graphic Tee', slug: 'graphic-tee'}, {name: 'Formal Shirt', slug: 'formal-shirt'}] },

      { title: 'Women & Kids', items: [{name: 'Long Shirt', slug: 'long-shirt'}, {name: 'Night Suit', slug: 'night-suit'}, {name: 'Kids Jeans', slug: 'kids-jeans'}, {name: 'Kids T Shirts', slug: 'kids-t-shirts'}] },

      { title: 'Winter', items: [{name: 'Denim Jacket', slug: 'denim-jacket'}, {name: 'Hoodie', slug: 'hoodie'}, {name: 'Puffer Jacket', slug: 'puffer-jacket'}, {name: 'Zipper', slug: 'zipper'}] },

    ]

  },

  { name: 'Collections', href: '/collections' },

  { name: 'About', href: '/about' },

  { name: 'Contact', href: '/contact' },

];



export default function LuxuryNavbar() {

  const router = useRouter();

  const [scrolled, setScrolled] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);

  const [activeMegaMenu, setActiveMegaMenu] = useState(null);

  const [cartCount, setCartCount] = useState(0);

  const [user, setUser] = useState(null);

  const [accountOpen, setAccountOpen] = useState(false);



  const refreshCartCount = useCallback(() => {

    try {

      const raw = localStorage.getItem('cart');

      const cart = raw ? JSON.parse(raw) : [];

      const n = Array.isArray(cart) ? cart.reduce((s, i) => s + (i.quantity || 1), 0) : 0;

      setCartCount(n);

    } catch {

      setCartCount(0);

    }

  }, []);



  const loadUser = useCallback(async () => {

    if (!isLoggedIn()) {

      setUser(null);

      return;

    }

    const stored = getStoredUser();

    setUser(stored);

    const fresh = await fetchCurrentUser();

    if (fresh) setUser(fresh);

  }, []);



  useEffect(() => {

    const handleScroll = () => {

      setScrolled(window.scrollY > 50);

    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);

  }, []);



  useEffect(() => {

    refreshCartCount();

    loadUser();

    const onStorage = () => refreshCartCount();

    const onAuth = () => loadUser();

    window.addEventListener('storage', onStorage);

    window.addEventListener('cart-updated', onStorage);

    window.addEventListener(AUTH_CHANGED_EVENT, onAuth);

    return () => {

      window.removeEventListener('storage', onStorage);

      window.removeEventListener('cart-updated', onStorage);

      window.removeEventListener(AUTH_CHANGED_EVENT, onAuth);

    };

  }, [refreshCartCount, loadUser]);



  const handleLogout = () => {

    clearAuth();

    setUser(null);

    setAccountOpen(false);

    setMobileMenuOpen(false);

    router.push('/');

    router.refresh();

  };



  const loggedIn = Boolean(user?.id);



  return (

    <>

      {/* Announcement Bar */}

      <div className="bg-luxury-black text-luxury-white text-center py-2.5 text-[11px] uppercase tracking-[0.2em]">

        Free Nationwide Shipping on Orders Over Rs. 5,000

      </div>



      {/* Main Navbar */}

      <header 

        className={`fixed top-8 left-0 right-0 z-50 transition-all duration-500 ${

          scrolled ? 'bg-luxury-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'

        }`}

      >

        <nav className="container-luxury">

          <div className="flex items-center justify-between h-20">

            {/* Left - Mobile Menu & Search */}

            <div className="flex items-center gap-6">

              <button 

                onClick={() => setMobileMenuOpen(true)}

                className="lg:hidden p-2 -ml-2 text-luxury-black hover:text-luxury-gold transition-colors"

              >

                <Menu size={22} strokeWidth={1.5} />

              </button>

              <button 

                onClick={() => setSearchOpen(true)}

                className="hidden lg:block p-2 text-luxury-black hover:text-luxury-gold transition-colors"

              >

                <Search size={20} strokeWidth={1.5} />

              </button>

            </div>



            {/* Center - Logo */}

            <Link href="/" className="absolute left-1/2 -translate-x-1/2">

              <h1 className={`font-serif text-2xl md:text-3xl tracking-[0.15em] font-medium transition-colors ${

                scrolled ? 'text-luxury-black' : 'text-luxury-black'

              }`}>

                MERRY BERRY

              </h1>

            </Link>



            {/* Right - Icons */}

            <div className="flex items-center gap-5">

              {loggedIn ? (

                <div className="relative hidden lg:block">

                  <button

                    type="button"

                    onClick={() => setAccountOpen((o) => !o)}

                    className="flex items-center gap-2 p-2 text-luxury-black hover:text-luxury-gold transition-colors max-w-[160px]"

                    aria-label="My account"

                    aria-expanded={accountOpen}

                  >

                    <User size={20} strokeWidth={1.5} className="shrink-0" />

                    <span className="text-xs uppercase tracking-[0.1em] truncate">

                      Hi, {displayName(user)}

                    </span>

                  </button>

                  {accountOpen && (

                    <>

                      <button

                        type="button"

                        className="fixed inset-0 z-40"

                        aria-label="Close menu"

                        onClick={() => setAccountOpen(false)}

                      />

                      <div className="absolute right-0 top-full z-50 mt-2 min-w-[200px] border border-luxury-light-gray/20 bg-luxury-white py-2 shadow-xl">

                        <p className="px-4 py-2 text-xs text-luxury-taupe truncate border-b border-luxury-light-gray/10">

                          {user.name}

                        </p>

                        <Link

                          href="/account"

                          onClick={() => setAccountOpen(false)}

                          className="block px-4 py-2.5 text-sm text-luxury-black hover:bg-luxury-cream hover:text-luxury-gold"

                        >

                          My Account

                        </Link>

                        <Link

                          href="/account"

                          onClick={() => setAccountOpen(false)}

                          className="block px-4 py-2.5 text-sm text-luxury-black hover:bg-luxury-cream hover:text-luxury-gold"

                        >

                          My Orders

                        </Link>

                        <button

                          type="button"

                          onClick={handleLogout}

                          className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"

                        >

                          <LogOut size={16} /> Logout

                        </button>

                      </div>

                    </>

                  )}

                </div>

              ) : (

                <Link

                  href="/login"

                  className="hidden lg:block p-2 text-luxury-black hover:text-luxury-gold transition-colors"

                  aria-label="Sign in"

                >

                  <User size={20} strokeWidth={1.5} />

                </Link>

              )}

              <button className="hidden lg:block p-2 text-luxury-black hover:text-luxury-gold transition-colors" type="button" aria-label="Wishlist">

                <Heart size={20} strokeWidth={1.5} />

              </button>

              <Link

                href="/cart"

                onClick={() => refreshCartCount()}

                className="relative p-2 text-luxury-black hover:text-luxury-gold transition-colors"

              >

                <ShoppingBag size={20} strokeWidth={1.5} />

                {cartCount > 0 && (

                  <span className="absolute -top-0.5 -right-0.5 min-w-[1rem] h-4 px-0.5 bg-luxury-gold text-luxury-white text-[10px] flex items-center justify-center rounded-full">

                    {cartCount > 99 ? '99+' : cartCount}

                  </span>

                )}

              </Link>

            </div>

          </div>



          {/* Desktop Navigation */}

          <div className="hidden lg:flex items-center justify-center gap-10 pb-4">

            {navLinks.map((link) => (

              <div 

                key={link.name}

                className="relative group"

                onMouseEnter={() => link.megaMenu && setActiveMegaMenu(link.name)}

                onMouseLeave={() => setActiveMegaMenu(null)}

              >

                <Link 

                  href={link.href}

                  className="flex items-center gap-1 text-xs uppercase tracking-[0.15em] text-luxury-black hover:text-luxury-gold transition-colors py-2"

                >

                  {link.name}

                  {link.megaMenu && <ChevronDown size={14} />}

                </Link>



                {/* Mega Menu */}

                {link.megaMenu && activeMegaMenu === link.name && (

                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4">

                    <div className="bg-luxury-white border border-luxury-light-gray/10 shadow-2xl p-8 min-w-[600px]">

                      <div className="grid grid-cols-4 gap-8">

                        {link.megaMenu.map((section) => (

                          <div key={section.title}>

                            <h3 className="text-xs uppercase tracking-[0.2em] text-luxury-taupe mb-4">

                              {section.title}

                            </h3>

                            <ul className="space-y-3">

                              {section.items.map((item) => (

                                <li key={item.slug}>

                                  <Link 

                                    href={`/shop?category=${item.slug}`}

                                    className="text-sm text-luxury-black hover:text-luxury-gold transition-colors underline-luxury"

                                  >

                                    {item.name}

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



      {/* Mobile Menu */}

      <div className={`fixed inset-0 bg-luxury-white z-50 transform transition-transform duration-500 ${

        mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'

      }`}>

        <div className="container-luxury py-6">

          <div className="flex items-center justify-between mb-12">

            <h1 className="font-serif text-2xl tracking-[0.15em]">MERRY BERRY</h1>

            <button 

              onClick={() => setMobileMenuOpen(false)}

              className="p-2 -mr-2"

            >

              <X size={24} strokeWidth={1.5} />

            </button>

          </div>

          

          <nav className="space-y-6">

            {navLinks.map((link) => (

              <Link 

                key={link.name}

                href={link.href}

                onClick={() => setMobileMenuOpen(false)}

                className="block text-2xl font-serif text-luxury-black hover:text-luxury-gold transition-colors"

              >

                {link.name}

              </Link>

            ))}

          </nav>



          <div className="absolute bottom-8 left-6 right-6">

            <div className="flex flex-col gap-4 pt-6 border-t border-luxury-light-gray/20">

              {loggedIn ? (

                <>

                  <p className="text-sm text-luxury-taupe">

                    Signed in as <span className="text-luxury-black font-medium">{user.name}</span>

                  </p>

                  <Link

                    href="/account"

                    onClick={() => setMobileMenuOpen(false)}

                    className="flex items-center gap-2 text-sm uppercase tracking-[0.1em]"

                  >

                    <User size={18} strokeWidth={1.5} /> My Account

                  </Link>

                  <button

                    type="button"

                    onClick={handleLogout}

                    className="flex items-center gap-2 text-sm uppercase tracking-[0.1em] text-red-600"

                  >

                    <LogOut size={18} strokeWidth={1.5} /> Logout

                  </button>

                </>

              ) : (

                <Link

                  href="/login"

                  onClick={() => setMobileMenuOpen(false)}

                  className="flex items-center gap-2 text-sm uppercase tracking-[0.1em]"

                >

                  <User size={18} strokeWidth={1.5} /> Sign In

                </Link>

              )}

              <button className="flex items-center gap-2 text-sm uppercase tracking-[0.1em]" type="button">

                <Heart size={18} strokeWidth={1.5} /> Wishlist

              </button>

            </div>

          </div>

        </div>

      </div>



      {/* Search Overlay */}

      <div className={`fixed inset-0 bg-luxury-black/95 z-50 flex items-center justify-center transition-all duration-500 ${

        searchOpen ? 'opacity-100 visible' : 'opacity-0 invisible'

      }`}>

        <button 

          onClick={() => setSearchOpen(false)}

          className="absolute top-8 right-8 text-luxury-white hover:text-luxury-gold transition-colors"

        >

          <X size={32} strokeWidth={1} />

        </button>

        <div className="w-full max-w-3xl px-6">

          <input 

            type="text"

            placeholder="Search products..."

            className="w-full bg-transparent border-b-2 border-luxury-white/30 focus:border-luxury-gold text-luxury-white text-3xl md:text-5xl font-serif py-4 outline-none placeholder:text-luxury-white/30"

            autoFocus={searchOpen}

            onKeyDown={(e) => {

              if (e.key === 'Enter' && e.target.value.trim()) {

                setSearchOpen(false);

                window.location.href = `/shop?search=${encodeURIComponent(e.target.value.trim())}`;

              }

            }}

          />

          <p className="text-luxury-white/50 text-sm mt-4 uppercase tracking-[0.2em]">

            Press Enter to search

          </p>

        </div>

      </div>

    </>

  );

}

