import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/ui/Navbar";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import LoadingSkeleton from "../job-vacancies-browser/components/LoadingSkeleton";
import {
  departmentsAPI,
  vacanciesAPI,
  myApplicationsAPI,
} from "../../services/api";

const Applications = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { type } = useParams(); // "jobs", "reports", "appeals", "spelling"

  // Helper function to get language suffix for backend fields
  const getLanguageSuffix = (language) => {
    if (language === "uz-Latn") return "uz";
    if (language === "uz-Cyrl") return "cr";
    if (language === "ru") return "ru";
    return "uz"; // default fallback
  };

  const [applicationsData, setApplicationsData] = useState({
    apply_jobs: [],
    reports: [],
    appeals: [],
    spelling_reports: [],
  });
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadApplications = async () => {
      try {
        // Get Telegram user ID
        let userId = 905770018; // Default
        if (window.Telegram && window.Telegram.WebApp) {
          window.Telegram.WebApp.ready();
          if (
            window.Telegram.WebApp.initDataUnsafe &&
            window.Telegram.WebApp.initDataUnsafe.user
          ) {
            userId = window.Telegram.WebApp.initDataUnsafe.user.id;
          }
        }

        // Fetch all applications from API
        const data = await myApplicationsAPI.getMyApplications(userId);

        // Transform job applications
        // Get current language suffix
        const currentLanguage =
          i18n.language || localStorage.getItem("language") || "uz-Latn";
        const langSuffix = getLanguageSuffix(currentLanguage);

        // Get language-specific fields
        const titleField = `title_${langSuffix}`;
        const managementNameField = `name_${langSuffix}`;
        const departmentNameField = `name_${langSuffix}`;

        // Helper function to format region name
        const formatRegionName = (region) => {
          if (!region) return "";
          const regionKey = `jobs.regions.${region.toLowerCase()}`;
          const translatedName = t(regionKey);
          if (translatedName && translatedName !== regionKey) {
            return translatedName;
          }
          return region;
        };

        const jobApplications = (data.apply_jobs || []).map((app) => {
          try {
            // Get job data from app.job object
            const jobData = app.job;
            
            if (!jobData) {
              return {
                ...app,
                applicationType: "job",
                vacancyTitle: "Noma'lum vakansiya",
                departmentName: "Noma'lum",
                submittedAt: app.created_at || app.submittedAt,
                status: app.status || "pending",
              };
            }

            // Get title based on current language
            const vacancyTitle =
              jobData[titleField] ||
              jobData.title_uz ||
              jobData.title_cr ||
              jobData.title_ru ||
              "Noma'lum vakansiya";

            // Get department name and management name
            let departmentName = "";
            let managementName = "";

            // Check if management exists
            if (jobData.management) {
              // Get management name
              managementName =
                jobData.management[managementNameField] ||
                jobData.management.name_uz ||
                jobData.management.name_cr ||
                jobData.management.name_ru ||
                "";

              // Get department name from management.department if available
              if (jobData.management.department) {
                // If department is an object with name fields
                if (typeof jobData.management.department === 'object') {
                  departmentName =
                    jobData.management.department[departmentNameField] ||
                    jobData.management.department.name_uz ||
                    jobData.management.department.name_cr ||
                    jobData.management.department.name_ru ||
                    "";
                }
              }
            }

            // Format department name: "department_name - management_name" or just management_name or region
            let formattedDepartmentName = "";
            if (jobData.branch_type === "regional" && jobData.region) {
              // For regional, show region name
              formattedDepartmentName = formatRegionName(jobData.region);
            } else if (departmentName && managementName) {
              formattedDepartmentName = `${departmentName} - ${managementName}`;
            } else if (managementName) {
              formattedDepartmentName = managementName;
            } else if (departmentName) {
              formattedDepartmentName = departmentName;
            } else {
              formattedDepartmentName = t("jobs.central_apparatus");
            }

            return {
              ...app,
              applicationType: "job",
              vacancyTitle: vacancyTitle,
              departmentName: formattedDepartmentName,
              submittedAt: app.created_at || app.submittedAt,
              status: app.status || "pending",
            };
          } catch (error) {
            console.error(
              `Error processing job application ${app.id}:`,
              error
            );
            return {
              ...app,
              applicationType: "job",
              vacancyTitle: "Noma'lum vakansiya",
              departmentName: "Noma'lum",
              submittedAt: app.created_at || app.submittedAt,
              status: app.status || "pending",
            };
          }
        });

        // Transform reports (corruption & consumer rights)
        const reports = (data.reports || []).map((report) => ({
          ...report,
          applicationType: "submission",
          type:
            report.summary?.toLowerCase().includes("korruptsiya") ||
            report.summary?.toLowerCase().includes("коррупция") ||
            report.summary?.toLowerCase().includes("коррупция")
              ? "corruption"
              : "consumer_rights",
          typeLabel:
            report.summary?.toLowerCase().includes("korruptsiya") ||
            report.summary?.toLowerCase().includes("коррупция")
              ? "Korruptsiya"
              : "Iste'molchilar huquqlari",
          subject: report.summary || "Murojaat",
          submittedAt: report.created_at,
          status: report.is_archived ? "archived" : "pending",
        }));

        // Transform appeals
        const appeals = (data.appeals || []).map((appeal) => ({
          ...appeal,
          applicationType: "submission",
          type: "appeal",
          typeLabel: "Murojaat",
          subject: appeal.subject || "Murojaat",
          submittedAt: appeal.created_at,
          status: appeal.status || "pending",
        }));

        // Transform spelling reports
        const spellingReports = (data.spelling_reports || []).map((report) => ({
          ...report,
          applicationType: "submission",
          type: "spelling",
          typeLabel: "Orfografik xatolar",
          subject: report.description || "Orfografik xato haqida murojaat",
          submittedAt: report.created_at,
          status:
            report.status === "new" ? "pending" : report.status || "pending",
        }));

        // Store all data
        setApplicationsData({
          apply_jobs: jobApplications,
          reports: reports,
          appeals: appeals,
          spelling_reports: spellingReports,
        });

        // Show specific type if selected, otherwise show empty (only cards will be shown)
        let appsToShow = [];
        if (type === "jobs") {
          appsToShow = jobApplications;
        } else if (type === "reports") {
          appsToShow = reports;
        } else if (type === "appeals") {
          appsToShow = appeals;
        } else if (type === "spelling") {
          appsToShow = spellingReports;
        }
        // If no type selected, don't show any applications (only cards)

        // Sort by date
        appsToShow.sort((a, b) => {
          const dateA = new Date(a.submittedAt || a.created_at || 0);
          const dateB = new Date(b.submittedAt || b.created_at || 0);
          return dateB - dateA;
        });

        setApplications(appsToShow);
      } catch (error) {
        console.error("Error loading applications:", error);
        setApplications([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadApplications();
  }, [type, i18n.language]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
      case "Ko'rib chiqilmoqda":
      case "NEW":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "rejected":
      case "REJECTED_DOCS":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "TEST_SCHEDULED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getStatusText = (status) => {
    if (status === "Ko'rib chiqilmoqda") return status;

    switch (status) {
      case "pending":
      case "NEW":
        return "Kutilmoqda";
      case "approved":
        return "Qabul qilindi";
      case "rejected":
      case "REJECTED_DOCS":
        return "Rad etilgan";
      case "TEST_SCHEDULED":
        return "Testga qabul qilindi";
      default:
        return status || "Noma'lum";
    }
  };

  const handleCardClick = (applicationId) => {
    navigate(`/applications/${type}/${applicationId}`);
  };

  const handleTypeCardClick = (typeName) => {
    navigate(`/applications/${typeName}`);
  };

  const getTypeTitle = (typeName) => {
    switch (typeName) {
      case "jobs":
        return "Ish arizalari";
      case "reports":
        return "Shikoyatlar";
      case "appeals":
        return "Murojaatlar";
      case "spelling":
        return "Orfografik xatolar";
      default:
        return "";
    }
  };

  const getTypeIcon = (typeName) => {
    switch (typeName) {
      case "jobs":
        return "Briefcase";
      case "reports":
        return "AlertTriangle";
      case "appeals":
        return "FileText";
      case "spelling":
        return "SpellCheck";
      default:
        return "FileText";
    }
  };

  const getTypeColor = (typeName) => {
    switch (typeName) {
      case "jobs":
        return "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400";
      case "reports":
        return "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400";
      case "appeals":
        return "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400";
      case "spelling":
        return "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400";
      default:
        return "bg-gray-50 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
      case "Ko'rib chiqilmoqda":
      case "NEW":
        return "Clock";
      case "approved":
        return "CheckCircle";
      case "rejected":
      case "REJECTED_DOCS":
        return "XCircle";
      case "TEST_SCHEDULED":
        return "CheckCircle";
      default:
        return "HelpCircle";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header Skeleton */}
            <div className="mb-8">
              <div className="text-center mb-6">
                <div className="h-8 bg-muted rounded-lg w-64 mx-auto mb-3 animate-pulse"></div>
                <div className="h-5 bg-muted rounded-lg w-96 mx-auto animate-pulse"></div>
              </div>
            </div>

            {/* Type Cards Skeleton or Application Cards Skeleton */}
            {!type ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 animate-pulse"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                        <div className="space-y-2">
                          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                        </div>
                      </div>
                      <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Stats Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="bg-card border border-border rounded-xl p-4 text-center animate-pulse"
                    >
                      <div className="h-8 bg-muted rounded w-16 mx-auto mb-2"></div>
                      <div className="h-4 bg-muted rounded w-24 mx-auto"></div>
                    </div>
                  ))}
                </div>

                {/* Application Cards Skeleton */}
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5 md:p-6 animate-pulse"
                    >
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1 space-y-3">
                          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                        </div>
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                      </div>
                      <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </main>
        {/* Bottom navigation spacing - mobile only */}
        <div className="h-20 md:h-0"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground mb-3">
                {type ? getTypeTitle(type) : "Mening arizalarim"}
              </h1>
              <p className="text-muted-foreground">
                {type
                  ? `${getTypeTitle(type)} ro'yxati`
                  : "Barcha yuborilgan ariza va murojaatlaringizni ko'ring"}
              </p>
            </div>
          </div>

          {/* Type Cards - Show only when no specific type is selected */}
          {!type && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {/* Jobs Card */}
              <div
                onClick={() => handleTypeCardClick("jobs")}
                className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 cursor-pointer p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${getTypeColor("jobs")}`}>
                      <Icon name={getTypeIcon("jobs")} size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-1">
                        Ish arizalari
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {applicationsData.apply_jobs.length} ta ariza
                      </p>
                    </div>
                  </div>
                  <Icon
                    name="ChevronRight"
                    size={20}
                    className="text-gray-400"
                  />
                </div>
              </div>

              {/* Reports Card */}
              <div
                onClick={() => handleTypeCardClick("reports")}
                className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-lg hover:border-orange-300 dark:hover:border-orange-500 transition-all duration-300 cursor-pointer p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-3 rounded-lg ${getTypeColor("reports")}`}
                    >
                      <Icon name={getTypeIcon("reports")} size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-1">
                        Shikoyatlar
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {applicationsData.reports.length} ta shikoyat
                      </p>
                    </div>
                  </div>
                  <Icon
                    name="ChevronRight"
                    size={20}
                    className="text-gray-400"
                  />
                </div>
              </div>

              {/* Appeals Card */}
              <div
                onClick={() => handleTypeCardClick("appeals")}
                className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-500 transition-all duration-300 cursor-pointer p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-3 rounded-lg ${getTypeColor("appeals")}`}
                    >
                      <Icon name={getTypeIcon("appeals")} size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-1">
                        Murojaatlar
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {applicationsData.appeals.length} ta murojaat
                      </p>
                    </div>
                  </div>
                  <Icon
                    name="ChevronRight"
                    size={20}
                    className="text-gray-400"
                  />
                </div>
              </div>

              {/* Spelling Reports Card */}
              <div
                onClick={() => handleTypeCardClick("spelling")}
                className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-lg hover:border-green-300 dark:hover:border-green-500 transition-all duration-300 cursor-pointer p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-3 rounded-lg ${getTypeColor("spelling")}`}
                    >
                      <Icon name={getTypeIcon("spelling")} size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-1">
                        Orfografik xatolar
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {applicationsData.spelling_reports.length} ta xato
                      </p>
                    </div>
                  </div>
                  <Icon
                    name="ChevronRight"
                    size={20}
                    className="text-gray-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Back button when viewing specific type */}
          {type && (
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={() => navigate("/applications")}
                iconName="ArrowLeft"
                iconPosition="left"
                className="text-muted-foreground hover:text-foreground"
              >
                Barcha arizalarga qaytish
              </Button>
            </div>
          )}

          {/* Applications List - Only show when type is selected */}
          {type ? (
            applications.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
                  <Icon
                    name="FileText"
                    size={64}
                    className="text-muted-foreground mx-auto mb-4"
                  />
                  <h3 className="text-xl font-semibold text-card-foreground mb-2">
                    {getTypeTitle(type)} topilmadi
                  </h3>
                  <p className="text-muted-foreground">
                    Siz hali hech qanday {getTypeTitle(type).toLowerCase()}{" "}
                    yubormagansiz
                  </p>
                  {type === "jobs" && (
                    <div className="mt-6">
                      <Button
                        onClick={() => navigate("/departments")}
                        className="inline-flex items-center space-x-2"
                      >
                        <Icon name="Plus" size={16} />
                        <span>Ish qidirish</span>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Stats - Show only when viewing specific type */}
                {type && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-card border border-border rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-foreground mb-1">
                        {applications.length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Jami arizalar
                      </div>
                    </div>
                    <div className="bg-card border border-border rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-600 mb-1">
                        {
                          applications.filter(
                            (app) =>
                              app.status === "pending" ||
                              app.status === "Ko'rib chiqilmoqda" ||
                              app.status === "new" ||
                              app.status === "NEW"
                          ).length
                        }
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Kutilmoqda
                      </div>
                    </div>
                    <div className="bg-card border border-border rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {
                          applications.filter(
                            (app) =>
                              app.status === "approved" ||
                              app.status === "TEST_SCHEDULED"
                          ).length
                        }
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Qabul qilingan
                      </div>
                    </div>
                  </div>
                )}

                {/* Applications Cards */}
                <div className="space-y-4">
                  {applications.map((application) => {
                    return (
                      <div
                        key={application.id}
                        onClick={() => handleCardClick(application.id)}
                        className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 cursor-pointer p-5 md:p-6"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex-1 min-w-0">
                              {/* Type Badge */}
                              {application.applicationType === "submission" && (
                                <div
                                  className={`inline-flex px-3 py-1 rounded-lg text-xs font-semibold mb-3 ${
                                    application.type === "corruption"
                                      ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                                      : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                  }`}
                                >
                                  {application.typeLabel}
                                </div>
                              )}

                              {/* Title */}
                              <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                                {application.applicationType === "job"
                                  ? application.vacancyTitle
                                  : application.subject}
                              </h3>

                              {/* Subtitle */}
                              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                {application.applicationType === "job"
                                  ? application.departmentName
                                  : `Murojaat raqami: ${application.id}`}
                              </p>
                            </div>

                            {/* Arrow Icon */}
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center transition-colors duration-200">
                                <Icon
                                  name="ArrowRight"
                                  size={20}
                                  className="text-gray-600 dark:text-gray-400"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Status - Bottom */}
                          <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                Holati:
                              </span>
                              <div
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${getStatusColor(
                                  application.status
                                )}`}
                              >
                                <Icon
                                  name={getStatusIcon(application.status)}
                                  size={12}
                                />
                                <span>{getStatusText(application.status)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )
          ) : null}
        </div>
      </main>
      {/* Bottom navigation spacing */}
      <div className="h-20"></div>
    </div>
  );
};

export default Applications;
