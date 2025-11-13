import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import toast from "react-hot-toast";
import Navbar from "../../components/ui/Navbar";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import { vacanciesAPI, testsAPI } from "../../services/api";
import LoadingSkeleton from "../job-vacancies-browser/components/LoadingSkeleton";

const decodeBase64Url = (value) => {
  try {
    const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "="
    );
    const decoded = atob(padded);
    try {
      return decodeURIComponent(
        decoded
          .split("")
          .map((char) => "%" + char.charCodeAt(0).toString(16).padStart(2, "0"))
          .join("")
      );
    } catch (uriError) {
      return decoded;
    }
  } catch (error) {
    console.error("Failed to decode base64 url string", error);
    return null;
  }
};

const decodeJwtPayload = (token) => {
  if (!token) {
    return null;
  }

  const tokenParts = token.split(".");
  if (tokenParts.length < 2) {
    return null;
  }

  const payload = decodeBase64Url(tokenParts[1]);
  if (!payload) {
    return null;
  }

  try {
    return JSON.parse(payload);
  } catch (error) {
    console.error("Failed to parse JWT payload", error);
    return null;
  }
};

const VacancyTest = () => {
  const { test_id, test_token } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vacancy, setVacancy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes in seconds
  const [violations, setViolations] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [showViolationModal, setShowViolationModal] = useState(false);
  const [violationType, setViolationType] = useState("");
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  // Test data from backend API
  const [testData, setTestData] = useState(null);
  const [attemptId, setAttemptId] = useState(null);
  const [isDisqualified, setIsDisqualified] = useState(false);
  const [disqualificationMessage, setDisqualificationMessage] = useState("");
  const [testAlreadyCompleted, setTestAlreadyCompleted] = useState(false);

  // Use test_id from URL params, fallback to decoded token if available
  const tokenPayload = useMemo(
    () => decodeJwtPayload(test_token),
    [test_token]
  );
  const decodedTestId = tokenPayload?.test_id
    ? String(tokenPayload.test_id)
    : null;

  // Use test_id from URL as primary source
  const activeTestId = test_id || decodedTestId || "demo";
  const isFallbackTest = !test_id && !decodedTestId;

  useEffect(() => {
    if (!test_token || isFallbackTest) {
      console.warn(
        "VacancyTest: using fallback test flow due to missing or invalid token."
      );
      setError(null);
    }
  }, [test_token, isFallbackTest]);

  // Call backend API when component loads
  useEffect(() => {
    if (!test_id || !test_token) {
      console.warn("VacancyTest: Missing test_id or test_token in URL");
      setLoading(false);
      return;
    }

    const startTest = async () => {
      try {
        setLoading(true);
        const response = await testsAPI.startTest({
          testId: test_id,
          token: test_token,
        });
        console.log("Test start response:", response);

        // Store test data from API
        setTestData(response);
        setAttemptId(response.attempt_id);

        // Set time remaining from API
        if (response.remaining_seconds) {
          setTimeRemaining(response.remaining_seconds);
        }

        // Set vacancy/title from API
        setVacancy({
          id: response.id,
          title: response.title,
          description: `Test: ${response.title}`,
        });

        setLoading(false);
      } catch (apiError) {
        console.error("Error starting test session:", apiError);
        console.error(
          "API Error Details:",
          apiError.response?.data || apiError.message
        );

        // Check if test is already completed (400 error)
        if (apiError.response?.status === 400) {
          const errorData = apiError.response?.data;
          const errorMessage = errorData?.error || errorData?.message || "";

          if (
            errorMessage.includes("allaqachon yakunlagansiz") ||
            errorMessage.includes("already completed") ||
            errorMessage.includes("yakunlagan")
          ) {
            setTestAlreadyCompleted(true);
            setLoading(false);
            return;
          }
        }

        setError(
          apiError.response?.data?.error ||
            apiError.response?.data?.message ||
            "Failed to load test"
        );
        setLoading(false);
      }
    };

    startTest();
  }, [test_id, test_token]);

  // To'g'ri javoblar (Correct answers)
  const correctAnswers = {
    1: "a", // 1991 yil 1 sentyabr
    2: "b", // Milliy valyuta barqarorligini ta'minlash
    3: "c", // So'm
    4: "b", // Xodimlarni tanlash va rivojlantirish
    5: "a", // Ma'suliyatlilik va halollik
    6: "b", // Rasmiy biznes uslubida
    7: "c", // Oliy Majlisga
    8: "b", // Mehnat shartnomasi shartlariga rioya qilinishi
    9: "c", // Maxfiy joyda tartibli
    10: "b", // Xushmuomalalik va hurmat
  };

  // Check if test is blocked or already submitted
  useEffect(() => {
    if (!activeTestId) return;

    // Check if blocked
    const blockedTests = JSON.parse(
      localStorage.getItem("blockedTests") || "[]"
    );
    if (blockedTests.includes(activeTestId)) {
      setIsBlocked(true);
      setLoading(false);
      return;
    }

    // Check if already submitted
    const previousResult = localStorage.getItem(`test_result_${activeTestId}`);
    if (previousResult) {
      try {
        const result = JSON.parse(previousResult);
        setTestResult(result);
        setAlreadySubmitted(true);
        setLoading(false);
      } catch (error) {
        console.error("Error loading previous result:", error);
      }
    }
  }, [activeTestId]);

  // Load saved test state from localStorage
  useEffect(() => {
    if (!activeTestId || isBlocked) return;

    const savedState = localStorage.getItem(`test_state_${activeTestId}`);
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        setAnswers(state.answers || {});
        setTimeRemaining(state.timeRemaining || 30 * 60);
        setCurrentQuestion(state.currentQuestion || 0);
        setViolations(state.violations || 0);
        console.log("Restored test state from localStorage");
      } catch (error) {
        console.error("Error loading test state:", error);
      }
    }
  }, [activeTestId, isBlocked]);

  // Save test state to localStorage
  useEffect(() => {
    if (!activeTestId || isBlocked) return;

    const state = {
      answers,
      timeRemaining,
      currentQuestion,
      violations,
      lastSaved: new Date().toISOString(),
    };

    localStorage.setItem(`test_state_${activeTestId}`, JSON.stringify(state));
  }, [
    answers,
    timeRemaining,
    currentQuestion,
    violations,
    activeTestId,
    isBlocked,
  ]);

  // Get max violations from API or default to 5
  const maxViolations = testData?.max_violations || 5;

  // Handle violations - Connected to backend (useCallback to avoid closure issues)
  const handleViolation = useCallback(
    async (type) => {
      if (!test_token || !attemptId) {
        console.warn("Cannot report violation: missing token or attempt_id");
        return;
      }

      console.log("Violation detected:", type, "Sending to backend...");

      try {
        const response = await testsAPI.reportViolation({
          token: test_token,
          attemptId: attemptId,
          violationType: type,
        });

        console.log("Violation response:", response);

        // Check if disqualified (403 response)
        if (response.disqualified) {
          console.error("TESTDAN CHETLASHTIRILDI:", response);
          setIsDisqualified(true);
          setDisqualificationMessage(
            response.message || "Siz testdan chetlashtirildingiz"
          );
          setIsBlocked(true);

          // Block the test in localStorage
          const blockedTests = JSON.parse(
            localStorage.getItem("blockedTests") || "[]"
          );
          if (!blockedTests.includes(activeTestId)) {
            blockedTests.push(activeTestId);
            localStorage.setItem("blockedTests", JSON.stringify(blockedTests));
          }
          return;
        }

        // Normal warning response
        if (response.warning) {
          // Update violations from backend
          setViolations(response.violations || 0);
          setViolationType(type);

          // Update max_violations if provided in response
          if (response.max_violations && testData) {
            setTestData({
              ...testData,
              max_violations: response.max_violations,
            });
          }

          // Show violation modal
          setShowViolationModal(true);
        }
      } catch (error) {
        console.error("Error reporting violation to backend:", error);
        // Fallback: still show violation modal even if API fails
        setViolationType(type);
        setShowViolationModal(true);
      }
    },
    [test_token, attemptId, activeTestId, testData]
  );

  // Prevent page refresh/close
  useEffect(() => {
    if (isBlocked) return;

    const handleBeforeUnload = (e) => {
      // Just show warning, don't count as violation
      // (violation will be counted only if user actually leaves)
      e.preventDefault();
      e.returnValue = t("test.security.page_leave_warning");
      return t("test.security.page_leave_warning");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isBlocked, t]);

  // Transform backend questions to component format
  const testQuestions = useMemo(() => {
    // If we have test data from API, use it
    if (testData && testData.questions && testData.questions.length > 0) {
      return testData.questions.map((q) => ({
        id: q.id,
        question: q.text,
        options: q.choices.map((choice, index) => ({
          id: String(choice.id), // Use choice ID as string
          text: choice.text,
          // Add letter label for display (a, b, c, d...)
          label: String.fromCharCode(97 + index), // 97 is 'a' in ASCII
        })),
      }));
    }

    // Fallback to hardcoded questions if API data not available
    return [
      {
        id: 1,
        question: t("test.questions.q1.question"),
        options: [
          { id: "a", text: t("test.questions.q1.a") },
          { id: "b", text: t("test.questions.q1.b") },
          { id: "c", text: t("test.questions.q1.c") },
          { id: "d", text: t("test.questions.q1.d") },
        ],
      },
      {
        id: 2,
        question: t("test.questions.q2.question"),
        options: [
          { id: "a", text: t("test.questions.q2.a") },
          { id: "b", text: t("test.questions.q2.b") },
          { id: "c", text: t("test.questions.q2.c") },
          { id: "d", text: t("test.questions.q2.d") },
        ],
      },
      {
        id: 3,
        question: t("test.questions.q3.question"),
        options: [
          { id: "a", text: t("test.questions.q3.a") },
          { id: "b", text: t("test.questions.q3.b") },
          { id: "c", text: t("test.questions.q3.c") },
          { id: "d", text: t("test.questions.q3.d") },
        ],
      },
      {
        id: 4,
        question: t("test.questions.q4.question"),
        options: [
          { id: "a", text: t("test.questions.q4.a") },
          { id: "b", text: t("test.questions.q4.b") },
          { id: "c", text: t("test.questions.q4.c") },
          { id: "d", text: t("test.questions.q4.d") },
        ],
      },
      {
        id: 5,
        question: t("test.questions.q5.question"),
        options: [
          { id: "a", text: t("test.questions.q5.a") },
          { id: "b", text: t("test.questions.q5.b") },
          { id: "c", text: t("test.questions.q5.c") },
          { id: "d", text: t("test.questions.q5.d") },
        ],
      },
      {
        id: 6,
        question: t("test.questions.q6.question"),
        options: [
          { id: "a", text: t("test.questions.q6.a") },
          { id: "b", text: t("test.questions.q6.b") },
          { id: "c", text: t("test.questions.q6.c") },
          { id: "d", text: t("test.questions.q6.d") },
        ],
      },
      {
        id: 7,
        question: t("test.questions.q7.question"),
        options: [
          { id: "a", text: t("test.questions.q7.a") },
          { id: "b", text: t("test.questions.q7.b") },
          { id: "c", text: t("test.questions.q7.c") },
          { id: "d", text: t("test.questions.q7.d") },
        ],
      },
      {
        id: 8,
        question: t("test.questions.q8.question"),
        options: [
          { id: "a", text: t("test.questions.q8.a") },
          { id: "b", text: t("test.questions.q8.b") },
          { id: "c", text: t("test.questions.q8.c") },
          { id: "d", text: t("test.questions.q8.d") },
        ],
      },
      {
        id: 9,
        question: t("test.questions.q9.question"),
        options: [
          { id: "a", text: t("test.questions.q9.a") },
          { id: "b", text: t("test.questions.q9.b") },
          { id: "c", text: t("test.questions.q9.c") },
          { id: "d", text: t("test.questions.q9.d") },
        ],
      },
      {
        id: 10,
        question: t("test.questions.q10.question"),
        options: [
          { id: "a", text: t("test.questions.q10.a") },
          { id: "b", text: t("test.questions.q10.b") },
          { id: "c", text: t("test.questions.q10.c") },
          { id: "d", text: t("test.questions.q10.d") },
        ],
      },
    ];
  }, [testData, t]);

  // Fetch vacancy data
  useEffect(() => {
    const fetchVacancyData = async () => {
      if (!decodedTestId) {
        setVacancy({
          id: activeTestId,
          title: "Umumiy bilim testi",
          description:
            "Markaziy Bank mutaxassisligi bo'yicha umumiy bilim testi",
        });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Try to fetch vacancy data from API
        try {
          const vacancyData = await vacanciesAPI.getVacancyById(decodedTestId);
          setVacancy(vacancyData);
        } catch (apiError) {
          // If API fails, use default test data
          console.log("Using default test data");
          setVacancy({
            id: activeTestId,
            title: "Umumiy bilim testi",
            description:
              "Markaziy Bank mutaxassisligi bo'yicha umumiy bilim testi",
          });
        }
      } catch (error) {
        console.error("Error fetching vacancy:", error);
        // Use default data even on error
        setVacancy({
          id: activeTestId,
          title: "Umumiy bilim testi",
          description:
            "Markaziy Bank mutaxassisligi bo'yicha umumiy bilim testi",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVacancyData();
  }, [decodedTestId, activeTestId]);

  // Security: Prevent cheating
  useEffect(() => {
    if (isBlocked) return;

    // Disable right-click
    const handleContextMenu = (e) => {
      e.preventDefault();
      toast.error(t("test.security.no_right_click"), {
        duration: 2000,
        position: "top-center",
      });
      return false;
    };

    // Disable keyboard shortcuts for DevTools, PrintScreen, Copy, etc.
    const handleKeyDown = (e) => {
      // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U (DevTools) - DISABLED
      // if (
      //   e.key === "F12" ||
      //   (e.ctrlKey &&
      //     e.shiftKey &&
      //     (e.key === "I" || e.key === "J" || e.key === "C")) ||
      //   (e.ctrlKey && e.key === "U")
      // ) {
      //   e.preventDefault();
      //   toast.error(t("test.security.no_devtools"), {
      //     duration: 2000,
      //     position: "top-center",
      //   });
      //   return false;
      // }

      // PrintScreen - Report to backend
      if (e.key === "PrintScreen") {
        e.preventDefault();
        handleViolation("screenshot");
        return false;
      }

      // Ctrl+C, Ctrl+V, Ctrl+X (Copy, Paste, Cut)
      if (e.ctrlKey && (e.key === "c" || e.key === "v" || e.key === "x")) {
        e.preventDefault();
        toast.error(t("test.security.no_copy_paste"), {
          duration: 2000,
          position: "top-center",
        });
        return false;
      }

      // Ctrl+P (Print)
      if (e.ctrlKey && e.key === "p") {
        e.preventDefault();
        toast.error(t("test.security.no_print"), {
          duration: 2000,
          position: "top-center",
        });
        return false;
      }

      // Ctrl+S (Save)
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        return false;
      }
    };

    // Disable copy event
    const handleCopy = (e) => {
      e.preventDefault();
      toast.error(t("test.security.no_copy_paste"), {
        duration: 2000,
        position: "top-center",
      });
      return false;
    };

    // Disable paste event
    const handlePaste = (e) => {
      e.preventDefault();
      return false;
    };

    // Disable cut event
    const handleCut = (e) => {
      e.preventDefault();
      return false;
    };

    // Disable drag and drop
    const handleDragStart = (e) => {
      e.preventDefault();
      return false;
    };

    // Detect tab switch / window blur - Report to backend
    const handleBlur = () => {
      console.log("Window blur detected - reporting violation");
      handleViolation("tab_switch");
    };

    // Detect page visibility change (more reliable than blur)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log("Page hidden (tab switched) - reporting violation");
        handleViolation("tab_switch");
      }
    };

    // Detect fullscreen exit
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        toast.warning(t("test.security.fullscreen_exit_warning"), {
          duration: 3000,
          position: "top-center",
        });
      }
    };

    // Detect DevTools opening (basic detection) - DISABLED
    // const detectDevTools = () => {
    //   const threshold = 160;
    //   const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    //   const heightThreshold =
    //     window.outerHeight - window.innerHeight > threshold;

    //   if (widthThreshold || heightThreshold) {
    //     toast.error(t("test.security.devtools_detected"), {
    //       duration: 3000,
    //       position: "top-center",
    //     });
    //   }
    // };

    // Check DevTools every 1 second - DISABLED
    // const devToolsInterval = setInterval(detectDevTools, 1000);

    // Add event listeners
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);
    document.addEventListener("cut", handleCut);
    document.addEventListener("dragstart", handleDragStart);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
      document.removeEventListener("cut", handleCut);
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      // clearInterval(devToolsInterval); // DISABLED
    };
  }, [t, isBlocked, violations, handleViolation]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  // Format time to MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Handle answer selection
  const handleAnswerSelect = (questionId, optionId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  // Navigate to next question
  const handleNext = () => {
    if (currentQuestion < testQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  // Navigate to previous question
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  // Submit test
  const handleSubmit = async () => {
    // Check if all questions are answered
    const unansweredQuestions = testQuestions.filter(
      (q) => !answers[q.id]
    ).length;

    if (unansweredQuestions > 0) {
      const confirmSubmit = window.confirm(
        t("test.unanswered_warning", { count: unansweredQuestions })
      );
      if (!confirmSubmit) return;
    }

    setIsSubmitting(true);

    try {
      // Calculate results
      let correctCount = 0;
      testQuestions.forEach((q) => {
        if (answers[q.id] === correctAnswers[q.id]) {
          correctCount++;
        }
      });

      const totalQuestions = testQuestions.length;
      const percentage = (correctCount / totalQuestions) * 100;
      const isPassed = percentage >= 50;

      const testResults = {
        testId: activeTestId,
        answers: answers,
        correctAnswers: correctAnswers,
        correctCount: correctCount,
        totalQuestions: totalQuestions,
        percentage: percentage.toFixed(1),
        isPassed: isPassed,
        submittedAt: new Date().toISOString(),
        timeSpent: 30 * 60 - timeRemaining,
      };

      console.log("Test Results:", testResults);

      // Save to localStorage
      localStorage.setItem(
        `test_result_${activeTestId}`,
        JSON.stringify(testResults)
      );

      // Clear test state from localStorage
      localStorage.removeItem(`test_state_${activeTestId}`);

      // Show result modal
      setTestResult(testResults);
      setShowResultModal(true);
    } catch (error) {
      console.error("Test submission error:", error);
      toast.error(t("test.error_message"), {
        duration: 5000,
        position: "top-center",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close modal and navigate home
  const handleCloseResultModal = () => {
    setShowResultModal(false);
    navigate("/");
  };

  const handleBack = () => {
    const confirmLeave = window.confirm(t("test.leave_warning"));
    if (confirmLeave) {
      navigate("/");
    }
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

  // Show already submitted state
  if (alreadySubmitted && testResult) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl border-t-4 border-blue-600 dark:border-blue-700 overflow-hidden">
              {/* Official Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 px-8 py-8">
                <div className="flex items-center space-x-4">
                  <div className="bg-white/20 p-3 rounded-lg">
                    <Icon name="FileCheck" size={40} className="text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white uppercase tracking-wide">
                      {t("test.already_submitted.title")}
                    </h1>
                    <p className="text-blue-100 text-sm mt-1">
                      {t("test.already_submitted.subtitle")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="px-8 py-8 space-y-6">
                <div className="bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-600 p-5">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {t("test.already_submitted.description")}
                  </p>
                </div>

                {/* Previous Result */}
                <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
                  <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide border-b border-gray-300 dark:border-gray-600 pb-2">
                    {t("test.already_submitted.previous_result")}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {t("test.result.your_score")}:
                      </span>
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {testResult.percentage}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {t("test.result.correct_answers")}:
                      </span>
                      <span className="text-base font-semibold text-gray-900 dark:text-white">
                        {testResult.correctCount} / {testResult.totalQuestions}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {t("test.already_submitted.status")}:
                      </span>
                      <span
                        className={`px-4 py-1 rounded-md font-bold text-sm ${
                          testResult.isPassed
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                            : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                        }`}
                      >
                        {testResult.isPassed
                          ? t("test.already_submitted.passed")
                          : t("test.already_submitted.failed")}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/")}
                  className="w-full py-3.5 px-6 rounded-md font-semibold text-base bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white transition-colors uppercase tracking-wide"
                >
                  {t("test.security.go_home")}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Show blocked state (including disqualification)
  if (isBlocked) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl border-t-4 border-red-600 dark:border-red-700 overflow-hidden">
              {/* Official Header */}
              <div className="bg-gradient-to-r from-red-600 to-red-700 dark:from-red-700 dark:to-red-800 px-8 py-8">
                <div className="flex items-center space-x-4">
                  <div className="bg-white/20 p-3 rounded-lg">
                    <Icon name="ShieldOff" size={40} className="text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white uppercase tracking-wide">
                      {isDisqualified
                        ? "Testdan chetlashtirildi"
                        : t("test.security.blocked_title")}
                    </h1>
                    <p className="text-red-100 text-sm mt-1">
                      {isDisqualified
                        ? "Siz testdan chetlashtirildingiz"
                        : t("test.security.blocked_subtitle")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="px-8 py-8 space-y-6">
                <div className="bg-red-50 dark:bg-red-900/10 border-l-4 border-red-600 p-5">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                    {isDisqualified
                      ? disqualificationMessage ||
                        "Siz testdan chetlashtirildingiz"
                      : t("test.security.blocked_description")}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6 border-2 border-red-600 dark:border-red-700">
                  <div className="flex items-start space-x-3">
                    <Icon
                      name="AlertCircle"
                      size={24}
                      className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                        {isDisqualified
                          ? "Chetlashtirish sababi"
                          : t("test.security.blocked_reason_title")}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {isDisqualified
                          ? `Qoidabuzarliklar soni: ${violations}/${maxViolations}`
                          : t("test.security.blocked_reason")}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/")}
                  className="w-full py-3.5 px-6 rounded-md font-semibold text-base bg-gray-800 hover:bg-gray-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white transition-colors uppercase tracking-wide"
                >
                  {t("test.security.go_home")}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Show test already completed state
  if (testAlreadyCompleted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl border-t-4 border-orange-600 dark:border-orange-700 overflow-hidden">
              {/* Official Header */}
              <div className="bg-gradient-to-r from-orange-600 to-orange-700 dark:from-orange-700 dark:to-orange-800 px-8 py-8">
                <div className="flex items-center space-x-4">
                  <div className="bg-white/20 p-3 rounded-lg">
                    <Icon name="FileCheck" size={40} className="text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white uppercase tracking-wide">
                      Test allaqachon yakunlangan
                    </h1>
                    <p className="text-orange-100 text-sm mt-1">
                      Siz bu testni allaqachon yakunlagansiz
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="px-8 py-8 space-y-6">
                <div className="bg-orange-50 dark:bg-orange-900/10 border-l-4 border-orange-600 p-5">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Siz bu testni allaqachon yakunlagansiz. Har bir test faqat
                    bir marta topshirilishi mumkin.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
                  <div className="flex items-start space-x-3">
                    <Icon
                      name="AlertCircle"
                      size={24}
                      className="text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                        Ma'lumot
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Agar siz test natijalaringizni ko'rmoqchi bo'lsangiz,
                        iltimos boshqa testni tanlang yoki bosh sahifaga
                        qayting.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/")}
                  className="w-full py-3.5 px-6 rounded-md font-semibold text-base bg-orange-600 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600 text-white transition-colors uppercase tracking-wide"
                >
                  Bosh sahifaga qaytish
                </button>
              </div>
            </div>
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
                {t("test.error_loading")}
              </h1>
              <p className="text-muted-foreground mb-6">
                {error || t("test.vacancy_not_found")}
              </p>
              <button
                onClick={() => navigate("/")}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                {t("home.title")}
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const question = testQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / testQuestions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  // Developer functions (for testing)
  const handleClearBlockedTests = () => {
    localStorage.removeItem("blockedTests");
    localStorage.removeItem(`test_state_${activeTestId}`);
    localStorage.removeItem(`test_result_${activeTestId}`);
    setIsBlocked(false);
    setViolations(0);
    toast.success("Blocked tests cleared!", {
      duration: 2000,
      position: "top-center",
    });
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background select-none">
      <Helmet>
        <title>{t("test.title")} - Central Bank</title>
        <meta name="description" content={t("test.title")} />
        <style>{`
          body {
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
          }
          * {
            user-select: none !important;
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
          }
        `}</style>
      </Helmet>
      <Navbar />

      {/* Developer Test Controls - Fixed bottom left */}
      <div className="fixed bottom-4 left-4 z-50 space-y-2">
        <button
          onClick={handleClearBlockedTests}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg shadow-lg text-xs font-semibold transition-colors flex items-center space-x-2"
        >
          <Icon name="Trash2" size={14} />
          <span>Clear Blocked Tests</span>
        </button>
      </div>

      {/* Violation Counter - Fixed bottom right */}
      {!isBlocked && (
        <div className="fixed bottom-4 right-4 z-50">
          <div
            className={`px-4 py-3 rounded-lg shadow-lg border-2 transition-all ${
              violations === 0
                ? "bg-green-50 dark:bg-green-900/20 border-green-500 dark:border-green-700"
                : violations <= 2
                ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500 dark:border-yellow-700"
                : violations <= 3
                ? "bg-orange-50 dark:bg-orange-900/20 border-orange-500 dark:border-orange-700"
                : "bg-red-50 dark:bg-red-900/20 border-red-500 dark:border-red-700"
            }`}
          >
            <div className="flex items-center space-x-2">
              <Icon
                name={violations === 0 ? "Shield" : "AlertTriangle"}
                size={20}
                className={
                  violations === 0
                    ? "text-green-600 dark:text-green-400"
                    : violations <= 2
                    ? "text-yellow-600 dark:text-yellow-400"
                    : violations <= 3
                    ? "text-orange-600 dark:text-orange-400"
                    : "text-red-600 dark:text-red-400"
                }
              />
              <div>
                <div className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                  Qoidabuzarlik
                </div>
                <div
                  className={`text-lg font-bold ${
                    violations === 0
                      ? "text-green-600 dark:text-green-400"
                      : violations <= Math.floor(maxViolations * 0.4)
                      ? "text-yellow-600 dark:text-yellow-400"
                      : violations <= Math.floor(maxViolations * 0.6)
                      ? "text-orange-600 dark:text-orange-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {violations}/{maxViolations}
                </div>
              </div>
            </div>
            {violations > 0 && (
              <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                {maxViolations - violations} ta imkoniyat qoldi
              </div>
            )}
          </div>
        </div>
      )}
      <main className="pt-20 pb-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={handleBack}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <Icon name="ArrowLeft" size={16} />
                <span>{t("test.back_button")}</span>
              </button>

              {/* Timer */}
              <div
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  timeRemaining < 5 * 60
                    ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                    : "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                }`}
              >
                <Icon name="Clock" size={20} />
                <span className="font-mono font-bold text-lg">
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>

            {/* Test Info */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-4">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                {t("test.title")}
              </h1>
              <p className="text-blue-600 dark:text-blue-400 font-medium">
                {vacancy?.title}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("test.progress")}: {currentQuestion + 1} /{" "}
                {testQuestions.length}
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("test.answered")}: {answeredCount} / {testQuestions.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-slate-700 dark:to-slate-600 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t("test.question")} {currentQuestion + 1}
              </h2>
            </div>

            <div className="p-6">
              <p className="text-lg text-gray-900 dark:text-white mb-6 leading-relaxed">
                {question.question}
              </p>

              {/* Options */}
              <div className="space-y-3">
                {question.options.map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      answers[question.id] === option.id
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option.id}
                      checked={answers[question.id] === option.id}
                      onChange={() =>
                        handleAnswerSelect(question.id, option.id)
                      }
                      className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-3 flex-1 text-gray-900 dark:text-white">
                      <span className="font-medium mr-2">
                        {(option.label || option.id).toUpperCase()})
                      </span>
                      {option.text}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                variant="outline"
                className="flex-1"
              >
                <Icon name="ChevronLeft" size={16} className="mr-2" />
                {t("test.previous")}
              </Button>

              {currentQuestion < testQuestions.length - 1 ? (
                <Button onClick={handleNext} className="flex-1">
                  {t("test.next")}
                  <Icon name="ChevronRight" size={16} className="ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{t("test.submitting")}</span>
                    </div>
                  ) : (
                    <>
                      <Icon name="CheckCircle" size={16} className="mr-2" />
                      {t("test.submit")}
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Question Navigator */}
          <div className="mt-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              {t("test.question_navigator")}
            </h3>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {testQuestions.map((q, index) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestion(index)}
                  className={`h-10 w-10 rounded-lg font-medium transition-all ${
                    index === currentQuestion
                      ? "bg-blue-600 text-white"
                      : answers[q.id]
                      ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-2 border-green-600"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Violation Warning Modal */}
      {showViolationModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-lg w-full overflow-hidden">
            {/* Official Header */}
            <div className="bg-gray-800 dark:bg-gray-900 px-6 py-5">
              <div className="flex items-center justify-center space-x-3">
                <Icon name="AlertTriangle" size={28} className="text-red-500" />
                <div className="text-left">
                  <h2 className="text-lg font-bold text-red-500 uppercase tracking-wide">
                    {t("test.violation_modal.title")}
                  </h2>
                  <p className="text-red-300 text-xs mt-0.5">
                    {t("test.violation_modal.official_warning")}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-6 space-y-4">
              {/* Violation Type */}
              <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
                  {t("test.violation_modal.violation_type")}
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {violationType === "screenshot" &&
                    t("test.violation_modal.screenshot_detected")}
                  {violationType === "tab_switch" &&
                    t("test.violation_modal.tab_switch_detected")}
                  {violationType === "page_leave" &&
                    t("test.violation_modal.page_leave_detected")}
                </p>
              </div>

              {/* Violation Count - Updated from backend */}
              <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    {t("test.violation_modal.current_violations")}
                  </span>
                  <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    {violations}/{maxViolations}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-gray-600 dark:bg-gray-400 h-2 rounded-full transition-all"
                    style={{ width: `${(violations / maxViolations) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                  {maxViolations - violations > 0
                    ? `${maxViolations - violations} ta imkoniyat qoldi`
                    : "Qoidabuzarliklar limitiga yetdingiz"}
                </p>
              </div>

              {/* Official Warning */}
              <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Icon
                    name="AlertCircle"
                    size={18}
                    className="text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5"
                  />
                  <p className="text-xs text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                    {t("test.violation_modal.warning_message")}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowViolationModal(false)}
                className="w-full py-3 px-6 rounded-lg font-semibold text-sm bg-gray-700 hover:bg-gray-800 dark:bg-slate-600 dark:hover:bg-slate-500 text-white transition-colors uppercase tracking-wide"
              >
                {t("test.violation_modal.understood")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Result Modal */}
      {showResultModal && testResult && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            {/* Header */}
            <div
              className={`px-6 py-8 ${
                testResult.isPassed
                  ? "bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30"
                  : "bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-900/30 dark:to-rose-900/30"
              }`}
            >
              <div className="text-center">
                <Icon
                  name={testResult.isPassed ? "CheckCircle" : "XCircle"}
                  size={64}
                  className={`mx-auto mb-4 ${
                    testResult.isPassed
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                />
                <h2
                  className={`text-2xl font-bold mb-2 ${
                    testResult.isPassed
                      ? "text-green-800 dark:text-green-300"
                      : "text-red-800 dark:text-red-300"
                  }`}
                >
                  {testResult.isPassed
                    ? t("test.result.passed_title")
                    : t("test.result.failed_title")}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {testResult.isPassed
                    ? t("test.result.passed_message")
                    : t("test.result.failed_message")}
                </p>
              </div>
            </div>

            {/* Results */}
            <div className="px-6 py-6 space-y-4">
              {/* Score Display */}
              <div className="text-center mb-6">
                <div className="inline-flex items-baseline space-x-2">
                  <span className="text-5xl font-bold text-gray-900 dark:text-white">
                    {testResult.percentage}%
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {t("test.result.your_score")}
                </p>
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t("test.result.correct_answers")}
                  </span>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">
                    {testResult.correctCount} / {testResult.totalQuestions}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t("test.result.wrong_answers")}
                  </span>
                  <span className="text-lg font-bold text-red-600 dark:text-red-400">
                    {testResult.totalQuestions - testResult.correctCount}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t("test.result.time_spent")}
                  </span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {Math.floor(testResult.timeSpent / 60)}{" "}
                    {t("test.result.minutes")}
                  </span>
                </div>
              </div>

              {/* Pass/Fail Info */}
              <div
                className={`mt-6 p-4 rounded-lg border-2 ${
                  testResult.isPassed
                    ? "bg-green-50 dark:bg-green-900/20 border-green-500 dark:border-green-700"
                    : "bg-red-50 dark:bg-red-900/20 border-red-500 dark:border-red-700"
                }`}
              >
                <p
                  className={`text-sm font-medium ${
                    testResult.isPassed
                      ? "text-green-800 dark:text-green-300"
                      : "text-red-800 dark:text-red-300"
                  }`}
                >
                  {testResult.isPassed
                    ? t("test.result.pass_info")
                    : t("test.result.fail_info")}
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={handleCloseResultModal}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-colors mt-6 ${
                  testResult.isPassed
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {t("test.result.go_home")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VacancyTest;
