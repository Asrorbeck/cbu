import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
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
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showDevToolsModal, setShowDevToolsModal] = useState(false);
  const [devToolsDetected, setDevToolsDetected] = useState(false);
  const [showScreenshotModal, setShowScreenshotModal] = useState(false);
  // Test data from backend API
  const [testData, setTestData] = useState(null);
  const [attemptId, setAttemptId] = useState(null);
  const [isDisqualified, setIsDisqualified] = useState(false);
  const [disqualificationMessage, setDisqualificationMessage] = useState("");
  const [testAlreadyCompleted, setTestAlreadyCompleted] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null); // For status messages like "Vaqt tugadi"
  const [statusType, setStatusType] = useState(null); // "time_up", "already_completed", "error", etc.
  const [testSubmitted, setTestSubmitted] = useState(false); // Track if test is submitted to disable security checks
  
  // Refs for timer management
  const timerIntervalRef = useRef(null);
  const startTimeRef = useRef(null); // Store when timer started
  const initialTimeRef = useRef(null); // Store initial time from backend
  const pageLoadTimeRef = useRef(null); // Store when page loaded to avoid false positives

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

  // Store page load time to avoid false positives
  useEffect(() => {
    pageLoadTimeRef.current = Date.now();
  }, []);

  // Call backend API when component loads
  useEffect(() => {
    // If no test_id or test_token, use fallback demo test
    if (!test_id || !test_token) {
      console.warn("VacancyTest: Missing test_id or test_token in URL - using fallback demo test");
      
      // Set default test data for demo
      setVacancy({
        id: "demo",
        title: "Umumiy bilim testi",
        description: "Markaziy Bank mutaxassisligi bo'yicha umumiy bilim testi",
      });
      
      // Set default time (30 minutes)
      const defaultTime = 30 * 60;
      setTimeRemaining(defaultTime);
      initialTimeRef.current = defaultTime;
      startTimeRef.current = Date.now();
      
      // Set demo test data
      setTestData({
        id: "demo",
        title: "Umumiy bilim testi",
        questions: [], // Will use hardcoded questions from testQuestions
        max_violations: 5,
        passing_score: 60,
      });
      
      setAttemptId("demo-attempt");
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
          // Store initial time and start time for timer calculation
          initialTimeRef.current = response.remaining_seconds;
          startTimeRef.current = Date.now();
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

        // Check for specific status messages
        const errorData = apiError.response?.data;
        const errorMessage = errorData?.error || errorData?.message || "";
        const status = errorData?.status || "";

        // Check if test is already completed
        if (
          apiError.response?.status === 400 &&
          (errorMessage.includes("allaqachon yakunlagansiz") ||
            errorMessage.includes("already completed") ||
            errorMessage.includes("yakunlagan"))
        ) {
          setTestAlreadyCompleted(true);
          setLoading(false);
          return;
        }

        // Check for "Vaqt tugadi" / "Time is up" status
        if (
          errorMessage.includes("Vaqt tugadi") ||
          errorMessage.includes("Time is up") ||
          errorMessage.includes("vaqt tugadi") ||
          errorMessage.includes("time is up") ||
          status.includes("Vaqt tugadi") ||
          status.includes("Time is up")
        ) {
          setStatusMessage(errorMessage || status || "Vaqt tugadi");
          setStatusType("time_up");
          setLoading(false);
          return;
        }

        // Check for other status messages
        if (
          status ||
          (errorMessage &&
            !errorMessage.includes("error") &&
            !errorMessage.includes("xatolik"))
        ) {
          setStatusMessage(errorMessage || status);
          setStatusType("status");
          setLoading(false);
          return;
        }

        // Generic error
        setError(
          errorMessage ||
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
        const savedTime = state.timeRemaining || 30 * 60;
        setTimeRemaining(savedTime);
        setCurrentQuestion(state.currentQuestion || 0);
        setViolations(state.violations || 0);
        
        // Update timer refs if we have saved time and last saved timestamp
        // This ensures timer continues from where it left off
        if (savedTime > 0 && state.lastSaved) {
          const savedDate = new Date(state.lastSaved);
          const now = Date.now();
          const elapsedSinceSave = Math.floor((now - savedDate.getTime()) / 1000);
          // Calculate what the initial time was when saved
          const calculatedInitial = savedTime + elapsedSinceSave;
          initialTimeRef.current = calculatedInitial;
          // Set start time to account for elapsed time since save
          startTimeRef.current = savedDate.getTime();
        } else if (savedTime > 0) {
          // If no lastSaved timestamp, just use saved time as initial
          initialTimeRef.current = savedTime;
          startTimeRef.current = Date.now();
        }
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

  // Apply blur when screenshot modal or devtools modal is open - ONLY to main content, NOT body
  // BUT NOT when error or status message is shown OR test is already submitted
  useEffect(() => {
    const mainElement = document.querySelector("main");
    // Don't apply blur if error or status message is shown OR test is already submitted
    if (error || statusMessage || testAlreadyCompleted || alreadySubmitted || showResultModal || testSubmitted) {
      // Remove blur when error/status is shown or test is submitted
      if (mainElement) {
        mainElement.style.filter = "";
        mainElement.style.transition = "";
        mainElement.style.pointerEvents = "";
        mainElement.style.opacity = "";
      }
      document.body.style.filter = "";
      document.body.style.transition = "";
      return;
    }

    // Apply blur if screenshot modal OR devtools modal is open (only if test is not submitted)
    if (showScreenshotModal || (showDevToolsModal && devToolsDetected)) {
      // Blur is already applied in keydown handler (synchronous) for screenshot
      // This is just a backup to ensure blur is applied
      if (mainElement && !mainElement.style.filter.includes("blur")) {
        mainElement.style.filter = "blur(15px)";
        mainElement.style.transition = "none";
        mainElement.style.pointerEvents = "none";
        mainElement.style.opacity = "0.3";
      }
    } else {
      // Remove blur when modals close
      if (mainElement) {
        mainElement.style.filter = "";
        mainElement.style.transition = "";
        mainElement.style.pointerEvents = "";
        mainElement.style.opacity = "";
      }
      document.body.style.filter = "";
      document.body.style.transition = "";
    }

    return () => {
      // Cleanup on unmount
      if (mainElement) {
        mainElement.style.filter = "";
        mainElement.style.transition = "";
        mainElement.style.pointerEvents = "";
        mainElement.style.opacity = "";
      }
      document.body.style.filter = "";
      document.body.style.transition = "";
    };
  }, [showScreenshotModal, showDevToolsModal, devToolsDetected, error, statusMessage, testAlreadyCompleted, alreadySubmitted, showResultModal, testSubmitted]);

  // Handle violations - DISABLED (no API calls, no modals)
  const handleViolation = useCallback(async (type) => {
    // Violation handling is completely disabled
    // No API calls, no modals, no backend communication
    return;
  }, []);

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
    // Disable all security checks if test is submitted OR still loading
    if (isBlocked || testSubmitted || loading) return;

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
      // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C (DevTools) - ACTIVE
      if (
        e.key === "F12" ||
        (e.ctrlKey &&
          e.shiftKey &&
          (e.key === "I" || e.key === "J" || e.key === "C")) ||
        (e.ctrlKey && e.key === "U")
      ) {
        e.preventDefault();
        e.stopPropagation();
        toast.error(t("test.security.no_devtools"), {
          duration: 2000,
          position: "top-center",
        });
        return false;
      }

      // PrintScreen - Apply blur IMMEDIATELY to DOM, then show modal
      // BUT NOT if test is already submitted
      if (e.key === "PrintScreen" || e.keyCode === 44) {
        // Don't show modal if test is submitted
        if (testSubmitted || alreadySubmitted || showResultModal) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        // Apply blur IMMEDIATELY to DOM (synchronous, before screenshot)
        const mainElement = document.querySelector("main");
        if (mainElement) {
          mainElement.style.filter = "blur(15px)";
          mainElement.style.transition = "none";
          mainElement.style.pointerEvents = "none";
          mainElement.style.opacity = "0.3";
        }
        // Show modal immediately
        setShowScreenshotModal(true);
        return false;
      }

      // Win key detection - track for Win+Shift+S
      if (
        e.metaKey ||
        e.key === "Meta" ||
        e.keyCode === 91 ||
        e.keyCode === 92
      ) {
        // Store that Win key is pressed
        window.winKeyPressed = true;
        setTimeout(() => {
          window.winKeyPressed = false;
        }, 1000);
      }

      // Win+Shift+S (Windows Snipping Tool) - Apply blur IMMEDIATELY to DOM
      // BUT NOT if error or status message is shown OR test is submitted
      if (
        (window.winKeyPressed ||
          e.metaKey ||
          e.key === "Meta" ||
          e.keyCode === 91 ||
          e.keyCode === 92) &&
        e.shiftKey &&
        (e.key === "s" || e.key === "S" || e.keyCode === 83)
      ) {
        // Don't apply blur if error or status message is shown OR test is submitted
        if (testSubmitted || alreadySubmitted || showResultModal) {
          return;
        }
        if (!error && !statusMessage && !testAlreadyCompleted) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          // Apply blur IMMEDIATELY to DOM (synchronous, before screenshot)
          const mainElement = document.querySelector("main");
          if (mainElement) {
            mainElement.style.filter = "blur(15px)";
            mainElement.style.transition = "none";
            mainElement.style.pointerEvents = "none";
            mainElement.style.opacity = "0.3";
          }
          // Show modal immediately
          setShowScreenshotModal(true);
        }
        return false;
      }

      // Alt+PrintScreen (Active window screenshot) - Apply blur IMMEDIATELY to DOM
      // BUT NOT if error or status message is shown OR test is submitted
      if (e.altKey && (e.key === "PrintScreen" || e.keyCode === 44)) {
        // Don't show modal if test is submitted
        if (testSubmitted || alreadySubmitted || showResultModal) {
          return;
        }
        // Don't apply blur if error or status message is shown
        if (!error && !statusMessage && !testAlreadyCompleted) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          // Apply blur IMMEDIATELY to DOM (synchronous, before screenshot)
          const mainElement = document.querySelector("main");
          if (mainElement) {
            mainElement.style.filter = "blur(15px)";
            mainElement.style.transition = "none";
            mainElement.style.pointerEvents = "none";
            mainElement.style.opacity = "0.3";
          }
          // Show modal immediately
          setShowScreenshotModal(true);
        }
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

    // Detect tab switch / window blur - DISABLED (no violation reporting)
    const handleBlur = () => {
      // Window blur detection disabled - no violation reporting
      // handleViolation("tab_switch"); // DISABLED
    };

    // Detect page visibility change - Enhanced for screenshot detection
    const handleVisibilityChange = () => {
      // Don't apply blur if error or status message is shown OR test is submitted OR still loading
      if (error || statusMessage || testAlreadyCompleted || testSubmitted || alreadySubmitted || showResultModal || loading) {
        return;
      }
      // Don't trigger on page load (first 2 seconds)
      if (pageLoadTimeRef.current && Date.now() - pageLoadTimeRef.current < 2000) {
        return;
      }
      // Screenshot olishda page visibility o'zgarishi mumkin
      if (document.hidden) {
        // Apply blur IMMEDIATELY to DOM (synchronous, before screenshot)
        const mainElement = document.querySelector("main");
        if (mainElement) {
          mainElement.style.filter = "blur(15px)";
          mainElement.style.transition = "none";
          mainElement.style.pointerEvents = "none";
          mainElement.style.opacity = "0.3";
        }
        // Show modal IMMEDIATELY (no delay for better UX)
        setShowScreenshotModal(true);
      } else {
        // Page visible again - remove blur if modal is not showing
        if (!showScreenshotModal) {
          const mainElement = document.querySelector("main");
          if (mainElement) {
            mainElement.style.filter = "";
            mainElement.style.transition = "";
            mainElement.style.pointerEvents = "";
            mainElement.style.opacity = "";
          }
        }
      }
    };

    // Detect window blur - screenshot olishda window blur bo'lishi mumkin
    const handleWindowBlur = () => {
      // Don't apply blur if error or status message is shown OR test is submitted OR still loading
      if (error || statusMessage || testAlreadyCompleted || testSubmitted || alreadySubmitted || showResultModal || loading) {
        return;
      }
      // Don't trigger on page load (first 2 seconds)
      if (pageLoadTimeRef.current && Date.now() - pageLoadTimeRef.current < 2000) {
        return;
      }
      // Apply blur IMMEDIATELY to DOM (synchronous, before screenshot)
      const mainElement = document.querySelector("main");
      if (mainElement) {
        mainElement.style.filter = "blur(15px)";
        mainElement.style.transition = "none";
        mainElement.style.pointerEvents = "none";
        mainElement.style.opacity = "0.3";
      }
      // Show modal IMMEDIATELY (no delay for better UX)
      setShowScreenshotModal(true);
    };

    // Detect window focus - screenshot olishdan keyin focus qaytadi
    // NOTE: Clipboard check removed to avoid permission dialogs
    const handleWindowFocus = () => {
      // Don't check if test is submitted OR still loading
      if (testSubmitted || alreadySubmitted || showResultModal || loading) {
        return;
      }
      // Clipboard check removed - it requires user permission which we don't want
      // We rely on other detection methods (keyboard shortcuts, visibility change, etc.)
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

    // Detect DevTools opening - ACTIVE
    const detectDevTools = () => {
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold =
        window.outerHeight - window.innerHeight > threshold;

      let isDevToolsOpen = false;

      // Method 1: Window size difference
      if (widthThreshold || heightThreshold) {
        isDevToolsOpen = true;
      }

      // Method 2: Console detection using getter
      try {
        let devtoolsOpen = false;
        const element = new Image();
        Object.defineProperty(element, "id", {
          get: function () {
            devtoolsOpen = true;
          },
        });
        console.log(element);
        console.clear();
        if (devtoolsOpen) {
          isDevToolsOpen = true;
        }
      } catch (e) {
        // Silent catch
      }

      // Update state if devtools detected - BUT NOT if test is submitted
      if (isDevToolsOpen) {
        if (!devToolsDetected && !testSubmitted && !alreadySubmitted && !showResultModal) {
          setDevToolsDetected(true);
          setShowDevToolsModal(true);
        }
      } else {
        // Devtools closed - hide modal
        if (devToolsDetected) {
          setDevToolsDetected(false);
          setShowDevToolsModal(false);
        }
      }
    };

    // Check DevTools every 500ms
    const devToolsInterval = setInterval(detectDevTools, 500);

    // Add event listeners
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown, true); // Use capture phase for better detection
    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);
    document.addEventListener("cut", handleCut);
    document.addEventListener("dragstart", handleDragStart);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
      document.removeEventListener("cut", handleCut);
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(devToolsInterval);
      // Remove blur on cleanup
      const mainElement = document.querySelector("main");
      if (mainElement) {
        mainElement.style.filter = "";
        mainElement.style.transition = "";
        mainElement.style.pointerEvents = "";
        mainElement.style.opacity = "";
      }
      document.body.style.filter = "";
      document.body.style.transition = "";
      // Close modals on cleanup
      setShowScreenshotModal(false);
      setShowDevToolsModal(false);
    };
  }, [t, isBlocked, devToolsDetected, testSubmitted]);

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
    if (devToolsDetected) return; // Block if devtools detected
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  // Navigate to next question
  const handleNext = () => {
    if (devToolsDetected) return; // Block if devtools detected
    if (currentQuestion < testQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  // Navigate to previous question
  const handlePrevious = () => {
    if (devToolsDetected) return; // Block if devtools detected
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  // Submit test
  const handleSubmit = useCallback(async () => {
    if (devToolsDetected) {
      toast.error(
        t("test.security.devtools_blocked_submit") ||
          "Dasturchi vositalari ochilgan. Testni topshirib bo'lmaydi."
      );
      return;
    }
    // Check if all questions are answered
    const unansweredQuestions = testQuestions.filter(
      (q) => !answers[q.id]
    ).length;

    // For auto-submit on time up, skip confirmation
    const isAutoSubmit = timeRemaining <= 0;
    if (unansweredQuestions > 0 && !isAutoSubmit) {
      const confirmSubmit = window.confirm(
        t("test.unanswered_warning", { count: unansweredQuestions })
      );
      if (!confirmSubmit) return;
    }

    // Check if this is a demo/fallback test
    const isDemoTest = !test_token || !attemptId || !test_id || activeTestId === "demo";

    setIsSubmitting(true);
    // Don't set alreadySubmitted yet - wait until result modal is shown

    try {
      let correctCount = 0;
      let percentage = 0;
      let isPassed = false;
      let finishResponse = null;

      if (isDemoTest) {
        // Demo test - calculate results locally
        console.log("Demo test - calculating results locally");
        
        const totalQuestions = testQuestions.length;
        
        // Calculate correct answers using hardcoded correctAnswers
        correctCount = testQuestions.filter((q) => {
          const userAnswer = answers[q.id];
          const correctAnswer = correctAnswers[q.id];
          return userAnswer === correctAnswer;
        }).length;
        
        // Calculate percentage
        if (totalQuestions > 0) {
          percentage = Math.round((correctCount / totalQuestions) * 100);
        }
        
        // Determine if passed (60% passing score)
        const passingScore = testData?.passing_score || 60;
        isPassed = percentage >= passingScore;
        
        finishResponse = {
          correct_answers: correctCount,
          score: percentage,
          passed: isPassed,
          success: "Test muvaffaqiyatli yakunlandi",
        };
      } else {
        // Real test - submit to backend
        // Step 1: Submit all answers to backend
        const responses = testQuestions
          .filter((q) => answers[q.id]) // Only include questions with answers
          .map((q) => ({
            question_id: q.id,
            selected_choice_id: parseInt(answers[q.id]), // Convert to integer
          }));

        const submitPayload = {
          attempt_id: attemptId,
          responses: responses,
        };

        console.log("Submitting answers:", submitPayload);

        // Submit answers
        await testsAPI.submitAnswers({
          token: test_token,
          answers: submitPayload,
        });

        console.log("Answers submitted successfully");

        // Step 2: Finish the test
        finishResponse = await testsAPI.finishTest({
          testId: test_id,
          token: test_token,
        });

        console.log("Test finished, response:", finishResponse);

        // Step 3: Calculate results - use backend data if available, otherwise calculate locally
        correctCount = finishResponse.correct_answers ?? 0;
        const totalQuestions = testQuestions.length;
        
        // Calculate percentage from backend score or from correct answers
        if (finishResponse.score !== undefined && finishResponse.score !== null) {
          percentage = Math.round(Number(finishResponse.score));
        } else if (totalQuestions > 0) {
          percentage = Math.round((correctCount / totalQuestions) * 100);
        }
        
        // Determine if passed - use backend value or calculate (assuming 60% is passing)
        const passingScore = testData?.passing_score || 60; // Default 60% passing score
        isPassed = finishResponse.passed !== undefined 
          ? Boolean(finishResponse.passed)
          : percentage >= passingScore;
      }

      // Step 4: Show results
      const totalQuestions = testQuestions.length;
      const testResults = {
        testId: activeTestId,
        answers: answers,
        correctCount: correctCount,
        totalQuestions: totalQuestions,
        percentage: percentage,
        isPassed: isPassed,
        submittedAt: new Date().toISOString(),
        timeSpent: (initialTimeRef.current || 30 * 60) - timeRemaining,
        success: finishResponse?.success || "Test muvaffaqiyatli yakunlandi",
      };

      // Save to localStorage
      localStorage.setItem(
        `test_result_${activeTestId}`,
        JSON.stringify(testResults)
      );

      // Clear test state from localStorage
      localStorage.removeItem(`test_state_${activeTestId}`);

      // Disable all security checks after test submission
      setTestSubmitted(true);
      
      // Show result modal
      setTestResult(testResults);
      setShowResultModal(true);

      toast.success(
        finishResponse?.success || "Test muvaffaqiyatli yakunlandi",
        {
          duration: 3000,
          position: "top-center",
        }
      );
    } catch (error) {
      console.error("Test submission error:", error);
      const errorData = error.response?.data;
      const errorMessage = errorData?.error || errorData?.message || "";
      const status = errorData?.status || "";

      // Check for "Vaqt tugadi" / "Time is up" status
      if (
        errorMessage.includes("Vaqt tugadi") ||
        errorMessage.includes("Time is up") ||
        errorMessage.includes("vaqt tugadi") ||
        errorMessage.includes("time is up") ||
        status.includes("Vaqt tugadi") ||
        status.includes("Time is up")
      ) {
        setStatusMessage(errorMessage || status || "Vaqt tugadi");
        setStatusType("time_up");
        setAlreadySubmitted(true); // Prevent retry
        return;
      }

      // Check for "already completed" status
      if (
        errorMessage.includes("allaqachon yakunlagansiz") ||
        errorMessage.includes("already completed") ||
        errorMessage.includes("yakunlagan")
      ) {
        setTestAlreadyCompleted(true);
        setAlreadySubmitted(true);
        return;
      }

      // Generic error - show toast
      toast.error(errorMessage || status || t("test.error_message"), {
        duration: 5000,
        position: "top-center",
      });
      setAlreadySubmitted(false); // Reset on error to allow retry
    } finally {
      setIsSubmitting(false);
    }
  }, [
    devToolsDetected,
    testQuestions,
    answers,
    timeRemaining,
    test_token,
    attemptId,
    test_id,
    activeTestId,
    t,
  ]);

  // Timer countdown - Fixed to continue even when modals are shown
  useEffect(() => {
    // Don't start timer if time is already up, no initial time, or test is blocked/submitted
    if (
      !initialTimeRef.current ||
      timeRemaining <= 0 ||
      isBlocked ||
      alreadySubmitted ||
      !testData
    ) {
      // Clear timer if conditions not met
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      return;
    }

    // Clear any existing timer before starting new one
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    // Start timer - this will continue even when modals are shown
    timerIntervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        // Stop if already at 0
        if (prev <= 0) {
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
          }
          return 0;
        }

        // Calculate time based on elapsed time from start (sync with backend time)
        if (initialTimeRef.current && startTimeRef.current) {
          const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
          const calculated = Math.max(0, initialTimeRef.current - elapsed);
          // Use calculated time to stay in sync with backend
          return calculated;
        }
        // Otherwise, just decrement
        return Math.max(0, prev - 1);
      });
    }, 1000);

    // Cleanup on unmount or when test ends
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [testData, isBlocked, alreadySubmitted]); // Start timer when test data loads, stop when blocked/submitted

  // Auto-submit test when time runs out
  useEffect(() => {
    if (
      timeRemaining <= 0 &&
      !isSubmitting &&
      !alreadySubmitted &&
      test_token &&
      attemptId &&
      test_id
    ) {
      console.log("Time is up - automatically submitting test...");
      // Use setTimeout to ensure this runs after state updates
      const timeoutId = setTimeout(() => {
        handleSubmit();
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [
    timeRemaining,
    isSubmitting,
    alreadySubmitted,
    test_token,
    attemptId,
    test_id,
    handleSubmit,
  ]);

  // Close modal and navigate home
  const handleCloseResultModal = () => {
    setShowResultModal(false);
    setAlreadySubmitted(true); // Mark as submitted after modal is closed
    navigate("/");
  };

  const handleBack = () => {
    setShowLeaveModal(true);
  };

  const handleConfirmLeave = () => {
    setShowLeaveModal(false);
    navigate("/");
  };

  const handleCancelLeave = () => {
    setShowLeaveModal(false);
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

  // Show already submitted state - but only if result modal is not showing
  if (alreadySubmitted && testResult && !showResultModal) {
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
                          ? "Testdan chetlashtirildi"
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

  // Show status message (time up, etc.)
  if (statusMessage && statusType) {
    const isTimeUp = statusType === "time_up";
    const iconName = isTimeUp ? "Clock" : "Info";
    const bgColor = isTimeUp
      ? "from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800"
      : "from-orange-600 to-orange-700 dark:from-orange-700 dark:to-orange-800";
    const borderColor = isTimeUp
      ? "border-blue-600 dark:border-blue-700"
      : "border-orange-600 dark:border-orange-700";
    const title = isTimeUp
      ? "Test vaqti tugadi"
      : statusMessage || "Test holati";
    const description = isTimeUp
      ? "Test vaqti tugagani uchun test avtomatik yakunlandi"
      : statusMessage;

    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={`bg-white dark:bg-slate-800 rounded-lg shadow-xl border-t-4 ${borderColor} overflow-hidden`}
            >
              {/* Official Header */}
              <div className={`bg-gradient-to-r ${bgColor} px-8 py-8`}>
                <div className="flex items-center space-x-4">
                  <div className="bg-white/20 p-3 rounded-lg">
                    <Icon name={iconName} size={40} className="text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white uppercase tracking-wide">
                      {title}
                    </h1>
                    <p className="text-white/90 text-sm mt-1">
                      {isTimeUp
                        ? "Test vaqti tugagani uchun avtomatik yakunlandi"
                        : "Test holati"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="px-8 py-8 space-y-6">
                <div
                  className={`${
                    isTimeUp
                      ? "bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-600"
                      : "bg-orange-50 dark:bg-orange-900/10 border-l-4 border-orange-600"
                  } p-5`}
                >
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {description}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
                  <div className="flex items-start space-x-3">
                    <Icon
                      name="AlertCircle"
                      size={24}
                      className={`${
                        isTimeUp
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-orange-600 dark:text-orange-400"
                      } flex-shrink-0 mt-0.5`}
                    />
                    <div>
                      <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                        {isTimeUp ? "Vaqt tugadi" : "Ma'lumot"}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {isTimeUp
                          ? "Test vaqti tugagani uchun test avtomatik yakunlandi. Hozirgi holatdagi javoblar backendga yuborildi."
                          : "Iltimos, test natijalaringizni ko'rmoqchi bo'lsangiz, boshqa testni tanlang yoki bosh sahifaga qayting."}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/")}
                  className={`w-full py-3.5 px-6 rounded-md font-semibold text-base ${
                    isTimeUp
                      ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                      : "bg-orange-600 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600"
                  } text-white transition-colors uppercase tracking-wide`}
                >
                  {t("test.security.go_home") || "Markaziy Bank - Bosh Sahifa"}
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

      {/* Violation Counter - DISABLED */}
      <main
        className={`pt-20 pb-32 transition-all ${
          showScreenshotModal &&
          !error &&
          !statusMessage &&
          !testAlreadyCompleted
            ? "blur-md pointer-events-none opacity-30"
            : ""
        }`}
        style={
          showScreenshotModal &&
          !error &&
          !statusMessage &&
          !testAlreadyCompleted
            ? {
                filter: "blur(15px)",
                zIndex: 1,
                isolation: "isolate",
                position: "relative",
              }
            : {}
        }
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={handleBack}
                disabled={devToolsDetected}
                className={`flex items-center space-x-2 transition-colors ${
                  devToolsDetected
                    ? "opacity-50 cursor-not-allowed text-gray-400"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
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
                    className={`flex items-start p-4 rounded-lg border-2 transition-all ${
                      devToolsDetected
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    } ${
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
                      disabled={devToolsDetected}
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
                disabled={currentQuestion === 0 || devToolsDetected}
                variant="outline"
                className="flex-1"
              >
                <Icon name="ChevronLeft" size={16} className="mr-2" />
                {t("test.previous")}
              </Button>

              {currentQuestion < testQuestions.length - 1 ? (
                <Button
                  onClick={handleNext}
                  disabled={devToolsDetected}
                  className="flex-1"
                >
                  {t("test.next")}
                  <Icon name="ChevronRight" size={16} className="ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || devToolsDetected}
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
                  onClick={() => {
                    if (!devToolsDetected) {
                      setCurrentQuestion(index);
                    }
                  }}
                  disabled={devToolsDetected}
                  className={`h-10 w-10 rounded-lg font-medium transition-all ${
                    devToolsDetected ? "opacity-50 cursor-not-allowed" : ""
                  } ${
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

      {/* Violation Warning Modal - DISABLED */}

      {/* Screenshot Warning Modal - Blur overlay with warning */}
      {showScreenshotModal &&
        createPortal(
          <div
            className="fixed inset-0 flex items-center justify-center p-4"
            style={{
              zIndex: 99999,
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: "auto",
              filter: "none !important",
              WebkitFilter: "none !important",
              backdropFilter: "none !important",
              WebkitBackdropFilter: "none !important",
              isolation: "isolate",
              transform: "translateZ(0)",
              willChange: "transform",
            }}
          >
            {/* Modal - Must not be affected by parent blur */}
            <div
              className="relative bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-lg w-full overflow-hidden"
              style={{
                zIndex: 100000,
                filter: "none !important",
                WebkitFilter: "none !important",
                backdropFilter: "none !important",
                WebkitBackdropFilter: "none !important",
                position: "relative",
                willChange: "transform",
                transform: "translateZ(0)",
                backfaceVisibility: "hidden",
                isolation: "isolate",
                mixBlendMode: "normal",
              }}
            >
              {/* Header with X button */}
              <div
                className="bg-gradient-to-r from-red-600 to-red-700 dark:from-red-700 dark:to-red-800 px-6 py-5 relative"
                style={{
                  filter: "none !important",
                  WebkitFilter: "none !important",
                  backdropFilter: "none !important",
                  WebkitBackdropFilter: "none !important",
                }}
              >
                <button
                  onClick={() => setShowScreenshotModal(false)}
                  className="absolute top-4 right-4 text-white hover:text-red-200 transition-colors p-1 rounded-full hover:bg-white/20"
                  aria-label="Close"
                  style={{
                    filter: "none !important",
                    WebkitFilter: "none !important",
                    backdropFilter: "none !important",
                    WebkitBackdropFilter: "none !important",
                  }}
                >
                  <Icon name="X" size={20} />
                </button>
                <div className="flex items-center justify-center space-x-3 pr-8">
                  <Icon name="AlertTriangle" size={28} className="text-white" />
                  <div className="text-left">
                    <h2 className="text-lg font-bold text-white uppercase tracking-wide">
                      {t("test.security.violation_warning_title") ||
                        "Qoida buzarlik qilmang"}
                    </h2>
                    <p className="text-red-100 text-xs mt-0.5">
                      {t("test.security.official_warning") ||
                        "Rasmiy ogohlantirish"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div
                className="px-6 py-6 space-y-4"
                style={{
                  filter: "none !important",
                  WebkitFilter: "none !important",
                  backdropFilter: "none !important",
                  WebkitBackdropFilter: "none !important",
                }}
              >
                {/* Warning Message */}
                <div
                  className="bg-red-50 dark:bg-red-900/10 border-l-4 border-red-600 p-4 rounded-lg"
                  style={{
                    filter: "none !important",
                    WebkitFilter: "none !important",
                    backdropFilter: "none !important",
                    WebkitBackdropFilter: "none !important",
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <Icon
                      name="AlertCircle"
                      size={20}
                      className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
                    />
                    <div>
                      <p className="text-sm font-semibold text-red-800 dark:text-red-300 mb-2">
                        {t("test.security.violation_warning_title") ||
                          "Qoida buzarlik qilmang!"}
                      </p>
                      <p className="text-sm text-red-700 dark:text-red-400 leading-relaxed">
                        {t("test.security.violation_warning_message") ||
                          "Test davomida qoida buzarlik qilish qat'iyan taqiqlanadi. Skrinshot olish, ekran yozib olish yoki boshqa noqonuniy harakatlar test qoidalarini buzish hisoblanadi va test natijalaringiz bekor qilinishi mumkin."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div
                  className="bg-orange-50 dark:bg-orange-900/10 border-l-4 border-orange-600 p-4 rounded-lg"
                  style={{
                    filter: "none !important",
                    WebkitFilter: "none !important",
                    backdropFilter: "none !important",
                    WebkitBackdropFilter: "none !important",
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <Icon
                      name="Info"
                      size={20}
                      className="text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5"
                    />
                    <div>
                      <p className="text-sm font-semibold text-orange-800 dark:text-orange-300 mb-2">
                        {t("test.security.violation_note_title") || "Diqqat:"}
                      </p>
                      <p className="text-sm text-orange-700 dark:text-orange-400 leading-relaxed">
                        {t("test.security.violation_note_message") ||
                          "Qoida buzarlik qilish test natijalaringizni bekor qilishi va testdan chetlashtirilishingizga olib kelishi mumkin. Iltimos, test qoidalariga rioya qiling va halollik bilan test topshiring."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setShowScreenshotModal(false)}
                  className="w-full py-3 px-6 rounded-lg font-semibold text-sm bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white transition-colors"
                  style={{
                    filter: "none !important",
                    WebkitFilter: "none !important",
                    backdropFilter: "none !important",
                    WebkitBackdropFilter: "none !important",
                  }}
                >
                  {t("test.security.violation_understood") || "Tushundim, qoidalarga rioya qilaman"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* DevTools Warning Modal - Cannot be closed while devtools is open */}
      {showDevToolsModal && devToolsDetected && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-lg w-full overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 dark:from-red-700 dark:to-red-800 px-6 py-5">
              <div className="flex items-center justify-center space-x-3">
                <Icon name="AlertTriangle" size={28} className="text-white" />
                <div className="text-left">
                  <h2 className="text-lg font-bold text-white uppercase tracking-wide">
                    {t("test.security.devtools_detected")}
                  </h2>
                  <p className="text-red-100 text-xs mt-0.5">
                    {t("test.security.official_warning") ||
                      "Rasmiy ogohlantirish"}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-6 space-y-4">
              {/* Warning Message */}
              <div className="bg-red-50 dark:bg-red-900/10 border-l-4 border-red-600 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Icon
                    name="AlertCircle"
                    size={20}
                    className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-semibold text-red-800 dark:text-red-300 mb-2">
                      {t("test.security.devtools_blocked_title") ||
                        "Dasturchi vositalari aniqlandi!"}
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-400 leading-relaxed">
                      {t("test.security.devtools_blocked_message") ||
                        "Dasturchi vositalari (DevTools) ochilganligi aniqlandi. Test davomida dasturchi vositalaridan foydalanish taqiqlanadi. Iltimos, dasturchi vositalarini yoping va sahifani yangilang."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-orange-50 dark:bg-orange-900/10 border-l-4 border-orange-600 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Icon
                    name="Info"
                    size={20}
                    className="text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-semibold text-orange-800 dark:text-orange-300 mb-2">
                      {t("test.security.devtools_instructions_title") ||
                        "Qanday yopish kerak:"}
                    </p>
                    <ul className="text-sm text-orange-700 dark:text-orange-400 leading-relaxed list-disc list-inside space-y-1">
                      <li>
                        {t("test.security.devtools_close_f12") ||
                          "F12 tugmasini bosing"}
                      </li>
                      <li>
                        {t("test.security.devtools_close_shortcut") ||
                          "Ctrl+Shift+I (yoki Cmd+Option+I Mac da)"}
                      </li>
                      <li>
                        {t("test.security.devtools_close_manual") ||
                          "Yoki brauzer menyusidan dasturchi vositalarini yoping"}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Note: Modal cannot be closed while devtools is open */}
              <div className="bg-gray-50 dark:bg-slate-700 p-3 rounded-lg text-center">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {t("test.security.devtools_close_note") ||
                    "⚠️ Dasturchi vositalarini yopmaguningizcha, bu oyna yopilmaydi va testda hech qanday amal bajarilmaydi."}
                </p>
              </div>
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
              className={`px-6 py-6 border-b-2 ${
                testResult.isPassed
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-700 dark:to-emerald-700 border-green-500"
                  : "bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-700 dark:to-rose-700 border-red-500"
              }`}
            >
              <div className="text-center">
                <Icon
                  name={testResult.isPassed ? "CheckCircle" : "XCircle"}
                  size={48}
                  className="mx-auto mb-3 text-white"
                />
                <h2 className="text-xl font-bold text-white uppercase tracking-wide">
                  {t("test.result.title") === "test.result.title" 
                    ? "Test natijalari" 
                    : t("test.result.title")}
                </h2>
              </div>
            </div>

            {/* Results */}
            <div className="px-6 py-6 space-y-4">
              {/* Score Display - Prominent */}
              <div className="text-center mb-6">
                <div className="inline-flex items-baseline space-x-2">
                  <span className={`text-6xl font-bold ${
                    testResult.isPassed
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}>
                    {testResult.percentage}%
                  </span>
                </div>
                <p className="text-base font-semibold text-gray-700 dark:text-gray-300 mt-3">
                  {t("test.result.your_score") || "Sizning natijangiz"}
                </p>
                {/* Pass/Fail Status Badge */}
                <div className="mt-4 inline-block">
                  <span
                    className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wide ${
                      testResult.isPassed
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-2 border-green-500"
                        : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-2 border-red-500"
                    }`}
                  >
                    {testResult.isPassed
                      ? t("test.result.passed_title") || "✅ Testdan o'tdingiz"
                      : t("test.result.failed_title") || "❌ Testdan o'ta olmadingiz"}
                  </span>
                </div>
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

              {/* Pass/Fail Info - More Prominent */}
              <div
                className={`mt-6 p-5 rounded-lg border-2 ${
                  testResult.isPassed
                    ? "bg-green-50 dark:bg-green-900/20 border-green-500 dark:border-green-700"
                    : "bg-red-50 dark:bg-red-900/20 border-red-500 dark:border-red-700"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <Icon
                    name={testResult.isPassed ? "CheckCircle" : "XCircle"}
                    size={24}
                    className={`flex-shrink-0 mt-0.5 ${
                      testResult.isPassed
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  />
                  <div>
                    <p
                      className={`text-base font-bold mb-1 ${
                        testResult.isPassed
                          ? "text-green-800 dark:text-green-300"
                          : "text-red-800 dark:text-red-300"
                      }`}
                    >
                      {testResult.isPassed
                        ? t("test.result.pass_info") || "🎉 Tabriklaymiz! Siz testdan muvaffaqiyatli o'tdingiz!"
                        : t("test.result.fail_info") || "😔 Afsuski, siz testdan o'ta olmadingiz. Keyingi safar omad!"}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {testResult.isPassed
                        ? `Siz ${testResult.percentage}% ball to'pladingiz va ${testResult.correctCount} ta to'g'ri javob berdingiz.`
                        : `Siz ${testResult.percentage}% ball to'pladingiz. Testdan o'tish uchun kamida 60% ball kerak.`}
                    </p>
                  </div>
                </div>
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

      {/* Leave Confirmation Modal */}
      {showLeaveModal && !devToolsDetected && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-lg w-full overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-700 dark:to-red-700 px-6 py-5">
              <div className="flex items-center justify-center space-x-3">
                <Icon name="AlertTriangle" size={28} className="text-white" />
                <div className="text-left">
                  <h2 className="text-lg font-bold text-white uppercase tracking-wide">
                    {t("test.leave_modal.title")}
                  </h2>
                  <p className="text-orange-100 text-xs mt-0.5">
                    {t("test.leave_modal.subtitle")}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-6 space-y-4">
              {/* Warning Message */}
              <div className="bg-red-50 dark:bg-red-900/10 border-l-4 border-red-600 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Icon
                    name="AlertCircle"
                    size={20}
                    className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-semibold text-red-800 dark:text-red-300 mb-2">
                      {t("test.leave_modal.warning_title")}
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-400 leading-relaxed">
                      {t("test.leave_modal.warning_message")}
                    </p>
                  </div>
                </div>
              </div>

              {/* 90 Days Restriction Warning */}
              <div className="bg-orange-50 dark:bg-orange-900/10 border-l-4 border-orange-600 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Icon
                    name="Clock"
                    size={20}
                    className="text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-semibold text-orange-800 dark:text-orange-300 mb-2">
                      {t("test.leave_modal.restriction_title")}
                    </p>
                    <p className="text-sm text-orange-700 dark:text-orange-400 leading-relaxed">
                      {t("test.leave_modal.restriction_message")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleCancelLeave}
                  className="flex-1 py-3 px-6 rounded-lg font-semibold text-sm bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-gray-200 transition-colors"
                >
                  {t("test.leave_modal.cancel_button")}
                </button>
                <button
                  onClick={handleConfirmLeave}
                  className="flex-1 py-3 px-6 rounded-lg font-semibold text-sm bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white transition-colors"
                >
                  {t("test.leave_modal.confirm_button")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VacancyTest;
