import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import Navbar from "../../components/ui/Navbar";
import HeroSection from "./components/HeroSection";
import ServicesGrid from "./components/ServicesGrid";
import QuickActions from "./components/QuickActions";
import AnnouncementBanner from "./components/AnnouncementBanner";
import LoadingComponent from "../../components/ui/LoadingComponent";

const HomeDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [currencies, setCurrencies] = useState([]);
  const [lastUpdateDate, setLastUpdateDate] = useState(null);
  const { t, i18n } = useTranslation();

  // Fetch currencies from CBU API
  const fetchCurrencies = async () => {
    try {
      const response = await fetch(
        "https://cbu.uz/uz/arkhiv-kursov-valyut/json/"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch currency data");
      }

      const data = await response.json();

      // Get the date from the first currency item
      const apiDate = data[0]?.Date; // Format: "24.09.2025"

      // Parse the date manually: DD.MM.YYYY
      const [day, month, year] = apiDate.split(".");

      // Month names in Uzbek
      const monthNames = [
        "yanvar",
        "fevral",
        "mart",
        "aprel",
        "may",
        "iyun",
        "iyul",
        "avgust",
        "sentyabr",
        "oktyabr",
        "noyabr",
        "dekabr",
      ];

      const monthName = monthNames[parseInt(month) - 1];
      const formattedDate = `${parseInt(day)} ${monthName}, ${year}`;

      setLastUpdateDate(formattedDate);

      // Transform CBU API data to our format
      const transformedCurrencies = data.map((item) => ({
        id: item.id,
        code: item.Ccy,
        name: item.CcyNm_UZ,
        numericCode: item.Code,
        rate: parseFloat(item.Rate),
        change: parseFloat(item.Diff),
        lastUpdated: formattedDate,
        nominal: parseInt(item.Nominal),
      }));

      setCurrencies(transformedCurrencies);
    } catch (err) {
      console.error("Error fetching currencies:", err);
      // Fallback to empty array
      setCurrencies([]);
    }
  };

  useEffect(() => {
    // Check for saved language preference
    const savedLanguage = localStorage.getItem("language") || "uz-latn";
    setCurrentLanguage(savedLanguage);
    try {
      i18n.changeLanguage(savedLanguage);
    } catch {}

    // Fetch currencies
    fetchCurrencies();

    // Simulate loading time for smooth UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getLocalizedContent = () => ({
    title: t("home.title"),
    description: t("home.description"),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <LoadingComponent
              type="card"
              count={4}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6"
            />
          </div>
        </main>
      </div>
    );
  }

  const localizedContent = getLocalizedContent();

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{localizedContent?.title}</title>
        <meta name="description" content={localizedContent?.description} />
        <meta
          name="keywords"
          content="central bank, banking services, currency rates, job vacancies, feedback, news"
        />
        <meta property="og:title" content={localizedContent?.title} />
        <meta
          property="og:description"
          content={localizedContent?.description}
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={localizedContent?.title} />
        <meta
          name="twitter:description"
          content={localizedContent?.description}
        />
      </Helmet>
      <Navbar />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Announcement Banner */}
          {/* <AnnouncementBanner /> */}

          {/* Hero Section */}
          <HeroSection
            currencies={currencies.slice(0, 3)}
            lastUpdateDate={lastUpdateDate}
          />

          {/* Services Grid */}
          <div className="mb-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                {t("home.services_title")}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t("home.services_description")}
              </p>
            </div>
            <ServicesGrid />
          </div>

          {/* Quick Actions */}
          {/* <QuickActions /> */}

          {/* Footer Section */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
                <span>Last Updated: September 17, 2025</span>
                <span>•</span>
                <span>Version 0.0.1</span>
              </div>
              <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
                Central Bank WebApp provides secure access to essential banking
                services. For technical support or inquiries, please contact our
                customer service team.
              </p>
              <div className="flex items-center justify-center space-x-4 pt-4">
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <span>All Systems Operational</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Bottom navigation spacing - mobile only */}
      <div className="h-20 md:h-0"></div>
    </div>
  );
};

export default HomeDashboard;
