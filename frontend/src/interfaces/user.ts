import { Gender, OrderBy, UserRole, UserStatus } from "@/enums";
import { Room } from "./room";
import { Pagination } from "./service";

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
}
