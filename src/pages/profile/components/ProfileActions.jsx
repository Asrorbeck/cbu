import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const ProfileActions = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    // Load applications from localStorage
    const savedApplications = JSON.parse(
      localStorage.getItem("jobApplications") || "[]"
    );
    setApplications(savedApplications);
  }, []);

  const actionItems = [
    {
      id: "applications",
      icon: "FileText",
      title: t("profile.actions.my_applications") || "Mening arizalarim",
      description:
        t("profile.actions.my_applications_desc") ||
        `${applications.length} ta ariza`,
      color: "blue",
      onClick: () => {
        navigate("/applications");
      },
    },
    {
      id: "help",
      icon: "HelpCircle",
      title: t("profile.actions.help"),
      description: t("profile.actions.help_desc"),
      color: "blue",
      onClick: () => {
        // Help functionality
        console.log("Help clicked");
      },
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
      green:
        "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
      gray: "bg-gray-50 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400",
      purple:
        "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    };
    return colors[color] || colors.gray;
  };

  return (
    <div className="space-y-3">
      {actionItems.map((item) => (
        <button
          key={item.id}
          onClick={item.onClick}
          className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow duration-200 text-left"
        >
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${getColorClasses(item.color)}`}>
              <Icon name={item.icon} size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {item.description}
              </p>
            </div>
            <Icon name="ChevronRight" size={16} className="text-gray-400" />
          </div>
        </button>
      ))}
    </div>
  );
};

export default ProfileActions;
