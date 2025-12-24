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
  const { departmentId, regionName, vacancyId } = useParams();
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
          department: vacancyData.management?.name || t("jobs.central_apparatus"),
          location: vacancyData.management?.name || t("jobs.central_apparatus"),
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
    jshshir: "",
    education: [
      {
        startYear: "",
        startMonth: "",
        endYear: "",
        endMonth: "",
        isCurrent: false,
        institution: "",
        degree: "",
        specialty: "",
      },
    ],
    workExperience: [
      {
        startYear: "",
        startMonth: "",
        endYear: "",
        endMonth: "",
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
    neverWorked: false,
    convicted: false,
    convictionDetails: "",
    expectedSalary: "",
    businessTripReady: "",
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
          return user.id;
        }
      }

      // If Telegram Web App is not available or user data not found, use default ID
      return 905770018;
    } catch (error) {
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

  // Month options in Uzbek
  const monthOptions = [
    { value: "1", label: "Yanvar" },
    { value: "2", label: "Fevral" },
    { value: "3", label: "Mart" },
    { value: "4", label: "Aprel" },
    { value: "5", label: "May" },
    { value: "6", label: "Iyun" },
    { value: "7", label: "Iyul" },
    { value: "8", label: "Avgust" },
    { value: "9", label: "Sentabr" },
    { value: "10", label: "Oktyabr" },
    { value: "11", label: "Noyabr" },
    { value: "12", label: "Dekabr" },
  ];

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

  // Format JShShIR (14 digits without spaces: 12345678901234)
  const formatJShShIR = (value) => {
    if (!value) return "";
    
    // Remove all non-digit characters
    let cleaned = value.replace(/\D/g, "");
    
    // Limit to 14 digits
    if (cleaned.length > 14) {
      cleaned = cleaned.substring(0, 14);
    }
    
    // Return without formatting (just digits)
    return cleaned;
  };

  // Validate phone number completeness for +998
  const isPhoneComplete = (phone) => {
    if (!phone) return false;
    // If starts with +998, check if it's complete: +998 XX XXX XX XX (17 characters)
    if (phone.startsWith("+998")) {
      // Remove spaces to count digits
      const digits = phone.replace(/\D/g, "");
      // Should have +998 (3 digits) + 9 digits after = 12 total digits, formatted should be exactly 17 characters
      // Format: +998 XX XXX XX XX = 4 + 1 + 2 + 1 + 3 + 1 + 2 + 1 + 2 = 17 characters
      return phone.length === 17 && digits.length === 12;
    }
    // For other formats, consider complete if has reasonable length
    return phone.length >= 10;
  };

  // Validate JShShIR (must be exactly 14 digits with advanced validation)
  const validateJShShIR = (value) => {
    if (!value || value.trim().length === 0) {
      return t("jobs.application.form.jshshir_required");
    }
    
    // Remove spaces and check if it's exactly 14 digits
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length !== 14) {
      return t("jobs.application.form.jshshir_length_error");
    }
    
    // Check if all digits are the same (e.g., 11111111111111, 22222222222222)
    const allSame = /^(\d)\1{13}$/.test(cleaned);
    if (allSame) {
      return t("jobs.application.form.jshshir_same_digits_error");
    }
    
    // Check for simple patterns like 12121212121212
    const simplePattern = /^(\d{1,2})\1{6,}$/.test(cleaned);
    if (simplePattern) {
      return t("jobs.application.form.jshshir_pattern_error");
    }
    
    // Validate date logic: first digit, then date (DDMMYY format)
    // Example: 51007021111111 where 100702 = July 10, 2002 (DD=10, MM=07, YY=02)
    const firstDigit = parseInt(cleaned[0]);
    const datePart = cleaned.substring(1, 7); // Next 6 digits: DDMMYY
    const day = parseInt(datePart.substring(0, 2));
    const month = parseInt(datePart.substring(2, 4));
    const year = parseInt(datePart.substring(4, 6));
    
    // Validate month (1-12)
    if (month < 1 || month > 12) {
      return t("jobs.application.form.jshshir_invalid");
    }
    
    // Validate day (1-31, but we'll check more precisely)
    if (day < 1 || day > 31) {
      return t("jobs.application.form.jshshir_invalid");
    }
    
    // Check if date is valid (considering leap years, etc.)
    // Full year: if first digit is 5, it's 20XX, if 4, it's 19XX
    const fullYear = firstDigit === 5 ? 2000 + year : (firstDigit === 4 ? 1900 + year : 2000 + year);
    const date = new Date(fullYear, month - 1, day);
    
    if (date.getFullYear() !== fullYear || date.getMonth() !== month - 1 || date.getDate() !== day) {
      return t("jobs.application.form.jshshir_invalid");
    }
    
    return null; // Validation passed
  };

  // Format salary number with spaces (1 000 000)
  const formatSalary = (value) => {
    if (!value) return "";
    
    // Remove all non-digit characters
    let cleaned = value.replace(/\D/g, "");
    
    // If empty, return empty
    if (!cleaned) return "";
    
    // Format with spaces: 1 000 000
    return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // Format phone number with mask
  const formatPhoneNumber = (value, previousValue = "") => {
    // If empty, return empty
    if (!value) return "";
    
    // Remove all non-digit characters except +
    let cleaned = value.replace(/[^\d+]/g, "");
    
    // If user is deleting, allow it
    if (value.length < previousValue.length) {
      return value;
    }
    
    // If starts with +998
    if (cleaned.startsWith("+998")) {
      // Remove +998 prefix to get only digits
      let digits = cleaned.replace("+998", "");
      
      // Limit to 9 digits (Uzbekistan format: +998 XX XXX XX XX)
      if (digits.length > 9) {
        digits = digits.substring(0, 9);
      }
      
      // Format: +998 XX XXX XX XX
      if (digits.length === 0) {
        return "+998";
      } else if (digits.length <= 2) {
        return `+998 ${digits}`;
      } else if (digits.length <= 5) {
        return `+998 ${digits.substring(0, 2)} ${digits.substring(2)}`;
      } else if (digits.length <= 7) {
        return `+998 ${digits.substring(0, 2)} ${digits.substring(2, 5)} ${digits.substring(5)}`;
      } else {
        return `+998 ${digits.substring(0, 2)} ${digits.substring(2, 5)} ${digits.substring(5, 7)} ${digits.substring(7)}`;
      }
    }
    // If starts with +7
    else if (cleaned.startsWith("+7")) {
      // Remove +7 prefix to get only digits
      let digits = cleaned.replace("+7", "");
      
      // Limit to 10 digits (Russia format: +7 XXX XXX XX XX)
      if (digits.length > 10) {
        digits = digits.substring(0, 10);
      }
      
      // Format: +7 XXX XXX XX XX
      if (digits.length === 0) {
        return "+7";
      } else if (digits.length <= 3) {
        return `+7 ${digits}`;
      } else if (digits.length <= 6) {
        return `+7 ${digits.substring(0, 3)} ${digits.substring(3)}`;
      } else if (digits.length <= 8) {
        return `+7 ${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6)}`;
      } else {
        return `+7 ${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6, 8)} ${digits.substring(8)}`;
      }
    }
    // If starts with + but not +998 or +7, allow typing
    else if (cleaned.startsWith("+")) {
      // Allow user to continue typing country code
      return cleaned;
    }
    // If doesn't start with +, check if it's all digits and auto-add +998
    else if (/^\d+$/.test(cleaned)) {
      // If user types digits without +, auto-add +998 prefix
      // Limit to 9 digits for Uzbekistan format
      if (cleaned.length > 9) {
        cleaned = cleaned.substring(0, 9);
      }
      
      // Format: +998 XX XXX XX XX
      if (cleaned.length === 0) {
        return "";
      } else if (cleaned.length <= 2) {
        return `+998 ${cleaned}`;
      } else if (cleaned.length <= 5) {
        return `+998 ${cleaned.substring(0, 2)} ${cleaned.substring(2)}`;
      } else if (cleaned.length <= 7) {
        return `+998 ${cleaned.substring(0, 2)} ${cleaned.substring(2, 5)} ${cleaned.substring(5)}`;
      } else {
        return `+998 ${cleaned.substring(0, 2)} ${cleaned.substring(2, 5)} ${cleaned.substring(5, 7)} ${cleaned.substring(7)}`;
      }
    }
    // Otherwise, return as is
    else {
      return cleaned;
    }
  };

  // Validate full name format: Familya Ism Otchestvo
  const validateFullName = (name) => {
    if (!name || name.trim().length === 0) {
      return "To'liq ism-familiya kiritilishi shart";
    }

    const trimmedName = name.trim();
    const words = trimmedName.split(/\s+/).filter((word) => word.length > 0);

    // Minimum 3 so'z bo'lishi kerak (Familya, Ism, Otchestvo)
    if (words.length < 3) {
      return "Iltimos, to'liq ism-familiyani kiriting: Familya Ism Otchestvo";
    }

    // Familya birinchi so'z bo'lishi kerak
    const familya = words[0];
    if (familya.length < 2) {
      return "Familya to'g'ri kiritilmagan";
    }

    // Otchestvo validatsiyasi - oxirgi so'z(lar) tekshiriladi
    // Barcha "ogli" variantlari: ogli, o'g'li, o'gli, og'li (apostrof bilan yoki apostrofsiz)
    const validOgliVariants = ["ogli", "o'g'li", "o'gli", "og'li"];
    // Barcha "qizi" variantlari
    const validQiziVariants = ["qizi", "qizzi"];
    // Barcha "vich/vna" variantlari
    const validOtchestvoEndings = [
      "vich",
      "vna",
      "ovich",
      "ovna",
      "evich",
      "evna",
    ];

    const lastWord = words[words.length - 1].toLowerCase();
    const secondLastWord =
      words.length > 3 ? words[words.length - 2].toLowerCase() : "";

    // Apostrofni olib tashlab tekshirish funksiyasi
    const normalizeForComparison = (word) => {
      return word.replace(/[''`]/g, ""); // Barcha apostrof variantlarini olib tashlash
    };

    // Otchestvo 2 so'z bo'lishi mumkin: "Bahodir ogli" yoki "Bahodir qizi" (barcha variantlar bilan)
    const normalizedLastWord = normalizeForComparison(lastWord);
    const isOgliVariant = validOgliVariants.some((variant) => {
      const normalizedVariant = normalizeForComparison(variant);
      return lastWord === variant || normalizedLastWord === normalizedVariant;
    });
    const isQiziVariant = validQiziVariants.some((variant) => {
      const normalizedVariant = normalizeForComparison(variant);
      return lastWord === variant || normalizedLastWord === normalizedVariant;
    });

    if (isOgliVariant || isQiziVariant) {
      // Agar oxirgi so'z "ogli" yoki "qizi" variantlaridan biri bo'lsa
      if (words.length < 4) {
        return "Otchestvo to'liq kiritilmagan (masalan: Abdullayev Abdulaziz Abdullayevich)";
      }
      // Bu holat qabul qilinadi (masalan: Abdullayev Abdulaziz Abdullayevich)
    }
    // Otchestvo 1 so'z bo'lishi mumkin: "Bahodirovich", "Bahodirovna" va h.k.
    else {
      const hasValidEnding = validOtchestvoEndings.some(
        (ending) => lastWord.endsWith(ending) && lastWord.length > ending.length
      );

      if (!hasValidEnding) {
        return "Otchestvo 'ogli', 'o'g'li', 'qizi', 'vich' yoki 'vna' bilan tugashi kerak (masalan: Abdullayev Abdulaziz Abdullayevich)";
      }
    }

    // Ism 1 yoki 2 so'z bo'lishi mumkin
    // Minimum 3 so'z: Familya Ism Otchestvo
    // Maximum 5 so'z: Familya Ism1 Ism2 Otchestvo1 Otchestvo2
    if (words.length > 5) {
      return "Ism-familiya juda uzun. Iltimos, to'g'ri formatda kiriting: Familya Ism Otchestvo";
    }

    // Har bir so'z kamida 2 ta harfdan iborat bo'lishi kerak
    for (let i = 0; i < words.length; i++) {
      if (words[i].length < 2) {
        return "Har bir so'z kamida 2 ta harfdan iborat bo'lishi kerak";
      }
    }

    return null; // Validation passed
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Validate fullName on change (but don't show error until blur)
    if (field === "fullName" && value.trim().length > 0) {
      const error = validateFullName(value);
      if (error) {
        setFieldErrors((prev) => ({
          ...prev,
          [field]: error,
        }));
      } else {
        // Clear error if validation passes
        if (fieldErrors[field]) {
          setFieldErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
          });
        }
      }
    } else if (fieldErrors[field]) {
      // Clear error when user starts typing other fields
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

    // If start year changes and end year is before start year, clear end year and month
    if (field === "startYear" && updatedEducation[index].endYear) {
      const startYear = parseInt(value);
      const endYear = parseInt(updatedEducation[index].endYear);
      if (endYear < startYear) {
        updatedEducation[index].endYear = "";
        updatedEducation[index].endMonth = "";
      } else if (endYear === startYear && updatedEducation[index].endMonth) {
        // If same year, check if end month is before start month
        const startMonth = parseInt(updatedEducation[index].startMonth || "1");
        const endMonth = parseInt(updatedEducation[index].endMonth);
        if (endMonth < startMonth) {
          updatedEducation[index].endMonth = "";
        }
        // If same year and same month, clear end month (cannot be same month)
        if (endMonth === startMonth) {
          updatedEducation[index].endMonth = "";
        }
      }
    }

    // If start month changes and same year, check end month
    if (field === "startMonth" && updatedEducation[index].startYear && updatedEducation[index].endYear) {
      const startYear = parseInt(updatedEducation[index].startYear);
      const endYear = parseInt(updatedEducation[index].endYear);
      if (startYear === endYear && updatedEducation[index].endMonth) {
        const startMonth = parseInt(value || "1");
        const endMonth = parseInt(updatedEducation[index].endMonth);
        if (endMonth < startMonth) {
          updatedEducation[index].endMonth = "";
        }
        // If same month, clear end month (cannot be same month)
        if (endMonth === startMonth) {
          updatedEducation[index].endMonth = "";
        }
      }
    }

    // If end year changes and same as start year, check month
    if (field === "endYear" && updatedEducation[index].startYear) {
      const startYear = parseInt(updatedEducation[index].startYear);
      const endYear = parseInt(value);
      if (endYear === startYear && updatedEducation[index].endMonth && updatedEducation[index].startMonth) {
        const startMonth = parseInt(updatedEducation[index].startMonth);
        const endMonth = parseInt(updatedEducation[index].endMonth);
        // If same month, clear end month (cannot be same month)
        if (endMonth === startMonth) {
          updatedEducation[index].endMonth = "";
        }
      }
    }

    // If end month changes and same year and month as start, clear it
    if (field === "endMonth" && updatedEducation[index].startYear && updatedEducation[index].endYear) {
      const startYear = parseInt(updatedEducation[index].startYear);
      const endYear = parseInt(updatedEducation[index].endYear);
      if (startYear === endYear && updatedEducation[index].startMonth) {
        const startMonth = parseInt(updatedEducation[index].startMonth);
        const endMonth = parseInt(value);
        // If same month, clear end month (cannot be same month)
        if (endMonth === startMonth) {
          updatedEducation[index].endMonth = "";
        }
      }
    }

    // If isCurrent is checked, clear end year and month
    if (field === "isCurrent" && value === true) {
      updatedEducation[index].endYear = "";
      updatedEducation[index].endMonth = "";
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
          startMonth: "",
          endYear: "",
          endMonth: "",
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

  // Check if work experience entry has any field filled
  const isWorkExperienceEntryStarted = (work) => {
    return !!(
      work.startYear ||
      work.startMonth ||
      work.endYear ||
      work.endMonth ||
      work.company ||
      work.position ||
      work.isCurrent
    );
  };

  // Handle work experience changes
  const handleWorkExperienceChange = (index, field, value) => {
    const updatedWorkExperience = [...formData.workExperience];
    updatedWorkExperience[index][field] = value;

    // If start year changes and end year is before start year, clear end year and month
    if (field === "startYear" && updatedWorkExperience[index].endYear) {
      const startYear = parseInt(value);
      const endYear = parseInt(updatedWorkExperience[index].endYear);
      if (endYear < startYear) {
        updatedWorkExperience[index].endYear = "";
        updatedWorkExperience[index].endMonth = "";
      } else if (endYear === startYear && updatedWorkExperience[index].endMonth) {
        // If same year, check if end month is before start month
        const startMonth = parseInt(updatedWorkExperience[index].startMonth || "1");
        const endMonth = parseInt(updatedWorkExperience[index].endMonth);
        if (endMonth < startMonth) {
          updatedWorkExperience[index].endMonth = "";
        }
      }
    }

    // If start month changes and same year, check end month
    if (field === "startMonth" && updatedWorkExperience[index].startYear && updatedWorkExperience[index].endYear) {
      const startYear = parseInt(updatedWorkExperience[index].startYear);
      const endYear = parseInt(updatedWorkExperience[index].endYear);
      if (startYear === endYear && updatedWorkExperience[index].endMonth) {
        const startMonth = parseInt(value || "1");
        const endMonth = parseInt(updatedWorkExperience[index].endMonth);
        if (endMonth < startMonth) {
          updatedWorkExperience[index].endMonth = "";
        }
      }
    }

    // If isCurrent is checked, clear end year and month
    if (field === "isCurrent" && value === true) {
      updatedWorkExperience[index].endYear = "";
      updatedWorkExperience[index].endMonth = "";
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
          startMonth: "",
          endYear: "",
          endMonth: "",
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

    // Collect all errors first, don't return early
    const errors = {};

    // Validate phone number (required)
    if (!formData.phone || formData.phone.trim() === "") {
      errors.phone = "Telefon raqami kiritilishi shart";
    } else if (formData.phone.startsWith("+998") && !isPhoneComplete(formData.phone)) {
      errors.phone = "Telefon raqami to'liq kiritilishi shart (+998 XX XXX XX XX)";
    }

    // Validate birth date (required)
    if (!formData.birthDate || formData.birthDate.trim() === "") {
      errors.birthDate = "Tug'ilgan sana kiritilishi shart";
    }

    // Validate fullName
    const fullNameError = validateFullName(formData.fullName);
    if (fullNameError) {
      errors.fullName = fullNameError;
    }

    // Validate JShShIR
    const jshshirError = validateJShShIR(formData.jshshir);
    if (jshshirError) {
      errors.jshshir = jshshirError;
    }

    // Validate languages (all required)
    if (!formData.languages.uzbek) {
      errors.languages_uzbek = "Tilni tanlash majburiy";
    }
    if (!formData.languages.russian) {
      errors.languages_russian = "Tilni tanlash majburiy";
    }
    if (!formData.languages.english) {
      errors.languages_english = "Tilni tanlash majburiy";
    }

    // Validate expected salary
    if (!formData.expectedSalary || formData.expectedSalary.trim() === "") {
      errors.expectedSalary = "Kutayotgan oylik kiritilishi shart";
    }

    // Validate business trip ready
    if (!formData.businessTripReady || formData.businessTripReady.trim() === "") {
      errors.businessTripReady = "Xizmat safarlariga borishni tanlash majburiy";
    }

    // Validate education: institution and specialty required, and period validation
    for (let i = 0; i < formData.education.length; i++) {
      const edu = formData.education[i];
      if (edu.startYear || edu.startMonth || edu.endYear || edu.endMonth || edu.institution || edu.degree || edu.specialty) {
        if (!edu.institution || edu.institution.trim() === "") {
          errors[`education_${i}_institution`] = "Muassasa nomi kiritilishi shart";
        }
        if (!edu.specialty || edu.specialty.trim() === "") {
          errors[`education_${i}_specialty`] = "Mutaxassislik kiritilishi shart";
        }
        // Validate that start and end are not in the same month
        if (!edu.isCurrent && edu.startYear && edu.startMonth && edu.endYear && edu.endMonth) {
          const startYear = parseInt(edu.startYear);
          const endYear = parseInt(edu.endYear);
          const startMonth = parseInt(edu.startMonth);
          const endMonth = parseInt(edu.endMonth);
          if (startYear === endYear && startMonth === endMonth) {
            errors[`education_${i}_period`] = "Boshlanish va tugash oyi bir xil bo'lishi mumkin emas";
          }
        }
      }
    }

    // Validate work experience: if any field is filled, all fields required
    if (!formData.neverWorked) {
      for (let i = 0; i < formData.workExperience.length; i++) {
        const work = formData.workExperience[i];
        if (isWorkExperienceEntryStarted(work)) {
          if (!work.startYear || !work.startMonth) {
            errors[`workExperience_${i}_startDate`] = "Boshlanish sanasi kiritilishi shart";
          }
          if (!work.isCurrent && (!work.endYear || !work.endMonth)) {
            errors[`workExperience_${i}_endDate`] = "Tugash sanasi kiritilishi shart";
          }
          if (!work.company || work.company.trim() === "") {
            errors[`workExperience_${i}_company`] = "Kompaniya nomi kiritilishi shart";
          }
          if (!work.position || work.position.trim() === "") {
            errors[`workExperience_${i}_position`] = "Lavozim kiritilishi shart";
          }
        }
      }
    }

    // If there are any errors, set them all and show toast, then return
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      toast.error("Iltimos, barcha majburiy maydonlarni to'ldiring", {
        duration: 4000,
        position: "top-center",
      });
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);

    // Helper function to get last day of month
    const getLastDayOfMonth = (year, month) => {
      // month is 1-12, but Date uses 0-11, so we use month directly for next month
      const date = new Date(year, month, 0); // Day 0 gives last day of previous month
      return date.getDate();
    };

    // Helper function to convert year and month to full date
    const yearMonthToDate = (year, month, isEndDate = false) => {
      if (!year) return "";
      const yearNum = parseInt(year);
      const monthNum = month ? parseInt(month) : (isEndDate ? 12 : 1);
      
      if (isEndDate) {
        const lastDay = getLastDayOfMonth(yearNum, monthNum);
        return `${yearNum}-${String(monthNum).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
      } else {
        // Start date: first day of month
        return `${yearNum}-${String(monthNum).padStart(2, "0")}-01`;
      }
    };

    // Helper function to get current date
    const getCurrentDate = () => {
      const today = new Date();
      return today.toISOString().split("T")[0];
    };

    // Clean phone number (remove spaces)
    const cleanPhone = formData.phone ? formData.phone.replace(/\s/g, "") : "";
    
    // Filter and map graduations - only include entries with required fields
    const graduations = formData.education
      .filter((edu) => {
        // Check if entry has minimum required data
        return (
          edu.startYear &&
          edu.startMonth &&
          (edu.isCurrent || (edu.endYear && edu.endMonth)) &&
          edu.institution &&
          edu.institution.trim() !== "" &&
          edu.degree &&
          edu.degree.trim() !== "" &&
          edu.specialty &&
          edu.specialty.trim() !== ""
        );
      })
      .map((edu) => ({
        date_from: yearMonthToDate(edu.startYear, edu.startMonth, false),
        date_to: edu.isCurrent
          ? getCurrentDate()
          : yearMonthToDate(edu.endYear, edu.endMonth, true),
        university: edu.institution,
        degree: edu.degree,
        specialization: edu.specialty,
      }));

    // Filter and map employments - only include entries with required fields
    const employments = formData.neverWorked
      ? null
      : formData.workExperience
          .filter((work) => {
            // Check if entry has minimum required data
            return (
              work.startYear &&
              work.startMonth &&
              (work.isCurrent || (work.endYear && work.endMonth)) &&
              work.company &&
              work.company.trim() !== "" &&
              work.position &&
              work.position.trim() !== ""
            );
          })
          .map((work) => ({
            date_from: yearMonthToDate(work.startYear, work.startMonth, false),
            date_to: work.isCurrent
              ? getCurrentDate()
              : yearMonthToDate(work.endYear, work.endMonth, true),
            organization_name: work.company,
            position: work.position,
          }));
    
    // Prepare languages array - filter out empty languages and map to correct format
    const languagesArray = Object.entries(formData.languages)
      .filter(([_, level]) => level && level.trim() !== "") // Filter out empty languages
      .map(([language, level]) => ({
        language_name: language,
        degree: level,
      }));

    // Prepare data in JSON format (as backend expects)
    const formDataToSend = {
      job: parseInt(decodedVacancyId),
      user_id: getUserId(),
      full_name: formData.fullName,
      data_of_birth: formData.birthDate,
      phone: cleanPhone,
      jshshir: formData.jshshir,
      additional_information: formData.additionalInfo || "",
      graduations: graduations,
      employments: employments,
      languages: languagesArray,
    };

    // Add monthly_salary only if it exists
    if (formData.expectedSalary && formData.expectedSalary.trim() !== "") {
      const salaryValue = parseInt(formData.expectedSalary.replace(/\s/g, ""));
      if (!isNaN(salaryValue) && salaryValue > 0) {
        formDataToSend.monthly_salary = salaryValue;
      }
    }

    try {
      // Send to API using apiClient with JSON format
      const response = await apiClient.post("/apply-jobs/", formDataToSend, {
        headers: {
          "Content-Type": "application/json",
        },
      });

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

      // Navigate back after a short delay - check if it's a region route or department route
      setTimeout(() => {
        if (regionName) {
          navigate(`/region/${regionName}`);
        } else {
          navigate("/departments");
        }
      }, 1500);
    } catch (error) {
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
          startMonth: "",
          endYear: "",
          endMonth: "",
          isCurrent: false,
          institution: "",
          degree: "",
          specialty: "",
        },
      ],
      workExperience: [
        {
          startYear: "",
          startMonth: "",
          endYear: "",
          endMonth: "",
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
      neverWorked: false,
      convicted: false,
      convictionDetails: "",
      expectedSalary: "",
      businessTripReady: "",
      jshshir: "",
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
                onClick={() => {
                  if (regionName) {
                    navigate(`/region/${regionName}`);
                  } else {
                    navigate("/departments");
                  }
                }}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                {regionName ? "Orqaga" : t("jobs.back_to_departments")}
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
                        <span className="text-red-500 ml-1">*</span>
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
                        onBlur={(e) => {
                          const error = validateFullName(e.target.value);
                          if (error) {
                            setFieldErrors((prev) => ({
                              ...prev,
                              fullName: error,
                            }));
                          } else {
                            setFieldErrors((prev) => {
                              const newErrors = { ...prev };
                              delete newErrors.fullName;
                              return newErrors;
                            });
                          }
                        }}
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
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <Input
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) =>
                          handleInputChange("birthDate", e.target.value)
                        }
                        max={new Date().toISOString().split("T")[0]}
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
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <Input
                        type="tel"
                        placeholder="+998 XX XXX XX XX"
                        value={formData.phone}
                        onChange={(e) => {
                          let value = e.target.value;
                          const previousValue = formData.phone;
                          
                          // Format phone number with mask
                          const formatted = formatPhoneNumber(value, previousValue);
                          
                          handleInputChange("phone", formatted);
                          
                          // Clear error when user starts typing
                          if (fieldErrors.phone) {
                            setFieldErrors((prev) => {
                              const newErrors = { ...prev };
                              delete newErrors.phone;
                              return newErrors;
                            });
                          }
                        }}
                        onBlur={(e) => {
                          const phoneValue = e.target.value;
                          // Validate phone completeness if starts with +998
                          if (phoneValue && phoneValue.startsWith("+998")) {
                            if (!isPhoneComplete(phoneValue)) {
                              setFieldErrors((prev) => ({
                                ...prev,
                                phone: "Telefon raqami to'liq kiritilishi shart (+998 XX XXX XX XX)",
                              }));
                            } else {
                              // Clear error if phone is complete
                              setFieldErrors((prev) => {
                                const newErrors = { ...prev };
                                delete newErrors.phone;
                                return newErrors;
                              });
                            }
                          } else if (phoneValue && phoneValue.startsWith("+") && phoneValue.length < 4) {
                            // If user only typed + or incomplete country code
                            setFieldErrors((prev) => ({
                              ...prev,
                              phone: "Telefon raqami to'liq kiritilishi shart",
                            }));
                          } else if (phoneValue && phoneValue.trim() !== "") {
                            // Clear error for other valid formats
                            setFieldErrors((prev) => {
                              const newErrors = { ...prev };
                              delete newErrors.phone;
                              return newErrors;
                            });
                          }
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        JShShIR
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <Input
                        type="text"
                        inputMode="numeric"
                        placeholder="12345678901234"
                        value={formData.jshshir ? formatJShShIR(formData.jshshir) : ""}
                        onChange={(e) => {
                          let value = e.target.value;
                          
                          // Remove all non-digit characters
                          value = value.replace(/\D/g, "");
                          
                          // Limit to 14 digits
                          if (value.length > 14) {
                            value = value.substring(0, 14);
                          }
                          
                          handleInputChange("jshshir", value);
                        }}
                        onBlur={(e) => {
                          const error = validateJShShIR(e.target.value);
                          if (error) {
                            setFieldErrors((prev) => ({
                              ...prev,
                              jshshir: error,
                            }));
                          } else {
                            setFieldErrors((prev) => {
                              const newErrors = { ...prev };
                              delete newErrors.jshshir;
                              return newErrors;
                            });
                          }
                        }}
                        required
                      />
                      {fieldErrors.jshshir && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                          <Icon name="AlertCircle" size={16} />
                          {fieldErrors.jshshir}
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
                            <div className="grid grid-cols-2 gap-2">
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
                              <Select
                                value={edu.startMonth}
                                onChange={(value) =>
                                  handleEducationChange(index, "startMonth", value)
                                }
                                options={monthOptions}
                                placeholder="Oy"
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              {t("jobs.application.form.end_year")}
                            </label>
                            <div className="space-y-2">
                              <div className="grid grid-cols-2 gap-2">
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
                                <Select
                                  value={edu.endMonth}
                                  onChange={(value) =>
                                    handleEducationChange(index, "endMonth", value)
                                  }
                                  options={monthOptions}
                                  placeholder="Oy"
                                  disabled={edu.isCurrent}
                                  required={!edu.isCurrent}
                                />
                              </div>
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
                              <span className="text-red-500 ml-1">*</span>
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
                              <span className="text-red-500 ml-1">*</span>
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
                    {/* Never Worked Checkbox */}
                    <div className="flex items-center mb-4">
                      <Checkbox
                        id="never-worked"
                        checked={formData.neverWorked}
                        onChange={(checked) => {
                          setFormData((prev) => ({
                            ...prev,
                            neverWorked: checked,
                            // Clear work experience when checked
                            workExperience: checked
                              ? [
                                  {
                                    startYear: "",
                                    startMonth: "",
                                    endYear: "",
                                    endMonth: "",
                                    isCurrent: false,
                                    company: "",
                                    position: "",
                                  },
                                ]
                              : prev.workExperience,
                          }));
                        }}
                      />
                      <label
                        htmlFor="never-worked"
                        className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        {t("jobs.application.form.never_worked")}
                      </label>
                    </div>

                    {!formData.neverWorked && (
                      <>
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
                                <div className="grid grid-cols-2 gap-2">
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
                                    required={isWorkExperienceEntryStarted(work)}
                                  />
                                  <Select
                                    value={work.startMonth}
                                    onChange={(value) =>
                                      handleWorkExperienceChange(
                                        index,
                                        "startMonth",
                                        value
                                      )
                                    }
                                    options={monthOptions}
                                    placeholder="Oy"
                                    required={isWorkExperienceEntryStarted(work)}
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  {t("jobs.application.form.end_year")}
                                </label>
                                <div className="space-y-2">
                                  <div className="grid grid-cols-2 gap-2">
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
                                      required={!work.isCurrent && isWorkExperienceEntryStarted(work)}
                                    />
                                    <Select
                                      value={work.endMonth}
                                      onChange={(value) =>
                                        handleWorkExperienceChange(
                                          index,
                                          "endMonth",
                                          value
                                        )
                                      }
                                      options={monthOptions}
                                      placeholder="Oy"
                                      disabled={work.isCurrent}
                                      required={!work.isCurrent && isWorkExperienceEntryStarted(work)}
                                    />
                                  </div>
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
                                      {t(
                                        "jobs.application.form.currently_working"
                                      )}
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
                                  required={isWorkExperienceEntryStarted(work)}
                                />
                                {fieldErrors[
                                  `workExperience_${index}_company`
                                ] && (
                                  <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                                    <Icon name="AlertCircle" size={16} />
                                    {
                                      fieldErrors[
                                        `workExperience_${index}_company`
                                      ]
                                    }
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
                                  required={isWorkExperienceEntryStarted(work)}
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
                      </>
                    )}
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
                        <span className="text-red-500 ml-1">*</span>
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
                              required
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
                        <span className="text-red-500 ml-1">*</span>
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
                              required
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
                        <span className="text-red-500 ml-1">*</span>
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
                              required
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

                {/* Expected Salary and Business Trip Ready Section (Frontend Only) */}
                <div className="px-4 sm:px-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Expected Salary */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t("jobs.application.form.expected_salary")}
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="relative">
                        <Input
                          type="text"
                          inputMode="numeric"
                          placeholder={t(
                            "jobs.application.form.expected_salary_placeholder"
                          )}
                          value={formData.expectedSalary ? formatSalary(formData.expectedSalary) : ""}
                          onChange={(e) => {
                            let value = e.target.value;
                            
                            // Remove all non-digit characters
                            value = value.replace(/\D/g, "");
                            
                            handleInputChange("expectedSalary", value);
                          }}
                          className="pr-12"
                          required
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600 dark:text-gray-400 pointer-events-none">
                          {formData.expectedSalary ? "so'm" : ""}
                        </span>
                      </div>
                      {fieldErrors.expectedSalary && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                          <Icon name="AlertCircle" size={16} />
                          {fieldErrors.expectedSalary}
                        </p>
                      )}
                    </div>

                    {/* Business Trip Ready */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t("jobs.application.form.business_trip_ready")}
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2 sm:gap-4">
                        <label className="flex items-center gap-2 p-2 sm:p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                          <input
                            type="radio"
                            name="businessTripReady"
                            value="yes"
                            checked={formData.businessTripReady === "yes"}
                            onChange={(e) =>
                              handleInputChange(
                                "businessTripReady",
                                e.target.value
                              )
                            }
                            className="text-blue-600"
                            required
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                            {t("jobs.application.form.yes")}
                          </span>
                        </label>
                        <label className="flex items-center gap-2 p-2 sm:p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                          <input
                            type="radio"
                            name="businessTripReady"
                            value="no"
                            checked={formData.businessTripReady === "no"}
                            onChange={(e) =>
                              handleInputChange(
                                "businessTripReady",
                                e.target.value
                              )
                            }
                            className="text-blue-600"
                            required
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                            {t("jobs.application.form.no")}
                          </span>
                        </label>
                      </div>
                      {fieldErrors.businessTripReady && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                          <Icon name="AlertCircle" size={16} />
                          {fieldErrors.businessTripReady}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Conviction Section (Frontend Only) */}
                <div className="px-4 sm:px-6">
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 sm:p-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="convicted"
                        checked={formData.convicted}
                        onChange={(checked) => {
                          setFormData((prev) => ({
                            ...prev,
                            convicted: checked,
                            // Clear conviction details when unchecked
                            convictionDetails: checked
                              ? prev.convictionDetails
                              : "",
                          }));
                        }}
                      />
                      <label
                        htmlFor="convicted"
                        className="flex-1 text-sm font-semibold text-gray-800 dark:text-gray-200 cursor-pointer"
                      >
                        {t("jobs.application.form.convicted")}
                      </label>
                    </div>

                    {formData.convicted && (
                      <div className="mt-4 pl-7">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t("jobs.application.form.conviction_details")}
                        </label>
                        <textarea
                          className="w-full px-4 py-3 border-2 border-amber-300 dark:border-amber-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm transition-all"
                          rows={5}
                          placeholder={t(
                            "jobs.application.form.conviction_details_placeholder"
                          )}
                          value={formData.convictionDetails}
                          onChange={(e) =>
                            handleInputChange(
                              "convictionDetails",
                              e.target.value
                            )
                          }
                        />
                        <p className="mt-2 text-xs text-amber-700 dark:text-amber-400 flex items-center gap-1">
                          <Icon name="AlertCircle" size={14} />
                          {t("jobs.application.form.conviction_info_note")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 pb-6 px-4 sm:px-6 border-t border-gray-100 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 h-12 px-4 sm:px-6 rounded-lg font-semibold text-base sm:text-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300 flex items-center justify-center"
                  >
                    {t("jobs.application.form.back_button")}
                  </button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || (formData.phone.startsWith("+998") && !isPhoneComplete(formData.phone))}
                    className="flex-1 h-12 px-4 sm:px-6 rounded-lg font-semibold text-base sm:text-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
