'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, Users } from 'lucide-react';
import { formatPrice } from '@/lib/currency';

export default function AdminCustomersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/admin/users', { cache: 'no-store' });
        const data = await res.json();
        setUsers(data.users || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.toLowerCase();
    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.role?.toLowerCase().includes(query)
    );
  }, [search, users]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-serif text-white">Customers & Users</h1>
          <p className="text-zinc-500 text-sm">View registered customers, admins, order counts, and lifetime value.</p>
        </div>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search users..."
            className="w-full rounded-xl border border-white/10 bg-zinc-900/50 py-3 pl-11 pr-4 text-white outline-none focus:border-berry-500/50"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass-card rounded-xl border border-white/5 p-4">
          <p className="text-sm text-zinc-500">Total Users</p>
          <p className="mt-1 text-2xl font-semibold text-white">{users.length}</p>
        </div>
        <div className="glass-card rounded-xl border border-white/5 p-4">
          <p className="text-sm text-zinc-500">Customers</p>
          <p className="mt-1 text-2xl font-semibold text-white">{users.filter((user) => user.role !== 'admin').length}</p>
        </div>
        <div className="glass-card rounded-xl border border-white/5 p-4">
          <p className="text-sm text-zinc-500">Admins</p>
          <p className="mt-1 text-2xl font-semibold text-white">{users.filter((user) => user.role === 'admin').length}</p>
        </div>
      </div>

      <div className="glass-card overflow-hidden rounded-2xl border border-white/5">
        {loading ? (
          <div className="p-12 text-center text-zinc-500">Loading customers...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">
            <Users size={42} className="mx-auto mb-4 text-zinc-700" />
            No users found.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/5 bg-zinc-900/40 text-zinc-500">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Orders</th>
                <th className="p-4">Lifetime Value</th>
                <th className="p-4">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-white/5 last:border-0">
                  <td className="p-4 text-white">{user.name}</td>
                  <td className="p-4 text-zinc-400">{user.email}</td>
                  <td className="p-4">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-zinc-400">{user._count?.orders || 0}</td>
                  <td className="p-4 text-zinc-300">{formatPrice(user.lifetimeValue)}</td>
                  <td className="p-4 text-zinc-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
