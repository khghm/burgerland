import React from 'react';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ cartCount, onCartClick, searchQuery, onSearchChange }) => {
  return (
    <header className="sticky top-0 z-30 glass-effect border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 gradient-red rounded-xl flex items-center justify-center text-2xl shadow-lg">
              🍔
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-800">برگر لند</h1>
              <p className="text-xs text-gray-500">سفارش آنلاین فست‌فود</p>
            </div>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="جستجوی غذا..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pr-10 pl-4 py-2.5 bg-gray-100 rounded-xl border-2 border-transparent focus:border-red-400 focus:bg-white outline-none transition-all text-sm"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Mobile Search */}
            <div className="md:hidden">
              <button className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                🔍
              </button>
            </div>

            {/* Cart Button */}
            <button
              onClick={onCartClick}
              className="relative w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors"
            >
              <span className="text-xl">🛒</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center font-bold animate-bounce-custom">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User */}
            <button className="hidden sm:flex w-10 h-10 rounded-xl bg-gray-100 items-center justify-center hover:bg-gray-200 transition-colors">
              👤
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden mt-3">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="جستجوی غذا..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 bg-gray-100 rounded-xl border-2 border-transparent focus:border-red-400 focus:bg-white outline-none transition-all text-sm"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
