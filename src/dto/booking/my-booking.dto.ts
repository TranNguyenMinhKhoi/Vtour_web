export interface MyBookingsResponse {
  bookings: BookingDetail[];
}

export interface BookingDetail {
  _id: string;
  bookingReference: string;
  bookingStatus: 'reserved' | 'confirmed' | 'cancelled' | 'completed';
  totalAmount: number;
  numberOfSeats: number;
  bookedAt: string;
  cancelledAt?: string;
  contactInfo: {
    email: string;
    phone: string;
  };
  passengers: Array<{
    fullName: string;
    seatNumber: string;
    idNumber?: string;
  }>;
  scheduleId: {
    _id: string;
    departureTime: string;
    arrivalTime: string;
    basePrice: number;
    routeId: {
      routeName: string;
      departureStationId: {
        stationName: string;
        city: string;
      };
      arrivalStationId: {
        stationName: string;
        city: string;
      };
    };
    busId: {
      busNumber: string;
      busType: string;
      companyId: {
        companyName: string;
      };
    };
  };
}