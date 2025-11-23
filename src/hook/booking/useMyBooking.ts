import { useQuery } from "@tanstack/react-query";
import {bookingAPI} from "../../api/booking";

export const useMyBookings = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["my-bookings"],
    queryFn: () => bookingAPI.getMyBookings(),
    enabled, // Chỉ fetch khi user đã login
    staleTime: 5 * 60 * 1000, // Cache 5 phút
    retry: 1,
  });
};