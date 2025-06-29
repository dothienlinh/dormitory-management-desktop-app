import { CreateFacility } from "@/interfaces/facility";
import { baseService } from "../baseService";

class AmenitiesService {
  private readonly basePath = "/amenities";

  list = async () => baseService.get(`${this.basePath}`);

  create = async (data: CreateFacility) =>
    baseService.post(`${this.basePath}`, data);

  update = async (id: number, data: CreateFacility) =>
    baseService.put(`${this.basePath}/${id}`, data);

  delete = async (id: number) => baseService.delete(`${this.basePath}/${id}`);
}

export const amenitiesService = new AmenitiesService();
