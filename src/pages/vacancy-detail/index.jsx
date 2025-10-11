import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../../components/ui/Navbar";
import Icon from "../../components/AppIcon";
import LoadingSkeleton from "../job-vacancies-browser/components/LoadingSkeleton";
import { vacanciesAPI } from "../../services/api";

const VacancyDetailPage = () => {
  const { departmentId, vacancyId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [vacancy, setVacancy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Decode the vacancy ID from URL
  const decodedVacancyId = vacancyId ? atob(vacancyId) : null;

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

        // Transform the API response to match our component structure
        const transformedVacancy = {
          id: vacancyData.id.toString(),
          title: vacancyData.title,
          department: vacancyData.management?.name || "Markaziy apparat",
          location: vacancyData.management?.name || "Markaziy apparat",
          type: "Full-time",
          deadline: vacancyData.application_deadline,
          testDeadline: vacancyData.application_deadline,
          salary: "15,000,000 - 22,000,000 UZS", // This might need to come from API
          description: vacancyData.management?.name
            ? `${vacancyData.management.name} - ${vacancyData.title}`
            : vacancyData.title,
          fullDescription: vacancyData.description,
          requirements: parseJsonArray(vacancyData.requirements),
          responsibilities: parseJsonArray(vacancyData.job_tasks),
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
  }, [decodedVacancyId]);

  // Helper function to parse JSON string arrays
  const parseJsonArray = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      return Array.isArray(parsed)
        ? parsed.map((item) => item.task || item)
        : [];
    } catch (error) {
      console.error("Error parsing JSON array:", error);
      return [];
    }
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
                Error Loading Vacancy
              </h1>
              <p className="text-muted-foreground mb-6">
                {error || "Vacancy not found"}
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
  const isVacancyClosed = isDeadlinePassed();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() =>
                navigate(
                  departmentId ? `/departments/${departmentId}` : "/departments"
                )
              }
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon name="ArrowLeft" size={16} />
              <span>{t("jobs.back_to_departments")}</span>
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
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    isVacancyClosed
                      ? "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
                      : "bg-success/10 text-success"
                  }`}
                >
                  {isVacancyClosed ? "Muddat o'tgan" : t("jobs.open")}
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6 space-y-8">
              {/* Deadlines */}
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t("jobs.application_deadline")} & {t("jobs.test_period")}
                </h2>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-3 bg-blue-50 dark:bg-blue-900/20 px-4 py-3 rounded-lg border border-blue-200 dark:border-blue-800">
                    <Icon
                      name="Calendar"
                      size={20}
                      className="text-blue-600 dark:text-blue-400"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                        {t("jobs.application_deadline")}
                      </span>
                      <span className="text-base font-semibold text-blue-800 dark:text-blue-200">
                        {formatDeadline(vacancy?.deadline)}
                      </span>
                    </div>
                  </div>
                  {vacancy?.testDeadline && (
                    <div className="flex items-center space-x-3 bg-green-50 dark:bg-green-900/20 px-4 py-3 rounded-lg border border-green-200 dark:border-green-800">
                      <Icon
                        name="Clipboard"
                        size={20}
                        className="text-green-600 dark:text-green-400"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                          {t("jobs.test_period")}
                        </span>
                        <span className="text-base font-semibold text-green-800 dark:text-green-200">
                          {formatDeadline(vacancy?.testDeadline)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {t("jobs.vacancy.description")}
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {vacancy?.fullDescription}
                </p>
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
                        name="CheckCircle"
                        size={20}
                        className="text-green-500 flex-shrink-0 mt-1"
                      />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
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
                        name="CheckCircle"
                        size={20}
                        className="text-green-500 flex-shrink-0 mt-1"
                      />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Apply Button */}
              <div className="pt-6 border-t border-gray-100 dark:border-slate-700">
                <button
                  onClick={() => {
                    if (!isVacancyClosed) {
                      navigate(
                        `/departments/${departmentId}/${vacancyId}/terms-and-conditions`,
                        {
                          state: { vacancyInfo: vacancy },
                        }
                      );
                    }
                  }}
                  disabled={isVacancyClosed}
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-colors duration-300 ${
                    isVacancyClosed
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {isVacancyClosed ? "Yopiq" : "Ariza topshirish"}
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
