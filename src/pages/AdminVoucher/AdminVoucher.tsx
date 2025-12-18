import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Paper,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Grid,
  InputAdornment,
  Tooltip,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Search as SearchIcon,
  History as HistoryIcon,
  Extension as ExtensionIcon,
} from "@mui/icons-material";
import axios from "axios";
import dayjs from "dayjs";

// const API_BASE = "http://localhost:5000";
const API_BASE = "https://bus-ticket-be-dun.vercel.app";


interface Voucher {
  _id: string;
  code: string;
  name?: string;
  description?: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  maxDiscountAmount?: number;
  minOrderAmount: number;
  maxUsageCount?: number;
  currentUsageCount: number;
  usagePerUser: number;
  startDate: string;
  endDate: string;
  applicableRoutes: any[];
  applicableCompanies: any[];
  isActive: boolean;
  status?: string;
  remainingUsage?: number;
  createdAt: string;
  statistics?: {
    totalUsage: number;
    totalDiscount: number;
    uniqueUsers: number;
  };
}

interface VoucherUsage {
  _id: string;
  userId: {
    fullName: string;
    email: string;
  };
  bookingId: {
    bookingReference: string;
    totalAmount: number;
  };
  discountAmount: number;
  usedAt: string;
}

const AdminVoucher: React.FC = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openDialog, setOpenDialog] = useState(false);
  const [openUsageDialog, setOpenUsageDialog] = useState(false);
  const [openExtendDialog, setOpenExtendDialog] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
  const [usageList, setUsageList] = useState<VoucherUsage[]>([]);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    discountType: "percentage" as "percentage" | "fixed",
    discountValue: 0,
    maxDiscountAmount: "",
    minOrderAmount: 0,
    maxUsageCount: "",
    usagePerUser: 1,
    startDate: dayjs().format("YYYY-MM-DD"),
    endDate: dayjs().add(30, "day").format("YYYY-MM-DD"),
    isActive: true,
  });

  const [extendDate, setExtendDate] = useState("");

  useEffect(() => {
    fetchVouchers();
  }, [page, rowsPerPage, searchTerm, statusFilter]);

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE}/api/voucher`, {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          search: searchTerm,
          status: statusFilter,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setVouchers(response.data.vouchers);
        setTotal(response.data.pagination.total);
      }
    } catch (error: any) {
      console.error("❌ Fetch vouchers error:", error);
      setError(error?.response?.data?.message || "Không thể tải danh sách voucher");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (voucher?: Voucher) => {
    if (voucher) {
      setEditingVoucher(voucher);
      setFormData({
        code: voucher.code,
        name: voucher.name || "",
        description: voucher.description || "",
        discountType: voucher.discountType,
        discountValue: voucher.discountValue,
        maxDiscountAmount: voucher.maxDiscountAmount?.toString() || "",
        minOrderAmount: voucher.minOrderAmount,
        maxUsageCount: voucher.maxUsageCount?.toString() || "",
        usagePerUser: voucher.usagePerUser,
        startDate: dayjs(voucher.startDate).format("YYYY-MM-DD"),
        endDate: dayjs(voucher.endDate).format("YYYY-MM-DD"),
        isActive: voucher.isActive,
      });
    } else {
      setEditingVoucher(null);
      setFormData({
        code: "",
        name: "",
        description: "",
        discountType: "percentage",
        discountValue: 0,
        maxDiscountAmount: "",
        minOrderAmount: 0,
        maxUsageCount: "",
        usagePerUser: 1,
        startDate: dayjs().format("YYYY-MM-DD"),
        endDate: dayjs().add(30, "day").format("YYYY-MM-DD"),
        isActive: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingVoucher(null);
    setError(null);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const payload = {
        ...formData,
        maxDiscountAmount: formData.maxDiscountAmount ? parseFloat(formData.maxDiscountAmount) : null,
        maxUsageCount: formData.maxUsageCount ? parseInt(formData.maxUsageCount) : null,
      };

      if (editingVoucher) {
        // Update
        await axios.put(
          `${API_BASE}/api/voucher/${editingVoucher._id}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSuccess("Cập nhật voucher thành công");
      } else {
        // Create
        await axios.post(`${API_BASE}/api/voucher`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Tạo voucher thành công");
      }

      handleCloseDialog();
      fetchVouchers();
    } catch (error: any) {
      console.error("❌ Submit voucher error:", error);
      setError(error?.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (voucher: Voucher) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API_BASE}/api/voucher/${voucher._id}/toggle`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess(`Voucher đã được ${!voucher.isActive ? "kích hoạt" : "vô hiệu hóa"}`);
      fetchVouchers();
    } catch (error: any) {
      console.error("❌ Toggle voucher error:", error);
      setError(error?.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  const handleDelete = async (voucher: Voucher) => {
    if (!window.confirm(`Bạn có chắc muốn xóa voucher ${voucher.code}?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/api/voucher/${voucher._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Xóa voucher thành công");
      fetchVouchers();
    } catch (error: any) {
      console.error("❌ Delete voucher error:", error);
      setError(error?.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  const handleViewUsage = async (voucher: Voucher) => {
    try {
      setSelectedVoucher(voucher);
      setOpenUsageDialog(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE}/api/voucher/${voucher._id}/usage`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setUsageList(response.data.usages);
      }
    } catch (error: any) {
      console.error("❌ Fetch usage error:", error);
      setError("Không thể tải lịch sử sử dụng");
    }
  };

  const handleOpenExtend = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setExtendDate(dayjs(voucher.endDate).add(30, "day").format("YYYY-MM-DD"));
    setOpenExtendDialog(true);
  };

  const handleExtend = async () => {
    if (!selectedVoucher) return;

    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API_BASE}/api/voucher/${selectedVoucher._id}/extend`,
        { endDate: extendDate },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess("Gia hạn voucher thành công");
      setOpenExtendDialog(false);
      fetchVouchers();
    } catch (error: any) {
      console.error("❌ Extend voucher error:", error);
      setError(error?.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  const getStatusChip = (status?: string) => {
    const statusConfig: Record<string, { label: string; color: any }> = {
      active: { label: "Đang hoạt động", color: "success" },
      inactive: { label: "Đã vô hiệu", color: "default" },
      expired: { label: "Hết hạn", color: "error" },
      upcoming: { label: "Sắp diễn ra", color: "info" },
      depleted: { label: "Hết lượt", color: "warning" },
    };

    const config = statusConfig[status || "active"];
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography color="black" variant="h4" fontWeight={700}>
          Quản lý Voucher
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ bgcolor: "blueviolet" }}
        >
          Tạo Voucher Mới
        </Button>
      </Box>

      {/* Alerts */}
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" onClose={() => setSuccess(null)} sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{xs: 12, md: 6}}>
            <TextField
              fullWidth
              placeholder="Tìm kiếm theo mã, tên voucher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={{xs: 12, md: 3}}>
            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={statusFilter}
                label="Trạng thái"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="active">Đang hoạt động</MenuItem>
                <MenuItem value="inactive">Đã vô hiệu</MenuItem>
                <MenuItem value="expired">Hết hạn</MenuItem>
                <MenuItem value="upcoming">Sắp diễn ra</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Mã Voucher</strong></TableCell>
              <TableCell><strong>Tên</strong></TableCell>
              <TableCell><strong>Giảm giá</strong></TableCell>
              <TableCell><strong>Sử dụng</strong></TableCell>
              <TableCell><strong>Thời hạn</strong></TableCell>
              <TableCell><strong>Trạng thái</strong></TableCell>
              <TableCell align="center"><strong>Thao tác</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : vouchers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Không có voucher nào
                </TableCell>
              </TableRow>
            ) : (
              vouchers.map((voucher) => (
                <TableRow key={voucher._id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {voucher.code}
                    </Typography>
                  </TableCell>
                  <TableCell>{voucher.name || "—"}</TableCell>
                  <TableCell>
                    {voucher.discountType === "percentage"
                      ? `${voucher.discountValue}%`
                      : `${voucher.discountValue.toLocaleString("vi-VN")}₫`}
                    {voucher.maxDiscountAmount && (
                      <Typography variant="caption" display="block" color="text.secondary">
                        Tối đa: {voucher.maxDiscountAmount.toLocaleString("vi-VN")}₫
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {voucher.currentUsageCount}
                      {voucher.maxUsageCount ? `/${voucher.maxUsageCount}` : ""}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {dayjs(voucher.startDate).format("DD/MM/YYYY")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      → {dayjs(voucher.endDate).format("DD/MM/YYYY")}
                    </Typography>
                  </TableCell>
                  <TableCell>{getStatusChip(voucher.status)}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Sửa">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(voucher)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={voucher.isActive ? "Vô hiệu hóa" : "Kích hoạt"}>
                      <IconButton
                        size="small"
                        onClick={() => handleToggleActive(voucher)}
                      >
                        {voucher.isActive ? (
                          <VisibilityOffIcon fontSize="small" />
                        ) : (
                          <VisibilityIcon fontSize="small" />
                        )}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Gia hạn">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenExtend(voucher)}
                      >
                        <ExtensionIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Lịch sử sử dụng">
                      <IconButton
                        size="small"
                        onClick={() => handleViewUsage(voucher)}
                      >
                        <HistoryIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(voucher)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          labelRowsPerPage="Số dòng mỗi trang:"
        />
      </TableContainer>

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingVoucher ? "Chỉnh sửa Voucher" : "Tạo Voucher Mới"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{xs: 12, md: 6}}>
              <TextField
                fullWidth
                label="Mã Voucher *"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                disabled={!!editingVoucher}
              />
            </Grid>
            <Grid size={{xs: 12, md: 6}}>
              <TextField
                fullWidth
                label="Tên Voucher"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid size={{xs: 12}}>
              <TextField
                fullWidth
                label="Mô tả"
                multiline
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
            <Grid size={{xs: 12, md: 4}}>
              <FormControl fullWidth>
                <InputLabel>Loại giảm giá *</InputLabel>
                <Select
                  value={formData.discountType}
                  label="Loại giảm giá *"
                  onChange={(e: any) => setFormData({ ...formData, discountType: e.target.value })}
                >
                  <MenuItem value="percentage">Phần trăm (%)</MenuItem>
                  <MenuItem value="fixed">Số tiền cố định (₫)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{xs: 12, md: 4}}>
              <TextField
                fullWidth
                type="number"
                label="Giá trị giảm *"
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {formData.discountType === "percentage" ? "%" : "₫"}
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{xs: 12, md: 4}}>
              <TextField
                fullWidth
                type="number"
                label="Giảm tối đa (₫)"
                value={formData.maxDiscountAmount}
                onChange={(e) => setFormData({ ...formData, maxDiscountAmount: e.target.value })}
                disabled={formData.discountType === "fixed"}
              />
            </Grid>
            <Grid size={{xs: 12, md: 4}}>
              <TextField
                fullWidth
                type="number"
                label="Đơn tối thiểu (₫)"
                value={formData.minOrderAmount}
                onChange={(e) => setFormData({ ...formData, minOrderAmount: parseFloat(e.target.value) })}
              />
            </Grid>
            <Grid size={{xs: 12, md: 4}}>
              <TextField
                fullWidth
                type="number"
                label="Số lượt sử dụng"
                value={formData.maxUsageCount}
                onChange={(e) => setFormData({ ...formData, maxUsageCount: e.target.value })}
                placeholder="Không giới hạn"
              />
            </Grid>
            <Grid size={{xs: 12, md: 4}}>
              <TextField
                fullWidth
                type="number"
                label="Lượt/người dùng"
                value={formData.usagePerUser}
                onChange={(e) => setFormData({ ...formData, usagePerUser: parseInt(e.target.value) })}
              />
            </Grid>
            <Grid size={{xs: 12, md: 6}}>
              <TextField
                fullWidth
                type="date"
                label="Ngày bắt đầu *"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{xs: 12, md: 6}}>
              <TextField
                fullWidth
                type="date"
                label="Ngày kết thúc *"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{xs: 12}}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                }
                label="Kích hoạt voucher"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            sx={{ bgcolor: "blueviolet" }}
          >
            {loading ? <CircularProgress size={24} /> : editingVoucher ? "Cập nhật" : "Tạo mới"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Usage History Dialog */}
      <Dialog open={openUsageDialog} onClose={() => setOpenUsageDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Lịch sử sử dụng: {selectedVoucher?.code}
        </DialogTitle>
        <DialogContent>
          {selectedVoucher?.statistics && (
            <Box sx={{ mb: 2, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
              <Grid container spacing={2}>
                <Grid size={{xs: 4}}>
                  <Typography variant="body2" color="text.secondary">
                    Tổng lượt sử dụng
                  </Typography>
                  <Typography variant="h6">{selectedVoucher.statistics.totalUsage}</Typography>
                </Grid>
                <Grid size={{xs: 4}}>
                  <Typography variant="body2" color="text.secondary">
                    Tổng giảm giá
                  </Typography>
                  <Typography variant="h6">
                    {selectedVoucher.statistics.totalDiscount.toLocaleString("vi-VN")}₫
                  </Typography>
                </Grid>
                <Grid size={{xs: 4}}>
                  <Typography variant="body2" color="text.secondary">
                    Người dùng unique
                  </Typography>
                  <Typography variant="h6">{selectedVoucher.statistics.uniqueUsers}</Typography>
                </Grid>
              </Grid>
            </Box>
          )}

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Người dùng</TableCell>
                  <TableCell>Booking</TableCell>
                  <TableCell>Giảm giá</TableCell>
                  <TableCell>Thời gian</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usageList.map((usage) => (
                  <TableRow key={usage._id}>
                    <TableCell>
                      <Typography variant="body2">{usage.userId.fullName}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {usage.userId.email}
                      </Typography>
                    </TableCell>
                    <TableCell>{usage.bookingId.bookingReference}</TableCell>
                    <TableCell>{usage.discountAmount.toLocaleString("vi-VN")}₫</TableCell>
                    <TableCell>{dayjs(usage.usedAt).format("DD/MM/YYYY HH:mm")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUsageDialog(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Extend Dialog */}
      <Dialog open={openExtendDialog} onClose={() => setOpenExtendDialog(false)}>
        <DialogTitle>Gia hạn Voucher</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Voucher: <strong>{selectedVoucher?.code}</strong>
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Ngày kết thúc hiện tại:{" "}
            <strong>{dayjs(selectedVoucher?.endDate).format("DD/MM/YYYY")}</strong>
          </Typography>
          <TextField
            fullWidth
            type="date"
            label="Ngày kết thúc mới"
            value={extendDate}
            onChange={(e) => setExtendDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenExtendDialog(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleExtend} sx={{ bgcolor: "blueviolet" }}>
            Gia hạn
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminVoucher;