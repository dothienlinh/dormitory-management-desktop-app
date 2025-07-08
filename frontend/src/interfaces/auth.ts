import { User } from "./user";

export interface Login {
  access_token: string;
  refresh_token: string;
  user: User;
  is_verified: boolean;
}

export interface RegisterData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}
