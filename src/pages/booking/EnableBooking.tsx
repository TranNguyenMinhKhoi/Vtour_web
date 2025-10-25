import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const EnableBooking = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        textAlign: "left",
        gap: 3,
      }}
    >
      <Typography variant="h3" color="black">
        Đặt chỗ của bạn
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 3,
        }}
      >
        <img
          src="/emptycart.png"
          alt="img-empty"
          style={{ width: "300px", height: "auto" }}
        />

        <Typography variant="h4" color="black">
          Bạn chưa có giao dịch nào
        </Typography>
        <Button
          component={Link}
          to="/tours"
          sx={{
            bgcolor: "blueviolet",
            color: "white",
            fontSize: "20px",
            transition: "transform 0.18s ease, background-color 0.18s ease",
            "&:hover": {
              transform: "scale(1.05)",
              color: "white",
            },
          }}
        >
          Đi đến trang đặt tours
        </Button>
      </Box>
    </Box>
  );
};

export default EnableBooking;
