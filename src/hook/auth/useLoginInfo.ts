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
    
        if (!token) {
          return null;
        }

        const res = await authAPI.loginInfo();
        // console.log("++++++++++++++++++++", res);
        return res.data as UserDto;
      } catch (error: any) {
        if (error?.response?.status === 401) {
          localStorage.removeItem("token");
          return null;
        }
        throw error;
      }
    },
    enabled: options?.enabled ?? true,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000, 
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};