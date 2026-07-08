'use client'
import { usePathname } from "next/navigation"
import { 
    LayoutDashboard, 
    Package, 
    ShoppingCart, 
    Users, 
    Image as ImageIcon,
    Images,
    Settings,
    Store,
    Ticket,
    ShieldCheck,
    BarChart3,
    ChevronRight,
    Layers
} from "lucide-react"
import Link from "next/link"

const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Product Images', href: '/admin/product-images', icon: Images },
    { name: 'Categories', href: '/admin/categories', icon: Layers },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Media Center', href: '/admin/media', icon: ImageIcon },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Stores', href: '/admin/stores', icon: Store },
    { name: 'Approve Store', href: '/admin/approve', icon: ShieldCheck },
    { name: 'Coupons', href: '/admin/coupons', icon: Ticket },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
]

const AdminSidebar = ({ open, onClose }) => {
    const pathname = usePathname()

    return (
        <>
            {open && (
                <button
                    type="button"
                    aria-label="Close menu"
                    className="fixed inset-0 z-40 bg-black/60 lg:hidden"
                    onClick={onClose}
                />
            )}
            <aside
                className={`fixed left-0 top-16 bottom-0 z-50 w-[min(100vw-3rem,17rem)] sm:w-64 bg-zinc-950 border-r border-white/5 overflow-y-auto transition-transform duration-300 ease-out lg:translate-x-0 ${
                    open ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="p-3 sm:p-4">
                    <div className="grid grid-cols-2 gap-2 mb-4 sm:mb-6">
                        <div className="bg-zinc-900/50 rounded-xl p-3 border border-white/5">
                            <p className="text-xs text-zinc-500 mb-1">Products</p>
                            <p className="text-lg font-bold text-white">—</p>
                        </div>
                        <div className="bg-zinc-900/50 rounded-xl p-3 border border-white/5">
                            <p className="text-xs text-zinc-500 mb-1">Orders</p>
                            <p className="text-lg font-bold text-berry-400">—</p>
                        </div>
                    </div>

                    <nav className="space-y-1">
                        <p className="text-xs text-zinc-600 uppercase tracking-wider mb-3 px-3">Main Menu</p>
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={onClose}
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

                    <div className="mt-6 sm:mt-8 pt-6 border-t border-white/5">
                        <Link 
                            href="/" 
                            target="_blank"
                            onClick={onClose}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                        >
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm">View Website</span>
                        </Link>
                    </div>
                </div>
            </aside>
        </>
    )
}

export default AdminSidebar
