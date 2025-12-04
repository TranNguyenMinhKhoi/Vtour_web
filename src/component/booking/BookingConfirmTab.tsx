import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import type { BookingData } from "./types";
import { useLoginInfo } from "../../hook/auth/useLoginInfo"; // ⭐ Import
import { useLoginDialog } from "../../context/LoginDialogContext"; // ⭐ Import

dayjs.extend(utc);

interface BookingConfirmTabProps {
  bookingData: BookingData;
  onBack: () => void;
  onChange: () => void;
}

const formatTime = (isoOrFormatted?: string) => {
  if (!isoOrFormatted) return "—";
  const timeOnlyRegex = /^\d{1,2}:\d{2}$/;
  if (timeOnlyRegex.test(isoOrFormatted)) return isoOrFormatted;
  try {
    const d = dayjs.utc(isoOrFormatted);
    if (d.isValid()) return d.format("HH:mm");
    const d2 = dayjs(isoOrFormatted);
    if (d2.isValid()) return d2.format("HH:mm");
    return "—";
  } catch {
    return "—";
  }
};

const BookingConfirmTab: React.FC<BookingConfirmTabProps> = ({
  bookingData,
  onBack,
  onChange,
}) => {
  const navigate = useNavigate();
  
  // ⭐ Check login status
  const token = localStorage.getItem("token");
  const hasToken = Boolean(token);
  const { data: loginData } = useLoginInfo({ enabled: hasToken });
  const isLoggedIn = Boolean(loginData && hasToken);
  
  // ⭐ Login dialog context
  const { openLoginDialog } = useLoginDialog();
  
  const {
    departureCity,
    arrivalCity,
    departureStationName,
    arrivalStationName,
    selectedSeats = [],
    totalPrice,
    departureTime,
    arrivalTime,
    scheduleId,
    departureStationId,
    arrivalStationId,
  } = bookingData ?? {};

  const seatText = Array.isArray(selectedSeats)
    ? selectedSeats.join(", ")
    : String(selectedSeats);

  const [openPassengerDialog, setOpenPassengerDialog] = useState(false);
  const [openLoginWarning, setOpenLoginWarning] = useState(false); // ⭐ Dialog cảnh báo
  const [seatNumbers, setSeatNumbers] = useState<string[]>([]);
  const [passengerNames, setPassengerNames] = useState<string[]>([]);
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [pendingPaymentData, setPendingPaymentData] = useState<any>(null); // ⭐ Lưu data tạm

  useEffect(() => {
    const seatsArr: string[] = Array.isArray(selectedSeats)
      ? selectedSeats.map((s) => String(s))
      : String(selectedSeats)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
    setSeatNumbers(seatsArr);
    setPassengerNames((prev) => {
      if (prev.length === seatsArr.length && seatsArr.length > 0) return prev;
      return seatsArr.map(() => "");
    });
  }, [selectedSeats]);

  // ⭐ Theo dõi khi user login xong
  useEffect(() => {
    // Nếu user vừa login và có pending data → tự động chuyển sang payment
    if (isLoggedIn && pendingPaymentData) {
      console.log("✅ User logged in, proceeding to payment...");
      navigate("/payments", { state: { bookingData: pendingPaymentData } });
      setPendingPaymentData(null); // Clear pending data
      setOpenPassengerDialog(false);
    }
  }, [isLoggedIn, pendingPaymentData, navigate]);

  const handleOpenPassengerDialog = () => {
    setOpenPassengerDialog(true);
  };

  const handleClosePassengerDialog = () => {
    setOpenPassengerDialog(false);
  };

  const handlePassengerNameChange = (index: number, value: string) => {
    setPassengerNames((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const validateBeforeSubmit = () => {
    if (seatNumbers.length === 0) {
      alert("Không có ghế để đặt.");
      return false;
    }
    for (let i = 0; i < seatNumbers.length; i++) {
      if (!passengerNames[i] || passengerNames[i].trim() === "") {
        alert(
          `Vui lòng nhập họ tên cho hành khách ${i + 1} (ghế ${
            seatNumbers[i]
          }).`
        );
        return false;
      }
    }
    if (!email || email.trim() === "") {
      alert("Vui lòng nhập email liên hệ để nhận vé.");
      return false;
    }
    return true;
  };

  const handleProceedToPayment = () => {
    if (!validateBeforeSubmit()) return;

    // Validate required IDs
    if (!scheduleId || !departureStationId || !arrivalStationId) {
      alert("Thiếu thông tin chuyến đi hoặc trạm đón/trả. Vui lòng thử lại.");
      return;
    }

    // Prepare payment data
    const paymentData = {
      ...bookingData,
      passengerNames,
      email,
      phone,
    };

    // ⭐ Kiểm tra đăng nhập
    if (!isLoggedIn) {
      // Lưu data tạm và hiển thị cảnh báo
      setPendingPaymentData(paymentData);
      setOpenLoginWarning(true);
      return;
    }

    // Đã đăng nhập → Chuyển sang payment bình thường
    navigate("/payments", { state: { bookingData: paymentData } });
    setOpenPassengerDialog(false);
  };

  // ⭐ Handler đóng dialog cảnh báo
  const handleCloseLoginWarning = () => {
    setOpenLoginWarning(false);
  };

  // ⭐ Handler mở login dialog
  const handleOpenLogin = () => {
    setOpenLoginWarning(false); // Đóng cảnh báo
    openLoginDialog({ skipRedirect: true }); // Mở login dialog
    // Không đóng passenger dialog để giữ nguyên data
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <IconButton onClick={onBack}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" fontWeight={700}>
            Đón & Trả
          </Typography>
        </Box>
        <Button
          onClick={onChange}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            color: "primary.main",
            border: "1px solid",
            borderColor: "primary.main",
            borderRadius: 1,
            px: 2,
            "&:hover": {
              bgcolor: "primary.main",
              color: "white",
            },
          }}
        >
          THAY ĐỔI
        </Button>
      </Box>

      {/* Station Information */}
      <Box
        sx={{
          bgcolor: "white",
          borderRadius: 2,
          p: 2,
          mb: 2,
          border: "1px solid",
          borderColor: "grey.200",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 2 }}>
          {/* Departure Station */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "error.main",
                }}
              />
              <Typography variant="body1" fontWeight={600}>
                {departureStationName ?? departureCity}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
              {departureStationName ? departureCity : "Đang tải..."}
            </Typography>
          </Box>

          {/* Times */}
          <Box sx={{ textAlign: "center", minWidth: 80 }}>
            <Typography
              variant="subtitle1"
              fontWeight={700}
              color="primary.main"
            >
              {formatTime(departureTime)}
            </Typography>
            <Box
              sx={{ width: "100%", height: 1, bgcolor: "grey.300", my: 1 }}
            />
            <Typography
              variant="subtitle1"
              fontWeight={700}
              color="primary.main"
            >
              {formatTime(arrivalTime)}
            </Typography>
          </Box>

          {/* Arrival Station */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "error.main",
                }}
              />
              <Typography variant="body1" fontWeight={600}>
                {arrivalStationName ?? arrivalCity}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
              {arrivalStationName ? arrivalCity : "Đang tải..."}
            </Typography>
          </Box>
        </Box>

        {/* Seat Information */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            pt: 2,
            borderTop: "1px solid",
            borderColor: "grey.200",
          }}
        >
          <Avatar
            sx={{
              width: 60,
              height: 60,
              bgcolor: "grey.100",
              color: "text.primary",
            }}
            src="/placeholder-bus.png"
          />
          <Box>
            <Typography variant="body2" fontWeight={600} color="text.secondary">
              Số ghế
            </Typography>
            <Typography variant="h6" fontWeight={700}>
              {seatText || "—"}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Price Information */}
      <Box
        sx={{
          bgcolor: "white",
          borderRadius: 2,
          p: 2,
          border: "1px solid",
          borderColor: "grey.200",
        }}
      >
        <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>
          Chi tiết giá vé
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography color="text.secondary">Tổng số tiền</Typography>
          <Typography variant="h6" fontWeight={700} color="primary.main">
            {totalPrice ?? "150.000 đ"}
          </Typography>
        </Box>
      </Box>

      {/* Book Button */}
      <Box sx={{ mt: 3 }}>
        <Button
          fullWidth
          variant="contained"
          sx={{
            fontWeight: 700,
            py: 1.5,
            fontSize: "1.1rem",
            borderRadius: 2,
            bgcolor: "blueviolet",
            boxShadow: "lightsteelblue",
            "&:hover": {
              boxShadow: "lightsteelblue",
            },
          }}
          onClick={handleOpenPassengerDialog}
        >
          TIẾN HÀNH ĐẶT CHỖ
        </Button>
      </Box>

      {/* Passenger + Contact Dialog */}
      <Dialog
        open={openPassengerDialog}
        onClose={handleClosePassengerDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Thông tin hành khách</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={2}>
            {seatNumbers.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                Không có ghế được chọn.
              </Typography>
            )}

            {seatNumbers.map((sn, idx) => (
              <Box key={sn + "_" + idx}>
                <Typography variant="subtitle2" fontWeight={600}>
                  {`Hành khách ${idx + 1} | ${sn}`}
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Họ và tên"
                  value={passengerNames[idx] ?? ""}
                  onChange={(e) =>
                    handlePassengerNameChange(idx, e.target.value)
                  }
                  sx={{ mt: 1 }}
                />
              </Box>
            ))}

            <Divider />

            <Box>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                Chi tiết liên hệ
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Vé của bạn sẽ được gửi đến
              </Typography>
              <TextField
                fullWidth
                size="small"
                label="Địa chỉ email"
                placeholder="email@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 1 }}
              />
              <TextField
                fullWidth
                size="small"
                label="Số điện thoại (tùy chọn)"
                placeholder="0123xxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              p: 1,
            }}
          >
            <Button
              variant="outlined"
              onClick={handleClosePassengerDialog}
              sx={{
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Hủy
            </Button>
            <Button
              variant="contained"
              onClick={handleProceedToPayment}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                bgcolor: "blueviolet",
                "&:hover": {
                  bgcolor: "blueviolet",
                  opacity: 0.9,
                },
              }}
            >
              Tiếp tục
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* ⭐ Login Warning Dialog */}
      <Dialog open={openLoginWarning} onClose={handleCloseLoginWarning}>
        <DialogTitle>Yêu cầu đăng nhập</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Hãy tiến hành <strong>Đăng nhập/Đăng ký</strong> để tiếp tục thao tác!
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            💡 Thông tin đặt vé của bạn sẽ được lưu lại
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLoginWarning} sx={{ textTransform: "none" }}>
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleOpenLogin}
            sx={{
              textTransform: "none",
              bgcolor: "blueviolet",
              "&:hover": { bgcolor: "blueviolet", opacity: 0.9 },
            }}
          >
            Đăng nhập/Đăng ký
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookingConfirmTab;