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
    language: "uz",
    respondent_type: "individual",
    region: "",
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
    const currentLang = i18n.language || localStorage.getItem("language") || "uz-latn";
    const langCode = currentLang.startsWith("uz") ? "uz" : "ru";
    setFormData((prev) => ({ ...prev, language: langCode }));
  }, [i18n.language]);

  // Regions list (you can expand this)
  const regions = [
    { value: "Toshkent", label: "Toshkent" },
    { value: "Andijon", label: "Andijon" },
    { value: "Buxoro", label: "Buxoro" },
    { value: "Farg'ona", label: "Farg'ona" },
    { value: "Jizzax", label: "Jizzax" },
    { value: "Qashqadaryo", label: "Qashqadaryo" },
    { value: "Navoiy", label: "Navoiy" },
    { value: "Namangan", label: "Namangan" },
    { value: "Samarqand", label: "Samarqand" },
    { value: "Sirdaryo", label: "Sirdaryo" },
    { value: "Surxondaryo", label: "Surxondaryo" },
    { value: "Xorazm", label: "Xorazm" },
    { value: "Qoraqalpog'iston", label: "Qoraqalpog'iston" },
  ];

  const handleStartSurvey = async () => {
    if (!formData.region) {
      toast.error(t("surveys.select_region_error"));
      return;
    }

    setLoading(true);
    try {
      const response = await surveyAPI.startSurvey({
        telegram_id: formData.telegram_id || 905770018, // Default Telegram user ID
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
                  options={regions}
                  value={formData.region}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, region: value }))
                  }
                  required
                />

                <Select
                  label={t("surveys.respondent_type")}
                  placeholder={t("surveys.respondent_type_placeholder")}
                  options={[
                    { value: "individual", label: t("surveys.individual") },
                    { value: "organization", label: t("surveys.organization") },
                  ]}
                  value={formData.respondent_type}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, respondent_type: value }))
                  }
                  required
                />

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

