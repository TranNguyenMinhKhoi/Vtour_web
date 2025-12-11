import axiosClient from "../utils/axiosClient";


export const routeAPI = {
  // Lấy tất cả route
  getAllRoutes() {
    return axiosClient
      .get("/api/routes", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => res.data);
  },

  // Lấy route theo id
  getRouteById(routeId: string) {
    return axiosClient
      .get(`/api/routes/${routeId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => res.data);
  },

  // Tạo route
  createRoute(data: any) {
    return axiosClient
      .post("/api/routes", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => res.data);
  },
};
