import React, { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../../components/ui/Navbar";
import Icon from "../../components/AppIcon";

const TermsAndConditionsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { departmentId, vacancyId } = useParams();
  const { t } = useTranslation();
  const [isAgreed, setIsAgreed] = useState(false);

  // Decode the vacancy ID from URL
  const decodedVacancyId = vacancyId ? atob(vacancyId) : null;

  // Get vacancy info from location state or URL params
  const vacancyInfo = location.state?.vacancyInfo || {
    departmentId,
    vacancyId: decodedVacancyId,
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleAgreementChange = (e) => {
    setIsAgreed(e.target.checked);
  };

  const handleContinue = () => {
    if (isAgreed) {
      // Navigate to job application form
      if (departmentId && vacancyId) {
        navigate(`/departments/${departmentId}/${vacancyId}/form`, {
          state: { vacancyInfo },
        });
      } else {
        // Fallback if no vacancy info is available
        alert(t("jobs.terms_conditions.vacancy_info_missing"));
        navigate("/");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <Icon name="ArrowLeft" size={16} />
              <span>{t("jobs.terms_conditions.back")}</span>
            </button>
          </div>

          {/* Content */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-700 dark:to-slate-600 px-4 sm:px-6 py-6 sm:py-8">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white  leading-tight">
                {t("jobs.terms_conditions.title")}
              </h1>
              {vacancyInfo?.title && (
                <p className="text-blue-600 dark:text-blue-400 text-lg font-medium mt-2">
                  {vacancyInfo.title}
                </p>
              )}
            </div>

            {/* Content Section */}
            <div className="mt-3 space-y-8">
              {/* Video Section */}
              <div className="px-4 sm:px-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {t("jobs.terms_conditions.video_instructions")}
                </h2>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg pb-4 text-center">
                  <video
                    className="w-full max-w-2xl mx-auto rounded-lg"
                    controls
                    poster="/assets/images/video-poster.jpg"
                  >
                    <source src="/src/video/video.mp4" type="video/mp4" />
                    <source src="/src/video/video.webm" type="video/webm" />
                    {t("jobs.terms_conditions.video_not_supported")}
                  </video>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-4 px-4">
                    {t("jobs.terms_conditions.video_description")}
                  </p>
                </div>
              </div>

              {/* Contract Text */}
              <div className="px-4 sm:px-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {t("jobs.terms_conditions.contract_title")}
                </h2>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 sm:p-6 max-h-96 overflow-y-auto">
                  <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">
                        {t("jobs.terms_conditions.section_1_title")}
                      </h3>
                      <p className="mb-2">
                        {t(
                          "jobs.terms_conditions.contract_content.section_1_intro"
                        )}
                      </p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>
                          <strong>
                            {t(
                              "jobs.terms_conditions.contract_content.telegram_bot"
                            )}
                          </strong>
                        </li>
                        <li>
                          <strong>
                            {t(
                              "jobs.terms_conditions.contract_content.operator"
                            )}
                          </strong>
                        </li>
                        <li>
                          <strong>
                            {t("jobs.terms_conditions.contract_content.user")}
                          </strong>
                        </li>
                        <li>
                          <strong>
                            {t(
                              "jobs.terms_conditions.contract_content.personal_data"
                            )}
                          </strong>
                        </li>
                        <li>
                          <strong>
                            {t(
                              "jobs.terms_conditions.contract_content.contract_acceptance"
                            )}
                          </strong>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">
                        {t("jobs.terms_conditions.section_2_title")}
                      </h3>
                      <p className="mb-2">
                        {t(
                          "jobs.terms_conditions.contract_content.section_2_1"
                        )}
                      </p>
                      <p className="mb-2">
                        {t(
                          "jobs.terms_conditions.contract_content.section_2_2"
                        )}
                      </p>
                      <p className="mb-2">
                        {t(
                          "jobs.terms_conditions.contract_content.section_2_3"
                        )}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">
                        {t("jobs.terms_conditions.section_3_title")}
                      </h3>
                      <p className="mb-2">
                        {t(
                          "jobs.terms_conditions.contract_content.section_3_1"
                        )}
                      </p>
                      <p className="mb-2">
                        {t(
                          "jobs.terms_conditions.contract_content.section_3_1_1"
                        )}
                      </p>
                      <p className="mb-2">
                        {t(
                          "jobs.terms_conditions.contract_content.section_3_1_2"
                        )}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">
                        {t("jobs.terms_conditions.section_4_title")}
                      </h3>
                      <p className="mb-2">
                        {t(
                          "jobs.terms_conditions.contract_content.section_4_1"
                        )}
                      </p>
                      <p className="mb-2">
                        {t(
                          "jobs.terms_conditions.contract_content.section_4_2"
                        )}
                      </p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>
                          {t(
                            "jobs.terms_conditions.contract_content.section_4_2_1"
                          )}
                        </li>
                        <li>
                          {t(
                            "jobs.terms_conditions.contract_content.section_4_2_2"
                          )}
                        </li>
                        <li>
                          {t(
                            "jobs.terms_conditions.contract_content.section_4_2_3"
                          )}
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">
                        {t("jobs.terms_conditions.section_5_title")}
                      </h3>
                      <p className="mb-2">
                        {t(
                          "jobs.terms_conditions.contract_content.section_5_1"
                        )}
                      </p>
                      <p className="mb-2">
                        {t(
                          "jobs.terms_conditions.contract_content.section_5_2"
                        )}
                      </p>
                      <p className="mb-2">
                        {t(
                          "jobs.terms_conditions.contract_content.section_5_3"
                        )}
                      </p>
                      <p className="mb-2">
                        {t(
                          "jobs.terms_conditions.contract_content.section_5_4"
                        )}
                      </p>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>
                          {t("jobs.terms_conditions.contact_info")}
                        </strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Agreement Checkbox */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 sm:p-6 mx-4 sm:mx-6">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="agreement"
                    checked={isAgreed}
                    onChange={handleAgreementChange}
                    className="mt-1 h-4 w-4 sm:h-5 sm:w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="agreement"
                    className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed"
                  >
                    <strong>{t("jobs.terms_conditions.agreement_text")}</strong>
                    {t("jobs.terms_conditions.agreement_consent")}
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 pb-6 px-4 sm:px-6 border-t border-gray-100 dark:border-slate-700">
                <button
                  onClick={handleBack}
                  className="flex-1 py-3 px-4 sm:px-6 rounded-lg font-semibold text-base sm:text-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
                >
                  {t("jobs.terms_conditions.back")}
                </button>
                <button
                  onClick={handleContinue}
                  disabled={!isAgreed}
                  className={`flex-1 py-3 px-4 sm:px-6 rounded-lg font-semibold text-base sm:text-lg transition-colors duration-300 ${
                    isAgreed
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {t("jobs.terms_conditions.continue")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsAndConditionsPage;
