'use client'
import { useRouter } from "next/navigation"
import { Bell, LogOut, Search, User, Menu, X } from "lucide-react"
import Link from "next/link"
import { clearAdminSession } from "@/lib/adminClient"

const AdminNavbar = ({ adminUser, sidebarOpen, onMenuToggle }) => {
    const router = useRouter()

    const handleLogout = () => {
        clearAdminSession()
        router.push('/admin/login')
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-[60] bg-zinc-950/95 backdrop-blur-xl border-b border-white/5 h-14 sm:h-16">
            <div className="flex items-center justify-between h-full px-3 sm:px-6">
                <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                    <button 
                        type="button"
                        onClick={onMenuToggle}
                        className="lg:hidden p-2 -ml-1 text-zinc-400 hover:text-white shrink-0"
                        aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
                    >
                        {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                    <Link href="/admin" className="flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 shrink-0 bg-gradient-to-br from-berry-500 to-gold-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">M</span>
                        </div>
                        <span className="font-serif text-sm sm:text-xl font-bold text-white truncate">
                            MERRY <span className="text-berry-500">BERRY</span>
                        </span>
                        <span className="text-[10px] sm:text-xs text-gold-400 uppercase tracking-wider hidden sm:block">Admin</span>
                    </Link>
                </div>

                <div className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search products, orders..."
                            className="w-full bg-zinc-900/50 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-berry-500/50 transition-all"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-3 shrink-0">
                    <button type="button" className="relative p-2 text-zinc-400 hover:text-white transition-colors hidden sm:block">
                        <Bell size={20} />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-berry-500 rounded-full"></span>
                    </button>

                    <div className="flex items-center gap-1 sm:gap-3 sm:pl-3 sm:border-l sm:border-white/10">
                        <div className="text-right hidden md:block">
                            <p className="text-sm text-white font-medium truncate max-w-[120px]">{adminUser?.name || 'Admin'}</p>
                            <p className="text-xs text-zinc-500 truncate max-w-[140px]">{adminUser?.email || 'admin@merryberry.com'}</p>
                        </div>
                        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-berry-500/20 to-gold-500/20 rounded-full flex items-center justify-center border border-berry-500/30">
                            <User size={18} className="text-berry-400" />
                        </div>
                        <button 
                            type="button"
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
