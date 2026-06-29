import { Suspense } from 'react';
import AdminMediaPage from './AdminMediaPage';

function Loading() {
  return <div className="py-20 text-center text-zinc-500">Loading media center…</div>;
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <AdminMediaPage />
    </Suspense>
  );
}
