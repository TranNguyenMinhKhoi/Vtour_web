// // export type CreateBookingDto = {
// //   bookingReference: string;
// //   bookingId: string;
// //   routeName: string;
// //   departureStop: string;
// //   arrivalStop: string;
// //   departureTime: string;
// //   arrivalTime: string;
// //   companyName: string;
// //   busNumber: string;
// //   busType: string;
// //   scheduleId: string;
// //   passengers: {
// //     fullName: string;
// //     seatNumber: string;
// //     idNumber?: string | null;
// //   }[];
// //   numberOfSeats: number;
// //   price: number;
// //   totalAmount: number;
// //   contactInfo: { contactEmail?: string; contactPhone?: string };
// //   specialRequests?: string;
// // };

// export type CreateBookingDto = {
//   scheduleId: string;
//   departureStop: string;
//   arrivalStop: string;
//   passengers: {
//     fullName: string;
//     seatNumber: string;
//     idNumber?: string | null;
//   }[];
//   contactInfo: {
//     email: string;
//     phone: string;
//   };
//   specialRequests?: string;
// };

// src/dto/booking/create-booking.dto.ts
export interface CreateBookingDto {
  scheduleId: string; // ID của chuyến đi
  departureStop: string; // Điểm đón
  arrivalStop: string; // Điểm trả
  passengers: PassengerInfo[]; // Danh sách hành khách
  contactInfo: ContactInfo; // Thông tin liên hệ
  specialRequests?: string; // Ghi chú thêm (không bắt buộc)
}

// --- Subtypes --- //

export interface PassengerInfo {
  fullName: string;
  seatNumber: string;
  idNumber?: string | null; // CCCD / CMND (tùy chọn)
}

export interface ContactInfo {
  email: string; // email người đặt
  phone: string; // số điện thoại
}
