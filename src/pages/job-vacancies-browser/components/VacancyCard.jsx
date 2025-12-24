import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Icon from "../../../components/AppIcon";

const VacancyCard = ({ vacancy, onSelect }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const formatDeadline = (deadline) => {
    const date = new Date(deadline);
    return date?.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const isDeadlinePassed = () => {
    if (!vacancy?.deadline) return false;
    const today = new Date();
    const deadlineDate = new Date(vacancy.deadline);
    // Set time to end of day for deadline comparison
    deadlineDate.setHours(23, 59, 59, 999);
    return today > deadlineDate;
  };

  const daysRemaining = getDaysRemaining(vacancy?.deadline);
  const testDaysRemaining = vacancy?.testDeadline
    ? getDaysRemaining(vacancy.testDeadline)
    : null;
  const isVacancyClosed = isDeadlinePassed();
  const isUrgent = daysRemaining <= 7 && daysRemaining > 0;

  // Format location to show translated "Markaziy Apparat" based on current language
  const getFormattedLocation = () => {
    const location = vacancy?.location;
    if (!location) return t("jobs.central_apparatus");
    
    // Check if location is "Markaziy Apparat" in any form (Latin, Cyrillic, or Russian)
    const locationLower = location.toLowerCase().trim();
    if (
      locationLower === "markaziy apparat" ||
      locationLower === "марказий аппарат" ||
      locationLower === "центральный аппарат"
    ) {
      return t("jobs.central_apparatus");
    }
    
    return location;
  };

  const handleCardClick = () => {
    // Use onSelect prop if provided (for DepartmentPage), otherwise use default navigation
    if (onSelect) {
      onSelect(vacancy);
    } else {
      // Department sahifasidan kelayotgan bo'lsa, department ID ni ham URL ga qo'shamiz
      const currentPath = window.location.pathname;
      if (currentPath.includes("/departments/")) {
        const departmentId = currentPath.split("/departments/")[1];
        navigate(`/departments/${departmentId}/${vacancy?.id}`);
      } else {
        navigate(`/vacancy/${vacancy?.id}`);
      }
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-card border border-border rounded-xl p-6 cursor-pointer card-hover shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out"
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors duration-300 mb-2">
              {vacancy?.title}
            </h3>
          </div>
          <div
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${
              isVacancyClosed
                ? "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700"
                : "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700"
            }`}
          >
            {isVacancyClosed ? t("jobs.closed") : t("jobs.open")}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {vacancy?.description}
        </p>

        {/* Deadlines */}
        <div className="space-y-2">
          <div
            className={`grid gap-2 ${
              vacancy?.testDeadline
                ? "grid-cols-1 md:grid-cols-2"
                : "grid-cols-1"
            }`}
          >
            <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg border border-blue-200 dark:border-blue-800 w-full">
              <Icon
                name="Calendar"
                size={16}
                className="text-blue-600 dark:text-blue-400"
              />
              <div className="flex flex-col flex-1">
                <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                  {t("jobs.application_deadline")}
                </span>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                    {formatDeadline(vacancy?.deadline)}
                  </span>
                  {daysRemaining >= 0 && (
                    <span className="text-xs font-medium text-blue-700 dark:text-blue-300 whitespace-nowrap">
                      {daysRemaining} {t("jobs.days_left")}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {vacancy?.testDeadline && (
              <div className="flex items-center space-x-2 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg border border-green-200 dark:border-green-800 w-full">
                <Icon
                  name="Clipboard"
                  size={16}
                  className="text-green-600 dark:text-green-400"
                />
                <div className="flex flex-col flex-1">
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                    {t("jobs.test_period")}
                  </span>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-green-800 dark:text-green-200">
                      {formatDeadline(vacancy?.testDeadline)}
                    </span>
                    {testDaysRemaining !== null && testDaysRemaining >= 0 && (
                      <span className="text-xs font-medium text-green-700 dark:text-green-300 whitespace-nowrap">
                        {testDaysRemaining} {t("jobs.days_left")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center space-x-2">
            <Icon name="MapPin" size={14} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {getFormattedLocation()}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-primary opacity-100 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-sm font-medium">
              {t("jobs.view_details")}
            </span>
            <Icon
              name="ArrowRight"
              size={16}
              className="group-hover:translate-x-1 transition-transform duration-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VacancyCard;
