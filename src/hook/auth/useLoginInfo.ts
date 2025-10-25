import { useQuery } from "@tanstack/react-query";
import { authAPI } from "../../api/auth";
import type { UserDto } from "../../dto/user/user.dto";

interface UseLoginInfoOptions {
  enabled?: boolean;
}

export const useLoginInfo = (options?: UseLoginInfoOptions) => {
  return useQuery<UserDto | null>({
    queryKey: ["me"],
    queryFn: async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Nếu không có token, trả về null
        if (!token) {
          return null;
        }

        const res = await authAPI.loginInfo();
        // console.log("++++++++++++++++++++", res);
        return res.data as UserDto;
      } catch (error: any) {
        // Nếu lỗi 401, xóa token và trả về null
        if (error?.response?.status === 401) {
          localStorage.removeItem("token");
          return null;
        }
        throw error;
      }
    },
    enabled: options?.enabled ?? true,
    retry: (failureCount, error: any) => {
      // Không retry nếu lỗi 401
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
    staleTime: 5 * 60 * 1000, // 5 phút
    gcTime: 10 * 60 * 1000, // 10 phút (thay cacheTime)
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};