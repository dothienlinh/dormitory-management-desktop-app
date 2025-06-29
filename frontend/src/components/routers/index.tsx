import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import NotFound from "@/components/layout/not-found";
import { lazy, Suspense, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { MAP_ROLE_TO_PATH, PUBLIC_ROUTES } from "./constants";
import { useCheckAuth } from "@/hooks/useCheckAuth";
import Register from "../pages/auth/Register";
import { Icons } from "../ui/icons";

const StudentLayout = lazy(() => import("@/components/layout/student"));
const StudentDashboard = lazy(
  () => import("@/components/pages/student/StudentDashboard")
);
const StudentProfile = lazy(
  () => import("@/components/pages/student/StudentProfile")
);
const StudentRoom = lazy(
  () => import("@/components/pages/student/StudentRoom")
);
const StudentContract = lazy(
  () => import("@/components/pages/student/StudentContract")
);
const StudentPayment = lazy(
  () => import("@/components/pages/student/StudentPayment")
);
const StudentIssuesPage = lazy(
  () => import("@/components/pages/student/StudentIssuesPage")
);

const AuthLayout = lazy(() => import("@/components/layout/auth"));
const Login = lazy(() => import("@/components/pages/auth/Login"));
const ForgotPassword = lazy(
  () => import("@/components/pages/auth/ForgotPassword")
);
const ResetPassword = lazy(
  () => import("@/components/pages/auth/ResetPassword")
);

const DashboardLayout = lazy(() => import("@/components/layout/admin"));
const Dashboard = lazy(() => import("@/components/pages/admin/Dashboard"));
const Rooms = lazy(() => import("@/components/pages/admin/rooms/Rooms"));
const RoomDetails = lazy(
  () => import("@/components/pages/admin/rooms/RoomDetails")
);
const AddRoom = lazy(() => import("@/components/pages/admin/rooms/AddRoom"));
const EditRoom = lazy(() => import("@/components/pages/admin/rooms/EditRoom"));
const Students = lazy(
  () => import("@/components/pages/admin/students/Students")
);
const StudentDetails = lazy(
  () => import("@/components/pages/admin/students/StudentDetails")
);
const Contracts = lazy(
  () => import("@/components/pages/admin/contracts/Contracts")
);
const AddContracts = lazy(
  () => import("@/components/pages/admin/contracts/AddContracts")
);
const ContractDetails = lazy(
  () => import("@/components/pages/admin/contracts/ContractDetails")
);
const Finance = lazy(() => import("@/components/pages/admin/finance/Finance"));
const Invoices = lazy(
  () => import("@/components/pages/admin/finance/Invoices")
);
const Services = lazy(
  () => import("@/components/pages/admin/services/Services")
);
const ServiceDetails = lazy(
  () => import("@/components/pages/admin/services/ServiceDetails")
);
const ServiceRequestDetails = lazy(
  () => import("@/components/pages/admin/services/ServiceRequestDetails")
);
const Security = lazy(
  () => import("@/components/pages/admin/security/Security")
);
const Amenities = lazy(
  () => import("@/components/pages/admin/amenities/Amenities")
);
// const AmenityDetails = lazy(
//   () => import("@/components/pages/admin/amenities/components/AmenityDetails")
// );

// Wrap all routes with this component that handles auth
function ProtectedRoutes() {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const { isLoading } = useCheckAuth();
  const navigate = useNavigate();

  const handleRedirect = () => {
    if (user) {
      return MAP_ROLE_TO_PATH[user.role];
    }

    if (PUBLIC_ROUTES.includes(window.location.pathname)) {
      return window.location.pathname;
    }

    return "/auth/login";
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(handleRedirect());
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, handleRedirect]);

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
        <Route index element={<Navigate to={handleRedirect()} replace />} />

        <Route path="auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="register" element={<Register />} />
        </Route>

        <Route path="admin" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />

          <Route path="rooms" element={<Rooms />} />
          <Route path="rooms/add" element={<AddRoom />} />
          <Route path="rooms/edit/:id" element={<EditRoom />} />
          <Route path="rooms/:id" element={<RoomDetails />} />

          <Route path="students" element={<Students />} />
          <Route path="students/:id" element={<StudentDetails />} />

          <Route path="contracts" element={<Contracts />} />
          <Route path="contracts/:id" element={<ContractDetails />} />
          <Route path="contracts/add" element={<AddContracts />} />

          <Route path="finance" element={<Finance />} />
          <Route path="finance/invoices" element={<Invoices />} />

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

        <Route path="student" element={<StudentLayout />}>
          <Route index element={<StudentDashboard />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="room" element={<StudentRoom />} />
          <Route path="contract" element={<StudentContract />} />
          <Route path="payment" element={<StudentPayment />} />
          <Route path="issues" element={<StudentIssuesPage />} />
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
