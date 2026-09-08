import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onViewDetails }) => {
  const formatPrice = (price: number) => {
    return price.toLocaleString('fa-IR');
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="card-hover bg-white rounded-2xl overflow-hidden border border-gray-100 group">
      {/* Image Section */}
      <div
        className="relative h-44 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center cursor-pointer overflow-hidden"
        onClick={() => onViewDetails(product)}
      >
        <span className="text-7xl group-hover:scale-110 transition-transform duration-300">
          {product.image}
        </span>

        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1">
          {product.isPopular && (
            <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
              🔥 محبوب
            </span>
          )}
          {product.isNew && (
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
              ✨ جدید
            </span>
          )}
          {product.isSpicy && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
              🌶️ تند
            </span>
          )}
        </div>

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 left-3">
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
              {discount}% تخفیف
            </span>
          </div>
        )}

        {/* Quick View */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product);
            }}
            className="w-full bg-white/90 backdrop-blur-sm text-gray-700 text-sm font-bold py-2 rounded-xl hover:bg-white transition-colors"
          >
            مشاهده جزئیات
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <span className="text-yellow-400 text-sm">★</span>
          <span className="text-xs font-bold text-gray-700">{product.rating}</span>
          <span className="text-xs text-gray-400">({product.reviews})</span>
        </div>

        {/* Name */}
        <h3 className="font-bold text-gray-800 mb-1 text-sm leading-relaxed">{product.name}</h3>

        {/* Description */}
        <p className="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Price & Add */}
        <div className="flex items-center justify-between">
          <div>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through block">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            <span className="text-lg font-black text-red-600">
              {formatPrice(product.price)}
            </span>
            <span className="text-xs text-gray-500 mr-1">تومان</span>
          </div>
          <button
            onClick={() => onAddToCart(product)}
            className="w-10 h-10 gradient-red rounded-xl flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all hover:scale-110 active:scale-95"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
