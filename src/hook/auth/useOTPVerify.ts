import { useMutation } from "@tanstack/react-query";
import type {OtpVerifyDto} from "../../dto/auth/otp-verify.dto";
import {authAPI} from "../../api/auth";


export const useOTPVerify = () => {
  return useMutation({
    mutationFn: (data: OtpVerifyDto) => authAPI.otpVerify(data),
  });
};
