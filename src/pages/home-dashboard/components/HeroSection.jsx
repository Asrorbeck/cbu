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
    <div className="relative bg-gradient-to-br from-primary via-primary/90 to-accent rounded-2xl p-8 md:p-12 mb-8 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-4 w-32 h-32 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-4 left-4 w-24 h-24 bg-white rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-8">
          {/* Logo */}
          <div className="mb-6 md:mb-0 flex justify-center md:justify-start">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 p-2">
              <img
                src="/assets/images/CBU_Logo.svg-1758136577882.png"
                alt="Central Bank of Uzbekistan Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              {t("home.hero_title")}
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl md:max-w-3xl mx-auto md:mx-0 leading-relaxed mt-3">
              {t("home.hero_subtitle")}
            </p>

            {/* CTAs removed per request */}

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
              <div className="bg-gradient-to-r from-white/15 via-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/30 p-3 md:p-6 shadow-2xl shadow-white/5">
                {currencies?.map((c, index) => (
                  <div key={c?.code} className="group">
                    <div className="flex items-center justify-between py-2 md:py-4 px-1 md:px-2 hover:bg-white/5 rounded-xl transition-all duration-300">
                      {/* Left side - Flag and Currency */}
                      <div className="flex items-center space-x-2 md:space-x-4 flex-1 min-w-0">
                        <div className="w-6 h-6 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-white/30 to-white/10 flex items-center justify-center shadow-lg border border-white/20 group-hover:scale-110 transition-transform duration-300 flex-shrink-0 overflow-hidden">
                          <img
                            src={getFlagImage(c?.code)}
                            alt={`${c?.code} flag`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = "/assets/images/no_image.png";
                            }}
                          />
                        </div>
                        <div className="flex items-center space-x-1 md:space-x-3 min-w-0">
                          <span className="text-white font-bold text-sm md:text-xl tracking-wide">
                            {c?.code}
                          </span>
                          <span className="text-white/60 text-sm md:text-xl">
                            =
                          </span>
                          <span className="text-white font-bold text-sm md:text-xl truncate">
                            {formatRate(c?.rate)}
                          </span>
                        </div>
                      </div>

                      {/* Right side - Change and Trend */}
                      <div className="flex items-center space-x-1 md:space-x-3 flex-shrink-0">
                        <div
                          className={`px-2 py-1 md:px-3 md:py-1.5 rounded-full ${
                            c?.change > 0
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40"
                              : c?.change < 0
                              ? "bg-red-500/20 text-red-300 border border-red-400/40"
                              : "bg-white/10 text-white/70 border border-white/20"
                          }`}
                        >
                          <span className="text-xs md:text-sm font-bold">
                            {c?.change > 0 ? "+" : ""}
                            {c?.change?.toFixed(2)}
                          </span>
                        </div>
                        <div
                          className={`w-5 h-5 md:w-8 md:h-8 rounded-full flex items-center justify-center ${
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
                            className="md:hidden"
                          />
                          <Icon
                            name={
                              c?.change > 0
                                ? "TrendingUp"
                                : c?.change < 0
                                ? "TrendingDown"
                                : "Minus"
                            }
                            size={18}
                            className="hidden md:block"
                          />
                        </div>
                      </div>
                    </div>
                    {index < currencies.length - 1 && (
                      <div className="mx-1 md:mx-2 border-b border-gradient-to-r from-transparent via-white/20 to-transparent"></div>
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
  );
};

export default HeroSection;
