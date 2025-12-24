import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../../components/ui/Navbar";
import Button from "../../components/ui/Button";
import Icon from "../../components/AppIcon";
import DepartmentCard from "./components/DepartmentCard";
import LoadingSkeleton from "./components/LoadingSkeleton";
import { departmentsAPI } from "../../services/api";

const CentralDepartmentsPage = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [departments, setDepartments] = useState([]);
  const [apiError, setApiError] = useState(null);

  // Helper function to get language suffix for API fields
  const getLanguageSuffix = (language) => {
    if (language === "uz-Latn") return "uz";
    if (language === "uz-Cyrl") return "cr";
    if (language === "ru") return "ru";
    return "uz"; // default fallback
  };

  // Fetch departments from API
  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true);
      setApiError(null);
      try {
        const response = await departmentsAPI.getDepartments();
        // Handle paginated response structure: { count, next, previous, results: [...] }
        const departmentsData = response.results || response;
        // Ensure it's an array
        const departmentsArray = Array.isArray(departmentsData)
          ? departmentsData
          : [];

        // Get current language suffix
        const currentLanguage =
          i18n.language || localStorage.getItem("language") || "uz-Latn";
        const langSuffix = getLanguageSuffix(currentLanguage);

        // Transform API data to match component structure
        const transformedDepartments = departmentsArray.map((dept) => {
          // Get name based on current language
          const nameField = `name_${langSuffix}`;
          const tasksField = `department_tasks_${langSuffix}`;

          const name =
            dept[nameField] ||
            dept.name_uz ||
            dept.name_cr ||
            dept.name_ru ||
            "";
          const departmentTasks =
            dept[tasksField] ||
            dept.department_tasks_uz ||
            dept.department_tasks_cr ||
            dept.department_tasks_ru ||
            [];

          // Ensure department_tasks is an array of objects with 'task' property
          const formattedTasks = Array.isArray(departmentTasks)
            ? departmentTasks.map((task) =>
                typeof task === "string" ? { task } : task
              )
            : [];

          return {
            id: dept.id.toString(),
            name: name,
            description: "", // Add description field if needed in future
            icon: "Monitor", // Default icon, can be customized based on department
            color: "text-warning",
            bgColor: "bg-warning/10",
            openings: dept.active_vacancies_count || 0,
            active_vacancies_count: dept.active_vacancies_count || 0,
            department_tasks: formattedTasks,
          };
        });
        setDepartments(transformedDepartments);
      } catch (error) {
        console.error("Error fetching departments:", error);
        setApiError("Failed to load departments. Please try again later.");
        setDepartments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, [i18n.language]);

  // Filter departments based on search query
  const filteredDepartments = departments.filter(
    (dept) =>
      dept?.name && dept.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                {t("jobs.central_apparatus")}
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground mt-2">
                {t("jobs.central_apparatus_description")}
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
                    Error loading departments
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    {apiError}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Search Section */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-4 mb-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                  {t("jobs.search_departments")}
                </h2>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors font-medium"
                  >
                    {t("jobs.clear_search")}
                  </button>
                )}
              </div>
              <div className="relative">
                <Icon
                  name="Search"
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                />
                <input
                  type="text"
                  placeholder={t("jobs.search_placeholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Departments Grid */}
          {loading ? (
            <LoadingSkeleton type="cards" count={6} />
          ) : filteredDepartments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDepartments?.map((department) => (
                <DepartmentCard key={department?.id} department={department} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Icon
                name="Search"
                size={48}
                className="text-gray-400 mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t("jobs.no_departments_found")}
              </h3>
            </div>
          )}
        </div>
      </main>
      {/* Bottom navigation spacing */}
      <div className="h-20"></div>
    </div>
  );
};

export default CentralDepartmentsPage;

