import { useMutation, useQueryClient } from "@tanstack/react-query";
import {authAPI} from "../../api/auth";

export const useLogOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authAPI.logout(),
    onSuccess: () => {
      localStorage.removeItem("token");
      queryClient.clear();
            // queryClient.invalidateQueries({ queryKey: ["loginInfo"] });
    },
  });
};