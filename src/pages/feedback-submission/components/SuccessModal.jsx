import React, { useEffect, useState } from 'react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SuccessModal = ({ isOpen, onClose, referenceNumber }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
  }, []);

  const translations = {
    en: {
      successTitle: "Feedback Submitted Successfully!",
      thankYou: "Thank you for your feedback",
      referenceNumber: "Reference Number",
      description: "Your feedback has been received and will be reviewed by our team. We appreciate your input and will respond if necessary.",
      processingTime: "Expected response time: 3-5 business days",
      keepReference: "Please keep your reference number for future inquiries.",
      backToDashboard: "Back to Dashboard",
      close: "Close"
    },
    'uz-latn': {
      successTitle: "Fikr-mulohaza muvaffaqiyatli yuborildi!",
      thankYou: "Fikr-mulohazangiz uchun rahmat",
      referenceNumber: "Ma\'lumotnoma raqami",
      description: "Sizning fikr-mulohazangiz qabul qilindi va bizning jamoa tomonidan ko'rib chiqiladi. Sizning fikringizni qadrlaymiz va zarur bo'lsa javob beramiz.",
      processingTime: "Kutilayotgan javob vaqti: 3-5 ish kuni",
      keepReference: "Kelajakdagi so'rovlar uchun ma'lumotnoma raqamingizni saqlang.",
      backToDashboard: "Bosh sahifaga qaytish",
      close: "Yopish"
    },
    'uz-cyrl': {
      successTitle: "Фикр-мулоҳаза муваффақиятли юборилди!",
      thankYou: "Фикр-мулоҳазангиз учун раҳмат",
      referenceNumber: "Маълумотнома рақами",
      description: "Сизнинг фикр-мулоҳазангиз қабул қилинди ва бизнинг жамоа томонидан кўриб чиқилади. Сизнинг фикрингизни қадрлаймиз ва зарур бўлса жавоб берамиз.",
      processingTime: "Кутилаётган жавоб вақти: 3-5 иш куни",
      keepReference: "Келажакдаги сўровлар учун маълумотнома рақамингизни сақланг.",
      backToDashboard: "Бош саҳифага қайтиш",
      close: "Ёпиш"
    },
    ru: {
      successTitle: "Отзыв успешно отправлен!",
      thankYou: "Спасибо за ваш отзыв",
      referenceNumber: "Номер обращения",
      description: "Ваш отзыв получен и будет рассмотрен нашей командой. Мы ценим ваше мнение и ответим при необходимости.",
      processingTime: "Ожидаемое время ответа: 3-5 рабочих дней",
      keepReference: "Пожалуйста, сохраните номер обращения для будущих запросов.",
      backToDashboard: "Вернуться на главную",
      close: "Закрыть"
    }
  };

  const t = translations?.[language] || translations?.en;

  const handleBackToDashboard = () => {
    onClose();
    window.location.href = '/home-dashboard';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="default"
      className="max-w-md"
      title={t?.successTitle}
    >
      <div className="p-6 text-center space-y-6">
        {/* Success Icon */}
        <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
          <Icon name="CheckCircle" size={32} className="text-success" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            {t?.successTitle}
          </h2>
          <p className="text-muted-foreground">
            {t?.thankYou}
          </p>
        </div>

        {/* Reference Number */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <p className="text-sm font-medium text-foreground">
            {t?.referenceNumber}
          </p>
          <div className="bg-background border border-border rounded-md p-3">
            <code className="text-lg font-mono font-semibold text-primary">
              {referenceNumber}
            </code>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-3 text-left">
          <p className="text-sm text-muted-foreground">
            {t?.description}
          </p>
          <div className="flex items-start space-x-2">
            <Icon name="Clock" size={16} className="text-warning mt-0.5" />
            <p className="text-sm text-muted-foreground">
              {t?.processingTime}
            </p>
          </div>
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={16} className="text-accent mt-0.5" />
            <p className="text-sm text-muted-foreground">
              {t?.keepReference}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col space-y-3 pt-4">
          <Button
            variant="default"
            onClick={handleBackToDashboard}
            iconName="Home"
            iconPosition="left"
            className="w-full"
          >
            {t?.backToDashboard}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full"
          >
            {t?.close}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SuccessModal;