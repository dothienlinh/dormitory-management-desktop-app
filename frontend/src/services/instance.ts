import { PUBLIC_ROUTES } from "@/components/routers/constants";
import { store } from "@/store";
import { logout } from "@/store/authSlice";
import { removeCookie, getCookie, setCookie } from "@/utils/cookie";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

const instance = axios.create({
  baseURL,
});

instance.interceptors.request.use(
  (config) => {
    const accessToken = getCookie("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401) {
      const refreshToken = getCookie("refreshToken");
      if (refreshToken) {
        const response = await axios.post(`${baseURL}/auth/refresh-token`, {
          refresh_token: refreshToken,
        });
        if (response.status === 200) {
          setCookie("accessToken", response.data.data.access_token, 1);
          return instance(error.config);
        }
      }

      removeCookie("accessToken");
      removeCookie("refreshToken");
      if (!PUBLIC_ROUTES.includes(window.location.pathname)) {
        store.dispatch(logout());
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
