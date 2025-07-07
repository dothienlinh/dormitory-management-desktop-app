import {
  MAP_ROLE_TO_PATH,
  PUBLIC_ROUTES,
} from "@/components/routers/constants";
import { UserRole } from "@/enums/user";
import { User } from "@/interfaces/user";
import { setUser } from "@/store/authSlice";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { GetMe } from "wailsjs/go/app/App";

export function useCheckAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const {
    data: currentUser,
    isError,
    isFetching: isLoading,
  } = useQuery({
    queryKey: ["me"],
    queryFn: () => GetMe(),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isLoading) return;

    if (isError) {
      if (PUBLIC_ROUTES.includes(pathname)) {
        return;
      }
      navigate("/auth/login");
      return;
    }

    if (currentUser?.ParsedBody?.data) {
      if (currentUser && currentUser.ParsedBody?.data) {
        dispatch(setUser(currentUser.ParsedBody?.data));
        if (PUBLIC_ROUTES.includes(pathname)) {
          navigate(
            MAP_ROLE_TO_PATH[currentUser.ParsedBody?.data?.role as UserRole]
          );
        } else if (
          currentUser.ParsedBody?.data.role === UserRole.ADMIN &&
          !pathname.startsWith("/admin")
        ) {
          navigate("/admin");
          return;
        } else if (
          currentUser.ParsedBody?.data.role === UserRole.STAFF &&
          !pathname.startsWith("/staff")
        ) {
          navigate("/staff");
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
  }, [currentUser, isLoading, isError]);

  return {
    isLoading: isLoading,
    user: currentUser?.ParsedBody?.data as User,
    isAuthenticated: !!currentUser?.ParsedBody?.data,
  };
}
