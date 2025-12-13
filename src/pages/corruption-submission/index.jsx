import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import Navbar from "../../components/ui/Navbar";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Icon from "../../components/AppIcon";
import { reportsAPI } from "../../services/api";

const CorruptionSubmission = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [telegramUserId, setTelegramUserId] = useState(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "+998 ",
    email: "",
    subject: "",
    description: "",
  });

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

        // Fallback if Telegram WebApp is not available
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
    // Remove all non-digits
    const digits = value.replace(/\D/g, "");

    // If empty, return +998
    if (digits.length === 0) {
      return "+998 ";
    }

    // If starts with 998, remove it
    const phoneDigits = digits.startsWith("998") ? digits.slice(3) : digits;

    // Limit to 9 digits after +998
    const limitedDigits = phoneDigits.slice(0, 9);

    // Format: +998 XX XXX XX XX
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
    const { name, value, type, checked } = e.target;

    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    if (name === "phone") {
      const formatted = formatPhoneNumber(value);
      setFormData((prev) => ({
        ...prev,
        [name]: formatted,
      }));
    } else if (name === "isAnonymous") {
      setIsAnonymous(checked);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Encode backend ID to reference number format
  const encodeReferenceNumber = (backendId) => {
    if (!backendId) return null;

    const id =
      typeof backendId === "number" ? backendId : parseInt(backendId, 10);
    if (isNaN(id)) return null;

    const salt = 1234567;
    const encoded = (id * salt).toString(36).toUpperCase();
    const padded = encoded.substring(0, 8).padStart(8, "0");
    const checksum = ((id % 100) + 36)
      .toString(36)
      .toUpperCase()
      .padStart(2, "0");

    return `AC${padded}${checksum}`;
  };

  const generateReferenceNumber = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `AC${timestamp}${random}`;
  };

  const isFormValid = () => {
    if (!formData.subject.trim()) return false;
    if (formData.description.trim().length < 50) return false;
    if (!isAnonymous) {
      const phoneDigits = formData.phone.replace(/\D/g, "").slice(3);
      // full_name va phone_number required, email optional
      if (!formData.fullName.trim() || phoneDigits.length !== 9) {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      toast.error("Iltimos, barcha maydonlarni to'ldiring");
      return;
    }

    setIsSubmitting(true);

    try {
      // Clean phone number (remove spaces and keep only digits with +)
      const cleanPhone = formData.phone.replace(/\s/g, "");

      // Get current language and convert to backend format
      const currentLang = i18n.language || localStorage.getItem("language") || "uz-Latn";
      let languageValue;
      if (currentLang === "uz-Latn") {
        languageValue = "O'zbekcha";
      } else if (currentLang === "uz-Cyrl") {
        languageValue = "Ўзбекча";
      } else if (currentLang === "ru") {
        languageValue = "Русский";
      } else {
        languageValue = "O'zbekcha"; // default
      }

      // Prepare payload for backend
      const payload = {
        full_name: isAnonymous ? null : formData.fullName.trim(),
        phone_number: isAnonymous ? "" : cleanPhone,
        email: isAnonymous ? null : formData.email.trim() || null,
        summary: formData.subject.trim(),
        message_text: formData.description.trim(),
        language: languageValue,
        is_anonymous: isAnonymous,
        user_id: telegramUserId || 905770018,
      };

      console.log("Submitting report to backend:", payload);

      // Submit to backend
      const response = await reportsAPI.submitReport(payload);
      console.log("Backend response:", response);

      // Generate reference number from backend ID (encode it)
      let refNumber;
      if (response.id) {
        refNumber = encodeReferenceNumber(response.id);
        console.log(
          "Encoded reference number from backend ID:",
          response.id,
          "->",
          refNumber
        );
      } else if (response.reference_number) {
        refNumber = response.reference_number;
      } else {
        refNumber = generateReferenceNumber();
      }
      setReferenceNumber(refNumber);

      // Also save to localStorage for local tracking
      const submission = {
        id: refNumber,
        type: "corruption",
        typeLabel: "Korrupsiya",
        ...formData,
        status: "Ko'rib chiqilmoqda",
        submittedAt: new Date().toISOString(),
        backendId: response.id,
      };

      const existingSubmissions = JSON.parse(
        localStorage.getItem("submissions") || "[]"
      );
      existingSubmissions.push(submission);
      localStorage.setItem("submissions", JSON.stringify(existingSubmissions));

      // Show success message
      toast.success("Xabar muvaffaqiyatli yuborildi!");
      setShowSuccess(true);
    } catch (error) {
      console.error("Error submitting report:", error);

      // Parse field-specific errors from backend
      const backendErrors = error.response?.data;
      if (backendErrors && typeof backendErrors === "object") {
        const parsedErrors = {};
        let hasFieldErrors = false;

        const fieldMapping = {
          full_name: "fullName",
          phone_number: "phone",
          email: "email",
          summary: "subject",
          message_text: "description",
        };

        Object.keys(backendErrors).forEach((key) => {
          const frontendFieldName = fieldMapping[key] || key;
          const errorValue = backendErrors[key];

          if (Array.isArray(errorValue) && errorValue.length > 0) {
            parsedErrors[frontendFieldName] = errorValue[0];
            hasFieldErrors = true;
          } else if (typeof errorValue === "string") {
            parsedErrors[frontendFieldName] = errorValue;
            hasFieldErrors = true;
          }
        });

        if (hasFieldErrors) {
          setFieldErrors(parsedErrors);
          toast.error("Iltimos, formadagi xatolarni tuzating");
        } else {
          const errorMessage =
            backendErrors.message ||
            backendErrors.error ||
            "Xabar yuborishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.";
          toast.error(
            Array.isArray(errorMessage) ? errorMessage[0] : errorMessage
          );
        }
      } else {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.detail ||
          error.message ||
          "Xabar yuborishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.";
        toast.error(errorMessage);
      }
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
                    Xabar muvaffaqiyatli yuborildi!
                  </h2>
                  <p className="text-muted-foreground">
                    Sizning xabaringiz maxfiy tarzda qabul qilindi va tezda
                    tekshiriladi. Xabar holatini profilingizdagi "Arizalarim"
                    bo'limidan kuzatishingiz mumkin.
                  </p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
                  <p className="text-sm text-muted-foreground mb-3 font-semibold">
                    Maxfiy raqam
                  </p>
                  <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 tracking-wider font-mono">
                    {referenceNumber}
                  </p>
                  <p className="text-xs text-muted-foreground mt-3">
                    Bu maxfiy raqamni saqlang. Xabar holatini tekshirish uchun
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
        <title>Korrupsiya haqida xabar berish - Markaziy Bank</title>
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
              Korrupsiya haqida xabar berish
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Korrupsiya haqidagi xabaringizni yuboring
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 md:p-8 border border-gray-200 dark:border-slate-700">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Anonymous Checkbox */}
              <div className="bg-gray-50 dark:bg-slate-700/30 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="isAnonymous"
                    name="isAnonymous"
                    checked={isAnonymous}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mt-0.5"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor="isAnonymous"
                      className="cursor-pointer font-medium text-foreground"
                    >
                      Anonim sorov
                    </label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Shaxsiy ma'lumotlaringiz ko'rsatilmaydi
                    </p>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              {!isAnonymous && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Shaxsiy ma'lumotlar
                    </h3>
                    <div className="space-y-4">
                      <Input
                        label="F.I.SH (To'liq)"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Masalan: Karimov Karim Karimovich"
                        required
                        error={fieldErrors.fullName}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Bog'lanish uchun telefon nomeri"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+998 XX XXX XX XX"
                          required
                          maxLength={17}
                          error={fieldErrors.phone}
                        />

                        <Input
                          label="Elektron pochta manzili"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="example@mail.com"
                          error={fieldErrors.email}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Complaint Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Murojaat tafsilotlari
                </h3>

                <Input
                  label="Murojaatning qisqacha mazmuni"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Murojaat mavzusini qisqacha yozing"
                  required
                  error={fieldErrors.subject}
                />

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      fieldErrors.description
                        ? "text-red-600 dark:text-red-400"
                        : "text-foreground"
                    }`}
                  >
                    Murojaat matni <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={6}
                    className={`w-full px-4 py-3 rounded-lg border bg-white dark:bg-slate-700 text-foreground focus:ring-2 focus:border-transparent transition-all duration-200 ${
                      fieldErrors.description
                        ? "border-red-500 dark:border-red-400 focus:ring-red-500 dark:focus:ring-red-400"
                        : "border-gray-300 dark:border-slate-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                    }`}
                    placeholder="Murojaatingizni batafsil va aniq yozing. Hodisani, shaxslarni, sanalarni va boshqa muhim tafsilotlarni ko'rsating..."
                    required
                  />
                  {fieldErrors.description ? (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                      {fieldErrors.description}
                    </p>
                  ) : (
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-muted-foreground">
                        Minimum 50 belgi kerak
                      </p>
                      <p
                        className={`text-xs ${
                          formData.description.length >= 50
                            ? "text-green-600 dark:text-green-400"
                            : "text-muted-foreground"
                        }`}
                      >
                        {formData.description.length} / 50
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start space-x-3">
                  <Icon
                    name="Shield"
                    size={20}
                    className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-1">
                      Maxfiylik kafolati
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Sizning shaxsiy ma'lumotlaringiz maxfiy saqlanadi va faqat
                      tegishli bo'limlar tomonidan ko'rib chiqiladi.
                    </p>
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                <div className="flex items-start space-x-3">
                  <Icon
                    name="ShieldAlert"
                    size={20}
                    className="text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-1">
                      Ogohlantirish
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Yolg'on xabar berish qonunga xilof. Faqat haqiqiy va
                      ishonchli ma'lumotlarni yuboring.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1"
                >
                  Bekor qilish
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !isFormValid()}
                  className="flex-1"
                  iconName="Send"
                  iconPosition="left"
                >
                  {isSubmitting ? "Yuborilmoqda..." : "Xabarni yuborish"}
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
                Korrupsiya haqida xabar berish bo'yicha savollarga javoblar
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  question: "Korrupsiya nima?",
                  answer:
                    "Korrupsiya - bu davlat xizmatchilari yoki mansabdor shaxslar tomonidan o'z lavozim vakolatlaridan shaxsiy manfaatlar uchun suiiste'mol qilish. Bu pora olish/berish, o'zlashtirish, vakolatdan suiiste'mol qilish va boshqa qonunga xilof harakatlarni o'z ichiga oladi.",
                },
                {
                  question:
                    "Mening xabarim qancha muddat ichida ko'rib chiqiladi?",
                  answer:
                    "Korrupsiya haqidagi xabarlar maxsus komissiya tomonidan 5-10 ish kuni ichida ko'rib chiqiladi. Murakkab holatlarda chuqurroq tekshiruv o'tkazilishi mumkin. Xabar holati haqida maxfiy raqamingiz orqali ma'lumot olishingiz mumkin.",
                },
                {
                  question: "Xabarim maxfiy bo'ladimi?",
                  answer:
                    "Ha, sizning barcha ma'lumotlaringiz va xabar tafsilotlari to'liq maxfiy saqlanadi. Faqat maxsus vakolatli organlar xabarni ko'rib chiqadi. Hech qanday ma'lumot uchinchi shaxslarga yoki ommaga berilmaydi.",
                },
                {
                  question: "Qanday dalillar kerak bo'ladi?",
                  answer:
                    "Agar mavjud bo'lsa: foto/video dalillar, audio yozuvlar, hujjat nusxalari, SMS/email xabarlar, guvohlar ma'lumotlari va boshqa dalillarni yuklashingiz mumkin. Dalillar bo'lmasa ham, batafsil tavsif asosida tekshiruv o'tkaziladi.",
                },
                {
                  question: "Yolg'on xabar berish uchun javobgarlik bormi?",
                  answer:
                    "Ha, ataylab yolg'on xabar berish qonunga xilof va javobgarlikka tortilishi mumkin. Shuning uchun faqat haqiqiy va ishonchli ma'lumotlarni yuboring. Agar noaniq bo'lsangiz, mavjud ma'lumotlaringizni to'liq va aniq tasvirlab bering.",
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

          {/* Warning Info */}
          <div className="mt-8 bg-orange-50 dark:bg-orange-900/20 rounded-lg p-6 border border-orange-200 dark:border-orange-800">
            <div className="flex items-start space-x-4">
              <Icon
                name="ShieldAlert"
                size={24}
                className="text-orange-600 dark:text-orange-400 flex-shrink-0 mt-1"
              />
              <div>
                <h4 className="text-base font-semibold text-foreground mb-2">
                  Muhim eslatma
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Korrupsiya haqidagi xabarlar jiddiy ko'rib chiqiladi. Yolg'on
                  xabar berish qonunga xilof hisoblanadi. Agar yordam kerak
                  bo'lsa:{" "}
                  <span className="font-semibold">+998 71 123 45 67</span> yoki{" "}
                  <span className="font-semibold">anticorruption@cbu.uz</span>
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

export default CorruptionSubmission;
