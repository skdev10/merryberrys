'use client'
import { useEffect, useState } from "react"
import { 
    Package, 
    ShoppingCart, 
    Users, 
    DollarSign, 
    TrendingUp, 
    TrendingDown,
    ArrowUpRight,
    Calendar
} from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        products: 370,
        orders: 24,
        customers: 156,
        revenue: 12580,
        growth: 12.5
    })
    const [recentOrders, setRecentOrders] = useState([
        { id: '#ORD-001', customer: 'John Doe', product: 'Premium T-Shirt', amount: 89.99, status: 'Completed', date: '2026-04-11' },
        { id: '#ORD-002', customer: 'Jane Smith', product: 'Winter Jacket', amount: 199.99, status: 'Processing', date: '2026-04-10' },
        { id: '#ORD-003', customer: 'Mike Johnson', product: 'Cargo Pants', amount: 79.99, status: 'Pending', date: '2026-04-10' },
        { id: '#ORD-004', customer: 'Sarah Williams', product: 'Hoodie', amount: 129.99, status: 'Completed', date: '2026-04-09' },
        { id: '#ORD-005', customer: 'David Brown', product: 'Polo Shirt', amount: 59.99, status: 'Shipped', date: '2026-04-09' },
    ])

    const statCards = [
        { 
            title: 'Total Products', 
            value: stats.products, 
            icon: Package, 
            change: '+12%',
            trend: 'up',
            color: 'berry'
        },
        { 
            title: 'Total Orders', 
            value: stats.orders, 
            icon: ShoppingCart, 
            change: '+8%',
            trend: 'up',
            color: 'gold'
        },
        { 
            title: 'Customers', 
            value: stats.customers, 
            icon: Users, 
            change: '+24%',
            trend: 'up',
            color: 'green'
        },
        { 
            title: 'Revenue', 
            value: `$${stats.revenue.toLocaleString()}`, 
            icon: DollarSign, 
            change: '+15%',
            trend: 'up',
            color: 'purple'
        },
    ]

    const getStatusColor = (status) => {
        switch(status) {
            case 'Completed': return 'bg-green-500/20 text-green-400 border-green-500/30'
            case 'Processing': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
            case 'Pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
            case 'Shipped': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
            default: return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30'
        }
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-white mb-1">Dashboard</h1>
                    <p className="text-zinc-500">Welcome back! Here's what's happening with your store.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-zinc-500 text-sm flex items-center gap-2">
                        <Calendar size={16} />
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, index) => (
                    <div key={index} className="glass-card rounded-2xl p-6 border border-white/5 hover:border-berry-500/30 transition-all group">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl bg-${card.color}-500/10 flex items-center justify-center`}>
                                <card.icon size={24} className={`text-${card.color}-400`} />
                            </div>
                            <div className={`flex items-center gap-1 text-sm ${card.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                                {card.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                {card.change}
                            </div>
                        </div>
                        <h3 className="text-zinc-400 text-sm mb-1">{card.title}</h3>
                        <p className="text-2xl font-bold text-white">{card.value}</p>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders */}
                <div className="lg:col-span-2 glass-card rounded-2xl border border-white/5">
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <h2 className="text-xl font-serif text-white">Recent Orders</h2>
                        <Link href="/admin/orders" className="text-berry-400 hover:text-berry-300 text-sm flex items-center gap-1 transition-colors">
                            View All <ArrowUpRight size={16} />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-zinc-500 text-sm border-b border-white/5">
                                    <th className="p-4 font-medium">Order ID</th>
                                    <th className="p-4 font-medium">Customer</th>
                                    <th className="p-4 font-medium">Product</th>
                                    <th className="p-4 font-medium">Amount</th>
                                    <th className="p-4 font-medium">Status</th>
                                    <th className="p-4 font-medium">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order, index) => (
                                    <tr key={index} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                        <td className="p-4 text-white font-medium">{order.id}</td>
                                        <td className="p-4 text-zinc-400">{order.customer}</td>
                                        <td className="p-4 text-zinc-400">{order.product}</td>
                                        <td className="p-4 text-white font-medium">${order.amount}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-zinc-500 text-sm">{order.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-6">
                    {/* Quick Actions Card */}
                    <div className="glass-card rounded-2xl p-6 border border-white/5">
                        <h2 className="text-xl font-serif text-white mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            <Link href="/admin/products/new" className="flex items-center gap-3 p-3 rounded-xl bg-berry-500/10 border border-berry-500/20 text-berry-400 hover:bg-berry-500/20 transition-all">
                                <Package size={20} />
                                <span className="font-medium">Add New Product</span>
                            </Link>
                            <Link href="/admin/orders" className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/50 border border-white/5 text-zinc-400 hover:text-white hover:bg-white/5 transition-all">
                                <ShoppingCart size={20} />
                                <span>View Orders</span>
                            </Link>
                            <Link href="/admin/banners" className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/50 border border-white/5 text-zinc-400 hover:text-white hover:bg-white/5 transition-all">
                                <Calendar size={20} />
                                <span>Update Banners</span>
                            </Link>
                        </div>
                    </div>

                    {/* Top Products */}
                    <div className="glass-card rounded-2xl p-6 border border-white/5">
                        <h2 className="text-xl font-serif text-white mb-4">Top Products</h2>
                        <div className="space-y-4">
                            {[
                                { name: 'Premium Hoodie', sales: 45, revenue: 5845 },
                                { name: 'Cargo Pants', sales: 38, revenue: 3039 },
                                { name: 'Winter Jacket', sales: 32, revenue: 6396 },
                            ].map((product, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div>
                                        <p className="text-white font-medium">{product.name}</p>
                                        <p className="text-zinc-500 text-sm">{product.sales} sales</p>
                                    </div>
                                    <p className="text-gold-400 font-medium">${product.revenue}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
