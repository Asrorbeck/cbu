// API service for departments
import axios from "axios";

// Get API base URL from environment variable only
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  const errorMessage =
    "VITE_API_BASE_URL environment variable is not set. Please configure it in your .env file and restart the Vite dev server.";
  console.error(errorMessage);
  throw new Error(errorMessage);
}

const API_BASE_URL_NO_VERSION = API_BASE_URL.replace(/\/v1\/?$/, "");

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const apiClientNoVersion = axios.create({
  baseURL: API_BASE_URL_NO_VERSION,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

apiClientNoVersion.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

apiClientNoVersion.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const departmentsAPI = {
  // Get all departments
  getDepartments: async () => {
    try {
      const response = await apiClient.get("/departments/");
      return response.data;
    } catch (error) {
      console.error("Error fetching departments:", error);
      throw error;
    }
  },

  // Get department by ID
  getDepartmentById: async (id) => {
    try {
      const response = await apiClient.get(`/departments/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching department ${id}:`, error);
      throw error;
    }
  },
};

export const vacanciesAPI = {
  // Get vacancies by department ID
  getVacanciesByDepartment: async (departmentId, branchType = null) => {
    try {
      let url = `/vacancies/?department_id=${departmentId}`;
      if (branchType) {
        url += `&branch_type=${branchType}`;
      }
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching vacancies for department ${departmentId}:`,
        error
      );
      throw error;
    }
  },

  // Get vacancies by region and branch type
  getVacanciesByRegion: async (region, branchType = "regional") => {
    try {
      const response = await apiClient.get(
        `/vacancies/?region=${region}&branch_type=${branchType}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching vacancies for region ${region}:`,
        error
      );
      throw error;
    }
  },

  // Get vacancy by ID
  getVacancyById: async (id) => {
    try {
      const response = await apiClient.get(`/vacancies/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching vacancy ${id}:`, error);
      throw error;
    }
  },
};

export const testsAPI = {
  // Start a test session
  startTest: async ({ testId, token }) => {
    try {
      const response = await apiClient.post(
        `/tests/${testId}/start/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error starting test ${testId}:`, error);
      throw error;
    }
  },

  // Report violation
  reportViolation: async ({ token, attemptId, violationType }) => {
    try {
      const response = await apiClient.post(
        `/tests/report_violation/`,
        {
          token: token,
          attempt_id: attemptId,
          violation_type: violationType,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          validateStatus: (status) => {
            // Accept 200, 201, and 403 as valid responses
            return status === 200 || status === 201 || status === 403;
          },
        }
      );

      // Handle 403 - Disqualification
      if (response.status === 403) {
        const data = response.data;
        console.error("TESTDAN CHETLASHTIRILDI:", data);
        return {
          disqualified: true,
          ...data,
        };
      }

      // Normal response with warning
      return response.data;
    } catch (error) {
      console.error("Error reporting violation:", error);
      throw error;
    }
  },

  // Submit answers
  submitAnswers: async ({ token, answers }) => {
    try {
      const response = await apiClient.post(
        `/tests/submit_answer/`,
        answers, // Object with attempt_id and responses array
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error submitting answers:", error);
      throw error;
    }
  },

  // Finish test
  finishTest: async ({ testId, token }) => {
    try {
      const response = await apiClient.post(
        `/tests/${testId}/finish/`,
        {}, // Empty body
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error finishing test ${testId}:`, error);
      throw error;
    }
  },
};

export const appealsAPI = {
  // Submit an appeal/complaint
  submitAppeal: async (appealData) => {
    try {
      // Check if appealData is FormData or regular object
      const isFormData = appealData instanceof FormData;

      const response = await apiClient.post("/Appeals/", appealData, {
        headers: isFormData
          ? { "Content-Type": "multipart/form-data" }
          : { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error("Error submitting appeal:", error);
      throw error;
    }
  },
};

export const organizationAPI = {
  // Check organization license
  checkLicense: async (params) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.inn) queryParams.append("inn", params.inn);
      if (params.license_number)
        queryParams.append("license_number", params.license_number);

      const response = await apiClient.get(
        `/organization/?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const chatsAPI = {
  // Register user chat data
  registerUser: async (userData) => {
    try {
      const response = await apiClient.post("/chats/", userData);
      return response.data;
    } catch (error) {
      console.error("Error registering user chat:", error);
      throw error;
    }
  },
};

export const reportsAPI = {
  // Submit a corruption report
  submitReport: async (reportData) => {
    try {
      const response = await apiClient.post("/report/", reportData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error submitting report:", error);
      throw error;
    }
  },
};

export const spellingReportsAPI = {
  // Submit a spelling/language error report
  submitReport: async (reportData) => {
    try {
      const response = await apiClientNoVersion.post(
        "/spelling/reports/",
        reportData,
        {
        headers: reportData instanceof FormData
          ? { "Content-Type": "multipart/form-data" }
          : { "Content-Type": "application/json" },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error submitting spelling report:", error);
      throw error;
    }
  },
};

export const faqAPI = {
  // Get FAQ categories
  getFaqCategories: async () => {
    try {
      const response = await apiClient.get("/faq-categories/");
      return response.data;
    } catch (error) {
      console.error("Error fetching FAQ categories:", error);
      throw error;
    }
  },
};

export const surveyAPI = {
  // Start survey or continue existing survey
  startSurvey: async (surveyData) => {
    try {
      const response = await apiClient.post(
        "/survey-user/survey-process/start/",
        surveyData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error starting survey:", error);
      throw error;
    }
  },

  // Submit answer to a question
  submitAnswer: async (answerData) => {
    try {
      const response = await apiClient.post(
        "/survey-user/survey-process/submit_answer/",
        answerData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error submitting answer:", error);
      throw error;
    }
  },
};

export const myApplicationsAPI = {
  // Get all user applications (jobs, reports, appeals, spelling reports)
  getMyApplications: async (userId = 905770018) => {
    try {
      const response = await apiClient.get(
        `/my-applications/my_applications/?user_id=${userId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching user applications:", error);
      throw error;
    }
  },
};

export default apiClient;
