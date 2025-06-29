import { ContractStatus } from "@/enums/contract";
import { Room } from "./room";
import { Pagination } from "./service";
import { User } from "./user";

export interface CreateContract {
  end_date: Date;
  price: number;
  room_id: number;
  start_date: Date;
  user_id: number;
}

export interface Contract {
  id: number;
  created_at: string;
  updated_at: string;
  user_id: number;
  user: User;
  room_id: number;
  room: Room;
  start_date: string;
  end_date: string;
  price: number;
  status: ContractStatus;
  description: string;
  code: string;
}

export interface ContractQueryParams extends Pagination {
  keyword?: string;
}
