import toast from 'react-hot-toast';

export function notifyAddedToCart(productName) {
  toast.success(productName ? `Added: ${productName}` : 'Added to cart');
}
