import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../../components/ui/Navbar";
import Button from "../../components/ui/Button";
import VacancyCard from "../job-vacancies-browser/components/VacancyCard";
import JobDetailModal from "../job-vacancies-browser/components/JobDetailModal";
import LoadingSkeleton from "../job-vacancies-browser/components/LoadingSkeleton";
import Icon from "../../components/AppIcon";
import { vacanciesAPI } from "../../services/api";

const RegionPage = () => {
  const { regionName } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [vacancies, setVacancies] = useState([]);

  // Helper function to get language suffix for API fields
  const getLanguageSuffix = (language) => {
    if (language === "uz-Latn") return "uz";
    if (language === "uz-Cyrl") return "cr";
    if (language === "ru") return "ru";
    return "uz"; // default fallback
  };

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
  const formatLocation = (vacancy) => {
    if (vacancy.branch_type === "central") {
      return vacancy.branch_type_display || t("jobs.central_apparatus");
    } else if (vacancy.branch_type === "regional") {
      return formatRegionName(vacancy.region);
    }
    // Fallback
    return vacancy.branch_type_display || t("jobs.central_apparatus");
  };

  // Helper function to parse requirements (can be string or JSON)
  const parseRequirements = (requirements) => {
    if (!requirements) return [];

    // If it's already an array, return it
    if (Array.isArray(requirements)) {
      return requirements.map((item) => item.task || item);
    }

    // If it's a string, try to parse as JSON first
    if (typeof requirements === "string") {
      try {
        const parsed = JSON.parse(requirements);
        if (Array.isArray(parsed)) {
          return parsed.map((item) => item.task || item);
        }
      } catch (error) {
        // If parsing fails, treat as plain string and split by newlines or return as single item
        return requirements
          .split("\n")
          .filter((item) => item.trim().length > 0);
      }
    }

    return [];
  };

  // Helper function to parse job_tasks (can be string or JSON)
  const parseJobTasks = (jobTasks) => {
    if (!jobTasks) return [];

    // If it's already an array, return it
    if (Array.isArray(jobTasks)) {
      return jobTasks.map((item) => item.task || item);
    }

    // If it's a string, try to parse as JSON first
    if (typeof jobTasks === "string") {
      try {
        const parsed = JSON.parse(jobTasks);
        if (Array.isArray(parsed)) {
          return parsed.map((item) => item.task || item);
        }
      } catch (error) {
        // If parsing fails, treat as plain string and split by newlines or return as single item
        return jobTasks.split("\n").filter((item) => item.trim().length > 0);
      }
    }

    return [];
  };

  // Fetch vacancies by region
  useEffect(() => {
    const fetchVacancies = async () => {
      if (!regionName) return;

      setLoading(true);
      setApiError(null);

      try {
        // Fetch vacancies data
        const vacanciesResponse = await vacanciesAPI.getVacanciesByRegion(
          regionName,
          "regional"
        );
        // Handle paginated response structure: { count, next, previous, results: [...] }
        const vacanciesData = vacanciesResponse.results || vacanciesResponse;
        // Ensure it's an array
        const vacanciesArray = Array.isArray(vacanciesData)
          ? vacanciesData
          : [];

        // Filter only active vacancies (is_active: true)
        const activeVacancies = vacanciesArray.filter(
          (vacancy) => vacancy.is_active === true
        );

        // Get current language suffix
        const currentLanguage =
          i18n.language || localStorage.getItem("language") || "uz-Latn";
        const langSuffix = getLanguageSuffix(currentLanguage);

        // Get language-specific fields for vacancies
        const titleField = `title_${langSuffix}`;
        const requirementsField = `requirements_${langSuffix}`;
        const jobTasksField = `job_tasks_${langSuffix}`;
        const managementNameField = `name_${langSuffix}`;

        const transformedVacancies = activeVacancies.map((vacancy) => {
          // Get title based on current language
          const vacancyTitle =
            vacancy[titleField] ||
            vacancy.title_uz ||
            vacancy.title_cr ||
            vacancy.title_ru ||
            "";

          // Get management name based on current language
          const managementName =
            vacancy.management_details?.[managementNameField] ||
            vacancy.management_details?.name_uz ||
            vacancy.management_details?.name_cr ||
            vacancy.management_details?.name_ru ||
            "";

          // Get requirements based on current language
          const vacancyRequirements =
            vacancy[requirementsField] ||
            vacancy.requirements_uz ||
            vacancy.requirements_cr ||
            vacancy.requirements_ru ||
            [];

          // Get job tasks based on current language
          const vacancyJobTasks =
            vacancy[jobTasksField] ||
            vacancy.job_tasks_uz ||
            vacancy.job_tasks_cr ||
            vacancy.job_tasks_ru ||
            [];

          return {
            id: vacancy.id, // Keep original numeric ID for encoding
            title: vacancyTitle,
            department: managementName || formatRegionName(vacancy.region),
            location: formatLocation(vacancy),
            type: "Full-time",
            deadline: vacancy.application_deadline,
            testDeadline:
              vacancy.test_scheduled_at || vacancy.application_deadline,
            salary: "15,000,000 - 22,000,000 UZS", // This might need to come from API
            description: managementName
              ? `${managementName} - ${vacancyTitle}`
              : vacancyTitle, // Use management_details.name + title for short description
            fullDescription: vacancy.description || "",
            requirements: parseRequirements(vacancyRequirements),
            responsibilities: parseJobTasks(vacancyJobTasks),
          };
        });
        setVacancies(transformedVacancies);
      } catch (error) {
        console.error("Error fetching vacancies:", error);
        setApiError("Failed to load vacancies. Please try again later.");
        setVacancies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVacancies();
  }, [regionName, i18n.language]);

  const handleVacancySelect = (vacancy) => {
    // Encode the vacancy ID for URL
    const encodedId = btoa(vacancy.id.toString());
    navigate(`/region/${regionName}/${encodedId}`);
  };

  const handleCloseModal = () => {
    setShowJobModal(false);
    setSelectedVacancy(null);
  };

  const regionDisplayName = formatRegionName(regionName);

  // Show loading state
  if (loading && vacancies.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <LoadingSkeleton type="vacancies" count={4} />
          </div>
        </main>
      </div>
    );
  }

  // Show error state
  if (apiError && vacancies.length === 0) {
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
                Error Loading Vacancies
              </h1>
              <p className="text-muted-foreground mb-6">{apiError}</p>
              <Button
                variant="outline"
                onClick={() => navigate("/region")}
                iconName="ArrowLeft"
                iconPosition="left"
              >
                Orqaga
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Region Header with Back Button */}
          <div className="flex items-center gap-3 mb-4 sm:mb-5 md:mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/region")}
              className="flex-shrink-0"
            >
              <Icon name="ArrowLeft" size={20} />
            </Button>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground leading-tight">
                {regionDisplayName}
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                {vacancies.length} {t("jobs.vacancies_title").toLowerCase()}
              </p>
            </div>
          </div>

          {/* Error Message */}
          {apiError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <Icon
                  name="AlertCircle"
                  size={20}
                  className="text-red-600 dark:text-red-400 mr-3"
                />
                <div>
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    Error loading vacancies
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    {apiError}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Vacancies Section */}
          <div className="space-y-6 pb-20">
            {loading ? (
              <LoadingSkeleton type="vacancies" count={4} />
            ) : vacancies.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {vacancies.map((vacancy) => (
                  <VacancyCard
                    key={vacancy.id}
                    vacancy={vacancy}
                    onSelect={handleVacancySelect}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Icon
                  name="Briefcase"
                  size={48}
                  className="text-muted-foreground mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {t("jobs.no_vacancies_available")}
                </h3>
                <p className="text-muted-foreground">
                  {t("jobs.no_vacancies_available_desc")}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Job Detail Modal */}
      {showJobModal && selectedVacancy && (
        <JobDetailModal vacancy={selectedVacancy} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default RegionPage;
