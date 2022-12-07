import axios from "axios";
import { clearCsrf, getCsrf, requestCsrf } from "lib/csrf";

const apiClient = axios.create({
  baseURL: import.meta.env.DEV ? "http://dev.localhost:5000/api" : "/api",
  withCredentials: true,
});
apiClient.defaults.headers.common["Accept"] = "application/json";
apiClient.defaults.headers.common["Content-Type"] = "application/json";
apiClient.interceptors.request.use(
  async function (config) {
    const csrf = await getCsrf();
    if (csrf && config.headers) {
      config.headers["X-CSRFToken"] = csrf;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error?.response?.status === 400 && originalRequest.url === "/getcsrf") {
      await clearCsrf();
      return Promise.reject(error);
    } else if (
      error?.response?.status === 400 &&
      !originalRequest._retry &&
      error?.response?.data?.error &&
      error?.response?.data?.error.includes("CSRF")
    ) {
      originalRequest._retry = true;
      await requestCsrf();
      const verification = await getCsrf();
      return verification ? apiClient(originalRequest) : Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
