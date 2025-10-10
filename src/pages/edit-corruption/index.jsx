import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import Navbar from "../../components/ui/Navbar";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Icon from "../../components/AppIcon";

const EditCorruption = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [originalSubmission, setOriginalSubmission] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "+998 ",
    email: "",
    region: "",
    district: "",
    neighborhood: "",
    street: "",
    house: "",
    apartment: "",
    subject: "",
    description: "",
  });

  useEffect(() => {
    // Load submission from localStorage
    const submissions = JSON.parse(localStorage.getItem("submissions") || "[]");
    const submission = submissions.find((sub) => sub.id === id);

    if (submission && submission.type === "corruption") {
      setOriginalSubmission(submission);
      setFormData({
        fullName: submission.fullName || "",
        phone: submission.phone || "+998 ",
        email: submission.email || "",
        region: submission.region || "",
        district: submission.district || "",
        neighborhood: submission.neighborhood || "",
        street: submission.street || "",
        house: submission.house || "",
        apartment: submission.apartment || "",
        subject: submission.subject || "",
        description: submission.description || "",
      });
    } else {
      // If not found or wrong type, redirect back
      navigate("/applications");
    }
  }, [id, navigate]);

  const formatPhoneNumber = (value) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length === 0) return "+998 ";
    const phoneDigits = digits.startsWith("998") ? digits.slice(3) : digits;
    const limitedDigits = phoneDigits.slice(0, 9);

    let formatted = "+998 ";
    if (limitedDigits.length > 0) formatted += limitedDigits.slice(0, 2);
    if (limitedDigits.length > 2) formatted += " " + limitedDigits.slice(2, 5);
    if (limitedDigits.length > 5) formatted += " " + limitedDigits.slice(5, 7);
    if (limitedDigits.length > 7) formatted += " " + limitedDigits.slice(7, 9);

    return formatted;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const formatted = formatPhoneNumber(value);
      setFormData((prev) => ({ ...prev, [name]: formatted }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const isStep1Valid = () => {
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
    if (currentStep === 1 && isStep1Valid()) setCurrentStep(2);
    else if (currentStep === 2 && isStep2Valid()) setCurrentStep(3);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Prevent form submission on steps 1 and 2
    if (currentStep !== 3) {
      return;
    }
  };

  const handleSave = async () => {
    if (!isStep3Valid()) return;

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update submission in localStorage
      const submissions = JSON.parse(
        localStorage.getItem("submissions") || "[]"
      );
      const updatedSubmissions = submissions.map((sub) => {
        if (sub.id === id) {
          return {
            ...sub,
            ...formData,
            updatedAt: new Date().toISOString(),
          };
        }
        return sub;
      });

      localStorage.setItem("submissions", JSON.stringify(updatedSubmissions));

      // Navigate back to application detail
      navigate(`/applications/${id}`);
    } catch (error) {
      console.error("Error updating submission:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/applications/${id}`);
  };

  if (!originalSubmission) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <Icon
                name="AlertCircle"
                size={64}
                className="text-gray-400 mx-auto mb-4"
              />
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Murojaat topilmadi
              </h2>
              <Button onClick={() => navigate("/applications")}>
                Arizalarga qaytish
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Murojaatni tahrirlash - Markaziy Bank</title>
      </Helmet>
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={handleCancel}
              iconName="ArrowLeft"
              iconPosition="left"
              className="text-muted-foreground hover:text-foreground"
            >
              Bekor qilish
            </Button>
          </div>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Murojaatni tahrirlash
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Ma'lumotlarni yangilang (Murojaat raqami: {id})
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8 bg-white dark:bg-slate-800 rounded-xl p-4 md:p-6 border border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 dark:bg-slate-700 mx-5 md:mx-8">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                />
              </div>

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
            <form onSubmit={handleFormSubmit} className="space-y-6">
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
                          placeholder="Murojaatingizni batafsil va aniq yozing..."
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

                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start space-x-3">
                      <Icon
                        name="Info"
                        size={20}
                        className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
                      />
                      <p className="text-sm text-muted-foreground">
                        O'zgartirishlar saqlanadi va murojaat qayta ko'rib
                        chiqiladi.
                      </p>
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
                    type="button"
                    onClick={handleSave}
                    disabled={isSubmitting || !isStep3Valid()}
                    iconName="Save"
                    iconPosition="left"
                    className="flex-1"
                  >
                    {isSubmitting ? "Saqlanmoqda..." : "O'zgarishlarni saqlash"}
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>
      <div className="h-20 md:h-0"></div>
    </div>
  );
};

export default EditCorruption;
