import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import RoutesResults from "../../component/RoutesResult";

type AnyObj = any;

// const API_BASE = "http://localhost:5000";
const API_BASE = "https://bus-ticket-be-dun.vercel.app/";


const RoutesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [schedules, setSchedules] = useState<AnyObj[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = searchParams.get("from") ?? "";
  const to = searchParams.get("to") ?? "";
  const date = searchParams.get("date") ?? "";
  // const tickets = Number(searchParams.get("tickets") ?? "1");
  const tickets = searchParams.get("tickets") ?? "";
  const tripType = searchParams.get("tripType") ?? "oneway";

  useEffect(() => {
    if (!from || !to || !date) {
      setSchedules([]);
      setError("Thiếu tham số tìm kiếm (from/to/date).");
      return;
    }

    const fetchSchedules = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          departureCity: from,
          arrivalCity: to,
          departureDate: date,
          passengers: tickets,
          tripType,
        };

        const res = await axios.get(`${API_BASE}/api/schedules/search`, { params });
        const resultSchedules = res.data?.schedules ?? res.data ?? [];
        setSchedules(Array.isArray(resultSchedules) ? resultSchedules : []);
      } catch (err: any) {
        console.error("Error fetching schedules:", err);
        setError(err?.response?.data?.message ?? "Lỗi khi lấy kết quả từ server.");
        setSchedules([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [location.search]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", textAlign: "left", color: "black", p: 3 }}>
      <Typography variant="h4" mb={1}>
        Kết quả: {from} → {to}
      </Typography>

      {loading && <CircularProgress />}

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {!loading && !error && schedules.length === 0 && (
        <Typography sx={{ mt: 2 }}>Không tìm thấy chuyến phù hợp</Typography>
      )}

      {!loading && !error && schedules.length > 0 && (
        <RoutesResults
          schedules={schedules}
          passengers={tickets}
          departureCity={from}
          arrivalCity={to}
          onBook={(s) => {
            navigate("/booking/confirm", { state: { schedule: s } });
          }}
        />
      )}
    </Box>
  );
};

export default RoutesPage;