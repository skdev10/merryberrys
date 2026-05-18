import { primaryProductImage } from '@/lib/productImages';

export const CART_STORAGE_KEY = 'cart';
export const FREE_SHIPPING_THRESHOLD = 5000;
export const STANDARD_SHIPPING_FEE = 250;

export function readCart() {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    const cart = raw ? JSON.parse(raw) : [];
    return Array.isArray(cart) ? cart : [];
  } catch {
    return [];
  }
}

export function writeCart(cart) {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event('cart-updated'));
}

export function addCartItem(product, options = {}) {
  const quantity = Math.max(1, Number(options.quantity) || 1);
  const size = options.size || '';
  const color = options.color || '';
  const cart = readCart();
  const index = cart.findIndex(
    (item) => item.id === product.id && (item.size || '') === size && (item.color || '') === color
  );

  if (index >= 0) {
    cart[index] = {
      ...cart[index],
      quantity: Math.max(1, Number(cart[index].quantity) || 1) + quantity,
    };
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: Number(product.price) || 0,
      image: product.image || primaryProductImage(product.images),
      category: product.category?.name || product.category || '',
      size,
      color,
      quantity,
    });
  }

  writeCart(cart);
  return cart;
}

export function updateCartItemQuantity(cart, index, quantity) {
  const nextQuantity = Math.max(1, Number(quantity) || 1);
  return cart.map((item, itemIndex) =>
    itemIndex === index ? { ...item, quantity: nextQuantity } : item
  );
}

export function removeCartItem(cart, index) {
  return cart.filter((_, itemIndex) => itemIndex !== index);
}

export function summarizeCart(cart) {
  const subtotal = cart.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );
  const shipping = subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD ? STANDARD_SHIPPING_FEE : 0;

  return {
    subtotal,
    shipping,
    total: subtotal + shipping,
    itemCount: cart.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0),
  };
}

