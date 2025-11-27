import { Box, Button, Typography, CircularProgress, Card, CardContent, Chip, Grid, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";
import dayjs from "dayjs";
import { useLoginInfo } from "../../hook/auth/useLoginInfo";
import { useMyBookings } from "../../hook/booking/useMyBooking";
import { useCancelBooking } from "../../hook/booking/useCancelBooking"; // ⭐ Import hook

const EnableBooking = () => {
  const token = localStorage.getItem("token");
  const hasToken = Boolean(token);
  
  const { data: loginData } = useLoginInfo({ enabled: hasToken });
  const { data: bookingsData, isLoading, error, refetch } = useMyBookings(hasToken);
  const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking(); // ⭐ Hook cancel

  const isLoggedIn = Boolean(loginData && hasToken);
  const bookings = bookingsData?.bookings || [];

  // ⭐ State cho dialog confirm
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  // Chưa đăng nhập
  if (!isLoggedIn) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", textAlign: "left", gap: 3, p: 3 }}>
        <Typography variant="h3" color="black">
          Đặt chỗ của bạn
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 3 }}>
          <img src="/emptycart.png" alt="img-empty" style={{ width: "300px", height: "auto" }} />
          <Typography variant="h4" color="black">
            Vui lòng đăng nhập để xem đặt chỗ
          </Typography>
          <Button
            component={Link}
            to="/home"
            sx={{
              bgcolor: "blueviolet",
              color: "white",
              fontSize: "20px",
              transition: "transform 0.18s ease, background-color 0.18s ease",
              "&:hover": { transform: "scale(1.05)", color: "white" },
            }}
          >
            Về trang chủ
          </Button>
        </Box>
      </Box>
    );
  }

  // Đang load
  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Có lỗi
  if (error) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", textAlign: "center", gap: 2, p: 3 }}>
        <Typography variant="h5" color="error">
          Không thể tải danh sách đặt chỗ
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {error?.message || "Có lỗi xảy ra"}
        </Typography>
        <Button onClick={() => window.location.reload()}>Thử lại</Button>
      </Box>
    );
  }

  // Không có booking
  if (bookings.length === 0) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", textAlign: "left", gap: 3, p: 3 }}>
        <Typography variant="h3" color="black">
          Đặt chỗ của bạn
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 3 }}>
          <img src="/emptycart.png" alt="img-empty" style={{ width: "300px", height: "auto" }} />
          <Typography variant="h4" color="black">
            Bạn chưa có giao dịch nào
          </Typography>
          <Button
            component={Link}
            to="/home"
            sx={{
              bgcolor: "blueviolet",
              color: "white",
              fontSize: "20px",
              transition: "transform 0.18s ease, background-color 0.18s ease",
              "&:hover": { transform: "scale(1.05)", color: "white" },
            }}
          >
            Đi đến trang đặt tours
          </Button>
        </Box>
      </Box>
    );
  }

  // ⭐ Handler mở dialog confirm
  const handleOpenCancel = (booking: any) => {
    setSelectedBooking(booking);
    setOpenConfirm(true);
  };

  // ⭐ Handler đóng dialog
  const handleCloseCancel = () => {
    setOpenConfirm(false);
    setSelectedBooking(null);
  };

  // ⭐ Handler xác nhận hủy
  const handleConfirmCancel = () => {
    if (!selectedBooking) return;

    cancelBooking(
      {
        bookingId: selectedBooking.bookingReference,
        email: selectedBooking.contactInfo?.email || loginData?.user?.email || "",
      },
      {
        onSuccess: (data) => {
          alert(`✅ ${data.message}`);
          handleCloseCancel();
          refetch(); // ⭐ Refetch để cập nhật UI
        },
        onError: (error: any) => {
          const errorMsg = error?.response?.data?.message || error?.message || "Không thể hủy vé";
          alert(`❌ ${errorMsg}`);
        },
      }
    );
  };

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "success";
      case "reserved": return "warning";
      case "cancelled": return "error";
      case "completed": return "info";
      default: return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed": return "Đã xác nhận";
      case "reserved": return "Đã đặt";
      case "cancelled": return "Đã hủy";
      case "completed": return "Hoàn thành";
      default: return status;
    }
  };

  // ⭐ Check xem có thể hủy không
  const canCancel = (booking: any) => {
    return booking.bookingStatus === "reserved" || booking.bookingStatus === "confirmed";
  };

  // Có bookings - hiển thị danh sách
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: 3 }}>
      <Typography variant="h3" color="black">
        Đặt chỗ của bạn ({bookings.length})
      </Typography>

      <Grid container spacing={3}>
        {bookings.map((booking) => {
          const departureCity = booking.scheduleId?.routeId?.departureStationId?.city || "N/A";
          const arrivalCity = booking.scheduleId?.routeId?.arrivalStationId?.city || "N/A";
          const departureTime = booking.scheduleId?.departureTime 
            ? dayjs(booking.scheduleId.departureTime).format("DD/MM/YYYY HH:mm")
            : "N/A";
          const companyName = booking.scheduleId?.busId?.companyId?.companyName || "N/A";
          
          const seatNumbers = booking.passengers && Array.isArray(booking.passengers)
            ? booking.passengers.map(p => p.seatNumber).filter(Boolean).join(", ")
            : "N/A";

          return (
            <Grid size={{ xs: 12, md: 6 }} key={booking._id}>
              <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Typography variant="h6" fontWeight={700}>
                      {booking.bookingReference}
                    </Typography>
                    <Chip 
                      label={getStatusLabel(booking.bookingStatus)} 
                      color={getStatusColor(booking.bookingStatus)}
                      size="small"
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {departureCity} → {arrivalCity}
                  </Typography>

                  <Typography variant="body2" sx={{ mt: 1 }}>
                    🕐 {departureTime}
                  </Typography>

                  <Typography variant="body2">
                    🚌 {companyName}
                  </Typography>

                  <Typography variant="body2">
                    💺 {booking.numberOfSeats} ghế | {seatNumbers}
                  </Typography>

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2, pt: 2, borderTop: "1px solid #eee" }}>
                    <Typography variant="h6" color="primary" fontWeight={700}>
                      {new Intl.NumberFormat("vi-VN").format(booking.totalAmount)} đ
                    </Typography>
                    
                    {/* ⭐ Nút Hủy vé - chỉ hiện nếu có thể hủy */}
                    {canCancel(booking) ? (
                      <Button 
                        size="small" 
                        variant="outlined"
                        color="error"
                        onClick={() => handleOpenCancel(booking)}
                        disabled={isCancelling}
                      >
                        {isCancelling && selectedBooking?._id === booking._id ? (
                          <CircularProgress size={20} />
                        ) : (
                          "Hủy vé"
                        )}
                      </Button>
                    ) : (
                      <Button 
                        size="small" 
                        variant="outlined"
                        disabled
                      >
                        {booking.bookingStatus === "cancelled" ? "Đã hủy" : "Không thể hủy"}
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      

      <Dialog open={openConfirm} onClose={handleCloseCancel}>
        <DialogTitle>Xác nhận hủy vé</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn hủy vé <strong>{selectedBooking?.bookingReference}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            • Số ghế: {selectedBooking?.numberOfSeats}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Tổng tiền: {new Intl.NumberFormat("vi-VN").format(selectedBooking?.totalAmount || 0)} đ
          </Typography>
          <Typography variant="body2" color="warning.main" sx={{ mt: 2 }}>
            ⚠️ Hành động này không thể hoàn tác
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancel} disabled={isCancelling}>
            Đóng
          </Button>
          <Button 
            onClick={handleConfirmCancel} 
            color="error" 
            variant="contained"
            disabled={isCancelling}
          >
            {isCancelling ? <CircularProgress size={20} /> : "Xác nhận hủy"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EnableBooking;

// import { Box, Button, Typography, CircularProgress, Card, CardContent, Chip, Grid } from "@mui/material";
// import { Link } from "react-router-dom";

// import dayjs from "dayjs";
// import {useLoginInfo} from "../../hook/auth/useLoginInfo";
// import {useMyBookings} from "../../hook/booking/useMyBooking";

// const EnableBooking = () => {
//   const token = localStorage.getItem("token");
//   const hasToken = Boolean(token);
  
//   const { data: loginData } = useLoginInfo({ enabled: hasToken });
//   const { data: bookingsData, isLoading, error } = useMyBookings(hasToken);

//   const isLoggedIn = Boolean(loginData && hasToken);
//   const bookings = bookingsData?.bookings || [];

//   // ⭐ Debug log
//   console.log("📋 Total bookings:", bookings.length);
//   console.log("📋 Bookings data:", bookings);

//   // Chưa đăng nhập
//   if (!isLoggedIn) {
//     return (
//       <Box sx={{ display: "flex", flexDirection: "column", textAlign: "left", gap: 3, p: 3 }}>
//         <Typography variant="h3" color="black">
//           Đặt chỗ của bạn
//         </Typography>

//         <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 3 }}>
//           <img src="/emptycart.png" alt="img-empty" style={{ width: "300px", height: "auto" }} />
//           <Typography variant="h4" color="black">
//             Vui lòng đăng nhập để xem đặt chỗ
//           </Typography>
//           <Button
//             component={Link}
//             to="/home"
//             sx={{
//               bgcolor: "blueviolet",
//               color: "white",
//               fontSize: "20px",
//               transition: "transform 0.18s ease, background-color 0.18s ease",
//               "&:hover": { transform: "scale(1.05)", color: "white" },
//             }}
//           >
//             Về trang chủ
//           </Button>
//         </Box>
//       </Box>
//     );
//   }

//   // Đang load
//   if (isLoading) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   // Có lỗi
//   if (error) {
//     return (
//       <Box sx={{ display: "flex", flexDirection: "column", textAlign: "center", gap: 2, p: 3 }}>
//         <Typography variant="h5" color="error">
//           Không thể tải danh sách đặt chỗ
//         </Typography>
//         <Typography variant="body2" color="text.secondary">
//           {error?.message || "Có lỗi xảy ra"}
//         </Typography>
//         <Button onClick={() => window.location.reload()}>Thử lại</Button>
//       </Box>
//     );
//   }

//   // Không có booking
//   if (bookings.length === 0) {
//     return (
//       <Box sx={{ display: "flex", flexDirection: "column", textAlign: "left", gap: 3, p: 3 }}>
//         <Typography variant="h3" color="black">
//           Đặt chỗ của bạn
//         </Typography>

//         <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 3 }}>
//           <img src="/emptycart.png" alt="img-empty" style={{ width: "300px", height: "auto" }} />
//           <Typography variant="h4" color="black">
//             Bạn chưa có giao dịch nào
//           </Typography>
//           <Button
//             component={Link}
//             to="/home"
//             sx={{
//               bgcolor: "blueviolet",
//               color: "white",
//               fontSize: "20px",
//               transition: "transform 0.18s ease, background-color 0.18s ease",
//               "&:hover": { transform: "scale(1.05)", color: "white" },
//             }}
//           >
//             Đi đến trang đặt tours
//           </Button>
//         </Box>
//       </Box>
//     );
//   }

//   // Helper functions
//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "confirmed": return "success";
//       case "reserved": return "warning";
//       case "cancelled": return "error";
//       case "completed": return "info";
//       default: return "default";
//     }
//   };

//   const getStatusLabel = (status: string) => {
//     switch (status) {
//       case "confirmed": return "Đã xác nhận";
//       case "reserved": return "Đã đặt";
//       case "cancelled": return "Đã hủy";
//       case "completed": return "Hoàn thành";
//       default: return status;
//     }
//   };

//   // Có bookings - hiển thị danh sách
//   return (
//     <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: 3 }}>
//       <Typography variant="h3" color="black">
//         Đặt chỗ của bạn ({bookings.length})
//       </Typography>

//       <Grid container spacing={3}>
//         {bookings.map((booking) => {
//           // ⭐ Debug mỗi booking
//           console.log("📄 Booking:", booking.bookingReference, "Seats:", booking.numberOfSeats);
          
//           // Safe access to nested data
//           const departureCity = booking.scheduleId?.routeId?.departureStationId?.city || "N/A";
//           const arrivalCity = booking.scheduleId?.routeId?.arrivalStationId?.city || "N/A";
//           const departureTime = booking.scheduleId?.departureTime 
//             ? dayjs(booking.scheduleId.departureTime).format("DD/MM/YYYY HH:mm")
//             : "N/A";
//           const companyName = booking.scheduleId?.busId?.companyId?.companyName || "N/A";
          
//           // ⭐ Safe seat numbers extraction
//           const seatNumbers = booking.passengers && Array.isArray(booking.passengers)
//             ? booking.passengers.map(p => p.seatNumber).filter(Boolean).join(", ")
//             : "N/A";

//           return (
//             <Grid size={{ xs: 12, md: 6 }} key={booking._id}>
//               <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
//                 <CardContent>
//                   <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
//                     <Typography variant="h6" fontWeight={700}>
//                       {booking.bookingReference}
//                     </Typography>
//                     <Chip 
//                       label={getStatusLabel(booking.bookingStatus)} 
//                       color={getStatusColor(booking.bookingStatus)}
//                       size="small"
//                     />
//                   </Box>

//                   <Typography variant="body2" color="text.secondary" gutterBottom>
//                     {departureCity} → {arrivalCity}
//                   </Typography>

//                   <Typography variant="body2" sx={{ mt: 1 }}>
//                     🕐 {departureTime}
//                   </Typography>

//                   <Typography variant="body2">
//                     🚌 {companyName}
//                   </Typography>

//                   <Typography variant="body2">
//                     💺 {booking.numberOfSeats} ghế | {seatNumbers}
//                   </Typography>

//                   <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2, pt: 2, borderTop: "1px solid #eee" }}>
//                     <Typography variant="h6" color="primary" fontWeight={700}>
//                       {new Intl.NumberFormat("vi-VN").format(booking.totalAmount)} đ
//                     </Typography>
//                     <Button 
//                       size="small" 
//                       variant="outlined"
//                       component={Link}
//                       to={`/booking/${booking.bookingReference}`}
//                     >
//                       Chi tiết
//                     </Button>
//                   </Box>
//                 </CardContent>
//               </Card>
//             </Grid>
//           );
//         })}
//       </Grid>
//     </Box>
//   );
// };

// export default EnableBooking;