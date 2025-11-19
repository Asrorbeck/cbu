import React, { useState, useEffect } from "react";
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
import LoadingSkeleton from "../job-vacancies-browser/components/LoadingSkeleton";
import { vacanciesAPI } from "../../services/api";
import apiClient from "../../services/api";

const JobApplicationForm = () => {
  const { departmentId, vacancyId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vacancy, setVacancy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // Decode the vacancy ID from URL
  const decodedVacancyId = vacancyId ? atob(vacancyId) : null;

  // Fetch vacancy data from API
  useEffect(() => {
    const fetchVacancyData = async () => {
      if (!decodedVacancyId) {
        setError("Invalid vacancy ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const vacancyData = await vacanciesAPI.getVacancyById(decodedVacancyId);

        // Transform the API response to match our component structure
        const transformedVacancy = {
          id: vacancyData.id.toString(),
          title: vacancyData.title,
          department: vacancyData.management?.name || "Markaziy apparat",
          location: vacancyData.management?.name || "Markaziy apparat",
          type: "Full-time",
          deadline: vacancyData.application_deadline,
          testDeadline: vacancyData.application_deadline,
          salary: "15,000,000 - 22,000,000 UZS", // This might need to come from API
          description: vacancyData.management?.name
            ? `${vacancyData.management.name} - ${vacancyData.title}`
            : vacancyData.title,
          fullDescription: vacancyData.description,
          requirements: parseJsonArray(vacancyData.requirements),
          responsibilities: parseJsonArray(vacancyData.job_tasks),
        };

        setVacancy(transformedVacancy);
      } catch (error) {
        console.error("Error fetching vacancy:", error);
        setError("Failed to load vacancy details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchVacancyData();
  }, [decodedVacancyId]);

  // Helper function to parse JSON string arrays or plain text
  const parseJsonArray = (data) => {
    if (!data) return [];

    // If it's already an array, return it
    if (Array.isArray(data)) {
      return data.map((item) => item.task || item);
    }

    // If it's a string, try to parse as JSON first
    if (typeof data === "string") {
      try {
        const parsed = JSON.parse(data);
        return Array.isArray(parsed)
          ? parsed.map((item) => item.task || item)
          : [];
      } catch (error) {
        // If JSON parsing fails, treat as plain text and split by newlines
        console.log("Treating as plain text:", data);
        return data.split("\n").filter((line) => line.trim().length > 0);
      }
    }

    return [];
  };

  // Get the specific vacancy based on API data
  const currentVacancy = vacancy || {
    title: "Loading...",
    department: "Loading...",
  };

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    birthDate: "",
    phone: "",
    education: [
      {
        startYear: "",
        endYear: "",
        isCurrent: false,
        institution: "",
        degree: "",
        specialty: "",
      },
    ],
    workExperience: [
      {
        startYear: "",
        endYear: "",
        isCurrent: false,
        company: "",
        position: "",
      },
    ],
    languages: {
      uzbek: "",
      russian: "",
      english: "",
    },
    additionalInfo: "",
  });

  // Get user ID from Telegram Web App or use default
  const getUserId = () => {
    try {
      // Check if Telegram Web App is available
      if (window.Telegram && window.Telegram.WebApp) {
        // Initialize Telegram Web App
        window.Telegram.WebApp.ready();

        // Try to get user data from initDataUnsafe
        if (
          window.Telegram.WebApp.initDataUnsafe &&
          window.Telegram.WebApp.initDataUnsafe.user
        ) {
          const user = window.Telegram.WebApp.initDataUnsafe.user;
          console.log("Telegram user ID found:", user.id);
          return user.id;
        }
      }

      // If Telegram Web App is not available or user data not found, use default ID
      console.log("Using default user ID: 905770018");
      return 905770018;
    } catch (error) {
      console.error("Error getting user ID:", error);
      console.log("Using default user ID due to error: 905770018");
      return 905770018;
    }
  };

  // Generate year options (from 1950 to current year)
  const generateYearOptions = (minYear = 1950) => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= minYear; year--) {
      years.push({ value: year.toString(), label: year.toString() });
    }
    return years;
  };

  const yearOptions = generateYearOptions();

  // Generate filtered year options for end year based on start year
  const getEndYearOptions = (startYear) => {
    if (!startYear) return yearOptions;
    const start = parseInt(startYear);
    return generateYearOptions(start);
  };

  // Degree options
  const degreeOptions = [
    { value: "Bachelor", label: "Bakalavr" },
    { value: "Master", label: "Magistr" },
    { value: "PhD", label: "PhD" },
  ];

  // Language proficiency options
  const languageLevels = [
    { value: "dont_know", label: t("jobs.application.form.dont_know") },
    { value: "beginner", label: t("jobs.application.form.beginner") },
    { value: "intermediate", label: t("jobs.application.form.intermediate") },
    { value: "excellent", label: t("jobs.application.form.excellent") },
  ];

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Handle education changes
  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...formData.education];
    updatedEducation[index][field] = value;

    // If start year changes and end year is before start year, clear end year
    if (field === "startYear" && updatedEducation[index].endYear) {
      const startYear = parseInt(value);
      const endYear = parseInt(updatedEducation[index].endYear);
      if (endYear < startYear) {
        updatedEducation[index].endYear = "";
      }
    }

    // If isCurrent is checked, clear end year
    if (field === "isCurrent" && value === true) {
      updatedEducation[index].endYear = "";
    }

    setFormData((prev) => ({
      ...prev,
      education: updatedEducation,
    }));

    // Clear error when user starts typing
    const errorKey = `education_${index}_${field}`;
    if (fieldErrors[errorKey]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  // Add new education entry
  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          startYear: "",
          endYear: "",
          isCurrent: false,
          institution: "",
          degree: "",
          specialty: "",
        },
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

    // If start year changes and end year is before start year, clear end year
    if (field === "startYear" && updatedWorkExperience[index].endYear) {
      const startYear = parseInt(value);
      const endYear = parseInt(updatedWorkExperience[index].endYear);
      if (endYear < startYear) {
        updatedWorkExperience[index].endYear = "";
      }
    }

    // If isCurrent is checked, clear end year
    if (field === "isCurrent" && value === true) {
      updatedWorkExperience[index].endYear = "";
    }

    setFormData((prev) => ({
      ...prev,
      workExperience: updatedWorkExperience,
    }));

    // Clear error when user starts typing
    const errorKey = `workExperience_${index}_${field}`;
    if (fieldErrors[errorKey]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  // Add new work experience entry
  const addWorkExperience = () => {
    setFormData((prev) => ({
      ...prev,
      workExperience: [
        ...prev.workExperience,
        {
          startYear: "",
          endYear: "",
          isCurrent: false,
          company: "",
          position: "",
        },
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
    // Clear error when user starts typing
    const errorKey = `languages_${language}`;
    if (fieldErrors[errorKey]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    // Helper function to convert year to full date
    const yearToDate = (year, isEndDate = false) => {
      if (!year) return "";
      if (isEndDate) {
        return `${year}-12-31`;
      }
      return `${year}-01-01`;
    };

    // Helper function to get current date
    const getCurrentDate = () => {
      const today = new Date();
      return today.toISOString().split("T")[0];
    };

    // Transform form data to match API format
    const formDataToSend = {
      job: parseInt(decodedVacancyId), // Convert to integer
      user_id: getUserId(), // Add user ID from Telegram Web App or default
      full_name: formData.fullName,
      data_of_birth: formData.birthDate,
      phone: formData.phone,
      additional_information: formData.additionalInfo || "",
      graduations: formData.education.map((edu) => ({
        date_from: yearToDate(edu.startYear),
        date_to: edu.isCurrent
          ? getCurrentDate()
          : yearToDate(edu.endYear, true),
        university: edu.institution,
        degree: edu.degree,
        specialization: edu.specialty,
      })),
      employments: formData.workExperience.map((work) => ({
        date_from: yearToDate(work.startYear),
        date_to: work.isCurrent
          ? getCurrentDate()
          : yearToDate(work.endYear, true),
        organization_name: work.company,
        position: work.position,
      })),
      languages: Object.entries(formData.languages).map(
        ([language, level]) => ({
          language_name: language,
          degree: level,
        })
      ),
    };

    console.log("Job Application Form Data:", formDataToSend);

    try {
      // Send to API using apiClient
      const response = await apiClient.post("/apply-jobs/", formDataToSend);

      console.log("Application submitted successfully:", response.data);

      // Show success toast
      toast.success(t("jobs.application.form.success_message"), {
        duration: 4000,
        position: "top-center",
      });

      // Save to localStorage for backup
      const applicationData = {
        id: Date.now().toString(),
        ...formDataToSend,
        status: "pending",
        submittedAt: new Date().toISOString(),
        vacancyTitle: currentVacancy?.title,
        departmentName: currentVacancy?.management?.name || "Noma'lum",
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

      // Clear form
      clearForm();

      // Navigate to departments page after a short delay
      setTimeout(() => {
        navigate("/departments");
      }, 1500);
    } catch (error) {
      console.error("Form submission error:", error);

      // Parse backend errors
      const errors = {};

      if (error.response?.data) {
        const backendErrors = error.response.data;

        // Translate error messages to Uzbek
        const translateError = (message) => {
          const translations = {
            "This field may not be blank.":
              "Ushbu maydon bo'sh bo'lishi mumkin emas.",
            "Date has wrong format. Use one of these formats instead: YYYY-MM-DD.":
              "Sana noto'g'ri formatda yokida kiritilmagan",
            '"" is not a valid choice.':
              "Noto'g'ri tanlov. Iltimos, boshqa variantni tanlang.",
          };

          // Try exact match first
          if (translations[message]) {
            return translations[message];
          }

          // Try partial match
          for (const [key, value] of Object.entries(translations)) {
            if (message.includes(key)) {
              return value;
            }
          }

          return message;
        };

        // Map backend field names to frontend field names
        if (backendErrors.full_name) {
          errors.fullName = translateError(backendErrors.full_name[0]);
        }

        if (backendErrors.data_of_birth) {
          errors.birthDate = translateError(backendErrors.data_of_birth[0]);
        }

        if (backendErrors.phone) {
          errors.phone = translateError(backendErrors.phone[0]);
        }

        if (backendErrors.additional_information) {
          errors.additionalInfo = translateError(
            backendErrors.additional_information[0]
          );
        }

        // Handle graduations errors
        if (
          backendErrors.graduations &&
          Array.isArray(backendErrors.graduations)
        ) {
          backendErrors.graduations.forEach((gradError, index) => {
            if (gradError.university) {
              errors[`education_${index}_institution`] = translateError(
                gradError.university[0]
              );
            }
            if (gradError.specialization) {
              errors[`education_${index}_specialty`] = translateError(
                gradError.specialization[0]
              );
            }
          });
        }

        // Handle employments errors
        if (
          backendErrors.employments &&
          Array.isArray(backendErrors.employments)
        ) {
          backendErrors.employments.forEach((empError, index) => {
            if (empError.organization_name) {
              errors[`workExperience_${index}_company`] = translateError(
                empError.organization_name[0]
              );
            }
            if (empError.position) {
              errors[`workExperience_${index}_position`] = translateError(
                empError.position[0]
              );
            }
          });
        }

        // Handle languages errors
        if (backendErrors.languages && Array.isArray(backendErrors.languages)) {
          const languageKeys = ["uzbek", "russian", "english"];
          backendErrors.languages.forEach((langError, index) => {
            if (langError.degree && index < languageKeys.length) {
              const langKey = languageKeys[index];
              errors[`languages_${langKey}`] = translateError(
                langError.degree[0]
              );
            }
          });
        }
      }

      // Set field errors
      setFieldErrors(errors);

      // Show toast only if there are no specific field errors
      if (Object.keys(errors).length === 0) {
        toast.error(t("jobs.application.form.error_message"), {
          duration: 5000,
          position: "top-center",
        });
      } else {
        toast.error(
          "Formani to'ldirishda xatolar topildi. Iltimos, quyidagi maydonlarni tekshiring.",
          {
            duration: 5000,
            position: "top-center",
          }
        );
      }
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

📝 *Qo'shimcha ma'lumot:*
${formData.additionalInfo || "Kiritilmagan"}

🏢 *Vakansiya ma'lumotlari:*
• Departament ID: ${departmentId}
• Vakansiya ID: ${decodedVacancyId}
• Vakansiya nomi: ${currentVacancy?.title || "Noma'lum"}

👤 *Foydalanuvchi ID:* ${getUserId()}

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
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Clear form function
  const clearForm = () => {
    setFormData({
      fullName: "",
      birthDate: "",
      phone: "",
      education: [
        {
          startYear: "",
          endYear: "",
          isCurrent: false,
          institution: "",
          degree: "",
          specialty: "",
        },
      ],
      workExperience: [
        {
          startYear: "",
          endYear: "",
          isCurrent: false,
          company: "",
          position: "",
        },
      ],
      languages: {
        uzbek: "",
        russian: "",
        english: "",
      },
      additionalInfo: "",
    });
    setFieldErrors({});
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <LoadingSkeleton type="cards" count={3} />
          </div>
        </main>
      </div>
    );
  }

  // Show error state
  if (error || !vacancy) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <Icon
                name="AlertCircle"
                size={48}
                className="text-red-500 mx-auto mb-4"
              />
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Error Loading Vacancy
              </h1>
              <p className="text-muted-foreground mb-6">
                {error || "Vacancy not found"}
              </p>
              <button
                onClick={() => navigate("/departments")}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                {t("jobs.back_to_departments")}
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{t("jobs.application.form.title")} - Central Bank</title>
        <meta name="description" content={t("jobs.application.form.title")} />
      </Helmet>
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
                      {fieldErrors.fullName && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                          <Icon name="AlertCircle" size={16} />
                          {fieldErrors.fullName}
                        </p>
                      )}
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
                      {fieldErrors.birthDate && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                          <Icon name="AlertCircle" size={16} />
                          {fieldErrors.birthDate}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t("jobs.application.form.phone_number")}
                      </label>
                      <Input
                        type="tel"
                        placeholder="+998 90 123 45 67"
                        value={formData.phone}
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

                          handleInputChange("phone", value);
                        }}
                        required
                      />
                      {fieldErrors.phone && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                          <Icon name="AlertCircle" size={16} />
                          {fieldErrors.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Education Section */}
                <div className="px-4 sm:px-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Icon
                      name="GraduationCap"
                      size={20}
                      className="text-blue-600"
                    />
                    {t("jobs.application.form.education")}
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
                              {t("jobs.application.form.start_year")}
                            </label>
                            <Select
                              value={edu.startYear}
                              onChange={(value) =>
                                handleEducationChange(index, "startYear", value)
                              }
                              options={yearOptions}
                              placeholder={t(
                                "jobs.application.form.select_year"
                              )}
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              {t("jobs.application.form.end_year")}
                            </label>
                            <div className="space-y-2">
                              <Select
                                value={edu.endYear}
                                onChange={(value) =>
                                  handleEducationChange(index, "endYear", value)
                                }
                                options={getEndYearOptions(edu.startYear)}
                                placeholder={t(
                                  "jobs.application.form.select_year"
                                )}
                                disabled={edu.isCurrent}
                                required={!edu.isCurrent}
                              />
                              {index > 0 && (
                                <div className="flex items-center">
                                  <Checkbox
                                    id={`edu-current-${index}`}
                                    checked={edu.isCurrent}
                                    onChange={(checked) =>
                                      handleEducationChange(
                                        index,
                                        "isCurrent",
                                        checked
                                      )
                                    }
                                  />
                                  <label
                                    htmlFor={`edu-current-${index}`}
                                    className="ml-2 text-sm text-gray-600 dark:text-gray-400"
                                  >
                                    {t(
                                      "jobs.application.form.currently_studying"
                                    )}
                                  </label>
                                </div>
                              )}
                            </div>
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
                            {fieldErrors[`education_${index}_institution`] && (
                              <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                                <Icon name="AlertCircle" size={16} />
                                {fieldErrors[`education_${index}_institution`]}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              {t("jobs.application.form.degree")}
                            </label>
                            <Select
                              value={edu.degree}
                              onChange={(value) =>
                                handleEducationChange(index, "degree", value)
                              }
                              options={degreeOptions}
                              placeholder={t(
                                "jobs.application.form.degree_placeholder"
                              )}
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
                            {fieldErrors[`education_${index}_specialty`] && (
                              <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                                <Icon name="AlertCircle" size={16} />
                                {fieldErrors[`education_${index}_specialty`]}
                              </p>
                            )}
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
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Icon
                      name="Briefcase"
                      size={20}
                      className="text-green-600"
                    />
                    {t("jobs.application.form.work_experience")}
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              {t("jobs.application.form.start_year")}
                            </label>
                            <Select
                              value={work.startYear}
                              onChange={(value) =>
                                handleWorkExperienceChange(
                                  index,
                                  "startYear",
                                  value
                                )
                              }
                              options={yearOptions}
                              placeholder={t(
                                "jobs.application.form.select_year"
                              )}
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              {t("jobs.application.form.end_year")}
                            </label>
                            <div className="space-y-2">
                              <Select
                                value={work.endYear}
                                onChange={(value) =>
                                  handleWorkExperienceChange(
                                    index,
                                    "endYear",
                                    value
                                  )
                                }
                                options={getEndYearOptions(work.startYear)}
                                placeholder={t(
                                  "jobs.application.form.select_year"
                                )}
                                disabled={work.isCurrent}
                                required={!work.isCurrent}
                              />
                              <div className="flex items-center">
                                <Checkbox
                                  id={`work-current-${index}`}
                                  checked={work.isCurrent}
                                  onChange={(checked) =>
                                    handleWorkExperienceChange(
                                      index,
                                      "isCurrent",
                                      checked
                                    )
                                  }
                                />
                                <label
                                  htmlFor={`work-current-${index}`}
                                  className="ml-2 text-sm text-gray-600 dark:text-gray-400"
                                >
                                  {t("jobs.application.form.currently_working")}
                                </label>
                              </div>
                            </div>
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
                            {fieldErrors[`workExperience_${index}_company`] && (
                              <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                                <Icon name="AlertCircle" size={16} />
                                {fieldErrors[`workExperience_${index}_company`]}
                              </p>
                            )}
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
                            {fieldErrors[
                              `workExperience_${index}_position`
                            ] && (
                              <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                                <Icon name="AlertCircle" size={16} />
                                {
                                  fieldErrors[
                                    `workExperience_${index}_position`
                                  ]
                                }
                              </p>
                            )}
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
                      {fieldErrors.languages_uzbek && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                          <Icon name="AlertCircle" size={16} />
                          {fieldErrors.languages_uzbek}
                        </p>
                      )}
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
                      {fieldErrors.languages_russian && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                          <Icon name="AlertCircle" size={16} />
                          {fieldErrors.languages_russian}
                        </p>
                      )}
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
                      {fieldErrors.languages_english && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                          <Icon name="AlertCircle" size={16} />
                          {fieldErrors.languages_english}
                        </p>
                      )}
                    </div>
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
                    {fieldErrors.additionalInfo && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                        <Icon name="AlertCircle" size={16} />
                        {fieldErrors.additionalInfo}
                      </p>
                    )}
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
