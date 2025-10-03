import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../../components/ui/Navbar";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import CurrencyCard from "./components/CurrencyCard";
import RatesTable from "./components/RatesTable";
import ConverterModal from "./components/ConverterModal";

const CurrencyExchangeRates = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("cards"); // 'cards', 'table'
  const [showConverterModal, setShowConverterModal] = useState(false);
  const [showAllCurrencies, setShowAllCurrencies] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [currencies, setCurrencies] = useState([]);
  const [error, setError] = useState(null);
  const [lastUpdateDate, setLastUpdateDate] = useState(null);

  // Mock currency data - Extended list
  const mockCurrencies = [
    {
      code: "USD",
      name: "AQSH dollari",
      numericCode: "840",
      flag: "🇺🇸",
      rate: 12257.13,
      change: 0.15,
      lastUpdated: "09:30 AM",
    },
    {
      code: "EUR",
      name: "EVRO",
      numericCode: "978",
      flag: "🇪🇺",
      rate: 14434.0,
      change: -0.08,
      lastUpdated: "09:30 AM",
    },
    {
      code: "RUB",
      name: "Rossiya rubli",
      numericCode: "643",
      flag: "🇷🇺",
      rate: 146.69,
      change: 0.32,
      lastUpdated: "09:30 AM",
    },
    {
      code: "GBP",
      name: "Angliya funt sterlingi",
      numericCode: "826",
      flag: "🇬🇧",
      rate: 16550.8,
      change: -0.12,
      lastUpdated: "09:30 AM",
    },
    {
      code: "JPY",
      name: "Yaponiya iyenasi",
      numericCode: "392",
      flag: "🇯🇵",
      rate: 82.89,
      change: 0.08,
      lastUpdated: "09:30 AM",
    },
    {
      code: "CNY",
      name: "Xitoy yuani",
      numericCode: "156",
      flag: "🇨🇳",
      rate: 1765.65,
      change: 0.05,
      lastUpdated: "09:30 AM",
    },
    {
      code: "KRW",
      name: "Janubiy Koreya voni",
      numericCode: "410",
      flag: "🇰🇷",
      rate: 10.0,
      change: -0.03,
      lastUpdated: "09:30 AM",
    },
    {
      code: "TRY",
      name: "Turkiya lirasi",
      numericCode: "949",
      flag: "🇹🇷",
      rate: 428.0,
      change: 0.18,
      lastUpdated: "09:30 AM",
    },
    {
      code: "AED",
      name: "BAA dirhami",
      numericCode: "784",
      flag: "🇦🇪",
      rate: 3465.5,
      change: 0.02,
      lastUpdated: "09:30 AM",
    },
    {
      code: "SAR",
      name: "Saudiya riali",
      numericCode: "682",
      flag: "🇸🇦",
      rate: 3395.5,
      change: 0.01,
      lastUpdated: "09:30 AM",
    },
    {
      code: "KZT",
      name: "Qozog'iston tenge",
      numericCode: "398",
      flag: "🇰🇿",
      rate: 28.8,
      change: 0.12,
      lastUpdated: "09:30 AM",
    },
    {
      code: "KGS",
      name: "Qirg'iz somi",
      numericCode: "417",
      flag: "🇰🇬",
      rate: 140.12,
      change: 0.08,
      lastUpdated: "09:30 AM",
    },
    {
      code: "TJS",
      name: "Tojikiston somoni",
      numericCode: "972",
      flag: "🇹🇯",
      rate: 1163.0,
      change: 0.15,
      lastUpdated: "09:30 AM",
    },
    {
      code: "TMT",
      name: "Turkmaniston manati",
      numericCode: "934",
      flag: "🇹🇲",
      rate: 3635.4,
      change: 0.03,
      lastUpdated: "09:30 AM",
    },
    {
      code: "AFN",
      name: "Afg'oniston afgoni",
      numericCode: "971",
      flag: "🇦🇫",
      rate: 178.0,
      change: 0.22,
      lastUpdated: "09:30 AM",
    },
  ];

  // Fetch currencies from CBU API
  const fetchCurrencies = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        "https://cbu.uz/uz/arkhiv-kursov-valyut/json/"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch currency data");
      }

      const data = await response.json();

      // Get the date from the first currency item (all currencies have the same date)
      const apiDate = data[0]?.Date; // Format: "24.09.2025"

      // Parse the date manually: DD.MM.YYYY
      const [day, month, year] = apiDate.split(".");

      // Month names in Uzbek
      const monthNames = [
        "yanvar",
        "fevral",
        "mart",
        "aprel",
        "may",
        "iyun",
        "iyul",
        "avgust",
        "sentyabr",
        "oktyabr",
        "noyabr",
        "dekabr",
      ];

      const monthName = monthNames[parseInt(month) - 1];
      const formattedDate = `${parseInt(day)} ${monthName}, ${year}`;

      setLastUpdateDate(formattedDate);

      // Transform CBU API data to our format
      const transformedCurrencies = data.map((item) => ({
        id: item.id,
        code: item.Ccy,
        name: item.CcyNm_UZ,
        numericCode: item.Code,
        rate: parseFloat(item.Rate),
        change: parseFloat(item.Diff),
        lastUpdated: formattedDate,
        nominal: parseInt(item.Nominal),
      }));

      setCurrencies(transformedCurrencies);
    } catch (err) {
      console.error("Error fetching currencies:", err);
      setError("Valyuta kurslarini yuklashda xatolik yuz berdi");
      // Fallback to mock data
      setCurrencies(mockCurrencies);
    } finally {
      setIsLoading(false);
    }
  };

  // Asosiy valyutalar (faqat 3 ta)
  const mainCurrencies = currencies.slice(0, 3);

  // Ko'rsatiladigan valyutalar
  const displayedCurrencies = showAllCurrencies ? currencies : mainCurrencies;

  useEffect(() => {
    fetchCurrencies();
  }, []);

  // Monitor language changes
  useEffect(() => {
    const handleLanguageChange = (lng) => {
      setCurrentLanguage(lng);
    };

    i18n.on("languageChanged", handleLanguageChange);

    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, [i18n]);

  const handleBackToDashboard = () => {
    navigate("/home-dashboard");
  };

  return (
    <div className="min-h-screen bg-background theme-transition">
      <Navbar />
      <main className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-6 md:mb-8">
            {/* Back Button - Mobile Optimized */}
            <div className="mb-4 md:mb-6">
              <Button
                variant="ghost"
                onClick={handleBackToDashboard}
                className="flex items-center space-x-2 text-sm md:text-base"
              >
                <Icon name="ArrowLeft" size={18} className="md:w-5 md:h-5" />
                <span className="hidden sm:inline">
                  {t("currency.back_to_dashboard")}
                </span>
                <span className="sm:hidden">Orqaga</span>
              </Button>
            </div>

            {/* View Controls - Desktop Only */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              {/* View Mode Buttons - Hidden on Mobile */}
              <div className="hidden sm:flex items-center justify-start space-x-2">
                <Button
                  variant={viewMode === "cards" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("cards")}
                  iconName="Grid3X3"
                  iconPosition="left"
                >
                  {t("currency.view_cards")}
                </Button>
                <Button
                  variant={viewMode === "table" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  iconName="Table"
                  iconPosition="left"
                >
                  {t("currency.view_table")}
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center sm:justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchCurrencies}
                  iconName="RefreshCw"
                  iconPosition="left"
                  className="w-full sm:w-auto min-w-[100px]"
                  disabled={isLoading}
                >
                  <span className="hidden sm:inline">Yangilash</span>
                  <span className="sm:hidden">Yangilash</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowConverterModal(true)}
                  iconName="Calculator"
                  iconPosition="left"
                  className="w-full sm:w-auto min-w-[120px]"
                >
                  <span className="hidden sm:inline">
                    {t("currency.calculator")}
                  </span>
                  <span className="sm:hidden">Konverter</span>
                </Button>
              </div>
            </div>

            {/* Title Section - Mobile Optimized */}
            <div className="text-center mb-6 md:mb-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 md:mb-4 px-4">
                {t("currency.title") || "Valyuta kurslari"}
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-2 px-4">
                {t("currency.subtitle") ||
                  "O'zbekiston Markaziy bankining rasmiy kunlik kurslari"}
              </p>
              <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-muted-foreground">
                <Icon name="Clock" size={14} className="md:w-4 md:h-4" />
                <span>
                  {lastUpdateDate ||
                    t("currency.last_update") ||
                    "Yuklanmoqda..."}
                </span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center space-x-2">
                <Icon name="AlertCircle" size={20} className="text-red-600" />
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Main Content - Mobile Optimized */}
          <div className="block sm:hidden">
            {/* Mobile - Always show table view */}
            <RatesTable
              currencies={displayedCurrencies}
              isLoading={isLoading}
              isMobile={true}
            />

            {/* Show More Button - Mobile */}
            {!showAllCurrencies && currencies.length > 3 && (
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  onClick={() => setShowAllCurrencies(true)}
                  className="w-full"
                >
                  <Icon name="ChevronDown" size={16} className="mr-2" />
                  Ko'proq ko'rish ({currencies.length - 3} ta qo'shimcha)
                </Button>
              </div>
            )}

            {/* Show Less Button - Mobile */}
            {showAllCurrencies && (
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  onClick={() => setShowAllCurrencies(false)}
                  className="w-full"
                >
                  <Icon name="ChevronUp" size={16} className="mr-2" />
                  Kamroq ko'rish
                </Button>
              </div>
            )}
          </div>

          {/* Desktop content - show based on viewMode */}
          <div className="hidden sm:block">
            {viewMode === "cards" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2">
                {displayedCurrencies?.map((currency) => (
                  <CurrencyCard
                    key={currency?.code}
                    currency={currency}
                    isLoading={isLoading}
                  />
                ))}
              </div>
            ) : (
              <RatesTable
                currencies={displayedCurrencies}
                isLoading={isLoading}
              />
            )}

            {/* Show More Button - Desktop */}
            {!showAllCurrencies && currencies.length > 3 && (
              <div className="mt-8 text-center">
                <Button
                  variant="outline"
                  onClick={() => setShowAllCurrencies(true)}
                  className="px-8"
                >
                  <Icon name="ChevronDown" size={16} className="mr-2" />
                  Ko'proq ko'rish ({currencies.length - 3} ta qo'shimcha
                  valyuta)
                </Button>
              </div>
            )}

            {/* Show Less Button - Desktop */}
            {showAllCurrencies && (
              <div className="mt-8 text-center">
                <Button
                  variant="outline"
                  onClick={() => setShowAllCurrencies(false)}
                  className="px-8"
                >
                  <Icon name="ChevronUp" size={16} className="mr-2" />
                  Kamroq ko'rish
                </Button>
              </div>
            )}
          </div>

          {/* Footer Info - Mobile Optimized */}
          <div className="mt-8 md:mt-12 text-center">
            <div className="bg-card border border-border rounded-xl p-4 md:p-6 shadow-md">
              <div className="flex items-center justify-center space-x-2 md:space-x-3 mb-3 md:mb-4">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Icon
                    name="Shield"
                    size={20}
                    className="md:w-6 md:h-6 text-primary"
                  />
                </div>
                <h3 className="text-base md:text-lg font-semibold text-card-foreground">
                  {t("currency.official_exchange_rates")}
                </h3>
              </div>
              <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4 px-2">
                {t("currency.rates_description")}
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-3 sm:gap-6 text-xs md:text-sm text-muted-foreground">
                <div className="flex items-center justify-center space-x-2">
                  <Icon name="RefreshCw" size={14} className="md:w-4 md:h-4" />
                  <span>{t("currency.updated_daily")}</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Icon
                    name="CheckCircle"
                    size={14}
                    className="md:w-4 md:h-4"
                  />
                  <span>{t("currency.official_rates_text")}</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Icon name="Globe" size={14} className="md:w-4 md:h-4" />
                  <span>{t("currency.central_bank_verified")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Converter Modal */}
      <ConverterModal
        isOpen={showConverterModal}
        onClose={() => setShowConverterModal(false)}
        currencies={currencies}
      />

      {/* Bottom navigation spacing - mobile only */}
      <div className="h-20 md:h-0"></div>
    </div>
  );
};

export default CurrencyExchangeRates;
