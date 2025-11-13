import axios from "axios";

let loadingCount = 0;
let showLoadingCallback: ((message: string) => void) | null = null;
let hideLoadingCallback: (() => void) | null = null;

export const setupAxiosInterceptors = (
  showLoading: (message: string) => void,
  hideLoading: () => void
) => {
  showLoadingCallback = showLoading;
  hideLoadingCallback = hideLoading;

  // Request interceptor
  axios.interceptors.request.use(
    (config) => {
      // Chỉ hiển thị loading cho các request quan trọng
      const shouldShowLoading = !config.url?.includes("/auth/me"); // Không show loading cho check login
      
      if (shouldShowLoading && showLoadingCallback) {
        loadingCount++;
        
        // Custom message dựa trên endpoint
        let message = "Đang xử lý...";
        
        if (config.url?.includes("/bookings")) {
          message = config.method === "post" ? "Đang đặt vé..." : "Đang tải thông tin...";
        } else if (config.url?.includes("/payment")) {
          message = "Đang xử lý thanh toán...";
        } else if (config.url?.includes("/login") || config.url?.includes("/register")) {
          message = "Đang xác thực...";
        } else if (config.url?.includes("/schedules")) {
          message = "Đang tìm kiếm chuyến xe...";
        }
        
        showLoadingCallback(message);
      }
      
      return config;
    },
    (error) => {
      if (hideLoadingCallback) {
        loadingCount = Math.max(0, loadingCount - 1);
        if (loadingCount === 0) {
          hideLoadingCallback();
        }
      }
      return Promise.reject(error);
    }
  );

  // Response interceptor
  axios.interceptors.response.use(
    (response) => {
      if (hideLoadingCallback) {
        loadingCount = Math.max(0, loadingCount - 1);
        if (loadingCount === 0) {
          // Delay nhỏ để UX mượt hơn
          setTimeout(() => {
            if (loadingCount === 0 && hideLoadingCallback) {
              hideLoadingCallback();
            }
          }, 200);
        }
      }
      return response;
    },
    (error) => {
      if (hideLoadingCallback) {
        loadingCount = Math.max(0, loadingCount - 1);
        if (loadingCount === 0) {
          hideLoadingCallback();
        }
      }
      return Promise.reject(error);
    }
  );
};