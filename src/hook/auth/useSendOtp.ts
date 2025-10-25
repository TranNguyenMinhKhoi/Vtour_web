import { useMutation } from "@tanstack/react-query";
import { authAPI } from "../../api/auth";
import type { SendOtpDto } from "../../dto/auth/send-otp.dto";

export const useSendOtp = () => {
  return useMutation({
    mutationFn: (data: SendOtpDto) => authAPI.sendOtp(data),
  });
};
