import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import toast from "react-hot-toast";
import Navbar from "../../components/ui/Navbar";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Icon from "../../components/AppIcon";
import { spellingReportsAPI } from "../../services/api";

const LanguageErrorSubmission = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [telegramUserId, setTelegramUserId] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "+998 ",
    textSnippet: "",
    sourceUrl: "",
    description: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);

  // Get Telegram user ID
  useEffect(() => {
    const getTelegramUserId = () => {
      try {
        if (window.Telegram && window.Telegram.WebApp) {
          window.Telegram.WebApp.ready();
          window.Telegram.WebApp.expand();

          if (
            window.Telegram.WebApp.initDataUnsafe &&
            window.Telegram.WebApp.initDataUnsafe.user
          ) {
            const userId = window.Telegram.WebApp.initDataUnsafe.user.id;
            console.log("Telegram user ID:", userId);
            setTelegramUserId(userId);
            return;
          }
        }

        console.log("Telegram WebApp not available");
        setTelegramUserId(null);
      } catch (error) {
        console.error("Error getting Telegram user ID:", error);
        setTelegramUserId(null);
      }
    };

    const timer = setTimeout(getTelegramUserId, 500);
    return () => clearTimeout(timer);
  }, []);

  const formatPhoneNumber = (value) => {
    const digits = value.replace(/\D/g, "");

    if (digits.length === 0) {
      return "+998 ";
    }

    const phoneDigits = digits.startsWith("998") ? digits.slice(3) : digits;
    const limitedDigits = phoneDigits.slice(0, 9);

    let formatted = "+998 ";
    if (limitedDigits.length > 0) {
      formatted += limitedDigits.slice(0, 2);
    }
    if (limitedDigits.length > 2) {
      formatted += " " + limitedDigits.slice(2, 5);
    }
    if (limitedDigits.length > 5) {
      formatted += " " + limitedDigits.slice(5, 7);
    }
    if (limitedDigits.length > 7) {
      formatted += " " + limitedDigits.slice(7, 9);
    }

    return formatted;
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "phone") {
      const formatted = formatPhoneNumber(value);
      setFormData((prev) => ({
        ...prev,
        [name]: formatted,
      }));
    } else if (files && files.length > 0) {
      const file = files[0];
      const maxSize = 50 * 1024 * 1024; // 50 MB
      
      if (file.size > maxSize) {
        toast.error("Fayl hajmi 50 MB dan katta bo'lishi mumkin emas");
        return;
      }
      
      setSelectedFile(file);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const generateReferenceNumber = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `LE${timestamp}${random}`;
  };

  const isFormValid = () => {
    const phoneDigits = formData.phone.replace(/\D/g, "").slice(3);
    return (
      formData.fullName.trim() !== "" &&
      phoneDigits.length === 9 &&
      formData.description.trim().length >= 20
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      toast.error("Iltimos, barcha maydonlarni to'ldiring");
      return;
    }

    setIsSubmitting(true);

    try {
      // Clean phone number
      const cleanPhone = formData.phone.replace(/\s/g, "");

      // Prepare payload
      const payload = new FormData();
      payload.append("chat_user_id", telegramUserId || 905770018);
      payload.append("full_name", formData.fullName.trim());
      payload.append("phone_number", cleanPhone);
      payload.append("error_type", "spelling");
      if (formData.textSnippet.trim()) {
        payload.append("text_snippet", formData.textSnippet.trim());
      }
      if (formData.sourceUrl.trim()) {
        payload.append("source_url", formData.sourceUrl.trim());
      }
      payload.append("description", formData.description.trim());

      if (selectedFile) {
        payload.append("attachment", selectedFile);
      }

      console.log("Submitting language error report:", payload);

      const response = await spellingReportsAPI.submitReport(payload);

      const refNumber =
        response?.reference_number || generateReferenceNumber();
      setReferenceNumber(refNumber);

      // Save to localStorage
      const submission = {
        id: refNumber,
        type: "language-error",
        typeLabel: "Til xatolari",
        ...formData,
        status: "Ko'rib chiqilmoqda",
        submittedAt: new Date().toISOString(),
      };

      const existingSubmissions = JSON.parse(
        localStorage.getItem("submissions") || "[]"
      );
      existingSubmissions.push(submission);
      localStorage.setItem("submissions", JSON.stringify(existingSubmissions));

      toast.success("Murojaat muvaffaqiyatli yuborildi!");
      setShowSuccess(true);

      setFormData({
        fullName: "",
        phone: "+998 ",
        textSnippet: "",
        sourceUrl: "",
        description: "",
      });
      setSelectedFile(null);
    } catch (error) {
      console.error("Error submitting:", error);
      toast.error(
        "Murojaat yuborishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate("/submissions");
  };

  const handleBackToDashboard = () => {
    navigate("/home-dashboard");
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>Xabar yuborildi - Markaziy Bank</title>
        </Helmet>
        <Navbar />
        <main className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 md:p-12 border border-gray-200 dark:border-slate-700">
              <div className="text-center space-y-6">
                <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                  <Icon
                    name="ShieldCheck"
                    size={48}
                    className="text-green-600 dark:text-green-400"
                  />
                </div>
                <div className="space-y-3">
                  <h2 className="text-2xl font-bold text-foreground">
                    Murojaat muvaffaqiyatli yuborildi!
                  </h2>
                  <p className="text-muted-foreground">
                    Sizning murojaatingiz qabul qilindi va tezda ko'rib chiqiladi.
                    Murojaat holatini profilingizdagi "Arizalarim" bo'limidan
                    kuzatishingiz mumkin.
                  </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-muted-foreground mb-3 font-semibold">
                    Murojaat raqami
                  </p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 tracking-wider font-mono">
                    {referenceNumber}
                  </p>
                  <p className="text-xs text-muted-foreground mt-3">
                    Bu raqamni saqlang. Murojaat holatini tekshirish uchun
                    foydalaning.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    iconName="ArrowLeft"
                    iconPosition="left"
                    className="flex-1"
                  >
                    Orqaga
                  </Button>
                  <Button onClick={handleBackToDashboard} className="flex-1">
                    Bosh sahifa
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Til xatolari haqida xabar berish - Markaziy Bank</title>
      </Helmet>
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={handleBack}
              iconName="ArrowLeft"
              iconPosition="left"
              className="text-muted-foreground hover:text-foreground"
            >
              Orqaga
            </Button>
          </div>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              {t("submissions.language_error_submission.page_title")}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              {t("submissions.language_error_submission.subtitle")}
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 md:p-8 border border-gray-200 dark:border-slate-700">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <Input
                label="F.I.SH (To'liq)"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Masalan: Karimov Karim Karimovich"
                required
              />

              {/* Phone Number */}
              <Input
                label={t("submissions.language_error_submission.phone_label")}
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+998 XX XXX XX XX"
                required
                maxLength={17}
              />

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Xatolik haqida batafsil ma'lumot{" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={8}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-foreground focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                  placeholder="Xatolik qayerda topilgan, qanday xatolik ekanligi va to'g'ri variantini yozing..."
                  required
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-muted-foreground">
                    Minimum 20 belgi kerak
                  </p>
                  <p
                    className={`text-xs ${
                      formData.description.length >= 20
                        ? "text-green-600 dark:text-green-400"
                        : "text-muted-foreground"
                    }`}
                  >
                    {formData.description.length} / 20
                  </p>
                </div>
              </div>

              {/* Source URL */}
              <Input
                label="Manba havolasi (URL)"
                name="sourceUrl"
                type="url"
                value={formData.sourceUrl}
                onChange={handleInputChange}
                placeholder="https://..."
              />

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Fayl yuklash (ixtiyoriy)
                </label>
                <div className="mt-1">
                  {selectedFile ? (
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600">
                      <div className="flex items-center space-x-3">
                        <Icon
                          name="File"
                          size={20}
                          className="text-blue-600 dark:text-blue-400"
                        />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {selectedFile.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {selectedFile.size > 1024 * 1024
                              ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
                              : `${(selectedFile.size / 1024).toFixed(2)} KB`}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeFile}
                        iconName="X"
                        className="text-red-600 hover:text-red-700"
                      >
                        Olib tashlash
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 dark:border-slate-600 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Icon
                          name="Upload"
                          size={32}
                          className="text-gray-400 dark:text-gray-500 mb-2"
                        />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Fayl yuklash</span> yoki
                          bu yerga sudrab tashlang
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PNG, JPG, PDF, HEIC, MP3, MP4, DNG, MOV va boshqalar (MAX. 50MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleInputChange}
                        accept="image/*,.pdf,.heic,.heif,.mp3,.mp4,.dng,.mov,.avi,.mkv,.wav,.m4a"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start space-x-3">
                  <Icon
                    name="Info"
                    size={20}
                    className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
                  />
                  <p className="text-sm text-muted-foreground">
                    Iltimos, xatolikni batafsil va aniq tasvirlab bering. Qayerda
                    topilgani, qanday xatolik ekanligi va to'g'ri variantini
                    ko'rsating.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  iconName="ArrowLeft"
                  iconPosition="left"
                  className="flex-1"
                >
                  Orqaga
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !isFormValid()}
                  iconName="Send"
                  iconPosition="left"
                  className="flex-1"
                >
                  {isSubmitting ? "Yuborilmoqda..." : "Murojaatni yuborish"}
                </Button>
              </div>
            </form>
          </div>

          {/* FAQ Section */}
          <div className="mt-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 md:p-8 border border-gray-200 dark:border-slate-700">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Tez-tez so'raladigan savollar
              </h2>
              <p className="text-sm text-muted-foreground">
                {t("submissions.language_error_submission.faq_subtitle")}
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  question: "Qanday xatoliklarni yuborishim mumkin?",
                  answer:
                    "Siz tashkilot saytlarida, xabarlarida, hujjatlarida yoki boshqa harakatlarida topilgan o'zbek tilidagi imlo, grammatika, terminologiya va boshqa til xatolarini yuborishingiz mumkin.",
                },
                {
                  question: "Murojaatim qancha muddat ichida ko'rib chiqiladi?",
                  answer:
                    "Til xatolari haqidagi murojaatlar 3-5 ish kuni ichida ko'rib chiqiladi. Xatolik tasdiqlangandan so'ng, tegishli bo'limlarga yuboriladi va tuzatiladi.",
                },
                {
                  question: "Fayl yuklash majburiymi?",
                  answer:
                    "Yo'q, fayl yuklash ixtiyoriy. Lekin agar xatolikni ko'rsatadigan skrinshot yoki hujjat bo'lsa, uni yuklashingiz tavsiya etiladi.",
                },
                {
                  question: "Qanday fayl formatlari qabul qilinadi?",
                  answer:
                    "Rasmlar (PNG, JPG) va hujjatlar (PDF) formatida fayllarni yuklashingiz mumkin. Maksimal fayl hajmi 10MB.",
                },
              ].map((faq, index) => (
                <div
                  key={index}
                  className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => {
                      const newIndex = openFaqIndex === index ? null : index;
                      setOpenFaqIndex(newIndex);
                    }}
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
                      className={`text-muted-foreground flex-shrink-0 transition-transform duration-300 ${
                        openFaqIndex === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      openFaqIndex === index
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-6 py-4 bg-gray-50 dark:bg-slate-700/30 border-t border-gray-200 dark:border-slate-700">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <div className="h-20"></div>
    </div>
  );
};

export default LanguageErrorSubmission;

