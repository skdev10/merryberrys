import pools from './productImagePools.json';

export const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80';

export const STOCK_IMAGES = pools;

export function parseProductImages(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.filter(Boolean);
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
}

export function primaryProductImage(raw) {
  const list = parseProductImages(raw);
  return list[0] || PLACEHOLDER_IMAGE;
}
