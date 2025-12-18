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
  CircularProgress,
  IconButton,
  Divider,
  InputAdornment,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import QuickStationForm from "./QuickStationForm";
import type {RouteFormData, RouteStop, Station} from "../type/route.types";

interface RouteFormProps {
  stations: Station[];
  loadingStations: boolean;
  formData: RouteFormData;
  setFormData: React.Dispatch<React.SetStateAction<RouteFormData>>;
  onSubmit: () => void;
  onReset: () => void;
  loading: boolean;
  isEditMode?: boolean;
  onStationsRefresh: () => void;
  apiBase: string;
}

const RouteForm = ({
  stations,
  loadingStations,
  formData,
  setFormData,
  onSubmit,
  onReset,
  loading,
  isEditMode = false,
  onStationsRefresh,
  apiBase,
}: RouteFormProps) => {
  const [activeStations, setActiveStations] = useState<Station[]>([]);
  const [quickStationOpen, setQuickStationOpen] = useState(false);
  const [stationCreationType, setStationCreationType] = useState<
    "departure" | "arrival" | "stop"
  >("departure");

  useEffect(() => {
    // Filter only active stations for main terminals
    const mainStations = stations.filter(
      (s) => s.isActive && s.stationType === "main"
    );
    setActiveStations(mainStations);
  }, [stations]);

  // Auto-generate route code
  const generateRouteCode = () => {
    if (formData.departureStationId && formData.arrivalStationId) {
      const depStation = stations.find(
        (s) => s._id === formData.departureStationId
      );
      const arrStation = stations.find(
        (s) => s._id === formData.arrivalStationId
      );

      if (depStation && arrStation) {
        const depCode = depStation.city
          .substring(0, 3)
          .toUpperCase()
          .replace(/[^A-Z]/g, "");
        const arrCode = arrStation.city
          .substring(0, 3)
          .toUpperCase()
          .replace(/[^A-Z]/g, "");
        const code = `${depCode}${arrCode}${Math.floor(Math.random() * 100)
          .toString()
          .padStart(2, "0")}`;
        setFormData((prev) => ({ ...prev, routeCode: code }));
      }
    }
  };

  // Auto-generate route name
  const generateRouteName = () => {
    if (formData.departureStationId && formData.arrivalStationId) {
      const depStation = stations.find(
        (s) => s._id === formData.departureStationId
      );
      const arrStation = stations.find(
        (s) => s._id === formData.arrivalStationId
      );

      if (depStation && arrStation) {
        setFormData((prev) => ({
          ...prev,
          routeName: `${depStation.city} - ${arrStation.city}`,
        }));
      }
    }
  };

  // Calculate estimated price based on distance and pricePerKm
  const calculateEstimatedPrice = () => {
    const distance = parseFloat(formData.distance) || 0;
    const pricePerKm = parseFloat(formData.pricePerKm) || 0;
    return (distance * pricePerKm).toFixed(0);
  };

  // Handle quick station creation
  const handleOpenQuickStation = (type: "departure" | "arrival" | "stop") => {
    setStationCreationType(type);
    setQuickStationOpen(true);
  };

  const handleQuickStationSuccess = async (stationId: string) => {
    // Refresh stations list
    await onStationsRefresh();

    // Auto-select the new station
    if (stationCreationType === "departure") {
      setFormData((prev) => ({ ...prev, departureStationId: stationId }));
    } else if (stationCreationType === "arrival") {
      setFormData((prev) => ({ ...prev, arrivalStationId: stationId }));
    }

    setQuickStationOpen(false);
  };

  // Add stop
  const handleAddStop = () => {
    const newStop: RouteStop = {
      stopId: "",
      stopOrder: formData.stops.length + 1,
      distanceFromStart: 0,
      estimatedTimeFromStart: 0,
      pickupPrice: 0,
      dropoffPrice: 0,
    };
    setFormData((prev) => ({
      ...prev,
      stops: [...prev.stops, newStop],
    }));
  };

  // Remove stop
  const handleRemoveStop = (index: number) => {
    const updatedStops = formData.stops.filter((_, i) => i !== index);
    // Re-order stops
    const reorderedStops = updatedStops.map((stop, i) => ({
      ...stop,
      stopOrder: i + 1,
    }));
    setFormData((prev) => ({ ...prev, stops: reorderedStops }));
  };

  // Update stop
  const handleUpdateStop = (
    index: number,
    field: keyof RouteStop,
    value: any
  ) => {
    const updatedStops = [...formData.stops];
    updatedStops[index] = { ...updatedStops[index], [field]: value };
    setFormData((prev) => ({ ...prev, stops: updatedStops }));
  };

  // Format duration
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}phút` : `${mins}phút`;
  };

  return (
    <>
      <Card sx={{ boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} mb={2}>
            {isEditMode ? "Chỉnh sửa tuyến đường" : "Tạo tuyến đường mới"}
          </Typography>

          <Box display="flex" flexDirection="column" gap={2.5}>
            {/* Row 1: Route Code & Name */}
            <Box display="flex" gap={2}>
              <TextField
                label="Mã tuyến đường *"
                value={formData.routeCode}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    routeCode: e.target.value.toUpperCase(),
                  }))
                }
                fullWidth
                placeholder="VD: SGNVT01"
                helperText="Mã tuyến phải là duy nhất"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={generateRouteCode}
                        title="Tự động tạo mã"
                      >
                        <AutoFixHighIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Tên tuyến đường *"
                value={formData.routeName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    routeName: e.target.value,
                  }))
                }
                fullWidth
                placeholder="VD: TP.HCM - Vũng Tàu"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={generateRouteName}
                        title="Tự động tạo tên"
                      >
                        <AutoFixHighIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Row 2: Departure & Arrival Stations */}
            <Box display="flex" gap={2}>
              <FormControl fullWidth>
                <InputLabel>Điểm đi *</InputLabel>
                <Select
                  value={formData.departureStationId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      departureStationId: e.target.value,
                    }))
                  }
                  label="Điểm đi *"
                  disabled={loadingStations}
                  endAdornment={
                    <InputAdornment position="end" sx={{ mr: 3 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenQuickStation("departure")}
                        title="Tạo bến xe mới"
                        edge="end"
                      >
                        <AddLocationIcon fontSize="small" color="primary" />
                      </IconButton>
                    </InputAdornment>
                  }
                >
                  {activeStations.map((station) => (
                    <MenuItem key={station._id} value={station._id}>
                      {station.stationName} - {station.city}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Điểm đến *</InputLabel>
                <Select
                  value={formData.arrivalStationId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      arrivalStationId: e.target.value,
                    }))
                  }
                  label="Điểm đến *"
                  disabled={loadingStations}
                  endAdornment={
                    <InputAdornment position="end" sx={{ mr: 3 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenQuickStation("arrival")}
                        title="Tạo bến xe mới"
                        edge="end"
                      >
                        <AddLocationIcon fontSize="small" color="primary" />
                      </IconButton>
                    </InputAdornment>
                  }
                >
                  {activeStations.map((station) => (
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
                value={formData.distance}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, distance: e.target.value }))
                }
                type="number"
                fullWidth
                placeholder="VD: 125"
                inputProps={{ min: 0, step: 0.1 }}
              />
              <TextField
                label="Thời gian di chuyển (phút) *"
                value={formData.estimatedDuration}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    estimatedDuration: e.target.value,
                  }))
                }
                type="number"
                fullWidth
                placeholder="VD: 120"
                inputProps={{ min: 0 }}
                helperText={
                  formData.estimatedDuration
                    ? `≈ ${formatDuration(parseInt(formData.estimatedDuration))}`
                    : ""
                }
              />
            </Box>

            {/* Row 4: Pricing */}
            <Box display="flex" gap={2}>
              <TextField
                label="Giá cơ bản (VND)"
                value={formData.basePrice}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, basePrice: e.target.value }))
                }
                type="number"
                fullWidth
                placeholder="VD: 150000"
                inputProps={{ min: 0, step: 1000 }}
                helperText="Giá vé cố định cho toàn tuyến"
              />
              <TextField
                label="Giá mỗi km (VND)"
                value={formData.pricePerKm}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    pricePerKm: e.target.value,
                  }))
                }
                type="number"
                fullWidth
                placeholder="VD: 2000"
                inputProps={{ min: 0, step: 100 }}
                helperText={
                  formData.distance && formData.pricePerKm
                    ? `Dự kiến: ${parseInt(
                        calculateEstimatedPrice()
                      ).toLocaleString()} VND`
                    : "Dùng để tính giá linh hoạt"
                }
              />
            </Box>

            {/* Row 5: Description */}
            <TextField
              label="Mô tả"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              fullWidth
              multiline
              rows={2}
              placeholder="Mô tả về tuyến đường, điểm đặc biệt..."
            />

            {/* Row 6: Image URL */}
            <TextField
              label="URL hình ảnh"
              value={formData.image}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, image: e.target.value }))
              }
              fullWidth
              placeholder="https://images.unsplash.com/photo-..."
              helperText="Để trống để sử dụng ảnh mặc định"
            />

            {/* Stops Section */}
            <Divider />
            <Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="subtitle1" fontWeight={600}>
                  Điểm dừng trung gian ({formData.stops.length})
                </Typography>
                <Button
                  startIcon={<AddCircleIcon />}
                  size="small"
                  onClick={handleAddStop}
                  variant="outlined"
                >
                  Thêm điểm dừng
                </Button>
              </Box>

              {formData.stops.length > 0 && (
                <Box display="flex" flexDirection="column" gap={2}>
                  {formData.stops.map((stop, index) => (
                    <Card key={index} variant="outlined">
                      <CardContent>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          mb={2}
                        >
                          <Typography variant="subtitle2" fontWeight={600}>
                            Điểm dừng #{stop.stopOrder}
                          </Typography>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemoveStop(index)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>

                        <Box display="flex" flexDirection="column" gap={2}>
                          <FormControl fullWidth size="small">
                            <InputLabel>Chọn bến xe</InputLabel>
                            <Select
                              value={stop.stopId}
                              onChange={(e) =>
                                handleUpdateStop(index, "stopId", e.target.value)
                              }
                              label="Chọn bến xe"
                              endAdornment={
                                <InputAdornment position="end" sx={{ mr: 3 }}>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleOpenQuickStation("stop")}
                                    title="Tạo bến xe mới"
                                    edge="end"
                                  >
                                    <AddLocationIcon fontSize="small" color="primary" />
                                  </IconButton>
                                </InputAdornment>
                              }
                            >
                              {stations
                                .filter((s) => s.isActive)
                                .map((station) => (
                                  <MenuItem key={station._id} value={station._id}>
                                    {station.stationName} - {station.city}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>

                          <Box display="flex" gap={1}>
                            <TextField
                              label="Khoảng cách (km)"
                              type="number"
                              size="small"
                              fullWidth
                              value={stop.distanceFromStart}
                              onChange={(e) =>
                                handleUpdateStop(
                                  index,
                                  "distanceFromStart",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              inputProps={{ min: 0, step: 0.1 }}
                            />
                            <TextField
                              label="Thời gian (phút)"
                              type="number"
                              size="small"
                              fullWidth
                              value={stop.estimatedTimeFromStart}
                              onChange={(e) =>
                                handleUpdateStop(
                                  index,
                                  "estimatedTimeFromStart",
                                  parseInt(e.target.value) || 0
                                )
                              }
                              inputProps={{ min: 0 }}
                            />
                          </Box>

                          <Box display="flex" gap={1}>
                            <TextField
                              label="Phí đón (VND)"
                              type="number"
                              size="small"
                              fullWidth
                              value={stop.pickupPrice}
                              onChange={(e) =>
                                handleUpdateStop(
                                  index,
                                  "pickupPrice",
                                  parseInt(e.target.value) || 0
                                )
                              }
                              inputProps={{ min: 0, step: 1000 }}
                            />
                            <TextField
                              label="Phí trả (VND)"
                              type="number"
                              size="small"
                              fullWidth
                              value={stop.dropoffPrice}
                              onChange={(e) =>
                                handleUpdateStop(
                                  index,
                                  "dropoffPrice",
                                  parseInt(e.target.value) || 0
                                )
                              }
                              inputProps={{ min: 0, step: 1000 }}
                            />
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </Box>

            {/* Action Buttons */}
            <Box display="flex" gap={2} justifyContent="flex-end" mt={1}>
              <Button variant="outlined" onClick={onReset} disabled={loading}>
                {isEditMode ? "Hủy" : "Làm mới"}
              </Button>
              <Button
                variant="contained"
                onClick={onSubmit}
                disabled={loading}
                sx={{
                  bgcolor: "blueviolet",
                  "&:hover": { bgcolor: "blueviolet", opacity: 0.9 },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : isEditMode ? (
                  "Cập nhật"
                ) : (
                  "Tạo tuyến đường"
                )}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Quick Station Creation Dialog */}
      <QuickStationForm
        open={quickStationOpen}
        onClose={() => setQuickStationOpen(false)}
        onSuccess={handleQuickStationSuccess}
        apiBase={apiBase}
      />
    </>
  );
};

export default RouteForm;