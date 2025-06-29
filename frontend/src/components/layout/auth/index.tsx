import { MAP_ROLE_TO_PATH } from "@/components/routers/constants";
import { RootState } from "@/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

export default function AuthLayout() {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(MAP_ROLE_TO_PATH[user.role]);
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/80 relative overflow-hidden">
      {/* Main content */}
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
