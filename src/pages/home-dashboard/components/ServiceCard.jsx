import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Icon from "../../../components/AppIcon";

const ServiceCard = ({ service }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleCardClick = () => {
    if (service?.disabled) return;
    navigate(service?.path);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative bg-white dark:bg-slate-800 rounded-xl p-6 transition-all duration-300 border ${
        service?.disabled
          ? "opacity-60 cursor-not-allowed border-gray-300 dark:border-slate-600"
          : "cursor-pointer hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-300 dark:hover:border-blue-500 border-gray-200 dark:border-slate-700"
      }`}
    >
      {/* Icon in top-right corner */}
      <div
        className={`absolute top-4 right-4 w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-300 ${
          service?.disabled
            ? "bg-gray-100 dark:bg-slate-700"
            : "bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50"
        }`}
      >
        <Icon
          name={service?.icon}
          size={20}
          className={
            service?.disabled
              ? "text-gray-400 dark:text-gray-500"
              : "text-blue-600 dark:text-blue-400"
          }
        />
      </div>

      {/* Simple Content */}
      <div className="space-y-3 pr-16">
        <h3
          className={`text-lg font-semibold transition-colors duration-300 ${
            service?.disabled
              ? "text-gray-500 dark:text-gray-400"
              : "text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400"
          }`}
        >
          {service?.title}
        </h3>
        <p
          className={`text-sm leading-relaxed ${
            service?.disabled
              ? "text-gray-400 dark:text-gray-500"
              : "text-gray-600 dark:text-gray-400"
          }`}
        >
          {service?.description}
        </p>
        {service?.disabled && (
          <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
            <Icon
              name="Clock"
              size={14}
              className="text-orange-600 dark:text-orange-400 mr-2"
            />
            <span className="text-xs font-medium text-orange-700 dark:text-orange-300">
              {service?.disabledMessage || "Jarayonda"}
            </span>
          </div>
        )}
      </div>

      {/* Simple Action */}
      {!service?.disabled && (
        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-700">
          <div className="flex items-center text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300">
            <span className="text-sm font-medium">
              {t("home.services.access_service")}
            </span>
            <Icon
              name="ArrowRight"
              size={16}
              className="ml-2 group-hover:translate-x-1 transition-transform duration-300"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceCard;
