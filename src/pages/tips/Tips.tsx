import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";

const Tips: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        color: "black",
        textAlign: "left",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h3" fontWeight="bold">
        Mẹo hữu ích khi đi xe đường dài
      </Typography>

      <List sx={{ listStyleType: "disc", pl: 3 }}>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Đặt vé sớm để lựa chọn được giờ đẹp và vị trí ngồi thoải mái." />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Kiểm tra lại thông tin chuyến đi: thời gian xuất phát, điểm đón – trả khách, và giấy tờ tuỳ thân." />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Mang theo ít nhất một chai nước nhỏ và một số đồ ăn nhẹ để luôn giữ sức." />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Nếu bạn dễ say xe, hãy chuẩn bị thuốc say hoặc miếng dán chống say trước chuyến đi." />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Giữ đồ đạc, ví và điện thoại bên người — hạn chế để ở khoang hành lý nếu không cần thiết." />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Đến điểm đón trước 10–15 phút để không bị trễ xe hoặc bỏ lỡ thông báo quan trọng." />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Luôn thắt dây an toàn và tuân thủ hướng dẫn của tài xế để đảm bảo an toàn tối đa." />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Nếu cần hỗ trợ, hãy liên hệ ngay với tổng đài hoặc bộ phận hỗ trợ của nhà xe." />
        </ListItem>
      </List>

      <Button
        component={Link}
        to="/home"
        sx={{
          bgcolor: "blueviolet",
          color: "white",
          fontSize: "20px",
          transition: "transform 0.18s ease, background-color 0.18s ease",
          "&:hover": {
            transform: "scale(1.05)",
            color: "white",
          },
        }}
      >
        Đặt vé ngay
      </Button>
    </Box>
  );
};

export default Tips;
