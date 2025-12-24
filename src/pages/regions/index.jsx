import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../../components/ui/Navbar";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";

const RegionsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Region cards data
  const regionCards = [
    { id: "toshkent", name: "Toshkent" },
    { id: "qashqadaryo", name: "Qashqadaryo" },
    { id: "samarqand", name: "Samarqand" },
    { id: "navoiy", name: "Navoiy" },
    { id: "andijon", name: "Andijon" },
    { id: "fargona", name: "Farg'ona" },
    { id: "namangan", name: "Namangan" },
    { id: "surxondaryo", name: "Surxondaryo" },
    { id: "sirdaryo", name: "Sirdaryo" },
    { id: "jizzax", name: "Jizzax" },
    { id: "buxoro", name: "Buxoro" },
    { id: "xorazm", name: "Xorazm" },
    { id: "qoraqalpogiston", name: "Qoraqalpog'iston" },
  ];

  const handleRegionSelect = (regionId) => {
    navigate(`/region/${regionId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header with Back Button */}
          <div className="flex items-center gap-3 mb-4 sm:mb-5 md:mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/departments")}
              className="flex-shrink-0"
            >
              <Icon name="ArrowLeft" size={20} />
            </Button>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground leading-tight">
                {t("jobs.regional_management")}
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground mt-2">
                {t("jobs.regional_management_description")}
              </p>
            </div>
          </div>

          {/* Region Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regionCards.map((region) => (
              <div
                key={region.id}
                onClick={() => handleRegionSelect(region.id)}
                className="group relative bg-white dark:bg-slate-800 rounded-xl p-6 cursor-pointer hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 border border-gray-200 dark:border-slate-700"
              >
                {/* Icon in top-right corner */}
                <div className="absolute top-4 right-4 w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center group-hover:opacity-80 transition-opacity duration-300">
                  <Icon
                    name="MapPin"
                    size={20}
                    className="text-blue-600 dark:text-blue-400"
                  />
                </div>

                {/* Content */}
                <div className="space-y-3 pr-16">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {t(`jobs.regions.${region.id}`)}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {t(`jobs.regions.${region.id}`)} {t("jobs.vacancies_title").toLowerCase()}
                  </p>
                </div>

                {/* Action */}
                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-700">
                  <div className="flex items-center text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300">
                    <span className="text-sm font-medium">
                      {t("jobs.view_details")}
                    </span>
                    <Icon
                      name="ArrowRight"
                      size={16}
                      className="ml-2 group-hover:translate-x-1 transition-transform duration-300"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      {/* Bottom navigation spacing */}
      <div className="h-20"></div>
    </div>
  );
};

export default RegionsPage;
