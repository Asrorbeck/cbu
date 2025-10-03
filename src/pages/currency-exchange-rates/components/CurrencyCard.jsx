import React from "react";
import { useTranslation } from "react-i18next";
import Icon from "../../../components/AppIcon";

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

const CurrencyCard = ({ currency, isLoading = false }) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-5 bg-gray-200 rounded animate-pulse w-16"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
            </div>
          </div>
          <div className="h-6 bg-gray-200 rounded-full animate-pulse w-16"></div>
        </div>
        <div className="mb-4 text-center">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-12 mx-auto mb-2"></div>
          <div className="h-8 bg-gray-200 rounded animate-pulse w-32 mx-auto mb-1"></div>
          <div className="h-3 bg-gray-200 rounded animate-pulse w-8 mx-auto"></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-gray-50 rounded-xl">
            <div className="h-3 bg-gray-200 rounded animate-pulse w-16 mx-auto mb-2"></div>
            <div className="h-6 bg-gray-200 rounded animate-pulse w-20 mx-auto"></div>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl">
            <div className="h-3 bg-gray-200 rounded animate-pulse w-12 mx-auto mb-2"></div>
            <div className="h-6 bg-gray-200 rounded animate-pulse w-20 mx-auto"></div>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex justify-between">
            <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
          </div>
        </div>
      </div>
    );
  }

  const formatRate = (rate) => {
    return new Intl.NumberFormat("uz-UZ", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })?.format(rate);
  };

  const getRateChangeColor = (change) => {
    if (change > 0) return "text-success";
    if (change < 0) return "text-destructive";
    return "text-muted-foreground";
  };

  const getRateChangeIcon = (change) => {
    if (change > 0) return "TrendingUp";
    if (change < 0) return "TrendingDown";
    return "Minus";
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
            <img
              src={getFlagImage(currency?.code)}
              alt={`${currency?.code} flag`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "/assets/images/no_image.png";
              }}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {currency?.code}
            </h3>
            <p className="text-sm text-gray-600">{currency?.name}</p>
          </div>
        </div>
        <div
          className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
            currency?.change > 0
              ? "bg-green-100 text-green-700"
              : currency?.change < 0
              ? "bg-red-100 text-red-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          <Icon name={getRateChangeIcon(currency?.change)} size={12} />
          <span>
            {currency?.change > 0 ? "+" : ""}
            {currency?.change?.toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Main Rate Display */}
      <div className="mb-4">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">Kurs</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatRate(currency?.rate)}
          </p>
          <p className="text-sm text-gray-500">UZS</p>
        </div>
      </div>

      {/* Buy/Sell Rates */}
      <div className="grid grid-cols-2 gap-3">
        <div className="text-center p-3 bg-green-50 rounded-xl">
          <p className="text-xs text-gray-600 mb-1">
            {t("currency.buy_rate") || "Sotib olish"}
          </p>
          <p className="text-lg font-bold text-green-600">
            {formatRate(currency?.rate * 0.998)}
          </p>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-xl">
          <p className="text-xs text-gray-600 mb-1">
            {t("currency.sell_rate") || "Sotish"}
          </p>
          <p className="text-lg font-bold text-red-600">
            {formatRate(currency?.rate * 1.002)}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{t("currency.last_updated") || "Yangilangan"}</span>
          <span>{currency?.lastUpdated}</span>
        </div>
      </div>
    </div>
  );
};

export default CurrencyCard;
