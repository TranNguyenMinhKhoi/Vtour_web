import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import FormField from "../../component/FormField";
import { useSendOtp } from "../../hook/auth/useSendOtp";
import { useOTPVerify } from "../../hook/auth/useOTPVerify";
import { AuthContext } from "../../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

interface LoginProps {
  dialogMode?: boolean;
  onClose?: () => void;
}

const Login: React.FC<LoginProps> = ({ dialogMode = false, onClose }) => {
  const navigate = useNavigate();
  const { setToken } = useContext(AuthContext);
  const queryClient = useQueryClient();

  // Hook để gửi OTP
  const { mutate: sendOtp, isPending: isSendOtpPending } = useSendOtp();

  // Hook để verify OTP
  const { mutate: verifyOtp, isPending: isVerifyPending } = useOTPVerify();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  // Trạng thái hiển thị bước OTP
  const [showOtpStep, setShowOtpStep] = useState(false);

  // Lỗi hiển thị (chỉ show inline, không popup)
  const [error, setError] = useState("");

  // Bước 1: Gửi email để tạo OTP
  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Vui lòng nhập email.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Email không hợp lệ.");
      return;
    }

    sendOtp(
      { email },
      {
        onSuccess: () => {
          // Sang bước nhập OTP
          setShowOtpStep(true);
        },
        onError: (err: any) => {
          const message =
            err?.response?.data?.message ??
            err?.message ??
            "Không thể gửi mã OTP. Vui lòng thử lại.";
          setError(message);
        },
      }
    );
  };

  // Bước 2: Xác thực OTP
  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!otp) {
      setError("Vui lòng nhập mã OTP.");
      return;
    }

    verifyOtp(
      { email, otpCode: otp },
      {
        onSuccess: async (res: any) => {
          const token = res?.data?.token || res?.token;
          
          if (token) {
            // Lưu token vào localStorage
            localStorage.setItem("token", token);
            
            // Set token vào context
            if (setToken) {
              setToken(token);
            }

            // QUAN TRỌNG: Invalidate cache để force refetch user info
            await queryClient.invalidateQueries({ queryKey: ["me"] });
            
            // Đợi một chút để đảm bảo query client đã update
            await new Promise(resolve => setTimeout(resolve, 100));

            // Đóng dialog nếu có
            if (dialogMode && onClose) {
              onClose();
            }

            // Navigate về home
            navigate("/home");
          } else {
            setError("Không nhận được token từ server.");
          }
        },
        onError: (err: any) => {
          const message =
            err?.response?.data?.message ??
            err?.message ??
            "Mã OTP không chính xác. Vui lòng thử lại.";
          setError(message);
        },
      }
    );
  };

  // Đăng nhập khách
  const handleGuest = () => {
    if (dialogMode && onClose) {
      onClose();
    } else {
      navigate("/home");
    }
  };

  // Quay lại nhập email
  const handleBackToEmail = () => {
    setShowOtpStep(false);
    setOtp("");
    setError("");
  };

  // Gửi lại OTP
  const handleResendOTP = () => {
    setOtp("");
    setError("");
    sendOtp(
      { email },
      {
        onSuccess: () => {
          // không hiển thị popup, chỉ clear error
        },
        onError: (err: any) => {
          const message =
            err?.response?.data?.message ??
            err?.message ??
            "Không thể gửi lại mã OTP. Vui lòng thử lại.";
          setError(message);
        },
      }
    );
  };

  return (
    <Box
      sx={{
        maxWidth: 420,
        mx: "auto",
        p: 4,
        bgcolor: "white",
        borderRadius: 4,
        textAlign: "center",
      }}
    >
      <Typography color="black" variant="h4" fontWeight="bold" mb={3}>
        {showOtpStep ? "Xác thực OTP" : "Đăng nhập/Đăng ký"}
      </Typography>

      {error && (
        <Typography color="error" variant="body2" mb={2}>
          {error}
        </Typography>
      )}

      {!showOtpStep ? (
        // Bước 1: Nhập email
        <Box component="form" onSubmit={handleSendOTP}>
          <FormField
            placeholder="Nhập email của bạn..."
            type="email"
            icon={<EmailIcon />}
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3, bgcolor: "blueviolet", fontSize: "20px" }}
            disabled={isSendOtpPending}
          >
            {isSendOtpPending ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Tạo mã OTP"
            )}
          </Button>

          <Typography variant="body2" color="text.secondary" mt={2}>
            (Mã OTP sẽ được gửi đến email của bạn)
          </Typography>

          <Box mt={3}>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Hoặc
            </Typography>
            <Button
              fullWidth
              sx={{ bgcolor: "blueviolet", color: "white" }}
              onClick={handleGuest}
            >
              Tiếp tục với tư cách khách
            </Button>
          </Box>
        </Box>
      ) : (
        // Bước 2: Nhập OTP
        <Box component="form" onSubmit={handleVerifyOTP}>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Mã OTP đã được gửi đến email: <strong>{email}</strong>
          </Typography>

          <TextField
            fullWidth
            placeholder="Nhập mã OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <LockIcon sx={{ mr: 1, color: "action.active" }} />
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2, bgcolor: "blueviolet", fontSize: "20px" }}
            disabled={isVerifyPending}
          >
            {isVerifyPending ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Xác thực"
            )}
          </Button>

          <Box mt={2} display="flex" justifyContent="space-between">
            <Button
              variant="text"
              onClick={handleBackToEmail}
              sx={{ color: "blueviolet" }}
            >
              Đổi email
            </Button>
            <Button
              variant="text"
              onClick={handleResendOTP}
              disabled={isSendOtpPending}
              sx={{ color: "blueviolet" }}
            >
              Gửi lại OTP
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Login;