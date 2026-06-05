import { Facebook, Instagram } from 'lucide-react';
import { SITE } from '@/lib/site';

export default function SocialLinks({ className = '', iconClassName = '' }) {
  return (
    <div className={`flex gap-3 ${className}`}>
      <a
        href={SITE.facebook}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Merry Berry on Facebook"
        className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-zinc-900 text-zinc-400 transition-all hover:border-berry-500 hover:bg-berry-500/10 hover:text-white ${iconClassName}`}
      >
        <Facebook size={18} />
      </a>
      <a
        href={SITE.instagram}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Merry Berry on Instagram"
        className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-zinc-900 text-zinc-400 transition-all hover:border-berry-500 hover:bg-berry-500/10 hover:text-white ${iconClassName}`}
      >
        <Instagram size={18} />
      </a>
    </div>
  );
}
