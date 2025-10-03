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

const RatesSummary = ({ currencies, lastUpdate, isLoading = false }) => {
  const { t } = useTranslation();
  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 shadow-md mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 bg-muted rounded loading-skeleton w-48"></div>
          <div className="h-4 bg-muted rounded loading-skeleton w-32"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3]?.map((item) => (
            <div key={item} className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="h-4 bg-muted rounded loading-skeleton w-16 mx-auto mb-2"></div>
              <div className="h-6 bg-muted rounded loading-skeleton w-24 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getAverageRate = (currency) => {
    return (currency?.buyRate + currency?.sellRate) / 2;
  };

  const formatRate = (rate) => {
    return new Intl.NumberFormat("uz-UZ", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })?.format(rate);
  };

  return (
    <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-border rounded-xl p-4 md:p-6 shadow-md mb-6 md:mb-8 theme-transition">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 md:mb-6 gap-4">
        <div className="flex items-center space-x-2 md:space-x-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-primary/20 rounded-lg flex items-center justify-center">
            <Icon
              name="TrendingUp"
              size={20}
              className="md:w-6 md:h-6 text-primary"
            />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-card-foreground">
              {t("currency.daily_summary")}
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground">
              {t("currency.official_rates")}
            </p>
          </div>
        </div>
        <div className="text-center sm:text-right">
          <p className="text-xs md:text-sm text-muted-foreground">
            {t("currency.last_updated")}
          </p>
          <p className="text-xs md:text-sm font-medium text-card-foreground">
            {lastUpdate}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {currencies?.map((currency) => (
          <div
            key={currency?.code}
            className="text-center p-3 md:p-4 bg-card/80 backdrop-blur-sm rounded-lg border border-border/50"
          >
            <div className="flex items-center justify-center space-x-2 mb-2">
              <img
                src={getFlagImage(currency?.code)}
                alt={`${currency?.code} flag`}
                className="w-6 h-5 md:w-7 md:h-6 object-cover rounded-sm"
                onError={(e) => {
                  e.target.src = "/assets/images/no_image.png";
                }}
              />
              <span className="text-sm md:text-base font-semibold text-card-foreground">
                {currency?.code}
              </span>
            </div>
            <p className="text-xl md:text-2xl font-bold text-primary">
              {formatRate(getAverageRate(currency))}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("currency.average_rate")} (UZS)
            </p>
          </div>
        ))}
      </div>
      <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-border/50">
        <div className="flex items-center justify-center space-x-2 text-xs md:text-sm text-muted-foreground">
          <Icon name="Shield" size={14} className="md:w-4 md:h-4" />
          <span>{t("currency.central_bank_verified")}</span>
        </div>
      </div>
    </div>
  );
};

export default RatesSummary;
