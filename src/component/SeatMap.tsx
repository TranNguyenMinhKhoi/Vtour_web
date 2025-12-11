import React, { useMemo, useState, useEffect } from "react";
import { Box, Button, Typography, Tabs, Tab } from "@mui/material";
import axios from "axios";
import type { SeatMapProps, SeatObj, Station } from "./booking/types";
import BusLayout from "./booking/BusLayout";
import StationSelector from "./booking/StationSelector";
import BookingConfirmTab from "./booking/BookingConfirmTab";

// const API_BASE = "http://localhost:5000";
const API_BASE = "https://bus-ticket-be-dun.vercel.app";

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
  }, [selectedSeats.length, departureCity, hasLoadedDeparture]);

  // Fetch arrival stations when seats are selected
  useEffect(() => {
    if (selectedSeats.length > 0 && arrivalCity && !hasLoadedArrival) {
      fetchArrivalStations();
    }
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
      totalPrice: totalPrice ? `${totalPrice} đ` : undefined,
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