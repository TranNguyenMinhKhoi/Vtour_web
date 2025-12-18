import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
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
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import type {Route} from "../type/route.types";

interface RouteTableProps {
  routes: Route[];
  loading: boolean;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  onClearSearch: () => void;
  onEdit: (route: Route) => void;
  onDelete: (route: Route) => void;
  onToggleActive: (route: Route) => void;
  onViewDetail: (route: Route) => void;
}

const RouteTable = ({
  routes,
  loading,
  searchQuery,
  onSearchChange,
  onSearch,
  onClearSearch,
  onEdit,
  onDelete,
  onToggleActive,
  onViewDetail,
}: RouteTableProps) => {
  // Format duration
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}phút` : `${mins}phút`;
  };

  // Format price
  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + " đ";
  };

  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <Card sx={{ boxShadow: 3 }}>
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6" fontWeight={600}>
            Danh sách tuyến đường ({routes.length})
          </Typography>
        </Box>

        {/* Search Bar */}
        <Box display="flex" gap={1} mb={3}>
          <TextField
            fullWidth
            size="small"
            placeholder="Tìm kiếm theo mã tuyến hoặc tên tuyến..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: "gray" }} />,
            }}
          />
          <Button
            variant="contained"
            onClick={onSearch}
            disabled={loading}
            sx={{
              minWidth: 100,
              bgcolor: "blueviolet",
              "&:hover": { bgcolor: "blueviolet", opacity: 0.9 },
            }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : "Tìm"}
          </Button>
          {searchQuery && (
            <Button
              variant="outlined"
              onClick={onClearSearch}
              disabled={loading}
              sx={{ minWidth: 80 }}
              startIcon={<ClearIcon />}
            >
              Xóa
            </Button>
          )}
        </Box>

        {/* Table */}
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : routes.length === 0 ? (
          <Alert severity="info">
            {searchQuery
              ? "Không tìm thấy tuyến đường nào"
              : "Chưa có tuyến đường nào"}
          </Alert>
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
                    <strong>Giá cơ bản</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Điểm dừng</strong>
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
                    sx={{
                      "&:hover": { bgcolor: "#f9f9f9" },
                      opacity: route.isActive ? 1 : 0.6,
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {route.routeCode}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {route.routeName}
                      </Typography>
                      {route.description && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: "block",
                            maxWidth: 200,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {route.description}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {route.departureStationId?.stationName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {route.departureStationId?.city}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {route.arrivalStationId?.stationName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {route.arrivalStationId?.city}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {route.distance} km
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {formatDuration(route.estimatedDuration)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {route.basePrice > 0
                          ? formatPrice(route.basePrice)
                          : "-"}
                      </Typography>
                      {route.pricePerKm > 0 && (
                        <Typography variant="caption" color="text.secondary">
                          {formatPrice(route.pricePerKm)}/km
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={route.stops?.length || 0}
                        size="small"
                        color={
                          route.stops?.length > 0 ? "primary" : "default"
                        }
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={route.isActive ? "Hoạt động" : "Tạm dừng"}
                        color={route.isActive ? "success" : "default"}
                        size="small"
                      />
                      {route.popularityScore > 0 && (
                        <Typography
                          variant="caption"
                          color="primary"
                          sx={{ display: "block", mt: 0.5 }}
                        >
                          ⭐ {route.popularityScore}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" justifyContent="center" gap={0.5}>
                        <Tooltip title="Xem chi tiết">
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() => onViewDetail(route)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip
                          title={
                            route.isActive ? "Tạm dừng" : "Kích hoạt"
                          }
                        >
                          <IconButton
                            size="small"
                            color={route.isActive ? "warning" : "success"}
                            onClick={() => onToggleActive(route)}
                          >
                            {route.isActive ? (
                              <ToggleOffIcon fontSize="small" />
                            ) : (
                              <ToggleOnIcon fontSize="small" />
                            )}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Chỉnh sửa">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => onEdit(route)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => onDelete(route)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default RouteTable;