import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";
import axios from "axios";

interface QuickStationFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (stationId: string) => void;
  apiBase: string;
}

const QuickStationForm = ({
  open,
  onClose,
  onSuccess,
  apiBase,
}: QuickStationFormProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    stationCode: "",
    stationName: "",
    stationType: "main",
    city: "",
    province: "",
    street: "",
    ward: "",
    district: "",
    contactNumber: "",
  });

  const handleSubmit = async () => {
    // Validation
    if (!formData.stationCode || !formData.stationName || !formData.city || !formData.province) {
      setError("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const token = localStorage.getItem("token");

      const newStation = {
        stationCode: formData.stationCode.trim().toUpperCase(),
        stationName: formData.stationName.trim(),
        stationType: formData.stationType,
        city: formData.city.trim(),
        province: formData.province.trim(),
        address: {
          street: formData.street.trim(),
          ward: formData.ward.trim(),
          district: formData.district.trim(),
        },
        contactNumber: formData.contactNumber.trim(),
        isActive: true,
      };

      const response = await axios.post(`${apiBase}/stations`, newStation, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        // Reset form
        setFormData({
          stationCode: "",
          stationName: "",
          stationType: "main",
          city: "",
          province: "",
          street: "",
          ward: "",
          district: "",
          contactNumber: "",
        });
        
        // Callback with new station ID
        onSuccess(response.data.station._id);
      }
    } catch (error: any) {
      console.error("Lỗi khi tạo bến xe:", error);
      
      if (error.response?.status === 400) {
        setError(error.response.data.message || "Mã bến xe đã tồn tại");
      } else if (error.response?.status === 401) {
        setError("Bạn cần đăng nhập để thực hiện thao tác này");
      } else {
        setError("Không thể tạo bến xe");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Tạo bến xe mới</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          {/* Row 1: Code & Name */}
          <Box display="flex" gap={2}>
            <TextField
              label="Mã bến xe *"
              value={formData.stationCode}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  stationCode: e.target.value.toUpperCase(),
                }))
              }
              fullWidth
              size="small"
              placeholder="VD: BXSG01"
            />
            <TextField
              label="Tên bến xe *"
              value={formData.stationName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  stationName: e.target.value,
                }))
              }
              fullWidth
              size="small"
              placeholder="VD: Bến xe Miền Đông"
            />
          </Box>

          {/* Row 2: Type */}
          <FormControl fullWidth size="small">
            <InputLabel>Loại bến xe *</InputLabel>
            <Select
              value={formData.stationType}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  stationType: e.target.value,
                }))
              }
              label="Loại bến xe *"
            >
              <MenuItem value="main">Bến chính</MenuItem>
              <MenuItem value="stop">Điểm dừng</MenuItem>
            </Select>
          </FormControl>

          {/* Row 3: City & Province */}
          <Box display="flex" gap={2}>
            <TextField
              label="Thành phố *"
              value={formData.city}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, city: e.target.value }))
              }
              fullWidth
              size="small"
              placeholder="VD: Hồ Chí Minh"
            />
            <TextField
              label="Tỉnh/Thành *"
              value={formData.province}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, province: e.target.value }))
              }
              fullWidth
              size="small"
              placeholder="VD: TP. Hồ Chí Minh"
            />
          </Box>

          {/* Row 4: Street */}
          <TextField
            label="Đường"
            value={formData.street}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, street: e.target.value }))
            }
            fullWidth
            size="small"
            placeholder="VD: Đường Đinh Bộ Lĩnh"
          />

          {/* Row 5: Ward & District */}
          <Box display="flex" gap={2}>
            <TextField
              label="Phường/Xã"
              value={formData.ward}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, ward: e.target.value }))
              }
              fullWidth
              size="small"
              placeholder="VD: Phường 24"
            />
            <TextField
              label="Quận/Huyện"
              value={formData.district}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, district: e.target.value }))
              }
              fullWidth
              size="small"
              placeholder="VD: Quận Bình Thạnh"
            />
          </Box>

          {/* Row 6: Contact */}
          <TextField
            label="Số điện thoại"
            value={formData.contactNumber}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                contactNumber: e.target.value,
              }))
            }
            fullWidth
            size="small"
            placeholder="VD: 0283 8 222 222"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={{
            bgcolor: "blueviolet",
            "&:hover": { bgcolor: "blueviolet", opacity: 0.9 },
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Tạo"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuickStationForm;