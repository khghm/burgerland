import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useStore, Order, Coupon, Review, Category, Notification, ActivityLog } from '../context/StoreContext';
import { Product } from '../types';

const fp = (p: number) => new Intl.NumberFormat('fa-IR').format(p);
const fd = (d: string) => new Date(d).toLocaleDateString('fa-IR');
const ft = (d: string) => new Date(d).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });

const IC = {
  dashboard: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  products: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  orders: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
  users: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  settings: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  close: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  plus: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>,
  edit: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  trash: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  back: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>,
  trend: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
  coupon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>,
  review: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
  category: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
  bell: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
  log: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  preparing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  delivering: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  completed: 'bg-green-500/20 text-green-400 border-green-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
};
const STATUS_LABELS: Record<string, string> = { pending: 'در انتظار', preparing: 'در حال آماده‌سازی', delivering: 'در حال ارسال', completed: 'تکمیل شده', cancelled: 'لغو شده' };
const CHART_COLORS = ['#f97316', '#ef4444', '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'];

// ─── Login ─────────────────────────────────────────────────
const AdminLogin: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [err, setErr] = useState('');
  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    if (u === 'admin' && p === 'admin123') { localStorage.setItem('admin_logged_in', 'true'); onLogin(); }
    else setErr('نام کاربری یا رمز عبور اشتباه است');
  };
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/30">
              <span className="text-white font-black text-2xl">B</span>
            </div>
            <h1 className="text-2xl font-black text-white mb-2">پنل مدیریت</h1>
            <p className="text-gray-400 text-sm">برگرلند - سیستم مدیریت فروشگاه</p>
          </div>
          <form onSubmit={handle} className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">نام کاربری</label>
              <input type="text" value={u} onChange={e => setU(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500/50" placeholder="admin" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">رمز عبور</label>
              <input type="password" value={p} onChange={e => setP(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500/50" placeholder="••••••••" />
            </div>
            {err && <p className="text-red-400 text-sm text-center bg-red-500/10 rounded-xl p-3">{err}</p>}
            <button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-500/30">ورود به پنل</button>
          </form>
          <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-xs text-gray-500 text-center mb-2">اطلاعات ورود:</p>
            <div className="flex justify-center gap-4 text-xs text-gray-400">
              <span>کاربری: <code className="text-orange-400">admin</code></span>
              <span>رمز: <code className="text-orange-400">admin123</code></span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ─── Product Form ──────────────────────────────────────────
const ProductForm: React.FC<{ product: Product | null; onSave: (p: Product) => void; onClose: () => void }> = ({ product, onSave, onClose }) => {
  const { categories } = useStore();
  const activeCategories = categories.filter(c => c.active);
  const [form, setForm] = useState<Partial<Product>>(product || { name: '', description: '', price: 0, image: '', category: activeCategories[0]?.id || 'burger', rating: 4.5, reviews: 0, calories: 0, prepTime: '', ingredients: [] });
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { const r = new FileReader(); r.onloadend = () => setForm({ ...form, image: r.result as string }); r.readAsDataURL(file); }
  };
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="relative bg-gradient-to-b from-gray-900 to-black rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black text-white">{product ? 'ویرایش محصول' : 'محصول جدید'}</h3>
          <button onClick={onClose} className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white hover:bg-white/10">{IC.close}</button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave(form as Product); }} className="space-y-4">
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
              <select value={form.category || ''} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500/50" required>
                <option value="" disabled>انتخاب دسته‌بندی...</option>
                {activeCategories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {activeCategories.length === 0 && (
                <p className="text-xs text-red-400 mt-2">هیچ دسته‌بندی فعالی وجود ندارد. لطفاً ابتدا دسته‌بندی ایجاد کنید.</p>
              )}
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-2 block">تصویر محصول</label>
            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-white/20 hover:border-orange-500/50 rounded-xl p-6 text-center transition-all bg-white/5 hover:bg-white/10">
                <svg className="w-10 h-10 mx-auto mb-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <p className="text-sm text-gray-400">کلیک کنید یا تصویر را بکشید</p>
                <p className="text-xs text-gray-600 mt-1">PNG, JPG, WEBP</p>
              </div>
              <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
            </label>
            {form.image && <div className="relative mt-3 rounded-xl overflow-hidden border border-white/10"><img src={form.image} alt="" className="w-full h-40 object-cover" /><button type="button" onClick={() => setForm({ ...form, image: '' })} className="absolute top-2 left-2 w-8 h-8 bg-red-500/90 rounded-lg flex items-center justify-center text-white">{IC.close}</button></div>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm text-gray-400 mb-1 block">کالری</label><input type="number" value={form.calories || ''} onChange={e => setForm({ ...form, calories: +e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500/50" /></div>
            <div><label className="text-sm text-gray-400 mb-1 block">زمان آماده‌سازی</label><input type="text" value={form.prepTime || ''} onChange={e => setForm({ ...form, prepTime: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500/50" placeholder="۱۵ دقیقه" /></div>
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-500/30">{product ? 'ذخیره تغییرات' : 'افزودن محصول'}</button>
        </form>
      </motion.div>
    </motion.div>
  );
};

// ─── Dashboard Overview ────────────────────────────────────
const DashboardOverview: React.FC = () => {
  const { orders, products, users, coupons, reviews } = useStore();
  const totalRevenue = orders.filter(o => o.status === 'completed').reduce((s, o) => s + o.total, 0);
  const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString()).length;

  const last7 = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const ds = d.toDateString();
      const rev = orders.filter(o => new Date(o.createdAt).toDateString() === ds && o.status === 'completed').reduce((s, o) => s + o.total, 0);
      days.push({ date: d.toLocaleDateString('fa-IR', { weekday: 'short' }), revenue: rev });
    }
    return days;
  }, [orders]);

  const pieData = useMemo(() => {
    const counts: Record<string, number> = {};
    orders.forEach(o => { counts[o.status] = (counts[o.status] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name: STATUS_LABELS[name] || name, value }));
  }, [orders]);

  const stats = [
    { label: 'درآمد کل', value: `${fp(totalRevenue)} ت`, color: 'from-orange-500 to-red-600', change: '+۱۲٪' },
    { label: 'سفارشات', value: fp(orders.length), color: 'from-blue-500 to-indigo-600', change: `+${todayOrders} امروز` },
    { label: 'محصولات', value: fp(products.length), color: 'from-emerald-500 to-teal-600', change: 'فعال' },
    { label: 'کاربران', value: fp(users.length), color: 'from-purple-500 to-pink-600', change: '+۳ جدید' },
  ];

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-black text-white">داشبورد</h2><p className="text-gray-400 text-sm mt-1">نمای کلی فروشگاه</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white/5 rounded-2xl p-5 border border-white/10">
            <p className="text-gray-400 text-sm">{s.label}</p>
            <p className="text-2xl font-black text-white mt-2">{s.value}</p>
            <p className="text-xs text-green-400 mt-1">{s.change}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <h3 className="text-lg font-bold text-white mb-4">درآمد ۷ روز اخیر</h3>
          <div className="h-64"><ResponsiveContainer width="100%" height="100%"><AreaChart data={last7}><defs><linearGradient id="cr" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f97316" stopOpacity={0.3} /><stop offset="95%" stopColor="#f97316" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" /><XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={10} /><YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} /><Tooltip contentStyle={{ background: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', direction: 'rtl' }} /><Area type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2} fill="url(#cr)" /></AreaChart></ResponsiveContainer></div>
        </div>
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <h3 className="text-lg font-bold text-white mb-4">وضعیت سفارشات</h3>
          <div className="h-64"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">{pieData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}</Pie><Tooltip contentStyle={{ background: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', direction: 'rtl' }} /><Legend wrapperStyle={{ direction: 'rtl', fontSize: '12px' }} /></PieChart></ResponsiveContainer></div>
        </div>
      </div>
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <h3 className="text-lg font-bold text-white mb-4">آخرین سفارشات</h3>
        <div className="space-y-2">
          {orders.slice(0, 5).map(o => (
            <div key={o.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
              <div><p className="text-sm font-bold text-white">{o.customerName}</p><p className="text-xs text-gray-500">{fd(o.createdAt)} {ft(o.createdAt)}</p></div>
              <div className="text-left"><p className="text-sm font-bold text-orange-400">{fp(o.total)} ت</p><span className={`text-[10px] px-2 py-0.5 rounded-full border ${STATUS_COLORS[o.status]}`}>{STATUS_LABELS[o.status]}</span></div>
            </div>
          ))}
          {orders.length === 0 && <p className="text-gray-500 text-center py-4">هنوز سفارشی ثبت نشده</p>}
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div><h2 className="text-2xl font-black text-white">مدیریت محصولات</h2><p className="text-gray-400 text-sm mt-1">{products.length} محصول</p></div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-orange-500/30">{IC.plus} محصول جدید</button>
      </div>
      <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="جستجو..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500/50" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(p => (
          <div key={p.id} className="bg-white/5 rounded-2xl overflow-hidden border border-white/10">
            <img src={p.image} alt={p.name} className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="font-bold text-white">{p.name}</h3>
              <p className="text-sm text-gray-400 mt-1">{fp(p.price)} تومان</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => { setEditing(p); setShowForm(true); }} className="flex-1 bg-white/10 text-white text-sm py-2 rounded-lg hover:bg-white/20 transition-all">ویرایش</button>
                <button onClick={() => { if (confirm('حذف شود؟')) deleteProduct(p.id); }} className="bg-red-500/10 text-red-400 px-3 py-2 rounded-lg hover:bg-red-500/20">{IC.trash}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <AnimatePresence>{showForm && <ProductForm product={editing} onSave={(p) => { if (editing) updateProduct(p); else addProduct(p); setShowForm(false); }} onClose={() => setShowForm(false)} />}</AnimatePresence>
    </div>
  );
};

// ─── Orders Management ─────────────────────────────────────
const OrdersManagement: React.FC = () => {
  const { orders, updateOrderStatus, deleteOrder } = useStore();
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-black text-white">مدیریت سفارشات</h2><p className="text-gray-400 text-sm mt-1">{orders.length} سفارش</p></div>
      <div className="flex flex-wrap gap-2">
        {['all', 'pending', 'preparing', 'delivering', 'completed', 'cancelled'].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filter === s ? 'bg-orange-500 text-white shadow-lg' : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'}`}>
            {s === 'all' ? 'همه' : STATUS_LABELS[s]} ({s === 'all' ? orders.length : orders.filter(o => o.status === s).length})
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map(o => (
          <div key={o.id} className="bg-white/5 rounded-2xl p-5 border border-white/10">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <p className="font-bold text-white">#{o.id.slice(0, 8)}</p>
                <p className="text-sm text-gray-400 mt-1">{o.customerName} • {o.customerPhone}</p>
                <p className="text-xs text-gray-500 mt-1">{fd(o.createdAt)} {ft(o.createdAt)}</p>
              </div>
              <div className="text-left">
                <p className="text-lg font-black text-orange-400">{fp(o.total)} ت</p>
                <span className={`text-xs px-3 py-1 rounded-full border ${STATUS_COLORS[o.status]}`}>{STATUS_LABELS[o.status]}</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-white/10">
              <p className="text-xs text-gray-500 mb-2">{o.items.length} آیتم: {o.items.map(i => i.name).join('، ')}</p>
              <div className="flex gap-2 flex-wrap">
                {(['pending', 'preparing', 'delivering', 'completed', 'cancelled'] as const).map(s => (
                  <button key={s} onClick={() => updateOrderStatus(o.id, s)} className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${o.status === s ? STATUS_COLORS[s] : 'bg-white/5 text-gray-500 border-white/10 hover:bg-white/10'}`}>{STATUS_LABELS[s]}</button>
                ))}
                <button onClick={() => { if (confirm('حذف شود؟')) deleteOrder(o.id); }} className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20">حذف</button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-gray-500 text-center py-8">سفارشی یافت نشد</p>}
      </div>
    </div>
  );
};

// ─── Users Management ──────────────────────────────────────
const UsersManagement: React.FC = () => {
  const { users, toggleUserStatus, deleteUser } = useStore();
  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-black text-white">مدیریت کاربران</h2><p className="text-gray-400 text-sm mt-1">{users.length} کاربر</p></div>
      <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/10"><th className="text-right p-4 text-gray-400 font-bold">نام</th><th className="text-right p-4 text-gray-400 font-bold">ایمیل</th><th className="text-right p-4 text-gray-400 font-bold">تلفن</th><th className="text-right p-4 text-gray-400 font-bold">سفارشات</th><th className="text-right p-4 text-gray-400 font-bold">مبلغ کل</th><th className="text-right p-4 text-gray-400 font-bold">وضعیت</th><th className="text-right p-4 text-gray-400 font-bold">عملیات</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-4 text-white font-bold">{u.name}</td>
                  <td className="p-4 text-gray-400">{u.email || '-'}</td>
                  <td className="p-4 text-gray-400">{u.phone}</td>
                  <td className="p-4 text-white">{u.orderCount}</td>
                  <td className="p-4 text-orange-400">{fp(u.totalSpent)} ت</td>
                  <td className="p-4"><span className={`text-xs px-2 py-1 rounded-full border ${u.active ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>{u.active ? 'فعال' : 'غیرفعال'}</span></td>
                  <td className="p-4"><div className="flex gap-2"><button onClick={() => toggleUserStatus(u.id)} className="text-xs px-2 py-1 rounded-lg bg-white/10 text-white hover:bg-white/20">{u.active ? 'غیرفعال' : 'فعال'}</button><button onClick={() => { if (confirm('حذف؟')) deleteUser(u.id); }} className="text-xs px-2 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20">{IC.trash}</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ─── Coupons Management ────────────────────────────────────
const CouponsManagement: React.FC = () => {
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: '', discount: 0, type: 'percent' as 'percent' | 'fixed', minOrder: 0, maxUses: 100, active: true, expiresAt: '' });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div><h2 className="text-2xl font-black text-white">مدیریت کوپن‌ها</h2><p className="text-gray-400 text-sm mt-1">{coupons.length} کوپن</p></div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-orange-500/30">{IC.plus} کوپن جدید</button>
      </div>
      {showForm && (
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="text-sm text-gray-400 mb-1 block">کد تخفیف</label><input type="text" value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500/50" placeholder="WELCOME20" /></div>
            <div><label className="text-sm text-gray-400 mb-1 block">نوع</label><select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as 'percent' | 'fixed' })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500/50"><option value="percent">درصدی</option><option value="fixed">مبلغ ثابت</option></select></div>
            <div><label className="text-sm text-gray-400 mb-1 block">{form.type === 'percent' ? 'درصد تخفیف' : 'مبلغ تخفیف (تومان)'}</label><input type="number" value={form.discount} onChange={e => setForm({ ...form, discount: +e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500/50" /></div>
            <div><label className="text-sm text-gray-400 mb-1 block">حداقل سفارش (تومان)</label><input type="number" value={form.minOrder} onChange={e => setForm({ ...form, minOrder: +e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500/50" /></div>
            <div><label className="text-sm text-gray-400 mb-1 block">حداکثر استفاده</label><input type="number" value={form.maxUses} onChange={e => setForm({ ...form, maxUses: +e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500/50" /></div>
            <div><label className="text-sm text-gray-400 mb-1 block">تاریخ انقضا</label><input type="date" value={form.expiresAt} onChange={e => setForm({ ...form, expiresAt: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500/50" /></div>
          </div>
          <button onClick={() => { if (form.code && form.discount) { addCoupon(form); setShowForm(false); setForm({ code: '', discount: 0, type: 'percent', minOrder: 0, maxUses: 100, active: true, expiresAt: '' }); } }} className="mt-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold px-6 py-3 rounded-xl">ایجاد کوپن</button>
        </div>
      )}
      <div className="space-y-3">
        {coupons.map(c => (
          <div key={c.id} className="bg-white/5 rounded-2xl p-5 border border-white/10 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${c.active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>{IC.coupon}</div>
              <div>
                <p className="font-bold text-white text-lg font-mono">{c.code}</p>
                <p className="text-sm text-gray-400">{c.type === 'percent' ? `${c.discount}% تخفیف` : `${fp(c.discount)} تومان تخفیف`} • حداقل {fp(c.minOrder)} ت</p>
                <p className="text-xs text-gray-500 mt-1">{c.usedCount}/{c.maxUses} استفاده • انقضا: {c.expiresAt}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateCoupon({ ...c, active: !c.active })} className={`px-4 py-2 rounded-xl text-sm font-bold ${c.active ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'}`}>{c.active ? 'فعال' : 'غیرفعال'}</button>
              <button onClick={() => { if (confirm('حذف؟')) deleteCoupon(c.id); }} className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-500/20">{IC.trash}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Reviews Management ────────────────────────────────────
const ReviewsManagement: React.FC = () => {
  const { reviews, approveReview, deleteReview } = useStore();
  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-black text-white">مدیریت نظرات</h2><p className="text-gray-400 text-sm mt-1">{reviews.length} نظر ({reviews.filter(r => !r.approved).length} در انتظار)</p></div>
      <div className="space-y-3">
        {reviews.map(r => (
          <div key={r.id} className="bg-white/5 rounded-2xl p-5 border border-white/10">
            <div className="flex items-start justify-between mb-3 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold">{r.userName[0]}</div>
                <div><p className="font-bold text-white">{r.userName}</p><p className="text-xs text-gray-500">{r.productName} • {fd(r.createdAt)}</p></div>
              </div>
              <div className="flex items-center gap-1">{[...Array(r.rating)].map((_, i) => <span key={i} className="text-amber-400">★</span>)}</div>
            </div>
            <p className="text-gray-300 text-sm mb-3">"{r.comment}"</p>
            <div className="flex items-center gap-2">
              <button onClick={() => approveReview(r.id)} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${r.approved ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'}`}>{r.approved ? '✓ تایید شده' : 'در انتظار تایید'}</button>
              <button onClick={() => deleteReview(r.id)} className="px-3 py-1.5 rounded-lg text-xs bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20">حذف</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Categories Management ─────────────────────────────────
const CategoriesManagement: React.FC = () => {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', image: '', description: '', order: 0, active: true });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div><h2 className="text-2xl font-black text-white">مدیریت دسته‌بندی‌ها</h2><p className="text-gray-400 text-sm mt-1">{categories.length} دسته‌بندی</p></div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-orange-500/30">{IC.plus} دسته‌بندی جدید</button>
      </div>
      {showForm && (
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="text-sm text-gray-400 mb-1 block">نام</label><input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500/50" /></div>
            <div><label className="text-sm text-gray-400 mb-1 block">توضیحات</label><input type="text" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500/50" /></div>
          </div>
          <button onClick={() => { if (form.name) { addCategory(form); setShowForm(false); setForm({ name: '', image: '', description: '', order: 0, active: true }); } }} className="bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold px-6 py-3 rounded-xl">ایجاد</button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(c => (
          <div key={c.id} className="bg-white/5 rounded-2xl overflow-hidden border border-white/10">
            {c.image && <img src={c.image} alt={c.name} className="w-full h-32 object-cover" />}
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div><p className="font-bold text-white">{c.name}</p><p className="text-xs text-gray-400">{products.filter(p => p.category === c.id).length} محصول</p></div>
                <div className="flex gap-2">
                  <button onClick={() => updateCategory({ ...c, active: !c.active })} className={`w-8 h-8 rounded-lg flex items-center justify-center ${c.active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={c.active ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} /></svg>
                  </button>
                  <button onClick={() => {
                    const productsInCategory = products.filter(p => p.category === c.id);
                    if (productsInCategory.length > 0) {
                      if (confirm(`این دسته‌بندی ${productsInCategory.length} محصول دارد. با حذف آن، محصولات به دسته‌بندی دیگر منتقل می‌شوند. ادامه می‌دهید؟`)) {
                        deleteCategory(c.id);
                      }
                    } else {
                      if (confirm('حذف شود؟')) deleteCategory(c.id);
                    }
                  }} className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center text-red-400">{IC.trash}</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Notifications Management ──────────────────────────────
const NotificationsManagement: React.FC = () => {
  const { notifications, addNotification, updateNotification, deleteNotification } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', message: '', type: 'info' as Notification['type'], active: true, targetAll: true });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div><h2 className="text-2xl font-black text-white">مدیریت اعلان‌ها</h2><p className="text-gray-400 text-sm mt-1">{notifications.length} اعلان</p></div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-orange-500/30">{IC.plus} اعلان جدید</button>
      </div>
      {showForm && (
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
          <div><label className="text-sm text-gray-400 mb-1 block">عنوان</label><input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500/50" /></div>
          <div><label className="text-sm text-gray-400 mb-1 block">متن</label><textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={2} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500/50 resize-none" /></div>
          <div><label className="text-sm text-gray-400 mb-1 block">نوع</label><select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as Notification['type'] })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500/50"><option value="info">اطلاعات</option><option value="success">موفقیت</option><option value="warning">هشدار</option><option value="promo">تبلیغاتی</option></select></div>
          <button onClick={() => { if (form.title) { addNotification(form); setShowForm(false); setForm({ title: '', message: '', type: 'info', active: true, targetAll: true }); } }} className="bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold px-6 py-3 rounded-xl">ارسال اعلان</button>
        </div>
      )}
      <div className="space-y-3">
        {notifications.map(n => (
          <div key={n.id} className="bg-white/5 rounded-2xl p-5 border border-white/10 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${n.type === 'promo' ? 'bg-orange-500/20 text-orange-400' : n.type === 'success' ? 'bg-green-500/20 text-green-400' : n.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}>{IC.bell}</div>
              <div><p className="font-bold text-white">{n.title}</p><p className="text-sm text-gray-400">{n.message}</p><p className="text-xs text-gray-500 mt-1">{fd(n.createdAt)}</p></div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateNotification({ ...n, active: !n.active })} className={`px-4 py-2 rounded-xl text-sm font-bold ${n.active ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'}`}>{n.active ? 'فعال' : 'غیرفعال'}</button>
              <button onClick={() => deleteNotification(n.id)} className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center text-red-400">{IC.trash}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Activity Log ──────────────────────────────────────────
const ActivityLogSection: React.FC = () => {
  const { activityLogs } = useStore();
  const typeColors: Record<string, string> = { order: 'bg-orange-500/20 text-orange-400', product: 'bg-blue-500/20 text-blue-400', user: 'bg-purple-500/20 text-purple-400', system: 'bg-gray-500/20 text-gray-400', coupon: 'bg-green-500/20 text-green-400', review: 'bg-yellow-500/20 text-yellow-400' };

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-black text-white">لاگ فعالیت‌ها</h2><p className="text-gray-400 text-sm mt-1">{activityLogs.length} فعالیت ثبت شده</p></div>
      <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
        <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
          {activityLogs.map(log => (
            <div key={log.id} className="p-4 flex items-center gap-4 hover:bg-white/5 transition-all">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${typeColors[log.type] || typeColors.system}`}>{IC.log}</div>
              <div className="flex-1 min-w-0"><p className="font-bold text-white text-sm">{log.action}</p><p className="text-xs text-gray-400 truncate">{log.description}</p></div>
              <div className="text-xs text-gray-500 flex-shrink-0">{fd(log.timestamp)}<br />{ft(log.timestamp)}</div>
            </div>
          ))}
          {activityLogs.length === 0 && <p className="text-gray-500 text-center py-8">هنوز فعالیتی ثبت نشده</p>}
        </div>
      </div>
    </div>
  );
};

// ─── Settings ──────────────────────────────────────────────
const SettingsPanel: React.FC = () => {
  const { settings, updateSettings, resetAllData } = useStore();
  const [s, setS] = useState(settings);
  const [saved, setSaved] = useState(false);

  const save = () => { updateSettings(s); setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-black text-white">تنظیمات فروشگاه</h2><p className="text-gray-400 text-sm mt-1">پیکربندی فروشگاه</p></div>
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="text-sm text-gray-400 mb-1 block">نام فروشگاه</label><input type="text" value={s.storeName} onChange={e => setS({ ...s, storeName: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500/50" /></div>
          <div><label className="text-sm text-gray-400 mb-1 block">تلفن</label><input type="text" value={s.phone} onChange={e => setS({ ...s, phone: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500/50" /></div>
          <div><label className="text-sm text-gray-400 mb-1 block">ایمیل</label><input type="email" value={s.email} onChange={e => setS({ ...s, email: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500/50" /></div>
          <div><label className="text-sm text-gray-400 mb-1 block">ساعت کاری</label><input type="text" value={s.workingHours} onChange={e => setS({ ...s, workingHours: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500/50" /></div>
          <div><label className="text-sm text-gray-400 mb-1 block">آدرس</label><input type="text" value={s.address} onChange={e => setS({ ...s, address: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500/50" /></div>
          <div><label className="text-sm text-gray-400 mb-1 block">هزینه ارسال (تومان)</label><input type="number" value={s.deliveryFee} onChange={e => setS({ ...s, deliveryFee: +e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500/50" /></div>
          <div><label className="text-sm text-gray-400 mb-1 block">حداقل سفارش ارسال رایگان</label><input type="number" value={s.freeDeliveryMin} onChange={e => setS({ ...s, freeDeliveryMin: +e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500/50" /></div>
          <div><label className="text-sm text-gray-400 mb-1 block">وضعیت فروشگاه</label><select value={s.isOpen ? 'open' : 'closed'} onChange={e => setS({ ...s, isOpen: e.target.value === 'open' })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500/50"><option value="open">باز</option><option value="closed">بسته</option></select></div>
        </div>
        <div className="flex gap-3 pt-4">
          <button onClick={save} className="bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-orange-500/30">{saved ? '✓ ذخیره شد' : 'ذخیره تنظیمات'}</button>
          <button onClick={() => { if (confirm('تمام داده‌ها بازنشانی شود؟')) resetAllData(); }} className="bg-red-500/10 text-red-400 font-bold px-6 py-3 rounded-xl border border-red-500/20 hover:bg-red-500/20">بازنشانی کامل داده‌ها</button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Panel ────────────────────────────────────────────
const AdminPanel: React.FC<{ onLogout: () => void; onBack: () => void }> = ({ onLogout, onBack }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'داشبورد', icon: IC.dashboard },
    { id: 'products', label: 'محصولات', icon: IC.products },
    { id: 'orders', label: 'سفارشات', icon: IC.orders },
    { id: 'users', label: 'کاربران', icon: IC.users },
    { id: 'coupons', label: 'کوپن‌ها', icon: IC.coupon },
    { id: 'reviews', label: 'نظرات', icon: IC.review },
    { id: 'categories', label: 'دسته‌بندی‌ها', icon: IC.category },
    { id: 'notifications', label: 'اعلان‌ها', icon: IC.bell },
    { id: 'activity', label: 'لاگ فعالیت', icon: IC.log },
    { id: 'settings', label: 'تنظیمات', icon: IC.settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardOverview />;
      case 'products': return <ProductsManagement />;
      case 'orders': return <OrdersManagement />;
      case 'users': return <UsersManagement />;
      case 'coupons': return <CouponsManagement />;
      case 'reviews': return <ReviewsManagement />;
      case 'categories': return <CategoriesManagement />;
      case 'notifications': return <NotificationsManagement />;
      case 'activity': return <ActivityLogSection />;
      case 'settings': return <SettingsPanel />;
      default: return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {sidebarOpen && <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed top-0 right-0 h-screen w-64 bg-gradient-to-b from-gray-900 to-black border-l border-white/10 z-50 transition-all duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30"><span className="text-white font-black text-lg">B</span></div>
              <div><h1 className="font-black text-white text-sm">پنل مدیریت</h1><p className="text-[10px] text-gray-500">برگرلند</p></div>
            </div>
          </div>
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${activeTab === tab.id ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}>
                <span className="flex-shrink-0">{tab.icon}</span><span className="truncate">{tab.label}</span>
              </button>
            ))}
          </nav>
          <div className="p-4 border-t border-white/10 space-y-2">
            <button onClick={onBack} className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all">{IC.back}<span>بازگشت به سایت</span></button>
            <button onClick={onLogout} className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all">{IC.close}<span>خروج</span></button>
          </div>
        </div>
      </aside>

      <main className="lg:mr-64">
        <div className="z-30 bg-black/90 backdrop-blur-xl border-b border-white/10">
          <div className="px-4 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white hover:bg-white/10">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>
                <h2 className="text-lg font-bold text-white">{tabs.find(t => t.id === activeTab)?.label}</h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 bg-green-500/10 text-green-400 px-3 py-1.5 rounded-lg border border-green-500/20 text-xs font-bold"><span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /><span>آنلاین</span></div>
                <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-orange-500/30">A</div>
              </div>
            </div>
          </div>
        </div>
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

export const AdminRouter: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('admin_logged_in') === 'true');
  if (!isLoggedIn) return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;
  return <AdminPanel onLogout={() => { localStorage.removeItem('admin_logged_in'); setIsLoggedIn(false); }} onBack={() => window.location.hash = ''} />;
};
