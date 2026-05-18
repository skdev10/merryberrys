'use client';

import { useEffect, useRef } from 'react';

/**
 * Scroll-reveal wrapper — adds `.active` when the element enters the viewport.
 * Use instead of bare `className="reveal"` (which stays invisible without this).
 */
export default function Reveal({ children, className = '', style, as: Tag = 'div', ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('active');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const classes = ['reveal', className].filter(Boolean).join(' ');

  return (
    <Tag ref={ref} className={classes} style={style} {...rest}>
      {children}
    </Tag>
  );
}
