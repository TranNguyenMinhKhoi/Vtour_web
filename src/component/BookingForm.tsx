import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Autocomplete,
  TextField,
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
    const temp = from;
    setFrom(to);
    setTo(temp);
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
        <Autocomplete
          value={from}
          onChange={(_event, newValue) => {
            setFrom(newValue || "");
          }}
          options={locations}
          sx={{ minWidth: 200 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Điểm đi"
              size="medium"
              sx={{ fontSize: "1rem" }}
            />
          )}
        />

        <IconButton
          color="secondary"
          onClick={handleSwap}
          size="large"
          sx={{ mx: 1 }}
        >
          <SwapHorizIcon fontSize="large" />
        </IconButton>

        <Autocomplete
          value={to}
          onChange={(_event, newValue) => {
            setTo(newValue || "");
          }}
          options={locations}
          sx={{ minWidth: 200 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Điểm đến"
              size="medium"
              sx={{ fontSize: "1rem" }}
            />
          )}
        />

        <DatePicker
          label="Ngày đi"
          value={date}
          onChange={(newDate) => setDate(newDate)}
          minDate={dayjs()}
          shouldDisableDate={(day) => {
            return day.isBefore(dayjs(), 'day');
          }}
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