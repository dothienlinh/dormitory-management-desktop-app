import { fetchAPI } from "@/helpers/fetchAPI";
import { AxiosInstance, AxiosRequestConfig } from "axios";
import instance from "./instance";

class BaseService {
  constructor(private readonly instance: AxiosInstance) {}

  get = async (url: string, config?: AxiosRequestConfig) =>
    await fetchAPI(this.instance.get(url, config));

  post = async (url: string, data?: unknown, config?: AxiosRequestConfig) =>
    await fetchAPI(this.instance.post(url, data, config));

  put = async (url: string, data?: unknown, config?: AxiosRequestConfig) =>
    await fetchAPI(this.instance.put(url, data, config));

  delete = async (url: string, config?: AxiosRequestConfig) =>
    await fetchAPI(this.instance.delete(url, config));
}

export const baseService = new BaseService(instance);
