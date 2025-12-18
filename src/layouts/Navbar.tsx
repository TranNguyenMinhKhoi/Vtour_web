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

const Navbar = ({ scrolled }: { scrolled: boolean }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Lấy thông tin đăng nhập (bao gồm role)
  const { data: loginInfo, isLoading } = useLoginInfo();
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
    { label: "Ưu đãi", path: "/Vouchers" },
    { label: "Cẩm nang du lịch", path: "/tips" },
    { label: "Tin tức", path: "/news" },
    { label: "Vì sao? Vì-bus", path: "/us" },
  ];

  // Tất cả submenu admin
  const adminSubMenu = [
    { label: "Quản lý người dùng", path: "/AdminAccount", key: "manage-users" },
    { label: "Quản lý nhà xe", path: "/AdminBusCompany", key: "manage-bus" },
    { label: "Quản lý tuyến đường", path: "/AdminRoute", key: "manage-route" },
    { label: "Quản lý lịch trình", path: "/AdminSchedule", key: "manage-schedule" },
    { label: "Quản lý voucher", path: "/AdminVoucher", key: "manage-voucher" },
  ];

  const visibleAdminSubmenu = useMemo(() => {
    if (!role) return [];
    if (role === "admin") {
      return adminSubMenu;
    }
    if (role === "bus_manager") {
      // bus-manager chỉ thấy "Quản lý nhà xe"
      return adminSubMenu.filter((s) => s.key === "manage-bus");
    }
    return [];
  }, [role]);

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

          {/* Nút Admin — chỉ render nếu user role phù hợp (admin) */}
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
                {isLoading && (
                  <MenuItem disabled>
                    <CircularProgress size={16} />
                    <Box sx={{ ml: 1 }}>Đang tải...</Box>
                  </MenuItem>
                )}

                {!isLoading && visibleAdminSubmenu.length === 0 && (
                  <MenuItem disabled>Không có mục quản trị</MenuItem>
                )}

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
