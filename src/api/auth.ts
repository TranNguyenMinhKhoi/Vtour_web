import type { SendOtpDto } from "../dto/auth/send-otp.dto";
import type { OtpVerifyDto } from "../dto/auth/otp-verify.dto";
import axiosClient from "../utils/axiosClient";
import type { UserDto } from "../dto/user/user.dto";

export const authAPI = {
  // Đăng ký tài khoản
  // register: (data: RegisterDto) => {
  //   return axiosClient.post("api/auth/register", data);
  // },

  // Đăng nhập
  // login: (data: LoginDto) => {
  //   return axiosClient.post("api/auth/login", data);
  // },

  //Send OTP (login + register)
  sendOtp: (data: SendOtpDto) => {
    return axiosClient.post("api/auth/send-otp", data);
  },

  //OTP verify
  otpVerify: (data: OtpVerifyDto) => {
    return axiosClient.post("api/auth/verify-otp", data);
  },

  //Lấy infor user
  // loginInfo: () => {
  //   return axiosClient.get("api/auth/me", {
  //     headers: { "Cache-Control": "no-cache" },
  //   });
  // },
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
