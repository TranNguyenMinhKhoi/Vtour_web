import { Box, Button, Typography } from "@mui/material";
import BookingForm from "../../component/BookingForm";
import AddIcon from "@mui/icons-material/Add";
import CreateTour from "./CreateTour";
import { useState } from "react";

const MainAdminTours = () => {
  const [open, setOpen] = useState(false);
  const [tours, setTours] = useState<any[]>([]);

  console.log(tours);


  const handleCreate = (newTour: any) => {
    setTours((prev) => [...prev, newTour]);
    console.log("Tour mới:", newTour);
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        textAlign: "left",
        gap: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h4" color="black">
          Quản lý tuyến đường
        </Typography>

        <Button
          sx={{
            bgcolor: "blueviolet",
            color: "white",
          }}
          onClick={() => setOpen(true)}
        >
          <AddIcon /> Tạo mới
        </Button>
      </Box>

      <BookingForm
        locations={["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Huế"]}
        onSubmit={(data) => console.log("Data form:", data)}
      />

      <CreateTour
        open={open}
        onClose={() => setOpen(false)}
        onCreate={handleCreate}
      />

     
    </Box>
  );
};

export default MainAdminTours;
