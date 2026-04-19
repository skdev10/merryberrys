'use client';
import { useState } from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export default function AccountPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  if (isLoggedIn) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-zinc-950 text-white pt-10 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-serif text-4xl mb-12 border-b border-white/10 pb-6">My Account</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 space-y-2">
                <button className="w-full text-left bg-berry-900/30 text-white px-4 py-3 rounded border-l-2 border-berry-500">Dashboard</button>
                <button className="w-full text-left text-zinc-400 hover:text-white px-4 py-3 rounded hover:bg-zinc-900">Orders</button>
                <button className="w-full text-left text-zinc-400 hover:text-white px-4 py-3 rounded hover:bg-zinc-900">Addresses</button>
                <button className="w-full text-left text-zinc-400 hover:text-white px-4 py-3 rounded hover:bg-zinc-900 mt-4 text-red-400 hover:text-red-300" onClick={() => setIsLoggedIn(false)}>Logout</button>
              </div>
              
              <div className="col-span-1 md:col-span-3">
                <div className="bg-zinc-900 rounded-xl p-8 border border-white/5">
                  <h2 className="text-xl font-serif mb-6">Hello, Premium Member</h2>
                  <p className="text-zinc-400 mb-8">From your account dashboard you can view your recent orders, manage your shipping and billing addresses, and edit your password and account details.</p>
                  
                  <h3 className="text-lg font-serif mb-4 mt-10">Recent Orders</h3>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-700 text-zinc-500 text-sm">
                        <th className="pb-3 font-normal">Order</th>
                        <th className="pb-3 font-normal">Date</th>
                        <th className="pb-3 font-normal">Status</th>
                        <th className="pb-3 font-normal">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-zinc-800">
                        <td className="py-4">#MB-20491</td>
                        <td className="py-4 text-sm text-zinc-400">Oct 14, 2023</td>
                        <td className="py-4"><span className="bg-zinc-800 text-white text-xs px-2 py-1 rounded">Processing</span></td>
                        <td className="py-4 font-serif text-gold-400">$309.97</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center py-20">
        <div className="max-w-md w-full px-4 text-center">
          
          <h1 className="font-serif text-4xl mb-2">{isLogin ? 'Login' : 'Create Account'}</h1>
          <p className="text-zinc-400 text-sm mb-8">
            {isLogin ? 'Welcome back to Merry Berry. Enter your details to continue.' : 'Join the exclusive club of premium fashion.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <input type="text" placeholder="Full Name" required className="w-full bg-zinc-900 border border-zinc-700 rounded p-4 text-white focus:outline-none focus:border-berry-500" />
            )}
            <input type="email" placeholder="Email Address" required className="w-full bg-zinc-900 border border-zinc-700 rounded p-4 text-white focus:outline-none focus:border-berry-500" />
            <input type="password" placeholder="Password" required className="w-full bg-zinc-900 border border-zinc-700 rounded p-4 text-white focus:outline-none focus:border-berry-500" />
            
            <button type="submit" className="w-full bg-berry-600 hover:bg-berry-500 text-white rounded py-4 font-medium transition shadow-[0_0_15px_rgba(218,44,119,0.3)]">
              {isLogin ? 'Sign In' : 'Register'}
            </button>
          </form>

          <div className="mt-8">
            <button onClick={() => setIsLogin(!isLogin)} className="text-zinc-500 hover:text-berry-400 transition underline underline-offset-4 text-sm">
              {isLogin ? 'New to Merry Berry? Create an account' : 'Already have an account? Login'}
            </button>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
