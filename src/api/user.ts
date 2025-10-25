import type {UpdateUserDto} from "../dto/user/update-user.dto";
import axiosClient from "../utils/axiosClient";

export const userAPI = {
    updateUser(updateUserDto: UpdateUserDto) {
    return axiosClient
      .put("/api/users/profile", updateUserDto)
      .then((res) => res.data);
  },
}