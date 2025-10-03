import React from "react";
import { useTranslation } from "react-i18next";
import Icon from "../../../components/AppIcon";

const ProfileHeader = ({ userData }) => {
  const { t } = useTranslation();

  if (!userData) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div className="flex items-center space-x-4">
        {/* Profile Picture */}
        <div className="relative">
          {userData.photoUrl ? (
            <img
              src={userData.photoUrl}
              alt={userData.firstName}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
              <Icon
                name="User"
                size={32}
                className="text-gray-600 dark:text-gray-300"
              />
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
        </div>

        {/* User Info */}
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {userData.firstName} {userData.lastName}
          </h2>
          {userData.username && (
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              @{userData.username}
            </p>
          )}
          <div className="flex items-center mt-1">
            <Icon name="Hash" size={14} className="text-gray-400 mr-1" />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ID: {userData.id}
            </span>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex flex-col items-end">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></div>
            {t("profile.status.active")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
