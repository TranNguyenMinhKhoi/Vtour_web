export interface CancelBookingDto {
  bookingId: string; 
  email: string;      
}

export interface CancelBookingResponse {
  message: string;
  booking: {
    bookingReference: string;
    bookingStatus: string;
    cancelledAt: string;
    numberOfSeats: number;
    totalAmount: number;
  };
}