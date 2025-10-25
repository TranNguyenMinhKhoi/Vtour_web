import { Box, Typography } from "@mui/material";
import Slides from "../../component/Slides";
import { topNews, topSales } from "../../data/MockData";

const Sales = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        textAlign: "left",
        gap: 3,
      }}
    >
      <Box>
        <Typography variant="h3" color="black">
          Những ưu đãi dành riêng cho bạn!!!
        </Typography>
      </Box>
      <Box
        sx={{
          backgroundImage: "url('/pur_sakura.png')",
          borderRadius: 2,
          boxShadow: 3,
          width: { xs: "100%", md: 1200 },
          height: { xs: "auto", md: 300 },
        }}
      >
        <Box
          sx={{ position: "relative", zIndex: 1, textAlign: "center", px: 2 }}
        >
          <Typography
            variant="h3"
            sx={{ fontWeight: "bold", color: "white", mb: 1 }}
          >
            Ưu đãi xuống đến 0%
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          textAlign: "left",
          mt: 5,
        }}
      >
        <Slides title="Khuyến mãi hot" data={topSales} />
        <Slides title="Top tin tức" data={topNews} />
      </Box>
    </Box>
  );
};

export default Sales;
