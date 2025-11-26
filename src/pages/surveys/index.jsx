import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import toast from "react-hot-toast";
import Navbar from "../../components/ui/Navbar";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Icon from "../../components/AppIcon";
import { Checkbox } from "../../components/ui/Checkbox";
import { surveyAPI } from "../../services/api";

const Surveys = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [step, setStep] = useState("start"); // "start", "question", "completed"
  const [loading, setLoading] = useState(false);
  const [respondentId, setRespondentId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [telegramUserId, setTelegramUserId] = useState(null);
  const [completionMessage, setCompletionMessage] = useState(null);

  // Form data for starting survey
  const [formData, setFormData] = useState({
    telegram_id: 905770018, // Default Telegram user ID
    language: "uz_latin",
    respondent_type: "population",
    region: "",
    isBusinessEngaged: null, // null, true (Business), false (population)
  });

  // Get Telegram user ID
  useEffect(() => {
    const getTelegramUserId = () => {
      try {
        if (window.Telegram && window.Telegram.WebApp) {
          window.Telegram.WebApp.ready();
          window.Telegram.WebApp.expand();

          if (
            window.Telegram.WebApp.initDataUnsafe &&
            window.Telegram.WebApp.initDataUnsafe.user
          ) {
            const userId = window.Telegram.WebApp.initDataUnsafe.user.id;
            setTelegramUserId(userId);
            setFormData((prev) => ({ ...prev, telegram_id: userId }));
            return;
          }
        }

        // Fallback if Telegram WebApp is not available
        console.log("Telegram WebApp not available, using default ID");
        setTelegramUserId(905770018);
        setFormData((prev) => ({ ...prev, telegram_id: 905770018 }));
      } catch (error) {
        console.error("Error getting Telegram user ID:", error);
        setTelegramUserId(905770018);
        setFormData((prev) => ({ ...prev, telegram_id: 905770018 }));
      }
    };

    const timer = setTimeout(getTelegramUserId, 500);
    return () => clearTimeout(timer);
  }, []);

  // Set language based on i18n
  useEffect(() => {
    const currentLang = i18n.language || localStorage.getItem("language") || "uz-Latn";
    let langCode;
    if (currentLang === "uz-Latn") {
      langCode = "uz_latin";
    } else if (currentLang === "uz-Cyrl") {
      langCode = "uz_cyrl";
    } else if (currentLang === "ru") {
      langCode = "ru";
    } else {
      langCode = "uz_latin"; // default
    }
    setFormData((prev) => ({ ...prev, language: langCode }));
  }, [i18n.language]);

  // Get regions list based on current language
  const getRegions = () => {
    const currentLang = i18n.language || localStorage.getItem("language") || "uz-Latn";
    
    if (currentLang === "ru") {
      return [
        { value: "QORAQALPOGISTON_RES", label: "Рес. Каракалпакстан" },
        { value: "ANDIJON_VIL", label: "Андижанская обл." },
        { value: "BUXORO_VIL", label: "Бухарская обл." },
        { value: "JIZZAX_VIL", label: "Джизакская обл." },
        { value: "QASHQADARYO_VIL", label: "Кашкадарьинская обл." },
        { value: "NAVOIY_VIL", label: "Навоийская обл." },
        { value: "NAMANGAN_VIL", label: "Наманганская обл." },
        { value: "SAMARQAND_VIL", label: "Самаркандская обл." },
        { value: "SURXONDARYO_VIL", label: "Сурхандарьинская обл." },
        { value: "SIRDARYO_VIL", label: "Сырдарьинская обл." },
        { value: "TOSHKENT_VIL", label: "Ташкентская обл." },
        { value: "FARGONA_VIL", label: "Ферганская обл." },
        { value: "XORAZM_VIL", label: "Хорезмская обл." },
        { value: "TOSHKENT_SH", label: "г. Ташкент" },
      ];
    } else if (currentLang === "uz-Cyrl") {
      return [
        { value: "QORAQALPOGISTON_RES", label: "Қорақалпоғистон Рес." },
        { value: "ANDIJON_VIL", label: "Андижон вил." },
        { value: "BUXORO_VIL", label: "Бухоро вил." },
        { value: "JIZZAX_VIL", label: "Жиззах вил." },
        { value: "QASHQADARYO_VIL", label: "Қашқадарё вил." },
        { value: "NAVOIY_VIL", label: "Навоий вил." },
        { value: "NAMANGAN_VIL", label: "Наманган вил." },
        { value: "SAMARQAND_VIL", label: "Самарқанд вил." },
        { value: "SURXONDARYO_VIL", label: "Сурхондарё вил." },
        { value: "SIRDARYO_VIL", label: "Сирдарё вил." },
        { value: "TOSHKENT_VIL", label: "Тошкент вил." },
        { value: "FARGONA_VIL", label: "Фарғона вил." },
        { value: "XORAZM_VIL", label: "Хоразм вил." },
        { value: "TOSHKENT_SH", label: "Тошкент ш." },
      ];
    } else {
      // uz-Latn (default)
      return [
        { value: "QORAQALPOGISTON_RES", label: "Qoraqalpog'iston Res." },
        { value: "ANDIJON_VIL", label: "Andijon vil." },
        { value: "BUXORO_VIL", label: "Buxoro vil." },
        { value: "JIZZAX_VIL", label: "Jizzax vil." },
        { value: "QASHQADARYO_VIL", label: "Qashqadaryo vil." },
        { value: "NAVOIY_VIL", label: "Navoiy vil." },
        { value: "NAMANGAN_VIL", label: "Namangan vil." },
        { value: "SAMARQAND_VIL", label: "Samarqand vil." },
        { value: "SURXONDARYO_VIL", label: "Surxondaryo vil." },
        { value: "SIRDARYO_VIL", label: "Sirdaryo vil." },
        { value: "TOSHKENT_VIL", label: "Toshkent vil." },
        { value: "FARGONA_VIL", label: "Farg'ona vil." },
        { value: "XORAZM_VIL", label: "Xorazm vil." },
        { value: "TOSHKENT_SH", label: "Toshkent sh." },
      ];
    }
  };

  const handleStartSurvey = async () => {
    if (!formData.region) {
      toast.error(t("surveys.select_region_error"));
      return;
    }

    if (formData.isBusinessEngaged === null) {
      toast.error(t("surveys.select_business_error"));
      return;
    }

    setLoading(true);
    try {
      const response = await surveyAPI.startSurvey({
        telegram_id: String(formData.telegram_id || 905770018), // Default Telegram user ID
        language: formData.language,
        respondent_type: formData.respondent_type,
        region: formData.region,
      });

      setRespondentId(response.id);
      if (response.current_question) {
        setCurrentQuestion(response.current_question);
        setStep("question");
      } else {
        toast.error(t("surveys.survey_not_found") || "So'rovnoma topilmadi");
      }
    } catch (error) {
      console.error("Error starting survey:", error);
      toast.error(
        error.response?.data?.detail ||
          t("surveys.start_error") ||
          "So'rovnomani boshlashda xatolik yuz berdi"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!currentQuestion) return;

    // Validate answer
    if (currentQuestion.question_type === "single") {
      if (!selectedAnswer) {
        toast.error(t("surveys.select_answer_error"));
        return;
      }
    } else if (currentQuestion.question_type === "multiple") {
      if (selectedAnswers.length === 0) {
        toast.error(t("surveys.select_answer_error_multiple"));
        return;
      }
    }

    setLoading(true);
    try {
      const answerData =
        currentQuestion.question_type === "single"
          ? {
              respondent_id: respondentId,
              question_id: currentQuestion.id,
              selected_choice_id: selectedAnswer,
            }
          : {
              respondent_id: respondentId,
              question_id: currentQuestion.id,
              selected_choices_ids: selectedAnswers,
            };

      const response = await surveyAPI.submitAnswer(answerData);

      // Check if survey is completed
      if (response.message && response.is_valid !== undefined) {
        setCompletionMessage(response);
        setStep("completed");
      } else if (response.next_question) {
        setCurrentQuestion(response.next_question);
        setSelectedAnswer(null);
        setSelectedAnswers([]);
      } else {
        // Survey completed but no message
        setStep("completed");
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast.error(
        error.response?.data?.detail ||
          t("surveys.submit_error") ||
          "Javobni yuborishda xatolik yuz berdi"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChoiceToggle = (choiceId) => {
    if (currentQuestion.question_type === "single") {
      setSelectedAnswer(choiceId);
    } else {
      setSelectedAnswers((prev) =>
        prev.includes(choiceId)
          ? prev.filter((id) => id !== choiceId)
          : [...prev, choiceId]
      );
    }
  };

  const handleBackToDashboard = () => {
    navigate("/home-dashboard");
  };

  const handleRestart = () => {
    setStep("start");
    setRespondentId(null);
    setCurrentQuestion(null);
    setSelectedAnswer(null);
    setSelectedAnswers([]);
    setCompletionMessage(null);
    setFormData((prev) => ({
      ...prev,
      region: "",
      isBusinessEngaged: null,
      respondent_type: "population",
    }));
  };

  const handleBusinessEngagementChange = (value) => {
    const isBusiness = value === "yes";
    setFormData((prev) => ({
      ...prev,
      isBusinessEngaged: isBusiness,
      respondent_type: isBusiness ? "Business" : "population",
    }));
  };

  // Get question text based on language
  const getQuestionText = (question) => {
    if (!question) return "";
    const lang = formData.language === "uz" ? "text" : "text_ru";
    return question[lang] || question.text || "";
  };

  // Get choice text based on language
  const getChoiceText = (choice) => {
    if (!choice) return "";
    const lang = formData.language === "uz" ? "text" : "text_ru";
    return choice[lang] || choice.text || "";
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>So'rovnomalar - Markaziy Bank</title>
      </Helmet>
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={handleBackToDashboard}
              iconName="ArrowLeft"
              iconPosition="left"
              className="text-muted-foreground hover:text-foreground"
            >
              {t("surveys.back")}
            </Button>
          </div>

          {/* Start Step */}
          {step === "start" && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 md:p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon
                    name="ClipboardList"
                    size={32}
                    className="text-blue-600 dark:text-blue-400"
                  />
                </div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                {t("surveys.title")}
              </h1>
              <p className="text-muted-foreground">
                {t("surveys.subtitle")}
              </p>
              </div>

              <div className="space-y-6">
                <Select
                  label={t("surveys.region")}
                  placeholder={t("surveys.region_placeholder")}
                  options={getRegions()}
                  value={formData.region}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, region: value }))
                  }
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t("surveys.business_question")}
                  </label>
                  <div className="space-y-3">
                    <div
                      onClick={() => handleBusinessEngagementChange("yes")}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.isBusinessEngaged === true
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600"
                      }`}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                            formData.isBusinessEngaged === true
                              ? "border-blue-500 bg-blue-500"
                              : "border-gray-300 dark:border-slate-600"
                          }`}
                        >
                          {formData.isBusinessEngaged === true && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                        <span className="text-foreground">
                          {t("surveys.business_yes")}
                        </span>
                      </div>
                    </div>
                    <div
                      onClick={() => handleBusinessEngagementChange("no")}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.isBusinessEngaged === false
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600"
                      }`}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                            formData.isBusinessEngaged === false
                              ? "border-blue-500 bg-blue-500"
                              : "border-gray-300 dark:border-slate-600"
                          }`}
                        >
                          {formData.isBusinessEngaged === false && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                        <span className="text-foreground">
                          {t("surveys.business_no")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    onClick={handleStartSurvey}
                    loading={loading}
                    fullWidth
                    size="lg"
                  >
                    {t("surveys.start_survey")}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Question Step */}
          {step === "question" && currentQuestion && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 md:p-8">
              <div className="mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                  {getQuestionText(currentQuestion)}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {currentQuestion.question_type === "single"
                    ? t("surveys.question_single")
                    : t("surveys.question_multiple")}
                </p>
              </div>

              <div className="space-y-3 mb-6">
                {currentQuestion.choices?.map((choice) => {
                  const isSelected =
                    currentQuestion.question_type === "single"
                      ? selectedAnswer === choice.id
                      : selectedAnswers.includes(choice.id);

                  return (
                    <div
                      key={choice.id}
                      onClick={() => handleChoiceToggle(choice.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        isSelected
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600"
                      }`}
                    >
                      <div className="flex items-center">
                        {currentQuestion.question_type === "single" ? (
                          <div
                            className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                              isSelected
                                ? "border-blue-500 bg-blue-500"
                                : "border-gray-300 dark:border-slate-600"
                            }`}
                          >
                            {isSelected && (
                              <div className="w-2 h-2 rounded-full bg-white" />
                            )}
                          </div>
                        ) : (
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleChoiceToggle(choice.id)}
                            className="mr-3"
                          />
                        )}
                        <span className="text-foreground flex-1">
                          {getChoiceText(choice)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Button
                onClick={handleSubmitAnswer}
                loading={loading}
                fullWidth
                size="lg"
                disabled={
                  currentQuestion.question_type === "single"
                    ? !selectedAnswer
                    : selectedAnswers.length === 0
                }
              >
                {t("surveys.next_question")}
              </Button>
            </div>
          )}

          {/* Completed Step */}
          {step === "completed" && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 md:p-8 text-center">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon
                  name="CheckCircle"
                  size={40}
                  className="text-green-600 dark:text-green-400"
                />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                {completionMessage?.message ||
                  t("surveys.completed_title")}
              </h2>
              {completionMessage?.is_valid === false && (
                <p className="text-orange-600 dark:text-orange-400 mb-4">
                  {t("surveys.completed_invalid")}
                </p>
              )}
              {completionMessage?.duration_seconds && (
                <p className="text-muted-foreground mb-6">
                  {t("surveys.duration")}: {Math.floor(completionMessage.duration_seconds / 60)} {t("surveys.minutes")}{" "}
                  {completionMessage.duration_seconds % 60} {t("surveys.seconds")}
                </p>
              )}
              <div className="flex gap-4 justify-center">
                <Button onClick={handleRestart} variant="outline">
                  {t("surveys.new_survey")}
                </Button>
                <Button onClick={handleBackToDashboard}>
                  {t("surveys.back_to_dashboard")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <div className="h-20"></div>
    </div>
  );
};

export default Surveys;

