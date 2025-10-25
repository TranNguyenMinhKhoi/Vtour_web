import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useOTPVerify } from "../../hook/auth/useOTPVerify";

interface OTPRegisterProps {
  initialEmail?: string; // when embedded, parent can pass email để autofill
}

const OTPRegister: React.FC<OTPRegisterProps> = ({ initialEmail }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as { email?: string };
  const initialEmailFromLocation = state.email ?? "";

  // ưu tiên email được truyền từ props (Register component), nếu không có thì dùng từ location.state
  const [email, setEmail] = useState(initialEmail ?? initialEmailFromLocation);
  const [otp, setOtp] = useState("");

  const { mutate: verifyOtp, isPending } = useOTPVerify();

  // dialog thông báo kết quả verify
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMsg, setDialogMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // nếu có email từ prop thì autofill (ví dụ khi được nhúng trong Register)
    if (initialEmail) setEmail(initialEmail);
  }, [initialEmail]);

  const handleVerify = () => {
    if (!email || !otp) {
      setDialogMsg("Vui lòng điền email và OTP.");
      setIsSuccess(false);
      setDialogOpen(true);
      return;
    }

    verifyOtp(
      { email, otp },
      {
        onSuccess: (res: any) => {
          const message =
            res?.data?.message ?? res?.message ?? "Xác thực OTP thành công.";
          setDialogMsg(message);
          setIsSuccess(true);
          setDialogOpen(true);
        },
        onError: (err: any) => {
          const message =
            err?.response?.data?.message ?? err?.message ?? "Xác thực thất bại.";
          setDialogMsg(message);
          setIsSuccess(false);
          setDialogOpen(true);
        },
      }
    );
  };

  return (
    <>
      {/* Form chính (có thể được render cả như 1 trang hoặc nhúng vào dialog của Register) */}
      <Box
        sx={{
          maxWidth: 420,
          mx: "auto",
          mt: 0,
          p: 2,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 0,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h6" textAlign="center">
          Xác thực OTP
        </Typography>

        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />

        <TextField
          label="Nhập OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          fullWidth
        />

        <Button
          sx={{
            bgcolor: "blueviolet",
            color: "white",
          }}
          variant="contained"
          onClick={handleVerify}
          disabled={isPending}
        >
          {isPending ? <CircularProgress size={20} /> : "Xác thực OTP"}
        </Button>
      </Box>

      {/* Dialog hiển thị kết quả của OTP */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Thông báo</DialogTitle>
        <DialogContent>
          <Typography>{dialogMsg}</Typography>
        </DialogContent>
        <DialogActions>
          {isSuccess ? (
            <Button
              onClick={() => {
                setDialogOpen(false);
                navigate("/login");
              }}
              variant="contained"
              sx={{
                bgcolor: "blueviolet",
                color: "white",
              }}
            >
              Chuyển đến Đăng nhập
            </Button>
          ) : (
            <Button onClick={() => setDialogOpen(false)} variant="outlined">
              Đóng
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OTPRegister;
