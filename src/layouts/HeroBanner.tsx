import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface Slide {
  id: number;
  image: string;
  title: string;
  description: string;
  link?: string;
}

const HeroBanner: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: Slide[] = [
    {
      id: 1,
      image: "/pur_sakura.png",
      title: "Vbus - Hình thành 1 hành trình",
      description: "Tìm chuyến đi, vé xe, và ưu đãi tốt nhất — chỉ trong vài giây",
      link: "/home",
    },
    {
      id: 2,
      image: "/green_pastel.jpg",
      title: "Khám phá điểm đến mới",
      description: "Trải nghiệm những hành trình tuyệt vời khắp Việt Nam",
      link: "/home",
    },
    {
      id: 3,
      image: "/yellow_pastel.jfif",
      title: "Ưu đãi đặc biệt",
      description: "Giảm giá lên đến 50% cho các tuyến đường hot",
      link: "/Vouchers",
    },
    {
      id: 4,
      image: "/pink_pastel.jpeg",
      title: "Đặt vé nhanh chóng",
      description: "Chỉ 3 bước đơn giản để hoàn tất đặt vé của bạn",
      link: "/home",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handleSlideClick = (link?: string) => {
    if (link) {
      navigate(link);
    }
  };

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <Box
      id="hero-banner"
      sx={{
        height: { xs: 320, md: 400 },
        width: "100vw",
        position: "relative",
        left: "49.4%",
        transform: "translateX(-50%) translateY(-10%)",
        mt: 0,
        paddingTop: 0,
        overflow: "hidden",
      }}
    >
      {/* Slides Container */}
      <Box
        sx={{
          position: "relative",
          height: "100%",
          width: "100%",
        }}
      >
        {slides.map((slide, index) => (
          <Box
            key={slide.id}
            onClick={() => handleSlideClick(slide.link)}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage: `url('${slide.image}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              opacity: currentSlide === index ? 1 : 0,
              transition: "opacity 0.8s ease-in-out",
              cursor: slide.link ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Overlay */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0) 100%)",
              }}
            />

            {/* Content */}
            <Box
              sx={{
                position: "relative",
                zIndex: 1,
                textAlign: "center",
                px: { xs: 2, md: 4 },
                maxWidth: "900px",
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: "white",
                  mb: 1,
                  fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" },
                }}
              >
                {slide.title}
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "rgba(255,255,255,0.9)",
                  mb: 2,
                  fontSize: { xs: "0.875rem", sm: "1rem", md: "1.125rem" },
                }}
              >
                {slide.description}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Navigation Arrows */}
      <IconButton
        onClick={handlePrevSlide}
        sx={{
          position: "absolute",
          left: { xs: 8, md: 24 },
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 2,
          backgroundColor: "rgba(255,255,255,0.3)",
          color: "white",
          "&:hover": {
            backgroundColor: "rgba(255,255,255,0.5)",
          },
          width: { xs: 36, md: 48 },
          height: { xs: 36, md: 48 },
        }}
      >
        <ChevronLeft fontSize="large" />
      </IconButton>

      <IconButton
        onClick={handleNextSlide}
        sx={{
          position: "absolute",
          right: { xs: 8, md: 24 },
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 2,
          backgroundColor: "rgba(255,255,255,0.3)",
          color: "white",
          "&:hover": {
            backgroundColor: "rgba(255,255,255,0.5)",
          },
          width: { xs: 36, md: 48 },
          height: { xs: 36, md: 48 },
        }}
      >
        <ChevronRight fontSize="large" />
      </IconButton>

      {/* Dots Indicator */}
      <Box
        sx={{
          position: "absolute",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2,
          display: "flex",
          gap: 1,
        }}
      >
        {slides.map((_, index) => (
          <Box
            key={index}
            onClick={() => handleDotClick(index)}
            sx={{
              width: currentSlide === index ? 24 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor:
                currentSlide === index
                  ? "white"
                  : "rgba(255,255,255,0.5)",
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.8)",
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default HeroBanner;