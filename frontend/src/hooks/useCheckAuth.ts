import {
  MAP_ROLE_TO_PATH,
  PUBLIC_ROUTES,
} from "@/components/routers/constants";
import { UserRole } from "@/enums";
import { IResponse } from "@/interfaces/service";
import { User } from "@/interfaces/user";
import { authService } from "@/services/apis/auth";
import { setUser } from "@/store/authSlice";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

export function useCheckAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { data: currentUser, status } = useQuery<IResponse<User>>({
    queryKey: ["me"],
    queryFn: () => authService.getMe(),
  });

  useEffect(() => {
    if (status === "pending") return;

    if (status === "error") {
      if (PUBLIC_ROUTES.includes(pathname)) {
        return;
      }
      navigate("/auth/login");
      return;
    }

    if (status === "success") {
      if (currentUser && currentUser.data) {
        dispatch(setUser(currentUser.data));
        if (PUBLIC_ROUTES.includes(pathname)) {
          navigate(MAP_ROLE_TO_PATH[currentUser.data?.role]);
        } else if (
          currentUser.data.role === UserRole.ADMIN &&
          !pathname.startsWith("/admin")
        ) {
          navigate("/admin");
          return;
        } else if (
          currentUser.data.role === UserRole.STUDENT &&
          !pathname.startsWith("/student")
        ) {
          navigate("/student");
          return;
        }
      } else {
        if (PUBLIC_ROUTES.includes(pathname)) {
          return;
        }
        navigate("/auth/login");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, currentUser]);

  return { isLoading: status === "pending" };
}
