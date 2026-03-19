import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import Navbar from "../../components/ui/Navbar";
import Button from "../../components/ui/Button";
import Icon from "../../components/AppIcon";
import { faqAPI } from "../../services/api";

const CRS = "submissions.consumer_rights_submission";

const ConsumerRightsSubmission = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [faqData, setFaqData] = useState(null);
  const [isLoadingFaq, setIsLoadingFaq] = useState(true);

  const handleBackToSubmissions = () => {
    navigate("/submissions");
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const services = useMemo(
    () => [
      {
        id: "submit-complaint",
        title: t(`${CRS}.service_submit_complaint_title`),
        description: t(`${CRS}.service_submit_complaint_desc`),
        icon: "Send",
        color: "text-green-600 dark:text-green-400",
        bgColor: "bg-green-100 dark:bg-green-900/30",
        action: () => {
          navigate("/submit-complaint");
        },
      },
      {
        id: "check-license",
        /** Hozircha o‘chirilgan — yo‘nalish keyin yoqiladi */
        disabled: true,
        title: t(`${CRS}.service_check_license_title`),
        description: t(`${CRS}.service_check_license_desc`),
        icon: "ShieldCheck",
        color: "text-blue-600 dark:text-blue-400",
        bgColor: "bg-blue-100 dark:bg-blue-900/30",
        action: () => {
          navigate("/check-license");
        },
      },
    ],
    [t, navigate]
  );

  const fallbackFaqs = useMemo(
    () =>
      [1, 2, 3, 4, 5, 6].map((n) => ({
        question: t(`${CRS}.fallback_faq_${n}_q`),
        answer: t(`${CRS}.fallback_faq_${n}_a`),
      })),
    [t]
  );

  // Fetch FAQ data from backend
  useEffect(() => {
    const fetchFaqData = async () => {
      try {
        setIsLoadingFaq(true);
        const data = await faqAPI.getFaqCategories();

        // Get the first active category
        const activeCategory = data.find(
          (category) => category.is_active && category.items?.length > 0
        );

        if (activeCategory) {
          // Filter only active items and sort by order
          const activeItems = activeCategory.items
            .filter((item) => item.is_active)
            .sort((a, b) => (a.order || 0) - (b.order || 0));

          setFaqData({
            ...activeCategory,
            items: activeItems,
          });
        } else {
          // If no active category found, use fallback
          setFaqData(null);
        }
      } catch (error) {
        console.error("Error fetching FAQ data:", error);
        setFaqData(null);
      } finally {
        setIsLoadingFaq(false);
      }
    };

    fetchFaqData();
  }, []);

  // Use backend data if available, otherwise use fallback static FAQs
  // If backend data exists but is empty, also use fallback
  const backendFaqs = faqData?.items || [];
  const faqs = backendFaqs.length > 0 ? backendFaqs : fallbackFaqs;
  const faqTitle = faqData?.name || t(`${CRS}.faq_default_title`);
  const faqDescription =
    faqData?.description || t(`${CRS}.faq_default_description`);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{t(`${CRS}.meta_title`)}</title>
      </Helmet>
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={handleBackToSubmissions}
              iconName="ArrowLeft"
              iconPosition="left"
              className="text-muted-foreground hover:text-foreground"
            >
              {t(`${CRS}.back`)}
            </Button>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              {t(`${CRS}.page_title`)}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              {t(`${CRS}.page_subtitle`)}
            </p>
          </div>

          {/* Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {services.map((service) => (
              <div
                key={service.id}
                role="button"
                tabIndex={service.disabled ? -1 : 0}
                aria-disabled={service.disabled ? true : undefined}
                onClick={() => {
                  if (!service.disabled) service.action();
                }}
                onKeyDown={(e) => {
                  if (
                    service.disabled ||
                    (e.key !== "Enter" && e.key !== " ")
                  ) {
                    return;
                  }
                  e.preventDefault();
                  service.action();
                }}
                className={`group relative bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 transition-all duration-300 ${
                  service.disabled
                    ? "opacity-60 cursor-not-allowed pointer-events-none select-none"
                    : "cursor-pointer hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-300 dark:hover:border-blue-500"
                }`}
              >
                {/* Icon in top-right corner */}
                <div
                  className={`absolute top-4 right-4 w-12 h-12 ${service.bgColor} rounded-lg flex items-center justify-center group-hover:opacity-80 transition-opacity duration-300`}
                >
                  <Icon
                    name={service.icon}
                    size={20}
                    className={service.color}
                  />
                </div>

                {/* Content */}
                <div className="space-y-3 pr-16">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Action */}
                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-700">
                  <div
                    className={`flex items-center transition-colors duration-300 ${
                      service.disabled
                        ? "text-muted-foreground"
                        : "text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300"
                    }`}
                  >
                    <span className="text-sm font-medium">
                      {service.disabled
                        ? t(`${CRS}.cta_unavailable`)
                        : t(`${CRS}.cta_enter_service`)}
                    </span>
                    {!service.disabled && (
                      <Icon
                        name="ArrowRight"
                        size={16}
                        className="ml-2 group-hover:translate-x-1 transition-transform duration-300"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 md:p-8 border border-gray-200 dark:border-slate-700">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {faqTitle}
              </h2>
              <p className="text-sm text-muted-foreground">
                {faqDescription}
              </p>
            </div>

            {isLoadingFaq ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-muted-foreground">
                  {t(`${CRS}.loading`)}
                </span>
              </div>
            ) : faqs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">{t(`${CRS}.faq_empty`)}</p>
              </div>
            ) : (
              <div className="space-y-3">
                  {faqs.map((faq, index) => (
                    <div
                      key={faq.id || index}
                      className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(index)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors duration-200"
                      >
                        <span className="font-semibold text-foreground pr-4">
                          {faq.question}
                        </span>
                        <Icon
                          name={
                            openFaqIndex === index
                              ? "ChevronUp"
                              : "ChevronDown"
                          }
                          size={20}
                          className={`text-muted-foreground flex-shrink-0 transition-transform duration-300 ${
                            openFaqIndex === index ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <div
                        className={`grid transition-all duration-300 ease-in-out ${
                          openFaqIndex === index
                            ? "grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="px-6 py-4 bg-gray-50 dark:bg-slate-700/30 border-t border-gray-200 dark:border-slate-700">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <div className="h-20"></div>
    </div>
  );
};

export default ConsumerRightsSubmission;
