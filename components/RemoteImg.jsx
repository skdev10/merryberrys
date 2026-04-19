'use client';

import { useEffect, useState } from 'react';
import { PLACEHOLDER_IMAGE } from '@/lib/productImages';

/**
 * Plain <img> for remote URLs — avoids Next/Image layout/remote issues.
 * Falls back to placeholder if the URL fails to load.
 */
export default function RemoteImg({ src, alt, className, style, priority, sizes: _sizes }) {
  const [url, setUrl] = useState(src || PLACEHOLDER_IMAGE);

  useEffect(() => {
    setUrl(src || PLACEHOLDER_IMAGE);
  }, [src]);

  return (
    <img
      src={url}
      alt={alt || ''}
      className={className}
      style={style}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      referrerPolicy="no-referrer-when-downgrade"
      onError={() => setUrl(PLACEHOLDER_IMAGE)}
    />
  );
}
