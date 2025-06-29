import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "@/hooks/useTheme";
import {
  AlertCircle,
  Bell,
  Building,
  ChevronDown,
  ClipboardList,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Receipt,
  Settings,
  Sun,
  SunMoon,
  User,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/authSlice";
import { removeCookie } from "@/utils/cookie";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { RootState } from "@/store";
import { authService } from "@/services/apis/auth";

const navigation = [
  {
    name: "Trang chủ",
    href: "/student",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    name: "Thông tin cá nhân",
    href: "/student/profile",
    icon: <User className="h-5 w-5" />,
  },
  {
    name: "Phòng ở",
    href: "/student/room",
    icon: <Building className="h-5 w-5" />,
  },
  {
    name: "Hợp đồng",
    href: "/student/contract",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    name: "Thanh toán",
    href: "/student/payment",
    icon: <Wallet className="h-5 w-5" />,
    badge: "1",
  },
  {
    name: "Báo cáo sự cố",
    href: "/student/issues",
    icon: <AlertCircle className="h-5 w-5" />,
  },
];

interface SidebarItemProps {
  item: {
    name: string;
    href: string;
    icon: React.ReactNode;
    badge?: string;
  };
  isActive: boolean;
  onClick?: () => void;
}

function SidebarItem({ item, isActive, onClick }: SidebarItemProps) {
  return (
    <li>
      <Link
        to={item.href}
        className={cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary/80 transition-colors",
          isActive ? "bg-secondary text-primary" : "text-muted-foreground"
        )}
        onClick={onClick}
      >
        <span className="flex h-5 w-5 items-center justify-center">
          {item.icon}
        </span>
        <span className="flex-1">{item.name}</span>
        {item.badge && (
          <Badge className="h-5 w-5 p-0 flex items-center justify-center">
            {item.badge}
          </Badge>
        )}
      </Link>
    </li>
  );
}

export default function StudentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const { mutateAsync } = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      dispatch(logout());
      removeCookie("accessToken");
      removeCookie("refreshToken");
      navigate("/auth/login");
    },
  });

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="relative flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="px-4 flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="mr-4 md:hidden"
                  aria-label="Toggle Menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 pt-10">
                <div className="px-7">
                  <Link
                    to="/student"
                    className="flex items-center gap-2 font-semibold text-lg"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Home className="h-5 w-5" />
                    <span>KTX Manager</span>
                  </Link>
                </div>
                <ScrollArea className="h-[calc(100vh-8rem)] px-7 pb-6 pt-6">
                  <nav>
                    <ul className="space-y-2">
                      {navigation.map((item) => (
                        <SidebarItem
                          key={item.href}
                          item={item}
                          isActive={location.pathname === item.href}
                          onClick={() => setSidebarOpen(false)}
                        />
                      ))}
                    </ul>
                  </nav>
                </ScrollArea>
              </SheetContent>
            </Sheet>

            <Link
              to="/student"
              className="hidden items-center gap-2 font-semibold text-lg md:flex"
            >
              <Home className="h-5 w-5" />
              <span>KTX Manager</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center">
                2
              </Badge>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  {theme === "light" ? (
                    <Sun className="h-5 w-5" />
                  ) : theme === "dark" ? (
                    <Moon className="h-5 w-5" />
                  ) : (
                    <SunMoon className="h-5 w-5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <Sun className="mr-2 h-4 w-4" />
                  <span>Sáng</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <Moon className="mr-2 h-4 w-4" />
                  <span>Tối</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  <SunMoon className="mr-2 h-4 w-4" />
                  <span>Hệ thống</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={user?.avatar || ""}
                      alt={user?.full_name || "User"}
                    />
                    <AvatarFallback>
                      {getInitials(user?.full_name || "User")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline-flex">
                    {user?.full_name || "User"}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/student/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Thông tin cá nhân</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/student/room">
                    <Building className="mr-2 h-4 w-4" />
                    <span>Phòng ở</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/student/contract">
                    <ClipboardList className="mr-2 h-4 w-4" />
                    <span>Hợp đồng</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/student/payment">
                    <Receipt className="mr-2 h-4 w-4" />
                    <span>Thanh toán</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Cài đặt</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    toast.promise(mutateAsync(), {
                      loading: "Đang đăng xuất...",
                      success: "Đăng xuất thành công!",
                      error: (err) => {
                        const errorMessage =
                          err?.message || "Đăng xuất thất bại";
                        return errorMessage;
                      },
                    });
                  }}
                  className="text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="hidden fixed top-16 left-0 w-64 shrink-0 border-r bg-background h-[calc(100vh-4rem)] md:block z-30">
          <ScrollArea className="h-full px-4 py-6">
            <nav>
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <SidebarItem
                    key={item.href}
                    item={item}
                    isActive={location.pathname === item.href}
                  />
                ))}
              </ul>
            </nav>
          </ScrollArea>
        </aside>

        <main className="flex-1 p-4 md:p-6 md:ml-64">
          <div className="container mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
