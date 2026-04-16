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
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        // Check if user is on login page
        if (pathname === '/admin/login') {
            setLoading(false)
            return
        }

        // Check authentication
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

    // Don't render layout for login page
    if (pathname === '/admin/login') {
        return children
    }

    return loading ? (
        <Loading />
    ) : isAdmin ? (
        <div className="min-h-screen bg-zinc-950">
            <AdminNavbar adminUser={adminUser} />
            <div className="flex">
                <AdminSidebar />
                <main className="flex-1 ml-64 p-8">
                    {children}
                </main>
            </div>
        </div>
    ) : null
}

export default AdminLayout
