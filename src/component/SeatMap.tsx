import React, { useMemo, useState, useEffect } from "react";
import { Box, Button, Typography, Tabs, Tab } from "@mui/material";
import axios from "axios";
import type { SeatMapProps, SeatObj, Station } from "./booking/types";
import BusLayout from "./booking/BusLayout";
import StationSelector from "./booking/StationSelector";
import BookingConfirmTab from "./booking/BookingConfirmTab";

// const API_BASE = "http://localhost:5000";
const API_BASE = "https://bus-ticket-be-dun.vercel.app/";

const SeatMap: React.FC<SeatMapProps> = ({
  seatMap,
  passengers = "",
  scheduleId,
  busId,
  departureCity = "",
  arrivalCity = "",
  departureTime = "",
  arrivalTime = "",
  departureTimeDisplay,
  arrivalTimeDisplay,
  price,
}) => {
  const seats: SeatObj[] = seatMap?.seats ?? [];

  const grouped = useMemo(() => {
    if (!seats || seats.length === 0) return [];
    console.log("🟢 Seats loaded:", seats);

    const sorted = [...seats].sort((a, b) =>
      String(a.seatNumber).localeCompare(String(b.seatNumber), undefined, {
        numeric: true,
      })
    );

    return sorted;
  }, [seats]);

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [departureStations, setDepartureStations] = useState<Station[]>([]);
  const [arrivalStations, setArrivalStations] = useState<Station[]>([]);
  const [selectedDepartureStation, setSelectedDepartureStation] =
    useState<string>("");
  const [selectedArrivalStation, setSelectedArrivalStation] =
    useState<string>("");
  const [loadingDeparture, setLoadingDeparture] = useState(false);
  const [loadingArrival, setLoadingArrival] = useState(false);
  const [hasLoadedDeparture, setHasLoadedDeparture] = useState(false);
  const [hasLoadedArrival, setHasLoadedArrival] = useState(false);
  const [showBookingConfirm, setShowBookingConfirm] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);

  // Fetch departure stations when seats are selected
  useEffect(() => {
    if (selectedSeats.length > 0 && departureCity && !hasLoadedDeparture) {
      fetchDepartureStations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSeats.length, departureCity, hasLoadedDeparture]);

  // Fetch arrival stations when seats are selected
  useEffect(() => {
    if (selectedSeats.length > 0 && arrivalCity && !hasLoadedArrival) {
      fetchArrivalStations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSeats.length, arrivalCity, hasLoadedArrival]);

  // Auto-select departure station if only one
  useEffect(() => {
    if (departureStations.length === 1) {
      setSelectedDepartureStation(departureStations[0]._id);
    }
  }, [departureStations]);

  // Auto-select arrival station if only one
  useEffect(() => {
    if (arrivalStations.length === 1) {
      setSelectedArrivalStation(arrivalStations[0]._id);
    }
  }, [arrivalStations]);

  const fetchDepartureStations = async () => {
    try {
      setLoadingDeparture(true);
      const cityEncoded = encodeURIComponent(departureCity);
      const res = await axios.get(
        `${API_BASE}/api/stations/by-city/${cityEncoded}`
      );
      setDepartureStations(res.data?.stations ?? []);
      setHasLoadedDeparture(true);
    } catch (err) {
      console.error("Error fetching departure stations:", err);
      setDepartureStations([]);
      setHasLoadedDeparture(true);
    } finally {
      setLoadingDeparture(false);
    }
  };

  const fetchArrivalStations = async () => {
    try {
      setLoadingArrival(true);
      const cityEncoded = encodeURIComponent(arrivalCity);
      const res = await axios.get(
        `${API_BASE}/api/stations/by-city/${cityEncoded}`
      );
      setArrivalStations(res.data?.stations ?? []);
      setHasLoadedArrival(true);
    } catch (err) {
      console.error("Error fetching arrival stations:", err);
      setArrivalStations([]);
      setHasLoadedArrival(true);
    } finally {
      setLoadingArrival(false);
    }
  };

  const toggleSelectSeat = (seatNumber: string, isAvailable?: boolean) => {
    if (!isAvailable) return;
    setSelectedSeats((prev) => {
      if (prev.includes(seatNumber)) {
        return prev.filter((s) => s !== seatNumber);
      } else {
        return [...prev, seatNumber];
      }
    });
  };

  const getSelectedStationInfo = () => {
    const departureStation = departureStations.find(
      (s) => s._id === selectedDepartureStation
    );
    const arrivalStation = arrivalStations.find(
      (s) => s._id === selectedArrivalStation
    );

    return {
      departureStationId: selectedDepartureStation || null,
      arrivalStationId: selectedArrivalStation || null,
      departureStationName: departureStation?.stationName || null,
      arrivalStationName: arrivalStation?.stationName || null,
    };
  };

  const calculateTotalPrice = () => {
    if (!price || selectedSeats.length === 0) return "0";

    // Remove any non-digit characters from price string
    const pricePerSeat = parseInt(price.replace(/\D/g, ""), 10);

    if (isNaN(pricePerSeat)) return "0";

    const total = pricePerSeat * selectedSeats.length;
    return new Intl.NumberFormat("vi-VN").format(total);
  };

  const totalPrice = calculateTotalPrice();

  const handleContinue = () => {
    const stationInfo = getSelectedStationInfo();

    const bookingData = {
      scheduleId,
      busId,
      selectedSeats,
      passengers,
      departureCity,
      arrivalCity,
      departureTime: departureTime || departureTimeDisplay,
      arrivalTime: arrivalTime || arrivalTimeDisplay,
      // totalPrice: price ? `${price} đ` : undefined,
      totalPrice: totalPrice ? `${totalPrice} đ` : undefined,  // Thay vì price
      ...stationInfo,
    };

    setBookingData(bookingData);
    setShowBookingConfirm(true);
    setTabValue(2);
  };

  const handleBackFromBooking = () => {
    setShowBookingConfirm(false);
    setTabValue(0);
  };

  const handleChangeFromBooking = () => {
    setShowBookingConfirm(false);
    setTabValue(0);
  };

  const departureTimeForDisplay = departureTimeDisplay ?? departureTime ?? "";
  const arrivalTimeForDisplay = arrivalTimeDisplay ?? arrivalTime ?? "";

  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      {/* Seat Map Section */}
      <Box sx={{ flex: "0 0 60%" }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Tổng ghế: {seatMap?.totalSeats ?? "—"} — Còn trống:{" "}
          {seatMap?.availableSeats ?? "—"}
        </Typography>

        {/* Legends */}
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 20,
                height: 20,
                border: "1px solid #1976d2",
                borderRadius: 1,
              }}
            />
            <Typography variant="caption">Ghế trống</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 20,
                height: 20,
                bgcolor: "grey.400",
                borderRadius: 1,
              }}
            />
            <Typography variant="caption">Đã đặt</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 20,
                height: 20,
                bgcolor: "success.main",
                borderRadius: 1,
              }}
            />
            <Typography variant="caption">Đã chọn</Typography>
          </Box>
        </Box>

        {/* Bus Layout */}
        <BusLayout
          seats={grouped}
          selectedSeats={selectedSeats}
          onToggleSeat={toggleSelectSeat}
        />

        {/* Selected Seats Info */}
        <Typography sx={{ mt: 2 }}>
          Ghế đã chọn:{" "}
          {selectedSeats.length > 0 ? selectedSeats.join(", ") : "—"}
        </Typography>
      </Box>

      {/* Station Info Section - Only show when seats are selected */}
      {selectedSeats.length > 0 && (
        <Box
          sx={{
            flex: "0 0 35%",
            border: "1px solid #e0e0e0",
            borderRadius: 2,
            bgcolor: "white",
            overflow: "hidden",
          }}
        >
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              "& .MuiTab-root": {
                flex: 1,
                fontWeight: 600,
              },
            }}
          >
            <Tab label="ĐIỂM ĐÓN" />
            <Tab label="ĐIỂM TRẢ" />
            {showBookingConfirm && <Tab label="XÁC NHẬN" />}
          </Tabs>

          <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
            {tabValue === 0 && !showBookingConfirm && (
              <StationSelector
                stations={departureStations}
                timeParam={departureTimeForDisplay}
                loading={loadingDeparture}
                selectedStation={selectedDepartureStation}
                onStationChange={setSelectedDepartureStation}
              />
            )}
            {tabValue === 1 && !showBookingConfirm && (
              <StationSelector
                stations={arrivalStations}
                timeParam={arrivalTimeForDisplay}
                loading={loadingArrival}
                selectedStation={selectedArrivalStation}
                onStationChange={setSelectedArrivalStation}
              />
            )}
            {showBookingConfirm && tabValue === 2 && (
              <BookingConfirmTab
                bookingData={bookingData}
                onBack={handleBackFromBooking}
                onChange={handleChangeFromBooking}
              />
            )}
          </Box>

          {!showBookingConfirm && (
            <Box sx={{ p: 2, borderTop: "1px solid #e0e0e0" }}>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                Số ghế: {selectedSeats.join(", ")}
              </Typography>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 2 }}>
                {/* Tổng số tiền: {price ?? "150.000"} đ */}
                Tổng số tiền: {totalPrice} đ
              </Typography>
              <Button
                fullWidth
                variant="contained"
                disabled={!selectedDepartureStation || !selectedArrivalStation}
                sx={{
                  bgcolor: "blueviolet",
                  color: "white",
                  fontWeight: 600,
                  py: 1.5,
                  "&:hover": {
                    bgcolor: "blueviolet",
                  },
                  "&:disabled": {
                    bgcolor: "grey.400",
                    color: "white",
                  },
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleContinue();
                }}
              >
                TIẾP TỤC
              </Button>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default SeatMap;

//===============================================================================
//backup
//===============================================================================

// import React, { useMemo, useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   Typography,
//   Tabs,
//   Tab,
//   CircularProgress,
//   Radio,
//   RadioGroup,
//   FormControlLabel,
//   Avatar,
//   Divider,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Stack,
// } from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import axios from "axios";
// import dayjs from "dayjs";
// import utc from "dayjs/plugin/utc";
// // import { useNavigate } from "react-router-dom";
// import { useCreateBooking } from "../hook/booking/useCreateBooking";
// import type { CreateBookingDto } from "../dto/booking/create-booking.dto";
// // import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
// import AdjustIcon from "@mui/icons-material/Adjust";

// dayjs.extend(utc);

// const API_BASE = "http://localhost:5000";

// interface SeatObj {
//   seatNumber: string;
//   seatType?: string;
//   features?: any;
//   isAvailable?: boolean;
//   bookingStatus?: string | null;
// }

// interface Station {
//   _id: string;
//   stationCode: string;
//   stationName: string;
//   city: string;
//   province: string;
//   address: string | { street?: string; ward?: string; district?: string } | any;
//   contactNumber?: string;
// }

// interface Props {
//   seatMap: {
//     totalSeats?: number;
//     availableSeats?: number;
//     bookedSeats?: number;
//     layout?: any;
//     seats?: SeatObj[];
//   };
//   passengers?: string;
//   scheduleId?: string | null;
//   busId?: string | null;
//   departureCity?: string;
//   arrivalCity?: string;
//   /** raw ISO (may be undefined) */
//   departureTime?: string;
//   arrivalTime?: string;
//   /** formatted display times (preferred) - e.g. "00:00" */
//   departureTimeDisplay?: string;
//   arrivalTimeDisplay?: string;
//   price?: string; // formatted price string without currency (e.g. "150.000")
// }

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

// const BookingConfirmTab: React.FC<{
//   bookingData: any;
//   onBack: () => void;
//   onChange: () => void;
// }> = ({ bookingData, onBack, onChange }) => {
//   const {
//     departureCity,
//     arrivalCity,
//     departureStationName,
//     arrivalStationName,
//     selectedSeats = [],
//     // passengers = 1,
//     totalPrice,
//     departureTime,
//     arrivalTime,
//     scheduleId,
//     departureStationId,
//     arrivalStationId,
//   } = bookingData ?? {};

//   const seatText = Array.isArray(selectedSeats)
//     ? selectedSeats.join(", ")
//     : String(selectedSeats);

//   // Dialog state & form state for passengers & contact
//   const [openPassengerDialog, setOpenPassengerDialog] = useState(false);
//   const [seatNumbers, setSeatNumbers] = useState<string[]>([]);
//   const [passengerNames, setPassengerNames] = useState<string[]>([]);
//   const [email, setEmail] = useState<string>("");
//   const [phone, setPhone] = useState<string>("");
//   const [submitting, setSubmitting] = useState<boolean>(false);

//   // const navigate = useNavigate();

//   // initialize seatNumbers & passengerNames when bookingData.selectedSeats changes
//   useEffect(() => {
//     const seatsArr: string[] = Array.isArray(selectedSeats)
//       ? selectedSeats.map((s) => String(s))
//       : String(selectedSeats)
//           .split(",")
//           .map((s) => s.trim())
//           .filter(Boolean);
//     setSeatNumbers(seatsArr);
//     setPassengerNames((prev) => {
//       // try to keep previous values if length matches, else reset to empty strings
//       if (prev.length === seatsArr.length && seatsArr.length > 0) return prev;
//       return seatsArr.map(() => "");
//     });
//   }, [selectedSeats]);

//   const handleOpenPassengerDialog = () => {
//     setOpenPassengerDialog(true);
//   };

//   const handleClosePassengerDialog = () => {
//     setOpenPassengerDialog(false);
//   };

//   const handlePassengerNameChange = (index: number, value: string) => {
//     setPassengerNames((prev) => {
//       const copy = [...prev];
//       copy[index] = value;
//       return copy;
//     });
//   };

//   const validateBeforeSubmit = () => {
//     // Basic validation: ensure passenger names provided for each seat, and email provided
//     if (seatNumbers.length === 0) {
//       alert("Không có ghế để đặt.");
//       return false;
//     }
//     for (let i = 0; i < seatNumbers.length; i++) {
//       if (!passengerNames[i] || passengerNames[i].trim() === "") {
//         alert(
//           `Vui lòng nhập họ tên cho hành khách ${i + 1} (ghế ${
//             seatNumbers[i]
//           }).`
//         );
//         return false;
//       }
//     }
//     if (!email || email.trim() === "") {
//       alert("Vui lòng nhập email liên hệ để nhận vé.");
//       return false;
//     }
//     return true;
//   };

//   const { mutateAsync: createBooking, isPending } = useCreateBooking();
//   console.log(isPending);

//   const handleSubmitPassengerInfo = async () => {
//     if (!validateBeforeSubmit()) return;

//     const passengersPayload = seatNumbers.map((sn, idx) => ({
//       fullName: passengerNames[idx] ?? "",
//       seatNumber: sn,
//       idNumber: null,
//     }));

//     const payload: CreateBookingDto = {
//       scheduleId, // string - ID chuyến đi
//       departureStop: departureStationId, // string - điểm đón
//       arrivalStop: arrivalStationId, // string - điểm trả
//       passengers: passengersPayload, // PassengerInfo[]
//       contactInfo: {
//         email, // string - email người đặt
//         phone, // string - số điện thoại
//       },
//       specialRequests: "", // optional
//     };

//     try {
//       setSubmitting(true);
//       console.log("➡ Sending booking payload:", payload);

//       const res = await createBooking(payload);
//       console.log(res);

//       alert(
//         "✅ Đặt vé thành công! Email xác nhận đã được gửi đến địa chỉ liên hệ."
//       );
//       setOpenPassengerDialog(false);
//       onBack();
//     } catch (err: any) {
//       console.error("❌ Booking error:", err);
//       alert(err?.message || "Không thể tạo đặt vé. Vui lòng thử lại sau.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <Box sx={{ p: 2 }}>
//       <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
//         <IconButton onClick={onBack}>
//           <ArrowBackIcon />
//         </IconButton>
//         <Box sx={{ flexGrow: 1 }}>
//           <Typography variant="h6" fontWeight={700}>
//             Đón & Trả
//           </Typography>
//         </Box>
//         <Button
//           onClick={onChange}
//           sx={{
//             textTransform: "none",
//             fontWeight: 600,
//             color: "primary.main",
//             border: "1px solid",
//             borderColor: "primary.main",
//             borderRadius: 1,
//             px: 2,
//             "&:hover": {
//               bgcolor: "primary.main",
//               color: "white",
//             },
//           }}
//         >
//           THAY ĐỔI
//         </Button>
//       </Box>

//       {/* Station Information */}
//       <Box
//         sx={{
//           bgcolor: "white",
//           borderRadius: 2,
//           p: 2,
//           mb: 2,
//           border: "1px solid",
//           borderColor: "grey.200",
//         }}
//       >
//         <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 2 }}>
//           {/* Departure Station */}
//           <Box sx={{ flex: 1 }}>
//             <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
//               <Box
//                 sx={{
//                   width: 8,
//                   height: 8,
//                   borderRadius: "50%",
//                   bgcolor: "error.main",
//                 }}
//               />
//               <Typography variant="body1" fontWeight={600}>
//                 {departureStationName ?? departureCity}
//               </Typography>
//             </Box>
//             <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
//               {departureStationName ? departureCity : "Đang tải..."}
//             </Typography>
//           </Box>

//           {/* Times */}
//           <Box sx={{ textAlign: "center", minWidth: 80 }}>
//             <Typography
//               variant="subtitle1"
//               fontWeight={700}
//               color="primary.main"
//             >
//               {formatTime(departureTime)}
//             </Typography>
//             <Box
//               sx={{ width: "100%", height: 1, bgcolor: "grey.300", my: 1 }}
//             />
//             <Typography
//               variant="subtitle1"
//               fontWeight={700}
//               color="primary.main"
//             >
//               {formatTime(arrivalTime)}
//             </Typography>
//           </Box>

//           {/* Arrival Station */}
//           <Box sx={{ flex: 1 }}>
//             <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
//               <Box
//                 sx={{
//                   width: 8,
//                   height: 8,
//                   borderRadius: "50%",
//                   bgcolor: "error.main",
//                 }}
//               />
//               <Typography variant="body1" fontWeight={600}>
//                 {arrivalStationName ?? arrivalCity}
//               </Typography>
//             </Box>
//             <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
//               {arrivalStationName ? arrivalCity : "Đang tải..."}
//             </Typography>
//           </Box>
//         </Box>

//         {/* Seat Information */}
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             gap: 2,
//             pt: 2,
//             borderTop: "1px solid",
//             borderColor: "grey.200",
//           }}
//         >
//           <Avatar
//             sx={{
//               width: 60,
//               height: 60,
//               bgcolor: "grey.100",
//               color: "text.primary",
//             }}
//             src="/placeholder-bus.png"
//           />
//           <Box>
//             <Typography variant="body2" fontWeight={600} color="text.secondary">
//               Số ghế
//             </Typography>
//             <Typography variant="h6" fontWeight={700}>
//               {seatText || "—"}
//             </Typography>
//           </Box>
//         </Box>
//       </Box>

//       {/* Price Information */}
//       <Box
//         sx={{
//           bgcolor: "white",
//           borderRadius: 2,
//           p: 2,
//           border: "1px solid",
//           borderColor: "grey.200",
//         }}
//       >
//         <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>
//           Chi tiết giá vé
//         </Typography>

//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <Typography color="text.secondary">Tổng số tiền</Typography>
//           <Typography variant="h6" fontWeight={700} color="primary.main">
//             {totalPrice ?? "150.000 đ"}
//           </Typography>
//         </Box>

//         <Box sx={{ textAlign: "right", mt: 1 }}>
//           <Typography
//             variant="body2"
//             sx={{
//               cursor: "pointer",
//               color: "primary.main",
//               fontWeight: 600,
//               textDecoration: "underline",
//             }}
//             onClick={() => alert("Hiện chi tiết giá vé (placeholder).")}
//           >
//             Hiện chi tiết giá vé
//           </Typography>
//         </Box>
//       </Box>

//       {/* Book Button */}
//       <Box sx={{ mt: 3 }}>
//         <Button
//           fullWidth
//           variant="contained"
//           sx={{
//             fontWeight: 700,
//             py: 1.5,
//             fontSize: "1.1rem",
//             borderRadius: 2,
//             bgcolor: "blueviolet",
//             boxShadow: "lightsteelblue",
//             "&:hover": {
//               boxShadow: "lightsteelblue",
//             },
//           }}
//           onClick={() => {
//             // Open passenger/contact dialog (preserve bookingData)
//             console.log(
//               "Opening passenger dialog with bookingData:",
//               bookingData
//             );
//             handleOpenPassengerDialog();
//           }}
//         >
//           TIẾN HÀNH ĐẶT CHỖ
//         </Button>
//       </Box>

//       {/* Passenger + Contact Dialog */}
//       <Dialog
//         open={openPassengerDialog}
//         onClose={handleClosePassengerDialog}
//         fullWidth
//         maxWidth="sm"
//       >
//         <DialogTitle>Thông tin hành khách</DialogTitle>

//         <DialogContent dividers>
//           <Stack spacing={2}>
//             {/* Passenger inputs */}
//             {seatNumbers.length === 0 && (
//               <Typography variant="body2" color="text.secondary">
//                 Không có ghế được chọn.
//               </Typography>
//             )}

//             {seatNumbers.map((sn, idx) => (
//               <Box key={sn + "_" + idx}>
//                 <Typography variant="subtitle2" fontWeight={600}>
//                   {`Hành khách ${idx + 1} | ${sn}`}
//                 </Typography>
//                 <TextField
//                   fullWidth
//                   size="small"
//                   placeholder="Họ và tên"
//                   value={passengerNames[idx] ?? ""}
//                   onChange={(e) =>
//                     handlePassengerNameChange(idx, e.target.value)
//                   }
//                   sx={{ mt: 1 }}
//                 />
//               </Box>
//             ))}

//             <Divider />

//             {/* Contact details */}
//             <Box>
//               <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
//                 Chi tiết liên hệ
//               </Typography>
//               <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
//                 Vé của bạn sẽ được gửi đến
//               </Typography>
//               <TextField
//                 fullWidth
//                 size="small"
//                 label="Địa chỉ email"
//                 placeholder="email@domain.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 sx={{ mb: 1 }}
//               />
//               <TextField
//                 fullWidth
//                 size="small"
//                 label="Số điện thoại (tùy chọn)"
//                 placeholder="0123xxxxxxx"
//                 value={phone}
//                 onChange={(e) => setPhone(e.target.value)}
//               />
//             </Box>
//           </Stack>
//         </DialogContent>

//         <DialogActions>
//           <Box
//             sx={{
//               width: "100%",
//               display: "flex",
//               justifyContent: "flex-end",
//               p: 1,
//             }}
//           >
//             <Button
//               variant="contained"
//               onClick={handleSubmitPassengerInfo}
//               sx={{
//                 textTransform: "none",
//                 fontWeight: 700,
//                 bgcolor: "blueviolet",
//               }}
//               disabled={submitting}
//             >
//               {submitting ? (
//                 <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                   <CircularProgress size={16} />
//                   <span>Đang gửi...</span>
//                 </Box>
//               ) : (
//                 "Tiếp tục"
//               )}
//             </Button>
//           </Box>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// const SeatMap: React.FC<Props> = ({
//   seatMap,
//   passengers = "",
//   scheduleId,
//   busId,
//   departureCity = "",
//   arrivalCity = "",
//   departureTime = "",
//   arrivalTime = "",
//   departureTimeDisplay,
//   arrivalTimeDisplay,
//   price,
// }) => {
//   // seats list from seatMap
//   const seats: SeatObj[] = seatMap?.seats ?? [];

//   const grouped = useMemo(() => {
//     if (!seats || seats.length === 0) return [];
//     console.log("🟢 Seats loaded:", seats);

//     // Tạo bản sao và sắp xếp theo seatNumber
//     const sorted = [...seats].sort((a, b) =>
//       String(a.seatNumber).localeCompare(String(b.seatNumber), undefined, {
//         numeric: true,
//       })
//     );

//     return sorted;
//   }, [seats]);

//   const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
//   const [tabValue, setTabValue] = useState(0);
//   const [departureStations, setDepartureStations] = useState<Station[]>([]);
//   const [arrivalStations, setArrivalStations] = useState<Station[]>([]);
//   const [selectedDepartureStation, setSelectedDepartureStation] =
//     useState<string>("");
//   const [selectedArrivalStation, setSelectedArrivalStation] =
//     useState<string>("");
//   const [loadingDeparture, setLoadingDeparture] = useState(false);
//   const [loadingArrival, setLoadingArrival] = useState(false);
//   const [hasLoadedDeparture, setHasLoadedDeparture] = useState(false);
//   const [hasLoadedArrival, setHasLoadedArrival] = useState(false);
//   const [showBookingConfirm, setShowBookingConfirm] = useState(false);
//   const [bookingData, setBookingData] = useState<any>(null);

//   // const navigate = useNavigate();

//   // Fetch departure stations when seats are selected
//   useEffect(() => {
//     if (selectedSeats.length > 0 && departureCity && !hasLoadedDeparture) {
//       fetchDepartureStations();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [selectedSeats.length, departureCity, hasLoadedDeparture]);

//   // Fetch arrival stations when seats are selected
//   useEffect(() => {
//     if (selectedSeats.length > 0 && arrivalCity && !hasLoadedArrival) {
//       fetchArrivalStations();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [selectedSeats.length, arrivalCity, hasLoadedArrival]);

//   // Auto-select departure station if only one
//   useEffect(() => {
//     if (departureStations.length === 1) {
//       setSelectedDepartureStation(departureStations[0]._id);
//     }
//   }, [departureStations]);

//   // Auto-select arrival station if only one
//   useEffect(() => {
//     if (arrivalStations.length === 1) {
//       setSelectedArrivalStation(arrivalStations[0]._id);
//     }
//   }, [arrivalStations]);

//   const fetchDepartureStations = async () => {
//     try {
//       setLoadingDeparture(true);
//       const cityEncoded = encodeURIComponent(departureCity);
//       const res = await axios.get(
//         `${API_BASE}/api/stations/by-city/${cityEncoded}`
//       );
//       setDepartureStations(res.data?.stations ?? []);
//       setHasLoadedDeparture(true);
//     } catch (err) {
//       console.error("Error fetching departure stations:", err);
//       setDepartureStations([]);
//       setHasLoadedDeparture(true);
//     } finally {
//       setLoadingDeparture(false);
//     }
//   };

//   const fetchArrivalStations = async () => {
//     try {
//       setLoadingArrival(true);
//       const cityEncoded = encodeURIComponent(arrivalCity);
//       const res = await axios.get(
//         `${API_BASE}/api/stations/by-city/${cityEncoded}`
//       );
//       setArrivalStations(res.data?.stations ?? []);
//       setHasLoadedArrival(true);
//     } catch (err) {
//       console.error("Error fetching arrival stations:", err);
//       setArrivalStations([]);
//       setHasLoadedArrival(true);
//     } finally {
//       setLoadingArrival(false);
//     }
//   };

//   const toggleSelectSeat = (seatNumber: string, isAvailable?: boolean) => {
//     if (!isAvailable) return;
//     setSelectedSeats((prev) => {
//       if (prev.includes(seatNumber)) {
//         return prev.filter((s) => s !== seatNumber);
//       } else {
//         return [...prev, seatNumber];
//       }
//     });
//   };

//   const formatAddress = (address: any): string => {
//     if (!address) return "N/A";

//     if (typeof address === "string") return address;

//     if (typeof address === "object") {
//       const parts: string[] = [];
//       if (address.street) parts.push(address.street);
//       if (address.ward) parts.push(address.ward);
//       if (address.district) parts.push(address.district);
//       return parts.length > 0 ? parts.join(", ") : "N/A";
//     }

//     return "N/A";
//   };

//   const formatTime = (isoOrFormatted?: string) => {
//     if (!isoOrFormatted) return "—";

//     const timeOnlyRegex = /^\d{1,2}:\d{2}$/;
//     if (timeOnlyRegex.test(isoOrFormatted)) return isoOrFormatted;

//     try {
//       const d = dayjs.utc(isoOrFormatted);
//       if (d.isValid()) {
//         return d.format("HH:mm");
//       }
//       const d2 = dayjs(isoOrFormatted);
//       if (d2.isValid()) {
//         return d2.format("HH:mm");
//       }
//       return "—";
//     } catch (error) {
//       console.error("Error formatting time:", error, isoOrFormatted);
//       return "—";
//     }
//   };

//   // Render station list UI
//   const renderStationInfo = (
//     stations: Station[],
//     timeParam: string,
//     loading: boolean,
//     selectedStation: string,
//     onStationChange: (stationId: string) => void
//   ) => {
//     if (loading) {
//       return (
//         <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
//           <CircularProgress size={24} />
//         </Box>
//       );
//     }

//     if (stations.length === 0) {
//       return (
//         <Typography variant="body2" sx={{ p: 2, color: "text.secondary" }}>
//           Không tìm thấy thông tin trạm
//         </Typography>
//       );
//     }

//     const displayTime = formatTime(timeParam);

//     return (
//       <Box sx={{ p: 2 }}>
//         <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
//           <Box
//             sx={{
//               width: 12,
//               height: 12,
//               borderRadius: "50%",
//               bgcolor: "error.main",
//             }}
//           />
//           <Typography variant="body1" fontWeight={600}>
//             {displayTime}
//           </Typography>
//           <Typography variant="body1" fontWeight={600}>
//             {stations.find((s) => s._id === selectedStation)?.stationName ||
//               stations[0]?.stationName ||
//               "—"}
//           </Typography>
//         </Box>

//         <RadioGroup
//           value={selectedStation}
//           onChange={(e) => onStationChange(e.target.value)}
//         >
//           {stations.map((station) => (
//             <Box
//               key={station._id}
//               sx={{
//                 mb: 2,
//                 p: 1.5,
//                 border:
//                   selectedStation === station._id
//                     ? "2px solid #1976d2"
//                     : "1px solid #e0e0e0",
//                 borderRadius: 1,
//                 bgcolor:
//                   selectedStation === station._id ? "#f0f7ff" : "transparent",
//                 cursor: "pointer",
//                 transition: "all 0.2s",
//                 "&:hover": {
//                   bgcolor: "#f5f5f5",
//                 },
//               }}
//               onClick={() => onStationChange(station._id)}
//             >
//               <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
//                 <FormControlLabel
//                   value={station._id}
//                   control={<Radio size="small" />}
//                   label=""
//                   sx={{ m: 0 }}
//                 />
//                 <Box sx={{ flex: 1 }}>
//                   <Typography variant="body2" fontWeight={500}>
//                     {station.stationName}
//                   </Typography>
//                   <Typography
//                     variant="body2"
//                     color="text.secondary"
//                     sx={{ mt: 0.5 }}
//                   >
//                     {formatAddress(station.address)}
//                   </Typography>
//                   {station.contactNumber && (
//                     <Typography
//                       variant="body2"
//                       color="text.secondary"
//                       sx={{ mt: 0.5 }}
//                     >
//                       SĐT: {station.contactNumber}
//                     </Typography>
//                   )}
//                 </Box>
//               </Box>
//             </Box>
//           ))}
//         </RadioGroup>

//         {stations.length === 1 && (
//           <Box
//             sx={{
//               mt: 2,
//               p: 1.5,
//               bgcolor: "#e3f2fd",
//               borderRadius: 1,
//             }}
//           >
//             <Typography variant="caption" color="primary">
//               * Xe buýt này có một điểm lên xuống duy nhất
//             </Typography>
//           </Box>
//         )}
//       </Box>
//     );
//   };

//   const getSelectedStationInfo = () => {
//     const departureStation = departureStations.find(
//       (s) => s._id === selectedDepartureStation
//     );
//     const arrivalStation = arrivalStations.find(
//       (s) => s._id === selectedArrivalStation
//     );

//     return {
//       departureStationId: selectedDepartureStation || null,
//       arrivalStationId: selectedArrivalStation || null,
//       departureStationName: departureStation?.stationName || null,
//       arrivalStationName: arrivalStation?.stationName || null,
//     };
//   };

//   const handleContinue = () => {
//     const stationInfo = getSelectedStationInfo();

//     const bookingData = {
//       scheduleId,
//       busId,
//       selectedSeats,
//       passengers,
//       departureCity,
//       arrivalCity,
//       departureTime: departureTime || departureTimeDisplay,
//       arrivalTime: arrivalTime || arrivalTimeDisplay,
//       totalPrice: price ? `${price} đ` : undefined,
//       ...stationInfo,
//     };

//     setBookingData(bookingData);
//     setShowBookingConfirm(true);
//     setTabValue(2); // Switch to BookingConfirm tab
//   };

//   const handleBackFromBooking = () => {
//     setShowBookingConfirm(false);
//     setTabValue(0); // Go back to first tab
//   };

//   const handleChangeFromBooking = () => {
//     setShowBookingConfirm(false);
//     setTabValue(0); // Go back to first tab to make changes
//   };

//   // For station tabs we prefer the display props if provided, otherwise fallback to raw ISO
//   const departureTimeForDisplay = departureTimeDisplay ?? departureTime ?? "";
//   const arrivalTimeForDisplay = arrivalTimeDisplay ?? arrivalTime ?? "";

//   // =============== Render Layout mới theo kiểu xe khách =============== //
//   const renderSeatButton = (seat: SeatObj) => {
//     const sn = String(seat.seatNumber);
//     const isAvailable = !!seat.isAvailable;
//     const isSelected = selectedSeats.includes(sn);
//     return (
//       <Button
//         key={sn}
//         size="small"
//         variant={isSelected ? "contained" : "outlined"}
//         onClick={(e) => {
//           e.stopPropagation();
//           toggleSelectSeat(sn, isAvailable);
//         }}
//         sx={{
//           minWidth: 40,
//           height: 36,
//           p: 0.5,
//           bgcolor: isSelected
//             ? "success.main"
//             : !isAvailable
//             ? "grey.300"
//             : "white",
//           color: isSelected ? "white" : "text.primary",
//           borderColor: !isAvailable ? "grey.400" : undefined,
//           pointerEvents: !isAvailable ? "none" : "auto",
//           borderRadius: "6px",
//         }}
//       >
//         <Typography variant="caption" fontWeight={600}>
//           {sn}
//         </Typography>
//       </Button>
//     );
//   };

//   return (
//     <Box sx={{ display: "flex", gap: 2 }}>
//       {/* Seat Map Section */}
//       <Box sx={{ flex: "0 0 60%" }}>
//         <Box sx={{ flex: selectedSeats.length > 0 ? "0 0 60%" : "1" }}>
//           <Typography variant="subtitle1" sx={{ mb: 1 }}>
//             Tổng ghế: {seatMap?.totalSeats ?? "—"} — Còn trống:{" "}
//             {seatMap?.availableSeats ?? "—"}
//           </Typography>

//           {/* legends */}
//           <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
//             <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//               <Box
//                 sx={{
//                   width: 20,
//                   height: 20,
//                   border: "1px solid #1976d2",
//                   borderRadius: 1,
//                 }}
//               />
//               <Typography variant="caption">Ghế trống</Typography>
//             </Box>
//             <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//               <Box
//                 sx={{
//                   width: 20,
//                   height: 20,
//                   bgcolor: "grey.400",
//                   borderRadius: 1,
//                 }}
//               />
//               <Typography variant="caption">Đã đặt</Typography>
//             </Box>
//             <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//               <Box
//                 sx={{
//                   width: 20,
//                   height: 20,
//                   bgcolor: "success.main",
//                   borderRadius: 1,
//                 }}
//               />
//               <Typography variant="caption">Đã chọn</Typography>
//             </Box>
//           </Box>

//           {/* ================= BUS LAYOUT (horizontal - aligned grid) ================= */}

//           <Box
//             sx={{
//               bgcolor: "#f7f7f7",
//               borderRadius: 2,
//               p: 3,
//               width: "flex",
//               maxWidth: 1100,
//               mx: "auto",
//             }}
//           >
//             {(() => {
//               // const COLUMNS = 8;
//               const seatNum = (s: SeatObj) => {
//                 const n = String(s.seatNumber ?? "").replace(/[^\d]/g, "");
//                 return Number.isFinite(Number(n)) ? Number(n) : NaN;
//               };
//               const getSeatsByRange = (start: number, end: number) =>
//                 grouped.filter((s) => {
//                   const n = seatNum(s);
//                   return !Number.isNaN(n) && n >= start && n <= end;
//                 });

//               const renderRowGrid = (seatsInRow: SeatObj[]) => {
//                 const COLUMNS = 8;
//                 const count = seatsInRow.length;
//                 const left = Math.floor((COLUMNS - count) / 2);
//                 const right = COLUMNS - count - left;
//                 const placeholdersLeft = Array.from({ length: left });
//                 const placeholdersRight = Array.from({ length: right });

//                 return (
//                   <Box
//                     sx={{
//                       display: "grid",
//                       gridTemplateColumns: `repeat(${COLUMNS}, 46px)`,
//                       columnGap: 2,
//                       justifyContent: "center",
//                       alignItems: "center",
//                       width: "100%",
//                     }}
//                   >
//                     {placeholdersLeft.map((_, i) => (
//                       <Box key={"plL" + i} sx={{ width: 46, height: 36 }} />
//                     ))}
//                     {seatsInRow.map((s) => (
//                       <Box
//                         key={String(s.seatNumber)}
//                         sx={{
//                           display: "flex",
//                           justifyContent: "center",
//                           alignItems: "center",
//                         }}
//                       >
//                         {renderSeatButton(s)}
//                       </Box>
//                     ))}
//                     {placeholdersRight.map((_, i) => (
//                       <Box key={"plR" + i} sx={{ width: 46, height: 36 }} />
//                     ))}
//                   </Box>
//                 );
//               };

//               // Tầng dưới (1–22)
//               const bottomRow1 = getSeatsByRange(1, 8);
//               const bottomRow2 = getSeatsByRange(9, 16);
//               const bottomRow3 = getSeatsByRange(17, 24);

//               // Tầng trên (23–45)
//               const topRow1 = getSeatsByRange(23, 30);
//               const topRow2 = getSeatsByRange(31, 38);
//               const topRow3 = getSeatsByRange(39, 46);

//               return (
//                 <>
//                   {/* ===== Tầng dưới ===== */}
//                   <Typography
//                     sx={{
//                       mb: 1,
//                       fontSize: 14,
//                       color: "text.secondary",
//                       textAlign: "left",
//                     }}
//                   >
//                     Tầng dưới
//                   </Typography>

//                   {/* Container ngang: bên trái là vô lăng, bên phải là 3 hàng ghế */}
//                   <Box
//                     sx={{
//                       display: "flex",
//                       alignItems: "flex-end",
//                       justifyContent: "center",
//                       mb: 2,
//                     }}
//                   >
//                     {/* Box vô lăng bên trái */}
//                     <Box
//                       sx={{
//                         width: 50,
//                         height: "100%",
//                         display: "flex",
//                         flexDirection: "column",
//                         justifyContent: "flex-end",
//                         alignItems: "center",
//                         mr: 2,
//                       }}
//                     >
//                       <AdjustIcon sx={{ fontSize: 36, color: "grey.700" }} />
//                     </Box>

//                     {/* Box chứa 3 hàng ghế bên phải */}
//                     <Box
//                       sx={{
//                         display: "flex",
//                         flexDirection: "column",
//                         justifyContent: "center",
//                       }}
//                     >
//                       <Box
//                         sx={{
//                           display: "flex",
//                           justifyContent: "center",
//                           mb: 2,
//                         }}
//                       >
//                         {renderRowGrid(bottomRow1)}
//                       </Box>
//                       <Box
//                         sx={{
//                           display: "flex",
//                           justifyContent: "center",
//                           mb: 2,
//                         }}
//                       >
//                         {renderRowGrid(bottomRow2)}
//                       </Box>
//                       <Box sx={{ display: "flex", justifyContent: "center" }}>
//                         {renderRowGrid(bottomRow3)}
//                       </Box>
//                     </Box>
//                   </Box>

//                   {/* ===== Khoảng trống giữa tầng ===== */}
//                   <Box sx={{ height: 24 }} />

//                   {/* ===== Tầng trên ===== */}
//                   <Typography
//                     sx={{
//                       mb: 1,
//                       fontSize: 14,
//                       color: "text.secondary",
//                       textAlign: "left",
//                     }}
//                   >
//                     Tầng trên
//                   </Typography>

//                   <Box
//                     sx={{
//                       display: "flex",
//                       flexDirection: "column",
//                       justifyContent: "center",
//                     }}
//                   >
//                     <Box
//                       sx={{ display: "flex", justifyContent: "center", mb: 2 }}
//                     >
//                       {renderRowGrid(topRow1)}
//                     </Box>
//                     <Box
//                       sx={{ display: "flex", justifyContent: "center", mb: 2 }}
//                     >
//                       {renderRowGrid(topRow2)}
//                     </Box>
//                     <Box sx={{ display: "flex", justifyContent: "center" }}>
//                       {renderRowGrid(topRow3)}
//                     </Box>
//                   </Box>
//                 </>
//               );
//             })()}
//           </Box>

//           {/* ---- END layout replacement ---- */}
//         </Box>

//         {/* Thông tin ghế đã chọn */}
//         <Typography sx={{ mt: 2 }}>
//           Ghế đã chọn:{" "}
//           {selectedSeats.length > 0 ? selectedSeats.join(", ") : "—"}
//         </Typography>
//       </Box>

//       {/* Station Info Section - Only show when seats are selected */}
//       {selectedSeats.length > 0 && (
//         <Box
//           sx={{
//             flex: "0 0 35%",
//             border: "1px solid #e0e0e0",
//             borderRadius: 2,
//             bgcolor: "white",
//             overflow: "hidden",
//           }}
//         >
//           <Tabs
//             value={tabValue}
//             onChange={(_, newValue) => setTabValue(newValue)}
//             sx={{
//               borderBottom: 1,
//               borderColor: "divider",
//               "& .MuiTab-root": {
//                 flex: 1,
//                 fontWeight: 600,
//               },
//             }}
//           >
//             <Tab label="ĐIỂM ĐÓN" />
//             <Tab label="ĐIỂM TRẢ" />
//             {showBookingConfirm && <Tab label="XÁC NHẬN" />}
//           </Tabs>

//           <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
//             {tabValue === 0 &&
//               !showBookingConfirm &&
//               renderStationInfo(
//                 departureStations,
//                 departureTimeForDisplay,
//                 loadingDeparture,
//                 selectedDepartureStation,
//                 setSelectedDepartureStation
//               )}
//             {tabValue === 1 &&
//               !showBookingConfirm &&
//               renderStationInfo(
//                 arrivalStations,
//                 arrivalTimeForDisplay,
//                 loadingArrival,
//                 selectedArrivalStation,
//                 setSelectedArrivalStation
//               )}
//             {showBookingConfirm && tabValue === 2 && (
//               <BookingConfirmTab
//                 bookingData={bookingData}
//                 onBack={handleBackFromBooking}
//                 onChange={handleChangeFromBooking}
//               />
//             )}
//           </Box>

//           {!showBookingConfirm && (
//             <Box sx={{ p: 2, borderTop: "1px solid #e0e0e0" }}>
//               <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
//                 Số ghế: {selectedSeats.join(", ")}
//               </Typography>
//               <Typography variant="body2" fontWeight={600} sx={{ mb: 2 }}>
//                 Tổng số tiền: {price ?? "150.000"} đ
//               </Typography>
//               <Button
//                 fullWidth
//                 variant="contained"
//                 disabled={!selectedDepartureStation || !selectedArrivalStation}
//                 sx={{
//                   bgcolor: "blueviolet",
//                   color: "white",
//                   fontWeight: 600,
//                   py: 1.5,
//                   "&:hover": {
//                     bgcolor: "blueviolet",
//                   },
//                   "&:disabled": {
//                     bgcolor: "grey.400",
//                     color: "white",
//                   },
//                 }}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleContinue();
//                 }}
//               >
//                 TIẾP TỤC
//               </Button>
//             </Box>
//           )}
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default SeatMap;
