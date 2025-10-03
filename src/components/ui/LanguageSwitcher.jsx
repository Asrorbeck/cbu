import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Icon from "../AppIcon";
import Button from "./Button";

const LanguageSwitcher = ({ className = "" }) => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "uz-Latn";
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const languages = [
    { code: "uz-Latn", label: "O'zbekcha", flag: "🇺🇿" },
    { code: "uz-Cyrl", label: "Ўзбекча", flag: "🇺🇿" },
    { code: "ru", label: "Русский", flag: "🇷🇺" },
  ];

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const handleLanguageChange = (langCode) => {
    setLanguage(langCode);
    i18n.changeLanguage(langCode);
    setIsDropdownOpen(false);
  };

  const currentLanguage = languages?.find((lang) => lang?.code === language);

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2"
        aria-label="Change language"
      >
        <span className="text-lg">{currentLanguage?.flag}</span>
        <span className="hidden sm:inline text-sm font-medium">
          {currentLanguage?.label}
        </span>
        <Icon
          name="ChevronDown"
          size={16}
          className={`transition-transform duration-200 ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
        />
      </Button>
      {isDropdownOpen && (
        <>
          <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-lg shadow-lg z-50 animate-fade-in">
            <div className="py-2">
              {languages?.map((lang) => (
                <button
                  key={lang?.code}
                  onClick={() => handleLanguageChange(lang?.code)}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors duration-200 flex items-center space-x-3 ${
                    language === lang?.code
                      ? "bg-muted text-primary font-medium"
                      : "text-popover-foreground"
                  }`}
                >
                  <span className="text-lg">{lang?.flag}</span>
                  <span>{lang?.label}</span>
                  {language === lang?.code && (
                    <Icon
                      name="Check"
                      size={16}
                      className="ml-auto text-primary"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Backdrop to close dropdown */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsDropdownOpen(false)}
          />
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;
