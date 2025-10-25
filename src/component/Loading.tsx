// src/components/GlobalLoader.tsx
import { Box, CircularProgress } from "@mui/material";

const Loading: React.FC = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(255,255,255,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2000,
      }}
    >
      <CircularProgress size={60} />
    </Box>
  );
};

export default Loading;
