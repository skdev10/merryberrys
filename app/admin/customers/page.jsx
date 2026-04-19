'use client';

export default function AdminCustomersPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-serif text-white">Customers</h1>
      <p className="max-w-2xl text-zinc-500 text-sm">
        Customer CRM will appear here (search, order history, lifetime value). For now this page is a placeholder so the
        admin menu does not 404.
      </p>
      <div className="glass-card rounded-2xl border border-white/5 p-8 text-zinc-400 text-sm">
        No customer list wired to the database yet — use Orders for recent buyers.
      </div>
    </div>
  );
}
