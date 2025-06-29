import { RoomStatus } from "@/enums/rooms";
import { User } from "./user";
import { Amenity } from "./amenity";
import { MaintenanceHistory } from "./maintenanceHistory";
import { Pagination } from "./service";

export interface CreateRoom {
  room_number: string;
  status: string;
  room_category_id: number;
  amenity_ids: number[];
}

export interface RoomCategory {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  capacity: number;
  price: number;
  acreage: number;
}

export interface Room {
  id: number;
  created_at: string;
  updated_at: string;
  room_number: string;
  status: RoomStatus;
  user_count: number;
  room_category_id: number;
  room_category: RoomCategory;
  room_amenities: RoomAmenity[];
  users: User[];
  maintenance_histories: MaintenanceHistory[];
}

export interface RoomAmenity {
  id: number;
  created_at: string;
  updated_at: string;
  room_id: number;
  amenity_id: number;
  amenity: Amenity;
}

export interface RoomQueryParams extends Pagination {
  room_number?: string;
}
