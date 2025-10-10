import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/ui/Navbar";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import { departmentsAPI, vacanciesAPI } from "../../services/api";

const Applications = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadApplications = async () => {
      try {
        // Load job applications from localStorage
        const savedApplications = JSON.parse(
          localStorage.getItem("jobApplications") || "[]"
        );

        // Load submissions (corruption & consumer rights) from localStorage
        const savedSubmissions = JSON.parse(
          localStorage.getItem("submissions") || "[]"
        );

        // Fetch department and vacancy details for job applications
        const applicationsWithDetails = await Promise.all(
          savedApplications.map(async (app) => {
            try {
              // Get vacancy details
              const vacancyDetails = await vacanciesAPI.getVacancyById(app.job);

              // Get department details
              const departmentDetails = await departmentsAPI.getDepartmentById(
                vacancyDetails.management.department
              );

              return {
                ...app,
                applicationType: "job",
                vacancyTitle: vacancyDetails.title,
                departmentName: departmentDetails.name,
              };
            } catch (error) {
              console.error(
                `Error fetching details for application ${app.id}:`,
                error
              );
              // Return original app if API fails
              return {
                ...app,
                applicationType: "job",
              };
            }
          })
        );

        // Combine job applications and submissions
        const allApplications = [
          ...applicationsWithDetails,
          ...savedSubmissions.map((sub) => ({
            ...sub,
            applicationType: "submission",
          })),
        ].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

        setApplications(allApplications);
      } catch (error) {
        console.error("Error loading applications:", error);
        // Fallback to localStorage data only
        const savedApplications = JSON.parse(
          localStorage.getItem("jobApplications") || "[]"
        );
        const savedSubmissions = JSON.parse(
          localStorage.getItem("submissions") || "[]"
        );
        setApplications([
          ...savedApplications.map((app) => ({
            ...app,
            applicationType: "job",
          })),
          ...savedSubmissions.map((sub) => ({
            ...sub,
            applicationType: "submission",
          })),
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadApplications();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
      case "Ko'rib chiqilmoqda":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getStatusText = (status) => {
    if (status === "Ko'rib chiqilmoqda") return status;

    switch (status) {
      case "pending":
        return "Kutilmoqda";
      case "approved":
        return "Qabul qilindi";
      case "rejected":
        return "Rad etildi";
      default:
        return status || "Noma'lum";
    }
  };

  const handleCardClick = (applicationId) => {
    navigate(`/applications/${applicationId}`);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
      case "Ko'rib chiqilmoqda":
        return "Clock";
      case "approved":
        return "CheckCircle";
      case "rejected":
        return "XCircle";
      default:
        return "HelpCircle";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-card border border-border rounded-xl p-6"
                >
                  <div className="h-6 bg-muted rounded w-1/3 mb-3"></div>
                  <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                </div>
              ))}
            </div>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  onClick={() => navigate("/profile")}
                  className="flex items-center space-x-2"
                >
                  <Icon name="ArrowLeft" size={18} />
                  <span>Orqaga</span>
                </Button>
              </div>
            </div>

            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground mb-3">
                Mening arizalarim
              </h1>
              <p className="text-muted-foreground">
                Barcha yuborilgan ariza va murojaatlaringizni ko'ring
              </p>
            </div>
          </div>

          {/* Applications List */}
          {applications.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
                <Icon
                  name="FileText"
                  size={64}
                  className="text-muted-foreground mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold text-card-foreground mb-2">
                  Hozircha arizalar yo'q
                </h3>
                <p className="text-muted-foreground mb-6">
                  Siz hali hech qanday ariza yoki murojaat yubormagansiz
                </p>
                <Button
                  onClick={() => navigate("/departments")}
                  className="inline-flex items-center space-x-2"
                >
                  <Icon name="Plus" size={16} />
                  <span>Ish qidirish</span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Stats */}
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
                          app.status === "Ko'rib chiqilmoqda"
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
                      applications.filter((app) => app.status === "approved")
                        .length
                    }
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Qabul qilingan
                  </div>
                </div>
              </div>

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
          )}
        </div>
      </main>
      {/* Bottom navigation spacing - mobile only */}
      <div className="h-20 md:h-0"></div>
    </div>
  );
};

export default Applications;
