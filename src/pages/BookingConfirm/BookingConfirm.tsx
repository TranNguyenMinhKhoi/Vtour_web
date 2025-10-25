// // src/pages/booking/BookingConfirm.tsx
// import React, { useMemo, useState } from "react";
// import { Box, Typography, Divider, Button, Avatar, Paper, IconButton } from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { useLocation, useNavigate } from "react-router-dom";
// import dayjs from "dayjs";
// import utc from "dayjs/plugin/utc";

// dayjs.extend(utc);

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

// const BookingConfirm: React.FC = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const state = (location.state ?? null) as any | null;

//   // If no state, show fallback
//   if (!state) {
//     return (
//       <Box sx={{ p: 3 }}>
//         <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
//           Quay lại
//         </Button>
//         <Typography sx={{ mt: 2 }}>Không có dữ liệu đặt chỗ. Vui lòng chọn chuyến và ghế trước.</Typography>
//       </Box>
//     );
//   }

//   const {
//     departureCity,
//     arrivalCity,
//     departureStationName,
//     arrivalStationName,
//     selectedSeats = [],
//     passengers = "",
//     totalPrice,
//     departureTime,
//     arrivalTime,
//   } = state;

//   const seatText = Array.isArray(selectedSeats) ? selectedSeats.join(", ") : String(selectedSeats);

//   return (
//     <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
//       <Paper sx={{ p: 2, borderRadius: 2 }}>
//         <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//           <IconButton onClick={() => navigate(-1)}>
//             <ArrowBackIcon />
//           </IconButton>
//           <Box sx={{ flexGrow: 1 }}>
//             <Typography variant="h6">Đón & Trả</Typography>
//             <Typography variant="caption" color="text.secondary">
//               Kiểm tra lại thông tin trước khi đặt
//             </Typography>
//           </Box>
//           <Button
//             onClick={() => navigate(-1)}
//             sx={{ textTransform: "none", fontWeight: 600 }}
//           >
//             THAY ĐỔI
//           </Button>
//         </Box>

//         <Divider sx={{ my: 2 }} />

//         <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
//           <Box sx={{ flex: 1 }}>
//             <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//               <Box>
//                 <Typography variant="subtitle1" fontWeight={700}>
//                   {formatTime(departureTime)}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   {departureCity}
//                 </Typography>
//               </Box>
//               <Box sx={{ flexGrow: 1 }} />
//               <Typography variant="subtitle1" fontWeight={700}>
//                 {formatTime(arrivalTime)}
//               </Typography>
//             </Box>

//             <Box sx={{ mt: 1 }}>
//               <Typography variant="body1" fontWeight={600}>
//                 {departureStationName ?? departureCity}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 {arrivalStationName ?? arrivalCity}
//               </Typography>
//             </Box>
//           </Box>

//           <Box sx={{ width: 160, textAlign: "right" }}>
//             <Avatar sx={{ width: 64, height: 64, mx: "auto" }} src="/placeholder-bus.png" />
//             <Typography sx={{ mt: 1 }} fontWeight={700}>
//               Số ghế
//             </Typography>
//             <Typography fontSize={18} fontWeight={700}>
//               {seatText || "—"}
//             </Typography>
//           </Box>
//         </Box>

//         <Divider sx={{ my: 2 }} />

//         <Box>
//           <Typography variant="subtitle2" fontWeight={700}>
//             Chi tiết giá vé
//           </Typography>

//           <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
//             <Typography color="text.secondary">Tổng số tiền</Typography>
//             <Typography fontWeight={700}>{totalPrice ?? "150.000 đ"}</Typography>
//           </Box>

//           <Box sx={{ textAlign: "right", mt: 1 }}>
//             <Typography
//               variant="body2"
//               sx={{ cursor: "pointer", color: "primary.main", fontWeight: 600 }}
//               onClick={() => alert("Hiện chi tiết giá vé (placeholder).")}
//             >
//               Hiện chi tiết giá vé
//             </Typography>
//           </Box>
//         </Box>

//         <Box sx={{ mt: 3 }}>
//           <Button
//             fullWidth
//             variant="contained"
//             color="error"
//             sx={{ fontWeight: 700, py: 1.5 }}
//             onClick={() => {
//               // TODO: đây là nơi gọi API tạo booking. Hiện demo: log + alert
//               console.log("Submit booking:", state);
//               alert("Gửi yêu cầu đặt chỗ (demo). Kiểm tra console để xem dữ liệu gửi.");
//             }}
//           >
//             TIẾN HÀNH ĐẶT CHỖ
//           </Button>
//         </Box>
//       </Paper>
//     </Box>
//   );
// };

// export default BookingConfirm;
