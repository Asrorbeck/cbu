import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import toast from "react-hot-toast";
import Navbar from "../../components/ui/Navbar";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Icon from "../../components/AppIcon";
import { organizationAPI } from "../../services/api";
import { formatDate } from "../../utils/dateFormatter";

const CheckLicense = () => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [licenseData, setLicenseData] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const [formData, setFormData] = useState({
    inn: "",
    licenseNumber: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setNotFound(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.inn.trim() && !formData.licenseNumber.trim()) {
      toast.error("Iltimos, kamida INN yoki litsenziya raqamini kiriting");
      return;
    }

    setIsChecking(true);
    setNotFound(false);

    try {
      const params = {};
      if (formData.inn.trim()) params.inn = formData.inn.trim();
      if (formData.licenseNumber.trim())
        params.license_number = formData.licenseNumber.trim();

      const response = await organizationAPI.checkLicense(params);

      if (response && response.length > 0) {
        // Found organization
        setLicenseData(response[0]);
        setShowResult(true);
        toast.success("Tashkilot topildi!");
      } else {
        // Not found
        setNotFound(true);
        toast.error(
          "Tashkilot topilmadi. Iltimos, ma'lumotlarni qayta tekshiring."
        );
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Litsenziyani tekshirishda xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.";

      toast.error(errorMessage);
      setNotFound(true);
    } finally {
      setIsChecking(false);
    }
  };

  const handleBack = () => {
    navigate("/submissions/consumer-rights");
  };

  const handleCheckAnother = () => {
    setShowResult(false);
    setLicenseData(null);
    setNotFound(false);
    setFormData({
      inn: "",
      licenseNumber: "",
    });
  };

  if (showResult && licenseData) {
    return (
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>Litsenziya ma'lumotlari - Markaziy Bank</title>
        </Helmet>
        <Navbar />
        <main className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 md:p-8 border border-gray-200 dark:border-slate-700">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon
                    name="CheckCircle"
                    size={40}
                    className="text-green-600 dark:text-green-400"
                  />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Tashkilot topildi
                </h2>
                <p className="text-sm text-muted-foreground">
                  Tashkilot ma'lumotlari quyida keltirilgan
                </p>
              </div>

              <div className="space-y-4">
                {/* Organization Name - Full Width */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <p className="text-xs text-muted-foreground mb-2">
                    Tashkilot nomi
                  </p>
                  <p className="font-semibold text-foreground text-lg">
                    {licenseData.name}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-slate-700/30 rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-1">INN</p>
                    <p className="font-semibold text-foreground text-lg">
                      {licenseData.inn}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-slate-700/30 rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-1">
                      Litsenziya raqami
                    </p>
                    <p className="font-semibold text-foreground text-lg">
                      {licenseData.license_number}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-slate-700/30 rounded-lg p-4 md:col-span-2">
                    <p className="text-xs text-muted-foreground mb-1">
                      Litsenziya berilgan sana
                    </p>
                    <p className="font-semibold text-foreground">
                      {formatDate(licenseData.issuance_license)}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-slate-700/30 rounded-lg p-4 md:col-span-2">
                    <p className="text-xs text-muted-foreground mb-2">Manzil</p>
                    <p className="font-medium text-foreground">
                      {licenseData.address}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1"
                >
                  Orqaga qaytish
                </Button>
                <Button onClick={handleCheckAnother} className="flex-1">
                  Boshqa litsenziyani tekshirish
                </Button>
              </div>
            </div>
          </div>
        </main>
        <div className="h-20"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Litsenziyani tekshirish - Markaziy Bank</title>
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
              Litsenziyani tekshirish
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Tashkilot yoki bank litsenziyasini tekshirish uchun ma'lumotlarni
              kiriting
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 md:p-8 border border-gray-200 dark:border-slate-700">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <Input
                  label="INN raqami"
                  name="inn"
                  value={formData.inn}
                  onChange={handleInputChange}
                  placeholder="INN raqamini kiriting"
                  maxLength={9}
                />

                <Input
                  label="Litsenziya raqami"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  placeholder="Litsenziya raqamini kiriting"
                />

                <p className="text-xs text-muted-foreground">
                  * Kamida bitta maydonni to'ldiring
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start space-x-3">
                  <Icon
                    name="Info"
                    size={20}
                    className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      Ma'lumotlar Markaziy bank bazasidan tekshiriladi. INN va
                      litsenziya raqami asosida qidiruv amalga oshiriladi.
                    </p>
                  </div>
                </div>
              </div>

              {notFound && (
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
                  <div className="flex items-start space-x-3">
                    <Icon
                      name="AlertCircle"
                      size={20}
                      className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-600 dark:text-red-400">
                        Tashkilot topilmadi
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Iltimos, kiritilgan ma'lumotlarni qayta tekshiring yoki
                        boshqa qidiruv parametrlarini kiriting.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={
                  isChecking ||
                  (!formData.inn.trim() && !formData.licenseNumber.trim())
                }
                className="w-full"
                iconName="Search"
                iconPosition="left"
              >
                {isChecking ? "Tekshirilmoqda..." : "Tashkilotni tekshirish"}
              </Button>
            </form>
          </div>

          {/* Info Card */}
          <div className="mt-6 bg-gray-50 dark:bg-slate-800/50 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
            <h3 className="font-semibold text-foreground mb-3">
              Litsenziya haqida ma'lumot
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start space-x-2">
                <Icon
                  name="Check"
                  size={16}
                  className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0"
                />
                <span>
                  Litsenziya tashkilotning moliyaviy xizmat ko'rsatish huquqini
                  tasdiqlaydi
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <Icon
                  name="Check"
                  size={16}
                  className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0"
                />
                <span>
                  Faol litsenziya tashkilot qonuniy faoliyat yuritayotganini
                  bildiradi
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <Icon
                  name="Check"
                  size={16}
                  className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0"
                />
                <span>
                  Agar litsenziya topilmasa yoki faol bo'lmasa, ehtiyot bo'ling
                </span>
              </li>
            </ul>
          </div>
        </div>
      </main>
      <div className="h-20"></div>
    </div>
  );
};

export default CheckLicense;
