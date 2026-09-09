import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem } from '../types';
import { products as initialProducts } from '../data';

// ─── Types ─────────────────────────────────────────────────
export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  deliveryFee: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  status: 'pending' | 'preparing' | 'delivering' | 'completed' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'failed';
  couponCode?: string;
  discount?: number;
  note?: string;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  type: 'percent' | 'fixed';
  minOrder: number;
  maxUses: number;
  usedCount: number;
  active: boolean;
  expiresAt: string;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: number;
  productName: string;
  userName: string;
  userRole: string;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  description: string;
  order: number;
  active: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'promo';
  active: boolean;
  targetAll: boolean;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  description: string;
  type: 'order' | 'product' | 'user' | 'system' | 'coupon' | 'review';
  timestamp: string;
}

export interface SiteSettings {
  storeName: string;
  phone: string;
  email: string;
  address: string;
  deliveryFee: number;
  freeDeliveryMin: number;
  workingHours: string;
  isOpen: boolean;
  currency: string;
}

interface StoreState {
  products: Product[];
  orders: Order[];
  coupons: Coupon[];
  reviews: Review[];
  categories: Category[];
  notifications: Notification[];
  activityLogs: ActivityLog[];
  settings: SiteSettings;
  users: { id: string; name: string; email: string; phone: string; orderCount: number; totalSpent: number; joinedAt: string; active: boolean }[];
}

interface StoreContextType extends StoreState {
  // Products
  addProduct: (p: Product) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (id: number) => void;
  // Orders
  addOrder: (o: Omit<Order, 'id' | 'createdAt'>) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  deleteOrder: (id: string) => void;
  // Coupons
  addCoupon: (c: Omit<Coupon, 'id' | 'createdAt' | 'usedCount'>) => void;
  updateCoupon: (c: Coupon) => void;
  deleteCoupon: (id: string) => void;
  validateCoupon: (code: string, orderTotal: number) => { valid: boolean; discount: number; message: string };
  // Reviews
  addReview: (r: Omit<Review, 'id' | 'createdAt'>) => void;
  approveReview: (id: string) => void;
  deleteReview: (id: string) => void;
  // Categories
  addCategory: (c: Omit<Category, 'id'>) => void;
  updateCategory: (c: Category) => void;
  deleteCategory: (id: string) => void;
  // Notifications
  addNotification: (n: Omit<Notification, 'id' | 'createdAt'>) => void;
  updateNotification: (n: Notification) => void;
  deleteNotification: (id: string) => void;
  // Activity
  addActivityLog: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
  // Settings
  updateSettings: (s: Partial<SiteSettings>) => void;
  // Users
  toggleUserStatus: (id: string) => void;
  deleteUser: (id: string) => void;
  // Reset
  resetAllData: () => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

// ─── Helpers ───────────────────────────────────────────────
const genId = () => Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
const now = () => new Date().toISOString();

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch { return fallback; }
}

const saveToStorage = (key: string, data: unknown) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// ─── Default Data ──────────────────────────────────────────
const defaultCategories: Category[] = [
  { id: 'burger', name: 'برگر', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80', description: 'انواع برگرهای خوشمزه', order: 1, active: true },
  { id: 'pizza', name: 'پیتزا', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80', description: 'پیتزاهای ایتالیایی', order: 2, active: true },
  { id: 'chicken', name: 'مرغ سوخاری', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&q=80', description: 'مرغ سوخاری کریسپی', order: 3, active: true },
  { id: 'sandwich', name: 'ساندویچ', image: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=400&q=80', description: 'ساندویچ‌های ویژه', order: 4, active: true },
  { id: 'drink', name: 'نوشیدنی', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80', description: 'انواع نوشیدنی', order: 5, active: true },
  { id: 'dessert', name: 'دسر', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&q=80', description: 'دسرهای خوشمزه', order: 6, active: true },
  { id: 'sides', name: 'پیش‌غذا', image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&q=80', description: 'پیش‌غذاهای متنوع', order: 7, active: true },
];

const defaultSettings: SiteSettings = {
  storeName: 'برگرلند',
  phone: '۰۲۱-۱۲۳۴۵۶۷۸',
  email: 'info@burgerland.ir',
  address: 'تهران، خیابان ولیعصر، پلاک ۱۲۳',
  deliveryFee: 35000,
  freeDeliveryMin: 500000,
  workingHours: 'هر روز ۱۱ صبح تا ۱۲ شب',
  isOpen: true,
  currency: 'تومان',
};

const defaultCoupons: Coupon[] = [
  { id: 'c1', code: 'WELCOME20', discount: 20, type: 'percent', minOrder: 100000, maxUses: 100, usedCount: 12, active: true, expiresAt: '2026-06-30', createdAt: '2026-01-01T00:00:00Z' },
  { id: 'c2', code: 'FREESHIP', discount: 35000, type: 'fixed', minOrder: 300000, maxUses: 50, usedCount: 8, active: true, expiresAt: '2026-06-30', createdAt: '2026-01-05T00:00:00Z' },
  { id: 'c3', code: 'FOOD50', discount: 50000, type: 'fixed', minOrder: 200000, maxUses: 30, usedCount: 30, active: false, expiresAt: '2026-03-01', createdAt: '2025-12-01T00:00:00Z' },
];

const defaultReviews: Review[] = [
  { id: 'r1', productId: 1, productName: 'دبل چیزبرگر کلاسیک', userName: 'علی محمدی', userRole: 'مشتری وفادار', rating: 5, comment: 'بهترین برگری که تا حالا خوردم. کیفیت مواد اولیه واقعاً فوق‌العاده‌ست.', approved: true, createdAt: '2026-01-10T10:30:00Z' },
  { id: 'r2', productId: 4, productName: 'پیتزا پپرونی ایتالیایی', userName: 'سارا احمدی', userRole: 'بلاگر غذا', rating: 5, comment: 'پیتزاشون واقعاً حرف نداره. خمیر دست‌ساز و مواد تازه.', approved: true, createdAt: '2026-01-12T14:20:00Z' },
  { id: 'r3', productId: 6, productName: 'چیکن استریپس کریسپی', userName: 'رضا کریمی', userRole: 'مشتری دائمی', rating: 4, comment: 'مرغ سوخاری خوبی بود ولی کاش تندتر بود.', approved: false, createdAt: '2026-01-14T18:45:00Z' },
  { id: 'r4', productId: 11, productName: 'میلک‌شیک شکلات بلژیکی', userName: 'مریم حسینی', userRole: 'مشتری جدید', rating: 5, comment: 'میلک‌شیک فوق‌العاده غلیظ و خوشمزه!', approved: true, createdAt: '2026-01-15T20:10:00Z' },
];

const defaultNotifications: Notification[] = [
  { id: 'n1', title: 'تخفیف ویژه عید', message: '۲۰٪ تخفیف روی همه محصولات با کد WELCOME20', type: 'promo', active: true, targetAll: true, createdAt: '2026-01-01T08:00:00Z' },
  { id: 'n2', title: 'ارسال رایگان', message: 'ارسال رایگان برای سفارش‌های بالای ۵۰۰ هزار تومان', type: 'info', active: true, targetAll: true, createdAt: '2026-01-05T09:00:00Z' },
  { id: 'n3', title: 'محصول جدید', message: 'استیک ساندویچ پریمیوم به منو اضافه شد', type: 'success', active: true, targetAll: true, createdAt: '2026-01-10T12:00:00Z' },
];

const defaultUsers = [
  { id: 'u1', name: 'علی محمدی', email: 'ali@example.com', phone: '۰۹۱۲۱۲۳۴۵۶۷', orderCount: 15, totalSpent: 4250000, joinedAt: '2025-06-15T00:00:00Z', active: true },
  { id: 'u2', name: 'سارا احمدی', email: 'sara@example.com', phone: '۰۹۱۲۹۸۷۶۵۴۳', orderCount: 8, totalSpent: 2180000, joinedAt: '2025-08-20T00:00:00Z', active: true },
  { id: 'u3', name: 'رضا کریمی', email: 'reza@example.com', phone: '۰۹۱۲۵۵۵۱۲۳۴', orderCount: 23, totalSpent: 6750000, joinedAt: '2025-03-10T00:00:00Z', active: true },
  { id: 'u4', name: 'مریم حسینی', email: 'maryam@example.com', phone: '۰۹۱۲۷۷۷۸۸۹۹', orderCount: 3, totalSpent: 890000, joinedAt: '2026-01-05T00:00:00Z', active: true },
  { id: 'u5', name: 'حسن رضایی', email: 'hasan@example.com', phone: '۰۹۱۲۳۳۳۴۴۵۵', orderCount: 0, totalSpent: 0, joinedAt: '2026-01-12T00:00:00Z', active: false },
];

// ─── Provider ──────────────────────────────────────────────
export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => loadFromStorage('bl_products', initialProducts));
  const [orders, setOrders] = useState<Order[]>(() => loadFromStorage('bl_orders', []));
  const [coupons, setCoupons] = useState<Coupon[]>(() => loadFromStorage('bl_coupons', defaultCoupons));
  const [reviews, setReviews] = useState<Review[]>(() => loadFromStorage('bl_reviews', defaultReviews));
  const [categories, setCategories] = useState<Category[]>(() => loadFromStorage('bl_categories', defaultCategories));
  const [notifications, setNotifications] = useState<Notification[]>(() => loadFromStorage('bl_notifications', defaultNotifications));
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => loadFromStorage('bl_activity', []));
  const [settings, setSettings] = useState<SiteSettings>(() => loadFromStorage('bl_settings', defaultSettings));
  const [users, setUsers] = useState(() => loadFromStorage('bl_users', defaultUsers));

  // Persist
  useEffect(() => saveToStorage('bl_products', products), [products]);
  useEffect(() => saveToStorage('bl_orders', orders), [orders]);
  useEffect(() => saveToStorage('bl_coupons', coupons), [coupons]);
  useEffect(() => saveToStorage('bl_reviews', reviews), [reviews]);
  useEffect(() => saveToStorage('bl_categories', categories), [categories]);
  useEffect(() => saveToStorage('bl_notifications', notifications), [notifications]);
  useEffect(() => saveToStorage('bl_activity', activityLogs), [activityLogs]);
  useEffect(() => saveToStorage('bl_settings', settings), [settings]);
  useEffect(() => saveToStorage('bl_users', users), [users]);

  const addLog = (action: string, description: string, type: ActivityLog['type']) => {
    setActivityLogs(prev => [{ id: genId(), action, description, type, timestamp: now() }, ...prev].slice(0, 200));
  };

  // Products
  const addProduct = (p: Product) => { setProducts(prev => [...prev, { ...p, id: Math.max(...prev.map(x => x.id), 0) + 1 }]); addLog('افزودن محصول', `${p.name} اضافه شد`, 'product'); };
  const updateProduct = (p: Product) => { setProducts(prev => prev.map(x => x.id === p.id ? p : x)); addLog('ویرایش محصول', `${p.name} ویرایش شد`, 'product'); };
  const deleteProduct = (id: number) => { const p = products.find(x => x.id === id); setProducts(prev => prev.filter(x => x.id !== id)); if (p) addLog('حذف محصول', `${p.name} حذف شد`, 'product'); };

  // Orders
  const addOrder = (o: Omit<Order, 'id' | 'createdAt'>) => {
    const order: Order = { ...o, id: genId(), createdAt: now() };
    setOrders(prev => [order, ...prev]);
    // If coupon was used, increment usage
    if (o.couponCode) {
      setCoupons(prev => prev.map(c => c.code === o.couponCode ? { ...c, usedCount: c.usedCount + 1 } : c));
    }
    // Add to user stats
    setUsers(prev => {
      const existing = prev.find(u => u.phone === o.customerPhone);
      if (existing) return prev.map(u => u.phone === o.customerPhone ? { ...u, orderCount: u.orderCount + 1, totalSpent: u.totalSpent + o.total } : u);
      return [...prev, { id: genId(), name: o.customerName, email: '', phone: o.customerPhone, orderCount: 1, totalSpent: o.total, joinedAt: now(), active: true }];
    });
    addLog('سفارش جدید', `${o.customerName} سفارش ${o.total.toLocaleString()} تومانی ثبت کرد`, 'order');
  };
  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    const labels: Record<string, string> = { pending: 'در انتظار', preparing: 'در حال آماده‌سازی', delivering: 'در حال ارسال', completed: 'تکمیل شده', cancelled: 'لغو شده' };
    addLog('تغییر وضعیت سفارش', `سفارش #${id.slice(0, 6)} به "${labels[status]}" تغییر کرد`, 'order');
  };
  const deleteOrder = (id: string) => { setOrders(prev => prev.filter(o => o.id !== id)); addLog('حذف سفارش', `سفارش #${id.slice(0, 6)} حذف شد`, 'order'); };

  // Coupons
  const addCoupon = (c: Omit<Coupon, 'id' | 'createdAt' | 'usedCount'>) => {
    const coupon: Coupon = { ...c, id: genId(), usedCount: 0, createdAt: now() };
    setCoupons(prev => [...prev, coupon]);
    addLog('افزودن کوپن', `کوپن ${c.code} ایجاد شد`, 'coupon');
  };
  const updateCoupon = (c: Coupon) => { setCoupons(prev => prev.map(x => x.id === c.id ? c : x)); addLog('ویرایش کوپن', `کوپن ${c.code} ویرایش شد`, 'coupon'); };
  const deleteCoupon = (id: string) => { const c = coupons.find(x => x.id === id); setCoupons(prev => prev.filter(x => x.id !== id)); if (c) addLog('حذف کوپن', `کوپن ${c.code} حذف شد`, 'coupon'); };
  const validateCoupon = (code: string, orderTotal: number) => {
    const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase());
    if (!coupon) return { valid: false, discount: 0, message: 'کد تخفیف نامعتبر است' };
    if (!coupon.active) return { valid: false, discount: 0, message: 'این کد تخفیف غیرفعال است' };
    if (new Date(coupon.expiresAt) < new Date()) return { valid: false, discount: 0, message: 'تاریخ انقضای این کد گذشته است' };
    if (coupon.usedCount >= coupon.maxUses) return { valid: false, discount: 0, message: 'ظرفیت استفاده از این کد تکمیل شده' };
    if (orderTotal < coupon.minOrder) return { valid: false, discount: 0, message: `حداقل سفارش ${coupon.minOrder.toLocaleString()} تومان است` };
    const discount = coupon.type === 'percent' ? Math.round(orderTotal * coupon.discount / 100) : coupon.discount;
    return { valid: true, discount, message: `تخفیف ${discount.toLocaleString()} تومانی اعمال شد` };
  };

  // Reviews
  const addReview = (r: Omit<Review, 'id' | 'createdAt'>) => {
    const review: Review = { ...r, id: genId(), createdAt: now() };
    setReviews(prev => [...prev, review]);
    addLog('نظر جدید', `نظر "${r.userName}" برای ${r.productName} ثبت شد`, 'review');
  };
  const approveReview = (id: string) => { setReviews(prev => prev.map(r => r.id === id ? { ...r, approved: !r.approved } : r)); };
  const deleteReview = (id: string) => { setReviews(prev => prev.filter(r => r.id !== id)); };

  // Categories
  const addCategory = (c: Omit<Category, 'id'>) => {
    const cat: Category = { ...c, id: genId() };
    setCategories(prev => [...prev, cat]);
    addLog('افزودن دسته‌بندی', `دسته‌بندی "${c.name}" اضافه شد`, 'product');
  };
  const updateCategory = (c: Category) => { setCategories(prev => prev.map(x => x.id === c.id ? c : x)); addLog('ویرایش دسته‌بندی', `دسته‌بندی "${c.name}" ویرایش شد`, 'product'); };
  const deleteCategory = (id: string) => {
    const c = categories.find(x => x.id === id);
    const productsInCategory = products.filter(p => p.category === id);
    
    if (productsInCategory.length > 0) {
      // Move products to first available active category
      const fallbackCategory = categories.find(cat => cat.id !== id && cat.active)?.id || 'uncategorized';
      setProducts(prev => prev.map(p => p.category === id ? { ...p, category: fallbackCategory } : p));
      addLog('حذف دسته‌بندی', `دسته‌بندی "${c?.name}" حذف شد و ${productsInCategory.length} محصول منتقل شدند`, 'product');
    } else {
      addLog('حذف دسته‌بندی', `دسته‌بندی "${c?.name}" حذف شد`, 'product');
    }
    
    setCategories(prev => prev.filter(x => x.id !== id));
  };

  // Notifications
  const addNotification = (n: Omit<Notification, 'id' | 'createdAt'>) => {
    const notif: Notification = { ...n, id: genId(), createdAt: now() };
    setNotifications(prev => [...prev, notif]);
    addLog('اعلان جدید', `"${n.title}" منتشر شد`, 'system');
  };
  const updateNotification = (n: Notification) => { setNotifications(prev => prev.map(x => x.id === n.id ? n : x)); };
  const deleteNotification = (id: string) => { setNotifications(prev => prev.filter(x => x.id !== id)); };

  // Activity
  const addActivityLog = (log: Omit<ActivityLog, 'id' | 'timestamp'>) => {
    setActivityLogs(prev => [{ ...log, id: genId(), timestamp: now() }, ...prev].slice(0, 200));
  };

  // Settings
  const updateSettings = (s: Partial<SiteSettings>) => { setSettings(prev => ({ ...prev, ...s })); addLog('تغییر تنظیمات', 'تنظیمات فروشگاه به‌روزرسانی شد', 'system'); };

  // Users
  const toggleUserStatus = (id: string) => { setUsers(prev => prev.map(u => u.id === id ? { ...u, active: !u.active } : u)); };
  const deleteUser = (id: string) => { setUsers(prev => prev.filter(u => u.id !== id)); };

  // Reset
  const resetAllData = () => {
    setProducts(initialProducts);
    setOrders([]);
    setCoupons(defaultCoupons);
    setReviews(defaultReviews);
    setCategories(defaultCategories);
    setNotifications(defaultNotifications);
    setActivityLogs([]);
    setSettings(defaultSettings);
    setUsers(defaultUsers);
  };

  return (
    <StoreContext.Provider value={{
      products, orders, coupons, reviews, categories, notifications, activityLogs, settings, users,
      addProduct, updateProduct, deleteProduct,
      addOrder, updateOrderStatus, deleteOrder,
      addCoupon, updateCoupon, deleteCoupon, validateCoupon,
      addReview, approveReview, deleteReview,
      addCategory, updateCategory, deleteCategory,
      addNotification, updateNotification, deleteNotification,
      addActivityLog,
      updateSettings,
      toggleUserStatus, deleteUser,
      resetAllData,
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
};
