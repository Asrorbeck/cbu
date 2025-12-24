import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import Navbar from "../../components/ui/Navbar";
// Removed unused imports - moved to separate pages

const JobVacanciesBrowser = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  // Removed state management - now only handles branch type selection

  // No need to check URL params anymore - navigation handles routing

  // Branch type cards data
  const branchTypeCards = [
    {
      id: "central",
      title: t("jobs.central_apparatus"),
      description: t("jobs.central_apparatus_description"),
      icon: "Building2",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      id: "regional",
      title: t("jobs.regional_management"),
      description: t("jobs.regional_management_description"),
      icon: "MapPin",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
  ];

  // Removed department fetching logic - moved to CentralDepartmentsPage

  // Removed mock vacancies data - moved to separate pages

  const handleBranchTypeSelect = (branchType) => {
    if (branchType === "central") {
      // For central, navigate to central departments page
      navigate("/departments/central");
    } else if (branchType === "regional") {
      // For regional, navigate to regional departments page
      navigate("/departments/regional");
    }
  };

  // Removed department and vacancy selection handlers - moved to separate pages

  const renderBranchTypeSelection = () => (
    <div className="space-y-6">
      {/* Branch Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {branchTypeCards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleBranchTypeSelect(card.id)}
            className="group relative bg-white dark:bg-slate-800 rounded-xl p-6 cursor-pointer hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 border border-gray-200 dark:border-slate-700"
          >
            {/* Icon in top-right corner */}
            <div
              className={`absolute top-4 right-4 w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center group-hover:opacity-80 transition-opacity duration-300`}
            >
              <Icon name={card.icon} size={20} className={card.color} />
            </div>

            {/* Content */}
            <div className="space-y-3 pr-16">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                {card.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {card.description}
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
  );

  // Removed renderDepartments and renderVacancies - moved to separate pages

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4 sm:mb-5 md:mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="flex-shrink-0"
            >
              <Icon name="ArrowLeft" size={20} />
            </Button>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground leading-tight">
                {t("jobs.title")}
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground mt-2">
                {t("jobs.subtitle")}
              </p>
            </div>
          </div>

          {/* Content */}
          {renderBranchTypeSelection()}
        </div>
      </main>
      {/* Removed Job Detail Modal - moved to separate pages */}
      {/* Bottom navigation spacing */}
      <div className="h-20"></div>
    </div>
  );
};

export default JobVacanciesBrowser;
