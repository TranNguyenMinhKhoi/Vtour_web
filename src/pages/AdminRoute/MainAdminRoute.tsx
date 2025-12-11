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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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

  // Edit states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [editRouteCode, setEditRouteCode] = useState("");
  const [editRouteName, setEditRouteName] = useState("");
  const [editDepartureStationId, setEditDepartureStationId] = useState("");
  const [editArrivalStationId, setEditArrivalStationId] = useState("");
  const [editDistance, setEditDistance] = useState("");
  const [editEstimatedDuration, setEditEstimatedDuration] = useState("");
  const [editImage, setEditImage] = useState("");

  // Delete states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingRoute, setDeletingRoute] = useState<Route | null>(null);

  // Data states
  const [stations, setStations] = useState<Station[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);

  //Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // UI states
  const [loading, setLoading] = useState(false);
  const [loadingStations, setLoadingStations] = useState(true);
  const [loadingRoutes, setLoadingRoutes] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
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
  const fetchRoutes = async (query: string = "") => {
    try {
      setLoadingRoutes(true);

      const endpoint = query.trim()
        ? `${API_BASE}/routes/search?query=${encodeURIComponent(query.trim())}`
        : `${API_BASE}/routes`;

      const response = await axios.get(endpoint);
      setRoutes(response.data.routes || []);
    } catch (error) {
      console.error("Lỗi khi tải tuyến đường:", error);
      showSnackbar("Không thể tải danh sách tuyến đường", "error");
    } finally {
      setLoadingRoutes(false);
    }
  };

  // Handler tìm kiếm
  const handleSearch = async () => {
    setIsSearching(true);
    await fetchRoutes(searchQuery);
    setIsSearching(false);
  };

  // Handler clear search
  const handleClearSearch = async () => {
    setSearchQuery("");
    setIsSearching(true);
    await fetchRoutes("");
    setIsSearching(false);
  };

  // Handler Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Create route
  const handleCreateRoute = async () => {
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

      const token = localStorage.getItem("token");

      const newRoute = {
        routeCode: routeCode.trim().toUpperCase(),
        routeName: routeName.trim(),
        departureStationId,
        arrivalStationId,
        distance: parseInt(distance),
        estimatedDuration: parseInt(estimatedDuration),
        image:
          image.trim() ||
          "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957",
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
        fetchRoutes();
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

  // Open edit dialog
  const handleOpenEditDialog = (route: Route) => {
    setEditingRoute(route);
    setEditRouteCode(route.routeCode);
    setEditRouteName(route.routeName);
    setEditDepartureStationId(route.departureStationId._id);
    setEditArrivalStationId(route.arrivalStationId._id);
    setEditDistance(route.distance.toString());
    setEditEstimatedDuration(route.estimatedDuration.toString());
    setEditImage(route.image || "");
    setEditDialogOpen(true);
  };

  // Close edit dialog
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditingRoute(null);
    setEditRouteCode("");
    setEditRouteName("");
    setEditDepartureStationId("");
    setEditArrivalStationId("");
    setEditDistance("");
    setEditEstimatedDuration("");
    setEditImage("");
  };

  // Update route
  const handleUpdateRoute = async () => {
    if (
      !editRouteCode ||
      !editRouteName ||
      !editDepartureStationId ||
      !editArrivalStationId
    ) {
      showSnackbar("Vui lòng điền đầy đủ thông tin bắt buộc", "error");
      return;
    }

    if (!editDistance || !editEstimatedDuration) {
      showSnackbar("Vui lòng nhập khoảng cách và thời gian di chuyển", "error");
      return;
    }

    if (editDepartureStationId === editArrivalStationId) {
      showSnackbar("Điểm đi và điểm đến phải khác nhau", "error");
      return;
    }

    try {
      setEditLoading(true);

      const token = localStorage.getItem("token");

      const updatedRoute = {
        routeCode: editRouteCode.trim().toUpperCase(),
        routeName: editRouteName.trim(),
        departureStationId: editDepartureStationId,
        arrivalStationId: editArrivalStationId,
        distance: parseInt(editDistance),
        estimatedDuration: parseInt(editEstimatedDuration),
        image:
          editImage.trim() ||
          "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957",
        isActive: true,
      };

      const response = await axios.put(
        `${API_BASE}/routes/${editingRoute?._id}`,
        updatedRoute,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.route) {
        showSnackbar("Cập nhật tuyến đường thành công!", "success");
        handleCloseEditDialog();
        fetchRoutes();
      }
    } catch (error: any) {
      console.error("Lỗi khi cập nhật tuyến đường:", error);

      if (error.response?.status === 400) {
        showSnackbar("Mã tuyến đã tồn tại", "error");
      } else if (error.response?.status === 401) {
        showSnackbar("Bạn cần đăng nhập để thực hiện thao tác này", "error");
      } else if (error.response?.status === 404) {
        showSnackbar("Không tìm thấy tuyến đường", "error");
      } else {
        showSnackbar("Không thể cập nhật tuyến đường", "error");
      }
    } finally {
      setEditLoading(false);
    }
  };

  // Open delete dialog
  const handleOpenDeleteDialog = (route: Route) => {
    setDeletingRoute(route);
    setDeleteDialogOpen(true);
  };

  // Close delete dialog
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeletingRoute(null);
  };

  // Delete route
  const handleDeleteRoute = async () => {
    if (!deletingRoute) return;

    try {
      setDeleteLoading(true);

      const token = localStorage.getItem("token");

      await axios.delete(`${API_BASE}/routes/${deletingRoute._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      showSnackbar("Xóa tuyến đường thành công!", "success");
      handleCloseDeleteDialog();
      fetchRoutes();
    } catch (error: any) {
      console.error("Lỗi khi xóa tuyến đường:", error);

      if (error.response?.status === 401) {
        showSnackbar("Bạn cần đăng nhập để thực hiện thao tác này", "error");
      } else if (error.response?.status === 404) {
        showSnackbar("Không tìm thấy tuyến đường", "error");
      } else {
        showSnackbar("Không thể xóa tuyến đường", "error");
      }
    } finally {
      setDeleteLoading(false);
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

  // Auto-generate for edit dialog
  const generateEditRouteCode = () => {
    if (editDepartureStationId && editArrivalStationId) {
      const depStation = stations.find((s) => s._id === editDepartureStationId);
      const arrStation = stations.find((s) => s._id === editArrivalStationId);

      if (depStation && arrStation) {
        const depCode = depStation.city.substring(0, 2).toUpperCase();
        const arrCode = arrStation.city.substring(0, 2).toUpperCase();
        const code = `${depCode}-${arrCode}-01`;
        setEditRouteCode(code);
      }
    }
  };

  const generateEditRouteName = () => {
    if (editDepartureStationId && editArrivalStationId) {
      const depStation = stations.find((s) => s._id === editDepartureStationId);
      const arrStation = stations.find((s) => s._id === editArrivalStationId);

      if (depStation && arrStation) {
        setEditRouteName(`${depStation.city} - ${arrStation.city}`);
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
              <Button variant="outlined" onClick={resetForm} disabled={loading}>
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
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6" fontWeight={600} mb={2}>
              Danh sách tuyến đường ({routes.length})
            </Typography>
          </Box>
          {/* ⭐ Search Bar */}
          <Box display="flex" gap={1} mb={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="Tìm kiếm theo mã tuyến hoặc tên tuyến..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isSearching || loadingRoutes}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={isSearching || loadingRoutes}
              sx={{
                minWidth: 100,
                bgcolor: "blueviolet",
                "&:hover": { bgcolor: "blueviolet", opacity: 0.9 },
              }}
            >
              {isSearching ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Tìm kiếm"
              )}
            </Button>
            {searchQuery && (
              <Button
                variant="outlined"
                onClick={handleClearSearch}
                disabled={isSearching || loadingRoutes}
                sx={{ minWidth: 80 }}
              >
                Xóa
              </Button>
            )}
          </Box>

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
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenEditDialog(route)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleOpenDeleteDialog(route)}
                        >
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

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Chỉnh sửa tuyến đường</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2.5} mt={1}>
            {/* Row 1: Route Code & Name */}
            <Box display="flex" gap={2}>
              <TextField
                label="Mã tuyến đường *"
                value={editRouteCode}
                onChange={(e) => setEditRouteCode(e.target.value.toUpperCase())}
                fullWidth
                placeholder="VD: SGN-VT-01"
              />
              <TextField
                label="Tên tuyến đường *"
                value={editRouteName}
                onChange={(e) => setEditRouteName(e.target.value)}
                fullWidth
                placeholder="VD: TP.HCM - Vũng Tàu"
              />
            </Box>

            {/* Row 2: Departure & Arrival Stations */}
            <Box display="flex" gap={2}>
              <FormControl fullWidth>
                <InputLabel>Điểm đi *</InputLabel>
                <Select
                  value={editDepartureStationId}
                  onChange={(e) => {
                    setEditDepartureStationId(e.target.value);
                    setTimeout(() => {
                      generateEditRouteCode();
                      generateEditRouteName();
                    }, 100);
                  }}
                  label="Điểm đi *"
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
                  value={editArrivalStationId}
                  onChange={(e) => {
                    setEditArrivalStationId(e.target.value);
                    setTimeout(() => {
                      generateEditRouteCode();
                      generateEditRouteName();
                    }, 100);
                  }}
                  label="Điểm đến *"
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
                value={editDistance}
                onChange={(e) => setEditDistance(e.target.value)}
                type="number"
                fullWidth
                placeholder="VD: 125"
              />
              <TextField
                label="Thời gian di chuyển (phút) *"
                value={editEstimatedDuration}
                onChange={(e) => setEditEstimatedDuration(e.target.value)}
                type="number"
                fullWidth
                placeholder="VD: 120"
                helperText={
                  editEstimatedDuration
                    ? `≈ ${formatDuration(parseInt(editEstimatedDuration))}`
                    : ""
                }
              />
            </Box>

            {/* Row 4: Image URL */}
            <TextField
              label="URL hình ảnh (tùy chọn)"
              value={editImage}
              onChange={(e) => setEditImage(e.target.value)}
              fullWidth
              placeholder="https://images.unsplash.com/photo-..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} disabled={editLoading}>
            Hủy
          </Button>
          <Button
            onClick={handleUpdateRoute}
            variant="contained"
            disabled={editLoading}
            sx={{
              bgcolor: "blueviolet",
              "&:hover": { bgcolor: "blueviolet", opacity: 0.9 },
            }}
          >
            {editLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Cập nhật"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa tuyến đường{" "}
            <strong>{deletingRoute?.routeName}</strong> không?
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Mã tuyến: <strong>{deletingRoute?.routeCode}</strong>
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            Hành động này sẽ đặt trạng thái tuyến đường thành "Tạm dừng". Tuyến
            đường sẽ không hiển thị trong danh sách chính.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={deleteLoading}>
            Hủy
          </Button>
          <Button
            onClick={handleDeleteRoute}
            variant="contained"
            color="error"
            disabled={deleteLoading}
          >
            {deleteLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Xóa"
            )}
          </Button>
        </DialogActions>
      </Dialog>

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
