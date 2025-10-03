import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";

const ServiceCard = ({ service }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(service?.path);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-white dark:bg-slate-800 rounded-xl p-6 cursor-pointer hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 border border-gray-200 dark:border-slate-700"
    >
      {/* Icon in top-right corner */}
      <div className="absolute top-4 right-4 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors duration-300">
        <Icon
          name={service?.icon}
          size={20}
          className="text-blue-600 dark:text-blue-400"
        />
      </div>

      {/* Simple Content */}
      <div className="space-y-3 pr-16">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          {service?.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {service?.description}
        </p>
      </div>

      {/* Simple Action */}
      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-700">
        <div className="flex items-center text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300">
          <span className="text-sm font-medium">Xizmatga kirish</span>
          <Icon
            name="ArrowRight"
            size={16}
            className="ml-2 group-hover:translate-x-1 transition-transform duration-300"
          />
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
