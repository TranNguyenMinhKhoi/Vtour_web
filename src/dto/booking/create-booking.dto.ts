export interface CreateBookingDto {
  scheduleId: string; 
  departureStop: string;
  arrivalStop: string; 
  passengers: PassengerInfo[]; 
  contactInfo: ContactInfo; 
  specialRequests?: string; 
}


export interface PassengerInfo {
  fullName: string;
  seatNumber: string;
  idNumber?: string | null; 
}

export interface ContactInfo {
  email: string; 
  phone: string; 
}
