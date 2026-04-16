'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Loading from '../Loading';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/admin/login') {
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        const data = await res.json();
        if (cancelled) return;
        if (!data.user || data.user.role !== 'admin') {
          router.push('/admin/login');
          setLoading(false);
          return;
        }
        setAdminUser(data.user);
        setIsAdmin(true);
      } catch {
        if (!cancelled) router.push('/admin/login');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router, pathname]);

  if (pathname === '/admin/login') {
    return children;
  }

  return loading ? (
    <Loading />
  ) : isAdmin ? (
    <div className="min-h-screen bg-zinc-950">
      <AdminNavbar adminUser={adminUser} />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 ml-64 p-8">{children}</main>
      </div>
    </div>
  ) : null;
};

export default AdminLayout;
