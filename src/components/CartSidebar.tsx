import React from 'react';
import { CartItem } from '../types';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
  onCheckout: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const formatPrice = (price: number) => {
    return price.toLocaleString('fa-IR');
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b gradient-red text-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span>🛒</span>
            سبد خرید
            <span className="bg-white/20 rounded-full px-3 py-1 text-sm">
              {totalItems} عدد
            </span>
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: 'calc(100vh - 250px)' }}>
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <span className="text-6xl mb-4">🛒</span>
              <p className="text-lg">سبد خرید شما خالی است</p>
              <p className="text-sm mt-2">محصولات مورد علاقه خود را اضافه کنید</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-red-200 transition-colors"
                >
                  <div className="text-4xl w-16 h-16 flex items-center justify-center bg-white rounded-xl shadow-sm">
                    {item.image}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-sm">{item.name}</h3>
                    <p className="text-red-600 font-bold text-sm mt-1">
                      {formatPrice(item.price * item.quantity)} تومان
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors font-bold"
                      >
                        −
                      </button>
                      <span className="font-bold text-gray-700 w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600">جمع کل:</span>
              <span className="text-2xl font-bold text-red-600">
                {formatPrice(totalPrice)} تومان
              </span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full btn-primary text-lg py-4 rounded-xl flex items-center justify-center gap-2"
            >
              <span>ثبت سفارش</span>
              <span>←</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
