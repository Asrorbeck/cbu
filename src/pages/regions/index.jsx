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
    { id: "toshkent", name: "Toshkent", displayName: "Toshkent viloyati" },
    { id: "qashqadaryo", name: "Qashqadaryo", displayName: "Qashqadaryo viloyati" },
    { id: "samarqand", name: "Samarqand", displayName: "Samarqand viloyati" },
    { id: "navoiy", name: "Navoiy", displayName: "Navoiy viloyati" },
    { id: "andijon", name: "Andijon", displayName: "Andijon viloyati" },
    { id: "fargona", name: "Farg'ona", displayName: "Farg'ona viloyati" },
    { id: "namangan", name: "Namangan", displayName: "Namangan viloyati" },
    { id: "surxondaryo", name: "Surxondaryo", displayName: "Surxondaryo viloyati" },
    { id: "sirdaryo", name: "Sirdaryo", displayName: "Sirdaryo viloyati" },
    { id: "jizzax", name: "Jizzax", displayName: "Jizzax viloyati" },
    { id: "buxoro", name: "Buxoro", displayName: "Buxoro viloyati" },
    { id: "xorazm", name: "Xorazm", displayName: "Xorazm viloyati" },
    { id: "qoraqalpogiston", name: "Qoraqalpog'iston", displayName: "Qoraqalpog'iston Respublikasi" },
  ];

  const handleRegionSelect = (regionId) => {
    navigate(`/region/${regionId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-left mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Hududiy bosh boshqarmalar
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
              Hududiy boshqarmalar bo'limlari va vakansiyalari
            </p>
          </div>

          {/* Back Button */}
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="outline"
              onClick={() => navigate("/departments")}
              iconName="ArrowLeft"
              iconPosition="left"
            >
              Orqaga
            </Button>
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
                    {region.displayName}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {region.displayName} vakansiyalari
                  </p>
                </div>

                {/* Action */}
                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-700">
                  <div className="flex items-center text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300">
                    <span className="text-sm font-medium">{t("jobs.view_details")}</span>
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

