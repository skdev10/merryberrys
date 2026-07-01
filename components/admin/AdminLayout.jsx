'use client'
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Loading from "../Loading"
import AdminNavbar from "./AdminNavbar"
import AdminSidebar from "./AdminSidebar"

const AdminLayout = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(true)
    const [adminUser, setAdminUser] = useState(null)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (pathname === '/admin/login') {
            setLoading(false)
            return
        }

        const checkAuth = () => {
            const token = localStorage.getItem('adminToken')
            const user = localStorage.getItem('adminUser')
            
            if (!token || !user) {
                router.push('/admin/login')
                return
            }

            try {
                const parsedUser = JSON.parse(user)
                if (parsedUser.role !== 'admin') {
                    router.push('/admin/login')
                    return
                }
                setAdminUser(parsedUser)
                setIsAdmin(true)
            } catch (error) {
                router.push('/admin/login')
            } finally {
                setLoading(false)
            }
        }

        checkAuth()
    }, [router, pathname])

    useEffect(() => {
        setSidebarOpen(false)
    }, [pathname])

    if (pathname === '/admin/login') {
        return children
    }

    return loading ? (
        <Loading />
    ) : isAdmin ? (
        <div className="min-h-screen bg-zinc-950">
            <AdminNavbar
                adminUser={adminUser}
                sidebarOpen={sidebarOpen}
                onMenuToggle={() => setSidebarOpen((open) => !open)}
            />
            <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <main className="w-full min-w-0 pt-16 lg:ml-64 px-3 sm:px-5 lg:px-8 pb-8">
                {children}
            </main>
        </div>
    ) : null
}

export default AdminLayout
