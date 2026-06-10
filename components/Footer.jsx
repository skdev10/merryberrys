import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import { SITE } from '@/lib/site';
import SocialLinks from '@/components/SocialLinks';
import { FooterLogo } from '@/components/BrandLogo';

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-white/5">
      <div className="pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-6 group">
                <FooterLogo />
              </Link>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                {SITE.welcomeTitle} Premium Pakistani fashion — {SITE.tagline}.
              </p>
              <SocialLinks />
            </div>

            <div>
              <h4 className="text-white font-serif text-lg mb-6 tracking-wide">Quick Links</h4>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-zinc-400 hover:text-berry-400 text-sm transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-berry-500 rounded-full"></span>About Us</Link></li>
                <li><Link href="/shop" className="text-zinc-400 hover:text-berry-400 text-sm transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-berry-500 rounded-full"></span>Shop All</Link></li>
                <li><Link href="/custom-print" className="text-zinc-400 hover:text-berry-400 text-sm transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-berry-500 rounded-full"></span>Custom Print</Link></li>
                <li><Link href="/account" className="text-zinc-400 hover:text-berry-400 text-sm transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-berry-500 rounded-full"></span>My Orders</Link></li>
                <li><Link href="/contact" className="text-zinc-400 hover:text-berry-400 text-sm transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-berry-500 rounded-full"></span>Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-serif text-lg mb-6 tracking-wide">Categories</h4>
              <ul className="space-y-3">
                <li><Link href="/shop?category=baggy-jeans" className="text-zinc-400 hover:text-berry-400 text-sm transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-gold-400 rounded-full"></span>Men&apos;s Lower</Link></li>
                <li><Link href="/shop?category=basic-t-shirt" className="text-zinc-400 hover:text-berry-400 text-sm transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-gold-400 rounded-full"></span>Men&apos;s Upper</Link></li>
                <li><Link href="/shop?category=long-shirt" className="text-zinc-400 hover:text-berry-400 text-sm transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-gold-400 rounded-full"></span>Women & Kids</Link></li>
                <li><Link href="/shop?category=hoodie" className="text-zinc-400 hover:text-berry-400 text-sm transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-gold-400 rounded-full"></span>Winter Collection</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-serif text-lg mb-6 tracking-wide">Contact Info</h4>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-berry-500/10 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <MapPin size={14} className="text-berry-400" />
                  </div>
                  <span className="text-zinc-400 text-sm">{SITE.location}</span>
                </li>
                <li className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-berry-500/10 flex items-center justify-center mr-3 flex-shrink-0">
                    <Phone size={14} className="text-berry-400" />
                  </div>
                  <a href={`tel:${SITE.phone.replace(/\s/g, '')}`} className="text-zinc-400 text-sm hover:text-berry-400 transition-colors">
                    {SITE.phone}
                  </a>
                </li>
                <li className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-berry-500/10 flex items-center justify-center mr-3 flex-shrink-0">
                    <Mail size={14} className="text-berry-400" />
                  </div>
                  <a href={`mailto:${SITE.email}`} className="text-zinc-400 text-sm hover:text-berry-400 transition-colors break-all">
                    {SITE.email}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-zinc-500 text-sm">
              © {new Date().getFullYear()} {SITE.name}. {SITE.tagline}.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/privacy" className="text-zinc-500 hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="text-zinc-500 hover:text-white transition-colors">Terms</Link>
              <Link href="/refund" className="text-zinc-500 hover:text-white transition-colors">Refunds</Link>
            </div>
            <SocialLinks className="md:hidden" />
          </div>
        </div>
      </div>
    </footer>
  );
}
