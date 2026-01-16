import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../../components/ui/Navbar";
import Icon from "../../components/AppIcon";
import LoadingSkeleton from "../job-vacancies-browser/components/LoadingSkeleton";
import { vacanciesAPI } from "../../services/api";

const VacancyDetailPage = () => {
  const { departmentId, regionName, vacancyId } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [vacancy, setVacancy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Decode the vacancy ID from URL
  const decodedVacancyId = vacancyId ? atob(vacancyId) : null;

  // Helper function to get language suffix for backend fields
  const getLanguageSuffix = (language) => {
    if (language === "uz-Latn") return "uz";
    if (language === "uz-Cyrl") return "cr";
    if (language === "ru") return "ru";
    return "uz"; // default fallback
  };

  // Fetch vacancy data from API
  useEffect(() => {
    const fetchVacancyData = async () => {
      if (!decodedVacancyId) {
        setError("Invalid vacancy ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const vacancyData = await vacanciesAPI.getVacancyById(decodedVacancyId);

        // Get current language suffix
        const currentLanguage =
          i18n.language || localStorage.getItem("language") || "uz-Latn";
        const langSuffix = getLanguageSuffix(currentLanguage);

        // Helper function to format region name
        const formatRegionName = (region) => {
          if (!region) return "";

          const regionLower = region.toLowerCase().trim();

          // Use translation for region name
          const regionKey = `jobs.regions.${regionLower}`;
          const translatedName = t(regionKey);

          // If translation exists and is different from the key, use it
          if (translatedName && translatedName !== regionKey) {
            return translatedName;
          }

          // Fallback: capitalize first letter and add "viloyati" for Latin
          const currentLanguage =
            i18n.language || localStorage.getItem("language") || "uz-Latn";

          if (currentLanguage === "ru") {
            // For Russian, add "ская область" or "Республика"
            if (regionLower === "qoraqalpogiston") {
              return "Республика Каракалпакстан";
            }
            const capitalized =
              region.charAt(0).toUpperCase() + region.slice(1).toLowerCase();
            return `${capitalized}ская область`;
          } else if (currentLanguage === "uz-Cyrl") {
            // For Cyrillic, add " вилояти" or " Республикаси"
            if (regionLower === "qoraqalpogiston") {
              return "Қорақалпоғистон Республикаси";
            }
            const capitalized =
              region.charAt(0).toUpperCase() + region.slice(1).toLowerCase();
            return `${capitalized} вилояти`;
          } else {
            // For Latin, add " viloyati" or " Respublikasi"
            if (regionLower === "qoraqalpogiston") {
              return "Qoraqalpog'iston Respublikasi";
            }
            const capitalized =
              region.charAt(0).toUpperCase() + region.slice(1).toLowerCase();
            return `${capitalized} viloyati`;
          }
        };

        // Helper function to format location based on branch_type
        const formatLocation = (vacancyData) => {
          if (vacancyData.branch_type === "central") {
            return t("jobs.central_apparatus");
          } else if (vacancyData.branch_type === "regional") {
            return formatRegionName(vacancyData.region);
          }
          // Fallback
          return t("jobs.central_apparatus");
        };

        // Get language-specific fields
        const titleField = `title_${langSuffix}`;
        const requirementsField = `requirements_${langSuffix}`;
        const jobTasksField = `job_tasks_${langSuffix}`;
        const managementNameField = `name_${langSuffix}`;
        const regionTitleField = `region_title_${langSuffix}`;
        const departmentNameField = `name_${langSuffix}`;

        // Get title based on current language
        const vacancyTitle =
          vacancyData[titleField] ||
          vacancyData.title_uz ||
          vacancyData.title_cr ||
          vacancyData.title_ru ||
          "";

        // Get region title based on current language
        const regionTitle =
          vacancyData[regionTitleField] ||
          vacancyData.region_title_uz ||
          vacancyData.region_title_cr ||
          vacancyData.region_title_ru ||
          null;

        // Get management name based on current language
        const managementName =
          vacancyData.management_details?.[managementNameField] ||
          vacancyData.management_details?.name_uz ||
          vacancyData.management_details?.name_cr ||
          vacancyData.management_details?.name_ru ||
          vacancyData.management?.name ||
          "";

        // Get department name from management_details.department if available
        let departmentName = "";
        if (vacancyData.management_details?.department) {
          // If department is an object with name fields
          if (typeof vacancyData.management_details.department === "object") {
            departmentName =
              vacancyData.management_details.department[departmentNameField] ||
              vacancyData.management_details.department.name_uz ||
              vacancyData.management_details.department.name_cr ||
              vacancyData.management_details.department.name_ru ||
              "";
          }
        }

        // Format department name: "department_name - management_name" or just management_name
        // If it's a regional route, don't use "Markaziy apparat" as fallback
        let formattedDepartmentName = "";
        if (departmentName && managementName) {
          formattedDepartmentName = `${departmentName} - ${managementName}`;
        } else if (managementName) {
          formattedDepartmentName = managementName;
        } else {
          // Only use "Markaziy apparat" as fallback if it's NOT a regional route
          if (regionName && vacancyData.branch_type === "regional") {
            formattedDepartmentName = ""; // Empty for regional routes
          } else {
            formattedDepartmentName = t("jobs.central_apparatus");
          }
        }

        // Get requirements based on current language
        const vacancyRequirements =
          vacancyData[requirementsField] ||
          vacancyData.requirements_uz ||
          vacancyData.requirements_cr ||
          vacancyData.requirements_ru ||
          [];

        // Get job tasks based on current language
        const vacancyJobTasks =
          vacancyData[jobTasksField] ||
          vacancyData.job_tasks_uz ||
          vacancyData.job_tasks_cr ||
          vacancyData.job_tasks_ru ||
          [];

        // Transform the API response to match our component structure
        const transformedVacancy = {
          id: vacancyData.id.toString(),
          title: vacancyTitle,
          department: formattedDepartmentName,
          location: formatLocation(vacancyData),
          regionTitle: regionTitle,
          type: "Full-time",
          deadline: vacancyData.application_deadline,
          testDeadline:
            vacancyData.test_scheduled_at || vacancyData.application_deadline,
          salary: "15,000,000 - 22,000,000 UZS", // This might need to come from API
          description: formattedDepartmentName
            ? `${formattedDepartmentName} - ${vacancyTitle}`
            : vacancyTitle,
          requirements: parseJsonArray(vacancyRequirements),
          responsibilities: parseJsonArray(vacancyJobTasks),
          languageRequirements: {
            ru:
              vacancyData.lan_requirements_ru_display ||
              vacancyData.lan_requirements_ru ||
              "",
            eng:
              vacancyData.lan_requirements_eng_display ||
              vacancyData.lan_requirements_eng ||
              "",
          },
        };

        setVacancy(transformedVacancy);
      } catch (error) {
        console.error("Error fetching vacancy:", error);
        setError("Failed to load vacancy details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchVacancyData();
  }, [decodedVacancyId, i18n.language]);

  // Helper function to parse JSON string arrays or plain text
  const parseJsonArray = (data) => {
    if (!data) return [];

    // If it's already an array, return it
    if (Array.isArray(data)) {
      return data.map((item) => item.task || item);
    }

    // If it's a string, try to parse as JSON first
    if (typeof data === "string") {
      try {
        const parsed = JSON.parse(data);
        return Array.isArray(parsed)
          ? parsed.map((item) => item.task || item)
          : [];
      } catch (error) {
        // If JSON parsing fails, treat as plain text
        // If it contains newlines, split by them; otherwise treat as single item
        if (data.includes("\n")) {
          return data.split("\n").filter((line) => line.trim().length > 0);
        }
        // If it's a single string without newlines, return it as a single item array
        return [data.trim()].filter((item) => item.length > 0);
      }
    }

    return [];
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <LoadingSkeleton type="cards" count={3} />
          </div>
        </main>
      </div>
    );
  }

  // Show error state
  if (error || !vacancy) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <Icon
                name="AlertCircle"
                size={48}
                className="text-red-500 mx-auto mb-4"
              />
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {t("jobs.vacancy_detail.error_loading_title")}
              </h1>
              <p className="text-muted-foreground mb-6">
                {error || t("jobs.vacancy_detail.vacancy_not_found")}
              </p>
              <button
                onClick={() => navigate("/departments")}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                {t("jobs.back_to_departments")}
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const formatDeadline = (deadline) => {
    const date = new Date(deadline);
    return date?.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Format test deadline with date and time
  const formatTestDeadline = (deadline) => {
    if (!deadline) return "";
    try {
      const date = new Date(deadline);
      if (isNaN(date.getTime())) return "";
      
      // Format date: DD.MM.YYYY
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      
      // Format time: HH:MM
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      
      return `${day}.${month}.${year} ${hours}:${minutes}`;
    } catch (error) {
      console.error("Error formatting test deadline:", error);
      return "";
    }
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 sm:mb-6 md:mb-8">
            <button
              onClick={() => {
                if (regionName) {
                  navigate(`/region/${regionName}`);
                } else if (departmentId) {
                  navigate(`/departments/${departmentId}`);
                } else {
                  navigate("/departments");
                }
              }}
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon name="ArrowLeft" size={16} />
              <span>
                {regionName ? t("surveys.back") : t("jobs.back_to_departments")}
              </span>
            </button>
          </div>

          {/* Vacancy Details */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-700 dark:to-slate-600 px-6 py-8">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {vacancy?.title}
                  </h1>
                  <p className="text-blue-600 dark:text-blue-400 text-lg font-medium mb-4">
                    {vacancy?.department}
                  </p>
                  <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-2">
                      <Icon name="MapPin" size={18} />
                      <span>{vacancy?.location}</span>
                    </div>
                  </div>
                </div>
                <div
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-sm border ${
                    isVacancyClosed
                      ? "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 border-orange-300 dark:border-orange-800"
                      : "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-300 dark:border-green-800"
                  }`}
                >
                  {isVacancyClosed
                    ? t("jobs.vacancy_detail.deadline_passed")
                    : t("jobs.open")}
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6 space-y-8">
              {/* Region Title Info */}
              {vacancy?.regionTitle && (
                <div className="bg-blue-50 dark:bg-blue-900/20 px-4 py-3 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center space-x-3">
                    <Icon
                      name="MapPin"
                      size={18}
                      className="text-blue-600 dark:text-blue-400 flex-shrink-0"
                    />
                    <div className="flex-1">
                      <span className="text-xs text-blue-600 dark:text-blue-400 font-medium block mb-1">
                        {t("jobs.region_title")}
                      </span>
                      <span className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                        {vacancy.regionTitle}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Deadlines */}
              <div className="space-y-3">
                <div
                  className={`grid gap-3 ${
                    vacancy?.testDeadline
                      ? "grid-cols-1 md:grid-cols-2"
                      : "grid-cols-1"
                  }`}
                >
                  <div className="flex items-center space-x-3 bg-blue-50 dark:bg-blue-900/20 px-4 py-3 rounded-lg border border-blue-200 dark:border-blue-800 w-full">
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
                    <div className="flex items-center space-x-3 bg-green-50 dark:bg-green-900/20 px-4 py-3 rounded-lg border border-green-200 dark:border-green-800 w-full">
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
                            {formatTestDeadline(vacancy?.testDeadline)}
                          </span>
                          {testDaysRemaining !== null &&
                            testDaysRemaining >= 0 && (
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

              {/* Responsibilities */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {t("jobs.vacancy.responsibilities")}
                </h2>
                <ul className="space-y-2">
                  {vacancy?.responsibilities?.map((resp, index) => (
                    <li
                      key={index}
                      className="flex items-start space-x-3 text-gray-700 dark:text-gray-300"
                    >
                      <Icon
                        name="CircleCheck"
                        size={20}
                        className="text-green-600 dark:text-green-400 flex-shrink-0 mt-1"
                      />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Requirements */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {t("jobs.vacancy.requirements")}
                </h2>
                <ul className="space-y-2">
                  {vacancy?.requirements?.map((req, index) => (
                    <li
                      key={index}
                      className="flex items-start space-x-3 text-gray-700 dark:text-gray-300"
                    >
                      <Icon
                        name="CircleCheck"
                        size={20}
                        className="text-green-600 dark:text-green-400 flex-shrink-0 mt-1"
                      />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Apply Button */}
              <div className="pt-6 border-t border-gray-100 dark:border-slate-700">
                <button
                  onClick={() => {
                    if (!isVacancyClosed) {
                      // Check if it's a region route or department route
                      const termsPath = regionName
                        ? `/region/${regionName}/${vacancyId}/terms-and-conditions`
                        : `/departments/${departmentId}/${vacancyId}/terms-and-conditions`;

                      navigate(termsPath, {
                        state: { vacancyInfo: vacancy },
                      });
                    }
                  }}
                  disabled={isVacancyClosed}
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-colors duration-300 ${
                    isVacancyClosed
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {isVacancyClosed
                    ? t("jobs.vacancy_detail.closed")
                    : t("jobs.vacancy_detail.apply_now")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VacancyDetailPage;
