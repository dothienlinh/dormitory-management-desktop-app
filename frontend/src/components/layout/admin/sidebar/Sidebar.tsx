import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  DoorOpen,
  Users,
  FileText,
  Receipt,
  Wrench,
  Shield,
  Home,
  Sofa,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { UserRole } from "@/enums/user";

const sidebarStaffItems = [
  {
    icon: DoorOpen,
    label: "Quản lý phòng",
    description: "Quản lý thông tin phòng",
    path: "/admin/rooms",
    regex: /^\/admin\/rooms(\/.*)?$/,
  },
  {
    icon: Users,
    label: "Quản lý sinh viên",
    description: "Quản lý thông tin sinh viên",
    path: "/admin/students",
    regex: /^\/admin\/students(\/.*)?$/,
  },
  {
    icon: FileText,
    label: "Quản lý hợp đồng",
    description: "Quản lý thông tin hợp đồng",
    path: "/admin/contracts",
    regex: /^\/admin\/contracts(\/.*)?$/,
  },

  {
    icon: Wrench,
    label: "Quản lý dịch vụ",
    description: "Quản lý dịch vụ KTX",
    path: "/admin/services",
    regex: /^\/admin\/services(\/.*)?$/,
  },
  {
    icon: Sofa,
    label: "Quản lý tiện nghi",
    description: "Quản lý tiện nghi KTX",
    path: "/admin/amenities",
    regex: /^\/admin\/amenities(\/.*)?$/,
  },
  {
    icon: Shield,
    label: "Quản lý an ninh",
    description: "Quản lý an ninh KTX",
    path: "/admin/security",
    regex: /^\/admin\/security(\/.*)?$/,
  },
];

const sidebarAdminItems = [
  {
    icon: LayoutDashboard,
    label: "Tổng quan",
    description: "Thông tin tổng quan",
    path: "/admin",
    regex: /^\/admin\/?$/,
  },
  {
    icon: Users,
    label: "Quản lý tài khoản",
    description: "Quản lý tài khoản người dùng",
    path: "/admin/users",
    regex: /^\/admin\/users(\/.*)?$/,
  },
  {
    icon: Receipt,
    label: "Quản lý tài chính",
    description: "Quản lý thu chi tài chính",
    path: "/admin/finance",
    regex: /^\/admin\/finance(\/.*)?$/,
  },
];

export default function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const user = useSelector((state: RootState) => state.auth.user);

  const sidebarItems =
    user?.role === UserRole.ADMIN ? sidebarAdminItems : sidebarStaffItems;

  // Kiểm tra xem path hiện tại có match với sidebar item không
  const isActiveLink = (regex: RegExp) => {
    return regex.test(currentPath);
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-full w-64 transform bg-card shadow-lg transition-all duration-300 ease-in-out dark:bg-zinc-900 dark:border-r dark:border-zinc-800">
      <div className="flex h-16 items-center border-b px-4 dark:border-zinc-800">
        <div className="flex items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary shadow-sm">
            <Home className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="ml-3 text-xl font-bold whitespace-nowrap">
            KTX Manager
          </h1>
        </div>
      </div>

      <div
        className="py-4 px-3 custom-scrollbar overflow-y-auto"
        style={{ height: "calc(100vh - 4rem)" }}
      >
        <nav className="space-y-1">
          {sidebarItems.map((item, index) => {
            const isActive = isActiveLink(item.regex);

            return (
              <Link
                key={index}
                to={item.path}
                className={cn(
                  "group flex items-center rounded-md py-2 px-3 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary dark:bg-primary/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <div
                  className={cn(
                    "flex h-6 w-6 items-center justify-center",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                </div>

                <span className="ml-3">{item.label}</span>

                {isActive && (
                  <div className="absolute left-0 h-8 w-1 rounded-r-full bg-primary"></div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
