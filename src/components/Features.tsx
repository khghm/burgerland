import React from 'react';

const Features: React.FC = () => {
  const features = [
    {
      icon: '🚀',
      title: 'ارسال سریع',
      description: 'ارسال در کمتر از ۳۰ دقیقه به سراسر شهر',
      color: 'from-blue-50 to-blue-100',
    },
    {
      icon: '👨‍🍳',
      title: 'سرآشپز حرفه‌ای',
      description: 'تهیه شده توسط بهترین سرآشپزهای کشور',
      color: 'from-orange-50 to-orange-100',
    },
    {
      icon: '🌿',
      title: 'مواد تازه',
      description: 'استفاده از تازه‌ترین و باکیفیت‌ترین مواد',
      color: 'from-green-50 to-green-100',
    },
    {
      icon: '💰',
      title: 'قیمت مناسب',
      description: 'بهترین کیفیت با مناسب‌ترین قیمت',
      color: 'from-purple-50 to-purple-100',
    },
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${feature.color} rounded-2xl p-5 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
            >
              <span className="text-4xl mb-3 block">{feature.icon}</span>
              <h3 className="font-bold text-gray-800 text-sm mb-1">{feature.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
