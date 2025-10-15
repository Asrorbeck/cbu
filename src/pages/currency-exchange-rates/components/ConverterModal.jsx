import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Icon from "../../../components/AppIcon";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";

const ConverterModal = ({ isOpen, onClose, currencies }) => {
  const { t } = useTranslation();
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("UZS");
  const [amount, setAmount] = useState("");
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

  const formatCurrencyOption = (option) => (
    <div className="flex items-center space-x-2">
      <img
        src={getFlagImage(option?.value)}
        alt={`${option?.value} flag`}
        className="w-5 h-4 md:w-6 md:h-5 object-cover rounded-sm"
        onError={(e) => {
          e.target.src = "/assets/images/no_image.png";
        }}
      />
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

      if (fromCurrency === "UZS") {
        // Converting from UZS to foreign currency (not supported in this modal)
        calculatedResult = inputAmount;
      } else {
        // Converting from foreign currency to UZS
        const sourceCurrency = currencies?.find(
          (c) => c?.code === fromCurrency
        );
        if (sourceCurrency) {
          calculatedResult = inputAmount * sourceCurrency?.rate;
        }
      }

      setResult(calculatedResult);
      setIsCalculating(false);
    }, 300);
  };

  useEffect(() => {
    calculateRate();
  }, [amount, fromCurrency]);

  const handleSwapCurrencies = () => {
    // Only swap if fromCurrency is not UZS
    if (fromCurrency !== "UZS") {
      setFromCurrency("UZS");
      setToCurrency(fromCurrency);
    }
  };

  const formatResult = (value) => {
    return new Intl.NumberFormat("uz-UZ", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })?.format(value);
  };

  const handleClose = () => {
    onClose();
    // Reset form
    setAmount("");
    setFromCurrency("USD");
    setToCurrency("UZS");
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="sm" title="Konverter">
      <div className="bg-card rounded-xl">
        {/* Content */}
        <div className="p-3 md:p-6">
          <div className="space-y-4 md:space-y-6">
            {/* From Currency Section */}
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Swap Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleSwapCurrencies}
                className="rounded-full p-2 md:p-3 bg-yellow-400 hover:bg-yellow-500 border-yellow-400 hover:border-yellow-500 text-black shadow-sm"
              >
                <Icon name="ArrowUpDown" size={16} className="md:w-5 md:h-5" />
              </Button>

              {/* Amount Input */}
              <div className="flex-1">
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e?.target?.value)}
                  placeholder="Son kiriting"
                  min="0"
                  step="0.01"
                  className="text-lg md:text-xl font-semibold h-10 md:h-12 border-2 border-primary/20 focus:border-primary bg-background"
                />
              </div>

              {/* From Currency Select */}
              <div className="min-w-[120px] md:min-w-[140px]">
                <Select
                  options={currencyOptions}
                  value={fromCurrency}
                  onChange={setFromCurrency}
                  searchable
                  formatOption={formatCurrencyOption}
                  className="h-10 md:h-12 border-2 border-primary/20 focus:border-primary text-sm md:text-base"
                />
              </div>
            </div>

            {/* To Currency Section */}
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Equals Sign */}
              <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                <span className="text-xl md:text-2xl font-bold text-card-foreground">
                  =
                </span>
              </div>

              {/* Result Display */}
              <div className="flex-1">
                <div className="bg-primary/5 rounded-lg p-3 md:p-4 border-2 border-primary/20 h-10 md:h-12 flex items-center justify-center">
                  {isCalculating ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-primary"></div>
                      <span className="text-xs md:text-sm text-muted-foreground">
                        {t("currency.calculating")}
                      </span>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-lg md:text-2xl font-bold text-primary">
                        {formatResult(result)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* To Currency Display - Fixed UZS */}
              <div className="min-w-[120px] md:min-w-[140px] h-10 md:h-12 flex items-center justify-center bg-muted/30 rounded-lg border-2 border-border">
                <div className="flex items-center space-x-2">
                  <img
                    src={getFlagImage("UZS")}
                    alt="UZS flag"
                    className="w-6 h-4 md:w-7 md:h-5 object-cover rounded-sm"
                    onError={(e) => {
                      e.target.src = "/assets/images/no_image.png";
                    }}
                  />
                  <span className="font-semibold text-card-foreground text-sm md:text-base">
                    UZS
                  </span>
                </div>
              </div>
            </div>

            {/* Exchange Rate Info */}
            {fromCurrency !== "UZS" && (
              <div className="bg-muted/30 rounded-lg p-3 md:p-4 border border-border">
                <div className="text-center text-xs md:text-sm text-muted-foreground">
                  <span className="font-medium">
                    1 {fromCurrency} ={" "}
                    {formatResult(result / parseFloat(amount || 1))} UZS
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 md:p-6 border-t border-border bg-muted/20">
          <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
            <Icon name="AlertCircle" size={12} className="md:w-3.5 md:h-3.5" />
            <span className="text-xs">
              Kurslar faqat ma'lumot uchun. Haqiqiy kurslar farq qilishi mumkin.
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ConverterModal;
