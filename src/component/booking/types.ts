export interface SeatObj {
  seatNumber: string;
  seatType?: string;
  features?: any;
  isAvailable?: boolean;
  bookingStatus?: string | null;
}

export interface Station {
  _id: string;
  stationCode: string;
  stationName: string;
  city: string;
  province: string;
  address: string | { street?: string; ward?: string; district?: string } | any;
  contactNumber?: string;
}

export interface SeatMapData {
  totalSeats?: number;
  availableSeats?: number;
  bookedSeats?: number;
  layout?: any;
  seats?: SeatObj[];
}

export interface BookingData {
  scheduleId: string | null | undefined;
  busId?: string | null;
  selectedSeats: string[];
  passengers?: string;
  departureCity?: string;
  arrivalCity?: string;
  departureTime?: string;
  arrivalTime?: string;
  totalPrice?: string;
  departureStationId: string | null | undefined;
  arrivalStationId: string | null | undefined;
  departureStationName?: string | null;
  arrivalStationName?: string | null;
  // Optional fields for payment page
  passengerNames?: string[];
  email?: string;
  phone?: string;
}

export interface SeatMapProps {
  seatMap: SeatMapData;
  passengers?: string;
  scheduleId?: string | null;
  busId?: string | null;
  departureCity?: string;
  arrivalCity?: string;
  departureTime?: string;
  arrivalTime?: string;
  departureTimeDisplay?: string;
  arrivalTimeDisplay?: string;
  price?: string;
}