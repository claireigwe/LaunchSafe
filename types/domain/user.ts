export interface User {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  fullName: string | null;
  phone: string | null;
  country: string | null;
  createdAt: string;
  updatedAt: string;
}
