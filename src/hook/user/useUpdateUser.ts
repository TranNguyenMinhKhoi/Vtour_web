import { useMutation, useQueryClient } from "@tanstack/react-query";
import {userAPI} from "../../api/user";
import type {UpdateUserDto} from "../../dto/user/update-user.dto";


export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserDto) => userAPI.updateUser(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });

      console.log("Profile updated successfully:", response);
    },
    onError: (error: any) => {
      console.error("Error updating profile:", error.response?.data || error);
    },
  });
};
