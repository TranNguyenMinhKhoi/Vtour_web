import type {CancelBookingDto, CancelBookingResponse} from "../dto/booking/cancel-booking.dto";
import type { CreateBookingDto } from "../dto/booking/create-booking.dto";
import axiosClient from "../utils/axiosClient";

export const bookingAPI = {
  createBooking(createBookingDto: CreateBookingDto) {
    return axiosClient
      .post("/api/bookings", createBookingDto, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => res.data);
  },

  cancelBooking(cancelBookingDto: CancelBookingDto): Promise<CancelBookingResponse> {
    return axiosClient
      .patch("/api/bookings/cancel-by-reference", cancelBookingDto)
      .then((res) => res.data);
  },
};
