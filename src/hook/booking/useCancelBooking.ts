import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CancelBookingDto } from "../../dto/booking/cancel-booking.dto";
import {bookingAPI} from "../../api/booking";

export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cancelBookingDto: CancelBookingDto) => {
      return bookingAPI.cancelBooking(cancelBookingDto);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      
      console.log("✅ Booking cancelled successfully:", data);
    },
    onError: (error: any) => {
      console.error("❌ Cancel booking error:", error);
      
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to cancel booking";
      console.error("Error message:", errorMessage);
    },
  });
};