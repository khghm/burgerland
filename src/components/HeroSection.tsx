import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-red-600 via-red-500 to-orange-500">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 text-8xl animate-float">🍔</div>
        <div className="absolute top-20 left-20 text-6xl animate-float" style={{ animationDelay: '1s' }}>🍕</div>
        <div className="absolute bottom-10 right-1/3 text-7xl animate-float" style={{ animationDelay: '2s' }}>🍟</div>
        <div className="absolute bottom-20 left-10 text-5xl animate-float" style={{ animationDelay: '0.5s' }}>🌶️</div>
        <div className="absolute top-1/2 left-1/2 text-6xl animate-float" style={{ animationDelay: '1.5s' }}>🥤</div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Text Content */}
          <div className="flex-1 text-center md:text-right text-white">
            <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
              <span className="text-sm font-bold">🎉 ارسال رایگان برای سفارش بالای ۲۰۰ هزار تومان</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
              طعم واقعی
              <br />
              <span className="text-yellow-300">فست‌فود خانگی</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-lg">
              با بهترین مواد اولیه و دستور پخت‌های ویژه، لذت یک غذای خوشمزه را تجربه کنید
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
              <a
                href="#menu"
                className="bg-white text-red-600 font-bold py-4 px-8 rounded-xl hover:bg-yellow-300 hover:text-red-700 transition-all transform hover:scale-105 shadow-lg"
              >
                🍽️ مشاهده منو
              </a>
              <a
                href="#offers"
                className="border-2 border-white text-white font-bold py-4 px-8 rounded-xl hover:bg-white/10 transition-all"
              >
                🎁 پیشنهادات ویژه
              </a>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 mt-10 justify-center md:justify-start">
              <div className="text-center">
                <p className="text-3xl font-black">+۵۰</p>
                <p className="text-xs text-white/70">نوع غذا</p>
              </div>
              <div className="w-px h-10 bg-white/30"></div>
              <div className="text-center">
                <p className="text-3xl font-black">+۱۰K</p>
                <p className="text-xs text-white/70">مشتری راضی</p>
              </div>
              <div className="w-px h-10 bg-white/30"></div>
              <div className="text-center">
                <p className="text-3xl font-black">۴.۸</p>
                <p className="text-xs text-white/70">امتیاز</p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="flex-1 flex justify-center">
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-white/20">
                <span className="text-[120px] md:text-[160px] animate-float">🍔</span>
              </div>
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-3 shadow-xl animate-float" style={{ animationDelay: '0.5s' }}>
                <span className="text-3xl">🍟</span>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-3 shadow-xl animate-float" style={{ animationDelay: '1s' }}>
                <span className="text-3xl">🥤</span>
              </div>
              <div className="absolute top-1/2 -left-8 bg-white rounded-2xl p-3 shadow-xl animate-float" style={{ animationDelay: '1.5s' }}>
                <span className="text-3xl">🍕</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="#fefefe"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
