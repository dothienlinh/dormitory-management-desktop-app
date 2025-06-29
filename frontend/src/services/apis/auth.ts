import { baseService } from "../baseService";

interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  phone: string;
  password: string;
  full_name: string;
}

class AuthService {
  private readonly basePath = "/auth";

  login = async (data: LoginData) =>
    await baseService.post(`${this.basePath}/login`, data);

  register = async (data: RegisterData) =>
    await baseService.post(`${this.basePath}/register`, data);

  logout = async () => await baseService.post(`${this.basePath}/logout`, {});

  refreshToken = async (refreshToken: string) =>
    await baseService.post(`${this.basePath}/refresh-token`, {
      refresh_token: refreshToken,
    });

  getMe = async () => await baseService.get(`${this.basePath}/me`);
}

export const authService = new AuthService();
