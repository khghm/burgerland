import React from 'react';

interface OrderSuccessProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
}

const OrderSuccess: React.FC<OrderSuccessProps> = ({ isOpen, onClose, orderNumber }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl max-w-sm w-full p-8 text-center shadow-2xl animate-fadeIn">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-5xl">✅</span>
        </div>

        <h2 className="text-2xl font-black text-gray-800 mb-2">سفارش ثبت شد!</h2>
        <p className="text-gray-500 mb-4">
          سفارش شما با موفقیت ثبت شد و در حال آماده‌سازی است
        </p>

        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-500">شماره سفارش</p>
          <p className="text-xl font-bold text-red-600 mt-1">#{orderNumber}</p>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">🛵</span>
            <div>
              <p className="text-sm font-bold text-blue-800">زمان تقریبی تحویل</p>
              <p className="text-lg font-black text-blue-600">۲۵ - ۳۵ دقیقه</p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full btn-primary py-4 rounded-xl text-lg"
        >
          بازگشت به فروشگاه
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
