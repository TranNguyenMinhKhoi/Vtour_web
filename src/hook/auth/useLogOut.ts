import { useMutation, useQueryClient } from "@tanstack/react-query";
import {authAPI} from "../../api/auth";

export const useLogOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authAPI.logout(),
    onSuccess: () => {
      // Xóa token khỏi localStorage
      localStorage.removeItem("token");
      
      // Clear tất cả cache của react-query
      queryClient.clear();
      
      // Chỉ invalidate query cụ thể nếu cần
      // queryClient.invalidateQueries({ queryKey: ["loginInfo"] });
    },
  });
};