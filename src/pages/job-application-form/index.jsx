import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import toast from "react-hot-toast";
import Navbar from "../../components/ui/Navbar";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import { Checkbox } from "../../components/ui/Checkbox";

const JobApplicationForm = () => {
  const { departmentId, vacancyId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // All vacancies data (same as in vacancy-detail)
  const allVacancies = {
    "it-001": {
      id: "it-001",
      title: "Senior Software Developer",
      department: "Axborot Texnologiyalari Departamenti",
    },
    "it-002": {
      id: "it-002",
      title: "Cybersecurity Specialist",
      department: "Axborot Texnologiyalari Departamenti",
    },
    "it-003": {
      id: "it-003",
      title: "Boshqarma boshligi orinbosari",
      department: "Axborot Texnologiyalari Departamenti",
    },
    "it-004": {
      id: "it-004",
      title: "Yetakchi mutahassis",
      department: "Axborot Texnologiyalari Departamenti",
    },
    "fin-001": {
      id: "fin-001",
      title: "Senior Financial Analyst",
      department: "Moliyaviy boshqaruv departamenti",
    },
    "hr-001": {
      id: "hr-001",
      title: "HR Specialist",
      department: "Kadrlar departamenti",
    },
    "risk-001": {
      id: "risk-001",
      title: "Risk Analyst",
      department: "Risk boshqaruvi departamenti",
    },
  };

  // Get the specific vacancy based on vacancyId
  const currentVacancy = allVacancies[vacancyId] || allVacancies["it-001"];

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    birthDate: "",
    phoneNumber: "",
    education: [{ period: "", institution: "", degree: "", specialty: "" }],
    workExperience: [{ period: "", company: "", position: "" }],
    languages: {
      uzbek: "",
      russian: "",
      english: "",
    },
    salaryRange: "",
    hasCriminalRecord: false,
    additionalInfo: "",
  });

  // Language proficiency options
  const languageLevels = [
    { value: "dont-know", label: t("jobs.application.form.dont_know") },
    { value: "beginner", label: t("jobs.application.form.beginner") },
    { value: "intermediate", label: t("jobs.application.form.intermediate") },
    { value: "advanced", label: t("jobs.application.form.advanced") },
  ];

  // Salary range options
  const salaryRanges = [
    { value: "5-6", label: t("jobs.application.form.salary_5_6") },
    { value: "6-7", label: t("jobs.application.form.salary_6_7") },
    { value: "7-8", label: t("jobs.application.form.salary_7_8") },
    { value: "8-9", label: t("jobs.application.form.salary_8_9") },
    { value: "9-10", label: t("jobs.application.form.salary_9_10") },
    { value: "10+", label: t("jobs.application.form.salary_10_plus") },
  ];

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle education changes
  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...formData.education];
    updatedEducation[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      education: updatedEducation,
    }));
  };

  // Add new education entry
  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { period: "", institution: "", degree: "", specialty: "" },
      ],
    }));
  };

  // Remove education entry
  const removeEducation = (index) => {
    if (formData.education.length > 1) {
      const updatedEducation = formData.education.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        education: updatedEducation,
      }));
    }
  };

  // Handle work experience changes
  const handleWorkExperienceChange = (index, field, value) => {
    const updatedWorkExperience = [...formData.workExperience];
    updatedWorkExperience[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      workExperience: updatedWorkExperience,
    }));
  };

  // Add new work experience entry
  const addWorkExperience = () => {
    setFormData((prev) => ({
      ...prev,
      workExperience: [
        ...prev.workExperience,
        { period: "", company: "", position: "" },
      ],
    }));
  };

  // Remove work experience entry
  const removeWorkExperience = (index) => {
    if (formData.workExperience.length > 1) {
      const updatedWorkExperience = formData.workExperience.filter(
        (_, i) => i !== index
      );
      setFormData((prev) => ({
        ...prev,
        workExperience: updatedWorkExperience,
      }));
    }
  };

  // Handle language proficiency changes
  const handleLanguageChange = (language, level) => {
    setFormData((prev) => ({
      ...prev,
      languages: {
        ...prev.languages,
        [language]: level,
      },
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    const formDataToSend = {
      departmentId,
      vacancyId,
      ...formData,
    };

    console.log("Job Application Form Data:", formDataToSend);

    try {
      // Send to Telegram
      await sendToTelegram(formDataToSend);

      // Save to localStorage
      const applicationData = {
        id: Date.now().toString(),
        ...formDataToSend,
        status: "pending",
        submittedAt: new Date().toISOString(),
        vacancyTitle: currentVacancy?.title,
        departmentName: currentVacancy?.department,
      };

      // Get existing applications
      const existingApplications = JSON.parse(
        localStorage.getItem("jobApplications") || "[]"
      );
      existingApplications.push(applicationData);
      localStorage.setItem(
        "jobApplications",
        JSON.stringify(existingApplications)
      );

      // Show success toast
      toast.success(t("jobs.application.form.success_message"), {
        duration: 4000,
        position: "top-center",
      });

      // Clear form
      clearForm();

      // Navigate to departments page after a short delay
      setTimeout(() => {
        navigate("/departments");
      }, 1500);
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(t("jobs.application.form.error_message"), {
        duration: 5000,
        position: "top-center",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Send form data to Telegram
  const sendToTelegram = async (formData) => {
    const botToken = "8330405858:AAEduP2o5mil75jnfC66dfB8eD8wjdFguYc";
    const chatId = "905770018";

    // Format the message
    const message = `🎯 *YANGI ISH ARIZASI*

📋 *Shaxsiy ma'lumotlar:*
• To'liq ism: ${formData.fullName}
• Tug'ilgan sana: ${formData.birthDate}
• Telefon: ${formData.phoneNumber}

📚 *Ta'lim ma'lumotlari:*
${formData.education
  .map(
    (edu, index) => `
${index + 1}. Davr: ${edu.period}
   Muassasa: ${edu.institution}
   Daraja: ${edu.degree}
   Mutaxassislik: ${edu.specialty}
`
  )
  .join("")}

🔨 *Ish tajribasi:*
${formData.workExperience
  .map(
    (work, index) => `
${index + 1}. Davr: ${work.period}
   Kompaniya: ${work.company}
   Lavozim: ${work.position}
`
  )
  .join("")}

🗣 *Til bilish darajalari:*
• O'zbek tili: ${formData.languages.uzbek}
• Rus tili: ${formData.languages.russian}
• Ingliz tili: ${formData.languages.english}

💰 *Maosh diapazoni:* ${formData.salaryRange}

⚖️ *Jinoiy javobgarlik:* ${formData.hasCriminalRecord ? "Ha" : "Yo'q"}

📝 *Qo'shimcha ma'lumot:*
${formData.additionalInfo || "Kiritilmagan"}

🏢 *Vakansiya ma'lumotlari:*
• Departament ID: ${departmentId}
• Vakansiya ID: ${vacancyId}
• Vakansiya nomi: ${currentVacancy?.title || "Noma'lum"}

⏰ *Yuborilgan vaqt:* ${new Date().toLocaleString("uz-UZ")}`;

    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "Markdown",
        }),
      }
    );

    const data = await response.json();

    if (!data.ok) {
      throw new Error(
        `Telegram API error: ${data.description || "Unknown error"}`
      );
    }

    console.log("Telegram message sent successfully");
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Clear form function
  const clearForm = () => {
    setFormData({
      fullName: "",
      birthDate: "",
      phoneNumber: "",
      education: [
        {
          period: "",
          institution: "",
          degree: "",
          specialty: "",
        },
      ],
      workExperience: [
        {
          period: "",
          company: "",
          position: "",
        },
      ],
      languages: {
        uzbek: "",
        russian: "",
        english: "",
      },
      salaryRange: "",
      hasCriminalRecord: false,
      additionalInfo: "",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{t("jobs.application.form.title")} - Central Bank</title>
        <meta name="description" content={t("jobs.application.form.title")} />
      </Helmet>
      <Navbar />
      <main className="pt-20 pb-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <Icon name="ArrowLeft" size={16} />
              <span>{t("jobs.application.form.back_button")}</span>
            </button>
          </div>

          {/* Content */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-700 dark:to-slate-600 px-4 sm:px-6 py-6 sm:py-8">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                {t("jobs.application.form.title")}
              </h1>
              {currentVacancy?.title && (
                <p className="text-blue-600 dark:text-blue-400 text-lg font-medium mt-2">
                  {currentVacancy.title}
                </p>
              )}
            </div>

            {/* Form Content */}
            <div className="mt-3 space-y-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div className="px-4 sm:px-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {t("jobs.application.form.personal_info")}
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t("jobs.application.form.full_name")}
                      </label>
                      <Input
                        type="text"
                        placeholder={t(
                          "jobs.application.form.full_name_placeholder"
                        )}
                        value={formData.fullName}
                        onChange={(e) =>
                          handleInputChange("fullName", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t("jobs.application.form.birth_date")}
                      </label>
                      <Input
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) =>
                          handleInputChange("birthDate", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t("jobs.application.form.phone_number")}
                      </label>
                      <Input
                        type="tel"
                        placeholder="+998 90 123 45 67"
                        value={formData.phoneNumber}
                        onChange={(e) => {
                          let value = e.target.value;
                          // Remove all non-digit characters except +
                          value = value.replace(/[^\d+]/g, "");

                          // Ensure it starts with +998
                          if (!value.startsWith("+998")) {
                            if (value.startsWith("998")) {
                              value = "+" + value;
                            } else if (value.startsWith("9")) {
                              value = "+998" + value;
                            } else if (
                              value.length > 0 &&
                              !value.startsWith("+")
                            ) {
                              value = "+998" + value;
                            }
                          }

                          // Limit to +998 + 9 digits
                          if (value.length > 13) {
                            value = value.substring(0, 13);
                          }

                          handleInputChange("phoneNumber", value);
                        }}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Education Section */}
                <div className="px-4 sm:px-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    📚 {t("jobs.application.form.education")} 📚
                  </h2>

                  <div className="space-y-4">
                    {formData.education.map((edu, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-4"
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium text-gray-800 dark:text-gray-200">
                            {t("jobs.application.form.education")} #{index + 1}
                          </h3>
                          {formData.education.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeEducation(index)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              {t("jobs.application.form.remove_education")}
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              {t("jobs.application.form.education_period")}
                            </label>
                            <Input
                              type="text"
                              placeholder={t(
                                "jobs.application.form.education_period_placeholder"
                              )}
                              value={edu.period}
                              onChange={(e) =>
                                handleEducationChange(
                                  index,
                                  "period",
                                  e.target.value
                                )
                              }
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              {t("jobs.application.form.institution")}
                            </label>
                            <Input
                              type="text"
                              placeholder={t(
                                "jobs.application.form.institution_placeholder"
                              )}
                              value={edu.institution}
                              onChange={(e) =>
                                handleEducationChange(
                                  index,
                                  "institution",
                                  e.target.value
                                )
                              }
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              {t("jobs.application.form.degree")}
                            </label>
                            <Input
                              type="text"
                              placeholder={t(
                                "jobs.application.form.degree_placeholder"
                              )}
                              value={edu.degree}
                              onChange={(e) =>
                                handleEducationChange(
                                  index,
                                  "degree",
                                  e.target.value
                                )
                              }
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              {t("jobs.application.form.specialty")}
                            </label>
                            <Input
                              type="text"
                              placeholder={t(
                                "jobs.application.form.specialty_placeholder"
                              )}
                              value={edu.specialty}
                              onChange={(e) =>
                                handleEducationChange(
                                  index,
                                  "specialty",
                                  e.target.value
                                )
                              }
                              required
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={addEducation}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <span className="text-xl">+</span>
                      {t("jobs.application.form.add_education")}
                    </button>
                  </div>
                </div>

                {/* Work Experience Section */}
                <div className="px-4 sm:px-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    🔨 {t("jobs.application.form.work_experience")} 🔨
                  </h2>

                  <div className="space-y-4">
                    {formData.workExperience.map((work, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-4"
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium text-gray-800 dark:text-gray-200">
                            {t("jobs.application.form.work_experience")} #
                            {index + 1}
                          </h3>
                          {formData.workExperience.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeWorkExperience(index)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              {t("jobs.application.form.remove_work")}
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              {t("jobs.application.form.work_period")}
                            </label>
                            <Input
                              type="text"
                              placeholder={t(
                                "jobs.application.form.work_period_placeholder"
                              )}
                              value={work.period}
                              onChange={(e) =>
                                handleWorkExperienceChange(
                                  index,
                                  "period",
                                  e.target.value
                                )
                              }
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              {t("jobs.application.form.company")}
                            </label>
                            <Input
                              type="text"
                              placeholder={t(
                                "jobs.application.form.company_placeholder"
                              )}
                              value={work.company}
                              onChange={(e) =>
                                handleWorkExperienceChange(
                                  index,
                                  "company",
                                  e.target.value
                                )
                              }
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              {t("jobs.application.form.position")}
                            </label>
                            <Input
                              type="text"
                              placeholder={t(
                                "jobs.application.form.position_placeholder"
                              )}
                              value={work.position}
                              onChange={(e) =>
                                handleWorkExperienceChange(
                                  index,
                                  "position",
                                  e.target.value
                                )
                              }
                              required
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={addWorkExperience}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <span className="text-xl">+</span>
                      {t("jobs.application.form.add_work")}
                    </button>
                  </div>
                </div>

                {/* Language Proficiency */}
                <div className="px-4 sm:px-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {t("jobs.application.form.language_proficiency")}
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t("jobs.application.form.uzbek_language")}
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                        {languageLevels.map((level) => (
                          <label
                            key={level.value}
                            className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                          >
                            <input
                              type="radio"
                              name="uzbek"
                              value={level.value}
                              checked={formData.languages.uzbek === level.value}
                              onChange={(e) =>
                                handleLanguageChange("uzbek", e.target.value)
                              }
                              className="text-blue-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                              {level.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t("jobs.application.form.russian_language")}
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                        {languageLevels.map((level) => (
                          <label
                            key={level.value}
                            className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                          >
                            <input
                              type="radio"
                              name="russian"
                              value={level.value}
                              checked={
                                formData.languages.russian === level.value
                              }
                              onChange={(e) =>
                                handleLanguageChange("russian", e.target.value)
                              }
                              className="text-blue-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                              {level.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t("jobs.application.form.english_language")}
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                        {languageLevels.map((level) => (
                          <label
                            key={level.value}
                            className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                          >
                            <input
                              type="radio"
                              name="english"
                              value={level.value}
                              checked={
                                formData.languages.english === level.value
                              }
                              onChange={(e) =>
                                handleLanguageChange("english", e.target.value)
                              }
                              className="text-blue-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                              {level.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Salary Range */}
                <div className="px-4 sm:px-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {t("jobs.application.form.salary_range")}
                  </h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t("jobs.application.form.salary_range_select")}
                    </label>
                    <Select
                      value={formData.salaryRange}
                      onChange={(value) =>
                        handleInputChange("salaryRange", value)
                      }
                      options={salaryRanges}
                      placeholder={t(
                        "jobs.application.form.salary_range_placeholder"
                      )}
                      required
                    />
                  </div>
                </div>

                {/* Criminal Record */}
                <div className="px-4 sm:px-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {t("jobs.application.form.criminal_record")}
                  </h2>

                  <div>
                    <label className="flex items-center gap-2">
                      <Checkbox
                        checked={formData.hasCriminalRecord}
                        onChange={(e) =>
                          handleInputChange(
                            "hasCriminalRecord",
                            e.target.checked
                          )
                        }
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t("jobs.application.form.criminal_record_question")}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="px-4 sm:px-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {t("jobs.application.form.additional_info")}
                  </h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t("jobs.application.form.additional_info")}
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      rows={4}
                      placeholder={t(
                        "jobs.application.form.additional_info_placeholder"
                      )}
                      value={formData.additionalInfo}
                      onChange={(e) =>
                        handleInputChange("additionalInfo", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 pb-6 px-4 sm:px-6 border-t border-gray-100 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 py-3 px-4 sm:px-6 rounded-lg font-semibold text-base sm:text-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
                  >
                    {t("jobs.application.form.back_button")}
                  </button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 px-4 sm:px-6 rounded-lg font-semibold text-base sm:text-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>{t("jobs.application.form.submitting")}</span>
                      </div>
                    ) : (
                      t("jobs.application.form.submit_button")
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobApplicationForm;
