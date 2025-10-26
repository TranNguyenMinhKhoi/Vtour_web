// // // src/api/axiosClient.ts
// // import axios from "axios";

// // const axiosClient = axios.create({
// //   //   baseURL: "https://vtour-be.onrender.com/",
// //   baseURL: "https://lq63h7zp-5000.asse.devtunnels.ms",
// //   headers: {
// //     "Content-Type": "application/json",
// //     "Access-Control-Allow-Origin": "*",
// //   },
// // });

// // export default axiosClient;

// // src/api/axiosClient.ts
// import axios from "axios";

// const axiosClient = axios.create({
//   // baseURL: "https://vtour-be.onrender.com/",
//   // baseURL: "https://lq63h7zp-5000.asse.devtunnels.ms",
//   baseURL: "http://localhost:5000",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Thêm request interceptor để tự động gắn token
// axiosClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Thêm response interceptor để handle lỗi (ví dụ: 401 Unauthorized)
// axiosClient.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     // Nếu bị 401 => có thể redirect login hoặc refresh token (tùy backend)
//     if (error.response?.status === 401) {
//       console.warn("Unauthorized - cần đăng nhập lại.");
//       // Ví dụ đơn giản: clear token và reload
//       localStorage.removeItem("token");
//       // window.location.href = "/login"; // nếu muốn redirect
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosClient;

// src/api/axiosClient.ts
import axios from "axios";

const axiosClient = axios.create({
  // baseURL: "https://vtour-be.onrender.com/",
  // baseURL: "https://lq63h7zp-5000.asse.devtunnels.ms",
  // baseURL: "http://localhost:5000",
  baseURL: "https://bus-ticket-be-dun.vercel.app/",
  // baseURL: process.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // Thêm timeout 10 giây
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

      // Không redirect tự động, để component tự xử lý
      // Có thể dispatch event để các component lắng nghe
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
