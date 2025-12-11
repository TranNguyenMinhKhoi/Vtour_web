import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  Alert,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";

interface Route {
  _id: string;
  routeName: string;
  departureStationId: {
    stationName: string;
    city: string;
  };
  arrivalStationId: {
    stationName: string;
    city: string;
  };
}

interface Bus {
  _id: string;
  busNumber: string;
  licensePlate: string;
  busType: {
    typeName: string;
    seatCapacity: number;
  };
  companyId: {
    companyName: string;
  };
}

const AdminSchedule: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);

  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [departureTime, setDepartureTime] = useState<Dayjs | null>(dayjs());
  const [arrivalTime, setArrivalTime] = useState<Dayjs | null>(
    dayjs().add(2, "hour")
  );
  const [basePrice, setBasePrice] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoadingData(true);
      const token = localStorage.getItem("token");

      const [routesRes, busesRes] = await Promise.all([
        // axios.get("http://localhost:5000/api/routes", {
        axios.get("https://bus-ticket-be-dun.vercel.app/api/routes", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        // axios.get("http://localhost:5000/api/bus", {
        axios.get("https://bus-ticket-be-dun.vercel.app/api/bus", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setRoutes(routesRes.data.routes || []);
      setBuses(busesRes.data.buses || []);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError("Không thể tải dữ liệu. Vui lòng thử lại.");
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (
      !selectedRoute ||
      !selectedBus ||
      !departureTime ||
      !arrivalTime ||
      !basePrice
    ) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (arrivalTime.isBefore(departureTime)) {
      setError("Giờ đến phải sau giờ đi");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const payload = {
        routeId: selectedRoute._id,
        busId: selectedBus._id,
        // ⭐ Format ISO string nhưng giữ nguyên timezone local
        departureTime: departureTime.format('YYYY-MM-DDTHH:mm:ss'),
        arrivalTime: arrivalTime.format('YYYY-MM-DDTHH:mm:ss'),
        basePrice: parseFloat(basePrice),
      };

      const response = await axios.post(
        // "http://localhost:5000/api/schedules",
        "https://bus-ticket-be-dun.vercel.app/api/schedules",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Schedule created:", response.data);
      setSuccess("Tạo lịch trình thành công!");

      // Reset form
      setSelectedRoute(null);
      setSelectedBus(null);
      setDepartureTime(dayjs());
      setArrivalTime(dayjs().add(2, "hour"));
      setBasePrice("");
    } catch (err: any) {
      console.error("❌ Error creating schedule:", err);
      setError(
        err?.response?.data?.message ||
          "Không thể tạo lịch trình. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: 900, mx: "auto" }}>
        <Typography variant="h4" fontWeight={700} color="black" mb={3}>
          🚌 Tạo Lịch Trình Mới
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            sx={{ mb: 3 }}
            onClose={() => setSuccess(null)}
          >
            {success}
          </Alert>
        )}

        <Paper sx={{ p: 4, borderRadius: 2 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Route Selection */}
              <Grid size={{xs: 12}}>
                <Autocomplete
                  value={selectedRoute}
                  onChange={(_event, newValue) => setSelectedRoute(newValue)}
                  options={routes}
                  getOptionLabel={(option) =>
                    `${option.routeName} (${option.departureStationId.city} → ${option.arrivalStationId.city})`
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Chọn tuyến đường"
                      required
                      placeholder="Tìm kiếm tuyến đường..."
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props}>
                      <Box>
                        <Typography variant="body1" fontWeight={600}>
                          {option.routeName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {option.departureStationId.stationName} →{" "}
                          {option.arrivalStationId.stationName}
                        </Typography>
                      </Box>
                    </li>
                  )}
                />
              </Grid>

              {/* Bus Selection */}
              <Grid size={{xs: 12}}>
                <Autocomplete
                  value={selectedBus}
                  onChange={(_event, newValue) => setSelectedBus(newValue)}
                  options={buses}
                  getOptionLabel={(option) =>
                    `${option.busNumber} - ${option.licensePlate} (${option.busType.typeName})`
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Chọn xe"
                      required
                      placeholder="Tìm kiếm xe..."
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props}>
                      <Box>
                        <Typography variant="body1" fontWeight={600}>
                          {option.busNumber} - {option.licensePlate}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {option.busType.typeName} ({option.busType.seatCapacity}{" "}
                          chỗ) - {option.companyId.companyName}
                        </Typography>
                      </Box>
                    </li>
                  )}
                />
              </Grid>

              {/* Departure Time */}
              <Grid size={{xs: 12, md: 6}}>
                <DateTimePicker
                  label="Giờ xuất bến"
                  value={departureTime}
                  onChange={(newValue) => setDepartureTime(newValue)}
                  minDateTime={dayjs()}
                  slotProps={{
                    textField: {
                      required: true,
                      fullWidth: true,
                    },
                  }}
                />
              </Grid>

              {/* Arrival Time */}
              <Grid size={{xs: 12, md: 6}}>
                <DateTimePicker
                  label="Giờ đến dự kiến"
                  value={arrivalTime}
                  onChange={(newValue) => setArrivalTime(newValue)}
                  minDateTime={departureTime || dayjs()}
                  slotProps={{
                    textField: {
                      required: true,
                      fullWidth: true,
                    },
                  }}
                />
              </Grid>

              {/* Base Price */}
              <Grid size={{xs: 12}}>
                <TextField
                  fullWidth
                  label="Giá vé cơ bản (VNĐ)"
                  type="number"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  required
                  inputProps={{ min: 0, step: 1000 }}
                  helperText="Giá vé cho mỗi hành khách"
                />
              </Grid>

              {/* Preview */}
              {selectedRoute && selectedBus && (
                <Grid size={{xs: 12}}>
                  <Paper
                    sx={{
                      p: 2,
                      bgcolor: "#f8f9fa",
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      fontWeight={700}
                      color="primary"
                      mb={1}
                    >
                      📋 Xem trước:
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{xs: 12, md: 6}}>
                        <Typography variant="body2" color="text.secondary">
                          Tuyến:{" "}
                          <strong>
                            {selectedRoute.departureStationId.city} →{" "}
                            {selectedRoute.arrivalStationId.city}
                          </strong>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Xe: <strong>{selectedBus.busNumber}</strong> (
                          {selectedBus.busType.seatCapacity} chỗ)
                        </Typography>
                      </Grid>
                      <Grid size={{xs: 12, md: 6}}>
                        <Typography variant="body2" color="text.secondary">
                          Xuất bến:{" "}
                          <strong>
                            {departureTime?.format("DD/MM/YYYY HH:mm")}
                          </strong>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Đến:{" "}
                          <strong>
                            {arrivalTime?.format("DD/MM/YYYY HH:mm")}
                          </strong>
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              )}

              {/* Submit Button */}
              <Grid size={{xs: 12}}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  fullWidth
                  sx={{
                    bgcolor: "blueviolet",
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    "&:hover": {
                      bgcolor: "blueviolet",
                      opacity: 0.9,
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: "white" }} />
                  ) : (
                    "✓ Tạo Lịch Trình"
                  )}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>

        {/* Instructions */}
        <Paper sx={{ p: 3, mt: 3, bgcolor: "#fff3e0" }}>
          <Typography variant="subtitle2" fontWeight={700} mb={1}>
            📌 Lưu ý:
          </Typography>
          <Typography variant="body2" color="text.secondary" component="ul">
            <li>Giờ đến phải sau giờ xuất bến</li>
            <li>Số ghế khả dụng sẽ tự động lấy từ loại xe</li>
            {/* <li>Trạng thái mặc định là "scheduled"</li>
            <li>Chỉ bus manager và admin mới có thể tạo lịch trình</li> */}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default AdminSchedule;