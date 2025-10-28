import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import toast from "react-hot-toast";
import Navbar from "../../components/ui/Navbar";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Icon from "../../components/AppIcon";
import { appealsAPI } from "../../services/api";

const SubmitComplaint = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [telegramUserId, setTelegramUserId] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "+998 ",
    email: "",
    subject: "",
    description: "",
    isAnonymous: false,
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    // Telegram Web App dan user ma'lumotlarini olish
    const getTelegramUserData = () => {
      try {
        // Telegram Web App mavjudligini tekshirish
        if (window.Telegram && window.Telegram.WebApp) {
          console.log("Telegram WebApp found:", window.Telegram.WebApp);

          // Telegram Web App ni ishga tushirish
          window.Telegram.WebApp.ready();
          window.Telegram.WebApp.expand();

          // initDataUnsafe ni tekshirish
          if (
            window.Telegram.WebApp.initDataUnsafe &&
            window.Telegram.WebApp.initDataUnsafe.user
          ) {
            const user = window.Telegram.WebApp.initDataUnsafe.user;
            console.log("Telegram user data:", user);

            setTelegramUserId(user.id);
            return;
          }

          // initData ni tekshirish (agar initDataUnsafe ishlamasa)
          if (window.Telegram.WebApp.initData) {
            console.log(
              "Telegram initData found:",
              window.Telegram.WebApp.initData
            );
            // Bu yerda initData ni parse qilish kerak
          }
        }

        // Agar Telegram Web App mavjud bo'lmasa yoki ma'lumot olinmasa
        console.log("Telegram WebApp not available, using default user ID");
        setTelegramUserId(905770018);
      } catch (error) {
        console.error("Error getting Telegram user data:", error);
        setTelegramUserId(905770018);
      }
    };

    // Kichik kechikish bilan ishga tushirish
    const timer = setTimeout(getTelegramUserData, 500);

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
    const { name, value, type, checked, files } = e.target;

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
    } else if (type === "file") {
      setSelectedFile(files && files.length > 0 ? files[0] : null);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const generateReferenceNumber = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `CR${timestamp}${random}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare payload for backend API
      let payload;

      // If there's a file, use FormData, otherwise use regular JSON
      if (selectedFile) {
        payload = new FormData();
        payload.append("is_anonymous", formData.isAnonymous);
        payload.append(
          "full_name",
          formData.isAnonymous ? "" : formData.fullName
        );
        payload.append(
          "phone_number",
          formData.isAnonymous ? "" : formData.phone.replace(/\s+/g, "")
        );
        payload.append("email", formData.isAnonymous ? "" : formData.email);
        payload.append("subject", formData.subject);
        payload.append("message", formData.description);
        payload.append("attachment", selectedFile); // Add the file

        // Add Telegram user ID (always include default if not available)
        payload.append("user_id", telegramUserId || 905770018);
      } else {
        payload = {
          is_anonymous: formData.isAnonymous,
          full_name: formData.isAnonymous ? "" : formData.fullName,
          phone_number: formData.isAnonymous
            ? ""
            : formData.phone.replace(/\s+/g, ""),
          email: formData.isAnonymous ? "" : formData.email,
          subject: formData.subject,
          message: formData.description,
        };

        // Add Telegram user ID (always include default if not available)
        payload.user_id = telegramUserId || 905770018;
      }

      // Submit to backend API
      const response = await appealsAPI.submitAppeal(payload);

      const refNumber = generateReferenceNumber();
      setReferenceNumber(refNumber);

      // Create submission object for localStorage
      const submission = {
        id: refNumber,
        type: "consumer-rights",
        typeLabel: "Iste'molchi huquqlari",
        ...formData,
        status: "Ko'rib chiqilmoqda",
        submittedAt: new Date().toISOString(),
      };

      // Save to localStorage
      const existingSubmissions = JSON.parse(
        localStorage.getItem("submissions") || "[]"
      );
      existingSubmissions.push(submission);
      localStorage.setItem("submissions", JSON.stringify(existingSubmissions));

      // Show success toast
      toast.success("Murojaat muvaffaqiyatli yuborildi!");

      setShowSuccess(true);

      console.log("Complaint submitted:", response);
    } catch (error) {
      console.error("Error submitting:", error);

      // Parse field-specific errors from backend
      const backendErrors = error.response?.data;

      if (backendErrors && typeof backendErrors === "object") {
        const parsedErrors = {};
        let hasFieldErrors = false;

        // Map backend field names to frontend field names
        const fieldMapping = {
          full_name: "fullName",
          phone_number: "phone",
          email: "email",
          subject: "subject",
          message: "description",
        };

        // Extract errors for each field
        Object.keys(backendErrors).forEach((key) => {
          const frontendFieldName = fieldMapping[key] || key;
          const errorValue = backendErrors[key];

          // Handle array of errors or single error string
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
          // Show generic error if no field-specific errors found
          const errorMessage =
            backendErrors.message ||
            backendErrors.error ||
            "Murojaat yuborishda xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.";

          toast.error(
            Array.isArray(errorMessage) ? errorMessage[0] : errorMessage
          );
        }
      } else {
        // Show generic error
        toast.error(
          "Murojaat yuborishda xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate("/submissions/consumer-rights");
  };

  const handleBackToDashboard = () => {
    navigate("/home-dashboard");
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>Murojaat yuborildi - Markaziy Bank</title>
        </Helmet>
        <Navbar />
        <main className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 md:p-12 border border-gray-200 dark:border-slate-700">
              <div className="text-center space-y-6">
                <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                  <Icon
                    name="CheckCircle"
                    size={48}
                    className="text-green-600 dark:text-green-400"
                  />
                </div>
                <div className="space-y-3">
                  <h2 className="text-2xl font-bold text-foreground">
                    Murojaat muvaffaqiyatli yuborildi!
                  </h2>
                  <p className="text-muted-foreground">
                    Sizning murojaatingiz qabul qilindi va 3-5 ish kuni ichida
                    ko'rib chiqiladi. Murojaat holatini profilingizdagi
                    "Arizalarim" bo'limidan kuzatishingiz mumkin.
                  </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-muted-foreground mb-3 font-semibold">
                    Murojaat raqamingiz
                  </p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 tracking-wider">
                    {referenceNumber}
                  </p>
                  <p className="text-xs text-muted-foreground mt-3">
                    Bu raqamni eslab qoling, murojaat holatini kuzatish uchun
                    kerak bo'ladi
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
        <title>Murojaat yuborish - Markaziy Bank</title>
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
              Murojaat yuborish
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Iste'molchi huquqlari bo'yicha murojaatingizni yuboring
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
                    checked={formData.isAnonymous}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mt-0.5"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor="isAnonymous"
                      className="cursor-pointer font-medium text-foreground"
                    >
                      Anonim murojaat
                    </label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Shaxsiy ma'lumotlaringiz ko'rsatilmaydi
                    </p>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              {!formData.isAnonymous && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Shaxsiy ma'lumotlar
                    </h3>
                    <div className="space-y-4">
                      <Input
                        label="Ism va familiya"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Masalan: Karimov Karim"
                        required={!formData.isAnonymous}
                        error={fieldErrors.fullName}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Telefon raqam"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+998 XX XXX XX XX"
                          required={!formData.isAnonymous}
                          maxLength={17}
                          error={fieldErrors.phone}
                        />

                        <Input
                          label="Elektron pochta"
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
                  label="Murojaat mavzusi"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Qisqacha mavzu"
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
                    placeholder="Murojaatingizni batafsil yozing..."
                    required
                  />
                  {fieldErrors.description ? (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                      {fieldErrors.description}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-2">
                      Minimum 50 belgidan iborat bo'lishi kerak
                    </p>
                  )}
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Qo'shimcha hujjatlar (ixtiyoriy)
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-6 hover:border-blue-500 dark:hover:border-blue-400 transition-colors duration-200">
                  {selectedFile ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <Icon
                            name="FileText"
                            size={20}
                            className="text-blue-600 dark:text-blue-400"
                          />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium text-foreground truncate max-w-xs">
                            {selectedFile.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(selectedFile.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedFile(null)}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                      >
                        <Icon name="X" size={20} />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Icon
                        name="Upload"
                        size={32}
                        className="text-blue-600 dark:text-blue-400 mx-auto mb-3"
                      />
                      <input
                        type="file"
                        name="documents"
                        onChange={handleInputChange}
                        className="hidden"
                        id="file-upload"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                      >
                        Fayl tanlang
                      </label>
                      <p className="text-xs text-muted-foreground mt-2">
                        PDF, JPG, PNG, DOC (max 10MB)
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
                  disabled={isSubmitting}
                  className="flex-1"
                  iconName="Send"
                  iconPosition="left"
                >
                  {isSubmitting ? "Yuborilmoqda..." : "Murojaat yuborish"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <div className="h-20"></div>
    </div>
  );
};

export default SubmitComplaint;
