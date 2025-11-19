import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import Navbar from "../../components/ui/Navbar";
import Button from "../../components/ui/Button";
import Icon from "../../components/AppIcon";

const FeedbackSubmission = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const handleBackToDashboard = () => {
    navigate("/home-dashboard");
  };

  const submissionTypes = [
    {
      id: "consumer-rights",
      type: "consumer-rights",
      title: t("submissions.types.consumer_rights.title"),
      description: t("submissions.types.consumer_rights.description"),
      icon: "ShieldAlert",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      action: () => navigate("/submissions/consumer-rights"),
    },
    {
      id: "corruption",
      type: "corruption",
      title: t("submissions.types.corruption.title"),
      description: t("submissions.types.corruption.description"),
      icon: "AlertTriangle",
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
      action: () => navigate("/submissions/corruption"),
    },
    {
      id: "language-error",
      type: "language-error",
      title: t("submissions.types.language_error.title"),
      description: t("submissions.types.language_error.description"),

      icon: "FileText",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      action: () => navigate("/submissions/language-error"),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{t("submissions.title")} - Markaziy Bank</title>
      </Helmet>
      {/* Navigation */}
      <Navbar />
      {/* Main Content */}
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={handleBackToDashboard}
              iconName="ArrowLeft"
              iconPosition="left"
              className="text-muted-foreground hover:text-foreground"
            >
              {t("submissions.back_to_dashboard")}
            </Button>
          </div>

          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              {t("submissions.title")}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              {t("submissions.subtitle")}
            </p>
          </div>

          {/* Submission Type Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {submissionTypes.map((type) => (
              <div
                key={type.id}
                onClick={type.action}
                className="group relative bg-white dark:bg-slate-800 rounded-xl p-6 cursor-pointer hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 border border-gray-200 dark:border-slate-700"
              >
                {/* Icon in top-right corner */}
                <div
                  className={`absolute top-4 right-4 w-12 h-12 ${type.bgColor} rounded-lg flex items-center justify-center group-hover:opacity-80 transition-opacity duration-300`}
                >
                  <Icon name={type.icon} size={20} className={type.color} />
                </div>

                {/* Content */}
                <div className="space-y-3 pr-16">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {type.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {type.description}
                  </p>
                </div>

                {/* Action */}
                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-700">
                  <div className="flex items-center text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300">
                    <span className="text-sm font-medium">
                      Murojaat yuborish
                    </span>
                    <Icon
                      name="ArrowRight"
                      size={16}
                      className="ml-2 group-hover:translate-x-1 transition-transform duration-300"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      {/* Bottom navigation spacing */}
      <div className="h-20"></div>
    </div>
  );
};

export default FeedbackSubmission;
