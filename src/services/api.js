import axios from "axios";

const API = axios.create({
  // baseURL: "http://192.168.23.67:5000/api",
  baseURL: "http://localhost:5000/api",
});

// Interceptor untuk menambahkan token ke setiap request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk menangani error response
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Tambahkan logging
    console.error(
      "API Error:",
      error.response?.status,
      error.response?.data,
      error.config?.url
    );

    // Jika error 401 (Unauthorized) atau 403 (Forbidden), redirect ke login
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("storage-event"));
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;
