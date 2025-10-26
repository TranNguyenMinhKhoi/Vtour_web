import React from "react";
import { Box, Button, Typography } from "@mui/material";
import AdjustIcon from "@mui/icons-material/Adjust";
import type { SeatObj } from "./types";

interface BusLayoutProps {
  seats: SeatObj[];
  selectedSeats: string[];
  onToggleSeat: (seatNumber: string, isAvailable?: boolean) => void;
}

const BusLayout: React.FC<BusLayoutProps> = ({
  seats,
  selectedSeats,
  onToggleSeat,
}) => {
  const renderSeatButton = (seat: SeatObj) => {
    const sn = String(seat.seatNumber);
    const isAvailable = !!seat.isAvailable;
    const isSelected = selectedSeats.includes(sn);
    
    return (
      <Button
        key={sn}
        size="small"
        variant={isSelected ? "contained" : "outlined"}
        onClick={(e) => {
          e.stopPropagation();
          onToggleSeat(sn, isAvailable);
        }}
        sx={{
          minWidth: 40,
          height: 36,
          p: 0.5,
          bgcolor: isSelected
            ? "success.main"
            : !isAvailable
            ? "grey.300"
            : "white",
          color: isSelected ? "white" : "text.primary",
          borderColor: !isAvailable ? "grey.400" : undefined,
          pointerEvents: !isAvailable ? "none" : "auto",
          borderRadius: "6px",
        }}
      >
        <Typography variant="caption" fontWeight={600}>
          {sn}
        </Typography>
      </Button>
    );
  };

  const renderRowGrid = (seatsInRow: SeatObj[]) => {
    const COLUMNS = 8;
    const count = seatsInRow.length;
    const left = Math.floor((COLUMNS - count) / 2);
    const right = COLUMNS - count - left;
    const placeholdersLeft = Array.from({ length: left });
    const placeholdersRight = Array.from({ length: right });

    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `repeat(${COLUMNS}, 46px)`,
          columnGap: 2,
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        {placeholdersLeft.map((_, i) => (
          <Box key={"plL" + i} sx={{ width: 46, height: 36 }} />
        ))}
        {seatsInRow.map((s) => (
          <Box
            key={String(s.seatNumber)}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {renderSeatButton(s)}
          </Box>
        ))}
        {placeholdersRight.map((_, i) => (
          <Box key={"plR" + i} sx={{ width: 46, height: 36 }} />
        ))}
      </Box>
    );
  };

  const seatNum = (s: SeatObj) => {
    const n = String(s.seatNumber ?? "").replace(/[^\d]/g, "");
    return Number.isFinite(Number(n)) ? Number(n) : NaN;
  };

  const getSeatsByRange = (start: number, end: number) =>
    seats.filter((s) => {
      const n = seatNum(s);
      return !Number.isNaN(n) && n >= start && n <= end;
    });

  // Tầng dưới (1–22)
  const bottomRow1 = getSeatsByRange(1, 8);
  const bottomRow2 = getSeatsByRange(9, 16);
  const bottomRow3 = getSeatsByRange(17, 24);

  // Tầng trên (23–45)
  const topRow1 = getSeatsByRange(23, 30);
  const topRow2 = getSeatsByRange(31, 38);
  const topRow3 = getSeatsByRange(39, 46);

  return (
    <Box
      sx={{
        bgcolor: "#f7f7f7",
        borderRadius: 2,
        p: 3,
        width: "flex",
        maxWidth: 1100,
        mx: "auto",
      }}
    >
      {/* Tầng dưới */}
      <Typography
        sx={{
          mb: 1,
          fontSize: 14,
          color: "text.secondary",
          textAlign: "left",
        }}
      >
        Tầng dưới
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          mb: 2,
        }}
      >
        {/* Vô lăng */}
        <Box
          sx={{
            width: 50,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "center",
            mr: 2,
          }}
        >
          <AdjustIcon sx={{ fontSize: 36, color: "grey.700" }} />
        </Box>

        {/* 3 hàng ghế */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            {renderRowGrid(bottomRow1)}
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            {renderRowGrid(bottomRow2)}
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            {renderRowGrid(bottomRow3)}
          </Box>
        </Box>
      </Box>

      {/* Khoảng trống giữa tầng */}
      <Box sx={{ height: 24 }} />

      {/* Tầng trên */}
      <Typography
        sx={{
          mb: 1,
          fontSize: 14,
          color: "text.secondary",
          textAlign: "left",
        }}
      >
        Tầng trên
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          {renderRowGrid(topRow1)}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          {renderRowGrid(topRow2)}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          {renderRowGrid(topRow3)}
        </Box>
      </Box>
    </Box>
  );
};

export default BusLayout;