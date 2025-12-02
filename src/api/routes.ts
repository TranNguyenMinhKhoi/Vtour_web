import axiosClient from "../utils/axiosClient";


export const routeAPI = {
  // Lấy tất cả route để bạn extract arrivalStation
  getAllRoutes() {
    return axiosClient
      .get("/api/routes", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => res.data);
  },

  // Option: lấy route theo id (nếu cần)
  getRouteById(routeId: string) {
    return axiosClient
      .get(`/api/routes/${routeId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => res.data);
  },

  // Option: tạo route mới (nếu cần dùng về sau)
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
