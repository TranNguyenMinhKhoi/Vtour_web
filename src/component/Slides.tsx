import React, { useRef } from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  useTheme,
  useMediaQuery,
  Stack,
  IconButton,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

type SlidesProps<T> = {
  title?: string;
  data: T[];
  containerWidth?: number;
  itemWidth?: number;
  renderItem?: (item: T) => React.ReactNode;
};

const Slides = <T,>({
  title = "Slides",
  data,
  containerWidth = 1200,
  itemWidth = 300,
  renderItem,
}: SlidesProps<T>) => {
  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const gap = 16; // khớp với sx gap: 2 -> 8px * 2 = 16px
      const amount = itemWidth + gap;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  const defaultRender = (item: any) => {
    // fallback render: hiển thị ảnh, tên, view hoặc percent nếu có
    return (
      <>
        <CardMedia
          component="img"
          image={item?.img ?? ""}
          alt={item?.name ?? ""}
          sx={{
            height: { xs: 160, sm: 170, md: 200 },
            objectFit: "cover",
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        />

        <CardContent sx={{ pt: 1, pb: 2, px: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {item?.name ?? "Không tên"}
          </Typography>

          <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
            {typeof item?.view === "number" ? (
              <>
                <VisibilityIcon fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  {item.view.toLocaleString()} lượt xem
                </Typography>
              </>
            ) : item?.percent ? (
              <Typography variant="body2" color="text.secondary">
                {String(item.percent)}
              </Typography>
            ) : null}
          </Stack>
        </CardContent>
      </>
    );
  };

  return (
    <Box
      sx={{
        width: containerWidth,
        maxWidth: "100%",
        mx: "auto",
        px: { xs: 1, md: 0 },
        position: "relative",
        mb: 3,
      }}
    >
      <Typography
        variant={isSmDown ? "h6" : "h5"}
        sx={{ fontWeight: 700, mb: 2, px: 1, color: "text.primary" }}
      >
        {title}
      </Typography>

      <Box sx={{ position: "relative" }}>
        {/* Left Arrow */}
        <IconButton
          onClick={() => handleScroll("left")}
          aria-label="scroll left"
          sx={{
            position: "absolute",
            top: "40%",
            left: 0,
            zIndex: 2,
            backgroundColor: "background.paper",
            boxShadow: 2,
            "&:hover": { backgroundColor: "grey.100" },
            display: { xs: "none", sm: "flex" },
          }}
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>

        {/* Scroll container */}
        <Box
          ref={scrollRef}
          role="list"
          aria-label={title}
          sx={{
            display: "flex",
            gap: 2,
            overflowX: "auto",
            py: 1,
            px: 5, 
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {data.map((item: T, idx: number) => (
            <Card
              key={(item as any)?.id ?? idx}
              role="listitem"
              sx={{
                minWidth: itemWidth,
                width: itemWidth,
                flex: "0 0 auto",
                scrollSnapAlign: "start",
                borderRadius: 2,
                boxShadow: 3,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {renderItem ? renderItem(item) : defaultRender(item)}
            </Card>
          ))}
        </Box>

        {/* Right Arrow */}
        <IconButton
          onClick={() => handleScroll("right")}
          aria-label="scroll right"
          sx={{
            position: "absolute",
            top: "40%",
            right: 0,
            zIndex: 2,
            backgroundColor: "background.paper",
            boxShadow: 2,
            "&:hover": { backgroundColor: "grey.100" },
            display: { xs: "none", sm: "flex" },
          }}
        >
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Slides;
