import { useState, useEffect } from "react";
import { Box, Typography, Snackbar, Alert } from "@mui/material";
import axios from "axios";
import type {Route, RouteFormData, RouteResponse, SingleRouteResponse, Station} from "./type/route.types";
import RouteForm from "./component/RouteForm";
import RouteTable from "./component/RouteTable";
import {DeleteRouteDialog, EditRouteDialog, RouteDetailDialog} from "./component/RouteDialog";


const MainAdminRoute = () => {
  // API Base URL
  const API_BASE = "https://bus-ticket-be-dun.vercel.app/api";
  // const API_BASE = "http://localhost:5000/api";

  // Data states
  const [stations, setStations] = useState<Station[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);

  // Form state
  const [formData, setFormData] = useState<RouteFormData>({
    routeCode: "",
    routeName: "",
    departureStationId: "",
    arrivalStationId: "",
    distance: "",
    estimatedDuration: "",
    basePrice: "",
    pricePerKm: "",
    description: "",
    image: "",
    stops: [],
  });

  // Edit states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [editFormData, setEditFormData] = useState<RouteFormData>({
    routeCode: "",
    routeName: "",
    departureStationId: "",
    arrivalStationId: "",
    distance: "",
    estimatedDuration: "",
    basePrice: "",
    pricePerKm: "",
    description: "",
    image: "",
    stops: [],
  });

  // Delete states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingRoute, setDeletingRoute] = useState<Route | null>(null);

  // Detail states
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [viewingRoute, setViewingRoute] = useState<Route | null>(null);

  // Search states
  const [searchQuery, setSearchQuery] = useState("");

  // Loading states
  const [loading, setLoading] = useState(false);
  const [loadingStations, setLoadingStations] = useState(true);
  const [loadingRoutes, setLoadingRoutes] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info",
  });

  useEffect(() => {
    fetchStations();
    fetchRoutes();
  }, []);

  // ============= API CALLS =============

  // Fetch stations with cache busting
  const fetchStations = async () => {
    try {
      setLoadingStations(true);
      
      // Add timestamp to prevent 304 cache
      const timestamp = new Date().getTime();
      const response = await axios.get(`${API_BASE}/stations?limit=200&_t=${timestamp}`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        }
      });
      
      console.log("✅ Stations loaded:", response.data.stations?.length);
      setStations(response.data.stations || []);
    } catch (error) {
      console.error("❌ Lỗi khi tải bến xe:", error);
      showSnackbar("Không thể tải danh sách bến xe", "error");
    } finally {
      setLoadingStations(false);
    }
  };

  // Fetch routes
  const fetchRoutes = async (query: string = "") => {
    try {
      setLoadingRoutes(true);

      const endpoint = query.trim()
        ? `${API_BASE}/routes/search?query=${encodeURIComponent(
            query.trim()
          )}&limit=100`
        : `${API_BASE}/routes?limit=100`;

      const response = await axios.get<RouteResponse>(endpoint);
      setRoutes(response.data.routes || []);
    } catch (error) {
      console.error("❌ Lỗi khi tải tuyến đường:", error);
      showSnackbar("Không thể tải danh sách tuyến đường", "error");
    } finally {
      setLoadingRoutes(false);
    }
  };

  // ============= CREATE ROUTE =============

  const handleCreateRoute = async () => {
    // Validation
    if (
      !formData.routeCode ||
      !formData.routeName ||
      !formData.departureStationId ||
      !formData.arrivalStationId
    ) {
      showSnackbar("Vui lòng điền đầy đủ thông tin bắt buộc", "error");
      return;
    }

    if (!formData.distance || !formData.estimatedDuration) {
      showSnackbar("Vui lòng nhập khoảng cách và thời gian di chuyển", "error");
      return;
    }

    if (formData.departureStationId === formData.arrivalStationId) {
      showSnackbar("Điểm đi và điểm đến phải khác nhau", "error");
      return;
    }

    // Validate stops if any
    if (formData.stops.length > 0) {
      const invalidStop = formData.stops.find(
        (stop) =>
          !stop.stopId ||
          stop.distanceFromStart <= 0 ||
          stop.estimatedTimeFromStart <= 0
      );

      if (invalidStop) {
        showSnackbar(
          "Vui lòng điền đầy đủ thông tin cho tất cả các điểm dừng",
          "error"
        );
        return;
      }

      // Check distance order
      const sortedStops = [...formData.stops].sort(
        (a, b) => a.stopOrder - b.stopOrder
      );
      for (let i = 1; i < sortedStops.length; i++) {
        if (
          sortedStops[i].distanceFromStart <=
          sortedStops[i - 1].distanceFromStart
        ) {
          showSnackbar(
            "Khoảng cách của các điểm dừng phải tăng dần theo thứ tự",
            "error"
          );
          return;
        }
      }

      // Check max distance
      const maxStopDistance = Math.max(
        ...sortedStops.map((s) => s.distanceFromStart)
      );
      if (maxStopDistance > parseFloat(formData.distance)) {
        showSnackbar(
          "Khoảng cách điểm dừng không được vượt quá tổng khoảng cách tuyến",
          "error"
        );
        return;
      }
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const newRoute = {
        routeCode: formData.routeCode.trim().toUpperCase(),
        routeName: formData.routeName.trim(),
        departureStationId: formData.departureStationId,
        arrivalStationId: formData.arrivalStationId,
        distance: parseFloat(formData.distance),
        estimatedDuration: parseInt(formData.estimatedDuration),
        basePrice: parseFloat(formData.basePrice) || 0,
        pricePerKm: parseFloat(formData.pricePerKm) || 0,
        description: formData.description.trim(),
        image:
          formData.image.trim() ||
          "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957",
        stops: formData.stops,
      };

      const response = await axios.post<SingleRouteResponse>(
        `${API_BASE}/routes`,
        newRoute,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        showSnackbar("Tạo tuyến đường thành công!", "success");
        resetForm();
        fetchRoutes(searchQuery);
      }
    } catch (error: any) {
      console.error("❌ Lỗi khi tạo tuyến đường:", error);

      if (error.response?.status === 400) {
        showSnackbar(
          error.response.data.message || "Mã tuyến đã tồn tại",
          "error"
        );
      } else if (error.response?.status === 401) {
        showSnackbar("Bạn cần đăng nhập để thực hiện thao tác này", "error");
      } else {
        showSnackbar(
          error.response?.data?.message || "Không thể tạo tuyến đường",
          "error"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ============= UPDATE ROUTE =============

  const handleOpenEditDialog = (route: Route) => {
    setEditingRoute(route);
    setEditFormData({
      routeCode: route.routeCode,
      routeName: route.routeName,
      departureStationId: route.departureStationId._id,
      arrivalStationId: route.arrivalStationId._id,
      distance: route.distance.toString(),
      estimatedDuration: route.estimatedDuration.toString(),
      basePrice: route.basePrice.toString(),
      pricePerKm: route.pricePerKm.toString(),
      description: route.description || "",
      image: route.image || "",
      stops: route.stops || [],
    });
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditingRoute(null);
    setEditFormData({
      routeCode: "",
      routeName: "",
      departureStationId: "",
      arrivalStationId: "",
      distance: "",
      estimatedDuration: "",
      basePrice: "",
      pricePerKm: "",
      description: "",
      image: "",
      stops: [],
    });
  };

  const handleUpdateRoute = async () => {
    // Same validation as create
    if (
      !editFormData.routeCode ||
      !editFormData.routeName ||
      !editFormData.departureStationId ||
      !editFormData.arrivalStationId
    ) {
      showSnackbar("Vui lòng điền đầy đủ thông tin bắt buộc", "error");
      return;
    }

    if (!editFormData.distance || !editFormData.estimatedDuration) {
      showSnackbar("Vui lòng nhập khoảng cách và thời gian di chuyển", "error");
      return;
    }

    if (editFormData.departureStationId === editFormData.arrivalStationId) {
      showSnackbar("Điểm đi và điểm đến phải khác nhau", "error");
      return;
    }

    try {
      setEditLoading(true);
      const token = localStorage.getItem("token");

      const updatedRoute = {
        routeCode: editFormData.routeCode.trim().toUpperCase(),
        routeName: editFormData.routeName.trim(),
        departureStationId: editFormData.departureStationId,
        arrivalStationId: editFormData.arrivalStationId,
        distance: parseFloat(editFormData.distance),
        estimatedDuration: parseInt(editFormData.estimatedDuration),
        basePrice: parseFloat(editFormData.basePrice) || 0,
        pricePerKm: parseFloat(editFormData.pricePerKm) || 0,
        description: editFormData.description.trim(),
        image: editFormData.image.trim(),
        stops: editFormData.stops,
      };

      const response = await axios.put<SingleRouteResponse>(
        `${API_BASE}/routes/${editingRoute?._id}`,
        updatedRoute,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        showSnackbar("Cập nhật tuyến đường thành công!", "success");
        handleCloseEditDialog();
        fetchRoutes(searchQuery);
      }
    } catch (error: any) {
      console.error("❌ Lỗi khi cập nhật tuyến đường:", error);

      if (error.response?.status === 400) {
        showSnackbar(
          error.response.data.message || "Thông tin không hợp lệ",
          "error"
        );
      } else if (error.response?.status === 401) {
        showSnackbar("Bạn cần đăng nhập để thực hiện thao tác này", "error");
      } else if (error.response?.status === 404) {
        showSnackbar("Không tìm thấy tuyến đường", "error");
      } else {
        showSnackbar(
          error.response?.data?.message || "Không thể cập nhật tuyến đường",
          "error"
        );
      }
    } finally {
      setEditLoading(false);
    }
  };

  // ============= DELETE ROUTE =============

  const handleOpenDeleteDialog = (route: Route) => {
    setDeletingRoute(route);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeletingRoute(null);
  };

  const handleDeleteRoute = async () => {
    if (!deletingRoute) return;

    try {
      setDeleteLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `${API_BASE}/routes/${deletingRoute._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.deleted) {
        showSnackbar("Xóa tuyến đường thành công!", "success");
      } else {
        showSnackbar(
          "Tuyến đường đã được vô hiệu hóa (đang có lịch trình hoạt động)",
          "info"
        );
      }

      handleCloseDeleteDialog();
      fetchRoutes(searchQuery);
    } catch (error: any) {
      console.error("❌ Lỗi khi xóa tuyến đường:", error);

      if (error.response?.status === 401) {
        showSnackbar("Bạn cần đăng nhập để thực hiện thao tác này", "error");
      } else if (error.response?.status === 404) {
        showSnackbar("Không tìm thấy tuyến đường", "error");
      } else {
        showSnackbar(
          error.response?.data?.message || "Không thể xóa tuyến đường",
          "error"
        );
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  // ============= TOGGLE ACTIVE =============

  const handleToggleActive = async (route: Route) => {
    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `${API_BASE}/routes/${route._id}/toggle`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showSnackbar(
        `Tuyến đường đã được ${route.isActive ? "tạm dừng" : "kích hoạt"}`,
        "success"
      );
      fetchRoutes(searchQuery);
    } catch (error: any) {
      console.error("❌ Lỗi khi thay đổi trạng thái:", error);
      showSnackbar("Không thể thay đổi trạng thái tuyến đường", "error");
    }
  };

  // ============= VIEW DETAIL =============

  const handleViewDetail = (route: Route) => {
    setViewingRoute(route);
    setDetailDialogOpen(true);
  };

  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false);
    setViewingRoute(null);
  };

  // ============= SEARCH =============

  const handleSearch = async () => {
    await fetchRoutes(searchQuery);
  };

  const handleClearSearch = async () => {
    setSearchQuery("");
    await fetchRoutes("");
  };

  // ============= UTILITIES =============

  const resetForm = () => {
    setFormData({
      routeCode: "",
      routeName: "",
      departureStationId: "",
      arrivalStationId: "",
      distance: "",
      estimatedDuration: "",
      basePrice: "",
      pricePerKm: "",
      description: "",
      image: "",
      stops: [],
    });
  };

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info"
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  // ============= RENDER =============

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Header */}
      <Typography variant="h4" color="black" fontWeight={700}>
        Quản lý tuyến đường
      </Typography>

      {/* Create Route Form */}
      <RouteForm
        stations={stations}
        loadingStations={loadingStations}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleCreateRoute}
        onReset={resetForm}
        loading={loading}
        onStationsRefresh={fetchStations}
        apiBase={API_BASE}
      />

      {/* Routes Table */}
      <RouteTable
        routes={routes}
        loading={loadingRoutes}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
        onClearSearch={handleClearSearch}
        onEdit={handleOpenEditDialog}
        onDelete={handleOpenDeleteDialog}
        onToggleActive={handleToggleActive}
        onViewDetail={handleViewDetail}
      />

      {/* Edit Dialog */}
      <EditRouteDialog
        open={editDialogOpen}
        route={editingRoute}
        stations={stations}
        loadingStations={loadingStations}
        formData={editFormData}
        setFormData={setEditFormData}
        loading={editLoading}
        onClose={handleCloseEditDialog}
        onSubmit={handleUpdateRoute}
        onStationsRefresh={fetchStations}
        apiBase={API_BASE}
      />

      {/* Delete Dialog */}
      <DeleteRouteDialog
        open={deleteDialogOpen}
        route={deletingRoute}
        loading={deleteLoading}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteRoute}
      />

      {/* Detail Dialog */}
      <RouteDetailDialog
        open={detailDialogOpen}
        route={viewingRoute}
        onClose={handleCloseDetailDialog}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MainAdminRoute;