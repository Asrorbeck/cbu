import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const FeedbackForm = ({ onSubmit, isSubmitting }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
  }, []);

  const translations = {
    en: {
      fullName: "Full Name",
      fullNamePlaceholder: "Enter your full name",
      phoneNumber: "Phone Number",
      phonePlaceholder: "+998 XX XXX XX XX",
      message: "Your Message",
      messagePlaceholder: "Please describe your feedback, suggestions, or concerns in detail...",
      submitFeedback: "Submit Feedback",
      submitting: "Submitting...",
      nameRequired: "Full name is required",
      nameMinLength: "Name must be at least 2 characters",
      phoneRequired: "Phone number is required",
      phoneInvalid: "Please enter a valid Uzbekistan phone number",
      messageRequired: "Message is required",
      messageMinLength: "Message must be at least 10 characters",
      messageMaxLength: "Message cannot exceed 500 characters",
      charactersRemaining: "characters remaining"
    },
    'uz-latn': {
      fullName: "To\'liq ism",
      fullNamePlaceholder: "To\'liq ismingizni kiriting",
      phoneNumber: "Telefon raqam",
      phonePlaceholder: "+998 XX XXX XX XX",
      message: "Xabaringiz",
      messagePlaceholder: "Fikr-mulohaza, taklif yoki muammolaringizni batafsil yozing...",
      submitFeedback: "Fikr-mulohaza yuborish",
      submitting: "Yuborilmoqda...",
      nameRequired: "To\'liq ism kiritish majburiy",
      nameMinLength: "Ism kamida 2 ta belgidan iborat bo\'lishi kerak",
      phoneRequired: "Telefon raqam kiritish majburiy",
      phoneInvalid: "Iltimos, to'g'ri O'zbekiston telefon raqamini kiriting",
      messageRequired: "Xabar kiritish majburiy",
      messageMinLength: "Xabar kamida 10 ta belgidan iborat bo\'lishi kerak",
      messageMaxLength: "Xabar 500 ta belgidan oshmasligi kerak",
      charactersRemaining: "belgi qoldi"
    },
    'uz-cyrl': {
      fullName: "Тўлиқ исм",
      fullNamePlaceholder: "Тўлиқ исмингизни киритинг",
      phoneNumber: "Телефон рақам",
      phonePlaceholder: "+998 XX XXX XX XX",
      message: "Хабарингиз",
      messagePlaceholder: "Фикр-мулоҳаза, таклиф ёки муаммоларингизни батафсил ёзинг...",
      submitFeedback: "Фикр-мулоҳаза юбориш",
      submitting: "Юборилмоқда...",
      nameRequired: "Тўлиқ исм киритиш мажбурий",
      nameMinLength: "Исм камида 2 та белгидан иборат бўлиши керак",
      phoneRequired: "Телефон рақам киритиш мажбурий",
      phoneInvalid: "Илтимос, тўғри Ўзбекистон телефон рақамини киритинг",
      messageRequired: "Хабар киритиш мажбурий",
      messageMinLength: "Хабар камида 10 та белгидан иборат бўлиши керак",
      messageMaxLength: "Хабар 500 та белгидан ошмаслиги керак",
      charactersRemaining: "белги қолди"
    },
    ru: {
      fullName: "Полное имя",
      fullNamePlaceholder: "Введите ваше полное имя",
      phoneNumber: "Номер телефона",
      phonePlaceholder: "+998 XX XXX XX XX",
      message: "Ваше сообщение",
      messagePlaceholder: "Пожалуйста, подробно опишите ваши отзывы, предложения или проблемы...",
      submitFeedback: "Отправить отзыв",
      submitting: "Отправка...",
      nameRequired: "Полное имя обязательно",
      nameMinLength: "Имя должно содержать минимум 2 символа",
      phoneRequired: "Номер телефона обязателен",
      phoneInvalid: "Пожалуйста, введите действительный узбекский номер телефона",
      messageRequired: "Сообщение обязательно",
      messageMinLength: "Сообщение должно содержать минимум 10 символов",
      messageMaxLength: "Сообщение не может превышать 500 символов",
      charactersRemaining: "символов осталось"
    }
  };

  const t = translations?.[language] || translations?.en;

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value?.trim()) return t?.nameRequired;
        if (value?.trim()?.length < 2) return t?.nameMinLength;
        return '';
      case 'phone':
        if (!value?.trim()) return t?.phoneRequired;
        const phoneRegex = /^\+998\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/;
        if (!phoneRegex?.test(value?.replace(/\s/g, ''))) return t?.phoneInvalid;
        return '';
      case 'message':
        if (!value?.trim()) return t?.messageRequired;
        if (value?.trim()?.length < 10) return t?.messageMinLength;
        if (value?.length > 500) return t?.messageMaxLength;
        return '';
      default:
        return '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    let formattedValue = value;

    // Format phone number
    if (name === 'phone') {
      formattedValue = formatPhoneNumber(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e?.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const formatPhoneNumber = (value) => {
    // Remove all non-digits except +
    let cleaned = value?.replace(/[^\d+]/g, '');
    
    // Ensure it starts with +998
    if (!cleaned?.startsWith('+998')) {
      if (cleaned?.startsWith('998')) {
        cleaned = '+' + cleaned;
      } else if (cleaned?.startsWith('8')) {
        cleaned = '+99' + cleaned;
      } else {
        cleaned = '+998' + cleaned?.replace(/^\+/, '');
      }
    }

    // Format: +998 XX XXX XX XX
    if (cleaned?.length > 4) {
      cleaned = cleaned?.slice(0, 4) + ' ' + cleaned?.slice(4);
    }
    if (cleaned?.length > 7) {
      cleaned = cleaned?.slice(0, 7) + ' ' + cleaned?.slice(7);
    }
    if (cleaned?.length > 11) {
      cleaned = cleaned?.slice(0, 11) + ' ' + cleaned?.slice(11);
    }
    if (cleaned?.length > 14) {
      cleaned = cleaned?.slice(0, 14) + ' ' + cleaned?.slice(14);
    }

    return cleaned?.slice(0, 17); // Limit to +998 XX XXX XX XX
  };

  const handleSubmit = (e) => {
    e?.preventDefault();

    // Validate all fields
    const newErrors = {};
    Object.keys(formData)?.forEach(field => {
      const error = validateField(field, formData?.[field]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    setTouched({
      name: true,
      phone: true,
      message: true
    });

    if (Object.keys(newErrors)?.length === 0) {
      onSubmit(formData);
    }
  };

  const messageLength = formData?.message?.length;
  const remainingChars = 500 - messageLength;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Input */}
      <Input
        label={t?.fullName}
        type="text"
        name="name"
        value={formData?.name}
        onChange={handleInputChange}
        onBlur={handleBlur}
        placeholder={t?.fullNamePlaceholder}
        error={touched?.name ? errors?.name : ''}
        required
        disabled={isSubmitting}
        className="w-full"
      />
      {/* Phone Input */}
      <Input
        label={t?.phoneNumber}
        type="tel"
        name="phone"
        value={formData?.phone}
        onChange={handleInputChange}
        onBlur={handleBlur}
        placeholder={t?.phonePlaceholder}
        error={touched?.phone ? errors?.phone : ''}
        required
        disabled={isSubmitting}
        className="w-full"
      />
      {/* Message Textarea */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          {t?.message} <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <textarea
            name="message"
            value={formData?.message}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder={t?.messagePlaceholder}
            disabled={isSubmitting}
            rows={6}
            maxLength={500}
            className={`
              w-full px-4 py-3 border rounded-lg resize-none
              bg-input text-foreground placeholder:text-muted-foreground
              focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
              ${touched?.message && errors?.message 
                ? 'border-destructive focus:ring-destructive' :'border-border hover:border-accent'
              }
            `}
          />
          <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
            {remainingChars} {t?.charactersRemaining}
          </div>
        </div>
        {touched?.message && errors?.message && (
          <p className="text-sm text-destructive flex items-center space-x-1">
            <Icon name="AlertCircle" size={16} />
            <span>{errors?.message}</span>
          </p>
        )}
      </div>
      {/* Submit Button */}
      <Button
        type="submit"
        variant="default"
        size="lg"
        loading={isSubmitting}
        disabled={isSubmitting || Object.keys(errors)?.some(key => errors?.[key])}
        iconName="Send"
        iconPosition="right"
        className="w-full"
      >
        {isSubmitting ? t?.submitting : t?.submitFeedback}
      </Button>
    </form>
  );
};

export default FeedbackForm;