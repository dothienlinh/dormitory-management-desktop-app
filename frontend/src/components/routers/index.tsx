import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import NotFound from "@/components/layout/not-found";
import { lazy, Suspense } from "react";
import { MAP_ROLE_TO_PATH } from "./constants";
import Register from "../pages/auth/Register";
import { Icons } from "../ui/icons";
import { useCheckAuth } from "@/hooks/useCheckAuth";

const AuthLayout = lazy(() => import("@/components/layout/auth"));
const Login = lazy(() => import("@/components/pages/auth/Login"));
const ForgotPassword = lazy(
  () => import("@/components/pages/auth/ForgotPassword")
);
const ResetPassword = lazy(
  () => import("@/components/pages/auth/ResetPassword")
);

const DashboardLayout = lazy(() => import("@/components/layout/admin"));
const Dashboard = lazy(() => import("@/components/pages/staff/Dashboard"));
const Rooms = lazy(() => import("@/components/pages/staff/rooms/Rooms"));
const RoomDetails = lazy(
  () => import("@/components/pages/staff/rooms/RoomDetails")
);
const AddRoom = lazy(() => import("@/components/pages/staff/rooms/AddRoom"));
const EditRoom = lazy(() => import("@/components/pages/staff/rooms/EditRoom"));
const Students = lazy(
  () => import("@/components/pages/staff/students/Students")
);
const StudentDetails = lazy(
  () => import("@/components/pages/staff/students/StudentDetails")
);
const Contracts = lazy(
  () => import("@/components/pages/staff/contracts/Contracts")
);
const AddContracts = lazy(
  () => import("@/components/pages/staff/contracts/AddContracts")
);
const ContractDetails = lazy(
  () => import("@/components/pages/staff/contracts/ContractDetails")
);
const Finance = lazy(() => import("@/components/pages/admin/finance/Finance"));
const Invoices = lazy(
  () => import("@/components/pages/admin/finance/Invoices")
);
const Services = lazy(
  () => import("@/components/pages/staff/services/Services")
);
const ServiceDetails = lazy(
  () => import("@/components/pages/staff/services/ServiceDetails")
);
const ServiceRequestDetails = lazy(
  () => import("@/components/pages/staff/services/ServiceRequestDetails")
);
const Security = lazy(
  () => import("@/components/pages/staff/security/Security")
);
const Amenities = lazy(
  () => import("@/components/pages/staff/amenities/Amenities")
);
// const AmenityDetails = lazy(
//   () => import("@/components/pages/admin/amenities/components/AmenityDetails")
// );

const Users = lazy(() => import("@/components/pages/admin/users/Users"));
const UserDetail = lazy(
  () => import("@/components/pages/admin/users/UserDetail")
);

// Wrap all routes with this component that handles auth
function ProtectedRoutes() {
  const { isLoading, user, isAuthenticated } = useCheckAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Icons.spinner className="h-20 w-20 animate-spin" />
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <Icons.spinner className="h-20 w-20 animate-spin" />
        </div>
      }
    >
      <Routes>
        <Route
          index
          element={
            <Navigate
              to={
                isAuthenticated && user
                  ? MAP_ROLE_TO_PATH[user.role]
                  : "/auth/login"
              }
              replace
            />
          }
        />

        <Route path="auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="register" element={<Register />} />
        </Route>

        <Route path="admin" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />

          <Route path="finance" element={<Finance />} />
          <Route path="finance/invoices" element={<Invoices />} />

          <Route path="users" element={<Users />} />
          <Route path="users/:id" element={<UserDetail />} />
        </Route>

        <Route path="staff" element={<DashboardLayout />}>
          <Route path="rooms" element={<Rooms />} />
          <Route path="rooms/add" element={<AddRoom />} />
          <Route path="rooms/edit/:id" element={<EditRoom />} />
          <Route path="rooms/:id" element={<RoomDetails />} />

          <Route path="students" element={<Students />} />
          <Route path="students/:id" element={<StudentDetails />} />

          <Route path="contracts" element={<Contracts />} />
          <Route path="contracts/:id" element={<ContractDetails />} />
          <Route path="contracts/add" element={<AddContracts />} />

          <Route path="services" element={<Services />} />
          <Route path="services/:id" element={<ServiceDetails />} />
          <Route
            path="services/requests/:requestId?"
            element={<ServiceRequestDetails />}
          />
          <Route path="security" element={<Security />} />

          <Route path="amenities" element={<Amenities />} />
          {/* <Route path="amenities/:id" element={<AmenityDetails />} /> */}
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default function CustomRoutes() {
  return (
    <BrowserRouter>
      <ProtectedRoutes />
    </BrowserRouter>
  );
}
