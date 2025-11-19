import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../AppIcon";

const DashboardCards = () => {
  const navigate = useNavigate();

  const services = [
    {
      id: "currency",
      title: "Currency Exchange Rates",
      description:
        "View real-time exchange rates for major currencies and historical data",
      icon: "TrendingUp",
      path: "/currency-exchange-rates",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      id: "vacancies",
      title: "Job Vacancies",
      description:
        "Browse available positions and submit applications to join our team",
      icon: "Briefcase",
      path: "/job-vacancies-browser",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      id: "feedback",
      title: "Customer Feedback",
      description:
        "Share your experience and suggestions to help us improve our services",
      icon: "MessageSquare",
      path: "/submissions",
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      id: "news",
      title: "News & Updates",
      description:
        "Stay informed with the latest banking news and policy updates",
      icon: "Newspaper",
      path: "/news-articles-hub",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ];

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
      {services?.map((service) => (
        <div
          key={service?.id}
          onClick={() => handleCardClick(service?.path)}
          className="group bg-card border border-border rounded-xl p-6 cursor-pointer card-hover shadow-md hover:shadow-lg transition-all duration-300 ease-in-out"
        >
          <div className="flex flex-col items-center text-center space-y-4">
            {/* Icon Container */}
            <div
              className={`w-16 h-16 ${service?.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
            >
              <Icon
                name={service?.icon}
                size={32}
                className={`${service?.color} group-hover:scale-110 transition-transform duration-300`}
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors duration-300">
                {service?.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {service?.description}
              </p>
            </div>

            {/* Action Indicator */}
            <div className="flex items-center space-x-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-sm font-medium">Access Service</span>
              <Icon
                name="ArrowRight"
                size={16}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
