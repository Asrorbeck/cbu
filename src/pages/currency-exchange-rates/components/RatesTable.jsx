import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

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

const RatesTable = ({ currencies, isLoading = false, isMobile = false }) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-md">
        <div className="p-4 border-b border-border">
          <div className="h-6 bg-muted rounded loading-skeleton w-48"></div>
        </div>
        <div className="divide-y divide-border">
          {[1, 2, 3]?.map((item) => (
            <div key={item} className="p-4 flex items-center space-x-4">
              <div className="h-4 bg-muted rounded loading-skeleton w-16"></div>
              <div className="h-4 bg-muted rounded loading-skeleton w-32"></div>
              <div className="h-4 bg-muted rounded loading-skeleton w-24"></div>
              <div className="h-4 bg-muted rounded loading-skeleton w-24"></div>
              <div className="h-4 bg-muted rounded loading-skeleton w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Use currencies in the order they come from API
  const displayCurrencies = currencies;

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

  // Mobile table view
  if (isMobile) {
    return (
      <div className="space-y-3">
        {displayCurrencies?.map((currency) => (
          <div
            key={currency?.code}
            className="bg-card border border-border rounded-xl p-4 shadow-sm theme-transition"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={getFlagImage(currency?.code)}
                  alt={`${currency?.code} flag`}
                  className="w-8 h-8 object-cover rounded-full"
                  onError={(e) => {
                    e.target.src = "/assets/images/no_image.png";
                  }}
                />
                <div>
                  <h3 className="font-semibold text-card-foreground text-base">
                    {currency?.nominal || 1} {currency?.code}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {currency?.name}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-card-foreground">
                  {formatRate(currency?.rate)}
                </div>
                <div
                  className={`flex items-center justify-end space-x-1 text-xs font-medium ${
                    currency?.change > 0
                      ? "text-success"
                      : currency?.change < 0
                      ? "text-destructive"
                      : "text-muted-foreground"
                  }`}
                >
                  <Icon
                    name={
                      currency?.change > 0
                        ? "TrendingUp"
                        : currency?.change < 0
                        ? "TrendingDown"
                        : "Minus"
                    }
                    size={12}
                  />
                  <span>
                    {currency?.change > 0 ? "+" : ""}
                    {formatRate(currency?.change)} so'm
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Desktop table view - simplified to match mobile data structure
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-md theme-transition">
      <div className="p-3 md:p-4 border-b border-border">
        <div className="flex items-center space-x-2 md:space-x-3">
          <div className="w-6 h-6 md:w-8 md:h-8 bg-primary/20 rounded-lg flex items-center justify-center">
            <Icon
              name="Table"
              size={16}
              className="md:w-5 md:h-5 text-primary"
            />
          </div>
          <h3 className="text-base md:text-lg font-semibold text-card-foreground">
            {t("currency.daily_summary")}
          </h3>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 md:p-4 font-semibold text-card-foreground">
                {t("currency.currency")}
              </th>
              <th className="text-left p-3 md:p-4 font-semibold text-card-foreground">
                {t("currency.name")}
              </th>
              <th className="text-right p-3 md:p-4 font-semibold text-card-foreground">
                Kurs
              </th>
              <th className="text-right p-3 md:p-4 font-semibold text-card-foreground">
                {t("currency.change")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {displayCurrencies?.map((currency) => (
              <tr
                key={currency?.code}
                className="hover:bg-muted/30 transition-colors duration-200"
              >
                <td className="p-3 md:p-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={getFlagImage(currency?.code)}
                      alt={`${currency?.code} flag`}
                      className="w-8 h-8 object-cover rounded-full"
                      onError={(e) => {
                        e.target.src = "/assets/images/no_image.png";
                      }}
                    />
                    <div>
                      <span className="font-semibold text-card-foreground text-base">
                        {currency?.nominal || 1} {currency?.code}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="p-3 md:p-4">
                  <span className="text-muted-foreground text-sm">
                    {currency?.name}
                  </span>
                </td>
                <td className="p-3 md:p-4 text-right">
                  <div className="space-y-1">
                    <span className="font-bold text-card-foreground text-lg">
                      {formatRate(currency?.rate)}
                    </span>
                    <div className="text-xs text-muted-foreground">UZS</div>
                  </div>
                </td>
                <td className="p-3 md:p-4 text-right">
                  <div
                    className={`flex items-center justify-end space-x-1 ${getRateChangeColor(
                      currency?.change
                    )}`}
                  >
                    <Icon
                      name={
                        currency?.change > 0
                          ? "TrendingUp"
                          : currency?.change < 0
                          ? "TrendingDown"
                          : "Minus"
                      }
                      size={16}
                    />
                    <span className="font-medium text-sm">
                      {currency?.change > 0 ? "+" : ""}
                      {formatRate(currency?.change)} so'm
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-3 md:p-4 border-t border-border bg-muted/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs md:text-sm text-muted-foreground">
          <span>
            {t("currency.showing_currencies")} {currencies?.length}
          </span>
          <div className="flex items-center justify-center sm:justify-end space-x-2">
            <Icon name="Clock" size={14} className="md:w-4 md:h-4" />
            <span>{t("currency.rates_updated")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatesTable;
