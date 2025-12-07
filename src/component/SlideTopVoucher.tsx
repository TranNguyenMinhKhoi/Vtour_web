import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Skeleton,
  Button,
  Chip,
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import axios from 'axios';

interface Voucher {
  _id: string;
  code: string;
  name?: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxDiscountAmount?: number;
  minOrderAmount: number;
  maxUsageCount?: number;
  currentUsageCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

const SlideTopVoucher: React.FC = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const containerWidth = 1200;
  const itemWidth = 320;

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const response = await axios.get('https://bus-ticket-be-dun.vercel.app/api/voucher/active');
      if (response.data.success) {
        setVouchers(response.data.vouchers);
      }
      setLoading(false);
    } catch (error) {
      console.error('Lỗi khi tải voucher:', error);
      setLoading(false);
    }
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const gap = 16;
      const amount = itemWidth + gap;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -amount : amount,
        behavior: 'smooth',
      });
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatDiscount = (voucher: Voucher) => {
    if (voucher.discountType === 'percentage') {
      return `${voucher.discountValue}%`;
    }
    return `${voucher.discountValue.toLocaleString('vi-VN')}đ`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box
        sx={{
          width: containerWidth,
          maxWidth: '100%',
          mx: 'auto',
          px: { xs: 1, md: 0 },
          mb: 3,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, px: 1 }}>
          🎟️ Mã Giảm Giá Hot
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, px: 5 }}>
          {[...Array(4)].map((_, i) => (
            <Box key={i} sx={{ minWidth: itemWidth, width: itemWidth }}>
              <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 2 }} />
              <Skeleton variant="text" sx={{ mt: 1 }} />
              <Skeleton variant="text" width="60%" />
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  if (vouchers.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        width: containerWidth,
        maxWidth: '100%',
        mx: 'auto',
        px: { xs: 1, md: 0 },
        position: 'relative',
        mb: 3,
      }}
    >
      <Typography
        variant="h5"
        sx={{ 
          fontWeight: 700, 
          mb: 2, 
          px: 1, 
          color: 'text.primary',
          fontSize: { xs: '1.25rem', sm: '1.5rem' }
        }}
      >
        Mã Giảm Giá Hot
      </Typography>

      <Box sx={{ position: 'relative' }}>
        {/* Nút mũi tên trái */}
        <IconButton
          onClick={() => handleScroll('left')}
          aria-label="cuộn sang trái"
          sx={{
            position: 'absolute',
            top: '40%',
            left: 0,
            zIndex: 2,
            backgroundColor: 'background.paper',
            boxShadow: 2,
            '&:hover': { backgroundColor: 'grey.100' },
            display: { xs: 'none', sm: 'flex' },
          }}
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>

        {/* Container cuộn */}
        <Box
          ref={scrollRef}
          role="list"
          aria-label="Mã giảm giá hot"
          sx={{
            display: 'flex',
            gap: 2,
            overflowX: 'auto',
            py: 1,
            px: 5,
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {vouchers.map((voucher) => (
            <Card
              key={voucher._id}
              role="listitem"
              sx={{
                minWidth: itemWidth,
                width: itemWidth,
                flex: '0 0 auto',
                scrollSnapAlign: 'start',
                borderRadius: 2,
                boxShadow: 3,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                border: '2px solid',
                borderColor: 'primary.main',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
              }}
            >
              {/* Header với gradient */}
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  p: 2,
                  minHeight: 100,
                }}
              >
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <LocalOfferIcon sx={{ fontSize: 24 }} />
                  <Typography variant="h6" fontWeight={700}>
                    {formatDiscount(voucher)}
                  </Typography>
                  <Chip
                    label={voucher.discountType === 'percentage' ? 'Giảm %' : 'Giảm tiền'}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.3)',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.7rem',
                    }}
                  />
                </Box>

                <Typography 
                  variant="body2" 
                  sx={{ 
                    opacity: 0.95,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {voucher.description || voucher.name || 'Mã giảm giá đặc biệt'}
                </Typography>
              </Box>
              
              {/* Body */}
              <CardContent sx={{ pt: 2, pb: 1, px: 2, flexGrow: 1 }}>
                {/* Code box */}
                <Box
                  sx={{
                    bgcolor: '#f8f9fa',
                    p: 1.5,
                    borderRadius: 1,
                    border: '1px dashed #ddd',
                    mb: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    color="primary"
                    sx={{ letterSpacing: 1, fontSize: '0.95rem' }}
                  >
                    {voucher.code}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleCopyCode(voucher.code)}
                    sx={{ 
                      p: 0.5,
                      '&:hover': { bgcolor: 'primary.light', color: 'white' }
                    }}
                  >
                    <ContentCopyIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Box>

                {/* Thông tin chi tiết */}
                <Box display="flex" flexDirection="column" gap={0.8}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" color="text.secondary" sx={{ minWidth: 90 }}>
                      📦 Đơn tối thiểu:
                    </Typography>
                    <Typography variant="caption" fontWeight={600}>
                      {voucher.minOrderAmount.toLocaleString('vi-VN')}đ
                    </Typography>
                  </Box>

                  {voucher.maxDiscountAmount && (
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="caption" color="text.secondary" sx={{ minWidth: 90 }}>
                        🎯 Giảm tối đa:
                      </Typography>
                      <Typography variant="caption" fontWeight={600}>
                        {voucher.maxDiscountAmount.toLocaleString('vi-VN')}đ
                      </Typography>
                    </Box>
                  )}

                  {voucher.maxUsageCount && (
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="caption" color="text.secondary" sx={{ minWidth: 90 }}>
                        👥 Đã sử dụng:
                      </Typography>
                      <Typography variant="caption" fontWeight={600}>
                        {voucher.currentUsageCount}/{voucher.maxUsageCount}
                      </Typography>
                    </Box>
                  )}

                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    mt={0.5}
                    pt={1}
                    borderTop="1px solid #eee"
                  >
                    <CalendarTodayIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      HSD: {formatDate(voucher.endDate)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>

              {/* Footer button */}
              <Box sx={{ p: 1.5, bgcolor: '#f8f9fa', borderTop: '1px solid #eee' }}>
                <Button
                  fullWidth
                  variant="contained"
                  size="small"
                  startIcon={copiedCode === voucher.code ? null : <ContentCopyIcon />}
                  sx={{
                    bgcolor: 'blueviolet',
                    '&:hover': {
                      bgcolor: 'blueviolet',
                      opacity: 0.9,
                    },
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                  onClick={() => handleCopyCode(voucher.code)}
                >
                  {copiedCode === voucher.code ? '✓ Đã sao mã' : 'Sao mã'}
                </Button>
              </Box>
            </Card>
          ))}
        </Box>

        {/* Nút mũi tên phải */}
        <IconButton
          onClick={() => handleScroll('right')}
          aria-label="cuộn sang phải"
          sx={{
            position: 'absolute',
            top: '40%',
            right: 0,
            zIndex: 2,
            backgroundColor: 'background.paper',
            boxShadow: 2,
            '&:hover': { backgroundColor: 'grey.100' },
            display: { xs: 'none', sm: 'flex' },
          }}
        >
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default SlideTopVoucher;