import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const FeedbackHeader = () => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
  }, []);

  const translations = {
    en: {
      title: "Customer Feedback",
      subtitle: "Share Your Experience",
      description: "We value your feedback and suggestions. Help us improve our services by sharing your thoughts, concerns, or recommendations.",
      contactInfo: "Your feedback helps us serve you better",
      responseTime: "We typically respond within 3-5 business days"
    },
    'uz-latn': {
      title: "Mijozlar fikr-mulohazasi",
      subtitle: "Tajribangizni baham ko\'ring",
      description: "Biz sizning fikr-mulohaza va takliflaringizni qadrlaymiz. Fikrlaringiz, tashvishlaringiz yoki tavsiyalaringizni baham ko'rib, xizmatlarimizni yaxshilashga yordam bering.",
      contactInfo: "Sizning fikr-mulohazangiz bizga yaxshiroq xizmat ko\'rsatishga yordam beradi",
      responseTime: "Biz odatda 3-5 ish kuni ichida javob beramiz"
    },
    'uz-cyrl': {
      title: "Мижозлар фикр-мулоҳазаси",
      subtitle: "Тажрибангизни баҳам кўринг",
      description: "Биз сизнинг фикр-мулоҳаза ва таклифларингизни қадрлаймиз. Фикрларингиз, ташвишларингиз ёки тавсияларингизни баҳам кўриб, хизматларимизни яхшилашга ёрдам беринг.",
      contactInfo: "Сизнинг фикр-мулоҳазангиз бизга яхшироқ хизмат кўрсатишга ёрдам беради",
      responseTime: "Биз одатда 3-5 иш куни ичида жавоб берамиз"
    },
    ru: {
      title: "Отзывы клиентов",
      subtitle: "Поделитесь своим опытом",
      description: "Мы ценим ваши отзывы и предложения. Помогите нам улучшить наши услуги, поделившись своими мыслями, проблемами или рекомендациями.",
      contactInfo: "Ваши отзывы помогают нам лучше обслуживать вас",
      responseTime: "Мы обычно отвечаем в течение 3-5 рабочих дней"
    }
  };

  const t = translations?.[language] || translations?.en;

  return (
    <div className="text-center space-y-6 mb-8">
      {/* Icon */}
      <div className="mx-auto w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center">
        <Icon name="MessageSquare" size={40} className="text-primary" />
      </div>
      {/* Title Section */}
      <div className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          {t?.title}
        </h1>
        <p className="text-xl text-primary font-medium">
          {t?.subtitle}
        </p>
      </div>
      {/* Description */}
      <div className="max-w-2xl mx-auto space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          {t?.description}
        </p>
        
        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg">
            <Icon name="Heart" size={20} className="text-success" />
            <p className="text-sm text-muted-foreground">
              {t?.contactInfo}
            </p>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg">
            <Icon name="Clock" size={20} className="text-warning" />
            <p className="text-sm text-muted-foreground">
              {t?.responseTime}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackHeader;