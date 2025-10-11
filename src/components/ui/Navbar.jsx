import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import Icon from "../AppIcon";
import Button from "./Button";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "uz-Latn";
  });
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTelegramDesktop, setIsTelegramDesktop] = useState(false);
  const { t, i18n } = useTranslation();

  const languages = [
    { code: "uz-Latn", label: "O'zbekcha", flag: "🇺🇿" },
    { code: "uz-Cyrl", label: "Ўзбекча", flag: "🇺🇿" },
    { code: "ru", label: "Русский", flag: "🇷🇺" },
  ];

  useEffect(() => {
    document.documentElement?.classList?.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("language", language);
    try {
      i18n
        .changeLanguage(language)
        .then(() => {
          console.log("Language changed to:", language);
        })
        .catch((error) => {
          console.error("Language change error:", error);
        });
    } catch (error) {
      console.error("Language change error:", error);
    }
  }, [language, i18n]);

  // Telegram Web App initialization
  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    if (tg) {
      // Telegramga tayyor ekanimizni aytish
      tg.ready();

      // Sahifani kengaytirish
      tg.expand();

      // Platform va viewport ni tekshirish
      const platform = tg.platform || "";
      const viewportHeight = tg.viewportHeight || 0;

      // Desktop telegram: platform "tdesktop", "macos", "windows" bo'lishi mumkin
      // Va viewport height katta bo'ladi (> 600px odatda)
      const isDesktop =
        platform.includes("tdesktop") ||
        platform.includes("macos") ||
        platform.includes("windows") ||
        (viewportHeight > 600 &&
          !platform.includes("android") &&
          !platform.includes("ios"));

      setIsTelegramDesktop(isDesktop);

      // Fullscreen event listener
      if (tg.onEvent) {
        tg.onEvent("fullscreenChanged", (data) => {
          setIsFullscreen(data?.isFullscreen || false);
        });
      }

      console.log("Telegram WebApp initialized:", {
        platform,
        viewportHeight,
        isDesktop,
      });
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleLanguageChange = (langCode) => {
    console.log("Changing language to:", langCode);
    setLanguage(langCode);
    setIsLanguageDropdownOpen(false);
  };

  const handleLogoClick = () => {
    navigate("/home-dashboard");
  };

  const toggleFullscreen = () => {
    const tg = window.Telegram?.WebApp;

    if (!tg) return;

    if (isFullscreen) {
      // Fullscreen dan chiqish
      if (tg.exitFullscreen) {
        tg.exitFullscreen();
      }
    } else {
      // Fullscreen rejimga o'tish
      if (tg.requestFullscreen) {
        tg.requestFullscreen();
      } else {
        // Fallback: expand
        tg.expand();
      }
    }
  };

  const currentLanguage = languages?.find((lang) => lang?.code === language);

  // Debug current language
  console.log("Current language state:", language);
  console.log("Current language object:", currentLanguage);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-slate-900 dark:backdrop-blur-sm border-b border-gray-200 dark:border-slate-700 theme-transition shadow-sm dark:shadow-lg dark:shadow-slate-900/50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div
            className="flex items-center cursor-pointer group"
            onClick={handleLogoClick}
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <img
                  src="/assets/images/CBU_Logo.svg-1758136577882.png"
                  alt="Central Bank of Uzbekistan Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="block">
                <p className="text-xs text-muted-foreground -mt-1">
                  O'zbekiston Respublikasi
                </p>
                <h1 className="text-sm sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                  Markaziy Banki
                </h1>
              </div>
            </div>
          </div>

          {/* Navigation Actions */}
          <div className="flex items-center space-x-4">
            {/* Telegram Fullscreen Button - Only on Desktop Telegram */}
            {isTelegramDesktop && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="p-2"
                title={
                  isFullscreen
                    ? "Fullscreen dan chiqish"
                    : "Fullscreen rejimga o'tish"
                }
              >
                <Icon
                  name={isFullscreen ? "Minimize2" : "Maximize2"}
                  size={20}
                  className="transition-transform duration-300 hover:scale-110 text-icon"
                />
              </Button>
            )}

            {/* Language Switcher */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setIsLanguageDropdownOpen(!isLanguageDropdownOpen)
                }
                className="flex items-center space-x-2"
              >
                <span className="text-lg">{currentLanguage?.flag}</span>
                <span className="hidden sm:inline text-sm font-medium">
                  {currentLanguage?.label}
                </span>
                <Icon
                  name="ChevronDown"
                  size={16}
                  className={`transition-transform duration-200 ${
                    isLanguageDropdownOpen ? "rotate-180" : ""
                  } text-icon`}
                />
              </Button>

              {isLanguageDropdownOpen && (
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
                            className="ml-auto text-icon"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2"
            >
              <Icon
                name={theme === "light" ? "Moon" : "Sun"}
                size={20}
                className="transition-transform duration-300 hover:scale-110 text-icon"
              />
            </Button>
          </div>
        </div>
      </div>
      {/* Close dropdown when clicking outside */}
      {isLanguageDropdownOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsLanguageDropdownOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
