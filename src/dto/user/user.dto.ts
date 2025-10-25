export type UserDto = {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    isActive: boolean;
    isEmailVerified: boolean;
    createdAt: string;
    lastLogin: string;
  };
};
