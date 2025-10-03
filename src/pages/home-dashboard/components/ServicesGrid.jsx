import React from "react";
import { useTranslation } from "react-i18next";
import ServiceCard from "./ServiceCard";

const ServicesGrid = () => {
  const { t } = useTranslation();
  const services = [
    {
      id: "currency",
      title: t("home.services.currency.title"),
      description: t("home.services.currency.description"),
      icon: "TrendingUp",
      path: "/currency-exchange-rates",
      color: "text-icon",
      bgColor: "bg-secondary/20",
    },
    {
      id: "vacancies",
      title: t("home.services.vacancies.title"),
      description: t("home.services.vacancies.description"),
      icon: "Briefcase",
      path: "/departments",
      color: "text-icon",
      bgColor: "bg-secondary/20",
    },
    {
      id: "feedback",
      title: t("home.services.feedback.title"),
      description: t("home.services.feedback.description"),
      icon: "MessageSquare",
      path: "/feedback-submission",
      color: "text-icon",
      bgColor: "bg-secondary/20",
    },
    {
      id: "news",
      title: t("home.services.news.title"),
      description: t("home.services.news.description"),
      icon: "Newspaper",
      path: "/news-articles-hub",
      color: "text-icon",
      bgColor: "bg-secondary/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {services?.map((service) => (
        <ServiceCard key={service?.id} service={service} />
      ))}
    </div>
  );
};

export default ServicesGrid;
