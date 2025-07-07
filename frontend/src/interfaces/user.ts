import { Gender, UserRole, UserStatus, UserStatusAccount } from "@/enums/user";
import { Room } from "./room";
import { Pagination } from "./service";
import { OrderBy } from "@/enums";

export interface User {
  id: number;
  created_at: string;
  updated_at: string;
  full_name: string;
  student_code: string;
  email: string;
  role: UserRole;
  gender: Gender;
  status: UserStatus;
  status_account: UserStatusAccount;
  phone: string;
  is_verify: boolean;
  birthday: string | null;
  avatar: string | null;
  room_id: number | null;
  room: Room | null;
  address: string | null;
  major: string | null;
  emergency_contact: EmergencyContact | null;
  // contracts: Contract[] | null;
  // payments: Payment[] | null;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface UserQueryParams extends Pagination {
  keyword?: string;
  order?: OrderBy;
  status?: UserStatus;
  gender?: Gender;
  role?: UserRole;
  status_account?: UserStatusAccount;
}
