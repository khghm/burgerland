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
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-lg font-bold text-white mb-4">درآمد ۷ روز اخیر</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.revenueByDay}>
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
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-lg font-bold text-white mb-4">وضعیت سفارشات</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', direction: 'rtl' }} />
                <Legend wrapperStyle={{ direction: 'rtl', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Products & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-lg font-bold text-white mb-4">محصولات پرفروش</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" stroke="rgba(255,255,255,0.3)" fontSize={10} />
                <YAxis type="category" dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} width={100} />
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
          <div>
            <label className="text-sm text-gray-400 mb-1 block">آدرس تصویر (URL)</label>
            <input type="url" value={form.image || ''} onChange={e => setForm({ ...form, image: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500/50" placeholder="https://..." />
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

// ─── Main Admin Panel ──────────────────────────────────────
const AdminPanel: React.FC<{ onLogout: () => void; onBack: () => void }> = ({ onLogout, onBack }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'داشبورد', icon: IC.dashboard },
    { id: 'products', label: 'محصولات', icon: IC.products },
    { id: 'orders', label: 'سفارشات', icon: IC.orders },
    { id: 'users', label: 'کاربران', icon: IC.users },
    { id: 'settings', label: 'تنظیمات', icon: IC.settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardOverview />;
      case 'products': return <ProductsManagement />;
      case 'orders': return <OrdersManagement />;
      case 'users': return <UsersManagement />;
      case 'settings': return <SettingsPanel />;
      default: return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Mobile Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/80 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 right-0 h-full w-64 bg-gradient-to-b from-gray-900 to-black border-l border-white/10 z-50 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
              <span className="text-white font-black text-lg">B</span>
            </div>
            <div>
              <h1 className="font-black text-white text-sm">پنل مدیریت</h1>
              <p className="text-[10px] text-gray-500">برگرلند</p>
            </div>
          </div>

          <nav className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-orange-500/20 to-red-600/20 text-orange-400 border border-orange-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
          <button onClick={onBack} className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all mb-2">
            {IC.back} بازگشت به سایت
          </button>
          <button onClick={onLogout} className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all">
            {IC.close} خروج
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-white/10 px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <h2 className="text-lg font-bold text-white">{tabs.find(t => t.id === activeTab)?.label}</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 bg-green-500/10 text-green-400 px-3 py-1.5 rounded-lg border border-green-500/20 text-xs font-bold">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                آنلاین
              </div>
              <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white text-sm font-bold">
                A
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
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
