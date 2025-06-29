import { OrderBy } from "@/enums";

export interface IResponse<T> {
  data: T;
  message: string;
  success: boolean;
  total: number;
}

export interface Pagination {
  page?: number;
  limit?: number;
}

export interface IQueryParams extends Pagination {
  keyword?: string;
  order?: OrderBy;
}
