'use client';

import { useEffect, useState } from 'react';
import { Search, Plus, Edit2, Trash2, Package, Images, Pencil } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { formatPrice } from '@/lib/currency';
import { adminFetch } from '@/lib/adminClient';
import { parseProductImages } from '@/lib/productImages';
import ProductQuickEditModal from '@/components/admin/ProductQuickEditModal';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [quickEditProduct, setQuickEditProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetch('/api/categories')
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []));
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await adminFetch('/api/admin/products');
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message || 'Products load nahi hue');
        return;
      }
      setProducts(data.products || []);
    } catch {
      toast.error('Products load failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (product) => {
    if (!confirm(`Delete "${product.name}"? Ye permanent hai.`)) return;

    try {
      const response = await adminFetch(`/api/admin/products/${product.id}`, { method: 'DELETE' });
      const data = await response.json();
      if (response.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== product.id));
        toast.success('Product delete ho gaya');
      } else {
        toast.error(data.message || 'Delete failed');
      }
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleQuickSaved = (updated) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p)));
    toast.success(`"${updated.name}" update ho gaya`);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || product.categoryId === selectedCategory || product.category?.id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-white mb-1">Products</h1>
          <p className="text-zinc-500">
            Name, price, stock change karein — product name par click karein ya pencil icon dabayein
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/product-images"
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 text-zinc-300 hover:text-white text-sm"
          >
            <Images size={18} /> Product Images
          </Link>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-berry-600 to-berry-500 hover:from-berry-500 hover:to-berry-400 text-white rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(218,44,119,0.3)]"
          >
            <Plus size={20} />
            Add Product
          </Link>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-4 border border-white/5">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
            <input
              type="text"
              placeholder="Product name search karein..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-zinc-600 focus:outline-none focus:border-berry-500/50"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-zinc-900/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-berry-500/50 min-w-[180px]"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 border-2 border-berry-500/30 border-t-berry-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-zinc-500">Loading products...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-zinc-500 text-sm border-b border-white/5 bg-zinc-900/30">
                  <th className="p-4 font-medium">Product</th>
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium">Price</th>
                  <th className="p-4 font-medium">Stock</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-12 text-center">
                      <Package size={48} className="text-zinc-600 mx-auto mb-4" />
                      <p className="text-zinc-500">No products found</p>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => {
                    const images = parseProductImages(product.images);
                    return (
                      <tr key={product.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-zinc-800 rounded-lg overflow-hidden shrink-0">
                              {images[0] ? (
                                <img src={images[0]} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-600">
                                  <Package size={20} />
                                </div>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => setQuickEditProduct(product)}
                              className="text-left group"
                            >
                              <p className="text-white font-medium group-hover:text-berry-300 transition-colors">
                                {product.name}
                              </p>
                              <p className="text-zinc-500 text-sm">{product.slug}</p>
                            </button>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-3 py-1 bg-zinc-900/50 rounded-full text-zinc-400 text-sm">
                            {product.category?.name || 'Uncategorized'}
                          </span>
                        </td>
                        <td className="p-4">
                          <p className="text-white font-medium">{formatPrice(product.price)}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-zinc-400">
                            {product.inStock ? `${product.stockQuantity ?? 0} units` : 'Out of Stock'}
                          </p>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${
                              product.inStock
                                ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                : 'bg-red-500/20 text-red-400 border-red-500/30'
                            }`}
                          >
                            {product.inStock ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => setQuickEditProduct(product)}
                              className="p-2 text-zinc-400 hover:text-berry-400 hover:bg-berry-500/10 rounded-lg transition-all"
                              title="Quick edit name, price, stock"
                            >
                              <Pencil size={18} />
                            </button>
                            <Link
                              href={`/admin/products/edit/${product.id}`}
                              className="p-2 text-zinc-400 hover:text-berry-400 hover:bg-berry-500/10 rounded-lg transition-all"
                              title="Full edit"
                            >
                              <Edit2 size={18} />
                            </Link>
                            <Link
                              href={`/admin/product-images?product=${product.id}`}
                              className="p-2 text-zinc-400 hover:text-berry-400 hover:bg-berry-500/10 rounded-lg transition-all"
                              title="Edit photos"
                            >
                              <Images size={18} />
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDelete(product)}
                              className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ProductQuickEditModal
        product={quickEditProduct}
        categories={categories}
        onClose={() => setQuickEditProduct(null)}
        onSaved={handleQuickSaved}
      />
    </div>
  );
}
