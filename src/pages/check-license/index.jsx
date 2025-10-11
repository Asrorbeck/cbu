import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Navbar from "../../components/ui/Navbar";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Icon from "../../components/AppIcon";

const CheckLicense = () => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [licenseData, setLicenseData] = useState(null);

  const [formData, setFormData] = useState({
    inn: "",
    mfo: "",
    licenseNumber: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isFormValid = () => {
    return (
      formData.inn.trim() !== "" &&
      formData.mfo.trim() !== "" &&
      formData.licenseNumber.trim() !== ""
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsChecking(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock license data
      setLicenseData({
        organizationName: "Test Bank",
        inn: formData.inn,
        mfo: formData.mfo,
        licenseNumber: formData.licenseNumber,
        licenseStatus: "Faol",
        issueDate: "01.01.2020",
        expiryDate: "01.01.2025",
        licenseType: "Bank litsenziyasi",
      });

      setShowResult(true);
    } catch (error) {
      console.error("Error checking license:", error);
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
    setFormData({
      inn: "",
      mfo: "",
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
                  Litsenziya topildi
                </h2>
                <p className="text-sm text-muted-foreground">
                  Tashkilot litsenziyasi faol holda
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-slate-700/30 rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-1">
                      Tashkilot nomi
                    </p>
                    <p className="font-semibold text-foreground">
                      {licenseData.organizationName}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-slate-700/30 rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-1">INN</p>
                    <p className="font-semibold text-foreground">
                      {licenseData.inn}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-slate-700/30 rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-1">MFO</p>
                    <p className="font-semibold text-foreground">
                      {licenseData.mfo}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-slate-700/30 rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-1">
                      Litsenziya raqami
                    </p>
                    <p className="font-semibold text-foreground">
                      {licenseData.licenseNumber}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-slate-700/30 rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-1">
                      Litsenziya turi
                    </p>
                    <p className="font-semibold text-foreground">
                      {licenseData.licenseType}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-slate-700/30 rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-1">Holati</p>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <p className="font-semibold text-green-600 dark:text-green-400">
                        {licenseData.licenseStatus}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-slate-700/30 rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-1">
                      Berilgan sana
                    </p>
                    <p className="font-semibold text-foreground">
                      {licenseData.issueDate}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-slate-700/30 rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-1">
                      Amal qilish muddati
                    </p>
                    <p className="font-semibold text-foreground">
                      {licenseData.expiryDate}
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
              <Input
                label="INN raqamini kiriting"
                name="inn"
                value={formData.inn}
                onChange={handleInputChange}
                placeholder="123456789"
                required
                maxLength={9}
              />

              <Input
                label="MFO raqamini kiriting"
                name="mfo"
                value={formData.mfo}
                onChange={handleInputChange}
                placeholder="01234"
                required
                maxLength={5}
              />

              <Input
                label="Litsenziya raqamini kiriting"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleInputChange}
                placeholder="LC-2024-001"
                required
              />

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start space-x-3">
                  <Icon
                    name="Info"
                    size={20}
                    className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
                  />
                  <p className="text-sm text-muted-foreground">
                    Barcha maydonlar to'ldirilishi shart. Ma'lumotlar Markaziy
                    bank bazasidan tekshiriladi.
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isChecking || !isFormValid()}
                className="w-full"
                iconName="Search"
                iconPosition="left"
              >
                {isChecking ? "Tekshirilmoqda..." : "Litsenziyani tekshirish"}
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
