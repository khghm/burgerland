import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
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
  createdAt: string;
  note?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'staff' | 'customer';
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin?: string;
  ordersCount: number;
  totalSpent: number;
}

export interface StoreState {
  products: Product[];
  orders: Order[];
  users: User[];
  settings: {
    storeName: string;
    phone: string;
    address: string;
    deliveryFee: number;
    freeDeliveryMin: number;
    taxPercent: number;
    currency: string;
    isOpen: boolean;
    openTime: string;
    closeTime: string;
  };
}

interface StoreContextType extends StoreState {
  // Products
  addProduct: (p: Product) => void;
  updateProduct: (id: number, p: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  // Orders
  addOrder: (o: Omit<Order, 'id' | 'createdAt'>) => string;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  deleteOrder: (id: string) => void;
  // Users
  addUser: (u: User) => void;
  updateUser: (id: string, u: Partial<User>) => void;
  deleteUser: (id: string) => void;
  // Settings
  updateSettings: (s: Partial<StoreState['settings']>) => void;
  // Reset
  resetAll: () => void;
  // Analytics
  getAnalytics: () => {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalUsers: number;
    avgOrderValue: number;
    pendingOrders: number;
    completedOrders: number;
    revenueByDay: { date: string; revenue: number }[];
    ordersByStatus: { status: string; count: number }[];
    topProducts: { name: string; count: number }[];
  };
}

const StoreContext = createContext<StoreContextType | null>(null);

// ─── Storage Helpers ───────────────────────────────────────
const STORAGE_KEY = 'burgerland_store';

const loadState = (): StoreState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    products: initialProducts,
    orders: generateSampleOrders(),
    users: generateSampleUsers(),
    settings: {
      storeName: 'برگرلند',
      phone: '۰۲۱-۱۲۳۴۵۶۷۸',
      address: 'تهران، خیابان ولیعصر، پلاک ۱۲۳',
      deliveryFee: 35000,
      freeDeliveryMin: 500000,
      taxPercent: 9,
      currency: 'تومان',
      isOpen: true,
      openTime: '11:00',
      closeTime: '00:00',
    },
  };
};

const saveState = (state: StoreState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
};

// ─── Sample Data ───────────────────────────────────────────
function generateSampleOrders(): Order[] {
  const statuses: Order['status'][] = ['pending', 'preparing', 'delivering', 'completed', 'cancelled'];
  const names = ['علی محمدی', 'مریم احمدی', 'رضا کریمی', 'زهرا حسینی', 'امیر رضایی', 'فاطمه نوری', 'حسین صادقی', 'نرگس موسوی'];
  const orders: Order[] = [];
  
  for (let i = 0; i < 24; i++) {
    const itemCount = Math.floor(Math.random() * 3) + 1;
    const items: CartItem[] = [];
    for (let j = 0; j < itemCount; j++) {
      const p = initialProducts[Math.floor(Math.random() * initialProducts.length)];
      items.push({ ...p, quantity: Math.floor(Math.random() * 2) + 1 });
    }
    const total = items.reduce((s, it) => s + it.price * it.quantity, 0);
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    date.setHours(Math.floor(Math.random() * 12) + 10);
    
    orders.push({
      id: `ORD-${1000 + i}`,
      items,
      total,
      deliveryFee: total > 500000 ? 0 : 35000,
      customerName: names[Math.floor(Math.random() * names.length)],
      customerPhone: `۰۹۱۲${String(Math.floor(Math.random() * 90000000) + 10000000)}`,
      customerAddress: 'تهران، منطقه ' + (Math.floor(Math.random() * 22) + 1),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      paymentStatus: Math.random() > 0.1 ? 'paid' : 'pending',
      createdAt: date.toISOString(),
    });
  }
  return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

function generateSampleUsers(): User[] {
  const users: User[] = [
    { id: 'U-1', name: 'علی محمدی', email: 'ali@example.com', phone: '۰۹۱۲۱۲۳۴۵۶۷', role: 'admin', status: 'active', createdAt: '2024-01-15', lastLogin: '2025-01-20', ordersCount: 45, totalSpent: 12500000 },
    { id: 'U-2', name: 'مریم احمدی', email: 'maryam@example.com', phone: '۰۹۱۲۲۳۴۵۶۷۸', role: 'customer', status: 'active', createdAt: '2024-03-10', lastLogin: '2025-01-19', ordersCount: 23, totalSpent: 6800000 },
    { id: 'U-3', name: 'رضا کریمی', email: 'reza@example.com', phone: '۰۹۱۲۳۴۵۶۷۸۹', role: 'customer', status: 'active', createdAt: '2024-05-22', lastLogin: '2025-01-18', ordersCount: 12, totalSpent: 3400000 },
    { id: 'U-4', name: 'زهرا حسینی', email: 'zahra@example.com', phone: '۰۹۱۲۴۵۶۷۸۹۰', role: 'staff', status: 'active', createdAt: '2024-02-01', lastLogin: '2025-01-20', ordersCount: 0, totalSpent: 0 },
    { id: 'U-5', name: 'امیر رضایی', email: 'amir@example.com', phone: '۰۹۱۲۵۶۷۸۹۰۱', role: 'customer', status: 'inactive', createdAt: '2024-06-15', lastLogin: '2024-12-01', ordersCount: 5, totalSpent: 1200000 },
    { id: 'U-6', name: 'فاطمه نوری', email: 'fatemeh@example.com', phone: '۰۹۱۲۶۷۸۹۰۱۲', role: 'customer', status: 'active', createdAt: '2024-07-20', lastLogin: '2025-01-17', ordersCount: 18, totalSpent: 5600000 },
  ];
  return users;
}

// ─── Provider ──────────────────────────────────────────────
export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<StoreState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  // Products
  const addProduct = useCallback((p: Product) => {
    setState(s => ({ ...s, products: [...s.products, { ...p, id: Math.max(...s.products.map(x => x.id)) + 1 }] }));
  }, []);

  const updateProduct = useCallback((id: number, updates: Partial<Product>) => {
    setState(s => ({ ...s, products: s.products.map(p => p.id === id ? { ...p, ...updates } : p) }));
  }, []);

  const deleteProduct = useCallback((id: number) => {
    setState(s => ({ ...s, products: s.products.filter(p => p.id !== id) }));
  }, []);

  // Orders
  const addOrder = useCallback((o: Omit<Order, 'id' | 'createdAt'>): string => {
    const id = `ORD-${Date.now().toString().slice(-6)}`;
    const order: Order = { ...o, id, createdAt: new Date().toISOString() };
    setState(s => ({ ...s, orders: [order, ...s.orders] }));
    return id;
  }, []);

  const updateOrderStatus = useCallback((id: string, status: Order['status']) => {
    setState(s => ({ ...s, orders: s.orders.map(o => o.id === id ? { ...o, status } : o) }));
  }, []);

  const deleteOrder = useCallback((id: string) => {
    setState(s => ({ ...s, orders: s.orders.filter(o => o.id !== id) }));
  }, []);

  // Users
  const addUser = useCallback((u: User) => {
    setState(s => ({ ...s, users: [...s.users, u] }));
  }, []);

  const updateUser = useCallback((id: string, updates: Partial<User>) => {
    setState(s => ({ ...s, users: s.users.map(u => u.id === id ? { ...u, ...updates } : u) }));
  }, []);

  const deleteUser = useCallback((id: string) => {
    setState(s => ({ ...s, users: s.users.filter(u => u.id !== id) }));
  }, []);

  // Settings
  const updateSettings = useCallback((updates: Partial<StoreState['settings']>) => {
    setState(s => ({ ...s, settings: { ...s.settings, ...updates } }));
  }, []);

  // Reset
  const resetAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState(loadState());
  }, []);

  // Analytics
  const getAnalytics = useCallback(() => {
    const { orders, products, users } = state;
    const completedOrders = orders.filter(o => o.status === 'completed');
    const totalRevenue = completedOrders.reduce((s, o) => s + o.total, 0);
    const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'preparing').length;
    
    // Revenue by day (last 7 days)
    const revenueByDay: { date: string; revenue: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayRevenue = orders
        .filter(o => o.createdAt.startsWith(dateStr) && o.status === 'completed')
        .reduce((s, o) => s + o.total, 0);
      revenueByDay.push({ date: dateStr, revenue: dayRevenue });
    }
    
    // Orders by status
    const statusMap: Record<string, number> = {};
    orders.forEach(o => { statusMap[o.status] = (statusMap[o.status] || 0) + 1; });
    const ordersByStatus = Object.entries(statusMap).map(([status, count]) => ({ status, count }));
    
    // Top products
    const productCount: Record<string, number> = {};
    orders.forEach(o => o.items.forEach(it => {
      productCount[it.name] = (productCount[it.name] || 0) + it.quantity;
    }));
    const topProducts = Object.entries(productCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    return {
      totalRevenue,
      totalOrders: orders.length,
      totalProducts: products.length,
      totalUsers: users.length,
      avgOrderValue: completedOrders.length ? Math.round(totalRevenue / completedOrders.length) : 0,
      pendingOrders,
      completedOrders: completedOrders.length,
      revenueByDay,
      ordersByStatus,
      topProducts,
    };
  }, [state]);

  return (
    <StoreContext.Provider value={{
      ...state,
      addProduct, updateProduct, deleteProduct,
      addOrder, updateOrderStatus, deleteOrder,
      addUser, updateUser, deleteUser,
      updateSettings, resetAll, getAnalytics,
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
