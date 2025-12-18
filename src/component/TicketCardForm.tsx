import React from "react";
import { Box, Typography, Chip, Divider, Avatar } from "@mui/material";
import WifiIcon from "@mui/icons-material/Wifi";
import LocalDrinkIcon from "@mui/icons-material/LocalDrink";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import AddIcon from "@mui/icons-material/Add";
import StarBorderIcon from "@mui/icons-material/StarBorder";
// import dayjs from "dayjs";

interface TicketCardFormProps {
  logo: string;
  companyName: string;
  startTime: string;
  duration: string;
  endTime: string;
  startStation: string;
  endStation: string;
  price: string;
  rating: number;
  // vehicleImage: string;
  features?: string[];
  cancelable?: boolean;
  onBook?: () => void;
  scheduleId?: string | null;
  busId?: string | null;
}

const TicketCardForm: React.FC<TicketCardFormProps> = ({
  logo,
  companyName,
  startTime,
  duration,
  endTime,
  startStation,
  endStation,
  price,
  rating,
  // vehicleImage,
  cancelable = false,
  scheduleId,
  busId,
}) => {

//   const formatDateTime = (dateString: string) => {
//   return dayjs(dateString).format('DD/MM/YYYY HH:mm');
// };
  return (
    <Box
      sx={{
        border: "1px solid #ddd",
        borderRadius: 4,
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        backgroundColor: "#fff",
      }}
      data-schedule-id={scheduleId || undefined}
      data-bus-id={busId || undefined}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar src={logo} alt={companyName} sx={{ width: 56, height: 56 }} />
        <Typography fontWeight={600} color="black">
          {companyName}
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 3,
            textAlign: "right",
          }}
        >
          <Typography fontWeight={700} fontSize={20} color="black">
            {/* {formatDateTime(startTime)} */}
            {startTime}
          </Typography>
          <Typography color="black" variant="body2">
            {duration}
          </Typography>
          {/* <Typography color="black" variant="body2"> */}
          <Typography fontWeight={700} fontSize={20} color="black">
            {endTime}
          </Typography>
        </Box>

        <Chip
          icon={<StarBorderIcon fontSize="small" />}
          label={rating.toFixed(1)}
          color="secondary"
          size="small"
          sx={{ fontWeight: "bold", ml: 1 }}
        />

        <Typography fontWeight={700} fontSize={18} color="black" sx={{ ml: 2 }}>
          {price} đ
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
        {/* <img
          src={vehicleImage}
          alt="bus"
          style={{ width: 120, height: 80, borderRadius: 8 }}
        /> */}

        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: "flex", flexDirection: "row", gap: 10 }}>
            <Typography variant="body2" color="black">
              {startStation}
            </Typography>
            <Typography variant="body2" color="black">
              {endStation}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
            <WifiIcon fontSize="small" />
            <LocalDrinkIcon fontSize="small" />
            <FastfoodIcon fontSize="small" />
            <AddIcon fontSize="small" />
          </Box>
        </Box>

        {cancelable && (
          <Chip label="CÓ THỂ HỦY" variant="outlined" size="small" />
        )}
      </Box>

      <Divider />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", gap: 2 }}>
          <Typography variant="body2" color="black">
            Tiện ích
          </Typography>
          <Typography variant="body2" color="black">
            Hình ảnh
          </Typography>
          <Typography variant="body2" color="black">
            Điểm đón & Trả khách
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default TicketCardForm;
