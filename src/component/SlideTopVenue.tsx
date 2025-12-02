import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Skeleton,
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

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
  arrivalStationId: Station;
  image: string;
}

interface Destination {
  city: string;
  province: string;
  image: string;
  routeCount: number;
}

const SlideTopVenue: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const containerWidth = 1200;
  const itemWidth = 300;

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/routes');
      const data = await response.json();
      
      // Nhóm các tuyến đường theo thành phố đến
      const destinationMap = new Map<string, Destination>();
      
      data.routes.forEach((route: Route) => {
        const city = route.arrivalStationId.city;
        const province = route.arrivalStationId.province;
        const key = `${city}-${province}`;
        
        if (destinationMap.has(key)) {
          const dest = destinationMap.get(key)!;
          dest.routeCount++;
        } else {
          destinationMap.set(key, {
            city,
            province,
            image: route.image,
            routeCount: 1
          });
        }
      });
      
      // Chuyển thành mảng và sắp xếp theo số lượng tuyến
      const uniqueDestinations = Array.from(destinationMap.values())
        .sort((a, b) => b.routeCount - a.routeCount);
      
      setDestinations(uniqueDestinations);
      setLoading(false);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu địa điểm:', error);
      setLoading(false);
    }
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
          Top địa điểm hút khách
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, px: 5 }}>
          {[...Array(4)].map((_, i) => (
            <Box key={i} sx={{ minWidth: itemWidth, width: itemWidth }}>
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
              <Skeleton variant="text" sx={{ mt: 1 }} />
              <Skeleton variant="text" width="60%" />
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
        Top địa điểm hút khách
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
          aria-label="Top địa điểm hút khách"
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
          {destinations.map((destination, idx) => (
            <Card
              key={`${destination.city}-${idx}`}
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
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
              }}
            >
              <CardMedia
                component="img"
                image={destination.image}
                alt={destination.city}
                sx={{
                  height: { xs: 160, sm: 170, md: 200 },
                  objectFit: 'cover',
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                }}
              />
              
              <CardContent sx={{ pt: 1, pb: 2, px: 2 }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    mb: 0.5
                  }}
                >
                  {destination.city}
                </Typography>
                
                {destination.city !== destination.province && (
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                  >
                    {destination.province}
                  </Typography>
                )}
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

export default SlideTopVenue;