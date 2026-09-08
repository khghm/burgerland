import React, { useState, useMemo, useCallback } from 'react';
import { Product, CartItem } from './types';
import { products, categories } from './data';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import Features from './components/Features';
import CategoryFilter from './components/CategoryFilter';
import SpecialOffers from './components/SpecialOffers';
import ProductCard from './components/ProductCard';
import CartSidebar from './components/CartSidebar';
import ProductModal from './components/ProductModal';
import OrderSuccess from './components/OrderSuccess';
import Footer from './components/Footer';

const App: React.FC = () => {
  // State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'rating'>('default');
  const [notification, setNotification] = useState<string | null>(null);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Category filter
    if (activeCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === activeCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.ingredients?.some((ing) => ing.toLowerCase().includes(query))
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered = [...filtered].sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return filtered;
  }, [activeCategory, searchQuery, sortBy]);

  // Cart Functions
  const addToCart = useCallback((product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showNotification(`${product.name} به سبد خرید اضافه شد`);
  }, []);

  const updateQuantity = useCallback((id: number, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    }
  }, []);

  const removeItem = useCallback((id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const totalCartItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  // Notification
  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 2500);
  };

  // Checkout
  const handleCheckout = () => {
    const number = Math.floor(100000 + Math.random() * 900000).toString();
    setOrderNumber(number);
    setCartItems([]);
    setIsCartOpen(false);
    setIsOrderSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#fefefe]">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-fadeIn">
          <div className="bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2">
            <span>✅</span>
            <span className="font-bold text-sm">{notification}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <Header
        cartCount={totalCartItems}
        onCartClick={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Hero Section */}
      <HeroSection />

      {/* Features */}
      <Features />

      {/* Special Offers */}
      <SpecialOffers products={products} onAddToCart={addToCart} />

      {/* Menu Section */}
      <section id="menu" className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-800 flex items-center gap-2">
                <span className="text-3xl">📋</span>
                منوی غذا
              </h2>
              <p className="text-gray-500 mt-1">
                {filteredProducts.length} محصول یافت شد
              </p>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">مرتب‌سازی:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-gray-100 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-red-300 cursor-pointer"
              >
                <option value="default">پیش‌فرض</option>
                <option value="price-asc">ارزان‌ترین</option>
                <option value="price-desc">گران‌ترین</option>
                <option value="rating">بیشترین امتیاز</option>
              </select>
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fadeIn"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <ProductCard
                    product={product}
                    onAddToCart={addToCart}
                    onViewDetails={(p) => {
                      setSelectedProduct(p);
                      setIsModalOpen(true);
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <span className="text-6xl block mb-4">🔍</span>
              <h3 className="text-xl font-bold text-gray-700 mb-2">محصولی یافت نشد</h3>
              <p className="text-gray-500">لطفاً فیلترها را تغییر دهید یا عبارت دیگری جستجو کنید</p>
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setSearchQuery('');
                }}
                className="mt-4 btn-outline text-sm"
              >
                پاک کردن فیلترها
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            اپلیکیشن برگر لند را دانلود کنید
          </h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            با دانلود اپلیکیشن ما، از تخفیف‌های ویژه و ارسال رایگان بهره‌مند شوید
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="bg-white text-gray-800 font-bold py-3 px-8 rounded-xl flex items-center gap-3 hover:bg-gray-100 transition-colors">
              <span className="text-2xl">📱</span>
              <div className="text-right">
                <p className="text-xs text-gray-500">دانلود از</p>
                <p className="font-bold">بازار</p>
              </div>
            </button>
            <button className="bg-white text-gray-800 font-bold py-3 px-8 rounded-xl flex items-center gap-3 hover:bg-gray-100 transition-colors">
              <span className="text-2xl">🍎</span>
              <div className="text-right">
                <p className="text-xs text-gray-500">دانلود از</p>
                <p className="font-bold">سیب‌اپ</p>
              </div>
            </button>
            <button className="bg-white text-gray-800 font-bold py-3 px-8 rounded-xl flex items-center gap-3 hover:bg-gray-100 transition-colors">
              <span className="text-2xl">🤖</span>
              <div className="text-right">
                <p className="text-xs text-gray-500">دانلود از</p>
                <p className="font-bold">گوگل‌پلی</p>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onCheckout={handleCheckout}
      />

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={addToCart}
      />

      {/* Order Success Modal */}
      <OrderSuccess
        isOpen={isOrderSuccess}
        onClose={() => setIsOrderSuccess(false)}
        orderNumber={orderNumber}
      />
    </div>
  );
};

export default App;
