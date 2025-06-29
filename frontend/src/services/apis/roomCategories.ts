import { Pagination } from "@/interfaces/service";
import { baseService } from "../baseService";

export interface RoomCategory {
  id: number;
  name: string;
  description: string;
  capacity: number;
  price: number;
  acreage: number;
}

class RoomCategoryService {
  private readonly basePath = "/room-categories";
  listRoomCategories = async (params: Pagination) =>
    await baseService.get(`${this.basePath}`, { params });
}

export const roomCategoryService = new RoomCategoryService();
