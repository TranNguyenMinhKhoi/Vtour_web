import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  IconButton,
} from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";

type BookingFormProps = {
  locations: string[];
  onSubmit: (data: {
    tripType: "oneway" | "round";
    from: string;
    to: string;
    date: string;
    tickets: number;
  }) => void;
};

const BookingForm: React.FC<BookingFormProps> = ({ locations, onSubmit }) => {
  const [tripType, setTripType] = useState<"oneway" | "round">("oneway");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const [tickets, setTickets] = useState(1);

  console.log(setTripType);
  console.log(setTickets);


  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  const handleSubmit = () => {
    if (from && to && date) {
      onSubmit({
        tripType,
        from,
        to,
        date: date.format("YYYY-MM-DD"),
        tickets,
      });
    }
  };

  return (
    <Box
      sx={{
        border: "2px solid blueviolet",
        borderRadius: 3,
        p: 3,
        bgcolor: "white",
        color: "black",
        maxWidth: "1000px",
        mx: "auto",
        boxShadow: 3,
        fontSize: "1.1rem",
      }}
    >
      {/* Trip type + Hướng dẫn */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Button>
          <Typography
            color="secondary"
            sx={{ fontWeight: 600, cursor: "pointer", fontSize: "1.1rem" }}
          >
            Hướng dẫn mua vé
          </Typography>
        </Button>
      </Box>

      {/* Input fields */}
      <Box display="flex" gap={2} alignItems="center">
        <FormControl sx={{ minWidth: 200 }} size="medium">
          <InputLabel sx={{ fontSize: "1rem" }}>Điểm đi</InputLabel>
          <Select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            sx={{ fontSize: "1rem", height: 50 }}
          >
            {locations.map((loc) => (
              <MenuItem key={loc} value={loc} sx={{ fontSize: "1rem" }}>
                {loc}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <IconButton
          color="secondary"
          onClick={handleSwap}
          size="large"
          sx={{ mx: 1 }}
        >
          <SwapHorizIcon fontSize="large" />
        </IconButton>

        <FormControl sx={{ minWidth: 200 }} size="medium">
          <InputLabel sx={{ fontSize: "1rem" }}>Điểm đến</InputLabel>
          <Select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            sx={{ fontSize: "1rem", height: 50 }}
          >
            {locations.map((loc) => (
              <MenuItem key={loc} value={loc} sx={{ fontSize: "1rem" }}>
                {loc}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <DatePicker
          label="Ngày đi"
          value={date}
          onChange={(newDate) => setDate(newDate)}
          slotProps={{
            textField: {
              size: "medium",
              sx: { minWidth: 200, fontSize: "1rem" },
            },
          }}
        />
      </Box>

      {/* Nút tìm chuyến */}
      <Box textAlign="center" mt={4}>
        <Button
          variant="contained"
          sx={{
            bgcolor: "blueviolet",
            borderRadius: "30px",
            px: 6,
            py: 1.5,
            fontSize: "1.2rem",
            fontWeight: "bold",
            "&:hover": { bgcolor: "mediumslateblue" },
          }}
          onClick={handleSubmit}
        >
          Tìm chuyến xe
        </Button>
      </Box>
    </Box>
  );
};

export default BookingForm;
