import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Icon from "../../../components/AppIcon";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Button from "../../../components/ui/Button";

const RateCalculator = ({ currencies }) => {
  const { t } = useTranslation();
  const [fromCurrency, setFromCurrency] = useState("UZS");
  const [toCurrency, setToCurrency] = useState("USD");
  const [amount, setAmount] = useState("1000");
  const [result, setResult] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);

  const currencyOptions = [
    { value: "UZS", label: "Uzbekistan Som (UZS)", flag: "🇺🇿" },
    ...currencies?.map((currency) => ({
      value: currency?.code,
      label: `${currency?.name} (${currency?.code})`,
      flag: currency?.flag,
    })),
  ];

  const formatCurrencyOption = (option) => (
    <div className="flex items-center space-x-2">
      <span>{option?.flag}</span>
      <span>{option?.label}</span>
    </div>
  );

  const calculateRate = () => {
    if (!amount || isNaN(parseFloat(amount))) {
      setResult(0);
      return;
    }

    setIsCalculating(true);

    // Simulate calculation delay
    setTimeout(() => {
      const inputAmount = parseFloat(amount);
      let calculatedResult = 0;

      if (fromCurrency === "UZS" && toCurrency !== "UZS") {
        // Converting from UZS to foreign currency
        const targetCurrency = currencies?.find((c) => c?.code === toCurrency);
        if (targetCurrency) {
          calculatedResult = inputAmount / targetCurrency?.sellRate;
        }
      } else if (fromCurrency !== "UZS" && toCurrency === "UZS") {
        // Converting from foreign currency to UZS
        const sourceCurrency = currencies?.find(
          (c) => c?.code === fromCurrency
        );
        if (sourceCurrency) {
          calculatedResult = inputAmount * sourceCurrency?.buyRate;
        }
      } else if (fromCurrency !== "UZS" && toCurrency !== "UZS") {
        // Converting between two foreign currencies via UZS
        const sourceCurrency = currencies?.find(
          (c) => c?.code === fromCurrency
        );
        const targetCurrency = currencies?.find((c) => c?.code === toCurrency);
        if (sourceCurrency && targetCurrency) {
          const uzsAmount = inputAmount * sourceCurrency?.buyRate;
          calculatedResult = uzsAmount / targetCurrency?.sellRate;
        }
      } else {
        // Same currency
        calculatedResult = inputAmount;
      }

      setResult(calculatedResult);
      setIsCalculating(false);
    }, 500);
  };

  useEffect(() => {
    calculateRate();
  }, [amount, fromCurrency, toCurrency]);

  const handleSwapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const formatResult = (value) => {
    return new Intl.NumberFormat("uz-UZ", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    })?.format(value);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-6 shadow-md theme-transition">
      <div className="flex items-center space-x-2 md:space-x-3 mb-4 md:mb-6">
        <div className="w-8 h-8 md:w-10 md:h-10 bg-accent/20 rounded-lg flex items-center justify-center">
          <Icon
            name="Calculator"
            size={20}
            className="md:w-6 md:h-6 text-accent"
          />
        </div>
        <div>
          <h3 className="text-base md:text-lg font-semibold text-card-foreground">
            {t("currency.calculator_title")}
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground">
            {t("currency.calculator_description")}
          </p>
        </div>
      </div>
      <div className="space-y-4 md:space-y-6">
        {/* Amount Input */}
        <div>
          <Input
            label={t("currency.amount")}
            type="number"
            value={amount}
            onChange={(e) => setAmount(e?.target?.value)}
            placeholder={t("currency.amount")}
            min="0"
            step="0.01"
          />
        </div>

        {/* From Currency */}
        <div>
          <Select
            label={t("currency.from_currency")}
            options={currencyOptions}
            value={fromCurrency}
            onChange={setFromCurrency}
            searchable
          />
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSwapCurrencies}
            className="rounded-full p-2 md:p-3"
          >
            <Icon name="ArrowUpDown" size={18} className="md:w-5 md:h-5" />
          </Button>
        </div>

        {/* To Currency */}
        <div>
          <Select
            label={t("currency.to_currency")}
            options={currencyOptions}
            value={toCurrency}
            onChange={setToCurrency}
            searchable
          />
        </div>

        {/* Result */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-3 md:p-4 border border-border/50">
          <div className="text-center">
            <p className="text-xs md:text-sm text-muted-foreground mb-2">
              {t("currency.converted_amount")}
            </p>
            {isCalculating ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 md:h-6 md:w-6 border-b-2 border-primary"></div>
                <span className="text-xs md:text-sm text-muted-foreground">
                  {t("currency.calculating")}
                </span>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-2xl md:text-3xl font-bold text-primary">
                  {formatResult(result)}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground">
                  {toCurrency}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Exchange Rate Info */}
        {fromCurrency !== toCurrency && (
          <div className="bg-muted/30 rounded-lg p-3 md:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs md:text-sm">
              <span className="text-muted-foreground text-center sm:text-left">
                {t("currency.exchange_rate")}
              </span>
              <div className="flex items-center justify-center sm:justify-end space-x-2">
                <span className="font-medium text-card-foreground">
                  1 {fromCurrency} ={" "}
                  {formatResult(result / parseFloat(amount || 1))} {toCurrency}
                </span>
                <Icon
                  name="Info"
                  size={14}
                  className="md:w-4 md:h-4 text-muted-foreground"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-border">
        <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
          <Icon name="AlertCircle" size={12} className="md:w-3.5 md:h-3.5" />
          <span>{t("currency.rates_reference_only")}</span>
        </div>
      </div>
    </div>
  );
};

export default RateCalculator;
