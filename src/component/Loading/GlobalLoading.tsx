import React from "react";
import { Box, CircularProgress, Typography, Backdrop } from "@mui/material";

interface GlobalLoadingProps {
  isLoading: boolean;
  message?: string;
}

const GlobalLoading: React.FC<GlobalLoadingProps> = ({ 
  isLoading, 
  message = "Đang tải..." 
}) => {
  return (
    <Backdrop
      open={isLoading}
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.modal + 999,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(4px)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <CircularProgress
          size={60}
          thickness={4}
          sx={{
            color: "blueviolet",
          }}
        />
        {message && (
          <Typography
            variant="h6"
            sx={{
              color: "white",
              fontWeight: 500,
              textAlign: "center",
              px: 2,
            }}
          >
            {message}
          </Typography>
        )}
      </Box>
    </Backdrop>
  );
};

export default GlobalLoading;