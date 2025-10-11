import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const HeroSection = ({ currencies = [], lastUpdateDate }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const getFlagImage = (currencyCode) => {
    const flagMap = {
      USD: "https://flagcdn.com/w40/us.png",
      EUR: "https://flagcdn.com/w40/eu.png",
      RUB: "https://flagcdn.com/w40/ru.png",
      GBP: "https://flagcdn.com/w40/gb.png",
      JPY: "https://flagcdn.com/w40/jp.png",
      CNY: "https://flagcdn.com/w40/cn.png",
      KRW: "https://flagcdn.com/w40/kr.png",
      TRY: "https://flagcdn.com/w40/tr.png",
      AED: "https://flagcdn.com/w40/ae.png",
      SAR: "https://flagcdn.com/w40/sa.png",
      KZT: "https://flagcdn.com/w40/kz.png",
      KGS: "https://flagcdn.com/w40/kg.png",
      TJS: "https://flagcdn.com/w40/tj.png",
      TMT: "https://flagcdn.com/w40/tm.png",
      AFN: "https://flagcdn.com/w40/af.png",
      UZS: "https://flagcdn.com/w40/uz.png",
    };

    // Alternative URLs if flagcdn doesn't work
    const alternativeFlags = {
      USD: "https://hatscripts.github.io/circle-flags/flags/us.svg",
      EUR: "https://hatscripts.github.io/circle-flags/flags/eu.svg",
      RUB: "https://hatscripts.github.io/circle-flags/flags/ru.svg",
      GBP: "https://hatscripts.github.io/circle-flags/flags/gb.svg",
      JPY: "https://hatscripts.github.io/circle-flags/flags/jp.svg",
      CNY: "https://hatscripts.github.io/circle-flags/flags/cn.svg",
      KRW: "https://hatscripts.github.io/circle-flags/flags/kr.svg",
      TRY: "https://hatscripts.github.io/circle-flags/flags/tr.svg",
      AED: "https://hatscripts.github.io/circle-flags/flags/ae.svg",
      SAR: "https://hatscripts.github.io/circle-flags/flags/sa.svg",
      KZT: "https://hatscripts.github.io/circle-flags/flags/kz.svg",
      KGS: "https://hatscripts.github.io/circle-flags/flags/kg.svg",
      TJS: "https://hatscripts.github.io/circle-flags/flags/tj.svg",
      TMT: "https://hatscripts.github.io/circle-flags/flags/tm.svg",
      AFN: "https://hatscripts.github.io/circle-flags/flags/af.svg",
      UZS: "https://hatscripts.github.io/circle-flags/flags/uz.svg",
    };

    return (
      flagMap[currencyCode] ||
      alternativeFlags[currencyCode] ||
      "/assets/images/no_image.png"
    );
  };

  const formatRate = (rate) =>
    new Intl.NumberFormat("uz-UZ", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })?.format(rate);

  return (
    <div className="relative mb-8 overflow-hidden">
      {/* Mobile View - Original Style */}
      <div className="md:hidden bg-gradient-to-br from-primary via-primary/90 to-accent rounded-2xl p-8">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-4 left-4 w-24 h-24 bg-white rounded-full blur-2xl"></div>
        </div>

        <div className="relative z-10 text-white">
          <div className="flex flex-col">
            {/* Logo */}
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 p-2">
                <img
                  src="/assets/images/CBU_Logo.svg-1758136577882.png"
                  alt="Central Bank of Uzbekistan Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 text-center">
              <h1 className="text-3xl font-bold leading-tight">
                {t("home.hero_title")}
              </h1>
              <p className="text-lg text-white/90 max-w-2xl mx-auto leading-relaxed mt-3">
                {t("home.hero_subtitle")}
              </p>

              {/* Currency Rates List Section */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white text-lg font-semibold">
                    Valyuta kurslari
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/currency-exchange-rates")}
                    className="text-white/80 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-lg text-sm transition-all duration-300"
                    iconName="ArrowRight"
                    iconPosition="right"
                  >
                    Barcha kurslar
                  </Button>
                </div>

                {/* Currency List */}
                <div className="bg-gradient-to-r from-white/15 via-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/30 p-3 shadow-2xl shadow-white/5">
                  {currencies?.map((c, index) => (
                    <div key={c?.code} className="group">
                      <div className="flex items-center justify-between py-2 px-1 hover:bg-white/5 rounded-xl transition-all duration-300">
                        {/* Left side - Flag and Currency */}
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-white/30 to-white/10 flex items-center justify-center shadow-lg border border-white/20 group-hover:scale-110 transition-transform duration-300 flex-shrink-0 overflow-hidden">
                            <img
                              src={getFlagImage(c?.code)}
                              alt={`${c?.code} flag`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = "/assets/images/no_image.png";
                              }}
                            />
                          </div>
                          <div className="flex items-center space-x-1 min-w-0">
                            <span className="text-white font-bold text-sm tracking-wide">
                              {c?.code}
                            </span>
                            <span className="text-white/60 text-sm">=</span>
                            <span className="text-white font-bold text-sm truncate">
                              {formatRate(c?.rate)}
                            </span>
                          </div>
                        </div>

                        {/* Right side - Change and Trend */}
                        <div className="flex items-center space-x-1 flex-shrink-0">
                          <div
                            className={`px-2 py-1 rounded-full ${
                              c?.change > 0
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40"
                                : c?.change < 0
                                ? "bg-red-500/20 text-red-300 border border-red-400/40"
                                : "bg-white/10 text-white/70 border border-white/20"
                            }`}
                          >
                            <span className="text-xs font-bold">
                              {c?.change > 0 ? "+" : ""}
                              {c?.change?.toFixed(2)}
                            </span>
                          </div>
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center ${
                              c?.change > 0
                                ? "bg-emerald-500/20 text-emerald-300"
                                : c?.change < 0
                                ? "bg-red-500/20 text-red-300"
                                : "bg-white/10 text-white/70"
                            } group-hover:scale-110 transition-transform duration-300`}
                          >
                            <Icon
                              name={
                                c?.change > 0
                                  ? "TrendingUp"
                                  : c?.change < 0
                                  ? "TrendingDown"
                                  : "Minus"
                              }
                              size={14}
                            />
                          </div>
                        </div>
                      </div>
                      {index < currencies.length - 1 && (
                        <div className="mx-1 border-b border-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Date Display */}
                <div className="mt-3 text-center">
                  <span className="text-white/60 text-xs">
                    {lastUpdateDate || "Yuklanmoqda..."}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop View - Professional Government Style */}
      <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-12 gap-0">
          {/* Left Panel - Content Section */}
          <div className="col-span-5 border-r border-gray-200 dark:border-gray-700 p-8 flex flex-col justify-center">
            {/* Logo and Title */}
            <div className="mb-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-20 h-20 bg-primary/10 rounded-lg flex items-center justify-center p-3">
                  <img
                    src="/assets/images/CBU_Logo.svg-1758136577882.png"
                    alt="Central Bank of Uzbekistan Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    O'zbekiston Respublikasi
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    Markaziy Bank
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-primary pl-6">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-3">
                  {t("home.hero_title")}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t("home.hero_subtitle")}
                </p>
              </div>
            </div>

            {/* Info Stats */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {currencies?.length || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-medium">
                  Valyuta turlari
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <div className="text-3xl font-bold text-gray-700 dark:text-gray-300">
                  24/7
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-medium">
                  Onlayn xizmat
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Currency Rates */}
          <div className="col-span-7 p-8 bg-gray-50 dark:bg-gray-800/50">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Valyuta kurslari
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Oxirgi yangilanish: {lastUpdateDate || "Yuklanmoqda..."}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => navigate("/currency-exchange-rates")}
                className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-5 py-2 rounded-lg font-semibold transition-colors"
                iconName="ArrowRight"
                iconPosition="right"
              >
                Barcha kurslar
              </Button>
            </div>

            {/* Currency Table/Grid */}
            <div className="space-y-3">
              {currencies?.slice(0, 6).map((c) => (
                <div
                  key={c?.code}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    {/* Left: Flag and Code */}
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center border border-gray-200 dark:border-gray-600 overflow-hidden flex-shrink-0">
                        <img
                          src={getFlagImage(c?.code)}
                          alt={`${c?.code} flag`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "/assets/images/no_image.png";
                          }}
                        />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Valyuta kodi
                        </div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {c?.code}
                        </div>
                      </div>
                    </div>

                    {/* Middle: Rate */}
                    <div className="flex-1 text-center">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Kurs qiymati
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formatRate(c?.rate)}{" "}
                        <span className="text-sm font-normal text-gray-500">
                          so'm
                        </span>
                      </div>
                    </div>

                    {/* Right: Change */}
                    <div className="flex items-center space-x-3 flex-shrink-0">
                      <div
                        className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                          c?.change > 0
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : c?.change < 0
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400"
                        }`}
                      >
                        {c?.change > 0 ? "+" : ""}
                        {c?.change?.toFixed(2)}
                      </div>
                      <div
                        className={`p-2 rounded-lg ${
                          c?.change > 0
                            ? "bg-green-100 dark:bg-green-900/30"
                            : c?.change < 0
                            ? "bg-red-100 dark:bg-red-900/30"
                            : "bg-gray-100 dark:bg-gray-700"
                        }`}
                      >
                        <Icon
                          name={
                            c?.change > 0
                              ? "TrendingUp"
                              : c?.change < 0
                              ? "TrendingDown"
                              : "Minus"
                          }
                          size={18}
                          className={
                            c?.change > 0
                              ? "text-green-600 dark:text-green-400"
                              : c?.change < 0
                              ? "text-red-600 dark:text-red-400"
                              : "text-gray-600 dark:text-gray-400"
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
