import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import Navbar from "../../components/ui/Navbar";
import Button from "../../components/ui/Button";
import Icon from "../../components/AppIcon";
import { departmentsAPI, vacanciesAPI, myApplicationsAPI } from "../../services/api";
import { formatDate } from "../../utils/dateFormatter";

const ApplicationDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadApplication = async () => {
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

        // Try to find in job applications
        let foundApp = (data.apply_jobs || []).find((app) => String(app.id) === String(id));

        if (foundApp) {
          // Fetch vacancy and department details
          try {
            if (foundApp.job) {
              const vacancyDetails = await vacanciesAPI.getVacancyById(foundApp.job);
              const departmentDetails = await departmentsAPI.getDepartmentById(
                vacancyDetails.management.department
              );
              foundApp = {
                ...foundApp,
                applicationType: "job",
                vacancyTitle: vacancyDetails.title,
                departmentName: departmentDetails.name,
                submittedAt: foundApp.created_at || foundApp.submittedAt,
                status: foundApp.status || "pending",
              };
            } else {
              foundApp = {
                ...foundApp,
                applicationType: "job",
                submittedAt: foundApp.created_at || foundApp.submittedAt,
                status: foundApp.status || "pending",
              };
            }
          } catch (error) {
            console.error("Error fetching job details:", error);
            foundApp = {
              ...foundApp,
              applicationType: "job",
              submittedAt: foundApp.created_at || foundApp.submittedAt,
              status: foundApp.status || "pending",
            };
          }
        } else {
          // Try to find in reports
          foundApp = (data.reports || []).find((report) => String(report.id) === String(id));
          if (foundApp) {
            foundApp = {
              ...foundApp,
              applicationType: "submission",
              type: foundApp.summary?.toLowerCase().includes("korruptsiya") || 
                    foundApp.summary?.toLowerCase().includes("коррупция")
                ? "corruption"
                : "consumer_rights",
              typeLabel: foundApp.summary?.toLowerCase().includes("korruptsiya") || 
                         foundApp.summary?.toLowerCase().includes("коррупция")
                ? "Korruptsiya"
                : "Iste'molchilar huquqlari",
              subject: foundApp.summary || "Murojaat",
              fullName: foundApp.full_name,
              phone: foundApp.phone_number,
              email: foundApp.email,
              description: foundApp.message_text,
              submittedAt: foundApp.created_at,
              status: foundApp.is_archived ? "archived" : "pending",
            };
          } else {
            // Try to find in appeals
            foundApp = (data.appeals || []).find((appeal) => String(appeal.id) === String(id));
            if (foundApp) {
              foundApp = {
                ...foundApp,
                applicationType: "submission",
                type: "appeal",
                typeLabel: "Murojaat",
                subject: foundApp.subject || "Murojaat",
                submittedAt: foundApp.created_at,
                status: foundApp.status || "pending",
              };
            } else {
              // Try to find in spelling reports
              foundApp = (data.spelling_reports || []).find(
                (report) => String(report.id) === String(id)
              );
              if (foundApp) {
                foundApp = {
                  ...foundApp,
                  applicationType: "submission",
                  type: "spelling",
                  typeLabel: "Orfografik xatolar",
                  subject: foundApp.description || "Orfografik xato haqida murojaat",
                  fullName: foundApp.full_name,
                  phone: foundApp.phone_number,
                  email: foundApp.email,
                  description: foundApp.description,
                  text_snippet: foundApp.text_snippet,
                  source_url: foundApp.source_url,
                  attachment: foundApp.attachment,
                  submittedAt: foundApp.created_at,
                  status: foundApp.status === "new" ? "pending" : foundApp.status || "pending",
                };
              }
            }
          }
        }

        setApplication(foundApp);
      } catch (error) {
        console.error("Error loading application:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadApplication();
  }, [id]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
      case "Ko'rib chiqilmoqda":
      case "new":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "archived":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getStatusText = (status) => {
    if (status === "Ko'rib chiqilmoqda") return status;
    if (status === "new") return "Yangi";
    if (status === "archived") return "Arxivlangan";
    
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

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
      case "Ko'rib chiqilmoqda":
      case "new":
        return "Clock";
      case "approved":
        return "CheckCircle";
      case "rejected":
        return "XCircle";
      case "archived":
        return "Archive";
      default:
        return "HelpCircle";
    }
  };

  const getLanguageNameText = (langName) => {
    const languageMap = {
      uzbek: "O'zbek tili",
      russian: "Rus tili",
      english: "Ingliz tili",
    };
    return languageMap[langName] || langName;
  };

  const getLanguageLevelText = (level) => {
    const levelMap = {
      dont_know: "Bilmayman",
      beginner: "Boshlang'ich",
      intermediate: "O'rta",
      advanced: "Yuqori",
      excellent: "A'lo",
    };
    return levelMap[level] || level;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/3"></div>
              <div className="h-64 bg-gray-200 dark:bg-slate-700 rounded"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <Icon
                name="AlertCircle"
                size={64}
                className="text-gray-400 mx-auto mb-4"
              />
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Ariza topilmadi
              </h2>
              <p className="text-muted-foreground mb-6">
                Bunday ariza mavjud emas yoki o'chirilgan
              </p>
              <Button onClick={() => navigate("/applications")}>
                Arizalarga qaytish
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>
          {application.applicationType === "job"
            ? application.vacancyTitle
            : application.subject}{" "}
          - Ariza tafsilotlari
        </title>
      </Helmet>
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button and Edit */}
          <div className="mb-6 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate("/applications")}
              iconName="ArrowLeft"
              iconPosition="left"
              className="text-muted-foreground hover:text-foreground"
            >
              Arizalarga qaytish
            </Button>

            {/* Edit button - only for corruption submissions that are not approved/rejected */}
            {application.applicationType === "submission" &&
              application.type === "corruption" &&
              application.status === "Ko'rib chiqilmoqda" && (
                <Button
                  variant="outline"
                  onClick={() => navigate(`/edit-corruption/${id}`)}
                  iconName="Edit"
                  iconPosition="left"
                >
                  Tahrirlash
                </Button>
              )}
          </div>

          {/* Header Card */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 md:p-8 border border-gray-200 dark:border-slate-700 mb-6">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex-1">
                <div className="flex items-center flex-wrap gap-2 mb-3">
                  {/* Type Badge */}
                  {application.applicationType === "submission" && (
                    <div
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                        application.type === "corruption"
                          ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      }`}
                    >
                      <Icon
                        name={
                          application.type === "corruption"
                            ? "AlertTriangle"
                            : "ShieldAlert"
                        }
                        size={14}
                      />
                      <span>{application.typeLabel}</span>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${getStatusColor(
                      application.status
                    )}`}
                  >
                    <Icon
                      name={getStatusIcon(application.status)}
                      size={14}
                    />
                    <span>{getStatusText(application.status)}</span>
                  </div>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  {application.applicationType === "job"
                    ? application.vacancyTitle
                    : application.subject}
                </h1>

                <p className="text-sm text-muted-foreground">
                  {application.applicationType === "job"
                    ? application.departmentName
                    : `Murojaat raqami: ${application.id}`}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200 dark:border-slate-700">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Yuborilgan sana
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {formatDate(
                    application.submittedAt || application.submittedDate
                  )}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Ariza raqami
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {application.id}
                </p>
              </div>
            </div>
          </div>

          {/* Details Section */}
          {application.applicationType === "submission" ? (
            // Submission Details
            <div className="space-y-6">
              {/* Personal Information */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700">
                <h2 className="text-lg font-bold text-foreground mb-4 pb-3 border-b border-gray-200 dark:border-slate-700">
                  Shaxsiy ma'lumotlar
                </h2>
                {application.fullName ? (
                  // Non-anonymous user - show all info
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          F.I.SH
                        </p>
                        <p className="text-sm font-semibold text-foreground">
                          {application.fullName}
                        </p>
                      </div>
                      {application.phone && (
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            Telefon raqam
                          </p>
                          <p className="text-sm font-semibold text-foreground">
                            {application.phone}
                          </p>
                        </div>
                      )}
                    </div>
                    {application.email && (
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Email
                        </p>
                        <p className="text-sm font-semibold text-foreground">
                          {application.email}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  // Anonymous user - show badge only
                  <div className="flex items-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700/50 rounded-lg border border-gray-300 dark:border-gray-600">
                      <Icon
                        name="UserX"
                        size={18}
                        className="text-gray-500 dark:text-gray-400"
                      />
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                        Anonim foydalanuvchi
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Address (for corruption) */}
              {application.type === "corruption" && (
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700">
                  <h2 className="text-lg font-bold text-foreground mb-4 pb-3 border-b border-gray-200 dark:border-slate-700">
                    Yashash manzili
                  </h2>
                  <p className="text-sm text-foreground">
                    {application.region}, {application.district},{" "}
                    {application.neighborhood}, {application.street} ko'chasi,{" "}
                    {application.house}-uy, {application.apartment}-xonadon
                  </p>
                </div>
              )}

              {/* Description */}
              {(application.description || application.message_text) && (
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700">
                  <h2 className="text-lg font-bold text-foreground mb-4 pb-3 border-b border-gray-200 dark:border-slate-700">
                    Murojaat matni
                  </h2>
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">
                    {application.description || application.message_text}
                  </p>
                </div>
              )}

              {/* Spelling Report Specific Fields */}
              {application.type === "spelling" && (
                <>
                  {application.text_snippet && (
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700">
                      <h2 className="text-lg font-bold text-foreground mb-4 pb-3 border-b border-gray-200 dark:border-slate-700">
                        Xato matni
                      </h2>
                      <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">
                        {application.text_snippet}
                      </p>
                    </div>
                  )}
                  {application.source_url && (
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700">
                      <h2 className="text-lg font-bold text-foreground mb-4 pb-3 border-b border-gray-200 dark:border-slate-700">
                        Manba URL
                      </h2>
                      <a
                        href={application.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline break-all"
                      >
                        {application.source_url}
                      </a>
                    </div>
                  )}
                  {application.attachment && (
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700">
                      <h2 className="text-lg font-bold text-foreground mb-4 pb-3 border-b border-gray-200 dark:border-slate-700">
                        Ilova
                      </h2>
                      <div className="mt-2">
                        <a
                          href={`${import.meta.env.VITE_API_BASE_URL?.replace(/\/v1\/?$/, "") || "https://b21b5a398785.ngrok-free.app/api"}${application.attachment}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          <Icon name="File" size={16} />
                          <span>Ilovani ko'rish</span>
                        </a>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            // Job Application Details
            <div className="space-y-6">
              {/* Personal Information */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700">
                <h2 className="text-lg font-bold text-foreground mb-4 pb-3 border-b border-gray-200 dark:border-slate-700">
                  Shaxsiy ma'lumotlar
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      F.I.SH
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {application.full_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Telefon raqam
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {application.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Jinoiy javobgarlik
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {application.hasCriminalRecord ? "Ha" : "Yo'q"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Education */}
              {application.graduations &&
                application.graduations.length > 0 && (
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700">
                    <h2 className="text-lg font-bold text-foreground mb-4 pb-3 border-b border-gray-200 dark:border-slate-700">
                      Ma'lumoti
                    </h2>
                    <div className="space-y-4">
                      {application.graduations.map((edu, index) => (
                        <div
                          key={index}
                          className="pb-4 border-b border-gray-200 dark:border-slate-700 last:border-0 last:pb-0"
                        >
                          <div className="font-semibold text-foreground mb-1">
                            {edu.degree} - {edu.specialization}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {edu.university}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {edu.date_from} - {edu.date_to}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Work Experience */}
              {application.employments &&
                application.employments.length > 0 && (
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700">
                    <h2 className="text-lg font-bold text-foreground mb-4 pb-3 border-b border-gray-200 dark:border-slate-700">
                      Ish tajribasi
                    </h2>
                    <div className="space-y-4">
                      {application.employments.map((work, index) => (
                        <div
                          key={index}
                          className="pb-4 border-b border-gray-200 dark:border-slate-700 last:border-0 last:pb-0"
                        >
                          <div className="font-semibold text-foreground mb-1">
                            {work.position}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {work.organization_name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {work.date_from} - {work.date_to}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Languages */}
              {application.languages && application.languages.length > 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700">
                  <h2 className="text-lg font-bold text-foreground mb-4 pb-3 border-b border-gray-200 dark:border-slate-700">
                    Til bilish darajasi
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {application.languages.map((lang, index) => (
                      <div key={index}>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          {getLanguageNameText(lang.language_name)}
                        </p>
                        <p className="text-sm font-semibold text-foreground">
                          {getLanguageLevelText(lang.degree)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Info */}
              {application.additional_information && (
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700">
                  <h2 className="text-lg font-bold text-foreground mb-4 pb-3 border-b border-gray-200 dark:border-slate-700">
                    Qo'shimcha ma'lumot
                  </h2>
                  <p className="text-sm text-foreground leading-relaxed">
                    {application.additional_information}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <div className="h-20"></div>
    </div>
  );
};

export default ApplicationDetail;
