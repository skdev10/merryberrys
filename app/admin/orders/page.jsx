'use client'
import { useEffect, useState } from "react"
import { 
    Search, 
    Filter,
    Package,
    Eye,
    Truck,
    CheckCircle,
    Clock,
    XCircle,
    Download
} from "lucide-react"
import Link from "next/link"
import { formatPKR } from "@/lib/currency"

export default function OrdersPage() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/admin/orders')
            const data = await response.json()
            setOrders(data.orders || [])
        } catch (error) {
            console.error('Error fetching orders:', error)
        } finally {
            setLoading(false)
        }
    }

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await fetch(`/api/admin/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            })
            
            if (response.ok) {
                setOrders(orders.map(order => 
                    order.id === orderId ? { ...order, status: newStatus } : order
                ))
            }
        } catch (error) {
            console.error('Error updating order:', error)
        }
    }

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const getStatusIcon = (status) => {
        switch(status) {
            case 'COMPLETED': return <CheckCircle size={18} className="text-green-400" />
            case 'PROCESSING': return <Clock size={18} className="text-blue-400" />
            case 'SHIPPED': return <Truck size={18} className="text-purple-400" />
            case 'PENDING': return <Clock size={18} className="text-yellow-400" />
            case 'CANCELLED': return <XCircle size={18} className="text-red-400" />
            default: return <Package size={18} className="text-zinc-400" />
        }
    }

    const getStatusColor = (status) => {
        switch(status) {
            case 'COMPLETED': return 'bg-green-500/20 text-green-400 border-green-500/30'
            case 'PROCESSING': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
            case 'SHIPPED': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
            case 'PENDING': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
            case 'CANCELLED': return 'bg-red-500/20 text-red-400 border-red-500/30'
            default: return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30'
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-white mb-1">Orders</h1>
                    <p className="text-zinc-500">Manage and track customer orders</p>
                </div>
                <button className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900/50 border border-white/10 hover:border-berry-500/50 text-white rounded-xl font-medium transition-all">
                    <Download size={20} />
                    Export Orders
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: 'Total Orders', value: orders.length, color: 'berry' },
                    { label: 'Pending', value: orders.filter(o => o.status === 'PENDING').length, color: 'yellow' },
                    { label: 'Processing', value: orders.filter(o => o.status === 'PROCESSING').length, color: 'blue' },
                    { label: 'Completed', value: orders.filter(o => o.status === 'COMPLETED').length, color: 'green' },
                ].map((stat, index) => (
                    <div key={index} className="glass-card rounded-xl p-4 border border-white/5">
                        <p className="text-zinc-500 text-sm mb-1">{stat.label}</p>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="glass-card rounded-2xl p-4 border border-white/5">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                        <input
                            type="text"
                            placeholder="Search by order ID or customer..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-zinc-600 focus:outline-none focus:border-berry-500/50 transition-all"
                        />
                    </div>
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-zinc-900/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-berry-500/50"
                    >
                        <option value="all">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Orders Table */}
            <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="w-12 h-12 border-2 border-berry-500/30 border-t-berry-500 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-zinc-500">Loading orders...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-zinc-500 text-sm border-b border-white/5 bg-zinc-900/30">
                                    <th className="p-4 font-medium">Order ID</th>
                                    <th className="p-4 font-medium">Customer</th>
                                    <th className="p-4 font-medium">Date</th>
                                    <th className="p-4 font-medium">Total</th>
                                    <th className="p-4 font-medium">Status</th>
                                    <th className="p-4 font-medium">Payment</th>
                                    <th className="p-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="p-12 text-center">
                                            <Package size={48} className="text-zinc-600 mx-auto mb-4" />
                                            <p className="text-zinc-500">No orders found</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map((order) => (
                                        <tr key={order.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                            <td className="p-4">
                                                <span className="text-white font-medium">#{order.id?.slice(-6).toUpperCase()}</span>
                                            </td>
                                            <td className="p-4">
                                                <div>
                                                    <p className="text-white">{order.user?.name || 'Guest'}</p>
                                                    <p className="text-zinc-500 text-sm">{order.user?.email}</p>
                                                </div>
                                            </td>
                                            <td className="p-4 text-zinc-400">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="p-4">
                                                <p className="text-white font-medium">{formatPKR(order.total)}</p>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    {getStatusIcon(order.status)}
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                        className={`px-3 py-1 rounded-full text-xs font-medium border bg-transparent cursor-pointer ${getStatusColor(order.status)}`}
                                                    >
                                                        <option value="PENDING" className="bg-zinc-900">Pending</option>
                                                        <option value="PROCESSING" className="bg-zinc-900">Processing</option>
                                                        <option value="SHIPPED" className="bg-zinc-900">Shipped</option>
                                                        <option value="COMPLETED" className="bg-zinc-900">Completed</option>
                                                        <option value="CANCELLED" className="bg-zinc-900">Cancelled</option>
                                                    </select>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                                                    order.isPaid 
                                                        ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                                                        : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                                                }`}>
                                                    {order.isPaid ? 'Paid' : 'Pending'}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link 
                                                        href={`/admin/orders/${order.id}`}
                                                        className="p-2 text-zinc-400 hover:text-berry-400 hover:bg-berry-500/10 rounded-lg transition-all"
                                                    >
                                                        <Eye size={18} />
                                                    </Link>
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
