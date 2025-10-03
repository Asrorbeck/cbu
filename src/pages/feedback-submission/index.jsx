import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/ui/Navbar";
import FeedbackHeader from "./components/FeedbackHeader";
import FeedbackForm from "./components/FeedbackForm";
import SuccessModal from "./components/SuccessModal";
import Button from "../../components/ui/Button";
import Icon from "../../components/AppIcon";

const FeedbackSubmission = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || "en";
    setLanguage(savedLanguage);
  }, []);

  const translations = {
    en: {
      backToDashboard: "Back to Dashboard",
      pageTitle: "Feedback Submission - Central Bank",
    },
    "uz-latn": {
      backToDashboard: "Bosh sahifaga qaytish",
      pageTitle: "Fikr-mulohaza yuborish - Markaziy Bank",
    },
    "uz-cyrl": {
      backToDashboard: "Бош саҳифага қайтиш",
      pageTitle: "Фикр-мулоҳаза юбориш - Марказий Банк",
    },
    ru: {
      backToDashboard: "Вернуться на главную",
      pageTitle: "Отправка отзыва - Центральный Банк",
    },
  };

  const t = translations?.[language] || translations?.en;

  // Generate reference number
  const generateReferenceNumber = () => {
    const timestamp = Date.now()?.toString()?.slice(-6);
    const random = Math.random()?.toString(36)?.substring(2, 6)?.toUpperCase();
    return `FB${timestamp}${random}`;
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate reference number
      const refNumber = generateReferenceNumber();
      setReferenceNumber(refNumber);

      // Show success modal
      setShowSuccessModal(true);

      console.log("Feedback submitted:", {
        ...formData,
        referenceNumber: refNumber,
        submittedAt: new Date()?.toISOString(),
        language: language,
      });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      // In a real app, you would show an error message here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate("/home-dashboard");
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Set page title */}
      <title>{t?.pageTitle}</title>
      {/* Navigation */}
      <Navbar />
      {/* Main Content */}
      <main className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={handleBackToDashboard}
              iconName="ArrowLeft"
              iconPosition="left"
              className="text-muted-foreground hover:text-foreground"
            >
              {t?.backToDashboard}
            </Button>
          </div>

          {/* Header Section */}
          <FeedbackHeader />

          {/* Feedback Form Container */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-card border border-border rounded-2xl shadow-lg p-8">
              <FeedbackForm
                onSubmit={handleFormSubmit}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>

          {/* Additional Information */}
          <div className="max-w-2xl mx-auto mt-8">
            <div className="bg-muted/30 rounded-xl p-6">
              <div className="flex items-start space-x-4">
                <Icon name="Shield" size={24} className="text-primary mt-1" />
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">
                    {language === "en" && "Privacy & Security"}
                    {language === "uz-latn" && "Maxfiylik va xavfsizlik"}
                    {language === "uz-cyrl" && "Махфийлик ва хавфсизлик"}
                    {language === "ru" && "Конфиденциальность и безопасность"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === "en" &&
                      "Your feedback is confidential and will only be used to improve our services. We do not share personal information with third parties."}
                    {language === "uz-latn" &&
                      "Sizning fikr-mulohazangiz maxfiy bo'lib, faqat xizmatlarimizni yaxshilash uchun ishlatiladi. Biz shaxsiy ma'lumotlarni uchinchi shaxslarga bermayamiz."}
                    {language === "uz-cyrl" &&
                      "Сизнинг фикр-мулоҳазангиз махфий бўлиб, фақат хизматларимизни яхшилаш учун ишлатилади. Биз шахсий маълумотларни учинчи шахсларга бермаймиз."}
                    {language === "ru" &&
                      "Ваш отзыв конфиденциален и будет использоваться только для улучшения наших услуг. Мы не передаем личную информацию третьим лицам."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        referenceNumber={referenceNumber}
      />
      {/* Bottom navigation spacing - mobile only */}
      <div className="h-20 md:h-0"></div>
    </div>
  );
};

export default FeedbackSubmission;
