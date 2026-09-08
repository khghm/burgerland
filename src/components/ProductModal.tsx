import React from 'react';
import { Product } from '../types';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose, onAddToCart }) => {
  if (!product || !isOpen) return null;

  const formatPrice = (price: number) => {
    return price.toLocaleString('fa-IR');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          ✕
        </button>

        {/* Product Image */}
        <div className="h-48 bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
          <span className="text-8xl animate-float">{product.image}</span>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Badges */}
          <div className="flex items-center gap-2 mb-3">
            {product.isPopular && (
              <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full">
                🔥 محبوب
              </span>
            )}
            {product.isNew && (
              <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                ✨ جدید
              </span>
            )}
            {product.isSpicy && (
              <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full">
                🌶️ تند
              </span>
            )}
          </div>

          {/* Title & Rating */}
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h2>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">★</span>
              <span className="font-bold text-gray-700">{product.rating}</span>
            </div>
            <span className="text-gray-400">|</span>
            <span className="text-gray-500 text-sm">{product.reviews} نظر</span>
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed mb-4">{product.description}</p>

          {/* Info */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {product.calories && (
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <span className="text-2xl">🔥</span>
                <p className="text-sm text-gray-600 mt-1">{product.calories} کالری</p>
              </div>
            )}
            {product.prepTime && (
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <span className="text-2xl">⏱️</span>
                <p className="text-sm text-gray-600 mt-1">{product.prepTime}</p>
              </div>
            )}
          </div>

          {/* Ingredients */}
          {product.ingredients && (
            <div className="mb-6">
              <h3 className="font-bold text-gray-700 mb-2">مواد تشکیل‌دهنده:</h3>
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((ing, index) => (
                  <span
                    key={index}
                    className="bg-red-50 text-red-700 text-xs px-3 py-1.5 rounded-full font-medium"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Price & Add to Cart */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              {product.originalPrice && (
                <span className="text-gray-400 line-through text-sm">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              <p className="text-2xl font-bold text-red-600">
                {formatPrice(product.price)} <span className="text-sm">تومان</span>
              </p>
            </div>
            <button
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              className="btn-primary flex items-center gap-2"
            >
              <span>🛒</span>
              <span>افزودن به سبد</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
