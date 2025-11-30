import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Avatar,
  Divider,
  ListItemIcon,
  CircularProgress,
} from "@mui/material";
import { NavLink, Link, useNavigate } from "react-router-dom";
import AccountCircle from "@mui/icons-material/AccountCircle";
// import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import { useLoginInfo } from "../hook/auth/useLoginInfo";
import { useLogOut } from "../hook/auth/useLogOut";
import {useLoginDialog} from "../context/LoginDialogContext";

type HeaderProps = {
  scrolled: boolean;
};

const menuItems = [
  { label: "Hủy vé", path: "/cancellation" },
  { label: "Đặt chỗ của tôi", path: "/booking" },
  // { label: "Giỏ hàng", path: "/cart", icon: <ShoppingCartIcon /> },
];

const Header: React.FC<HeaderProps> = ({ scrolled }) => {
  const navigate = useNavigate();

  // Kiểm tra token trước khi gọi API
  const token = localStorage.getItem("token");
  const hasToken = Boolean(token);

  // Gọi useLoginInfo với enabled dựa trên hasToken
  const { data: loginData, refetch } = useLoginInfo({
    enabled: hasToken,
  });

  // Mutation logout
  const { mutate: logout, isPending: isLoggingOut } = useLogOut();

  // local state dialog/menu
  // const [openLogin, setOpenLogin] = useState(false);
  const { openLoginDialog } = useLoginDialog()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Refetch user info khi có token mới
  useEffect(() => {
    if (hasToken) {
      refetch();
    }
  }, [hasToken, refetch]);

  // Nếu server trả về user (loginData) thì đóng dialog login tự động
  useEffect(() => {
    if (loginData) {
      // setOpenLogin(false);
      setAnchorEl(null);
    }
  }, [loginData]);

  // Xác định trạng thái đăng nhập
  const isLoggedIn = Boolean(loginData && hasToken);

  const lastName = loginData?.user.lastName ?? "";

  // Helper để lấy chữ viết tắt hiển thị avatar
  const getInitial = (text?: string) => {
    if (!text) return "U";
    return text.trim().charAt(0).toUpperCase();
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Xử lý đăng xuất
  const handleLogout = () => {
    handleMenuClose();
    logout(undefined, {
      onSuccess: () => {
        // navigate("/home");
        window.location.href = "/home";
      },
      onError: (error: any) => {
        console.error("Logout error:", error);
        localStorage.removeItem("token");
        // navigate("/home");
        window.location.href = "/home";
      },
    });
  };

  // Khi người dùng chọn item trong menu account
  const handleAccountMenuSelect = (
    action: "login" | "profile" | "booking" | "other",
    path?: string
  ) => {
    handleMenuClose();

    if (action === "login") {
      // setOpenLogin(true);
      openLoginDialog();
      return;
    }
    if (action === "profile") {
      navigate(path ?? "/profile");
      return;
    }
    if (action === "booking") {
      navigate(path ?? "/booking");
      return;
    }
    if (action === "other" && path) {
      navigate(path);
      return;
    }
  };

  return (
    <AppBar
      position="fixed"
      color="transparent"
      elevation={scrolled ? 2 : 0}
      sx={{
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: scrolled ? "rgba(255,255,255,0.95)" : "transparent",
        borderBottom: scrolled ? "1px solid" : "none",
        borderColor: "divider",
        transition: "background-color 200ms ease, box-shadow 200ms ease",
        zIndex: (theme) => theme.zIndex.appBar + 2,
      }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: 56, md: 64 },
          px: { xs: 2, md: 4 },
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Box
          component={Link}
          to="/home"
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            textDecoration: "none",
            color: scrolled ? "inherit" : "common.white",
          }}
        >
          <img
            src="/logo.png"
            alt="Logo"
            style={{
              width: 40,
              height: 40,
              marginRight: 8,
              objectFit: "contain",
            }}
          />
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: scrolled ? "blueviolet" : "white" }}
          >
            Vbus
          </Typography>
        </Box>

        {/* Right actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          {/* price language
          <Typography
            variant="body2"
            sx={{
              display: { xs: "none", md: "block" },
              color: scrolled ? "text.secondary" : "rgba(255,255,255,0.9)",
            }}
          >
            15.000 VND | VI
          </Typography> */}

          {/* Menu buttons */}
          {menuItems.map((item) => (
            <Button
              key={item.path}
              component={NavLink}
              to={item.path}
              size="small"
              sx={{
                color: scrolled ? "rgba(0,0,0,0.7)" : "white",
                borderRadius: 2,
                // px: item.icon ? 1 : 2,
                // minWidth: item.icon ? 40 : undefined,
                "&.active": {
                  backgroundColor: "rgba(137, 43, 226, 0.62)",
                  color: "white",
                  fontWeight: "bold",
                },
                "&:hover": {
                  backgroundColor: "rgba(138,43,226,0.1)",
                },
                transition: "all 0.3s ease",
              }}
            >
              {item.label}
            </Button>
          ))}

          {/* Account section with lastName */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {isLoggedIn && lastName && (
              <Typography
                variant="body2"
                sx={{
                  color: scrolled ? "text.primary" : "white",
                  fontWeight: 500,
                  display: { xs: "none", sm: "block" },
                }}
              >
                {lastName}
              </Typography>
            )}

            <IconButton
              onClick={handleMenuOpen}
              sx={{
                color: scrolled ? "blueviolet" : "rgba(255,255,255,0.95)",
                "&:hover": {
                  transform: "scale(1.05)",
                  backgroundColor: "rgba(138,43,226,0.1)",
                },
              }}
              aria-controls={Boolean(anchorEl) ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={Boolean(anchorEl) ? "true" : undefined}
              size="large"
            >
              {isLoggedIn ? (
                <Avatar sx={{ width: 32, height: 32, bgcolor: "blueviolet" }}>
                  {getInitial(lastName || loginData?.user.firstName)}
                </Avatar>
              ) : (
                <AccountCircle />
              )}
            </IconButton>
          </Box>

          {/* Account menu */}
          <Menu
            id="account-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            PaperProps={{ sx: { minWidth: 200, mt: 1 } }}
          >
            {!isLoggedIn ? (
              <MenuItem
                onClick={() => {
                  handleAccountMenuSelect("login");
                }}
              >
                <ListItemIcon>
                  <AccountCircle fontSize="small" />
                </ListItemIcon>
                Đăng nhập/Đăng ký
              </MenuItem>
            ) : (
              <>
                <MenuItem
                  onClick={() => handleAccountMenuSelect("profile", "/profile")}
                >
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  Thông tin cá nhân
                </MenuItem>

                <MenuItem
                  onClick={() => handleAccountMenuSelect("booking", "/booking")}
                >
                  <ListItemIcon>
                    <ConfirmationNumberIcon fontSize="small" />
                  </ListItemIcon>
                  Vé của tôi
                </MenuItem>

                <Divider />

                <MenuItem onClick={handleLogout} disabled={isLoggingOut}>
                  <ListItemIcon>
                    {isLoggingOut ? (
                      <CircularProgress size={20} />
                    ) : (
                      <LogoutIcon fontSize="small" color="error" />
                    )}
                  </ListItemIcon>
                  <Typography color={isLoggingOut ? "text.secondary" : "error"}>
                    {isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
                  </Typography>
                </MenuItem>
              </>
            )}
          </Menu>
        </Box>
      </Toolbar>
      

      {/* Dialog Login */}
      {/* <Dialog
        open={openLogin}
        onClose={() => setOpenLogin(false)}
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogContent sx={{ p: 0 }}>
          <Login dialogMode onClose={() => setOpenLogin(false)} />
        </DialogContent>
      </Dialog> */}
    </AppBar>
  );
};

export default Header;