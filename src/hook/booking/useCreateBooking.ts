import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingAPI } from "../../api/booking";
import type { CreateBookingDto } from "../../dto/booking/create-booking.dto";

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBookingDto) => bookingAPI.createBooking(data),

    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      console.log("✅ Booking created successfully:", res);
    },

    onError: (error: any) => {
      console.error("❌ Booking creation failed:", error);
    },
  });
}
