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
      id: "applications",
      title: t("home.services.applications.title"),
      description: t("home.services.applications.description"),
      icon: "FileText",
      path: "/submissions",
      color: "text-icon",
      bgColor: "bg-secondary/20",
    },
    {
      id: "surveys",
      title: t("home.services.surveys.title"),
      description: t("home.services.surveys.description"),
      icon: "ClipboardList",
      path: "/surveys",
      color: "text-icon",
      bgColor: "bg-secondary/20",
      disabled: true,
      disabledMessage: t("home.services.coming_soon") || "Tez orada ishga tushadi",
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
