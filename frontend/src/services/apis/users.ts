import { baseService } from "../baseService";
import { UserQueryParams } from "@/interfaces/user";

class UsersService {
  private readonly basePath = "/users";

  getAll = async (params?: UserQueryParams) =>
    await baseService.get(`${this.basePath}`, {
      params: {
        ...params,
        page: params?.page || 1,
        limit: params?.limit || 10,
      },
    });

  getById = async (id: number) =>
    await baseService.get(`${this.basePath}/${id}`);
}

export const usersService = new UsersService();
