import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

import type {Route, RouteFormData, Station} from "../type/route.types";
import RouteForm from "./RouteForm";


interface EditDialogProps {
  open: boolean;
  route: Route | null;
  stations: Station[];
  loadingStations: boolean;
  formData: RouteFormData;
  setFormData: React.Dispatch<React.SetStateAction<RouteFormData>>;
  loading: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onStationsRefresh: () => void;
  apiBase: string;
}

interface DeleteDialogProps {
  open: boolean;
  route: Route | null;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

interface DetailDialogProps {
  open: boolean;
  route: Route | null;
  onClose: () => void;
}

// Edit Dialog
export const EditRouteDialog = ({
  open,
  stations,
  loadingStations,
  formData,
  setFormData,
  loading,
  onClose,
  onSubmit,
  onStationsRefresh,
  apiBase,
}: EditDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogContent sx={{ p: 0 }}>
        <RouteForm
          stations={stations}
          loadingStations={loadingStations}
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
          onReset={onClose}
          loading={loading}
          isEditMode={true}
          onStationsRefresh={onStationsRefresh}
          apiBase={apiBase}
        />
      </DialogContent>
    </Dialog>
  );
};

// Delete Dialog
export const DeleteRouteDialog = ({
  open,
  route,
  loading,
  onClose,
  onConfirm,
}: DeleteDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Xác nhận xóa tuyến đường</DialogTitle>
      <DialogContent>
        <Typography>
          Bạn có chắc chắn muốn xóa tuyến đường{" "}
          <strong>{route?.routeName}</strong> không?
        </Typography>
        <Box mt={2}>
          <Typography variant="body2" color="text.secondary">
            Mã tuyến: <strong>{route?.routeCode}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Điểm đi:{" "}
            <strong>
              {route?.departureStationId?.stationName} -{" "}
              {route?.departureStationId?.city}
            </strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Điểm đến:{" "}
            <strong>
              {route?.arrivalStationId?.stationName} -{" "}
              {route?.arrivalStationId?.city}
            </strong>
          </Typography>
        </Box>
        <Alert severity="warning" sx={{ mt: 2 }}>
          • Nếu tuyến đường đang có lịch trình hoạt động, nó sẽ được{" "}
          <strong>vô hiệu hóa</strong> thay vì xóa hoàn toàn
          <br />• Nếu không có lịch trình nào, tuyến đường sẽ bị{" "}
          <strong>xóa vĩnh viễn</strong>
        </Alert>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Hủy
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Xóa"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Detail Dialog
export const RouteDetailDialog = ({
  open,
  route,
  onClose,
}: DetailDialogProps) => {
  if (!route) return null;

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours} giờ ${mins} phút` : `${mins} phút`;
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + " đ";
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h6" fontWeight={600}>
            Chi tiết tuyến đường
          </Typography>
          <Chip
            label={route.isActive ? "Hoạt động" : "Tạm dừng"}
            color={route.isActive ? "success" : "default"}
            size="small"
          />
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {/* Basic Info */}
        <Box mb={3}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Thông tin cơ bản
          </Typography>
          <Box display="flex" flexDirection="column" gap={1}>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Mã tuyến:
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {route.routeCode}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Tên tuyến:
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {route.routeName}
              </Typography>
            </Box>
            {route.description && (
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Mô tả:
                </Typography>
                <Typography variant="body2" sx={{ maxWidth: "60%" }}>
                  {route.description}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        <Divider />

        {/* Route Details */}
        <Box my={3}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Chi tiết hành trình
          </Typography>
          <Box display="flex" flexDirection="column" gap={1}>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Điểm đi:
              </Typography>
              <Box textAlign="right">
                <Typography variant="body2" fontWeight={600}>
                  {route.departureStationId?.stationName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {route.departureStationId?.city},{" "}
                  {route.departureStationId?.province}
                </Typography>
              </Box>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Điểm đến:
              </Typography>
              <Box textAlign="right">
                <Typography variant="body2" fontWeight={600}>
                  {route.arrivalStationId?.stationName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {route.arrivalStationId?.city},{" "}
                  {route.arrivalStationId?.province}
                </Typography>
              </Box>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Khoảng cách:
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {route.distance} km
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Thời gian di chuyển:
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {formatDuration(route.estimatedDuration)}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider />

        {/* Pricing */}
        <Box my={3}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Giá vé
          </Typography>
          <Box display="flex" flexDirection="column" gap={1}>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Giá cơ bản:
              </Typography>
              <Typography variant="body2" fontWeight={600} color="primary">
                {route.basePrice > 0 ? formatPrice(route.basePrice) : "Chưa đặt"}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Giá mỗi km:
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {route.pricePerKm > 0 ? formatPrice(route.pricePerKm) : "Chưa đặt"}
              </Typography>
            </Box>
            {route.pricePerKm > 0 && route.distance > 0 && (
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Ước tính (theo km):
                </Typography>
                <Typography variant="body2" color="success.main">
                  {formatPrice(route.pricePerKm * route.distance)}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* Stops */}
        {route.stops && route.stops.length > 0 && (
          <>
            <Divider />
            <Box mt={3}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Điểm dừng trung gian ({route.stops.length})
              </Typography>
              <List dense>
                {route.stops
                  .sort((a, b) => a.stopOrder - b.stopOrder)
                  .map((stop, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        border: "1px solid #e0e0e0",
                        borderRadius: 1,
                        mb: 1,
                      }}
                    >
                      <ListItemText
                        primary={
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography variant="body2" fontWeight={600}>
                              #{stop.stopOrder} -{" "}
                              {typeof stop.stopId === "object"
                                ? stop.stopId.stationName
                                : "N/A"}
                            </Typography>
                            <Chip
                              label={`${stop.distanceFromStart} km`}
                              size="small"
                            />
                          </Box>
                        }
                        secondary={
                          <Box mt={0.5}>
                            <Typography variant="caption" display="block">
                              Thời gian: {stop.estimatedTimeFromStart} phút từ
                              điểm đầu
                            </Typography>
                            <Typography variant="caption" display="block">
                              Phí đón: {formatPrice(stop.pickupPrice)} | Phí
                              trả: {formatPrice(stop.dropoffPrice)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
              </List>
            </Box>
          </>
        )}

        {/* Stats */}
        <Divider />
        <Box mt={3}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Thống kê
          </Typography>
          <Box display="flex" flexDirection="column" gap={1}>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Độ phổ biến:
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                ⭐ {route.popularityScore}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Ngày tạo:
              </Typography>
              <Typography variant="body2">
                {new Date(route.createdAt).toLocaleString("vi-VN")}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Cập nhật lần cuối:
              </Typography>
              <Typography variant="body2">
                {new Date(route.updatedAt).toLocaleString("vi-VN")}
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};