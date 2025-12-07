// import { Box, Button, Typography } from "@mui/material";
// import BookingForm from "../../component/BookingForm";
// import AddIcon from "@mui/icons-material/Add";
// import CreateTour from "./CreateRoute";
// import { useState } from "react";

// const MainAdminRoute = () => {
//   const [open, setOpen] = useState(false);
//   const [tours, setTours] = useState<any[]>([]);

//   console.log(tours);


//   const handleCreate = (newTour: any) => {
//     setTours((prev) => [...prev, newTour]);
//     console.log("Tour mới:", newTour);
//   };
//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         textAlign: "left",
//         gap: 3,
//       }}
//     >
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "row",
//           justifyContent: "space-between",
//         }}
//       >
//         <Typography variant="h4" color="black">
//           Quản lý tuyến đường
//         </Typography>

//         <Button
//           sx={{
//             bgcolor: "blueviolet",
//             color: "white",
//           }}
//           onClick={() => setOpen(true)}
//         >
//           <AddIcon /> Tạo mới
//         </Button>
//       </Box>

//       <BookingForm
//         locations={["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Huế"]}
//         onSubmit={(data) => console.log("Data form:", data)}
//       />

//       <CreateTour
//         open={open}
//         onClose={() => setOpen(false)}
//         onCreate={handleCreate}
//       />

     
//     </Box>
//   );
// };

// export default MainAdminRoute;


import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Card,
  CardContent,
  Alert,
  Snackbar,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";

interface Station {
  _id: string;
  stationName: string;
  city: string;
  province: string;
}

interface Route {
  _id: string;
  routeCode: string;
  routeName: string;
  departureStationId: Station;
  arrivalStationId: Station;
  distance: number;
  estimatedDuration: number;
  image: string;
  isActive: boolean;
}

const MainAdminRoute = () => {
  // Form states
  const [routeCode, setRouteCode] = useState("");
  const [routeName, setRouteName] = useState("");
  const [departureStationId, setDepartureStationId] = useState("");
  const [arrivalStationId, setArrivalStationId] = useState("");
  const [distance, setDistance] = useState("");
  const [estimatedDuration, setEstimatedDuration] = useState("");
  const [image, setImage] = useState("");

  // Data states
  const [stations, setStations] = useState<Station[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [loadingStations, setLoadingStations] = useState(true);
  const [loadingRoutes, setLoadingRoutes] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info",
  });

  const API_BASE = "https://bus-ticket-be-dun.vercel.app/api";
  // const API_BASE = "http://localhost:5000/api";


  useEffect(() => {
    fetchStations();
    fetchRoutes();
  }, []);

  // Fetch stations
  const fetchStations = async () => {
    try {
      setLoadingStations(true);
      const response = await axios.get(`${API_BASE}/stations`);
      setStations(response.data.stations || []);
    } catch (error) {
      console.error("Lỗi khi tải bến xe:", error);
      showSnackbar("Không thể tải danh sách bến xe", "error");
    } finally {
      setLoadingStations(false);
    }
  };

  // Fetch routes
  const fetchRoutes = async () => {
    try {
      setLoadingRoutes(true);
      const response = await axios.get(`${API_BASE}/routes`);
      setRoutes(response.data.routes || []);
    } catch (error) {
      console.error("Lỗi khi tải tuyến đường:", error);
      showSnackbar("Không thể tải danh sách tuyến đường", "error");
    } finally {
      setLoadingRoutes(false);
    }
  };

  // Create route
  const handleCreateRoute = async () => {
    // Validation
    if (!routeCode || !routeName || !departureStationId || !arrivalStationId) {
      showSnackbar("Vui lòng điền đầy đủ thông tin bắt buộc", "error");
      return;
    }

    if (!distance || !estimatedDuration) {
      showSnackbar("Vui lòng nhập khoảng cách và thời gian di chuyển", "error");
      return;
    }

    if (departureStationId === arrivalStationId) {
      showSnackbar("Điểm đi và điểm đến phải khác nhau", "error");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token"); // Lấy token từ localStorage
      
      const newRoute = {
        routeCode: routeCode.trim().toUpperCase(),
        routeName: routeName.trim(),
        departureStationId,
        arrivalStationId,
        distance: parseInt(distance),
        estimatedDuration: parseInt(estimatedDuration),
        image: image.trim() || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957",
        isActive: true,
      };

      const response = await axios.post(`${API_BASE}/routes`, newRoute, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.route) {
        showSnackbar("Tạo tuyến đường thành công!", "success");
        resetForm();
        fetchRoutes(); // Refresh list
      }
    } catch (error: any) {
      console.error("Lỗi khi tạo tuyến đường:", error);
      
      if (error.response?.status === 400) {
        showSnackbar("Mã tuyến đã tồn tại", "error");
      } else if (error.response?.status === 401) {
        showSnackbar("Bạn cần đăng nhập để thực hiện thao tác này", "error");
      } else {
        showSnackbar("Không thể tạo tuyến đường", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setRouteCode("");
    setRouteName("");
    setDepartureStationId("");
    setArrivalStationId("");
    setDistance("");
    setEstimatedDuration("");
    setImage("");
  };

  // Show snackbar
  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info"
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  // Auto-generate route code
  const generateRouteCode = () => {
    if (departureStationId && arrivalStationId) {
      const depStation = stations.find((s) => s._id === departureStationId);
      const arrStation = stations.find((s) => s._id === arrivalStationId);

      if (depStation && arrStation) {
        // Lấy 2-3 ký tự đầu của city
        const depCode = depStation.city.substring(0, 2).toUpperCase();
        const arrCode = arrStation.city.substring(0, 2).toUpperCase();
        const code = `${depCode}-${arrCode}-01`;
        setRouteCode(code);
      }
    }
  };

  // Auto-generate route name
  const generateRouteName = () => {
    if (departureStationId && arrivalStationId) {
      const depStation = stations.find((s) => s._id === departureStationId);
      const arrStation = stations.find((s) => s._id === arrivalStationId);

      if (depStation && arrStation) {
        setRouteName(`${depStation.city} - ${arrStation.city}`);
      }
    }
  };

  // Format duration
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}phút` : `${mins}phút`;
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Header */}
      <Typography variant="h4" color="black" fontWeight={700}>
        Quản lý tuyến đường
      </Typography>

      {/* Create Route Form */}
      <Card sx={{ boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} mb={2}>
            Tạo tuyến đường mới
          </Typography>

          <Box display="flex" flexDirection="column" gap={2.5}>
            {/* Row 1: Route Code & Name */}
            <Box display="flex" gap={2}>
              <TextField
                label="Mã tuyến đường *"
                value={routeCode}
                onChange={(e) => setRouteCode(e.target.value.toUpperCase())}
                fullWidth
                placeholder="VD: SGN-VT-01"
                helperText="Mã tuyến phải là duy nhất"
              />
              <TextField
                label="Tên tuyến đường *"
                value={routeName}
                onChange={(e) => setRouteName(e.target.value)}
                fullWidth
                placeholder="VD: TP.HCM - Vũng Tàu"
              />
            </Box>

            {/* Row 2: Departure & Arrival Stations */}
            <Box display="flex" gap={2}>
              <FormControl fullWidth>
                <InputLabel>Điểm đi *</InputLabel>
                <Select
                  value={departureStationId}
                  onChange={(e) => {
                    setDepartureStationId(e.target.value);
                    setTimeout(() => {
                      generateRouteCode();
                      generateRouteName();
                    }, 100);
                  }}
                  label="Điểm đi *"
                  disabled={loadingStations}
                >
                  {stations.map((station) => (
                    <MenuItem key={station._id} value={station._id}>
                      {station.stationName} - {station.city}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Điểm đến *</InputLabel>
                <Select
                  value={arrivalStationId}
                  onChange={(e) => {
                    setArrivalStationId(e.target.value);
                    setTimeout(() => {
                      generateRouteCode();
                      generateRouteName();
                    }, 100);
                  }}
                  label="Điểm đến *"
                  disabled={loadingStations}
                >
                  {stations.map((station) => (
                    <MenuItem key={station._id} value={station._id}>
                      {station.stationName} - {station.city}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Row 3: Distance & Duration */}
            <Box display="flex" gap={2}>
              <TextField
                label="Khoảng cách (km) *"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                type="number"
                fullWidth
                placeholder="VD: 125"
              />
              <TextField
                label="Thời gian di chuyển (phút) *"
                value={estimatedDuration}
                onChange={(e) => setEstimatedDuration(e.target.value)}
                type="number"
                fullWidth
                placeholder="VD: 120"
                helperText={
                  estimatedDuration
                    ? `≈ ${formatDuration(parseInt(estimatedDuration))}`
                    : ""
                }
              />
            </Box>

            {/* Row 4: Image URL */}
            <TextField
              label="URL hình ảnh (tùy chọn)"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              fullWidth
              placeholder="https://images.unsplash.com/photo-..."
              helperText="Để trống để sử dụng ảnh mặc định"
            />

            {/* Action Buttons */}
            <Box display="flex" gap={2} justifyContent="flex-end" mt={1}>
              <Button
                variant="outlined"
                onClick={resetForm}
                disabled={loading}
              >
                Làm mới
              </Button>
              <Button
                variant="contained"
                onClick={handleCreateRoute}
                disabled={loading}
                sx={{
                  bgcolor: "blueviolet",
                  "&:hover": { bgcolor: "blueviolet", opacity: 0.9 },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Tạo tuyến đường"
                )}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Routes List */}
      <Card sx={{ boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} mb={2}>
            Danh sách tuyến đường ({routes.length})
          </Typography>

          {loadingRoutes ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : routes.length === 0 ? (
            <Alert severity="info">Chưa có tuyến đường nào</Alert>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                    <TableCell>
                      <strong>Mã tuyến</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Tên tuyến</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Điểm đi</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Điểm đến</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Khoảng cách</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Thời gian</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Trạng thái</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Thao tác</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {routes.map((route) => (
                    <TableRow
                      key={route._id}
                      sx={{ "&:hover": { bgcolor: "#f9f9f9" } }}
                    >
                      <TableCell>{route.routeCode}</TableCell>
                      <TableCell>{route.routeName}</TableCell>
                      <TableCell>
                        {route.departureStationId?.stationName}
                        <br />
                        <Typography variant="caption" color="text.secondary">
                          {route.departureStationId?.city}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {route.arrivalStationId?.stationName}
                        <br />
                        <Typography variant="caption" color="text.secondary">
                          {route.arrivalStationId?.city}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">{route.distance} km</TableCell>
                      <TableCell align="center">
                        {formatDuration(route.estimatedDuration)}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={route.isActive ? "Hoạt động" : "Tạm dừng"}
                          color={route.isActive ? "success" : "default"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton size="small" color="primary">
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MainAdminRoute;