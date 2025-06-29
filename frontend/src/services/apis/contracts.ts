import { ContractQueryParams, CreateContract } from "@/interfaces/contract";
import { baseService } from "../baseService";

class ContractsService {
  private readonly basePath = "/contracts";

  listContracts = async (params?: ContractQueryParams) =>
    await baseService.get(`${this.basePath}`, {
      params: {
        ...params,
        page: params?.page || 1,
        limit: params?.limit || 10,
      },
    });

  createContract = async (data: CreateContract) =>
    await baseService.post(`${this.basePath}`, data);

  detailContract = async (id: number) =>
    await baseService.get(`${this.basePath}/${id}`);

  updateContract = async (id: number, data: CreateContract) =>
    await baseService.put(`${this.basePath}/${id}`, data);

  deleteContract = async (id: number) =>
    await baseService.delete(`${this.basePath}/${id}`);
}

export const contractsService = new ContractsService();
