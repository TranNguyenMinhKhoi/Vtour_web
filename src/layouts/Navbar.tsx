import React, { useState, useMemo } from "react";
import {
  AppBar,
  Box,
  Button,
  Menu,
  MenuItem,
  Toolbar,
  CircularProgress,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import {useLoginInfo} from "../hook/auth/useLoginInfo";

/**
 * Navbar có phân quyền hiển thị menu Admin
 *
 * Quy tắc:
 * - admin: thấy nút Admin + tất cả adminSubMenu
 * - bus-manager: thấy nút Admin nhưng chỉ thấy "Quản lý nhà xe"
 * - passenger / not logged in: không thấy nút Admin
 *
 * Lưu ý: hook useLoginInfo() trả về cấu trúc giống BE: { user: { ... } } (theo BE auth.js)
 * => role được lấy bằng user?.user?.role
 */

const Navbar = ({ scrolled }: { scrolled: boolean }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Lấy thông tin đăng nhập (bao gồm role) từ React Query hook
  const { data: loginInfo, isLoading } = useLoginInfo();
  // loginInfo có thể là null (chưa đăng nhập) hoặc object { user: { ... } }
  const role = loginInfo?.user?.role ?? null;

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Menu hiển thị cho mọi user
  const menuItems = [
    { label: "Nhà xe", path: "/buscompany" },
    { label: "Ưu đãi", path: "/sales" },
    { label: "Cẩm nang du lịch", path: "/tips" },
    { label: "Tin tức", path: "/news" },
    { label: "Vì sao? Vì-bus", path: "/us" },
  ];

  // Tất cả submenu admin (chứa các đường dẫn quản trị)
  const adminSubMenu = [
    { label: "Quản lý người dùng", path: "/AdminAccount", key: "manage-users" },
    { label: "Quản lý nhà xe", path: "/AdminBusCompany", key: "manage-bus" },
    { label: "Quản lý tuyến đường", path: "/AdminTours", key: "manage-tours" },
    // { label: "Quản lý lộ trình", path: "/AdminRevenue", key: "manage-revenue" },
  ];

  // Tính toán submenu hiển thị dựa trên role
  const visibleAdminSubmenu = useMemo(() => {
    if (!role) return [];
    if (role === "admin") {
      return adminSubMenu;
    }
    if (role === "bus_manager") {
      // bus-manager chỉ thấy "Quản lý nhà xe"
      return adminSubMenu.filter((s) => s.key === "manage-bus");
    }
    // passenger hoặc role khác không thấy submenu
    return [];
  }, [role]);

  // Hiển thị loading nhỏ ở chỗ tương ứng nếu đang load loginInfo
  const adminButtonContent = isLoading ? (
    <Box sx={{ width: 36, display: "flex", justifyContent: "center" }}>
      <CircularProgress size={18} color="inherit" />
    </Box>
  ) : (
    "Admin"
  );

  return (
    <AppBar
      position="fixed"
      color="transparent"
      elevation={scrolled ? 1 : 0}
      sx={{
        top: { xs: 56, md: 64 },
        left: 0,
        right: 0,
        backgroundColor: scrolled ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.18)",
        borderBottom: scrolled ? "1px solid" : "none",
        borderColor: "divider",
        transition: "background-color 200ms ease, box-shadow 200ms ease",
        zIndex: (theme) => theme.zIndex.appBar + 1,
      }}
    >
      <Toolbar sx={{ minHeight: 48, px: { xs: 2, md: 4 }, gap: 2 }}>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", flexGrow: 1 }}>
          {menuItems.map((item) => (
            <Button
              key={item.path}
              component={NavLink}
              to={item.path}
              sx={{
                color: scrolled ? "rgba(0,0,0,0.7)" : "white",
                borderRadius: 2,
                px: 2,
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

          {/* Nút Admin — chỉ render nếu user role phù hợp (admin hoặc bus-manager) */}
          {/*
            Điều kiện hiển thị:
            - nếu đang load info (isLoading) — vẫn show Admin button với spinner
            - nếu role === 'admin' || role === 'bus-manager' -> hiển thị Admin button
          */}
          {(isLoading || role === "admin" || role === "bus_manager") && (
            <>
              <Button
                onClick={handleOpen}
                sx={{
                  color: scrolled ? "rgba(0,0,0,0.7)" : "white",
                  borderRadius: 2,
                  px: 2,
                  "&:hover": {
                    backgroundColor: "rgba(138,43,226,0.1)",
                  },
                  transition: "all 0.3s ease",
                }}
                aria-controls={Boolean(anchorEl) ? "admin-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={Boolean(anchorEl) ? "true" : undefined}
              >
                {adminButtonContent}
              </Button>

              <Menu
                id="admin-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "admin-button",
                }}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                {/* Nếu đang loading, show một mục disabled */}
                {isLoading && (
                  <MenuItem disabled>
                    <CircularProgress size={16} />
                    <Box sx={{ ml: 1 }}>Đang tải...</Box>
                  </MenuItem>
                )}

                {/* Nếu không có submenu (ví dụ passenger), show thông báo ngắn */}
                {!isLoading && visibleAdminSubmenu.length === 0 && (
                  <MenuItem disabled>Không có mục quản trị</MenuItem>
                )}

                {/* Render submenu phù hợp */}
                {!isLoading &&
                  visibleAdminSubmenu.map((sub) => (
                    <MenuItem
                      key={sub.path}
                      component={NavLink}
                      to={sub.path}
                      onClick={handleClose}
                    >
                      {sub.label}
                    </MenuItem>
                  ))}
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
