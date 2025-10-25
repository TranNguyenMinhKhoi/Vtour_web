import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";

const TicketCanellation = () => {
  const [ticketId, setTicketId] = useState("");
  const [email, setEmail] = useState("");

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          textAlign: "left",
        }}
      >
        <Typography variant="h3" color="black" mb={3}>
          Hủy vé của bạn
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 4,
        }}
      >
        <Box
          sx={{
            position: "relative",
            backgroundColor: "white",
            border: "2px dashed #ccc",
            borderRadius: "16px",
            p: 4,
            width: "500px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            "&::before, &::after": {
              content: '""',
              position: "absolute",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#f5f5f5",
              top: "50%",
              transform: "translateY(-50%)",
            },
            "&::before": {
              left: "-20px",
            },
            "&::after": {
              right: "-20px",
            },
          }}
        >
          <Box sx={{ display: "flex", gap: 3 }}>
            <TextField
              fullWidth
              label="Nhập số vé"
              placeholder="Vui lòng nhập số vé"
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
            />
            <TextField
              fullWidth
              label="Nhập ID Email"
              placeholder="Vui lòng nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Button
              variant="contained"
              color="secondary"
              sx={{ fontWeight: "bold", px: 4 }}
            >
              Chọn hành khách để hủy
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default TicketCanellation;
