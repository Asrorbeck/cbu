import React from "react";
import { useTranslation } from "react-i18next";
import Icon from "../../../components/AppIcon";

const DepartmentDetails = ({ department }) => {
  const { t } = useTranslation();

  // Use department_tasks from API data if available, otherwise fallback to translation
  const departmentTasks =
    department?.department_tasks?.length > 0
      ? department.department_tasks.map((task) => task.task)
      : t("jobs.department_tasks.tasks", { returnObjects: true });

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 mb-6">
      {/* Openings Count */}
      {department?.openings !== undefined && (
        <div className="flex items-center space-x-2 mb-6">
          <Icon name="Briefcase" size={16} className="text-blue-600" />
          <span className="text-sm font-medium text-blue-600">
            {department?.openings} {t("jobs.open_positions")}
          </span>
        </div>
      )}

      {/* Department Tasks */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("jobs.department_tasks.title")}
        </h3>
        <div className="space-y-3">
          {departmentTasks.map((task, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {task}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetails;
