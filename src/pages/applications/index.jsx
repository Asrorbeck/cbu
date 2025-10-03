import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/ui/Navbar";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";

const Applications = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load applications from localStorage
    const savedApplications = JSON.parse(
      localStorage.getItem("jobApplications") || "[]"
    );
    setApplications(savedApplications);
    setIsLoading(false);
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
                {applications.map((application) => (
                  <div
                    key={application.id}
                    className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
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
                    </div>

                    {/* Application Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Ism:</span>
                          <span className="text-card-foreground font-medium">
                            {application.fullName}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Telefon:
                          </span>
                          <span className="text-card-foreground font-medium">
                            {application.phoneNumber}
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
                          <span className="text-muted-foreground">Maosh:</span>
                          <span className="text-card-foreground font-medium">
                            {application.salaryRange}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Jinoiy javobgarlik:
                          </span>
                          <span className="text-card-foreground font-medium">
                            {application.hasCriminalRecord ? "Ha" : "Yo'q"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Education */}
                    {application.education &&
                      application.education.length > 0 && (
                        <div className="mb-4 pt-4 border-t border-border">
                          <h4 className="text-sm font-semibold text-card-foreground mb-2">
                            Ta'lim:
                          </h4>
                          <div className="space-y-2">
                            {application.education.map((edu, index) => (
                              <div key={index} className="text-sm">
                                <div className="font-medium text-card-foreground">
                                  {edu.degree} - {edu.specialty}
                                </div>
                                <div className="text-muted-foreground">
                                  {edu.institution} ({edu.period})
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Work Experience */}
                    {application.workExperience &&
                      application.workExperience.length > 0 && (
                        <div className="mb-4 pt-4 border-t border-border">
                          <h4 className="text-sm font-semibold text-card-foreground mb-2">
                            Ish tajribasi:
                          </h4>
                          <div className="space-y-2">
                            {application.workExperience.map((work, index) => (
                              <div key={index} className="text-sm">
                                <div className="font-medium text-card-foreground">
                                  {work.position} - {work.company}
                                </div>
                                <div className="text-muted-foreground">
                                  {work.period}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Languages */}
                    {application.languages && (
                      <div className="mb-4 pt-4 border-t border-border">
                        <h4 className="text-sm font-semibold text-card-foreground mb-2">
                          Til bilish:
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              O'zbek:
                            </span>
                            <span className="text-card-foreground">
                              {application.languages.uzbek}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Rus:</span>
                            <span className="text-card-foreground">
                              {application.languages.russian}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Ingliz:
                            </span>
                            <span className="text-card-foreground">
                              {application.languages.english}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Additional Info */}
                    {application.additionalInfo && (
                      <div className="pt-4 border-t border-border">
                        <h4 className="text-sm font-semibold text-card-foreground mb-2">
                          Qo'shimcha ma'lumot:
                        </h4>
                        <p className="text-sm text-card-foreground">
                          {application.additionalInfo}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
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
