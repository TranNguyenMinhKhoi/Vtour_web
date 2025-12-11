import axios from "axios";

const axiosClient = axios.create({
  // baseURL: "http://localhost:5000",
  baseURL: "https://bus-ticket-be-dun.vercel.app",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Thêm request interceptor để tự động gắn token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thêm response interceptor để handle lỗi
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    console.log(originalRequest);

    // Nếu bị 401 Unauthorized
    if (error.response?.status === 401) {
      console.warn("Unauthorized - Token không hợp lệ hoặc đã hết hạn.");

      // Xóa token khỏi localStorage
      localStorage.removeItem("token");

      window.dispatchEvent(new Event("unauthorized"));
    }

    // Nếu bị 403 Forbidden
    if (error.response?.status === 403) {
      console.warn("Forbidden - Không có quyền truy cập.");
    }

    // Nếu bị 500 Internal Server Error
    if (error.response?.status === 500) {
      console.error("Server Error - Có lỗi xảy ra từ phía server.");
    }

    // Nếu không có response (network error)
    if (!error.response) {
      console.error("Network Error - Không thể kết nối đến server.");
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
