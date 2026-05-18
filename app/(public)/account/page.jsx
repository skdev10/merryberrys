'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LuxuryNavbar from '../../../components/LuxuryNavbar';
import RemoteImg from '../../../components/RemoteImg';
import { Package, User, LogOut, FileText, Settings, Heart } from 'lucide-react';
import { formatPrice } from '@/lib/currency';
import { authHeaders, clearAuth, fetchCurrentUser, isLoggedIn } from '@/lib/auth';

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/login?redirect=/account');
      return;
    }

    (async () => {
      const fresh = await fetchCurrentUser();
      if (!fresh) {
        router.push('/login?redirect=/account');
        return;
      }
      setUser(fresh);
      fetchOrders();
    })();
  }, [router]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/orders', { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    router.push('/');
  };

  if (!user) {
    return (
      <>
        <LuxuryNavbar />
        <div className="pt-32 pb-20 bg-luxury-white min-h-screen flex items-center justify-center">
          <div className="text-luxury-taupe animate-pulse">Loading your account...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <LuxuryNavbar />
      
      <main className="pt-32 pb-20 bg-luxury-white min-h-screen">
        <div className="container-luxury">
          {/* Header */}
          <div className="mb-12 border-b border-luxury-light-gray/20 pb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="font-serif text-3xl text-luxury-black mb-2">My Account</h1>
              <p className="text-luxury-taupe">Welcome back, {user.name}</p>
            </div>
            {user.role === 'admin' && (
              <Link href="/admin/dashboard" className="btn-luxury">
                <span>Admin Dashboard</span>
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-2">
              <button 
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${activeTab === 'orders' ? 'bg-luxury-cream text-luxury-black font-medium border-l-2 border-luxury-gold' : 'text-luxury-taupe hover:bg-luxury-cream hover:text-luxury-black border-l-2 border-transparent'}`}
              >
                <Package size={18} /> My Orders
              </button>
              <button 
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${activeTab === 'profile' ? 'bg-luxury-cream text-luxury-black font-medium border-l-2 border-luxury-gold' : 'text-luxury-taupe hover:bg-luxury-cream hover:text-luxury-black border-l-2 border-transparent'}`}
              >
                <User size={18} /> Profile Info
              </button>
              <button 
                onClick={() => setActiveTab('wishlist')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${activeTab === 'wishlist' ? 'bg-luxury-cream text-luxury-black font-medium border-l-2 border-luxury-gold' : 'text-luxury-taupe hover:bg-luxury-cream hover:text-luxury-black border-l-2 border-transparent'}`}
              >
                <Heart size={18} /> Wishlist
              </button>
              <button 
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${activeTab === 'settings' ? 'bg-luxury-cream text-luxury-black font-medium border-l-2 border-luxury-gold' : 'text-luxury-taupe hover:bg-luxury-cream hover:text-luxury-black border-l-2 border-transparent'}`}
              >
                <Settings size={18} /> Settings
              </button>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors border-l-2 border-transparent"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3">
              {activeTab === 'orders' && (
                <div>
                  <h2 className="font-serif text-2xl text-luxury-black mb-6">Order History</h2>
                  {isLoading ? (
                    <div className="animate-pulse space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-24 bg-luxury-cream w-full" />
                      ))}
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-16 bg-luxury-cream border border-luxury-light-gray/20">
                      <Package size={48} className="mx-auto text-luxury-taupe mb-4 opacity-50" />
                      <p className="text-luxury-taupe mb-6">You haven't placed any orders yet.</p>
                      <Link href="/shop" className="btn-luxury-outline inline-flex">
                        <span>Start Shopping</span>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map(order => (
                        <div key={order.id} className="border border-luxury-light-gray/20 bg-luxury-white">
                          <div className="bg-luxury-cream px-6 py-4 border-b border-luxury-light-gray/20 flex flex-wrap justify-between items-center gap-4">
                            <div>
                              <p className="text-xs text-luxury-taupe uppercase tracking-wider mb-1">Order Placed</p>
                              <p className="text-sm font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-luxury-taupe uppercase tracking-wider mb-1">Total</p>
                              <p className="text-sm font-medium">{formatPrice(order.total)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-luxury-taupe uppercase tracking-wider mb-1">Status</p>
                              <span className={`inline-block px-3 py-1 text-xs font-medium ${
                                order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {order.status}
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-luxury-taupe uppercase tracking-wider mb-1">Order ID</p>
                              <p className="text-sm text-luxury-taupe truncate w-24 sm:w-auto">#{order.id.slice(-8)}</p>
                            </div>
                          </div>
                          <div className="p-6">
                            <div className="space-y-4">
                              {order.orderItems.map(item => (
                                <div key={item.id} className="flex items-center gap-4">
                                  <div className="w-16 h-20 bg-luxury-cream flex-shrink-0 relative overflow-hidden">
                                    <RemoteImg
                                      src={item.product?.images ? JSON.parse(item.product.images)[0] : '/placeholder.jpg'}
                                      alt={item.product?.name}
                                      className="absolute inset-0 w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="text-sm font-medium text-luxury-black">{item.product?.name || 'Product'}</h4>
                                    <p className="text-xs text-luxury-taupe mt-1">
                                      Qty: {item.quantity} | {formatPrice(item.price)}
                                    </p>
                                    {(item.size || item.color) && (
                                      <p className="text-xs text-luxury-taupe mt-1">
                                        {item.size && `Size: ${item.size}`} {item.color && `| Color: ${item.color}`}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="mt-6 pt-6 border-t border-luxury-light-gray/20 flex justify-between items-center">
                              <div className="text-sm text-luxury-taupe">
                                {order.isPaid ? 'Payment Successful' : 'Payment Pending (Bank Transfer)'}
                              </div>
                              <button className="text-sm text-luxury-gold hover:text-luxury-black transition-colors font-medium">
                                View Invoice
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'profile' && (
                <div>
                  <h2 className="font-serif text-2xl text-luxury-black mb-6">Profile Information</h2>
                  <div className="bg-luxury-cream p-8">
                    <div className="space-y-6 max-w-lg">
                      <div>
                        <label className="block text-xs uppercase tracking-[0.15em] text-luxury-taupe mb-2">Full Name</label>
                        <input type="text" value={user.name} disabled className="w-full px-4 py-3 bg-luxury-white border border-luxury-light-gray/20 text-luxury-black opacity-70" />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-[0.15em] text-luxury-taupe mb-2">Email Address</label>
                        <input type="email" value={user.email} disabled className="w-full px-4 py-3 bg-luxury-white border border-luxury-light-gray/20 text-luxury-black opacity-70" />
                      </div>
                      <div className="pt-4">
                        <button className="btn-luxury-outline">
                          <span>Edit Profile</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {(activeTab === 'wishlist' || activeTab === 'settings') && (
                <div className="text-center py-20 bg-luxury-cream">
                  <p className="text-luxury-taupe text-lg">This section is currently under development.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-luxury-black text-luxury-white py-12">
        <div className="container-luxury text-center">
          <h2 className="font-serif text-2xl tracking-[0.15em] mb-4">MERRY BERRY</h2>
          <p className="text-sm text-luxury-white/60">© 2026 Merry Berry. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
