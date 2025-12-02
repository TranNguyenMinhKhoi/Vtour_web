import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Skeleton,
  Chip,
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

interface NewsArticle {
  id: number;
  title: string;
  text: string;
  url: string;
  image?: string;
  publish_date: string;
  author?: string;
  source_country: string;
}

interface NewsResponse {
  news: NewsArticle[];
  available: number;
}

const SlideNews: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const containerWidth = 1200;
  const itemWidth = 300;
  const API_KEY = 'bbda5c999acf4e6d97a8b21a982659c7'; // Thay bằng API key của bạn

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      // Lấy tin tức về du lịch, giao thông tại Việt Nam
      const response = await fetch(
        `https://api.worldnewsapi.com/search-news?text=vietnam+travel+OR+transport+OR+bus&source-countries=vn&language=vi&sort=publish-time&sort-direction=DESC&number=20&api-key=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Không thể tải tin tức');
      }

      const data: NewsResponse = await response.json();
      
      // Lọc các tin có hình ảnh
      const newsWithImages = data.news.filter(article => article.image);
      
      setNews(newsWithImages);
      setLoading(false);
    } catch (error) {
      console.error('Lỗi khi tải tin tức:', error);
      // Sử dụng dữ liệu mẫu nếu API lỗi
      setNews(getDemoNews());
      setLoading(false);
    }
  };

  // Dữ liệu mẫu để demo
  const getDemoNews = (): NewsArticle[] => {
    return [
      {
        id: 1,
        title: 'Khai trương tuyến xe bus mới kết nối TP.HCM - Đà Lạt',
        text: 'Tuyến xe bus cao cấp mới được đưa vào hoạt động...',
        url: '#',
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957',
        publish_date: '2024-12-02T10:00:00',
        source_country: 'vn'
      },
      {
        id: 2,
        title: 'Du lịch Việt Nam tăng trưởng mạnh trong quý 4/2024',
        text: 'Ngành du lịch ghi nhận sự tăng trưởng ấn tượng...',
        url: '#',
        image: 'https://images.unsplash.com/photo-1583508915901-b5f84c1dcde1',
        publish_date: '2024-12-01T15:30:00',
        source_country: 'vn'
      },
      {
        id: 3,
        title: 'Nha Trang đón hàng nghìn du khách dịp lễ',
        text: 'Thành phố biển Nha Trang chào đón làn sóng du khách...',
        url: '#',
        image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e',
        publish_date: '2024-11-30T09:00:00',
        source_country: 'vn'
      },
      {
        id: 4,
        title: 'Ra mắt ứng dụng đặt vé xe khách trực tuyến mới',
        text: 'Ứng dụng công nghệ mới giúp đặt vé dễ dàng hơn...',
        url: '#',
        image: 'https://images.unsplash.com/photo-1591768793355-74d04bb6608f',
        publish_date: '2024-11-29T14:20:00',
        source_country: 'vn'
      },
      {
        id: 5,
        title: 'Phú Quốc chuẩn bị cho mùa du lịch cao điểm',
        text: 'Đảo ngọc Phú Quốc đầu tư hạ tầng đón khách...',
        url: '#',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19',
        publish_date: '2024-11-28T11:00:00',
        source_country: 'vn'
      },
      {
        id: 6,
        title: 'Hà Nội tăng cường xe bus phục vụ dịp Tết Nguyên Đán',
        text: 'Thủ đô chuẩn bị phương tiện đáp ứng nhu cầu di chuyển...',
        url: '#',
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957',
        publish_date: '2024-11-27T08:30:00',
        source_country: 'vn'
      }
    ];
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const gap = 16; // gap: 2 trong MUI = 8px * 2 = 16px
      const amount = itemWidth + gap;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -amount : amount,
        behavior: 'smooth',
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Vừa xong';
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    if (diffInHours < 48) return 'Hôm qua';
    
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const truncateTitle = (title: string, maxLength: number = 70) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + '...';
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
          Tin tức mới nhất
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, px: 5 }}>
          {[...Array(4)].map((_, i) => (
            <Box key={i} sx={{ minWidth: itemWidth, width: itemWidth }}>
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
              <Skeleton variant="text" sx={{ mt: 1 }} />
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="40%" />
            </Box>
          ))}
        </Box>
      </Box>
    );
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
        Tin tức mới nhất
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
          aria-label="Tin tức mới nhất"
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
          {news.map((article) => (
            <Card
              key={article.id}
              role="listitem"
              component="a"
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                minWidth: itemWidth,
                width: itemWidth,
                flex: '0 0 auto',
                scrollSnapAlign: 'start',
                borderRadius: 2,
                boxShadow: 3,
                display: 'flex',
                flexDirection: 'column',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  image={article.image || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957'}
                  alt={article.title}
                  sx={{
                    height: { xs: 160, sm: 170, md: 200 },
                    objectFit: 'cover',
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                  }}
                  onError={(e: any) => {
                    e.target.src = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957';
                  }}
                />
                
                {/* Badge link ngoài */}
                <Chip
                  icon={<OpenInNewIcon fontSize="small" />}
                  label=""
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(4px)',
                    height: 28,
                    width: 28,
                    '& .MuiChip-icon': {
                      margin: 0,
                      fontSize: '1rem',
                    },
                    '& .MuiChip-label': {
                      display: 'none',
                    },
                  }}
                />
              </Box>
              
              <CardContent sx={{ pt: 1.5, pb: 2, px: 2, flexGrow: 1 }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    mb: 1,
                    minHeight: '2.8em',
                    lineHeight: 1.4,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    color: 'text.primary',
                  }}
                >
                  {truncateTitle(article.title)}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CalendarTodayIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(article.publish_date)}
                  </Typography>
                </Box>
              </CardContent>
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

export default SlideNews;