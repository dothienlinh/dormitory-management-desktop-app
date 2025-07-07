import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User as IUser } from "@/interfaces/user";
import { UserRole, UserStatus, UserStatusAccount } from "@/enums/user";
import {
  getGenderTextUser,
  getStatusAccountTextUser,
  getStatusTextUser,
} from "@/utils/getText";
import { useDebounce } from "use-debounce";
import { GetListUsers, UpdateUserStatus } from "wailsjs/go/app/App";
import { toast } from "sonner";
import TabsContentStudent from "./components/TabsContentStudent";
import TabsContentStaff from "./components/TabsContentStaff";

export default function Users() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchTermDebounced] = useDebounce(searchTerm, 1000);
  const [statusAccountFilter, setStatusAccountFilter] = useState("all");
  const [activeTab, setActiveTab] = useState<UserRole>(UserRole.STUDENT);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");

  // State cho user detail modal
  const [isUserDetailOpen, setIsUserDetailOpen] = useState(false);
  const [userDetailData, setUserDetailData] = useState<IUser | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = searchParams.get("page") || "1";

  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: async ({
      userId,
      status,
    }: {
      userId: string;
      status: string;
    }) => UpdateUserStatus(userId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast.success("Cập nhật trạng thái thành công!");
      setIsDialogOpen(false);
    },
    onError: () => {
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái!");
    },
  });

  const handleStatusChange = (user: IUser, status: string) => {
    setSelectedUser(user);
    setNewStatus(status);
    setIsDialogOpen(true);
  };

  const confirmStatusChange = () => {
    if (selectedUser) {
      console.log("Updating status for user:", selectedUser);
      updateStatusMutation.mutate({
        userId: String(selectedUser.id),
        status: newStatus,
      });
    }
  };

  const getStatusActionText = (status: string) => {
    switch (status) {
      case UserStatusAccount.APPROVED:
        return "duyệt";
      case UserStatusAccount.REJECTED:
        return "từ chối";
      case UserStatusAccount.BANNED:
        return "cấm";
      default:
        return "cập nhật";
    }
  };

  // Hàm mở modal chi tiết user
  const handleShowUserDetail = (user: IUser) => {
    setUserDetailData(user);
    setIsUserDetailOpen(true);
  };

  const { data: listStudents, status: studentsStatus } = useQuery({
    queryKey: [
      "students",
      currentPage,
      searchTermDebounced,
      statusAccountFilter,
    ],
    queryFn: () => {
      return GetListUsers(
        currentPage,
        searchTermDebounced || "",
        "",
        "",
        "",
        statusAccountFilter !== "all" ? statusAccountFilter : "",
        UserRole.STUDENT
      );
    },
    enabled: activeTab === UserRole.STUDENT,
  });

  const { data: listStaff, status: staffStatus } = useQuery({
    queryKey: ["staff", currentPage, searchTermDebounced, statusAccountFilter],
    queryFn: () => {
      return GetListUsers(
        currentPage,
        searchTermDebounced || "",
        "",
        "",
        "",
        statusAccountFilter !== "all" ? statusAccountFilter : "",
        UserRole.STAFF
      );
    },
    enabled: activeTab === UserRole.STAFF,
  });

  const currentData = activeTab === UserRole.STUDENT ? listStudents : listStaff;

  const totalPage = currentData?.ParsedBody?.total
    ? Math.ceil(currentData.ParsedBody.total / 10)
    : 0;

  const handleResetPage = () => {
    setSearchParams((searchParams) => {
      searchParams.set("page", "1");
      return searchParams;
    });
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as UserRole);
    setSearchTerm("");
    setStatusAccountFilter("all");
    handleResetPage();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Quản lý tài khoản
          </h2>
          <p className="text-muted-foreground">
            Quản lý thông tin sinh viên và nhân viên trong hệ thống
          </p>
        </div>
      </div>

      <Tabs defaultValue={UserRole.STUDENT} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            value={UserRole.STUDENT}
            className="flex items-center gap-2"
          >
            Sinh viên
            {listStudents?.ParsedBody?.total && (
              <Badge variant="secondary" className="ml-1">
                {listStudents.ParsedBody.total}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value={UserRole.STAFF}
            className="flex items-center gap-2"
          >
            Nhân viên
            {listStaff?.ParsedBody?.total && (
              <Badge variant="secondary" className="ml-1">
                {listStaff.ParsedBody.total}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContentStudent
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          listStudents={listStudents}
          totalPage={totalPage}
          studentsStatus={studentsStatus}
          currentPage={currentPage}
          handleShowUserDetail={handleShowUserDetail}
        />

        <TabsContentStaff
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          listStaff={listStaff}
          totalPage={totalPage}
          staffStatus={staffStatus}
          currentPage={currentPage}
          handleResetPage={handleResetPage}
          setStatusAccountFilter={setStatusAccountFilter}
          statusAccountFilter={statusAccountFilter}
          handleStatusChange={handleStatusChange}
          handleShowUserDetail={handleShowUserDetail}
        />
      </Tabs>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận cập nhật trạng thái</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn {getStatusActionText(newStatus)} tài khoản
              của <strong>{selectedUser?.full_name}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStatusChange}>
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isUserDetailOpen} onOpenChange={setIsUserDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết tài khoản</DialogTitle>
          </DialogHeader>
          {userDetailData && (
            <div className="space-y-6">
              {/* Thông tin cơ bản */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Họ và tên
                    </label>
                    <p className="text-base font-semibold">
                      {userDetailData.full_name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Email
                    </label>
                    <p className="text-base">{userDetailData.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Số điện thoại
                    </label>
                    <p className="text-base">{userDetailData.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Giới tính
                    </label>
                    <p className="text-base">
                      {getGenderTextUser(userDetailData.gender)}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Vai trò
                    </label>
                    <Badge variant="outline" className="ml-2 capitalize">
                      {userDetailData.role}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Trạng thái tài khoản
                    </label>
                    <div className="mt-1">
                      <Badge
                        variant={
                          userDetailData.status_account ===
                          UserStatusAccount.APPROVED
                            ? "default"
                            : userDetailData.status_account ===
                              UserStatusAccount.PENDING
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {getStatusAccountTextUser(
                          userDetailData.status_account
                        )}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Trạng thái hoạt động
                    </label>
                    <div className="mt-1">
                      <Badge
                        variant={
                          userDetailData.status === UserStatus.ACTIVE
                            ? "default"
                            : "secondary"
                        }
                      >
                        {getStatusTextUser(userDetailData.status)}
                      </Badge>
                    </div>
                  </div>
                  {userDetailData.student_code && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Mã sinh viên
                      </label>
                      <p className="text-base font-mono">
                        {userDetailData.student_code}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Thông tin phòng và hợp đồng (chỉ cho sinh viên) */}
              {userDetailData.role === UserRole.STUDENT && (
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-4">
                    Thông tin ở trọ
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Phòng hiện tại
                      </label>
                      <p className="text-base">
                        {userDetailData.room?.room_number ||
                          "Chưa được phân phòng"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Hợp đồng
                      </label>
                      <p className="text-base">
                        Thông tin hợp đồng không có sẵn
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Thông tin thời gian */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-4">
                  Thông tin hệ thống
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Ngày tạo tài khoản
                    </label>
                    <p className="text-base">
                      {new Date(userDetailData.created_at).toLocaleDateString(
                        "vi-VN"
                      )}{" "}
                      {new Date(userDetailData.created_at).toLocaleTimeString(
                        "vi-VN"
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Cập nhật lần cuối
                    </label>
                    <p className="text-base">
                      {new Date(userDetailData.updated_at).toLocaleDateString(
                        "vi-VN"
                      )}{" "}
                      {new Date(userDetailData.updated_at).toLocaleTimeString(
                        "vi-VN"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
