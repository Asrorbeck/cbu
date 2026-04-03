import React from "react";
import { useTranslation } from "react-i18next";
import Icon from "../../../components/AppIcon";

/**
 * Rasmiy sayt (cbu.uz) — Sharhlar va Yangiliklar havolalari
 */
const PressCenterLinks = () => {
  const { t } = useTranslation();

  const items = [
    {
      id: "reviews",
      href: t("home.press_center.reviews_url"),
      title: t("home.press_center.reviews_title"),
      description: t("home.press_center.reviews_desc"),
      icon: "Star",
    },
    {
      id: "news",
      href: t("home.press_center.news_url"),
      title: t("home.press_center.news_title"),
      description: t("home.press_center.news_desc"),
      icon: "Newspaper",
    },
  ];

  return (
    <section
      className="mt-10 w-full sm:mt-14"
      aria-labelledby="home-press-center-title"
    >
      <div className="mb-8 text-center">
        <h2
          id="home-press-center-title"
          className="text-2xl font-bold text-foreground md:text-3xl"
        >
          {t("home.press_center.section_title")}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          {t("home.press_center.section_subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-2 lg:gap-8">
        {items.map((item) => (
          <a
            key={item.id}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/10 sm:gap-5 sm:p-6 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500"
          >
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 transition-colors duration-300 group-hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:group-hover:bg-blue-900/50 lg:h-14 lg:w-14"
              aria-hidden
            >
              <Icon name={item.icon} size={24} strokeWidth={1.75} />
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="text-lg font-semibold text-gray-900 transition-colors duration-300 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 lg:text-xl">
                {item.title}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400 lg:text-[15px]">
                {item.description}
              </p>
            </div>
            <span
              className="mt-1 flex shrink-0 text-blue-600 transition group-hover:-translate-y-px group-hover:translate-x-px dark:text-blue-400 dark:group-hover:text-blue-300"
              aria-hidden
            >
              <Icon name="ArrowUpRight" size={22} strokeWidth={1.75} />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
};

export default PressCenterLinks;
