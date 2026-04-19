'use client';

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-serif text-white">Analytics</h1>
      <p className="max-w-2xl text-zinc-500 text-sm">
        Charts and conversion funnels can be added here (e.g. Recharts + API). This route exists so the sidebar link
        works.
      </p>
      <div className="glass-card rounded-2xl border border-white/5 p-8 text-zinc-400 text-sm">
        Connect your analytics provider or export order data from the Orders screen.
      </div>
    </div>
  );
}
