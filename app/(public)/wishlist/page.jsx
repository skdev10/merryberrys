'use client';
import { useState } from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import Link from 'next/link';
import { X, ShoppingCart } from 'lucide-react';

export default function WishlistPage() {
  const [items, setItems] = useState([
    {
      id: 3,
      name: 'Merry Berry Signature Tracksuit',
      price: 199.99,
      image: 'https://wpecomus.com/fashion/wp-content/uploads/2023/10/fashion-product-3.jpg',
      inStock: true
    },
    {
      id: 4,
      name: 'Vintage Wash Denim Jacket',
      price: 149.99,
      image: 'https://wpecomus.com/fashion/wp-content/uploads/2023/10/fashion-product-4.jpg',
      inStock: true
    }
  ]);

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-zinc-950 text-white pt-10 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <h1 className="font-serif text-4xl mb-12 border-b border-white/10 pb-6">My Wishlist</h1>

          {items.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-zinc-500 text-lg mb-6">Your wishlist is currently empty.</p>
              <Link href="/shop" className="inline-block bg-berry-600 px-8 py-3 rounded text-white font-medium hover:bg-berry-500">
                Explore Collection
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {items.map(item => (
                <div key={item.id} className="bg-zinc-900 rounded-xl overflow-hidden group relative border border-zinc-800">
                  <button onClick={() => removeItem(item.id)} className="absolute top-4 right-4 z-10 w-8 h-8 bg-zinc-950/80 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors">
                    <X size={16} />
                  </button>
                  <Link href={`/product/${item.id}`} className="block h-80 overflow-hidden">
                    <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.name} />
                  </Link>
                  <div className="p-5">
                    <Link href={`/product/${item.id}`} className="block font-medium text-lg mb-2 hover:text-berry-400 truncate">{item.name}</Link>
                    <p className="text-gold-400 font-serif mb-4">${item.price}</p>
                    <button className="w-full bg-transparent border border-berry-500 hover:bg-berry-600 hover:text-white text-berry-500 py-2 rounded flex items-center justify-center transition-colors">
                      <ShoppingCart size={16} className="mr-2" /> Quick Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}
