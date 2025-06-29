import { CreateRoom, RoomQueryParams } from "@/interfaces/room";
import { baseService } from "../baseService";

class RoomService {
  private readonly basePath = "/rooms";
  listRooms = async (params?: RoomQueryParams) =>
    await baseService.get(`${this.basePath}`, {
      params: {
        ...params,
        page: params?.page || 1,
        limit: params?.limit || 10,
      },
    });

  createRoom = async (data: CreateRoom) =>
    await baseService.post(`${this.basePath}`, data);

  detailRoom = async (id: number) =>
    await baseService.get(`${this.basePath}/${id}`);

  updateRoom = async (id: number, data: CreateRoom) =>
    await baseService.put(`${this.basePath}/${id}`, data);

  deleteRoom = async (id: number) =>
    await baseService.delete(`${this.basePath}/${id}`);
}

export const roomService = new RoomService();
