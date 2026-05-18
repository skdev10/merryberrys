'use client'
import { usePathname } from "next/navigation"
import { 
    LayoutDashboard, 
    Package, 
    ShoppingCart, 
    Users, 
    Image as ImageIcon,
    Settings,
    Store,
    Ticket,
    ShieldCheck,
    BarChart3,
    ChevronRight,
    Layers
} from "lucide-react"
import Link from "next/link"

const AdminSidebar = () => {
    const pathname = usePathname()

    const menuItems = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Products', href: '/admin/products', icon: Package },
        { name: 'Categories', href: '/admin/categories', icon: Layers },
        { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
        { name: 'Customers', href: '/admin/customers', icon: Users },
        { name: 'Banners', href: '/admin/banners', icon: ImageIcon },
        { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
        { name: 'Stores', href: '/admin/stores', icon: Store },
        { name: 'Approve Store', href: '/admin/approve', icon: ShieldCheck },
        { name: 'Coupons', href: '/admin/coupons', icon: Ticket },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
    ]

    return (
        <aside className="fixed left-0 top-16 bottom-0 w-64 bg-zinc-950 border-r border-white/5 overflow-y-auto">
            <div className="p-4">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-2 mb-6">
                    <div className="bg-zinc-900/50 rounded-xl p-3 border border-white/5">
                        <p className="text-xs text-zinc-500 mb-1">Products</p>
                        <p className="text-lg font-bold text-white">370</p>
                    </div>
                    <div className="bg-zinc-900/50 rounded-xl p-3 border border-white/5">
                        <p className="text-xs text-zinc-500 mb-1">Orders</p>
                        <p className="text-lg font-bold text-berry-400">24</p>
                    </div>
                </div>

                {/* Menu */}
                <nav className="space-y-1">
                    <p className="text-xs text-zinc-600 uppercase tracking-wider mb-3 px-3">Main Menu</p>
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                                    isActive 
                                        ? 'bg-gradient-to-r from-berry-500/20 to-transparent text-white border-l-2 border-berry-500' 
                                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <item.icon size={18} className={isActive ? 'text-berry-400' : ''} />
                                <span className="flex-1 text-sm font-medium">{item.name}</span>
                                {isActive && <ChevronRight size={14} className="text-berry-400" />}
                            </Link>
                        )
                    })}
                </nav>

                {/* Website Link */}
                <div className="mt-8 pt-6 border-t border-white/5">
                    <Link 
                        href="/" 
                        target="_blank"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                    >
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm">View Website</span>
                    </Link>
                </div>
            </div>
        </aside>
    )
}

export default AdminSidebar
