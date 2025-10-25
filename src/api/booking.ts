import type { CreateBookingDto } from "../dto/booking/create-booking.dto";
import axiosClient from "../utils/axiosClient";

export const bookingAPI = {
  createBooking(createBookingDto: CreateBookingDto) {
    return axiosClient
      .post("/api/booking", createBookingDto, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => res.data);
  },
};
