import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useStore, Order } from '../context/StoreContext';
import { Product } from '../types';

const formatPrice = (p: number) => new Intl.NumberFormat('fa-IR').format(p);
const formatDate = (d: string) => new Date(d).toLocaleDateString('fa-IR');
const formatTime = (d: string) => new Date(d).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });

// ─── Icons ─────────────────────────────────────────────────
const IC = {
  dashboard: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  products: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  orders: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
  users: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
  settings: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  close: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  plus: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>,
  edit: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  trash: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  eye: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
  search: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  back: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>,
  trend: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
  money: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  box: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  clock: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  check: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  preparing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  delivering: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  completed: 'bg-green-500/20 text-green-400 border-green-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'در انتظار',
  preparing: 'در حال آماده‌سازی',
  delivering: 'در حال ارسال',
  completed: 'تکمیل شده',
  cancelled: 'لغو شده',
};

const CHART_COLORS = ['#f97316', '#ef4444', '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'];

// ─── Admin Login ───────────────────────────────────────────
const AdminLogin: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('admin_logged_in', 'true');
      onLogin();
    } else {
      setError('نام کاربری یا رمز عبور اشتباه است');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 noise-overlay">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl floating" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-red-500/10 rounded-full blur-3xl floating-delay" />
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/30">
              <span className="text-white font-black text-2xl">B</span>
            </div>
            <h1 className="text-2xl font-black text-white mb-2">پنل مدیریت</h1>
            <p className="text-gray-400 text-sm">برگرلند - سیستم مدیریت فروشگاه</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">نام کاربری</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500/50 transition-all placeholder-gray-600" placeholder="admin" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">رمز عبور</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500/50 transition-all placeholder-gray-600" placeholder="••••••••" />
            </div>
            {error && <p className="text-red-400 text-sm text-center bg-red-500/10 rounded-xl p-3 border border-red-500/20">{error}</p>}
            <button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-orange-500/30">
              ورود به پنل
            </button>
          </form>

          <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-xs text-gray-500 text-center mb-2">اطلاعات ورود آزمایشی:</p>
            <div className="flex justify-center gap-4 text-xs text-gray-400">
              <span>نام کاربری: <code className="text-orange-400">admin</code></span>
              <span>رمز: <code className="text-orange-400">admin123</code></span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ─── Stat Card ─────────────────────────────────────────────
const StatCard: React.FC<{ title: string; value: string; subtitle?: string; icon: React.ReactNode; color: string; trend?: number }> = ({ title, value, subtitle, icon, color, trend }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all hover-lift">
    <div className="flex items-start justify-between mb-3">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg`}>{icon}</div>
      {trend !== undefined && (
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${trend >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {IC.trend}
          {trend >= 0 ? '+' : ''}{trend}%
        </div>
      )}
    </div>
    <p className="text-2xl font-black text-white">{value}</p>
    <p className="text-sm text-gray-400 mt-1">{title}</p>
    {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
  </motion.div>
);

// ─── Dashboard Overview ────────────────────────────────────
const DashboardOverview: React.FC = () => {
  const { getAnalytics, orders } = useStore();
  const analytics = getAnalytics();

  const pieData = analytics.ordersByStatus.map(s => ({ name: STATUS_LABELS[s.status] || s.status, value: s.count }));

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="درآمد کل" value={`${formatPrice(analytics.totalRevenue)} ت`} icon={IC.money} color="from-green-500 to-emerald-600" trend={12} subtitle={`${analytics.completedOrders} سفارش تکمیل شده`} />
        <StatCard title="سفارشات" value={formatPrice(analytics.totalOrders)} icon={IC.box} color="from-blue-500 to-indigo-600" trend={8} subtitle={`${analytics.pendingOrders} در انتظار`} />
        <StatCard title="محصولات" value={formatPrice(analytics.totalProducts)} icon={IC.box} color="from-orange-500 to-red-600" />
        <StatCard title="کاربران" value={formatPrice(analytics.totalUsers)} icon={IC.users} color="from-purple-500 to-pink-600" trend={15} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 overflow-hidden">
          <h3 className="text-lg font-bold text-white mb-4">درآمد ۷ روز اخیر</h3>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.revenueByDay} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={10} tickFormatter={d => new Date(d).toLocaleDateString('fa-IR', { month: 'short', day: 'numeric' })} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
                <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', direction: 'rtl' }} labelStyle={{ color: '#fff' }} formatter={(v: number) => [`${formatPrice(v)} تومان`, 'درآمد']} />
                <Area type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders by Status */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 overflow-hidden">
          <h3 className="text-lg font-bold text-white mb-4">وضعیت سفارشات</h3>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', direction: 'rtl' }} />
                <Legend wrapperStyle={{ direction: 'rtl', fontSize: '12px', paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Products & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 overflow-hidden">
          <h3 className="text-lg font-bold text-white mb-4">محصولات پرفروش</h3>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.topProducts} layout="vertical" margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" stroke="rgba(255,255,255,0.3)" fontSize={10} />
                <YAxis type="category" dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} width={120} />
                <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', direction: 'rtl' }} />
                <Bar dataKey="count" fill="#f97316" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-lg font-bold text-white mb-4">سفارشات اخیر</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-hide">
            {orders.slice(0, 6).map(o => (
              <div key={o.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                <div>
                  <p className="text-sm font-bold text-white">{o.customerName}</p>
                  <p className="text-xs text-gray-500">{o.id} • {formatDate(o.createdAt)}</p>
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-orange-400">{formatPrice(o.total)} ت</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${STATUS_COLORS[o.status]}`}>{STATUS_LABELS[o.status]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Products Management ───────────────────────────────────
const ProductsManagement: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  const filtered = products.filter(p => p.name.includes(search) || p.description.includes(search));

  const handleSave = (p: Product) => {
    if (editing) updateProduct(editing.id, p);
    else addProduct(p);
    setShowForm(false);
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">مدیریت محصولات</h2>
          <p className="text-gray-400 text-sm mt-1">{products.length} محصول ثبت شده</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-orange-500/30 hover:from-orange-600 hover:to-red-700 transition-all">
          {IC.plus} محصول جدید
        </button>
      </div>

      <div className="relative">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="جستجوی محصول..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-10 text-white outline-none focus:border-orange-500/50 transition-all placeholder-gray-600" />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">{IC.search}</div>
      </div>

      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-right text-xs font-bold text-gray-400 p-4">محصول</th>
                <th className="text-right text-xs font-bold text-gray-400 p-4">دسته</th>
                <th className="text-right text-xs font-bold text-gray-400 p-4">قیمت</th>
                <th className="text-right text-xs font-bold text-gray-400 p-4">امتیاز</th>
                <th className="text-right text-xs font-bold text-gray-400 p-4">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <p className="text-sm font-bold text-white">{p.name}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{p.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-300">{p.category}</td>
                  <td className="p-4 text-sm font-bold text-orange-400">{formatPrice(p.price)} ت</td>
                  <td className="p-4"><span className="text-sm text-amber-400">★ {p.rating}</span></td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setEditing(p); setShowForm(true); }} className="w-8 h-8 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center hover:bg-blue-500/30 transition-colors">{IC.edit}</button>
                      <button onClick={() => { if (confirm('حذف این محصول؟')) deleteProduct(p.id); }} className="w-8 h-8 bg-red-500/20 text-red-400 rounded-lg flex items-center justify-center hover:bg-red-500/30 transition-colors">{IC.trash}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Form Modal */}
      <AnimatePresence>
        {showForm && <ProductForm product={editing} onSave={handleSave} onClose={() => { setShowForm(false); setEditing(null); }} />}
      </AnimatePresence>
    </div>
  );
};

// ─── Product Form ──────────────────────────────────────────
const ProductForm: React.FC<{ product: Product | null; onSave: (p: Product) => void; onClose: () => void }> = ({ product, onSave, onClose }) => {
  const [form, setForm] = useState<Partial<Product>>(product || {
    name: '', description: '', price: 0, image: '', category: 'burger', rating: 4.5, reviews: 0, calories: 0, prepTime: '', ingredients: [],
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form as Product);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="relative bg-gradient-to-b from-gray-900 to-black rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black text-white">{product ? 'ویرایش محصول' : 'محصول جدید'}</h3>
          <button onClick={onClose} className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white hover:bg-white/10">{IC.close}</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">نام محصول</label>
            <input type="text" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500/50" />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">توضیحات</label>
            <textarea value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500/50 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">قیمت (تومان)</label>
              <input type="number" value={form.price || ''} onChange={e => setForm({ ...form, price: +e.target.value })} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500/50" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">دسته‌بندی</label>
              <select value={form.category || 'burger'} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500/50">
                <option value="burger">برگر</option>
                <option value="pizza">پیتزا</option>
                <option value="chicken">مرغ</option>
                <option value="sandwich">ساندویچ</option>
                <option value="sides">پیش‌غذا</option>
                <option value="drink">نوشیدنی</option>
                <option value="dessert">دسر</option>
              </select>
            </div>
          </div>
          
          {/* Image Upload Section */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">تصویر محصول</label>
            <div className="space-y-3">
              {/* File Upload */}
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-white/20 hover:border-orange-500/50 rounded-xl p-6 text-center transition-all bg-white/5 hover:bg-white/10">
                  <svg className="w-12 h-12 mx-auto mb-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm text-gray-400 mb-1">کلیک کنید یا تصویر را بکشید</p>
                  <p className="text-xs text-gray-600">PNG, JPG, WEBP (حداکثر 5MB)</p>
                </div>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
              
              {/* Image Preview */}
              {form.image && (
                <div className="relative rounded-xl overflow-hidden border border-white/10">
                  <img src={form.image} alt="Preview" className="w-full h-48 object-cover" />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, image: '' })}
                    className="absolute top-2 left-2 w-8 h-8 bg-red-500/90 hover:bg-red-600 rounded-lg flex items-center justify-center text-white transition-all"
                  >
                    {IC.close}
                  </button>
                </div>
              )}
              
              {/* Or URL Input */}
              <div className="relative">
                <div className="absolute inset-x-0 top-0 flex items-center justify-center">
                  <span className="bg-gray-900 px-3 text-xs text-gray-500">یا</span>
                </div>
                <div className="pt-4">
                  <input 
                    type="url" 
                    value={form.image?.startsWith('data:') ? '' : (form.image || '')} 
                    onChange={e => setForm({ ...form, image: e.target.value })} 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500/50" 
                    placeholder="https://example.com/image.jpg" 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">کالری</label>
              <input type="number" value={form.calories || ''} onChange={e => setForm({ ...form, calories: +e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500/50" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">زمان آماده‌سازی</label>
              <input type="text" value={form.prepTime || ''} onChange={e => setForm({ ...form, prepTime: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500/50" placeholder="۱۵ دقیقه" />
            </div>
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-500/30 hover:from-orange-600 hover:to-red-700 transition-all">
            {product ? 'ذخیره تغییرات' : 'افزودن محصول'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

// ─── Orders Management ─────────────────────────────────────
const OrdersManagement: React.FC = () => {
  const { orders, updateOrderStatus, deleteOrder } = useStore();
  const [filter, setFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white">مدیریت سفارشات</h2>
        <p className="text-gray-400 text-sm mt-1">{orders.length} سفارش ثبت شده</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {['all', 'pending', 'preparing', 'delivering', 'completed', 'cancelled'].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filter === s ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg' : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'}`}>
            {s === 'all' ? 'همه' : STATUS_LABELS[s]}
            <span className="mr-2 opacity-60">({s === 'all' ? orders.length : orders.filter(o => o.status === s).length})</span>
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filtered.map(o => (
          <motion.div key={o.id} layout className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-xl flex items-center justify-center text-orange-400">
                  {IC.orders}
                </div>
                <div>
                  <p className="font-bold text-white">{o.customerName}</p>
                  <p className="text-xs text-gray-500">{o.id} • {formatDate(o.createdAt)} {formatTime(o.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-left">
                  <p className="font-bold text-orange-400">{formatPrice(o.total)} ت</p>
                  <p className="text-xs text-gray-500">{o.items.length} آیتم</p>
                </div>
                <select value={o.status} onChange={e => updateOrderStatus(o.id, e.target.value as Order['status'])} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-orange-500/50">
                  {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                <button onClick={() => setSelectedOrder(o)} className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center text-white hover:bg-white/10">{IC.eye}</button>
                <button onClick={() => { if (confirm('حذف؟')) deleteOrder(o.id); }} className="w-9 h-9 bg-red-500/10 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-500/20">{IC.trash}</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="relative bg-gradient-to-b from-gray-900 to-black rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-white">جزئیات سفارش</h3>
                <button onClick={() => setSelectedOrder(null)} className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white hover:bg-white/10">{IC.close}</button>
              </div>
              <div className="space-y-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-xs text-gray-500 mb-1">شماره سفارش</p>
                  <p className="font-bold text-white">{selectedOrder.id}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10"><p className="text-xs text-gray-500 mb-1">مشتری</p><p className="font-bold text-white text-sm">{selectedOrder.customerName}</p></div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10"><p className="text-xs text-gray-500 mb-1">تلفن</p><p className="font-bold text-white text-sm">{selectedOrder.customerPhone}</p></div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10"><p className="text-xs text-gray-500 mb-1">آدرس</p><p className="text-sm text-white">{selectedOrder.customerAddress}</p></div>
                <div>
                  <p className="text-sm font-bold text-white mb-2">آیتم‌ها:</p>
                  <div className="space-y-2">
                    {selectedOrder.items.map((it, i) => (
                      <div key={i} className="flex items-center justify-between bg-white/5 rounded-xl p-3 border border-white/5">
                        <div className="flex items-center gap-2">
                          <img src={it.image} alt={it.name} className="w-10 h-10 rounded-lg object-cover" />
                          <div><p className="text-sm font-bold text-white">{it.name}</p><p className="text-xs text-gray-500">تعداد: {it.quantity}</p></div>
                        </div>
                        <p className="text-sm font-bold text-orange-400">{formatPrice(it.price * it.quantity)} ت</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between pt-4 border-t border-white/10">
                  <span className="font-bold text-white">مجموع</span>
                  <span className="text-xl font-black text-orange-400">{formatPrice(selectedOrder.total)} تومان</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Users Management ──────────────────────────────────────
const UsersManagement: React.FC = () => {
  const { users, updateUser, deleteUser } = useStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white">مدیریت کاربران</h2>
        <p className="text-gray-400 text-sm mt-1">{users.length} کاربر ثبت شده</p>
      </div>

      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-right text-xs font-bold text-gray-400 p-4">کاربر</th>
                <th className="text-right text-xs font-bold text-gray-400 p-4">نقش</th>
                <th className="text-right text-xs font-bold text-gray-400 p-4">سفارشات</th>
                <th className="text-right text-xs font-bold text-gray-400 p-4">مصرف</th>
                <th className="text-right text-xs font-bold text-gray-400 p-4">وضعیت</th>
                <th className="text-right text-xs font-bold text-gray-400 p-4">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div>
                      <p className="text-sm font-bold text-white">{u.name}</p>
                      <p className="text-xs text-gray-500">{u.email}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs px-2.5 py-1 rounded-lg font-bold ${u.role === 'admin' ? 'bg-red-500/20 text-red-400' : u.role === 'staff' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'}`}>
                      {u.role === 'admin' ? 'مدیر' : u.role === 'staff' ? 'کارمند' : 'مشتری'}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-white">{formatPrice(u.ordersCount)}</td>
                  <td className="p-4 text-sm text-orange-400 font-bold">{formatPrice(u.totalSpent)} ت</td>
                  <td className="p-4">
                    <span className={`text-xs px-2.5 py-1 rounded-lg font-bold ${u.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {u.status === 'active' ? 'فعال' : 'غیرفعال'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateUser(u.id, { status: u.status === 'active' ? 'inactive' : 'active' })} className="w-8 h-8 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center hover:bg-blue-500/30">{IC.edit}</button>
                      <button onClick={() => { if (confirm('حذف؟')) deleteUser(u.id); }} className="w-8 h-8 bg-red-500/20 text-red-400 rounded-lg flex items-center justify-center hover:bg-red-500/30">{IC.trash}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ─── Settings ──────────────────────────────────────────────
const SettingsPanel: React.FC = () => {
  const { settings, updateSettings, resetAll } = useStore();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white">تنظیمات فروشگاه</h2>
        <p className="text-gray-400 text-sm mt-1">تنظیمات عمومی فروشگاه را مدیریت کنید</p>
      </div>

      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">نام فروشگاه</label>
            <input type="text" value={settings.storeName} onChange={e => updateSettings({ storeName: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500/50" />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">تلفن</label>
            <input type="text" value={settings.phone} onChange={e => updateSettings({ phone: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500/50" />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-gray-400 mb-1 block">آدرس</label>
            <input type="text" value={settings.address} onChange={e => updateSettings({ address: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500/50" />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">هزینه ارسال (تومان)</label>
            <input type="number" value={settings.deliveryFee} onChange={e => updateSettings({ deliveryFee: +e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500/50" />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">حداقل سفارش برای ارسال رایگان</label>
            <input type="number" value={settings.freeDeliveryMin} onChange={e => updateSettings({ freeDeliveryMin: +e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500/50" />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">درصد مالیات</label>
            <input type="number" value={settings.taxPercent} onChange={e => updateSettings({ taxPercent: +e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500/50" />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">ساعت باز شدن</label>
            <input type="time" value={settings.openTime} onChange={e => updateSettings({ openTime: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500/50" />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">ساعت بسته شدن</label>
            <input type="time" value={settings.closeTime} onChange={e => updateSettings({ closeTime: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500/50" />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">وضعیت فروشگاه</label>
            <button onClick={() => updateSettings({ isOpen: !settings.isOpen })} className={`w-full px-4 py-3 rounded-xl font-bold transition-all ${settings.isOpen ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
              {settings.isOpen ? 'باز' : 'بسته'}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-white/10">
          <button onClick={handleSave} className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-500/30 hover:from-orange-600 hover:to-red-700 transition-all">
            {saved ? '✓ ذخیره شد' : 'ذخیره تنظیمات'}
          </button>
          <button onClick={() => { if (confirm('بازگشت به تنظیمات اولیه؟ تمام داده‌ها پاک می‌شود.')) resetAll(); }} className="px-6 py-3 bg-red-500/10 text-red-400 rounded-xl font-bold border border-red-500/20 hover:bg-red-500/20 transition-all">
            بازنشانی
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Reports Section ───────────────────────────────────────
const ReportsSection: React.FC = () => {
  const { orders } = useStore();
  const completedOrders = orders.filter(o => o.status === 'completed');
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);
  const avgOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white">گزارشات و آمار</h2>
        <p className="text-gray-400 text-sm mt-1">تحلیل عملکرد فروشگاه</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <p className="text-gray-400 text-sm mb-2">میانگین ارزش سفارش</p>
          <p className="text-2xl font-black text-white">{formatPrice(Math.round(avgOrderValue))} ت</p>
        </div>
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <p className="text-gray-400 text-sm mb-2">نرخ تکمیل سفارشات</p>
          <p className="text-2xl font-black text-green-400">
            {orders.length > 0 ? Math.round((completedOrders.length / orders.length) * 100) : 0}%
          </p>
        </div>
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <p className="text-gray-400 text-sm mb-2">نرخ لغو سفارشات</p>
          <p className="text-2xl font-black text-red-400">
            {orders.length > 0 ? Math.round((orders.filter(o => o.status === 'cancelled').length / orders.length) * 100) : 0}%
          </p>
        </div>
      </div>

      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <h3 className="text-lg font-bold text-white mb-4">عملکرد ماهانه</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={[
              { month: 'فروردین', revenue: 45000000 },
              { month: 'اردیبهشت', revenue: 52000000 },
              { month: 'خرداد', revenue: 48000000 },
              { month: 'تیر', revenue: 61000000 },
              { month: 'مرداد', revenue: 58000000 },
              { month: 'شهریور', revenue: 67000000 },
            ]}>
              <defs>
                <linearGradient id="colorRevenue2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={12} />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickFormatter={v => `${(v / 1000000).toFixed(0)}M`} />
              <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', direction: 'rtl' }} />
              <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fill="url(#colorRevenue2)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// ─── Coupons Section ───────────────────────────────────────
interface Coupon {
  id: number;
  code: string;
  discount: number;
  type: string;
  minOrder: number;
  maxUses: number;
  usedCount: number;
  active: boolean;
  expiresAt: string;
}

const CouponsSection: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('admin_coupons');
    return saved ? JSON.parse(saved) : [
      { id: 1, code: 'WELCOME20', discount: 20, type: 'percent', minOrder: 100000, maxUses: 100, usedCount: 45, active: true, expiresAt: '2025-12-31' },
      { id: 2, code: 'FREESHIP', discount: 35000, type: 'fixed', minOrder: 300000, maxUses: 50, usedCount: 12, active: true, expiresAt: '2025-12-31' },
    ];
  });

  const saveCoupons = (data: typeof coupons) => {
    setCoupons(data);
    localStorage.setItem('admin_coupons', JSON.stringify(data));
  };

  const toggleCoupon = (id: number) => {
    const updated = coupons.map((c: typeof coupons[0]) => c.id === id ? { ...c, active: !c.active } : c);
    saveCoupons(updated);
  };

  const deleteCoupon = (id: number) => {
    saveCoupons(coupons.filter((c: typeof coupons[0]) => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">مدیریت کوپن‌ها</h2>
          <p className="text-gray-400 text-sm mt-1">{coupons.length} کوپن ثبت شده</p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-orange-500/30">
          {IC.plus} کوپن جدید
        </button>
      </div>

      <div className="space-y-3">
        {coupons.map(coupon => (
          <div key={coupon.id} className="bg-white/5 rounded-2xl p-5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${coupon.active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                {IC.money}
              </div>
              <div>
                <p className="font-bold text-white text-lg">{coupon.code}</p>
                <p className="text-sm text-gray-400">
                  {coupon.type === 'percent' ? `${coupon.discount}% تخفیف` : `${formatPrice(coupon.discount)} تومان تخفیف`}
                  {' • '}حداقل سفارش: {formatPrice(coupon.minOrder)} ت
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {coupon.usedCount} از {coupon.maxUses} استفاده • انقضا: {coupon.expiresAt}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => toggleCoupon(coupon.id)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${coupon.active ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'}`}>
                {coupon.active ? 'فعال' : 'غیرفعال'}
              </button>
              <button onClick={() => deleteCoupon(coupon.id)} className="w-10 h-10 bg-red-500/10 hover:bg-red-500/20 rounded-xl flex items-center justify-center text-red-400 transition-all">
                {IC.trash}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Reviews Section ───────────────────────────────────────
const ReviewsSection: React.FC = () => {
  const reviews = [
    { id: 1, user: 'علی محمدی', product: 'دبل چیزبرگر', rating: 5, comment: 'عالی بود! طعم فوق‌العاده و ارسال سریع.', date: '2025-01-15', approved: true },
    { id: 2, user: 'مریم احمدی', product: 'پیتزا پپرونی', rating: 4, comment: 'خوب بود ولی پنیر کم بود.', date: '2025-01-14', approved: true },
    { id: 3, user: 'رضا کریمی', product: 'مرغ سوخاری', rating: 5, comment: 'بهترین مرغ سوخاری که خوردم!', date: '2025-01-13', approved: false },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white">مدیریت نظرات</h2>
        <p className="text-gray-400 text-sm mt-1">{reviews.length} نظر ثبت شده</p>
      </div>

      <div className="space-y-3">
        {reviews.map(review => (
          <div key={review.id} className="bg-white/5 rounded-2xl p-5 border border-white/10">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold">
                  {review.user[0]}
                </div>
                <div>
                  <p className="font-bold text-white">{review.user}</p>
                  <p className="text-xs text-gray-500">{review.product} • {review.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(review.rating)].map((_, i) => (
                  <span key={i} className="text-amber-400">★</span>
                ))}
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-3">{review.comment}</p>
            <div className="flex items-center gap-2">
              <button className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${review.approved ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'}`}>
                {review.approved ? 'تایید شده' : 'در انتظار تایید'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Categories Section ────────────────────────────────────
const CategoriesSection: React.FC = () => {
  const { products } = useStore();
  const categories = [
    { id: 'burger', name: 'برگر', count: products.filter(p => p.category === 'burger').length },
    { id: 'pizza', name: 'پیتزا', count: products.filter(p => p.category === 'pizza').length },
    { id: 'chicken', name: 'مرغ', count: products.filter(p => p.category === 'chicken').length },
    { id: 'sandwich', name: 'ساندویچ', count: products.filter(p => p.category === 'sandwich').length },
    { id: 'sides', name: 'پیش‌غذا', count: products.filter(p => p.category === 'sides').length },
    { id: 'drink', name: 'نوشیدنی', count: products.filter(p => p.category === 'drink').length },
    { id: 'dessert', name: 'دسر', count: products.filter(p => p.category === 'dessert').length },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">مدیریت دسته‌بندی‌ها</h2>
          <p className="text-gray-400 text-sm mt-1">{categories.length} دسته‌بندی</p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-orange-500/30">
          {IC.plus} دسته‌بندی جدید
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white/5 rounded-2xl p-5 border border-white/10 flex items-center justify-between hover:bg-white/10 transition-all">
            <div>
              <p className="font-bold text-white text-lg">{cat.name}</p>
              <p className="text-sm text-gray-400">{cat.count} محصول</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-9 h-9 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center text-gray-400 transition-all">
                {IC.edit}
              </button>
              <button className="w-9 h-9 bg-red-500/10 hover:bg-red-500/20 rounded-lg flex items-center justify-center text-red-400 transition-all">
                {IC.trash}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Notifications Section ─────────────────────────────────
interface Notification {
  id: number;
  title: string;
  message: string;
  active: boolean;
  createdAt: string;
}

const NotificationsSection: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('admin_notifications');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'تخفیف ویژه عید', message: '20% تخفیف روی همه محصولات', active: true, createdAt: '2025-01-15' },
      { id: 2, title: 'ارسال رایگان', message: 'ارسال رایگان برای سفارش‌های بالای 500 هزار تومان', active: true, createdAt: '2025-01-10' },
    ];
  });

  const saveNotifications = (data: Notification[]) => {
    setNotifications(data);
    localStorage.setItem('admin_notifications', JSON.stringify(data));
  };

  const toggleNotification = (id: number) => {
    const updated = notifications.map((n: Notification) => n.id === id ? { ...n, active: !n.active } : n);
    saveNotifications(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">مدیریت اعلان‌ها</h2>
          <p className="text-gray-400 text-sm mt-1">{notifications.length} اعلان</p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-orange-500/30">
          {IC.plus} اعلان جدید
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map(notif => (
          <div key={notif.id} className="bg-white/5 rounded-2xl p-5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${notif.active ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'}`}>
                {IC.clock}
              </div>
              <div>
                <p className="font-bold text-white">{notif.title}</p>
                <p className="text-sm text-gray-400">{notif.message}</p>
                <p className="text-xs text-gray-500 mt-1">{notif.createdAt}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => toggleNotification(notif.id)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${notif.active ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'}`}>
                {notif.active ? 'فعال' : 'غیرفعال'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Activity Log Section ──────────────────────────────────
const ActivityLogSection: React.FC = () => {
  const { orders } = useStore();
  const activities = [
    ...orders.slice(0, 10).map(o => ({
      id: o.id,
      action: 'سفارش جدید',
      description: `${o.customerName} سفارش ${formatPrice(o.total)} تومانی ثبت کرد`,
      time: o.createdAt,
      type: 'order',
    })),
    { id: 'sys1', action: 'ورود ادمین', description: 'ورود موفق به پنل مدیریت', time: new Date().toISOString(), type: 'system' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white">لاگ فعالیت‌ها</h2>
        <p className="text-gray-400 text-sm mt-1">آخرین فعالیت‌های سیستم</p>
      </div>

      <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
        <div className="divide-y divide-white/5">
          {activities.map(activity => (
            <div key={activity.id} className="p-4 flex items-center gap-4 hover:bg-white/5 transition-all">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                activity.type === 'order' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'
              }`}>
                {activity.type === 'order' ? IC.orders : IC.check}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white text-sm">{activity.action}</p>
                <p className="text-xs text-gray-400 truncate">{activity.description}</p>
              </div>
              <div className="text-xs text-gray-500 flex-shrink-0">
                {formatDate(activity.time)} {formatTime(activity.time)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Main Admin Panel ──────────────────────────────────────
const AdminPanel: React.FC<{ onLogout: () => void; onBack: () => void }> = ({ onLogout, onBack }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'داشبورد', icon: IC.dashboard },
    { id: 'products', label: 'محصولات', icon: IC.products },
    { id: 'orders', label: 'سفارشات', icon: IC.orders },
    { id: 'users', label: 'کاربران', icon: IC.users },
    { id: 'reports', label: 'گزارشات', icon: IC.trend },
    { id: 'coupons', label: 'کوپن‌ها', icon: IC.money },
    { id: 'reviews', label: 'نظرات', icon: IC.eye },
    { id: 'categories', label: 'دسته‌بندی‌ها', icon: IC.box },
    { id: 'notifications', label: 'اعلان‌ها', icon: IC.clock },
    { id: 'activity', label: 'لاگ فعالیت', icon: IC.check },
    { id: 'settings', label: 'تنظیمات', icon: IC.settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardOverview />;
      case 'products': return <ProductsManagement />;
      case 'orders': return <OrdersManagement />;
      case 'users': return <UsersManagement />;
      case 'reports': return <ReportsSection />;
      case 'coupons': return <CouponsSection />;
      case 'reviews': return <ReviewsSection />;
      case 'categories': return <CategoriesSection />;
      case 'notifications': return <NotificationsSection />;
      case 'activity': return <ActivityLogSection />;
      case 'settings': return <SettingsPanel />;
      default: return <DashboardOverview />;
    }
  };

  return (
    <div className="bg-black">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Sidebar - Fixed on mobile, sticky on desktop */}
      <aside 
        className={`
          fixed top-0 right-0 h-screen w-64 
          bg-gradient-to-b from-gray-900 to-black 
          border-l border-white/10 
          z-50 
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30 flex-shrink-0">
                <span className="text-white font-black text-lg">B</span>
              </div>
              <div className="min-w-0">
                <h1 className="font-black text-white text-sm truncate">پنل مدیریت</h1>
                <p className="text-[10px] text-gray-500">برگرلند</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl 
                  text-sm font-bold transition-all duration-200
                  ${activeTab === tab.id
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                <span className="flex-shrink-0">{tab.icon}</span>
                <span className="truncate">{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* Footer Actions */}
          <div className="p-4 border-t border-white/10 space-y-2">
            <button 
              onClick={onBack} 
              className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              {IC.back} 
              <span>بازگشت به سایت</span>
            </button>
            <button 
              onClick={onLogout} 
              className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all"
            >
              {IC.close} 
              <span>خروج</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:mr-64">
        {/* Top Bar */}
        <div className="z-30 bg-black/90 backdrop-blur-xl border-b border-white/10">
          <div className="px-4 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <button 
                  onClick={() => setSidebarOpen(true)} 
                  className="lg:hidden w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white hover:bg-white/10 transition-colors flex-shrink-0"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <h2 className="text-lg font-bold text-white truncate">
                  {tabs.find(t => t.id === activeTab)?.label}
                </h2>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="hidden sm:flex items-center gap-2 bg-green-500/10 text-green-400 px-3 py-1.5 rounded-lg border border-green-500/20 text-xs font-bold">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span>آنلاین</span>
                </div>
                <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-orange-500/30">
                  A
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }} 
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

// ─── Admin Router ──────────────────────────────────────────
export const AdminRouter: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('admin_logged_in') === 'true');

  if (!isLoggedIn) return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;
  return <AdminPanel onLogout={() => { localStorage.removeItem('admin_logged_in'); setIsLoggedIn(false); }} onBack={() => window.location.hash = ''} />;
};
