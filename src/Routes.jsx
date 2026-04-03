import React from "react";
import {
  BrowserRouter,
  Routes as RouterRoutes,
  Route,
  useLocation,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import BottomNavigation from "components/ui/BottomNavigation";
import NotFound from "pages/NotFound";

// Vacancy-related paths: show fixed "Murojaat uchun tel" in bottom-right
const VACANCY_PATHS = [
  "/departments",
  "/region",
  "/vacancy",
  "/test",
  "/terms-and-conditions",
];

const isVacancyPath = (pathname) =>
  VACANCY_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));

const TELEGRAM_OPTIONAL_PATHS = ["/test"];
const isTelegramOptionalPath = (pathname) =>
  TELEGRAM_OPTIONAL_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

/** Dev: localhost:4029 va boshqa local portlarda Telegram talab qilinmaydi */
const isLocalDevHost = () => {
  if (typeof window === "undefined") return false;
  const { hostname } = window.location;
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "[::1]"
  );
};

const ConditionalBottomNavigation = () => {
  const location = useLocation();
  if (location.pathname === "/test" || location.pathname.startsWith("/test/")) {
    return null;
  }
  return <BottomNavigation />;
};

const BottomNavigationGate = ({ telegramUserId, telegramCheckDone }) => {
  const location = useLocation();
  const isBlockedByTelegramGuard =
    !isLocalDevHost() &&
    !isTelegramOptionalPath(location.pathname) &&
    (!telegramCheckDone || !telegramUserId);

  if (isBlockedByTelegramGuard) {
    return null;
  }

  return <ConditionalBottomNavigation />;
};

const PhoneIcon = () => (
  <svg
    className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V21a2 2 0 01-2 2h-1C9.716 23 3 16.284 3 8V5z"
    />
  </svg>
);

const VACANCY_CONTACT_PHONE_DISPLAY = "71 212 60 91";

const VacancyContactFixed = () => {
  const { t } = useTranslation();
  const location = useLocation();
  if (!isVacancyPath(location.pathname)) return null;
  return (
    <a
      href="tel:712126202"
      className="fixed bottom-24 right-4 z-40 flex min-w-0 items-center gap-1.5 rounded-full border border-gray-200 bg-white/95 px-2.5 py-2 text-xs text-muted-foreground shadow-sm transition hover:border-gray-300 hover:bg-gray-50 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-800/95 dark:hover:border-slate-500 dark:hover:bg-slate-700/95 dark:hover:text-foreground sm:px-3"
      aria-label={t("vacancy_contact.phone_aria_label", {
        phone: VACANCY_CONTACT_PHONE_DISPLAY,
      })}
    >
      <PhoneIcon />
      <span className="hidden sm:inline">{t("vacancy_contact.phone_label")}</span>
      <span className="font-medium tabular-nums">{VACANCY_CONTACT_PHONE_DISPLAY}</span>
    </a>
  );
};
import HomeDashboard from "./pages/home-dashboard";
import NewsArticlesHub from "./pages/news-articles-hub";
import FeedbackSubmission from "./pages/feedback-submission";
import JobVacanciesBrowser from "./pages/job-vacancies-browser";
import CentralDepartmentsPage from "./pages/job-vacancies-browser/central-departments";
import DepartmentPage from "./pages/department";
import RegionsPage from "./pages/regions";
import RegionPage from "./pages/region";
import VacancyDetailPage from "./pages/vacancy-detail";
import JobApplicationForm from "./pages/job-application-form";
import TermsAndConditionsPage from "./pages/terms-and-conditions";
import CurrencyExchangeRates from "./pages/currency-exchange-rates";
import Profile from "./pages/profile";
import Applications from "./pages/applications";
import ConsumerRightsSubmission from "./pages/consumer-rights-submission";
import CorruptionSubmission from "./pages/corruption-submission";
import CheckLicense from "./pages/check-license";
import SubmitComplaint from "./pages/submit-complaint";
import LanguageErrorSubmission from "./pages/language-error-submission";
import ApplicationDetail from "./pages/application-detail";
import EditCorruption from "./pages/edit-corruption";
import VacancyTest from "./pages/vacancy-test";
import Surveys from "./pages/surveys";

const TelegramAccessGuard = ({
  telegramUserId,
  telegramCheckDone,
  children,
}) => {
  const location = useLocation();

  if (isLocalDevHost()) {
    return children;
  }

  if (isTelegramOptionalPath(location.pathname)) {
    return children;
  }

  if (!telegramCheckDone) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!telegramUserId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full rounded-xl border border-border bg-card p-6 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Kirish vaqtincha cheklangan
          </h2>
          <p className="text-sm text-muted-foreground">
            Sahifani ochish uchun Telegram WebApp ma'lumotlari talab qilinadi.
            Ba'zi qurilmalarda (masalan, korporativ yoki cheklangan tarmoqlarda)
            Telegram ushbu ma'lumotlarni uzata olmasligi mumkin. Iloji bo'lsa,
            mobil telefondagi Telegram ilovasi orqali qayta urinib ko'ring.
          </p>
        </div>
      </div>
    );
  }

  return children;
};

const Routes = ({ telegramUserId, telegramCheckDone }) => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <TelegramAccessGuard
          telegramUserId={telegramUserId}
          telegramCheckDone={telegramCheckDone}
        >
          <RouterRoutes>
            {/* Define your route here */}
            <Route path="/" element={<HomeDashboard />} />
            <Route path="/home-dashboard" element={<HomeDashboard />} />
            <Route path="/news-articles-hub" element={<NewsArticlesHub />} />
            <Route path="/submissions" element={<FeedbackSubmission />} />
            <Route path="/departments" element={<JobVacanciesBrowser />} />
            <Route
              path="/departments/central"
              element={<CentralDepartmentsPage />}
            />
            <Route path="/departments/regional" element={<RegionsPage />} />
            <Route
              path="/departments/central/:departmentId"
              element={<DepartmentPage />}
            />
            <Route
              path="/departments/:departmentId"
              element={<DepartmentPage />}
            />
            <Route
              path="/departments/:departmentId/:vacancyId"
              element={<VacancyDetailPage />}
            />
            <Route
              path="/departments/:departmentId/:vacancyId/form"
              element={<JobApplicationForm />}
            />
            <Route
              path="/region/:regionName/:vacancyId/form"
              element={<JobApplicationForm />}
            />
            <Route path="/region" element={<RegionsPage />} />
            <Route path="/region/:regionName" element={<RegionPage />} />
            <Route
              path="/region/:regionName/:vacancyId"
              element={<VacancyDetailPage />}
            />
            <Route path="/test" element={<VacancyTest />} />
            <Route path="/test/:test_id/:test_token" element={<VacancyTest />} />
            <Route
              path="/departments/:departmentId/:vacancyId/terms-and-conditions"
              element={<TermsAndConditionsPage />}
            />
            <Route
              path="/region/:regionName/:vacancyId/terms-and-conditions"
              element={<TermsAndConditionsPage />}
            />
            <Route path="/vacancy/:vacancyId" element={<VacancyDetailPage />} />
            <Route
              path="/terms-and-conditions"
              element={<TermsAndConditionsPage />}
            />
            <Route
              path="/currency-exchange-rates"
              element={<CurrencyExchangeRates />}
            />
            <Route path="/profile" element={<Profile />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/applications/:type" element={<Applications />} />
            <Route
              path="/applications/:type/:id"
              element={<ApplicationDetail />}
            />
            <Route
              path="/submissions/consumer-rights"
              element={<ConsumerRightsSubmission />}
            />
            <Route
              path="/submissions/corruption"
              element={<CorruptionSubmission />}
            />
            <Route path="/check-license" element={<CheckLicense />} />
            <Route path="/submit-complaint" element={<SubmitComplaint />} />
            <Route
              path="/submissions/language-error"
              element={<LanguageErrorSubmission />}
            />
            <Route path="/edit-corruption/:id" element={<EditCorruption />} />
            <Route path="/surveys" element={<Surveys />} />
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </TelegramAccessGuard>
        <BottomNavigationGate
          telegramUserId={telegramUserId}
          telegramCheckDone={telegramCheckDone}
        />
        <VacancyContactFixed />
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
