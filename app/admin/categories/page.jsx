'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { adminFetch } from '@/lib/adminClient';
import { Plus, Save, Trash2, X } from 'lucide-react';

const parents = ['Men - Lower', 'Men - Upper', 'Women & Kids', 'Winter Collection'];

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ name: '', slug: '', parent: parents[0] });
  const [editingId, setEditingId] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await adminFetch('/api/admin/categories', { cache: 'no-store' });
      const data = await res.json();
      setCategories(data.categories || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm({ name: '', slug: '', parent: parents[0] });
  };

  const submit = async (event) => {
    event.preventDefault();
    setMessage('');

    const payload = {
      ...form,
      slug: form.slug || slugify(form.name),
    };

    const res = await adminFetch(editingId ? `/api/admin/categories/${editingId}` : '/api/admin/categories', {
      method: editingId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok) {
      const msg = data.message || 'Failed to save category';
      setMessage(msg);
      toast.error(msg);
      return;
    }

    toast.success(editingId ? 'Category update ho gayi' : 'Category create ho gayi');
    setMessage(editingId ? 'Category updated' : 'Category created');
    resetForm();
    fetchCategories();
  };

  const edit = (category) => {
    setEditingId(category.id);
    setForm({
      name: category.name,
      slug: category.slug,
      parent: category.parent || parents[0],
    });
  };

  const remove = async (category) => {
    if (!window.confirm(`Delete ${category.name}?`)) return;
    const res = await adminFetch(`/api/admin/categories/${category.id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) {
      const msg = data.message || 'Failed to delete category';
      setMessage(msg);
      toast.error(msg);
      return;
    }
    toast.success('Category delete ho gayi');
    setMessage('Category deleted');
    fetchCategories();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif text-white">Categories</h1>
        <p className="text-zinc-500 text-sm">Manage men, women, kids, and winter fashion categories.</p>
      </div>

      <form onSubmit={submit} className="glass-card grid gap-4 rounded-2xl border border-white/5 p-5 md:grid-cols-4">
        <input
          required
          className="rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white"
          placeholder="Category name"
          value={form.name}
          onChange={(event) =>
            setForm({ ...form, name: event.target.value, slug: editingId ? form.slug : slugify(event.target.value) })
          }
        />
        <input
          required
          className="rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white"
          placeholder="slug"
          value={form.slug}
          onChange={(event) => setForm({ ...form, slug: slugify(event.target.value) })}
        />
        <select
          className="rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white"
          value={form.parent}
          onChange={(event) => setForm({ ...form, parent: event.target.value })}
        >
          {parents.map((parent) => (
            <option key={parent} value={parent}>
              {parent}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-berry-600 px-4 py-3 text-white">
            {editingId ? <Save size={16} /> : <Plus size={16} />}
            {editingId ? 'Update' : 'Create'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="rounded-xl border border-white/10 px-4 text-zinc-300">
              <X size={16} />
            </button>
          )}
        </div>
      </form>

      {message && <p className="text-sm text-berry-300">{message}</p>}

      <div className="glass-card overflow-hidden rounded-2xl border border-white/5">
        {loading ? (
          <div className="p-8 text-center text-zinc-500">Loading categories...</div>
        ) : (
          <div className="admin-table-scroll">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/5 bg-zinc-900/40 text-zinc-500">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Parent</th>
                <th className="p-4">Slug</th>
                <th className="p-4">Products</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b border-white/5 last:border-0">
                  <td className="p-4 text-white">{category.name}</td>
                  <td className="p-4 text-zinc-400">{category.parent || 'Unassigned'}</td>
                  <td className="p-4 font-mono text-zinc-500">{category.slug}</td>
                  <td className="p-4 text-zinc-400">{category._count?.products || 0}</td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => edit(category)} className="rounded-lg bg-white/5 px-3 py-2 text-zinc-300">
                        Edit
                      </button>
                      <button onClick={() => remove(category)} className="rounded-lg bg-red-500/10 px-3 py-2 text-red-300">
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

