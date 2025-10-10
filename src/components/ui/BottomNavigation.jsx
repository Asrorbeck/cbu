import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Icon from "../AppIcon";

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const menuItems = [
    {
      id: "home",
      path: "/home-dashboard",
      icon: "Home",
      label: t("bottom_nav.home"),
    },
    {
      id: "submissions",
      path: "/submissions",
      icon: "FileText",
      label: "Murojaatlar",
    },
    {
      id: "jobs",
      path: "/departments",
      icon: "Briefcase",
      label: t("bottom_nav.jobs"),
    },
    {
      id: "profile",
      path: "/profile",
      icon: "User",
      label: t("bottom_nav.profile"),
    },
  ];

  const isActive = (path) => {
    if (path === "/departments") {
      // Department pages (/departments/:id) va vacancy pages (/departments/:id/:vacancyId) uchun ham active bo'lsin
      return (
        location.pathname === path ||
        location.pathname.startsWith("/departments/")
      );
    }
    if (path === "/submissions") {
      // Submissions pages uchun ham active bo'lsin
      return (
        location.pathname === path ||
        location.pathname.startsWith("/submissions/") ||
        location.pathname === "/check-license" ||
        location.pathname === "/submit-complaint"
      );
    }
    return location.pathname === path;
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-lg md:hidden">
      <div className="flex items-center justify-around py-2 px-2">
        {menuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center justify-center py-2 px-2 rounded-lg transition-colors duration-200 min-w-0 flex-1 ${
                active
                  ? "text-blue-500"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div
                className={`p-1 rounded-full ${
                  active ? "bg-blue-50 dark:bg-blue-900/20" : ""
                }`}
              >
                <Icon
                  name={item.icon}
                  size={20}
                  className={`${
                    active ? "text-blue-500" : "text-muted-foreground"
                  }`}
                />
              </div>
              <span
                className={`text-xs font-medium mt-1 text-center leading-tight ${
                  active ? "text-blue-500" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
