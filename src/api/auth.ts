import type { SendOtpDto } from "../dto/auth/send-otp.dto";
import type { OtpVerifyDto } from "../dto/auth/otp-verify.dto";
import axiosClient from "../utils/axiosClient";
import type { UserDto } from "../dto/user/user.dto";

export const authAPI = {

  //Send OTP (login + register)
  sendOtp: (data: SendOtpDto) => {
    return axiosClient.post("api/auth/send-otp", data);
  },

  //OTP verify
  otpVerify: (data: OtpVerifyDto) => {
    return axiosClient.post("api/auth/verify-otp", data);
  },

  //Lấy infor user
  loginInfo: () => {
    const token = localStorage.getItem("token");
    return axiosClient.get<UserDto>("api/auth/me", {
      headers: { 
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
      },
    });
  },

  // Đăng xuất
  logout: () => {
    return axiosClient.post("api/auth/logout");
  },
};
