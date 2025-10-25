import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { buscompanies } from "../../data/MockData";
import BookingForm from "../../component/BookingForm";
import SlidesGroup from "../../component/SlidesGroup";

const BusCompanyBooking: React.FC = () => {
  const { buscompanyId } = useParams<{ buscompanyId: string }>();

  const buscompany = buscompanies.find((s) => s.id === buscompanyId);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        textAlign: "left",
        gap: 3,
      }}
    >
      <Typography variant="h4" color="black">
        Trang đặt vé cho nhà xe {buscompany ? buscompany.name : "Không tìm thấy ga"}
      </Typography>

      <BookingForm
        locations={["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Huế"]}
        onSubmit={(data) => console.log("Data form:", data)}
      />

      <Box
        sx={{
          textAlign: "left",
          mt: 5,
        }}
      >
        {/* SLIDES GROUP */}
        <SlidesGroup/>
      </Box>
    </Box>
  );
};

export default BusCompanyBooking;
