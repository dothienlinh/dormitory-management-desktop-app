import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, User, Bell, MoonStar, Sun, Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Sidebar from "./sidebar/Sidebar";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { logout } from "@/store/authSlice";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Logout } from "wailsjs/go/app/App";

export default function DashboardLayout() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mutateAsync } = useMutation({
    mutationFn: () => Logout(),
    onSuccess: () => {
      dispatch(logout());
      navigate("/auth/login");
    },
  });

  // Kiểm tra theme từ localStorage hoặc system preference
  useEffect(() => {
    // Kiểm tra localStorage
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDarkMode(false);
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };

  const handleLogout = () => {
    toast.promise(mutateAsync(), {
      loading: "Đang đăng xuất...",
      success: "Đăng xuất thành công!",
      error: (err) => {
        const errorMessage = err?.message || "Đăng xuất thất bại";
        return errorMessage;
      },
    });
  };

  const handleLogin = () => {
    navigate("/auth/login");
  };

  // Lấy tên viết tắt từ tên đầy đủ cho avatar fallback
  const getInitials = (name: string = "") => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="flex min-h-screen bg-background dark:bg-zinc-900 transition-colors duration-300">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 ml-64 transition-all duration-300 ease-in-out">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/70 backdrop-blur-md px-4 dark:bg-zinc-900/80 dark:border-zinc-800 transition-colors duration-300">
          <div className="flex items-center gap-4">
            <div className="relative hidden md:flex items-center max-w-xs">
              <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tìm kiếm..."
                className="pl-8 w-[250px] bg-background border-muted focus-visible:ring-primary/20 dark:bg-zinc-800/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hover:bg-primary/10 dark:hover:bg-primary/20"
              aria-label={
                isDarkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {isDarkMode ? <Sun size={18} /> : <MoonStar size={18} />}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-primary/10 dark:hover:bg-primary/20"
                >
                  <Bell size={18} />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                    3
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Thông báo</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[300px] overflow-y-auto">
                  <div className="flex items-start gap-2 p-2 hover:bg-muted rounded-md cursor-pointer">
                    <div className="h-2 w-2 mt-2 rounded-full bg-primary"></div>
                    <div>
                      <p className="text-sm font-medium">
                        Có 3 sinh viên mới đăng ký
                      </p>
                      <p className="text-xs text-muted-foreground">
                        5 phút trước
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-2 hover:bg-muted rounded-md cursor-pointer">
                    <div className="h-2 w-2 mt-2 rounded-full bg-primary"></div>
                    <div>
                      <p className="text-sm font-medium">
                        Hợp đồng #HD123 sắp hết hạn
                      </p>
                      <p className="text-xs text-muted-foreground">
                        1 giờ trước
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-2 hover:bg-muted rounded-md cursor-pointer">
                    <div className="h-2 w-2 mt-2 rounded-full bg-primary"></div>
                    <div>
                      <p className="text-sm font-medium">
                        Báo cáo tháng đã sẵn sàng
                      </p>
                      <p className="text-xs text-muted-foreground">
                        1 ngày trước
                      </p>
                    </div>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-center"
                >
                  Xem tất cả
                </Button>
              </DropdownMenuContent>
            </DropdownMenu>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 px-2 hover:bg-primary/10 dark:hover:bg-primary/20"
                  >
                    <Avatar className="h-8 w-8 border border-primary/10">
                      <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                        {getInitials(user?.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium line-clamp-1">
                        {user?.full_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user?.role}
                      </p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Thông tin cá nhân</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell className="mr-2 h-4 w-4" />
                    <span>Thông báo</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-500 focus:text-red-500"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="outline"
                onClick={handleLogin}
                className="ml-auto"
              >
                Đăng nhập
              </Button>
            )}
          </div>
        </header>

        {/* Page Content */}
        <div className="container mx-auto px-4 py-6 max-w-7xl transition-all ease-in-out duration-300">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
