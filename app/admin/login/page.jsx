'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        router.push('/admin');
      } else {
        setError(
          data.code === 'DATABASE_UNAVAILABLE'
            ? `${data.message} Check /api/setup/status on your site.`
            : data.message || 'Invalid credentials'
        );
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-berry-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bad6001?w=1600&q=80')] bg-cover bg-center opacity-5"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-berry-500 to-gold-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="font-serif text-2xl font-bold text-white">
              MERRY <span className="text-berry-500">BERRY</span>
            </span>
          </Link>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="text-gold-400" size={20} />
            <span className="text-gold-400 text-sm uppercase tracking-widest">Admin Portal</span>
            <Sparkles className="text-gold-400" size={20} />
          </div>
          <h1 className="text-3xl font-serif text-white mb-2">Welcome Back</h1>
          <p className="text-zinc-500">Sign in to access your admin dashboard</p>
        </div>

        {/* Login Form */}
        <div className="glass-card rounded-2xl p-8 border border-white/10">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-zinc-400 text-sm mb-2 font-medium">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-zinc-600 focus:outline-none focus:border-berry-500 focus:ring-1 focus:ring-berry-500 transition-all"
                  placeholder="admin@merryberry.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 text-sm mb-2 font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-4 pl-12 pr-12 text-white placeholder-zinc-600 focus:outline-none focus:border-berry-500 focus:ring-1 focus:ring-berry-500 transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-zinc-500 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-zinc-900 text-berry-500 focus:ring-berry-500" />
                Remember me
              </label>
              <Link href="#" className="text-berry-400 hover:text-berry-300 transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-berry-600 to-berry-500 hover:from-berry-500 hover:to-berry-400 text-white py-4 rounded-xl font-medium transition-all shadow-[0_0_30px_rgba(218,44,119,0.3)] hover:shadow-[0_0_40px_rgba(218,44,119,0.5)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign In <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-zinc-500 hover:text-white text-sm transition-colors flex items-center justify-center gap-2">
            ← Back to Website
          </Link>
        </div>
      </div>
    </div>
  );
}
