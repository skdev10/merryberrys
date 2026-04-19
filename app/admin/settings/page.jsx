'use client';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-serif text-white">Settings</h1>
      <p className="max-w-2xl text-zinc-500 text-sm">
        Store name, currency, shipping zones, and email templates can live here. Placeholder page — no 404 from the
        menu.
      </p>
      <div className="glass-card rounded-2xl border border-white/5 p-8 text-zinc-400 text-sm">
        Default admin login: admin@merryberry.com — change password after first deploy.
      </div>
    </div>
  );
}
