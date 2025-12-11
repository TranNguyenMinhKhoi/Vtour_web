import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Avatar,
  CircularProgress,
  Paper,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import type { BookingData } from "../../component/booking/types";
import axios from "axios";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import CloseIcon from "@mui/icons-material/Close";

dayjs.extend(utc);

// const API_BASE = "http://localhost:5000";
const API_BASE = "https://bus-ticket-be-dun.vercel.app";


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

interface PaymentPageData extends BookingData {
  passengerNames: string[];
  email: string;
  phone: string;
}

interface VoucherData {
  id: string;
  code: string;
  name?: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
}

const Payment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state?.bookingData as PaymentPageData;

  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [paymentId, setPaymentId] = useState<string | null>(null);
  
  // QR Code states
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [showQR, setShowQR] = useState<boolean>(false);
  const [qrLoading, setQrLoading] = useState<boolean>(false);
  const [bankInfo, setBankInfo] = useState<any>(null);
  const [instructions, setInstructions] = useState<string[]>([]);
  
  // Voucher states
  const [voucherCode, setVoucherCode] = useState<string>("");
  const [appliedVoucher, setAppliedVoucher] = useState<VoucherData | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [applyingVoucher, setApplyingVoucher] = useState<boolean>(false);
  const [voucherError, setVoucherError] = useState<string | null>(null);
  
  // Confirmation states
  const [confirmingPayment, setConfirmingPayment] = useState<boolean>(false);
  const [openSuccessDialog, setOpenSuccessDialog] = useState<boolean>(false);

  useEffect(() => {
    if (!bookingData) {
      alert("Không tìm thấy thông tin đặt vé. Vui lòng thử lại.");
      navigate("/");
    }
  }, [bookingData, navigate]);

  if (!bookingData) {
    return null;
  }

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
    passengerNames = [],
    email,
    phone,
  } = bookingData;

  const seatText = Array.isArray(selectedSeats)
    ? selectedSeats.join(", ")
    : String(selectedSeats);

  // Parse totalPrice
  const parsedTotalPrice = typeof totalPrice === "string" 
    ? parseFloat(totalPrice.replace(/[^\d]/g, "")) 
    : totalPrice || 0;

  // Calculate final amount
  const finalAmount = parsedTotalPrice - discountAmount;

  // Apply Voucher
  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) {
      setVoucherError("Vui lòng nhập mã voucher");
      return;
    }

    try {
      setApplyingVoucher(true);
      setVoucherError(null);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_BASE}/api/voucher/validate`,
        {
          code: voucherCode.trim().toUpperCase(),
          bookingAmount: parsedTotalPrice,
          routeId: null, 
          companyId: null, 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setAppliedVoucher(response.data.voucher);
        setDiscountAmount(response.data.discountAmount);
        setVoucherError(null);
      }
    } catch (error: any) {
      console.error("❌ Voucher error:", error);
      setVoucherError(
        error?.response?.data?.message || "Không thể áp dụng voucher"
      );
      setAppliedVoucher(null);
      setDiscountAmount(0);
    } finally {
      setApplyingVoucher(false);
    }
  };

  // Remove Voucher
  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setDiscountAmount(0);
    setVoucherCode("");
    setVoucherError(null);
  };

  // Generate QR Code
  const handleGenerateQR = async () => {
    if (!paymentMethod) {
      alert("Vui lòng chọn phương thức thanh toán");
      return;
    }

    if (!scheduleId || !departureStationId || !arrivalStationId) {
      alert("Thiếu thông tin chuyến đi. Vui lòng thử lại.");
      return;
    }

    try {
      setQrLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_BASE}/api/payments/generate-qr-only`,
        {
          scheduleId,
          departureStationId,
          arrivalStationId,
          passengers: selectedSeats.map((seatNum: any, idx: number) => ({
            fullName: passengerNames[idx] ?? "",
            seatNumber: String(seatNum),
            idNumber: null,
          })),
          contactInfo: {
            email,
            phone,
          },
          paymentMethod,
          voucherCode: appliedVoucher?.code || null, 
          discountAmount: discountAmount, 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ QR Generated:", response.data);

      if (response.data.success) {
        setPaymentId(response.data.payment.paymentId);
        setQrCodeUrl(response.data.qrCode.imageUrl);
        setBankInfo(response.data.bankInfo);
        setInstructions(response.data.instructions || []);
        setShowQR(true);
      } else {
        alert(response.data.message || "Không thể tạo mã QR");
      }
    } catch (error: any) {
      console.error("❌ QR Generation error:", error);
      alert(
        error?.response?.data?.message ||
          "Không thể tạo mã QR. Vui lòng thử lại."
      );
    } finally {
      setQrLoading(false);
    }
  };

  // Confirm Payment
  const handleConfirmPayment = async () => {
    if (!paymentId) {
      alert("Không tìm thấy thông tin thanh toán");
      return;
    }

    try {
      setConfirmingPayment(true);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_BASE}/api/payments/confirm-and-book`,
        {
          paymentId: paymentId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Payment confirmed:", response.data);

      if (response.data.success) {
        setOpenSuccessDialog(true);
      } else {
        alert(response.data.message || "Không thể xác nhận thanh toán");
      }
    } catch (error: any) {
      console.error("❌ Payment confirmation error:", error);
      alert(
        error?.response?.data?.message ||
          "Không thể xác nhận thanh toán. Vui lòng thử lại."
      );
    } finally {
      setConfirmingPayment(false);
    }
  };

  const handleSuccessDialogClose = () => {
    setOpenSuccessDialog(false);
    window.location.href = "/booking";
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
        p: 3,
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <Typography color="black" variant="h4" fontWeight={700} sx={{ mb: 3 }}>
          Thanh toán
        </Typography>

        <Box sx={{ display: "flex", gap: 3 }}>
          {/* Left Side - Payment Methods */}
          <Box sx={{ flex: "0 0 40%" }}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Phương thức thanh toán
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box
                  sx={{
                    p: 2,
                    border: "2px solid",
                    borderColor:
                      paymentMethod === "momo" ? "primary.main" : "grey.300",
                    borderRadius: 2,
                    cursor: "pointer",
                    bgcolor: paymentMethod === "momo" ? "#fff5f5" : "white",
                    transition: "all 0.2s",
                    "&:hover": {
                      borderColor: "primary.main",
                      bgcolor: "#fff5f5",
                    },
                  }}
                  onClick={() => setPaymentMethod("momo")}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      component="img"
                      src="/momo_logo.png"
                      alt="Momo"
                      sx={{ width: 40, height: 40 }}
                    />
                    <Box>
                      <Typography variant="body1" fontWeight={600}>
                        Thanh toán qua Momo
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Ví điện tử Momo
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box
                  sx={{
                    p: 2,
                    border: "2px solid",
                    borderColor:
                      paymentMethod === "bank_transfer"
                        ? "primary.main"
                        : "grey.300",
                    borderRadius: 2,
                    cursor: "pointer",
                    bgcolor:
                      paymentMethod === "bank_transfer" ? "#fff5f5" : "white",
                    transition: "all 0.2s",
                    "&:hover": {
                      borderColor: "primary.main",
                      bgcolor: "#fff5f5",
                    },
                  }}
                  onClick={() => setPaymentMethod("bank_transfer")}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: "primary.main",
                        borderRadius: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: 700,
                      }}
                    >
                      ATM
                    </Box>
                    <Box>
                      <Typography variant="body1" fontWeight={600}>
                        Thanh toán qua ngân hàng
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Chuyển khoản ngân hàng
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* Generate QR Button */}
              <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={handleGenerateQR}
                disabled={!paymentMethod || qrLoading || showQR}
                sx={{
                  mt: 3,
                  fontWeight: 600,
                  py: 1.5,
                  borderColor: "primary.main",
                  color: "primary.main",
                  "&:hover": {
                    borderColor: "primary.dark",
                    bgcolor: "primary.light",
                  },
                }}
              >
                {qrLoading ? (
                  <CircularProgress size={24} />
                ) : showQR ? (
                  "Mã QR đã được tạo"
                ) : (
                  "TẠO MÃ QR"
                )}
              </Button>

              {/* QR Code Display */}
              {showQR && qrCodeUrl && (
                <Box sx={{ mt: 3 }}>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight={600}>
                      📱 Quét mã QR và chuyển khoản để hoàn tất đặt vé
                    </Typography>
                  </Alert>

                  <Box sx={{ textAlign: "center", mb: 2 }}>
                    <Box
                      component="img"
                      src={qrCodeUrl}
                      alt="VietQR Code"
                      sx={{
                        width: "100%",
                        maxWidth: 300,
                        height: "auto",
                        border: "2px solid",
                        borderColor: "grey.300",
                        borderRadius: 2,
                        p: 1,
                        bgcolor: "white",
                      }}
                    />
                  </Box>

                  {bankInfo && (
                    <Paper sx={{ p: 2, bgcolor: "#f9f9f9", mb: 2 }}>
                      <Typography
                        variant="subtitle2"
                        fontWeight={700}
                        sx={{ mb: 1 }}
                      >
                        Thông tin chuyển khoản:
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        🏦 Ngân hàng: <strong>{bankInfo.bankName}</strong>
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        👤 Chủ tài khoản:{" "}
                        <strong>{bankInfo.accountHolder}</strong>
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        💳 Số tài khoản:{" "}
                        <strong>{bankInfo.accountNumber}</strong>
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        💰 Số tiền:{" "}
                        <strong style={{ color: "#d32f2f" }}>
                          {new Intl.NumberFormat("vi-VN").format(
                            bankInfo.transferAmount
                          )}{" "}
                          đ
                        </strong>
                      </Typography>
                      <Typography variant="body2">
                        📝 Nội dung: <strong>{bankInfo.transferContent}</strong>
                      </Typography>
                    </Paper>
                  )}

                  {instructions.length > 0 && (
                    <Paper sx={{ p: 2, bgcolor: "#fff3e0", mb: 2 }}>
                      <Typography
                        variant="subtitle2"
                        fontWeight={700}
                        sx={{ mb: 1 }}
                      >
                        📋 Hướng dẫn:
                      </Typography>
                      {instructions.map((instruction, idx) => (
                        <Typography
                          key={idx}
                          variant="body2"
                          sx={{ mb: 0.5 }}
                        >
                          {instruction}
                        </Typography>
                      ))}
                    </Paper>
                  )}

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleConfirmPayment}
                    disabled={confirmingPayment}
                    sx={{
                      mt: 2,
                      fontWeight: 700,
                      py: 1.5,
                      bgcolor: "success.main",
                      "&:hover": {
                        bgcolor: "success.dark",
                      },
                    }}
                  >
                    {confirmingPayment ? (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <CircularProgress
                          size={20}
                          sx={{ color: "white" }}
                        />
                        <span>Đang xác nhận...</span>
                      </Box>
                    ) : (
                      "✅ XÁC NHẬN ĐÃ THANH TOÁN"
                    )}
                  </Button>
                </Box>
              )}

              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  bgcolor: "#e3f2fd",
                  borderRadius: 1,
                }}
              >
                <Typography variant="body2" color="primary">
                  💡 Vé sẽ được gửi qua email sau khi thanh toán thành công
                </Typography>
              </Box>
            </Paper>
          </Box>

          {/* Right Side - Booking Information */}
          <Box sx={{ flex: 1 }}>
            <Paper sx={{ p: 3, borderRadius: 2, mb: 2 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Thông tin chuyến đi
              </Typography>

              {/* Station Information */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 2,
                  mb: 3,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        bgcolor: "error.main",
                      }}
                    />
                    <Typography variant="body1" fontWeight={600}>
                      {departureStationName ?? departureCity}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ ml: 2.5 }}
                  >
                    {departureStationName ? departureCity : "Đang tải..."}
                  </Typography>
                </Box>

                <Box sx={{ textAlign: "center", minWidth: 80 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    color="primary.main"
                  >
                    {formatTime(departureTime)}
                  </Typography>
                  <Box
                    sx={{
                      width: "100%",
                      height: 2,
                      bgcolor: "grey.300",
                      my: 1,
                    }}
                  />
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    color="primary.main"
                  >
                    {formatTime(arrivalTime)}
                  </Typography>
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        bgcolor: "success.main",
                      }}
                    />
                    <Typography variant="body1" fontWeight={600}>
                      {arrivalStationName ?? arrivalCity}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ ml: 2.5 }}
                  >
                    {arrivalStationName ? arrivalCity : "Đang tải..."}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Seat Information */}
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
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
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color="text.secondary"
                  >
                    Số ghế
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {seatText || "—"}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Passenger Information */}
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                Thông tin hành khách
              </Typography>
              {passengerNames.map((name, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    py: 1,
                  }}
                >
                  <Typography variant="body2">Hành khách {idx + 1}:</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {name}
                  </Typography>
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />

              {/* Contact Information */}
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                Thông tin liên hệ
              </Typography>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", py: 1 }}
              >
                <Typography variant="body2">Email:</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {email}
                </Typography>
              </Box>
              {phone && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    py: 1,
                  }}
                >
                  <Typography variant="body2">Số điện thoại:</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {phone}
                  </Typography>
                </Box>
              )}
            </Paper>

            {/* Voucher Section */}
            <Paper sx={{ p: 3, borderRadius: 2, mb: 2 }}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>
                🎟️ Mã giảm giá
              </Typography>

              {!appliedVoucher ? (
                <Box sx={{ display: "flex", gap: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Nhập mã giảm giá"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                    disabled={applyingVoucher || showQR}
                    error={!!voucherError}
                    helperText={voucherError}
                  />
                  <Button
                    variant="outlined"
                    onClick={handleApplyVoucher}
                    disabled={applyingVoucher || showQR}
                    sx={{ minWidth: 100 }}
                  >
                    {applyingVoucher ? (
                      <CircularProgress size={20} />
                    ) : (
                      "Áp dụng"
                    )}
                  </Button>
                </Box>
              ) : (
                <Box
                  sx={{
                    bgcolor: "#f0f8ff",
                    p: 2,
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: "primary.main",
                  }}
                >
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <LocalOfferIcon color="primary" />
                      <Box>
                        <Typography variant="body2" fontWeight={700}>
                          {appliedVoucher.code}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Giảm{" "}
                          {appliedVoucher.discountType === "percentage"
                            ? `${appliedVoucher.discountValue}%`
                            : `${appliedVoucher.discountValue.toLocaleString(
                                "vi-VN"
                              )}đ`}
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={handleRemoveVoucher}
                      disabled={showQR}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              )}
            </Paper>

            {/* Price Summary */}
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>
                Chi tiết giá vé
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography color="text.secondary">Tổng tiền vé</Typography>
                <Typography variant="body1" fontWeight={600}>
                  {parsedTotalPrice.toLocaleString("vi-VN")} đ
                </Typography>
              </Box>

              {appliedVoucher && discountAmount > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography color="success.main">Giảm giá</Typography>
                  <Typography variant="body1" fontWeight={600} color="success.main">
                    - {discountAmount.toLocaleString("vi-VN")} đ
                  </Typography>
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" fontWeight={700}>
                  Tổng thanh toán
                </Typography>
                <Typography variant="h5" fontWeight={700} color="primary.main">
                  {finalAmount.toLocaleString("vi-VN")} đ
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>

      {/* Success Dialog */}
      <Dialog open={openSuccessDialog} onClose={handleSuccessDialogClose}>
        <DialogTitle>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h5" fontWeight={700} color="success.main">
              ✅ Thanh toán thành công!
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: "center", py: 2 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Đặt vé của bạn đã được xác nhận thành công!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              📧 Vé điện tử đã được gửi đến email: <strong>{email}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Vui lòng kiểm tra hộp thư để xem chi tiết vé.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button
            variant="contained"
            onClick={handleSuccessDialogClose}
            sx={{
              bgcolor: "blueviolet",
              px: 4,
              "&:hover": {
                bgcolor: "blueviolet",
                opacity: 0.9,
              },
            }}
          >
            Xem vé của tôi
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Payment;