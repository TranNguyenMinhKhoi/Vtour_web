// // import React, { useState, useEffect } from "react";
// // import {
// //   Box,
// //   Button,
// //   Typography,
// //   Avatar,
// //   CircularProgress,
// //   Paper,
// //   Divider,
// // } from "@mui/material";
// // import { useLocation, useNavigate } from "react-router-dom";
// // import dayjs from "dayjs";
// // import utc from "dayjs/plugin/utc";
// // import type { BookingData } from "../../component/booking/types";
// // import { useCreateBooking } from "../../hook/booking/useCreateBooking";
// // import type { CreateBookingDto } from "../../dto/booking/create-booking.dto";
// // //
// // import { QRCodeCanvas } from "qrcode.react";

// // dayjs.extend(utc);

// // const formatTime = (isoOrFormatted?: string) => {
// //   if (!isoOrFormatted) return "—";
// //   const timeOnlyRegex = /^\d{1,2}:\d{2}$/;
// //   if (timeOnlyRegex.test(isoOrFormatted)) return isoOrFormatted;
// //   try {
// //     const d = dayjs.utc(isoOrFormatted);
// //     if (d.isValid()) return d.format("HH:mm");
// //     const d2 = dayjs(isoOrFormatted);
// //     if (d2.isValid()) return d2.format("HH:mm");
// //     return "—";
// //   } catch {
// //     return "—";
// //   }
// // };

// // interface PaymentPageData extends BookingData {
// //   passengerNames: string[];
// //   email: string;
// //   phone: string;
// // }

// // const Payment: React.FC = () => {
// //   const location = useLocation();
// //   const navigate = useNavigate();
// //   const bookingData = location.state?.bookingData as PaymentPageData;

// //   const [paymentMethod, setPaymentMethod] = useState<string>("");
// //   const [submitting, setSubmitting] = useState<boolean>(false);
// //   const [, setShowQRButton] = useState<boolean>(false);

// //   const { mutateAsync: createBooking } = useCreateBooking();

// //   useEffect(() => {
// //     // Redirect nếu không có dữ liệu booking
// //     if (!bookingData) {
// //       alert("Không tìm thấy thông tin đặt vé. Vui lòng thử lại.");
// //       navigate("/");
// //     }
// //   }, [bookingData, navigate]);

// //   // Show QR button when payment method is selected
// //   useEffect(() => {
// //     setShowQRButton(paymentMethod !== "");
// //   }, [paymentMethod]);

// //   if (!bookingData) {
// //     return null;
// //   }

// //   const {
// //     departureCity,
// //     arrivalCity,
// //     departureStationName,
// //     arrivalStationName,
// //     selectedSeats = [],
// //     totalPrice,
// //     departureTime,
// //     arrivalTime,
// //     scheduleId,
// //     departureStationId,
// //     arrivalStationId,
// //     passengerNames = [],
// //     email,
// //     phone,
// //   } = bookingData;

// //   const seatText = Array.isArray(selectedSeats)
// //     ? selectedSeats.join(", ")
// //     : String(selectedSeats);

// //   const handlePayment = async () => {
// //     // Validate required IDs
// //     if (!scheduleId || !departureStationId || !arrivalStationId) {
// //       alert("Thiếu thông tin chuyến đi hoặc trạm đón/trả. Vui lòng thử lại.");
// //       return;
// //     }

// //     const seatNumbers: string[] = Array.isArray(selectedSeats)
// //       ? selectedSeats.map((s) => String(s))
// //       : String(selectedSeats)
// //           .split(",")
// //           .map((s) => s.trim())
// //           .filter(Boolean);

// //     const passengersPayload = seatNumbers.map((sn, idx) => ({
// //       fullName: passengerNames[idx] ?? "",
// //       seatNumber: sn,
// //       idNumber: null,
// //     }));

// //     const payload: CreateBookingDto = {
// //       scheduleId: scheduleId,
// //       departureStop: departureStationId,
// //       arrivalStop: arrivalStationId,
// //       passengers: passengersPayload,
// //       contactInfo: {
// //         email,
// //         phone,
// //       },
// //       specialRequests: `Payment method: ${paymentMethod}`,
// //     };

// //     try {
// //       setSubmitting(true);
// //       console.log("➡ Sending booking payload:", payload);

// //       const res = await createBooking(payload);
// //       console.log(res);

// //       alert(
// //         "✅ Đặt vé thành công! Email xác nhận đã được gửi đến địa chỉ liên hệ."
// //       );
// //       // navigate("/booking");
// //       window.location.href = "/booking"
// //     } catch (err: any) {
// //       console.error("❌ Booking error:", err);
// //       alert(err?.message || "Không thể tạo đặt vé. Vui lòng thử lại sau.");
// //     } finally {
// //       setSubmitting(false);
// //     }
// //   };

// //   // Sinh chuỗi ngẫu nhiên giả lập dữ liệu thanh toán
// //   const [qrValue, setQrValue] = useState<string>("");
// //   const [showQR, setShowQR] = useState<boolean>(false);

// //   const handleGenerateFakeQR = () => {
// //     const fakeTransaction = {
// //       transactionId: `TXN_${Math.random().toString(36).substring(2, 10)}`,
// //       amount: (Math.random() * 1000000).toFixed(0),
// //       createdAt: new Date().toISOString(),
// //       paymentMethod,
// //     };
// //     setQrValue(JSON.stringify(fakeTransaction));
// //     setShowQR(true);
// //   };

// //   return (
// //     <Box
// //       sx={{
// //         minHeight: "100vh",
// //         bgcolor: "#f5f5f5",
// //         p: 3,
// //       }}
// //     >
// //       <Box sx={{ maxWidth: 1200, mx: "auto" }}>
// //         <Typography color="black" variant="h4" fontWeight={700} sx={{ mb: 3 }}>
// //           Thanh toán
// //         </Typography>

// //         <Box sx={{ display: "flex", gap: 3 }}>
// //           {/* Left Side - Payment Methods */}
// //           <Box sx={{ flex: "0 0 40%" }}>
// //             <Paper sx={{ p: 3, borderRadius: 2 }}>
// //               <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
// //                 Phương thức thanh toán
// //               </Typography>

// //               <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
// //                 <Box
// //                   sx={{
// //                     p: 2,
// //                     border: "2px solid",
// //                     borderColor:
// //                       paymentMethod === "momo" ? "primary.main" : "grey.300",
// //                     borderRadius: 2,
// //                     cursor: "pointer",
// //                     bgcolor: paymentMethod === "momo" ? "#fff5f5" : "white",
// //                     transition: "all 0.2s",
// //                     "&:hover": {
// //                       borderColor: "primary.main",
// //                       bgcolor: "#fff5f5",
// //                     },
// //                   }}
// //                   onClick={() => setPaymentMethod("momo")}
// //                 >
// //                   <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
// //                     <Box
// //                       component="img"
// //                       src="/momo_logo.png"
// //                       alt="Momo"
// //                       sx={{ width: 40, height: 40 }}
// //                     />
// //                     <Box>
// //                       <Typography variant="body1" fontWeight={600}>
// //                         Thanh toán qua Momo
// //                       </Typography>
// //                       <Typography variant="caption" color="text.secondary">
// //                         Ví điện tử Momo
// //                       </Typography>
// //                     </Box>
// //                   </Box>
// //                 </Box>

// //                 <Box
// //                   sx={{
// //                     p: 2,
// //                     border: "2px solid",
// //                     borderColor:
// //                       paymentMethod === "bank" ? "primary.main" : "grey.300",
// //                     borderRadius: 2,
// //                     cursor: "pointer",
// //                     bgcolor: paymentMethod === "bank" ? "#fff5f5" : "white",
// //                     transition: "all 0.2s",
// //                     "&:hover": {
// //                       borderColor: "primary.main",
// //                       bgcolor: "#fff5f5",
// //                     },
// //                   }}
// //                   onClick={() => setPaymentMethod("bank")}
// //                 >
// //                   <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
// //                     <Box
// //                       sx={{
// //                         width: 40,
// //                         height: 40,
// //                         bgcolor: "primary.main",
// //                         borderRadius: 1,
// //                         display: "flex",
// //                         alignItems: "center",
// //                         justifyContent: "center",
// //                         color: "white",
// //                         fontWeight: 700,
// //                       }}
// //                     >
// //                       ATM
// //                     </Box>
// //                     <Box>
// //                       <Typography variant="body1" fontWeight={600}>
// //                         Thanh toán qua ngân hàng
// //                       </Typography>
// //                       <Typography variant="caption" color="text.secondary">
// //                         Chuyển khoản ngân hàng
// //                       </Typography>
// //                     </Box>
// //                   </Box>
// //                 </Box>
// //               </Box>
// //               <Button
// //                 fullWidth
// //                 variant="outlined"
// //                 size="large"
// //                 onClick={handleGenerateFakeQR}
// //                 sx={{
// //                   mt: 3,
// //                   fontWeight: 600,
// //                   py: 1.5,
// //                   borderColor: "primary.main",
// //                   color: "primary.main",
// //                   "&:hover": {
// //                     borderColor: "primary.dark",
// //                     bgcolor: "primary.light",
// //                   },
// //                 }}
// //               >
// //                 TẠO MÃ QR
// //               </Button>

// //               {showQR && (
// //                 <Box sx={{ textAlign: "center", mt: 3 }}>
// //                   <Typography
// //                     variant="subtitle1"
// //                     fontWeight={600}
// //                     sx={{ mb: 1 }}
// //                   >
// //                     {/* Mã QR giả lập */}
// //                   </Typography>
// //                   <QRCodeCanvas
// //                     value={qrValue}
// //                     size={200}
// //                     bgColor="#ffffff"
// //                     fgColor="#000000"
// //                     level="H"
// //                     includeMargin={true}
// //                   />
// //                   <Typography
// //                     variant="caption"
// //                     display="block"
// //                     sx={{ mt: 1, color: "text.secondary" }}
// //                   >
// //                     {/* (QR này chỉ để minh hoạ, không thực hiện thanh toán thật) */}
// //                   </Typography>
// //                 </Box>
// //               )}

// //               {/* {showQRButton && (
// //                 <Button
// //                   fullWidth
// //                   variant="outlined"
// //                   size="large"
// //                   onClick={() =>
// //                     alert("Tính năng tạo mã QR đang được phát triển")
// //                   }
// //                   sx={{
// //                     mt: 3,
// //                     fontWeight: 600,
// //                     py: 1.5,
// //                     borderColor: "primary.main",
// //                     color: "primary.main",
// //                     "&:hover": {
// //                       borderColor: "primary.dark",
// //                       bgcolor: "primary.light",
// //                     },
// //                   }}
// //                 >
// //                   TẠO MÃ QR
// //                 </Button>
// //               )} */}

// //               <Box
// //                 sx={{
// //                   mt: 3,
// //                   p: 2,
// //                   bgcolor: "#e3f2fd",
// //                   borderRadius: 1,
// //                 }}
// //               >
// //                 <Typography variant="body2" color="primary">
// //                   💡 Vé sẽ được gửi qua email sau khi thanh toán thành công
// //                 </Typography>
// //               </Box>
// //             </Paper>
// //           </Box>

// //           {/* Right Side - Booking Information */}
// //           <Box sx={{ flex: 1 }}>
// //             <Paper sx={{ p: 3, borderRadius: 2, mb: 2 }}>
// //               <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
// //                 Thông tin chuyến đi
// //               </Typography>

// //               {/* Station Information */}
// //               <Box
// //                 sx={{
// //                   display: "flex",
// //                   alignItems: "flex-start",
// //                   gap: 2,
// //                   mb: 3,
// //                 }}
// //               >
// //                 {/* Departure Station */}
// //                 <Box sx={{ flex: 1 }}>
// //                   <Box
// //                     sx={{
// //                       display: "flex",
// //                       alignItems: "center",
// //                       gap: 1,
// //                       mb: 1,
// //                     }}
// //                   >
// //                     <Box
// //                       sx={{
// //                         width: 10,
// //                         height: 10,
// //                         borderRadius: "50%",
// //                         bgcolor: "error.main",
// //                       }}
// //                     />
// //                     <Typography variant="body1" fontWeight={600}>
// //                       {departureStationName ?? departureCity}
// //                     </Typography>
// //                   </Box>
// //                   <Typography
// //                     variant="body2"
// //                     color="text.secondary"
// //                     sx={{ ml: 2.5 }}
// //                   >
// //                     {departureStationName ? departureCity : "Đang tải..."}
// //                   </Typography>
// //                 </Box>

// //                 {/* Times */}
// //                 <Box sx={{ textAlign: "center", minWidth: 80 }}>
// //                   <Typography
// //                     variant="subtitle1"
// //                     fontWeight={700}
// //                     color="primary.main"
// //                   >
// //                     {formatTime(departureTime)}
// //                   </Typography>
// //                   <Box
// //                     sx={{
// //                       width: "100%",
// //                       height: 2,
// //                       bgcolor: "grey.300",
// //                       my: 1,
// //                     }}
// //                   />
// //                   <Typography
// //                     variant="subtitle1"
// //                     fontWeight={700}
// //                     color="primary.main"
// //                   >
// //                     {formatTime(arrivalTime)}
// //                   </Typography>
// //                 </Box>

// //                 {/* Arrival Station */}
// //                 <Box sx={{ flex: 1 }}>
// //                   <Box
// //                     sx={{
// //                       display: "flex",
// //                       alignItems: "center",
// //                       gap: 1,
// //                       mb: 1,
// //                     }}
// //                   >
// //                     <Box
// //                       sx={{
// //                         width: 10,
// //                         height: 10,
// //                         borderRadius: "50%",
// //                         bgcolor: "success.main",
// //                       }}
// //                     />
// //                     <Typography variant="body1" fontWeight={600}>
// //                       {arrivalStationName ?? arrivalCity}
// //                     </Typography>
// //                   </Box>
// //                   <Typography
// //                     variant="body2"
// //                     color="text.secondary"
// //                     sx={{ ml: 2.5 }}
// //                   >
// //                     {arrivalStationName ? arrivalCity : "Đang tải..."}
// //                   </Typography>
// //                 </Box>
// //               </Box>

// //               <Divider sx={{ my: 2 }} />

// //               {/* Seat Information */}
// //               <Box
// //                 sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
// //               >
// //                 <Avatar
// //                   sx={{
// //                     width: 60,
// //                     height: 60,
// //                     bgcolor: "grey.100",
// //                     color: "text.primary",
// //                   }}
// //                   src="/placeholder-bus.png"
// //                 />
// //                 <Box>
// //                   <Typography
// //                     variant="body2"
// //                     fontWeight={600}
// //                     color="text.secondary"
// //                   >
// //                     Số ghế
// //                   </Typography>
// //                   <Typography variant="h6" fontWeight={700}>
// //                     {seatText || "—"}
// //                   </Typography>
// //                 </Box>
// //               </Box>

// //               {/* Passenger Information */}
// //               <Divider sx={{ my: 2 }} />
// //               <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
// //                 Thông tin hành khách
// //               </Typography>
// //               {passengerNames.map((name, idx) => (
// //                 <Box
// //                   key={idx}
// //                   sx={{
// //                     display: "flex",
// //                     justifyContent: "space-between",
// //                     py: 1,
// //                   }}
// //                 >
// //                   <Typography variant="body2">Hành khách {idx + 1}:</Typography>
// //                   <Typography variant="body2" fontWeight={600}>
// //                     {name}
// //                   </Typography>
// //                 </Box>
// //               ))}

// //               <Divider sx={{ my: 2 }} />

// //               {/* Contact Information */}
// //               <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
// //                 Thông tin liên hệ
// //               </Typography>
// //               <Box
// //                 sx={{ display: "flex", justifyContent: "space-between", py: 1 }}
// //               >
// //                 <Typography variant="body2">Email:</Typography>
// //                 <Typography variant="body2" fontWeight={600}>
// //                   {email}
// //                 </Typography>
// //               </Box>
// //               {phone && (
// //                 <Box
// //                   sx={{
// //                     display: "flex",
// //                     justifyContent: "space-between",
// //                     py: 1,
// //                   }}
// //                 >
// //                   <Typography variant="body2">Số điện thoại:</Typography>
// //                   <Typography variant="body2" fontWeight={600}>
// //                     {phone}
// //                   </Typography>
// //                 </Box>
// //               )}
// //             </Paper>

// //             {/* Price Summary */}
// //             <Paper sx={{ p: 3, borderRadius: 2 }}>
// //               <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>
// //                 Chi tiết giá vé
// //               </Typography>

// //               <Box
// //                 sx={{
// //                   display: "flex",
// //                   justifyContent: "space-between",
// //                   alignItems: "center",
// //                   mb: 2,
// //                 }}
// //               >
// //                 <Typography color="text.secondary">Tổng số tiền</Typography>
// //                 <Typography variant="h5" fontWeight={700} color="primary.main">
// //                   {totalPrice ?? "150.000 đ"}
// //                 </Typography>
// //               </Box>

// //               {/* Payment Button */}
// //               <Button
// //                 fullWidth
// //                 variant="contained"
// //                 size="large"
// //                 disabled={submitting}
// //                 onClick={handlePayment}
// //                 sx={{
// //                   fontWeight: 700,
// //                   py: 1.5,
// //                   fontSize: "1.1rem",
// //                   borderRadius: 2,
// //                   bgcolor: "blueviolet",
// //                   "&:hover": {
// //                     bgcolor: "blueviolet",
// //                     opacity: 0.9,
// //                   },
// //                   "&:disabled": {
// //                     bgcolor: "grey.400",
// //                   },
// //                 }}
// //               >
// //                 {submitting ? (
// //                   <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
// //                     <CircularProgress size={20} sx={{ color: "white" }} />
// //                     <span>Đang xử lý...</span>
// //                   </Box>
// //                 ) : (
// //                   "THANH TOÁN"
// //                 )}
// //               </Button>
// //             </Paper>
// //           </Box>
// //         </Box>
// //       </Box>
// //     </Box>
// //   );
// // };

// // export default Payment;


// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   Typography,
//   Avatar,
//   CircularProgress,
//   Paper,
//   Divider,
//   Alert,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
// } from "@mui/material";
// import { useLocation, useNavigate } from "react-router-dom";
// import dayjs from "dayjs";
// import utc from "dayjs/plugin/utc";
// import type { BookingData } from "../../component/booking/types";
// import { useCreateBooking } from "../../hook/booking/useCreateBooking";
// import type { CreateBookingDto } from "../../dto/booking/create-booking.dto";
// import axios from "axios";

// dayjs.extend(utc);

// const API_BASE = "http://localhost:5000";

// const formatTime = (isoOrFormatted?: string) => {
//   if (!isoOrFormatted) return "—";
//   const timeOnlyRegex = /^\d{1,2}:\d{2}$/;
//   if (timeOnlyRegex.test(isoOrFormatted)) return isoOrFormatted;
//   try {
//     const d = dayjs.utc(isoOrFormatted);
//     if (d.isValid()) return d.format("HH:mm");
//     const d2 = dayjs(isoOrFormatted);
//     if (d2.isValid()) return d2.format("HH:mm");
//     return "—";
//   } catch {
//     return "—";
//   }
// };

// interface PaymentPageData extends BookingData {
//   passengerNames: string[];
//   email: string;
//   phone: string;
// }

// const Payment: React.FC = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const bookingData = location.state?.bookingData as PaymentPageData;

//   const [paymentMethod, setPaymentMethod] = useState<string>("");
//   const [, setSubmitting] = useState<boolean>(false);
//   const [bookingId, setBookingId] = useState<string | null>(null);
//   const [paymentId, setPaymentId] = useState<string | null>(null);
  
//   // QR Code states
//   const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
//   const [showQR, setShowQR] = useState<boolean>(false);
//   const [qrLoading, setQrLoading] = useState<boolean>(false);
//   const [bankInfo, setBankInfo] = useState<any>(null);
//   const [instructions, setInstructions] = useState<string[]>([]);
  
//   // Confirmation states
//   const [confirmingPayment, setConfirmingPayment] = useState<boolean>(false);
//   const [openSuccessDialog, setOpenSuccessDialog] = useState<boolean>(false);

//   const { mutateAsync: createBooking } = useCreateBooking();

//   useEffect(() => {
//     if (!bookingData) {
//       alert("Không tìm thấy thông tin đặt vé. Vui lòng thử lại.");
//       navigate("/");
//     }
//   }, [bookingData, navigate]);

//   if (!bookingData) {
//     return null;
//   }

//   const {
//     departureCity,
//     arrivalCity,
//     departureStationName,
//     arrivalStationName,
//     selectedSeats = [],
//     totalPrice,
//     departureTime,
//     arrivalTime,
//     scheduleId,
//     departureStationId,
//     arrivalStationId,
//     passengerNames = [],
//     email,
//     phone,
//   } = bookingData;

//   const seatText = Array.isArray(selectedSeats)
//     ? selectedSeats.join(", ")
//     : String(selectedSeats);

//   // ⭐ Step 1: Create Booking
//   const handleCreateBooking = async () => {
//     if (!scheduleId || !departureStationId || !arrivalStationId) {
//       alert("Thiếu thông tin chuyến đi hoặc trạm đón/trả. Vui lòng thử lại.");
//       return;
//     }

//     const seatNumbers: string[] = Array.isArray(selectedSeats)
//       ? selectedSeats.map((s) => String(s))
//       : String(selectedSeats)
//           .split(",")
//           .map((s) => s.trim())
//           .filter(Boolean);

//     const passengersPayload = seatNumbers.map((sn, idx) => ({
//       fullName: passengerNames[idx] ?? "",
//       seatNumber: sn,
//       idNumber: null,
//     }));

//     const payload: CreateBookingDto = {
//       scheduleId: scheduleId,
//       departureStop: departureStationId,
//       arrivalStop: arrivalStationId,
//       passengers: passengersPayload,
//       contactInfo: {
//         email,
//         phone,
//       },
//       specialRequests: `Payment method: ${paymentMethod}`,
//     };

//     try {
//       setSubmitting(true);
//       console.log("➡ Creating booking...", payload);

//       const res = await createBooking(payload);
//       console.log("✅ Booking created:", res);

//       const createdBookingId = res?.booking?._id;
//       if (createdBookingId) {
//         setBookingId(createdBookingId);
//         return createdBookingId;
//       } else {
//         throw new Error("No booking ID returned");
//       }
//     } catch (err: any) {
//       console.error("❌ Booking error:", err);
//       alert(err?.message || "Không thể tạo đặt vé. Vui lòng thử lại sau.");
//       return null;
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // ⭐ Step 2: Generate QR Code
//   const handleGenerateQR = async () => {
//     if (!paymentMethod) {
//       alert("Vui lòng chọn phương thức thanh toán");
//       return;
//     }

//     let currentBookingId = bookingId;

//     // Nếu chưa tạo booking, tạo mới
//     if (!currentBookingId) {
//       currentBookingId = await handleCreateBooking();
//       if (!currentBookingId) return;
//     }

//     try {
//       setQrLoading(true);
//       const token = localStorage.getItem("token");

//       const response = await axios.post(
//         `${API_BASE}/api/payments/generate-qr`,
//         {
//           bookingId: currentBookingId,
//           paymentMethod: paymentMethod,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       console.log("✅ QR Generated:", response.data);

//       if (response.data.success) {
//         setPaymentId(response.data.payment.paymentId);
//         setQrCodeUrl(response.data.qrCode.imageUrl);
//         setBankInfo(response.data.bankInfo);
//         setInstructions(response.data.instructions || []);
//         setShowQR(true);
//       } else {
//         alert(response.data.message || "Không thể tạo mã QR");
//       }
//     } catch (error: any) {
//       console.error("❌ QR Generation error:", error);
//       alert(
//         error?.response?.data?.message ||
//           "Không thể tạo mã QR. Vui lòng thử lại."
//       );
//     } finally {
//       setQrLoading(false);
//     }
//   };

//   // ⭐ Step 3: Confirm Payment (after user transferred money)
//   const handleConfirmPayment = async () => {
//     if (!paymentId) {
//       alert("Không tìm thấy thông tin thanh toán");
//       return;
//     }

//     try {
//       setConfirmingPayment(true);
//       const token = localStorage.getItem("token");

//       const response = await axios.post(
//         `${API_BASE}/api/payments/confirm-manual`,
//         {
//           paymentId: paymentId,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       console.log("✅ Payment confirmed:", response.data);

//       if (response.data.success) {
//         setOpenSuccessDialog(true);
//       } else {
//         alert(response.data.message || "Không thể xác nhận thanh toán");
//       }
//     } catch (error: any) {
//       console.error("❌ Payment confirmation error:", error);
//       alert(
//         error?.response?.data?.message ||
//           "Không thể xác nhận thanh toán. Vui lòng thử lại."
//       );
//     } finally {
//       setConfirmingPayment(false);
//     }
//   };

//   // ⭐ Handle success dialog close
//   const handleSuccessDialogClose = () => {
//     setOpenSuccessDialog(false);
//     // navigate("/booking");
//     window.location.href = "/booking";
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         bgcolor: "#f5f5f5",
//         p: 3,
//       }}
//     >
//       <Box sx={{ maxWidth: 1200, mx: "auto" }}>
//         <Typography color="black" variant="h4" fontWeight={700} sx={{ mb: 3 }}>
//           Thanh toán
//         </Typography>

//         <Box sx={{ display: "flex", gap: 3 }}>
//           {/* Left Side - Payment Methods */}
//           <Box sx={{ flex: "0 0 40%" }}>
//             <Paper sx={{ p: 3, borderRadius: 2 }}>
//               <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
//                 Phương thức thanh toán
//               </Typography>

//               <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
//                 <Box
//                   sx={{
//                     p: 2,
//                     border: "2px solid",
//                     borderColor:
//                       paymentMethod === "momo" ? "primary.main" : "grey.300",
//                     borderRadius: 2,
//                     cursor: "pointer",
//                     bgcolor: paymentMethod === "momo" ? "#fff5f5" : "white",
//                     transition: "all 0.2s",
//                     "&:hover": {
//                       borderColor: "primary.main",
//                       bgcolor: "#fff5f5",
//                     },
//                   }}
//                   onClick={() => setPaymentMethod("momo")}
//                 >
//                   <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//                     <Box
//                       component="img"
//                       src="/momo_logo.png"
//                       alt="Momo"
//                       sx={{ width: 40, height: 40 }}
//                     />
//                     <Box>
//                       <Typography variant="body1" fontWeight={600}>
//                         Thanh toán qua Momo
//                       </Typography>
//                       <Typography variant="caption" color="text.secondary">
//                         Ví điện tử Momo
//                       </Typography>
//                     </Box>
//                   </Box>
//                 </Box>

//                 <Box
//                   sx={{
//                     p: 2,
//                     border: "2px solid",
//                     borderColor:
//                       paymentMethod === "bank_transfer"
//                         ? "primary.main"
//                         : "grey.300",
//                     borderRadius: 2,
//                     cursor: "pointer",
//                     bgcolor:
//                       paymentMethod === "bank_transfer" ? "#fff5f5" : "white",
//                     transition: "all 0.2s",
//                     "&:hover": {
//                       borderColor: "primary.main",
//                       bgcolor: "#fff5f5",
//                     },
//                   }}
//                   onClick={() => setPaymentMethod("bank_transfer")}
//                 >
//                   <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//                     <Box
//                       sx={{
//                         width: 40,
//                         height: 40,
//                         bgcolor: "primary.main",
//                         borderRadius: 1,
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         color: "white",
//                         fontWeight: 700,
//                       }}
//                     >
//                       ATM
//                     </Box>
//                     <Box>
//                       <Typography variant="body1" fontWeight={600}>
//                         Thanh toán qua ngân hàng
//                       </Typography>
//                       <Typography variant="caption" color="text.secondary">
//                         Chuyển khoản ngân hàng
//                       </Typography>
//                     </Box>
//                   </Box>
//                 </Box>
//               </Box>

//               {/* ⭐ Generate QR Button */}
//               <Button
//                 fullWidth
//                 variant="outlined"
//                 size="large"
//                 onClick={handleGenerateQR}
//                 disabled={!paymentMethod || qrLoading || showQR}
//                 sx={{
//                   mt: 3,
//                   fontWeight: 600,
//                   py: 1.5,
//                   borderColor: "primary.main",
//                   color: "primary.main",
//                   "&:hover": {
//                     borderColor: "primary.dark",
//                     bgcolor: "primary.light",
//                   },
//                 }}
//               >
//                 {qrLoading ? (
//                   <CircularProgress size={24} />
//                 ) : showQR ? (
//                   "Mã QR đã được tạo"
//                 ) : (
//                   "TẠO MÃ QR"
//                 )}
//               </Button>

//               {/* ⭐ QR Code Display */}
//               {showQR && qrCodeUrl && (
//                 <Box sx={{ mt: 3 }}>
//                   <Alert severity="info" sx={{ mb: 2 }}>
//                     <Typography variant="body2" fontWeight={600}>
//                       📱 Quét mã QR này để thanh toán
//                     </Typography>
//                   </Alert>

//                   <Box sx={{ textAlign: "center", mb: 2 }}>
//                     <Box
//                       component="img"
//                       src={qrCodeUrl}
//                       alt="VietQR Code"
//                       sx={{
//                         width: "100%",
//                         maxWidth: 300,
//                         height: "auto",
//                         border: "2px solid",
//                         borderColor: "grey.300",
//                         borderRadius: 2,
//                         p: 1,
//                         bgcolor: "white",
//                       }}
//                     />
//                   </Box>

//                   {/* Bank Info */}
//                   {bankInfo && (
//                     <Paper sx={{ p: 2, bgcolor: "#f9f9f9", mb: 2 }}>
//                       <Typography
//                         variant="subtitle2"
//                         fontWeight={700}
//                         sx={{ mb: 1 }}
//                       >
//                         Thông tin chuyển khoản:
//                       </Typography>
//                       <Typography variant="body2" sx={{ mb: 0.5 }}>
//                         🏦 Ngân hàng: <strong>{bankInfo.bankName}</strong>
//                       </Typography>
//                       <Typography variant="body2" sx={{ mb: 0.5 }}>
//                         👤 Chủ tài khoản:{" "}
//                         <strong>{bankInfo.accountHolder}</strong>
//                       </Typography>
//                       <Typography variant="body2" sx={{ mb: 0.5 }}>
//                         💳 Số tài khoản:{" "}
//                         <strong>{bankInfo.accountNumber}</strong>
//                       </Typography>
//                       {/* <Typography variant="body2" sx={{ mb: 0.5 }}>
//                         💰 Số tiền demo:{" "}
//                         <strong style={{ color: "#d32f2f" }}>
//                           {new Intl.NumberFormat("vi-VN").format(
//                             bankInfo.transferAmount
//                           )}{" "}
//                           đ
//                         </strong>
//                       </Typography> */}
//                       <Typography variant="body2">
//                         📝 Nội dung: <strong>{bankInfo.transferContent}</strong>
//                       </Typography>
//                     </Paper>
//                   )}

//                   {/* Instructions */}
//                   {instructions.length > 0 && (
//                     <Paper sx={{ p: 2, bgcolor: "#fff3e0" }}>
//                       <Typography
//                         variant="subtitle2"
//                         fontWeight={700}
//                         sx={{ mb: 1 }}
//                       >
//                         📋 Hướng dẫn:
//                       </Typography>
//                       {instructions.map((instruction, idx) => (
//                         <Typography
//                           key={idx}
//                           variant="body2"
//                           sx={{ mb: 0.5 }}
//                         >
//                           {instruction}
//                         </Typography>
//                       ))}
//                     </Paper>
//                   )}

//                   {/* ⭐ Confirm Payment Button */}
//                   <Button
//                     fullWidth
//                     variant="contained"
//                     size="large"
//                     onClick={handleConfirmPayment}
//                     disabled={confirmingPayment}
//                     sx={{
//                       mt: 3,
//                       fontWeight: 700,
//                       py: 1.5,
//                       bgcolor: "success.main",
//                       "&:hover": {
//                         bgcolor: "success.dark",
//                       },
//                     }}
//                   >
//                     {confirmingPayment ? (
//                       <Box
//                         sx={{ display: "flex", alignItems: "center", gap: 1 }}
//                       >
//                         <CircularProgress
//                           size={20}
//                           sx={{ color: "white" }}
//                         />
//                         <span>Đang xác nhận...</span>
//                       </Box>
//                     ) : (
//                       "✅ XÁC NHẬN ĐÃ THANH TOÁN"
//                     )}
//                   </Button>
//                 </Box>
//               )}

//               <Box
//                 sx={{
//                   mt: 3,
//                   p: 2,
//                   bgcolor: "#e3f2fd",
//                   borderRadius: 1,
//                 }}
//               >
//                 <Typography variant="body2" color="primary">
//                   💡 Vé sẽ được gửi qua email sau khi thanh toán thành công
//                 </Typography>
//               </Box>
//             </Paper>
//           </Box>

//           {/* Right Side - Booking Information */}
//           <Box sx={{ flex: 1 }}>
//             <Paper sx={{ p: 3, borderRadius: 2, mb: 2 }}>
//               <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
//                 Thông tin chuyến đi
//               </Typography>

//               {/* Station Information */}
//               <Box
//                 sx={{
//                   display: "flex",
//                   alignItems: "flex-start",
//                   gap: 2,
//                   mb: 3,
//                 }}
//               >
//                 {/* Departure Station */}
//                 <Box sx={{ flex: 1 }}>
//                   <Box
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 1,
//                       mb: 1,
//                     }}
//                   >
//                     <Box
//                       sx={{
//                         width: 10,
//                         height: 10,
//                         borderRadius: "50%",
//                         bgcolor: "error.main",
//                       }}
//                     />
//                     <Typography variant="body1" fontWeight={600}>
//                       {departureStationName ?? departureCity}
//                     </Typography>
//                   </Box>
//                   <Typography
//                     variant="body2"
//                     color="text.secondary"
//                     sx={{ ml: 2.5 }}
//                   >
//                     {departureStationName ? departureCity : "Đang tải..."}
//                   </Typography>
//                 </Box>

//                 {/* Times */}
//                 <Box sx={{ textAlign: "center", minWidth: 80 }}>
//                   <Typography
//                     variant="subtitle1"
//                     fontWeight={700}
//                     color="primary.main"
//                   >
//                     {formatTime(departureTime)}
//                   </Typography>
//                   <Box
//                     sx={{
//                       width: "100%",
//                       height: 2,
//                       bgcolor: "grey.300",
//                       my: 1,
//                     }}
//                   />
//                   <Typography
//                     variant="subtitle1"
//                     fontWeight={700}
//                     color="primary.main"
//                   >
//                     {formatTime(arrivalTime)}
//                   </Typography>
//                 </Box>

//                 {/* Arrival Station */}
//                 <Box sx={{ flex: 1 }}>
//                   <Box
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 1,
//                       mb: 1,
//                     }}
//                   >
//                     <Box
//                       sx={{
//                         width: 10,
//                         height: 10,
//                         borderRadius: "50%",
//                         bgcolor: "success.main",
//                       }}
//                     />
//                     <Typography variant="body1" fontWeight={600}>
//                       {arrivalStationName ?? arrivalCity}
//                     </Typography>
//                   </Box>
//                   <Typography
//                     variant="body2"
//                     color="text.secondary"
//                     sx={{ ml: 2.5 }}
//                   >
//                     {arrivalStationName ? arrivalCity : "Đang tải..."}
//                   </Typography>
//                 </Box>
//               </Box>

//               <Divider sx={{ my: 2 }} />

//               {/* Seat Information */}
//               <Box
//                 sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
//               >
//                 <Avatar
//                   sx={{
//                     width: 60,
//                     height: 60,
//                     bgcolor: "grey.100",
//                     color: "text.primary",
//                   }}
//                   src="/placeholder-bus.png"
//                 />
//                 <Box>
//                   <Typography
//                     variant="body2"
//                     fontWeight={600}
//                     color="text.secondary"
//                   >
//                     Số ghế
//                   </Typography>
//                   <Typography variant="h6" fontWeight={700}>
//                     {seatText || "—"}
//                   </Typography>
//                 </Box>
//               </Box>

//               {/* Passenger Information */}
//               <Divider sx={{ my: 2 }} />
//               <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
//                 Thông tin hành khách
//               </Typography>
//               {passengerNames.map((name, idx) => (
//                 <Box
//                   key={idx}
//                   sx={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     py: 1,
//                   }}
//                 >
//                   <Typography variant="body2">Hành khách {idx + 1}:</Typography>
//                   <Typography variant="body2" fontWeight={600}>
//                     {name}
//                   </Typography>
//                 </Box>
//               ))}

//               <Divider sx={{ my: 2 }} />

//               {/* Contact Information */}
//               <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
//                 Thông tin liên hệ
//               </Typography>
//               <Box
//                 sx={{ display: "flex", justifyContent: "space-between", py: 1 }}
//               >
//                 <Typography variant="body2">Email:</Typography>
//                 <Typography variant="body2" fontWeight={600}>
//                   {email}
//                 </Typography>
//               </Box>
//               {phone && (
//                 <Box
//                   sx={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     py: 1,
//                   }}
//                 >
//                   <Typography variant="body2">Số điện thoại:</Typography>
//                   <Typography variant="body2" fontWeight={600}>
//                     {phone}
//                   </Typography>
//                 </Box>
//               )}
//             </Paper>

//             {/* Price Summary */}
//             <Paper sx={{ p: 3, borderRadius: 2 }}>
//               <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>
//                 Chi tiết giá vé
//               </Typography>

//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   mb: 2,
//                 }}
//               >
//                 <Typography color="text.secondary">Tổng số tiền</Typography>
//                 <Typography variant="h5" fontWeight={700} color="primary.main">
//                   {totalPrice ?? "150.000 đ"}
//                 </Typography>
//               </Box>

//               {/* <Alert severity="warning" sx={{ mt: 2 }}>
//                 <Typography variant="body2">
//                   ⚠️ <strong>Demo:</strong> Chỉ cần chuyển <strong>1.000đ</strong> để test thanh toán
//                 </Typography>
//               </Alert> */}
//             </Paper>
//           </Box>
//         </Box>
//       </Box>

//       {/* ⭐ Success Dialog */}
//       <Dialog open={openSuccessDialog} onClose={handleSuccessDialogClose}>
//         <DialogTitle>
//           <Box sx={{ textAlign: "center" }}>
//             <Typography variant="h5" fontWeight={700} color="success.main">
//               ✅ Thanh toán thành công!
//             </Typography>
//           </Box>
//         </DialogTitle>
//         <DialogContent>
//           <Box sx={{ textAlign: "center", py: 2 }}>
//             <Typography variant="body1" sx={{ mb: 2 }}>
//               Đặt vé của bạn đã được xác nhận thành công!
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               📧 Vé điện tử đã được gửi đến email: <strong>{email}</strong>
//             </Typography>
//             <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//               Vui lòng kiểm tra hộp thư để xem chi tiết vé.
//             </Typography>
//           </Box>
//         </DialogContent>
//         <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
//           <Button
//             variant="contained"
//             onClick={handleSuccessDialogClose}
//             sx={{
//               bgcolor: "blueviolet",
//               px: 4,
//               "&:hover": {
//                 bgcolor: "blueviolet",
//                 opacity: 0.9,
//               },
//             }}
//           >
//             Xem vé của tôi
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default Payment;

// ============================================
// FRONTEND: Payment.tsx (Fixed)
// ============================================
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
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import type { BookingData } from "../../component/booking/types";
// import type { CreateBookingDto } from "../../dto/booking/create-booking.dto";
import axios from "axios";

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

  // ⭐⭐⭐ Step 1: Generate QR Code (KHÔNG tạo booking)
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

      // ⭐ GỌI API TẠO QR (backend sẽ tạo pending payment)
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

  // ⭐⭐⭐ Step 2: Confirm Payment (Tạo booking + xác nhận thanh toán)
  const handleConfirmPayment = async () => {
    if (!paymentId) {
      alert("Không tìm thấy thông tin thanh toán");
      return;
    }

    try {
      setConfirmingPayment(true);
      const token = localStorage.getItem("token");

      // ⭐ GỌI API XÁC NHẬN (backend sẽ tạo booking + confirm payment + gửi email)
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

                  {/* Bank Info */}
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

                  {/* Instructions */}
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

                  {/* Confirm Payment Button */}
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
                  mb: 2,
                }}
              >
                <Typography color="text.secondary">Tổng số tiền</Typography>
                <Typography variant="h5" fontWeight={700} color="primary.main">
                  {totalPrice ?? "150.000 đ"}
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