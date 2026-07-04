import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const axiosClient = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json"
  }
});

// Normalize errors into a single shape the UI can rely on.
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong. Please try again.";

    const normalized = new Error(message);
    normalized.status = error?.response?.status;
    normalized.details = error?.response?.data?.errors;
    return Promise.reject(normalized);
  }
);

export default axiosClient;
