export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string; // ISO format: e.g. "2025-10-24"
  idNumber?: string;
}
