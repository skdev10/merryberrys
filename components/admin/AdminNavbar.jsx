'use client'
import { useRouter } from "next/navigation"
import { Bell, LogOut, Search, User, Menu, X } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

const AdminNavbar = ({ adminUser }) => {
    const router = useRouter()
    const [showMobileMenu, setShowMobileMenu] = useState(false)

    const handleLogout = () => {
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminUser')
        router.push('/admin/login')
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/90 backdrop-blur-xl border-b border-white/5 h-16">
            <div className="flex items-center justify-between h-full px-6">
                {/* Left - Logo */}
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                        className="lg:hidden text-zinc-400 hover:text-white"
                    >
                        {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
                    </button>
                    <Link href="/admin" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-berry-500 to-gold-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">M</span>
                        </div>
                        <span className="font-serif text-xl font-bold text-white hidden sm:block">
                            MERRY <span className="text-berry-500">BERRY</span>
                        </span>
                        <span className="text-xs text-gold-400 uppercase tracking-wider hidden sm:block ml-2">Admin</span>
                    </Link>
                </div>

                {/* Center - Search */}
                <div className="hidden md:flex flex-1 max-w-md mx-8">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search products, orders..."
                            className="w-full bg-zinc-900/50 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-berry-500/50 transition-all"
                        />
                    </div>
                </div>

                {/* Right - Actions */}
                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    <button className="relative p-2 text-zinc-400 hover:text-white transition-colors">
                        <Bell size={20} />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-berry-500 rounded-full"></span>
                    </button>

                    {/* User Profile */}
                    <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm text-white font-medium">{adminUser?.name || 'Admin'}</p>
                            <p className="text-xs text-zinc-500">{adminUser?.email || 'admin@merryberry.com'}</p>
                        </div>
                        <div className="w-10 h-10 bg-gradient-to-br from-berry-500/20 to-gold-500/20 rounded-full flex items-center justify-center border border-berry-500/30">
                            <User size={20} className="text-berry-400" />
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="p-2 text-zinc-400 hover:text-red-400 transition-colors"
                            title="Logout"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default AdminNavbar
