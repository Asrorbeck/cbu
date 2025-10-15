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
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-muted rounded-full animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-5 bg-muted rounded animate-pulse w-16"></div>
              <div className="h-4 bg-muted rounded animate-pulse w-24"></div>
            </div>
          </div>
          <div className="h-6 bg-muted rounded-full animate-pulse w-16"></div>
        </div>
        <div className="mb-4 text-center">
          <div className="h-4 bg-muted rounded animate-pulse w-12 mx-auto mb-2"></div>
          <div className="h-8 bg-muted rounded animate-pulse w-32 mx-auto mb-1"></div>
          <div className="h-3 bg-muted rounded animate-pulse w-8 mx-auto"></div>
        </div>
        <div className="mt-4 pt-3 border-t border-border">
          <div className="flex justify-between">
            <div className="h-3 bg-muted rounded animate-pulse w-20"></div>
            <div className="h-3 bg-muted rounded animate-pulse w-16"></div>
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
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 theme-transition">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-muted/30 flex items-center justify-center border border-border">
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
            <h3 className="text-lg font-semibold text-card-foreground">
              {currency?.nominal || 1} {currency?.code}
            </h3>
            <p className="text-sm text-muted-foreground">{currency?.name}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground mb-1">Kurs</div>
          <div className="text-2xl font-bold text-card-foreground">
            {formatRate(currency?.rate)}
          </div>
          <div className="text-xs text-muted-foreground">UZS</div>
        </div>
      </div>

      {/* Change Display */}
      <div className="mb-4">
        <div
          className={`flex items-center justify-between px-4 py-3 rounded-lg border ${
            currency?.change > 0
              ? "bg-success/5 text-success border-success/20"
              : currency?.change < 0
              ? "bg-destructive/5 text-destructive border-destructive/20"
              : "bg-muted/30 text-muted-foreground border-border"
          }`}
        >
          <div className="flex items-center space-x-2">
            <Icon name={getRateChangeIcon(currency?.change)} size={16} />
            <span className="text-sm font-medium">
              {currency?.change > 0
                ? "Oshdi"
                : currency?.change < 0
                ? "Kamaydi"
                : "O'zgarmadi"}
            </span>
          </div>
          <span className="font-semibold text-base">
            {currency?.change > 0 ? "+" : ""}
            {formatRate(currency?.change)} so'm
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Icon name="Clock" size={12} />
            <span>Yangilangan:</span>
          </div>
          <span className="font-medium">{currency?.lastUpdated}</span>
        </div>
      </div>
    </div>
  );
};

export default CurrencyCard;
