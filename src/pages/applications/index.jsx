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
  const [expandedCards, setExpandedCards] = useState(new Set());

  useEffect(() => {
    const loadApplications = async () => {
      try {
        // Load applications from localStorage
        const savedApplications = JSON.parse(
          localStorage.getItem("jobApplications") || "[]"
        );

        // Fetch department and vacancy details for each application
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
                vacancyTitle: vacancyDetails.title,
                departmentName: departmentDetails.name,
              };
            } catch (error) {
              console.error(
                `Error fetching details for application ${app.id}:`,
                error
              );
              // Return original app if API fails
              return app;
            }
          })
        );

        setApplications(applicationsWithDetails);
      } catch (error) {
        console.error("Error loading applications:", error);
        // Fallback to localStorage data only
        const savedApplications = JSON.parse(
          localStorage.getItem("jobApplications") || "[]"
        );
        setApplications(savedApplications);
      } finally {
        setIsLoading(false);
      }
    };

    loadApplications();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
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
    switch (status) {
      case "pending":
        return "Kutilmoqda";
      case "approved":
        return "Qabul qilindi";
      case "rejected":
        return "Rad etildi";
      default:
        return "Noma'lum";
    }
  };

  const getLanguageLevelText = (level) => {
    switch (level) {
      case "dont_know":
        return "Bilmayman";
      case "beginner":
        return "Boshlang'ich";
      case "intermediate":
        return "O'rta";
      case "excellent":
        return "A'lo";
      default:
        return level;
    }
  };

  const getLanguageNameText = (language) => {
    switch (language) {
      case "uzbek":
        return "O'zbek tili";
      case "russian":
        return "Rus tili";
      case "english":
        return "Ingliz tili";
      default:
        return language;
    }
  };

  const toggleCard = (applicationId) => {
    setExpandedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(applicationId)) {
        newSet.delete(applicationId);
      } else {
        newSet.add(applicationId);
      }
      return newSet;
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
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
                Barcha yuborilgan ish arizalaringizni ko'ring
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
                  Siz hali hech qanday ish uchun ariza bermagansiz
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
                      applications.filter((app) => app.status === "pending")
                        .length
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

              {/* Applications */}
              <div className="space-y-4">
                {applications.map((application) => {
                  const isExpanded = expandedCards.has(application.id);

                  return (
                    <div
                      key={application.id}
                      className="bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      {/* Header - Always Visible */}
                      <div
                        className="p-6 cursor-pointer"
                        onClick={() => toggleCard(application.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-xl font-semibold text-card-foreground">
                                {application.vacancyTitle}
                              </h3>
                              <div
                                className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(
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
                            <p className="text-muted-foreground">
                              {application.departmentName}
                            </p>
                          </div>
                          <div className="ml-4">
                            <Icon
                              name={isExpanded ? "ChevronUp" : "ChevronDown"}
                              size={20}
                              className="text-muted-foreground transition-transform duration-200"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Expandable Content */}
                      {isExpanded && (
                        <div className="px-6 pb-6 border-t border-border">
                          {/* Application Details */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pt-4">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  Ism:
                                </span>
                                <span className="text-card-foreground font-medium">
                                  {application.full_name}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  Telefon:
                                </span>
                                <span className="text-card-foreground font-medium">
                                  {application.phone}
                                </span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  Yuborilgan:
                                </span>
                                <span className="text-card-foreground font-medium">
                                  {formatDate(application.submittedAt)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  Jinoiy javobgarlik:
                                </span>
                                <span className="text-card-foreground font-medium">
                                  {application.hasCriminalRecord
                                    ? "Ha"
                                    : "Yo'q"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Education */}
                          {application.graduations &&
                            application.graduations.length > 0 && (
                              <div className="mb-4 pt-4 border-t border-border">
                                <h4 className="text-sm font-semibold text-card-foreground mb-2">
                                  Ta'lim:
                                </h4>
                                <div className="space-y-2">
                                  {application.graduations.map((edu, index) => (
                                    <div key={index} className="text-sm">
                                      <div className="font-medium text-card-foreground">
                                        {edu.degree} - {edu.specialization}
                                      </div>
                                      <div className="text-muted-foreground">
                                        {edu.university} ({edu.date_from} -{" "}
                                        {edu.date_to})
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                          {/* Work Experience */}
                          {application.employments &&
                            application.employments.length > 0 && (
                              <div className="mb-4 pt-4 border-t border-border">
                                <h4 className="text-sm font-semibold text-card-foreground mb-2">
                                  Ish tajribasi:
                                </h4>
                                <div className="space-y-2">
                                  {application.employments.map(
                                    (work, index) => (
                                      <div key={index} className="text-sm">
                                        <div className="font-medium text-card-foreground">
                                          {work.position} -{" "}
                                          {work.organization_name}
                                        </div>
                                        <div className="text-muted-foreground">
                                          {work.date_from} - {work.date_to}
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}

                          {/* Languages */}
                          {application.languages &&
                            application.languages.length > 0 && (
                              <div className="mb-4 pt-4 border-t border-border">
                                <h4 className="text-sm font-semibold text-card-foreground mb-2">
                                  Til bilish:
                                </h4>
                                <div className="space-y-2">
                                  {application.languages.map((lang, index) => (
                                    <div
                                      key={index}
                                      className="flex justify-between text-sm"
                                    >
                                      <span className="text-muted-foreground">
                                        {getLanguageNameText(
                                          lang.language_name
                                        )}
                                        :
                                      </span>
                                      <span className="text-card-foreground">
                                        {getLanguageLevelText(lang.degree)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                          {/* Additional Info */}
                          {application.additional_information && (
                            <div className="pt-4 border-t border-border">
                              <h4 className="text-sm font-semibold text-card-foreground mb-2">
                                Qo'shimcha ma'lumot:
                              </h4>
                              <p className="text-sm text-card-foreground">
                                {application.additional_information}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
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
