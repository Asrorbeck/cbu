import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Navbar from "../../components/ui/Navbar";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Icon from "../../components/AppIcon";

const CorruptionSubmission = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    fullName: "",
    phone: "+998 ",
    email: "",
    // Step 2: Address
    region: "",
    district: "",
    neighborhood: "",
    street: "",
    house: "",
    apartment: "",
    // Step 3: Complaint
    subject: "",
    description: "",
  });

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
    const { name, value } = e.target;

    if (name === "phone") {
      const formatted = formatPhoneNumber(value);
      setFormData((prev) => ({
        ...prev,
        [name]: formatted,
      }));
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
    return `AC${timestamp}${random}`;
  };

  const isStep1Valid = () => {
    // Check if phone has exactly 9 digits after +998
    const phoneDigits = formData.phone.replace(/\D/g, "").slice(3);
    return (
      formData.fullName.trim() !== "" &&
      phoneDigits.length === 9 &&
      formData.email.trim() !== ""
    );
  };

  const isStep2Valid = () => {
    return (
      formData.region.trim() !== "" &&
      formData.district.trim() !== "" &&
      formData.neighborhood.trim() !== "" &&
      formData.street.trim() !== "" &&
      formData.house.trim() !== "" &&
      formData.apartment.trim() !== ""
    );
  };

  const isStep3Valid = () => {
    return (
      formData.subject.trim() !== "" && formData.description.trim().length >= 50
    );
  };

  const handleNext = () => {
    if (currentStep === 1 && isStep1Valid()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && isStep2Valid()) {
      setCurrentStep(3);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isStep3Valid()) return;

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const refNumber = generateReferenceNumber();
      setReferenceNumber(refNumber);

      // Create submission object
      const submission = {
        id: refNumber,
        type: "corruption",
        typeLabel: "Korrupsiya",
        ...formData,
        status: "Ko'rib chiqilmoqda",
        submittedAt: new Date().toISOString(),
        submittedDate: new Date().toLocaleDateString("uz-UZ", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      };

      // Save to localStorage
      const existingSubmissions = JSON.parse(
        localStorage.getItem("submissions") || "[]"
      );
      existingSubmissions.push(submission);
      localStorage.setItem("submissions", JSON.stringify(existingSubmissions));

      setShowSuccess(true);

      console.log("Corruption report submitted:", submission);
    } catch (error) {
      console.error("Error submitting:", error);
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
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
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
              Ma'lumotlarni bosqichma-bosqich to'ldiring
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8 bg-white dark:bg-slate-800 rounded-xl p-4 md:p-6 border border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between relative">
              {/* Progress Line */}
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 dark:bg-slate-700 mx-5 md:mx-8">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                />
              </div>

              {/* Steps */}
              {[
                { num: 1, label: "Shaxsiy ma'lumotlar", short: "Shaxsiy" },
                { num: 2, label: "Manzil", short: "Manzil" },
                { num: 3, label: "Murojaat", short: "Murojaat" },
              ].map((step) => (
                <div
                  key={step.num}
                  className="flex flex-col items-center flex-1 relative z-10"
                >
                  <div
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold transition-all duration-200 shadow-md ${
                      currentStep >= step.num
                        ? "bg-blue-600 text-white scale-110"
                        : "bg-white dark:bg-slate-700 text-gray-400 dark:text-gray-500 border-2 border-gray-300 dark:border-slate-600"
                    }`}
                  >
                    {currentStep > step.num ? (
                      <Icon
                        name="Check"
                        size={20}
                        className="animate-in fade-in zoom-in duration-200"
                      />
                    ) : (
                      <span className="text-sm md:text-base">{step.num}</span>
                    )}
                  </div>
                  <p
                    className={`text-xs md:text-sm mt-2 md:mt-3 font-medium text-center transition-colors duration-200 ${
                      currentStep >= step.num
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    <span className="hidden md:inline">{step.label}</span>
                    <span className="md:hidden">{step.short}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 md:p-8 border border-gray-200 dark:border-slate-700">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
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
                      />

                      <Input
                        label="Bog'lanish uchun telefon nomeri"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+998 XX XXX XX XX"
                        required
                        maxLength={17}
                      />

                      <Input
                        label="Elektron pochta manzili"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="example@mail.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start space-x-3">
                      <Icon
                        name="Info"
                        size={20}
                        className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
                      />
                      <p className="text-sm text-muted-foreground">
                        Barcha maydonlar to'ldirilgandan keyin keyingi bosqichga
                        o'tishingiz mumkin.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Address */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Yashash manzili
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Viloyat"
                          name="region"
                          value={formData.region}
                          onChange={handleInputChange}
                          placeholder="Masalan: Toshkent"
                          required
                        />

                        <Input
                          label="Shahar/Tuman"
                          name="district"
                          value={formData.district}
                          onChange={handleInputChange}
                          placeholder="Masalan: Chilonzor tumani"
                          required
                        />
                      </div>

                      <Input
                        label="MFY (Mahalla fuqarolar yig'ini)"
                        name="neighborhood"
                        value={formData.neighborhood}
                        onChange={handleInputChange}
                        placeholder="Masalan: Qatortol MFY"
                        required
                      />

                      <Input
                        label="Ko'cha"
                        name="street"
                        value={formData.street}
                        onChange={handleInputChange}
                        placeholder="Masalan: Amir Temur ko'chasi"
                        required
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Uy"
                          name="house"
                          value={formData.house}
                          onChange={handleInputChange}
                          placeholder="Uy raqami"
                          required
                        />

                        <Input
                          label="Xonadon"
                          name="apartment"
                          value={formData.apartment}
                          onChange={handleInputChange}
                          placeholder="Kvartira raqami"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Complaint Details */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Murojaat tafsilotlari
                    </h3>
                    <div className="space-y-4">
                      <Input
                        label="Murojaatning qisqacha mazmuni"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="Murojaat mavzusini qisqacha yozing"
                        required
                      />

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Murojaat matni <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows={8}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-foreground focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                          placeholder="Murojaatingizni batafsil va aniq yozing. Hodisani, shaxslarni, sanalarni va boshqa muhim tafsilotlarni ko'rsating..."
                          required
                        />
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
                      </div>
                    </div>
                  </div>

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
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    iconName="ArrowLeft"
                    iconPosition="left"
                    className="flex-1"
                  >
                    Orqaga
                  </Button>
                )}

                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={
                      (currentStep === 1 && !isStep1Valid()) ||
                      (currentStep === 2 && !isStep2Valid())
                    }
                    iconName="ArrowRight"
                    iconPosition="right"
                    className="flex-1"
                  >
                    Keyingisi
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting || !isStep3Valid()}
                    iconName="Send"
                    iconPosition="left"
                    className="flex-1"
                  >
                    {isSubmitting ? "Yuborilmoqda..." : "Xabarni yuborish"}
                  </Button>
                )}
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
      <div className="h-20 md:h-0"></div>
    </div>
  );
};

export default CorruptionSubmission;
