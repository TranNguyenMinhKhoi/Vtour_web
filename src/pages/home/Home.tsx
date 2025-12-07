import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import SlidesGroup from "../../component/SlidesGroup";
import BookingForm from "../../component/BookingForm";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SlideTopVenue from "../../component/SlideTopVenue";
import SlideNews from "../../component/SlideNews";
import SlideTopVoucher from "../../component/SlideTopVoucher";

const Home: React.FC = () => {
  const [cities, setCities] = useState<string[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  console.log(error);

  useEffect(() => {
    let cancelled = false;
    setLoadingCities(true);
    axios
      // .get("http://localhost:5000/api/stations/cities")
      .get("https://bus-ticket-be-dun.vercel.app/api/stations/cities")
      .then((res) => {
        if (cancelled) return;
        if (res.data?.cities) setCities(res.data.cities);
        else setCities([]);
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setError("Không lấy được danh sách thành phố");
      })
      .finally(() => {
        if (!cancelled) setLoadingCities(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSearch = (data: {
    tripType: "oneway" | "round";
    from: string;
    to: string;
    date: string; // "YYYY-MM-DD"
    tickets: number;
  }) => {
    // Build query params for RoutesPage. Send date-only string (YYYY-MM-DD).
    const params = new URLSearchParams({
      from: data.from,
      to: data.to,
      date: data.date,
      tickets: String(data.tickets),
      tripType: data.tripType,
    });

    navigate(`/routes?${params.toString()}`);
  };

  return (
    <Box
      sx={{
        color: "black",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        textAlign: { xs: "center", md: "left" },
      }}
    >
      <Box color="black" p={3}>
        <Typography variant="h5" mb={2}>
          Tìm chuyến xe
        </Typography>

        {loadingCities ? (
          <CircularProgress />
        ) : (
          <BookingForm locations={cities} onSubmit={handleSearch} />
        )}

      </Box>

      {/* <Box
        sx={{
          backgroundImage: "url('/pur_sakura.png')",
          borderRadius: 2,
          boxShadow: 3,
          width: { xs: "100%", md: 1200 },
          height: { xs: "auto", md: 300 },
        }}
      >
        <Box sx={{ position: "relative", zIndex: 1, textAlign: "center", px: 2 }}>
          <Typography variant="h3" sx={{ fontWeight: "bold", color: "white", mb: 1 }}>
            Ưu đãi xuống đến 0%
          </Typography>
        </Box>
      </Box> */}
      <SlideTopVenue/>
      {/* <SlidesGroup /> */}
      <SlideTopVoucher/>
      <SlideNews/>
    </Box>
  );
};

export default Home;
