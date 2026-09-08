import React, { useState, useEffect, useRef } from 'react';
import { Product, CartItem, Category } from './types';
import { products, categories, testimonials } from './data';

// ─── Utility ───────────────────────────────────────────────
const formatPrice = (price: number) =>
  new Intl.NumberFormat('fa-IR').format(price);

// ─── Header ────────────────────────────────────────────────
const Header: React.FC<{
  cartCount: number;
  onCartOpen: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}> = ({ cartCount, onCartOpen, searchQuery, onSearchChange }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass shadow-lg shadow-black/5' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-dark-900 rounded-xl flex items-center justify-center">
              <span className="text-brand-500 font-black text-lg">B</span>
            </div>
            <div>
              <h1 className="font-black text-lg text-dark-900 leading-none">برگرلند</h1>
              <p className="text-[10px] text-dark-400 font-medium">BURGER LAND</p>
            </div>
          </div>

          {/* Search - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="جستجوی غذا..."
                className="w-full bg-dark-50 border border-dark-100 rounded-xl py-2.5 px-4 pr-10 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
              />
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button className="hidden md:flex items-center gap-2 text-sm font-medium text-dark-600 hover:text-dark-900 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>حساب من</span>
            </button>
            <button
              onClick={onCartOpen}
              className="relative flex items-center gap-2 bg-dark-900 text-white px-4 py-2.5 rounded-xl hover:bg-dark-800 transition-all active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="text-sm font-bold hidden sm:inline">سبد خرید</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-brand-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="جستجوی غذا..."
              className="w-full bg-dark-50 border border-dark-100 rounded-xl py-2.5 px-4 pr-10 text-sm outline-none focus:border-brand-500 transition-all"
            />
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
};

// ─── Hero Section ──────────────────────────────────────────
const HeroSection: React.FC = () => (
  <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-dark-900">
    {/* Background */}
    <div className="absolute inset-0">
      <img
        src="https://images.unsplash.com/photo-1550547660-d9450f859349?w=1920&q=80"
        alt="Hero"
        className="w-full h-full object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-l from-dark-900 via-dark-900/80 to-dark-900/40" />
    </div>

    {/* Content */}
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 bg-brand-500/20 border border-brand-500/30 rounded-full px-4 py-1.5 mb-6">
          <span className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
          <span className="text-brand-400 text-sm font-medium">ارسال رایگان برای سفارش‌های بالای ۵۰۰ هزار تومان</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-tight mb-6">
          طعم واقعی
          <br />
          <span className="text-brand-500">فست‌فود خانگی</span>
        </h1>

        <p className="text-lg text-dark-300 leading-relaxed mb-8 max-w-lg">
          با بهترین مواد اولیه و دستور پخت‌های اصیل، تجربه‌ای متفاوت از فست‌فود را به شما هدیه می‌دهیم.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="#menu"
            className="inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-bold px-8 py-4 rounded-xl transition-all active:scale-95 shadow-lg shadow-brand-500/30"
          >
            مشاهده منو
            <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <a
            href="#about"
            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl border border-white/20 transition-all"
          >
            درباره ما
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/10">
          <div>
            <p className="text-3xl font-black text-white">+۱۰</p>
            <p className="text-sm text-dark-400 mt-1">سال تجربه</p>
          </div>
          <div>
            <p className="text-3xl font-black text-white">+۵۰K</p>
            <p className="text-sm text-dark-400 mt-1">مشتری راضی</p>
          </div>
          <div>
            <p className="text-3xl font-black text-white">۴.۹</p>
            <p className="text-sm text-dark-400 mt-1">امتیاز کاربران</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ─── Category Bar ──────────────────────────────────────────
const CategoryBar: React.FC<{
  categories: Category[];
  active: string;
  onChange: (id: string) => void;
}> = ({ categories, active, onChange }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={scrollRef} className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-2">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={`flex items-center gap-3 px-5 py-3 rounded-2xl whitespace-nowrap transition-all duration-300 ${
            active === cat.id
              ? 'bg-dark-900 text-white shadow-lg'
              : 'bg-white text-dark-600 hover:bg-dark-50 border border-dark-100'
          }`}
        >
          <div className={`w-8 h-8 rounded-lg overflow-hidden ${active === cat.id ? 'ring-2 ring-brand-500' : ''}`}>
            <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
          </div>
          <span className="font-bold text-sm">{cat.name}</span>
        </button>
      ))}
    </div>
  );
};

// ─── Product Card ──────────────────────────────────────────
const ProductCard: React.FC<{
  product: Product;
  onAdd: (p: Product) => void;
  onView: (p: Product) => void;
}> = ({ product, onAdd, onView }) => {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-dark-100 hover:border-dark-200 hover:shadow-xl hover:shadow-black/5 transition-all duration-500">
      {/* Image */}
      <div
        className="relative h-52 overflow-hidden cursor-pointer"
        onClick={() => onView(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          {product.isPopular && (
            <span className="bg-brand-500 text-white text-[10px] font-bold px-2 py-1 rounded-md">
              پرفروش
            </span>
          )}
          {product.isNew && (
            <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-md">
              جدید
            </span>
          )}
        </div>

        {discount > 0 && (
          <div className="absolute top-3 left-3">
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md">
              {discount}%-
            </span>
          </div>
        )}

        {/* Quick add */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={(e) => { e.stopPropagation(); onAdd(product); }}
            className="w-full bg-white/95 backdrop-blur text-dark-900 text-sm font-bold py-2.5 rounded-xl hover:bg-white transition-colors shadow-lg"
          >
            افزودن به سبد
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-1.5 mb-2">
          <svg className="w-3.5 h-3.5 text-amber-400 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-xs font-bold text-dark-700">{product.rating}</span>
          <span className="text-xs text-dark-400">({formatPrice(product.reviews)})</span>
        </div>

        <h3 className="font-bold text-dark-900 text-sm mb-1">{product.name}</h3>
        <p className="text-xs text-dark-400 line-clamp-2 leading-relaxed mb-3">
          {product.description}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-dark-50">
          <div>
            {product.originalPrice && (
              <span className="text-xs text-dark-300 line-through block">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            <span className="font-black text-dark-900 text-lg">
              {formatPrice(product.price)}
            </span>
            <span className="text-xs text-dark-400 mr-1">تومان</span>
          </div>
          <button
            onClick={() => onAdd(product)}
            className="w-9 h-9 bg-dark-900 hover:bg-brand-500 rounded-xl flex items-center justify-center text-white transition-all active:scale-90"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Product Modal ─────────────────────────────────────────
const ProductModal: React.FC<{
  product: Product | null;
  onClose: () => void;
  onAdd: (p: Product) => void;
}> = ({ product, onClose, onAdd }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fadeIn">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-10 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image */}
        <div className="relative h-64 sm:h-80 overflow-hidden rounded-t-3xl">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="text-2xl font-black text-dark-900">{product.name}</h2>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-bold text-sm">{product.rating}</span>
                </div>
                <span className="text-dark-300">|</span>
                <span className="text-sm text-dark-500">{formatPrice(product.reviews)} نظر</span>
              </div>
            </div>
            <div className="text-left">
              {product.originalPrice && (
                <span className="text-sm text-dark-300 line-through block">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              <span className="text-2xl font-black text-dark-900">
                {formatPrice(product.price)}
              </span>
              <span className="text-sm text-dark-400"> تومان</span>
            </div>
          </div>

          <p className="text-dark-500 leading-relaxed mb-6">{product.description}</p>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {product.calories && (
              <div className="bg-dark-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-black text-dark-900">{product.calories}</p>
                <p className="text-xs text-dark-400 mt-1">کالری</p>
              </div>
            )}
            {product.prepTime && (
              <div className="bg-dark-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-black text-dark-900">{product.prepTime}</p>
                <p className="text-xs text-dark-400 mt-1">زمان آماده‌سازی</p>
              </div>
            )}
          </div>

          {/* Ingredients */}
          {product.ingredients && (
            <div className="mb-6">
              <h3 className="font-bold text-dark-900 mb-3 text-sm">مواد تشکیل‌دهنده</h3>
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((ing, i) => (
                  <span key={i} className="bg-dark-50 text-dark-600 text-xs px-3 py-1.5 rounded-lg font-medium">
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart */}
          <button
            onClick={() => { onAdd(product); onClose(); }}
            className="w-full bg-dark-900 hover:bg-dark-800 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            افزودن به سبد خرید
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Cart Sidebar ──────────────────────────────────────────
const CartSidebar: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
  onCheckout: () => void;
}> = ({ isOpen, onClose, items, onUpdateQty, onRemove, onCheckout }) => {
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const deliveryFee = total > 500000 ? 0 : 35000;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fadeIn" onClick={onClose} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transition-transform duration-500 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-dark-100">
            <h2 className="text-xl font-black text-dark-900">سبد خرید</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-dark-50 rounded-xl flex items-center justify-center hover:bg-dark-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-20 h-20 bg-dark-50 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-dark-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <p className="font-bold text-dark-900 mb-1">سبد خرید شما خالی است</p>
                <p className="text-sm text-dark-400">محصولات مورد علاقه‌تان را اضافه کنید</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 bg-dark-50 rounded-xl p-3">
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-dark-900 truncate">{item.name}</h4>
                      <p className="text-sm font-bold text-dark-700 mt-1">
                        {formatPrice(item.price * item.quantity)} تومان
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => onUpdateQty(item.id, -1)}
                          className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-dark-600 hover:bg-dark-100 transition-colors text-sm font-bold"
                        >
                          −
                        </button>
                        <span className="text-sm font-bold w-5 text-center">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQty(item.id, 1)}
                          className="w-7 h-7 bg-dark-900 rounded-lg flex items-center justify-center text-white hover:bg-dark-800 transition-colors text-sm font-bold"
                        >
                          +
                        </button>
                        <button
                          onClick={() => onRemove(item.id)}
                          className="mr-auto w-7 h-7 flex items-center justify-center text-red-400 hover:text-red-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-dark-100 p-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-dark-500">جمع سفارش</span>
                <span className="font-bold">{formatPrice(total)} تومان</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-dark-500">هزینه ارسال</span>
                <span className={`font-bold ${deliveryFee === 0 ? 'text-emerald-600' : ''}`}>
                  {deliveryFee === 0 ? 'رایگان' : `${formatPrice(deliveryFee)} تومان`}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-dark-100">
                <span className="font-bold text-dark-900">مبلغ قابل پرداخت</span>
                <span className="font-black text-lg text-dark-900">
                  {formatPrice(total + deliveryFee)} تومان
                </span>
              </div>
              <button
                onClick={onCheckout}
                className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] mt-2"
              >
                ثبت سفارش و پرداخت
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// ─── Features Section ──────────────────────────────────────
const FeaturesSection: React.FC = () => {
  const features = [
    {
      title: 'مواد اولیه تازه',
      desc: 'تمامی مواد اولیه ما روزانه و از تأمین‌کنندگان معتبر تهیه می‌شود',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'ارسال سریع',
      desc: 'سفارش شما در کمتر از ۳۰ دقیقه آماده و ارسال می‌شود',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: 'بسته‌بندی بهداشتی',
      desc: 'تمامی سفارشات در بسته‌بندی بهداشتی و استاندارد ارسال می‌شوند',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      title: 'ضمانت کیفیت',
      desc: 'در صورت عدم رضایت، هزینه شما بدون قید و شرط بازگردانده می‌شود',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="flex items-start gap-4 p-5 rounded-2xl hover:bg-dark-50 transition-colors">
              <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center flex-shrink-0">
                {f.icon}
              </div>
              <div>
                <h3 className="font-bold text-dark-900 mb-1">{f.title}</h3>
                <p className="text-sm text-dark-400 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Testimonials ──────────────────────────────────────────
const TestimonialsSection: React.FC = () => (
  <section className="py-20 bg-dark-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-black text-dark-900 mb-3">نظر مشتریان ما</h2>
        <p className="text-dark-400">بیش از ۵۰ هزار مشتری راضی در سراسر کشور</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div key={t.id} className="bg-white rounded-2xl p-6 border border-dark-100">
            <div className="flex items-center gap-1 mb-4">
              {[...Array(t.rating)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-dark-600 leading-relaxed mb-4 text-sm">"{t.text}"</p>
            <div className="flex items-center gap-3 pt-4 border-t border-dark-50">
              <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <p className="font-bold text-sm text-dark-900">{t.name}</p>
                <p className="text-xs text-dark-400">مشتری وفادار</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── Footer ────────────────────────────────────────────────
const Footer: React.FC = () => (
  <footer className="bg-dark-900 text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-lg">B</span>
            </div>
            <div>
              <h3 className="font-black text-lg leading-none">برگرلند</h3>
              <p className="text-dark-400 text-[10px]">BURGER LAND</p>
            </div>
          </div>
          <p className="text-dark-400 text-sm leading-relaxed mb-4">
            برگرلند با بیش از ۱۰ سال تجربه، بهترین فست‌فود خانگی را با مواد اولیه تازه و باکیفیت ارائه می‌دهد.
          </p>
          <div className="flex items-center gap-3">
            <a href="#" className="w-9 h-9 bg-white/5 hover:bg-brand-500 rounded-lg flex items-center justify-center transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="#" className="w-9 h-9 bg-white/5 hover:bg-brand-500 rounded-lg flex items-center justify-center transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </a>
            <a href="#" className="w-9 h-9 bg-white/5 hover:bg-brand-500 rounded-lg flex items-center justify-center transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
            </a>
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-bold mb-4">دسترسی سریع</h4>
          <ul className="space-y-2.5">
            {['صفحه اصلی', 'منوی غذا', 'درباره ما', 'تماس با ما', 'بلاگ'].map((l) => (
              <li key={l}>
                <a href="#" className="text-dark-400 hover:text-white text-sm transition-colors">{l}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-bold mb-4">ارتباط با ما</h4>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-dark-400 text-sm">
              <svg className="w-4 h-4 text-brand-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              ۰۲۱-۱۲۳۴۵۶۷۸
            </li>
            <li className="flex items-center gap-3 text-dark-400 text-sm">
              <svg className="w-4 h-4 text-brand-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              info@burgerland.ir
            </li>
            <li className="flex items-center gap-3 text-dark-400 text-sm">
              <svg className="w-4 h-4 text-brand-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              تهران، خیابان ولیعصر، پلاک ۱۲۳
            </li>
            <li className="flex items-center gap-3 text-dark-400 text-sm">
              <svg className="w-4 h-4 text-brand-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              هر روز ۱۱ صبح تا ۱۲ شب
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-bold mb-4">عضویت در خبرنامه</h4>
          <p className="text-dark-400 text-sm mb-4">
            از تخفیف‌ها و پیشنهادات ویژه باخبر شوید
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="ایمیل شما"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-500 transition-colors placeholder-dark-500"
            />
            <button className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-colors">
              عضویت
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* Bottom */}
    <div className="border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-dark-500 text-xs">
          © ۱۴۰۵ برگرلند. تمامی حقوق محفوظ است.
        </p>
        <div className="flex items-center gap-4">
          <span className="text-xs text-dark-500">پرداخت امن از طریق</span>
          <div className="flex items-center gap-2">
            <div className="bg-white/5 px-3 py-1 rounded text-xs text-dark-400">زرین‌پال</div>
            <div className="bg-white/5 px-3 py-1 rounded text-xs text-dark-400">پی‌پینگ</div>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

// ─── Order Success Modal ───────────────────────────────────
const OrderSuccessModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
}> = ({ isOpen, onClose, orderNumber }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 animate-fadeIn">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl max-w-sm w-full p-8 text-center">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-black text-dark-900 mb-2">سفارش ثبت شد</h2>
        <p className="text-dark-400 mb-6 text-sm">سفارش شما با موفقیت ثبت و در حال آماده‌سازی است</p>
        <div className="bg-dark-50 rounded-xl p-4 mb-4">
          <p className="text-xs text-dark-400">شماره سفارش</p>
          <p className="text-xl font-black text-dark-900 mt-1">#{orderNumber}</p>
        </div>
        <div className="bg-brand-50 rounded-xl p-4 mb-6 flex items-center justify-center gap-3">
          <svg className="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-right">
            <p className="text-xs text-brand-700">زمان تقریبی تحویل</p>
            <p className="font-black text-brand-600">۲۵ تا ۳۵ دقیقه</p>
          </div>
        </div>
        <button onClick={onClose} className="w-full bg-dark-900 text-white font-bold py-3.5 rounded-xl hover:bg-dark-800 transition-colors">
          بازگشت به فروشگاه
        </button>
      </div>
    </div>
  );
};

// ─── Main App ──────────────────────────────────────────────
const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'rating'>('default');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`${product.name} به سبد خرید اضافه شد`);
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const handleCheckout = () => {
    const num = Math.floor(100000 + Math.random() * 900000).toString();
    setOrderNumber(num);
    setCartOpen(false);
    setOrderSuccess(true);
    setCart([]);
  };

  // Filter & Sort
  let filtered = products.filter((p) => {
    const matchCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchSearch =
      !searchQuery ||
      p.name.includes(searchQuery) ||
      p.description.includes(searchQuery);
    return matchCategory && matchSearch;
  });

  if (sortBy === 'price-asc') filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (sortBy === 'price-desc') filtered = [...filtered].sort((a, b) => b.price - a.price);
  else if (sortBy === 'rating') filtered = [...filtered].sort((a, b) => b.rating - a.rating);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="min-h-screen">
      <Header
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <HeroSection />
      <FeaturesSection />

      {/* Menu Section */}
      <section id="menu" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-black text-dark-900 mb-2">منوی غذا</h2>
              <p className="text-dark-400">از بین بهترین غذاهای ما انتخاب کنید</p>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-dark-50 border border-dark-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-500 transition-colors"
            >
              <option value="default">مرتب‌سازی: پیش‌فرض</option>
              <option value="price-asc">ارزان‌ترین</option>
              <option value="price-desc">گران‌ترین</option>
              <option value="rating">بیشترین امتیاز</option>
            </select>
          </div>

          {/* Categories */}
          <div className="mb-8">
            <CategoryBar
              categories={categories}
              active={activeCategory}
              onChange={setActiveCategory}
            />
          </div>

          {/* Products Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAdd={addToCart}
                  onView={setSelectedProduct}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-dark-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-dark-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="font-bold text-dark-900 mb-1">محصولی یافت نشد</p>
              <p className="text-sm text-dark-400">فیلترها را تغییر دهید یا عبارت دیگری جستجو کنید</p>
            </div>
          )}
        </div>
      </section>

      <TestimonialsSection />

      {/* CTA Section */}
      <section className="py-20 bg-dark-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=1920&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            آماده‌اید سفارش خود را ثبت کنید؟
          </h2>
          <p className="text-dark-400 mb-8 max-w-lg mx-auto">
            همین الان سفارش دهید و در کمتر از ۳۰ دقیقه غذای تازه و داغ خود را دریافت کنید
          </p>
          <a
            href="#menu"
            className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-bold px-8 py-4 rounded-xl transition-all active:scale-95 shadow-lg shadow-brand-500/30"
          >
            سفارش آنلاین
            <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </section>

      <Footer />

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart}
        onUpdateQty={updateQuantity}
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
      />

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAdd={addToCart}
        />
      )}

      {/* Order Success */}
      <OrderSuccessModal
        isOpen={orderSuccess}
        onClose={() => setOrderSuccess(false)}
        orderNumber={orderNumber}
      />

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] animate-fadeInUp">
          <div className="bg-dark-900 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3">
            <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium">{toast}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
