// // src/hooks/useCreateBooking.ts
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import type {CreateBookingDto} from "../../dto/booking/create-booking.dto";
// import {bookingAPI} from "../../api/booking";


// export function useCreateBooking() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (data: CreateBookingDto) => bookingAPI.createBooking(data),

//     onSuccess: (res) => {
//       // Làm mới lại cache booking
//       queryClient.invalidateQueries({ queryKey: ["bookings"] });

//     //   toast?.success?.("Đặt vé thành công!");
//       console.log("Booking created:", res);
//     },

//     onError: (error: any) => {
//       console.error("Booking creation failed:", error);
//     //   toast?.error?.(
//     //     error?.response?.data?.message || "Không thể tạo đặt vé. Vui lòng thử lại!"
//     //   );
//     },
//   });
// }

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
