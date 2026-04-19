'use client'
import { useEffect, useState } from "react"
import { 
    Search, 
    Plus, 
    Edit2, 
    Trash2, 
    Filter,
    MoreVertical,
    Package,
    ArrowUpDown
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function ProductsPage() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/admin/products')
            const data = await response.json()
            setProducts(data.products || [])
        } catch (error) {
            console.error('Error fetching products:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return
        
        try {
            const response = await fetch(`/api/admin/products/${id}`, {
                method: 'DELETE'
            })
            if (response.ok) {
                setProducts(products.filter(p => p.id !== id))
            }
        } catch (error) {
            console.error('Error deleting product:', error)
        }
    }

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory === 'all' || product.category?.name === selectedCategory
        return matchesSearch && matchesCategory
    })

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-white mb-1">Products</h1>
                    <p className="text-zinc-500">Manage your store products</p>
                </div>
                <Link 
                    href="/admin/products/new"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-berry-600 to-berry-500 hover:from-berry-500 hover:to-berry-400 text-white rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(218,44,119,0.3)]"
                >
                    <Plus size={20} />
                    Add Product
                </Link>
            </div>

            {/* Filters */}
            <div className="glass-card rounded-2xl p-4 border border-white/5">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-zinc-600 focus:outline-none focus:border-berry-500/50 transition-all"
                        />
                    </div>
                    <div className="flex gap-3">
                        <select 
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="bg-zinc-900/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-berry-500/50"
                        >
                            <option value="all">All Categories</option>
                            <option value="men">Men</option>
                            <option value="women">Women</option>
                            <option value="kids">Kids</option>
                            <option value="winter">Winter</option>
                        </select>
                        <button className="p-3 bg-zinc-900/50 border border-white/10 rounded-xl text-zinc-400 hover:text-white transition-colors">
                            <Filter size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="w-12 h-12 border-2 border-berry-500/30 border-t-berry-500 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-zinc-500">Loading products...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-zinc-500 text-sm border-b border-white/5 bg-zinc-900/30">
                                    <th className="p-4 font-medium">
                                        <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-zinc-900 text-berry-500" />
                                    </th>
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
                                        <td colSpan="7" className="p-12 text-center">
                                            <Package size={48} className="text-zinc-600 mx-auto mb-4" />
                                            <p className="text-zinc-500">No products found</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProducts.map((product) => (
                                        <tr key={product.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                            <td className="p-4">
                                                <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-zinc-900 text-berry-500" />
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-zinc-800 rounded-lg overflow-hidden">
                                                        {product.images && product.images[0] ? (
                                                            <img 
                                                                src={product.images[0]} 
                                                                alt={product.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-zinc-600">
                                                                <Package size={20} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-medium">{product.name}</p>
                                                        <p className="text-zinc-500 text-sm">{product.slug}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="px-3 py-1 bg-zinc-900/50 rounded-full text-zinc-400 text-sm">
                                                    {product.category?.name || 'Uncategorized'}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <p className="text-white font-medium">${product.price}</p>
                                            </td>
                                            <td className="p-4">
                                                <p className="text-zinc-400">{product.inStock ? 'In Stock' : 'Out of Stock'}</p>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                                                    product.inStock 
                                                        ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                                                        : 'bg-red-500/20 text-red-400 border-red-500/30'
                                                }`}>
                                                    {product.inStock ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link 
                                                        href={`/admin/products/edit/${product.id}`}
                                                        className="p-2 text-zinc-400 hover:text-berry-400 hover:bg-berry-500/10 rounded-lg transition-all"
                                                    >
                                                        <Edit2 size={18} />
                                                    </Link>
                                                    <button 
                                                        onClick={() => handleDelete(product.id)}
                                                        className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
