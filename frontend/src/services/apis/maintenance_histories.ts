import { CreateMaintenanceHistories } from "@/interfaces/maintenanceHistory";
import { baseService } from "../baseService";

class MaintenanceHistoriesService {
  private readonly basePath = "/maintenance-histories";

  list = async () => baseService.get(`${this.basePath}`);

  create = async (data: CreateMaintenanceHistories) =>
    baseService.post(`${this.basePath}`, data);

  update = async (id: number, data: CreateMaintenanceHistories) =>
    baseService.put(`${this.basePath}/${id}`, data);

  delete = async (id: number) => baseService.delete(`${this.basePath}/${id}`);
}

export const maintenanceHistoriesService = new MaintenanceHistoriesService();
