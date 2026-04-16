import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone, CreditCard, Truck, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-white/5">
      {/* Main Footer Content */}
      <div className="pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            
            {/* Brand Column */}
            <div>
              <Link href="/" className="flex items-center gap-2 mb-6 group">
                <div className="w-10 h-10 bg-gradient-to-br from-berry-500 to-gold-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <span className="font-serif text-2xl font-bold tracking-tight text-white group-hover:text-berry-400 transition-colors">
                  MERRY <span className="text-berry-500">BERRY</span>
                </span>
              </Link>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                Experience the finest in luxury fashion and customizable apparel. Premium quality with outstanding design for every occasion.
              </p>
              <div className="flex space-x-3">
                <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-berry-500 hover:bg-berry-500/10 transition-all">
                  <Facebook size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-berry-500 hover:bg-berry-500/10 transition-all">
                  <Instagram size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-berry-500 hover:bg-berry-500/10 transition-all">
                  <Twitter size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-berry-500 hover:bg-berry-500/10 transition-all">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.03-1.99 1.27-5.62 3.72-.53.36-1.01.54-1.44.53-.47-.01-1.38-.27-2.06-.49-.83-.27-1.49-.42-1.43-.88.03-.24.37-.49 1.02-.74 4-1.74 6.67-2.89 8.02-3.44 3.81-1.57 4.61-1.85 5.12-1.85.11 0 .37.03.54.17.14.12.18.28.2.45-.01.06.01.24 0 .38z"/></svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-serif text-lg mb-6 tracking-wide">Quick Links</h4>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-zinc-400 hover:text-berry-400 text-sm transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-berry-500 rounded-full"></span>About Us</Link></li>
                <li><Link href="/shop" className="text-zinc-400 hover:text-berry-400 text-sm transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-berry-500 rounded-full"></span>Shop All</Link></li>
                <li><Link href="/custom-print" className="text-zinc-400 hover:text-berry-400 text-sm transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-berry-500 rounded-full"></span>Custom Print</Link></li>
                <li><Link href="/orders" className="text-zinc-400 hover:text-berry-400 text-sm transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-berry-500 rounded-full"></span>Track Order</Link></li>
                <li><Link href="/contact" className="text-zinc-400 hover:text-berry-400 text-sm transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-berry-500 rounded-full"></span>Contact Us</Link></li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-white font-serif text-lg mb-6 tracking-wide">Categories</h4>
              <ul className="space-y-3">
                <li><Link href="/shop/men-lower" className="text-zinc-400 hover:text-berry-400 text-sm transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-gold-400 rounded-full"></span>Men's Lower</Link></li>
                <li><Link href="/shop/men-upper" className="text-zinc-400 hover:text-berry-400 text-sm transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-gold-400 rounded-full"></span>Men's Upper</Link></li>
                <li><Link href="/shop/women" className="text-zinc-400 hover:text-berry-400 text-sm transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-gold-400 rounded-full"></span>Women's Collection</Link></li>
                <li><Link href="/shop/kids" className="text-zinc-400 hover:text-berry-400 text-sm transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-gold-400 rounded-full"></span>Kids' Collection</Link></li>
                <li><Link href="/shop/winter-collection" className="text-zinc-400 hover:text-berry-400 text-sm transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-gold-400 rounded-full"></span>Winter Collection</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-white font-serif text-lg mb-6 tracking-wide">Contact Info</h4>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-berry-500/10 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <MapPin size={14} className="text-berry-400" />
                  </div>
                  <span className="text-zinc-400 text-sm">123 Luxury Avenue, Fashion District, NY 10001</span>
                </li>
                <li className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-berry-500/10 flex items-center justify-center mr-3 flex-shrink-0">
                    <Phone size={14} className="text-berry-400" />
                  </div>
                  <span className="text-zinc-400 text-sm">+1 (800) 123-4567</span>
                </li>
                <li className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-berry-500/10 flex items-center justify-center mr-3 flex-shrink-0">
                    <Mail size={14} className="text-berry-400" />
                  </div>
                  <span className="text-zinc-400 text-sm">support@merryberry.com</span>
                </li>
              </ul>
              
              {/* Payment Methods */}
              <div className="mt-6">
                <p className="text-zinc-500 text-xs mb-3">Secure Payment Methods</p>
                <div className="flex gap-2">
                  <div className="px-3 py-1.5 bg-zinc-900 rounded text-xs text-zinc-400 border border-white/10">Visa</div>
                  <div className="px-3 py-1.5 bg-zinc-900 rounded text-xs text-zinc-400 border border-white/10">MC</div>
                  <div className="px-3 py-1.5 bg-zinc-900 rounded text-xs text-zinc-400 border border-white/10">PayPal</div>
                  <div className="px-3 py-1.5 bg-zinc-900 rounded text-xs text-zinc-400 border border-white/10">Apple Pay</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-zinc-500 text-sm">
              © {new Date().getFullYear()} Merry Berry. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/privacy" className="text-zinc-500 hover:text-white text-sm transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-zinc-500 hover:text-white text-sm transition-colors">Terms of Service</Link>
              <Link href="/refund" className="text-zinc-500 hover:text-white text-sm transition-colors">Refund Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
