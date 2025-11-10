import React from "react";
import {
  BrowserRouter,
  Routes as RouterRoutes,
  Route,
  useLocation,
} from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import BottomNavigation from "components/ui/BottomNavigation";
import NotFound from "pages/NotFound";

// Component to conditionally show BottomNavigation
const ConditionalBottomNavigation = () => {
  const location = useLocation();
  // Hide BottomNavigation on test page
  if (location.pathname.startsWith("/test/")) {
    return null;
  }
  return <BottomNavigation />;
};
import HomeDashboard from "./pages/home-dashboard";
import NewsArticlesHub from "./pages/news-articles-hub";
import FeedbackSubmission from "./pages/feedback-submission";
import JobVacanciesBrowser from "./pages/job-vacancies-browser";
import DepartmentPage from "./pages/department";
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
import ApplicationDetail from "./pages/application-detail";
import EditCorruption from "./pages/edit-corruption";
import VacancyTest from "./pages/vacancy-test";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Define your route here */}
          <Route path="/" element={<HomeDashboard />} />
          <Route path="/home-dashboard" element={<HomeDashboard />} />
          <Route path="/news-articles-hub" element={<NewsArticlesHub />} />
          <Route path="/submissions" element={<FeedbackSubmission />} />
          <Route path="/departments" element={<JobVacanciesBrowser />} />
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
          <Route path="/test" element={<VacancyTest />} />
          <Route path="/test/:token" element={<VacancyTest />} />
          <Route
            path="/departments/:departmentId/:vacancyId/terms-and-conditions"
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
          <Route path="/applications/:id" element={<ApplicationDetail />} />
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
          <Route path="/edit-corruption/:id" element={<EditCorruption />} />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
        <ConditionalBottomNavigation />
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
