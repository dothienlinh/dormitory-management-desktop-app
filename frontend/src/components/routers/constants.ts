import { UserRole } from "@/enums";

export const MAP_ROLE_TO_PATH = {
  [UserRole.STUDENT]: "/student",
  [UserRole.ADMIN]: "/admin",
  [UserRole.STAFF]: "/admin",
};

export const PUBLIC_ROUTES = [
  "/auth/login",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/register",
];
