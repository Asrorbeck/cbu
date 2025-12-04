import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../../components/ui/Navbar";
import DepartmentDetails from "../job-vacancies-browser/components/DepartmentDetails";
import VacancyCard from "../job-vacancies-browser/components/VacancyCard";
import JobDetailModal from "../job-vacancies-browser/components/JobDetailModal";
import LoadingSkeleton from "../job-vacancies-browser/components/LoadingSkeleton";
import Icon from "../../components/AppIcon";
import { departmentsAPI, vacanciesAPI } from "../../services/api";

const DepartmentPage = () => {
  const { departmentId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [department, setDepartment] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [vacancies, setVacancies] = useState([]);
  const [vacanciesLoading, setVacanciesLoading] = useState(false);
  const [vacanciesError, setVacanciesError] = useState(null);

  // Fetch department and vacancies data from API
  useEffect(() => {
    const fetchData = async () => {
      if (!departmentId) return;

      setLoading(true);
      setApiError(null);
      setVacanciesLoading(true);
      setVacanciesError(null);

      try {
        // Fetch department data
        const departmentData = await departmentsAPI.getDepartmentById(
          departmentId
        );
        const transformedDepartment = {
          id: departmentData.id.toString(),
          name: departmentData.name,
          description: departmentData.description,
          openings: 0, // Will be updated after fetching vacancies
          department_tasks: departmentData.department_tasks || [],
        };
        setDepartment(transformedDepartment);

        // Fetch vacancies data
        const vacanciesResponse = await vacanciesAPI.getVacanciesByDepartment(
          departmentId
        );
        // Handle paginated response structure: { count, next, previous, results: [...] }
        const vacanciesData = vacanciesResponse.results || vacanciesResponse;
        // Ensure it's an array
        const vacanciesArray = Array.isArray(vacanciesData) 
          ? vacanciesData 
          : [];
        
        const transformedVacancies = vacanciesArray.map((vacancy) => ({
          id: vacancy.id, // Keep original numeric ID for encoding
          title: vacancy.title, // Keep original title from backend
          department: departmentData.name,
          location: vacancy.branch_type_display || "Markaziy apparat",
          type: "Full-time",
          deadline: vacancy.application_deadline,
          testDeadline: vacancy.test_scheduled_at || vacancy.application_deadline,
          salary: "15,000,000 - 22,000,000 UZS", // This might need to come from API
          description: vacancy.management_details?.name
            ? `${vacancy.management_details.name} - ${vacancy.title}`
            : vacancy.title, // Use management_details.name + title for short description
          fullDescription: vacancy.description,
          requirements: parseRequirements(vacancy.requirements),
          responsibilities: parseJobTasks(vacancy.job_tasks),
        }));
        setVacancies(transformedVacancies);

        // Update department openings count
        setDepartment((prev) => ({
          ...prev,
          openings: transformedVacancies.length,
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
        setApiError("Failed to load department. Please try again later.");
        setVacanciesError("Failed to load vacancies. Please try again later.");

        // Fallback to mock data
        setDepartment({
          id: "information-technology",
          name: t("jobs.departments.information_technology.name"),
          description: t("jobs.departments.information_technology.description"),
          openings: 1,
        });
        setVacancies([]);
      } finally {
        setLoading(false);
        setVacanciesLoading(false);
      }
    };

    fetchData();
  }, [departmentId, t]);

  // Helper function to parse requirements (can be string or JSON)
  const parseRequirements = (requirements) => {
    if (!requirements) return [];
    
    // If it's already an array, return it
    if (Array.isArray(requirements)) {
      return requirements.map((item) => item.task || item);
    }
    
    // If it's a string, try to parse as JSON first
    if (typeof requirements === 'string') {
      try {
        const parsed = JSON.parse(requirements);
        if (Array.isArray(parsed)) {
          return parsed.map((item) => item.task || item);
        }
      } catch (error) {
        // If parsing fails, treat as plain string and split by newlines or return as single item
        return requirements.split('\n').filter(item => item.trim().length > 0);
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
    if (typeof jobTasks === 'string') {
      try {
        const parsed = JSON.parse(jobTasks);
        if (Array.isArray(parsed)) {
          return parsed.map((item) => item.task || item);
        }
      } catch (error) {
        // If parsing fails, treat as plain string and split by newlines or return as single item
        return jobTasks.split('\n').filter(item => item.trim().length > 0);
      }
    }
    
    return [];
  };

  // Vacancies are now fetched from API and stored in state

  const handleVacancySelect = (vacancy) => {
    // Encode the vacancy ID for URL (ensure it's a string for btoa)
    const encodedId = btoa(vacancy.id.toString());
    navigate(`/departments/${departmentId}/${encodedId}`);
  };

  const handleCloseModal = () => {
    setShowJobModal(false);
    setSelectedVacancy(null);
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
  if (apiError && !department) {
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
                Error Loading Department
              </h1>
              <p className="text-muted-foreground mb-6">{apiError}</p>
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

  // Show not found state
  if (!department) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <Icon
                name="AlertCircle"
                size={48}
                className="text-muted-foreground mx-auto mb-4"
              />
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {t("jobs.department_not_found")}
              </h1>
              <p className="text-muted-foreground mb-6">
                {t("jobs.department_not_found_desc")}
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate("/departments")}
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon name="ArrowLeft" size={16} />
              <span>{t("jobs.back_to_departments")}</span>
            </button>
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
                    Error loading department
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    {apiError}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Department Details */}
          <DepartmentDetails department={department} />

          {/* Vacancies Section */}
          <div className="space-y-6 pb-20">
            <h2 className="text-2xl font-bold text-foreground">
              {t("jobs.available_positions")} ({vacancies.length})
            </h2>

            {/* Vacancies Error Message */}
            {vacanciesError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
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
                      {vacanciesError}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {vacanciesLoading ? (
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

export default DepartmentPage;
