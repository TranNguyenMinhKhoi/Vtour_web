import axios from "axios";

const API_URL = "http://localhost:5000";

export const otpAPI = {
  sendOtp: (email: string) => axios.post(`${API_URL}/send-otp`, { email }),
  verifyOtp: (email: string, otp: string) =>
    axios.post(`${API_URL}/verify-otp`, { email, otp }),
};
