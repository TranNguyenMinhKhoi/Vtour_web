import { useQuery } from "@tanstack/react-query";
import {bookingAPI} from "../../api/booking";

export const useMyBookings = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["my-bookings"],
    queryFn: () => bookingAPI.getMyBookings(),
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};