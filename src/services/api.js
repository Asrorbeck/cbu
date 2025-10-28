// API service for departments
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://jonibekdaminov.pythonanywhere.com/api/v1";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
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
  getVacanciesByDepartment: async (departmentId) => {
    try {
      const response = await apiClient.get(
        `/vacancies/?department_id=${departmentId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching vacancies for department ${departmentId}:`,
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

export default apiClient;
