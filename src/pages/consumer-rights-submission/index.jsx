import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Navbar from "../../components/ui/Navbar";
import Button from "../../components/ui/Button";
import Icon from "../../components/AppIcon";

const ConsumerRightsSubmission = () => {
  const navigate = useNavigate();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const handleBackToSubmissions = () => {
    navigate("/submissions");
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const services = [
    {
      id: "submit-complaint",
      title: "Murojaat yuborish",
      description:
        "Amalga oshirilgan kiber jinoyatlar va moliyaviy firibgarlik holatlari (Markaziy bank faoliyatiga tegishliligi bo'yicha) to'g'risida",
      icon: "Send",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      action: () => {
        navigate("/submit-complaint");
      },
    },
    {
      id: "check-license",
      title: "Litsenziyani tekshirish",
      description: "Tashkilot yoki bank litsenziyasini tekshiring",
      icon: "ShieldCheck",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      action: () => {
        navigate("/check-license");
      },
    },
  ];

  const faqs = [
    {
      question: "Iste'molchi huquqlari nima?",
      answer:
        "Iste'molchi huquqlari - bu tovar yoki xizmatlarni sotib olayotgan shaxslarning qonun bilan himoyalangan huquqlari. Bu huquqlar sifatli mahsulot olish, to'g'ri ma'lumot olish, xavfsizlik va shikoyat qilish huquqlarini o'z ichiga oladi.",
    },
    {
      question: "Qanday hollarda murojaat yuborishim mumkin?",
      answer:
        "Siz quyidagi hollarda murojaat yuborishingiz mumkin: noto'g'ri shartlar bilan shartnoma tuzilganda, yashirin to'lovlar mavjud bo'lganda, yomon xizmat ko'rsatilganda, noto'g'ri yoki chalg'ituvchi ma'lumot berilganda, va boshqa huquqlaringiz buzilgan hollarda.",
    },
    {
      question: "Murojaatim qancha muddat ichida ko'rib chiqiladi?",
      answer:
        "Sizning murojaatingiz qabul qilingan kundan boshlab 3-5 ish kuni ichida ko'rib chiqiladi. Murakkab holatlarda bu muddat 10 ish kunigacha uzaytirilishi mumkin. Jarayon haqida sizga SMS yoki email orqali xabar beriladi.",
    },
    {
      question: "Litsenziyani qanday tekshirish mumkin?",
      answer:
        "Litsenziyani tekshirish uchun 'Litsenziyani tekshirish' bo'limiga o'ting va tashkilotning INN raqami yoki nomini kiriting. Tizim avtomatik ravishda litsenziya mavjudligi va amal qilish muddatini ko'rsatadi.",
    },
    {
      question: "Shikoyatim maxfiy bo'ladimi?",
      answer:
        "Ha, sizning barcha shaxsiy ma'lumotlaringiz va shikoyat tafsilotlari to'liq maxfiy saqlanadi. Ma'lumotlar faqat tegishli bo'limlar tomonidan ko'rib chiqiladi va uchinchi shaxslarga berilmaydi.",
    },
    {
      question: "Qanday hujjatlar kerak bo'ladi?",
      answer:
        "Murojaatingizni tasdiqlash uchun shartnoma nusxasi, to'lov kvitansiyalari, SMS yoki email xabarlar, va boshqa muhim hujjatlarning raqamli nusxalarini yuklashingiz mumkin. Hujjatlar PDF, JPG, PNG formatida bo'lishi kerak.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Iste'molchi huquqlari bo'yicha - Markaziy Bank</title>
      </Helmet>
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={handleBackToSubmissions}
              iconName="ArrowLeft"
              iconPosition="left"
              className="text-muted-foreground hover:text-foreground"
            >
              Orqaga
            </Button>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Iste'molchi huquqlari bo'yicha
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Huquqlaringizni himoya qiling va kerakli xizmatlardan foydalaning
            </p>
          </div>

          {/* Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {services.map((service) => (
              <div
                key={service.id}
                onClick={service.action}
                className="group relative bg-white dark:bg-slate-800 rounded-xl p-6 cursor-pointer hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 border border-gray-200 dark:border-slate-700"
              >
                {/* Icon in top-right corner */}
                <div
                  className={`absolute top-4 right-4 w-12 h-12 ${service.bgColor} rounded-lg flex items-center justify-center group-hover:opacity-80 transition-opacity duration-300`}
                >
                  <Icon
                    name={service.icon}
                    size={20}
                    className={service.color}
                  />
                </div>

                {/* Content */}
                <div className="space-y-3 pr-16">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Action */}
                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-700">
                  <div className="flex items-center text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300">
                    <span className="text-sm font-medium">Xizmatga kirish</span>
                    <Icon
                      name="ArrowRight"
                      size={16}
                      className="ml-2 group-hover:translate-x-1 transition-transform duration-300"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 md:p-8 border border-gray-200 dark:border-slate-700">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Tez-tez so'raladigan savollar
              </h2>
              <p className="text-sm text-muted-foreground">
                Iste'molchi huquqlari bo'yicha eng ko'p beriladigan savollarga
                javoblar
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors duration-200"
                  >
                    <span className="font-semibold text-foreground pr-4">
                      {faq.question}
                    </span>
                    <Icon
                      name={
                        openFaqIndex === index ? "ChevronUp" : "ChevronDown"
                      }
                      size={20}
                      className="text-muted-foreground flex-shrink-0"
                    />
                  </button>
                  {openFaqIndex === index && (
                    <div className="px-6 py-4 bg-gray-50 dark:bg-slate-700/30 border-t border-gray-200 dark:border-slate-700">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start space-x-4">
              <Icon
                name="Info"
                size={24}
                className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1"
              />
              <div>
                <h4 className="text-base font-semibold text-foreground mb-2">
                  Qo'shimcha yordam kerakmi?
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Agar savollaringizga javob topa olmasangiz yoki qo'shimcha
                  ma'lumot kerak bo'lsa, bizning qo'llab-quvvatlash xizmatimiz
                  bilan bog'laning:{" "}
                  <span className="font-semibold">+998 71 123 45 67</span>
                  yoki <span className="font-semibold">support@cbu.uz</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <div className="h-20"></div>
    </div>
  );
};

export default ConsumerRightsSubmission;
