'use client';

import { useParams } from 'next/navigation';
import AdminProductForm from '@/components/admin/AdminProductForm';

export default function AdminEditProductPage() {
  const params = useParams();
  const id = params?.id;
  if (!id) return null;
  return <AdminProductForm productId={id} />;
}
