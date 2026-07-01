'use client'
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Loading from "../Loading"
import AdminNavbar from "./AdminNavbar"
import AdminSidebar from "./AdminSidebar"
import { adminFetch, clearAdminSession } from "@/lib/adminClient"

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

        const checkAuth = async () => {
            const token = localStorage.getItem('adminToken')

            if (!token) {
                router.push('/admin/login')
                return
            }

            try {
                const res = await adminFetch('/api/admin/session', { cache: 'no-store' })

                if (!res.ok) {
                    clearAdminSession()
                    router.push('/admin/login?expired=1')
                    return
                }

                const data = await res.json()
                setAdminUser(data.user)
                localStorage.setItem('adminUser', JSON.stringify(data.user))
                setIsAdmin(true)
            } catch {
                clearAdminSession()
                router.push('/admin/login?expired=1')
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
