// import React from "react";
// import { Box, Typography, Button } from "@mui/material";

// const HeroBanner: React.FC = () => {
//   return (
//     <Box
//       id="hero-banner"
//       sx={{
//         height: { xs: 280, md: 420 },
//         width: "100%",
//         backgroundImage: "url('/pur_sakura.png')",
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         backgroundRepeat: "no-repeat",
//         position: "relative",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//       }}
//     >
//       <Box
//         sx={{
//           position: "absolute",
//           inset: 0,
//           background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.08) 60%, rgba(0,0,0,0.0) 100%)",
//         }}
//       />

//       <Box sx={{ position: "relative", zIndex: 1, textAlign: "center", px: 2 }}>
//         <Typography variant="h3" sx={{ fontWeight: 800, color: "white", mb: 1 }}>
//           Vtour - Hình thành 1 hành trình
//         </Typography>
//         <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.9)", mb: 2 }}>
//           Tìm chuyến đi, vé xe, và ưu đãi tốt nhất — chỉ trong vài giây
//         </Typography>
//       </Box>
//     </Box>
//   );
// };

// export default HeroBanner;
import React from "react";
import { Box, Typography } from "@mui/material";

const HeroBanner: React.FC = () => {
  return (
    <Box
      id="hero-banner"
      sx={{
        height: { xs: 320, md: 400 }, 
        width: "100vw", 
        position: "relative",
        left: "49.4%",
        transform: "translateX(-50%) translateY(-10%)",
        mt: 0,
        paddingTop: 0,
        backgroundImage: "url('/pur_sakura.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0) 100%)",
        }}
      />

      {/* content trên ảnh */}
      <Box sx={{ position: "relative", zIndex: 1, textAlign: "center", px: 2 }}>
        <Typography
          variant="h3"
          sx={{ fontWeight: 800, color: "white", mb: 1 }}
        >
          Vbus - Hình thành 1 hành trình
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: "rgba(255,255,255,0.9)", mb: 2 }}
        >
          Tìm chuyến đi, vé xe, và ưu đãi tốt nhất — chỉ trong vài giây
        </Typography>
      </Box>
    </Box>
  );
};

export default HeroBanner;
