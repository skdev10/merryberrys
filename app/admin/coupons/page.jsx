'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { Plus, Save, Trash2, X } from 'lucide-react';
import { adminFetch } from '@/lib/adminClient';

const emptyForm = {
  code: '',
  description: '',
  discount: '',
  forNewUser: false,
  forMember: false,
  isPublic: true,
  expiresAt: format(new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), 'yyyy-MM-dd'),
};

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm text-zinc-300">
      <span className="relative inline-flex h-6 w-11 items-center">
        <input type="checkbox" className="peer sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className="h-6 w-11 rounded-full bg-zinc-700 transition peer-checked:bg-berry-600" />
        <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5" />
      </span>
      {label}
    </label>
  );
}

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingCode, setEditingCode] = useState(null);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await adminFetch('/api/admin/coupons', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || 'Failed to load coupons');
        setCoupons([]);
        return;
      }
      setCoupons(data.coupons || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const resetForm = () => {
    setEditingCode(null);
    setForm(emptyForm);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setMessage('');

    const payload = {
      code: form.code,
      description: form.description,
      discount: Number(form.discount),
      forNewUser: form.forNewUser,
      forMember: form.forMember,
      isPublic: form.isPublic,
      expiresAt: new Date(form.expiresAt).toISOString(),
    };

    const url = editingCode ? `/api/admin/coupons/${encodeURIComponent(editingCode)}` : '/api/admin/coupons';
    const res = await adminFetch(url, {
      method: editingCode ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok) {
      setMessage(data.message || 'Failed to save coupon');
      return;
    }

    toast.success(editingCode ? 'Coupon updated' : 'Coupon added');
    resetForm();
    fetchCoupons();
  };

  const editCoupon = (coupon) => {
    setEditingCode(coupon.code);
    setForm({
      code: coupon.code,
      description: coupon.description,
      discount: String(coupon.discount),
      forNewUser: coupon.forNewUser,
      forMember: coupon.forMember,
      isPublic: coupon.isPublic,
      expiresAt: format(new Date(coupon.expiresAt), 'yyyy-MM-dd'),
    });
  };

  const deleteCoupon = async (code) => {
    if (!window.confirm(`Delete coupon ${code}?`)) return;

    const res = await adminFetch(`/api/admin/coupons/${encodeURIComponent(code)}`, { method: 'DELETE' });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Failed to delete coupon');
    }

    if (editingCode === code) resetForm();
    fetchCoupons();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-white">Coupons</h1>
        <p className="text-sm text-zinc-500">Create, edit, and remove discount codes for checkout.</p>
      </div>

      <form onSubmit={submit} className="glass-card space-y-4 rounded-2xl border border-white/5 p-5">
        <h2 className="text-lg text-white">{editingCode ? 'Edit Coupon' : 'Add Coupon'}</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            required
            disabled={Boolean(editingCode)}
            type="text"
            name="code"
            placeholder="Coupon code"
            value={form.code}
            onChange={handleChange}
            className="rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white uppercase disabled:opacity-60"
          />
          <input
            required
            type="number"
            min={1}
            max={100}
            name="discount"
            placeholder="Discount (%)"
            value={form.discount}
            onChange={handleChange}
            className="rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white"
          />
        </div>

        <input
          required
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white"
        />

        <label className="block text-sm text-zinc-400">
          Expiry date
          <input
            required
            type="date"
            name="expiresAt"
            value={form.expiresAt}
            onChange={handleChange}
            className="mt-1 w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white"
          />
        </label>

        <div className="flex flex-wrap gap-6">
          <Toggle label="For new user" checked={form.forNewUser} onChange={(value) => setForm((prev) => ({ ...prev, forNewUser: value }))} />
          <Toggle label="For member" checked={form.forMember} onChange={(value) => setForm((prev) => ({ ...prev, forMember: value }))} />
          <Toggle label="Public" checked={form.isPublic} onChange={(value) => setForm((prev) => ({ ...prev, isPublic: value }))} />
        </div>

        <div className="flex gap-2">
          <button type="submit" className="flex items-center gap-2 rounded-xl bg-berry-600 px-5 py-3 text-white">
            {editingCode ? <Save size={16} /> : <Plus size={16} />}
            {editingCode ? 'Update Coupon' : 'Add Coupon'}
          </button>
          {editingCode && (
            <button type="button" onClick={resetForm} className="rounded-xl border border-white/10 px-4 text-zinc-300">
              <X size={16} />
            </button>
          )}
        </div>
      </form>

      {message && <p className="text-sm text-red-300">{message}</p>}

      <div className="glass-card overflow-hidden rounded-2xl border border-white/5">
        <div className="border-b border-white/5 px-5 py-4">
          <h2 className="text-lg text-white">All Coupons</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-zinc-500">Loading coupons...</div>
        ) : coupons.length === 0 ? (
          <div className="p-8 text-center text-zinc-500">No coupons yet. Add your first coupon above.</div>
        ) : (
          <div className="admin-table-scroll">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-white/5 bg-zinc-900/40 text-zinc-500">
                <tr>
                  <th className="p-4">Code</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Discount</th>
                  <th className="p-4">Expires</th>
                  <th className="p-4">New User</th>
                  <th className="p-4">Member</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon.code} className="border-b border-white/5 last:border-0">
                    <td className="p-4 font-medium text-white">{coupon.code}</td>
                    <td className="p-4 text-zinc-400">{coupon.description}</td>
                    <td className="p-4 text-zinc-300">{coupon.discount}%</td>
                    <td className="p-4 text-zinc-400">{format(new Date(coupon.expiresAt), 'yyyy-MM-dd')}</td>
                    <td className="p-4 text-zinc-400">{coupon.forNewUser ? 'Yes' : 'No'}</td>
                    <td className="p-4 text-zinc-400">{coupon.forMember ? 'Yes' : 'No'}</td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => editCoupon(coupon)}
                          className="rounded-lg bg-white/5 px-3 py-2 text-zinc-300"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            toast.promise(deleteCoupon(coupon.code), {
                              loading: 'Deleting coupon...',
                              success: 'Deleted',
                              error: (err) => err.message || 'Delete failed',
                            })
                          }
                          className="rounded-lg bg-red-500/10 px-3 py-2 text-red-300"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
