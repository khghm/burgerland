import React from 'react';
import { Product } from '../types';

interface SpecialOffersProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const SpecialOffers: React.FC<SpecialOffersProps> = ({ products, onAddToCart }) => {
  const offers = products.filter((p) => p.originalPrice);

  const formatPrice = (price: number) => {
    return price.toLocaleString('fa-IR');
  };

  if (offers.length === 0) return null;

  return (
    <section id="offers" className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-800 flex items-center gap-2">
              <span className="text-3xl">🎁</span>
              پیشنهادات ویژه
            </h2>
            <p className="text-gray-500 mt-1">فرصت را از دست ندهید!</p>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-red-50 rounded-xl px-4 py-2">
            <span className="text-red-600 font-bold text-sm animate-pulse">⏰</span>
            <span className="text-red-600 font-bold text-sm">فقط تا پایان امروز</span>
          </div>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offers.map((offer) => {
            const discount = Math.round(
              ((offer.originalPrice! - offer.price) / offer.originalPrice!) * 100
            );
            return (
              <div
                key={offer.id}
                className="relative bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 border border-red-100 overflow-hidden group hover:shadow-xl transition-all duration-300"
              >
                {/* Discount Badge */}
                <div className="absolute top-4 left-4 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                  {discount}% تخفیف
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <span className="text-5xl">{offer.image}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-lg">{offer.name}</h3>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">{offer.description}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-gray-400 line-through text-sm">
                        {formatPrice(offer.originalPrice!)}
                      </span>
                      <span className="text-xl font-black text-red-600">
                        {formatPrice(offer.price)}
                      </span>
                      <span className="text-xs text-gray-500">تومان</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onAddToCart(offer)}
                    className="btn-primary text-sm py-2 px-4"
                  >
                    🛒 سفارش
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;
