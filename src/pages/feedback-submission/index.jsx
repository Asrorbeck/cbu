import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import Navbar from "../../components/ui/Navbar";
import SubmissionTypeCard from "./components/SubmissionTypeCard";
import Button from "../../components/ui/Button";

const FeedbackSubmission = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
    },
    {
      id: "corruption",
      type: "corruption",
      title: t("submissions.types.corruption.title"),
      description: t("submissions.types.corruption.description"),
      icon: "AlertTriangle",
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-8">
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
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("submissions.title")}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("submissions.subtitle")}
            </p>
          </div>

          {/* Submission Type Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {submissionTypes.map((type) => (
              <SubmissionTypeCard
                key={type.id}
                type={type.type}
                title={type.title}
                description={type.description}
                icon={type.icon}
                color={type.color}
                bgColor={type.bgColor}
              />
            ))}
          </div>
        </div>
      </main>
      {/* Bottom navigation spacing - mobile only */}
      <div className="h-20 md:h-0"></div>
    </div>
  );
};

export default FeedbackSubmission;
