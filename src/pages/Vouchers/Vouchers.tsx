// import { Box, Typography } from "@mui/material";
// import Slides from "../../component/Slides";
// import { topNews, topSales } from "../../data/MockData";

// const Sales = () => {
//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         textAlign: "left",
//         gap: 3,
//       }}
//     >
//       <Box>
//         <Typography variant="h3" color="black">
//           Những ưu đãi dành riêng cho bạn!!!
//         </Typography>
//       </Box>
//       <Box
//         sx={{
//           backgroundImage: "url('/pur_sakura.png')",
//           borderRadius: 2,
//           boxShadow: 3,
//           width: { xs: "100%", md: 1200 },
//           height: { xs: "auto", md: 300 },
//         }}
//       >
//         <Box
//           sx={{ position: "relative", zIndex: 1, textAlign: "center", px: 2 }}
//         >
//           <Typography
//             variant="h3"
//             sx={{ fontWeight: "bold", color: "white", mb: 1 }}
//           >
//             Ưu đãi xuống đến 0%
//           </Typography>
//         </Box>
//       </Box>
//       <Box
//         sx={{
//           textAlign: "left",
//           mt: 5,
//         }}
//       >
//         <Slides title="Khuyến mãi hot" data={topSales} />
//         <Slides title="Top tin tức" data={topNews} />
//       </Box>
//     </Box>
//   );
// };

// export default Sales;


import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";
import axios from "axios";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

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
  startDate: string;
  endDate: string;
  isActive: boolean;
}

const Vouchers: React.FC = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      // const response = await axios.get("http://localhost:5000/api/voucher/active");
      const response = await axios.get("https://bus-ticket-be-dun.vercel.app/api/voucher/active");
      if (response.data.success) {
        setVouchers(response.data.vouchers);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Không thể tải danh sách voucher");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatDiscount = (voucher: Voucher) => {
    if (voucher.discountType === "percentage") {
      return `${voucher.discountValue}%`;
    }
    return `${voucher.discountValue.toLocaleString("vi-VN")}đ`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <Typography variant="h4" fontWeight={700} color="black" mb={3}>
          🎟️ Mã Giảm Giá
        </Typography>

        <Typography variant="body1" color="text.secondary" mb={4}>
          Sử dụng các mã giảm giá dưới đây để tiết kiệm chi phí khi đặt vé
        </Typography>

        {vouchers.length === 0 ? (
          <Alert severity="info">Hiện chưa có voucher nào khả dụng</Alert>
        ) : (
          <Grid container spacing={3}>
            {vouchers.map((voucher) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={voucher._id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    overflow: "visible",
                    border: "2px solid",
                    borderColor: "primary.main",
                    borderRadius: 2,
                    transition: "all 0.3s",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                      p: 2,
                      position: "relative",
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <LocalOfferIcon />
                      <Typography variant="h6" fontWeight={700}>
                        {formatDiscount(voucher)}
                      </Typography>
                      <Chip
                        label={voucher.discountType === "percentage" ? "Giảm %" : "Giảm tiền"}
                        size="small"
                        sx={{
                          bgcolor: "rgba(255,255,255,0.3)",
                          color: "white",
                          fontWeight: 600,
                        }}
                      />
                    </Box>

                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {voucher.description || voucher.name || "Mã giảm giá"}
                    </Typography>
                  </Box>

                  <CardContent sx={{ flexGrow: 1, pt: 2 }}>
                    <Box
                      sx={{
                        bgcolor: "#f8f9fa",
                        p: 1.5,
                        borderRadius: 1,
                        border: "1px dashed #ddd",
                        mb: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        color="primary"
                        sx={{ letterSpacing: 1 }}
                      >
                        {voucher.code}
                      </Typography>
                      <Button
                        size="small"
                        startIcon={<ContentCopyIcon />}
                        onClick={() => handleCopyCode(voucher.code)}
                        sx={{ minWidth: "auto" }}
                      >
                        {copiedCode === voucher.code ? "Đã sao" : "Sao"}
                      </Button>
                    </Box>

                    <Box display="flex" flexDirection="column" gap={1}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body2" color="text.secondary">
                          📦 Đơn tối thiểu:
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {voucher.minOrderAmount.toLocaleString("vi-VN")}đ
                        </Typography>
                      </Box>

                      {voucher.maxDiscountAmount && (
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body2" color="text.secondary">
                            🎯 Giảm tối đa:
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {voucher.maxDiscountAmount.toLocaleString("vi-VN")}đ
                          </Typography>
                        </Box>
                      )}

                      {voucher.maxUsageCount && (
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body2" color="text.secondary">
                            👥 Đã dùng:
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {voucher.currentUsageCount}/{voucher.maxUsageCount}
                          </Typography>
                        </Box>
                      )}

                      <Box
                        display="flex"
                        alignItems="center"
                        gap={1}
                        mt={1}
                        pt={1}
                        borderTop="1px solid #eee"
                      >
                        <CalendarTodayIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                        <Typography variant="caption" color="text.secondary">
                          HSD: {formatDate(voucher.endDate)}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>

                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "#f8f9fa",
                      borderTop: "1px solid #eee",
                    }}
                  >
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{
                        bgcolor: "blueviolet",
                        "&:hover": {
                          bgcolor: "blueviolet",
                          opacity: 0.9,
                        },
                      }}
                      onClick={() => handleCopyCode(voucher.code)}
                    >
                      {copiedCode === voucher.code ? "✓ Đã sao mã" : "Sao mã"}
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default Vouchers;