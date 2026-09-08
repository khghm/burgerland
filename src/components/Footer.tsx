import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="gradient-dark text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 gradient-red rounded-xl flex items-center justify-center text-2xl">
                🍔
              </div>
              <div>
                <h3 className="text-xl font-black">برگر لند</h3>
                <p className="text-gray-400 text-xs">طعم واقعی فست‌فود</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              برگر لند با بیش از ۱۰ سال تجربه در ارائه بهترین فست‌فودهای خانگی، آماده خدمت‌رسانی به شماست.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors">
                📷
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors">
                💬
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors">
                🐦
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">دسترسی سریع</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">صفحه اصلی</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">منوی غذا</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">درباره ما</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">تماس با ما</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">بلاگ</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4">ارتباط با ما</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <span>📞</span>
                <span>۰۲۱-۱۲۳۴۵۶۷۸</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <span>📧</span>
                <span>info@burgerland.ir</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <span>📍</span>
                <span>تهران، خیابان ولیعصر، پلاک ۱۲۳</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <span>🕐</span>
                <span>هر روز ۱۱ صبح تا ۱۲ شب</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-lg mb-4">خبرنامه</h4>
            <p className="text-gray-400 text-sm mb-3">
              برای اطلاع از تخفیف‌ها و پیشنهادات ویژه عضو شوید
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="ایمیل شما"
                className="flex-1 px-4 py-2.5 bg-white/10 rounded-xl text-sm placeholder-gray-500 outline-none focus:bg-white/20 transition-colors"
              />
              <button className="px-4 py-2.5 gradient-red rounded-xl text-sm font-bold hover:opacity-90 transition-opacity">
                عضویت
              </button>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span className="text-lg">🏆</span>
                <span className="text-xs text-gray-400">بهترین رستوران</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-lg">⭐</span>
                <span className="text-xs text-gray-400">۴.۸ از ۵</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-gray-500 text-xs">
            © ۱۴۰۵ برگر لند. تمامی حقوق محفوظ است.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500">پرداخت امن</span>
            <div className="flex items-center gap-2">
              <span className="bg-white/10 px-2 py-1 rounded text-xs">💳</span>
              <span className="bg-white/10 px-2 py-1 rounded text-xs">🏦</span>
              <span className="bg-white/10 px-2 py-1 rounded text-xs">📱</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
