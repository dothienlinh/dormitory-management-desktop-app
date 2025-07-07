import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";

import { Ban, Check, Filter, MoreHorizontal, Search, X } from "lucide-react";
import { User as IUser } from "@/interfaces/user";
import { UserRole, UserStatusAccount } from "@/enums/user";
import {
  getGenderTextUser,
  getStatusAccountColorUser,
  getStatusAccountTextUser,
} from "@/utils/getText";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { client } from "wailsjs/go/models";

interface TabsContentStudentProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  listStaff: client.Response | undefined;
  totalPage: number;
  staffStatus: "error" | "success" | "pending";
  currentPage: string;
  statusAccountFilter: string;
  setStatusAccountFilter: React.Dispatch<React.SetStateAction<string>>;
  handleResetPage: () => void;
  handleStatusChange: (user: IUser, status: string) => void;
  handleShowUserDetail: (user: IUser) => void;
}

export default function TabsContentStaff({
  searchTerm,
  setSearchTerm,
  listStaff,
  totalPage,
  staffStatus,
  currentPage,
  handleResetPage,
  setStatusAccountFilter,
  statusAccountFilter,
  handleStatusChange,
  handleShowUserDetail,
}: TabsContentStudentProps) {
  return (
    <TabsContent value={UserRole.STAFF} className="space-y-4">
      <Card>
        <CardContent>
          <div className="mb-4 flex flex-col space-y-3 md:flex-row md:items-center md:space-x-4 md:space-y-0">
            <div className="flex w-full items-center space-x-2 md:w-1/3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên, email, SĐT..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="flex items-center space-x-4">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={statusAccountFilter}
                onValueChange={(value) => {
                  setStatusAccountFilter(value);
                  handleResetPage();
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Trạng thái tài khoản" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value={UserStatusAccount.APPROVED}>
                    Đã duyệt
                  </SelectItem>
                  <SelectItem value={UserStatusAccount.PENDING}>
                    Đang chờ duyệt
                  </SelectItem>
                  <SelectItem value={UserStatusAccount.REJECTED}>
                    Đã từ chối
                  </SelectItem>
                  <SelectItem value={UserStatusAccount.BANNED}>
                    Đã bị cấm
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border relative">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã NV</TableHead>
                  <TableHead>Họ tên</TableHead>
                  <TableHead>Giới tính</TableHead>
                  <TableHead>Liên hệ</TableHead>
                  <TableHead>Chức vụ</TableHead>
                  <TableHead>Trạng thái tài khoản</TableHead>
                  <TableHead>Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staffStatus === "pending" ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Đang tải dữ liệu...
                    </TableCell>
                  </TableRow>
                ) : listStaff?.ParsedBody.data &&
                  listStaff?.ParsedBody.data.length > 0 ? (
                  listStaff.ParsedBody.data.map((staff: IUser) => (
                    <TableRow key={staff.id}>
                      <TableCell className="font-medium">
                        {staff.student_code || staff.id}
                      </TableCell>
                      <TableCell>{staff.full_name}</TableCell>
                      <TableCell>{getGenderTextUser(staff.gender)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-xs">{staff.email}</span>
                          <span className="text-xs">{staff.phone}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="capitalize">{staff.role}</span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusAccountColorUser(
                            staff.status_account
                          )}`}
                        >
                          {getStatusAccountTextUser(staff.status_account)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="link"
                            size="sm"
                            onClick={() => handleShowUserDetail(staff)}
                          >
                            Chi tiết
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Mở menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {staff.status_account !==
                                UserStatusAccount.APPROVED && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusChange(
                                      staff,
                                      UserStatusAccount.APPROVED
                                    )
                                  }
                                  className="text-red-600"
                                >
                                  <Check className="mr-2 h-4 w-4" />
                                  Duyệt tài khoản
                                </DropdownMenuItem>
                              )}
                              {staff.status_account !==
                                UserStatusAccount.REJECTED && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusChange(
                                      staff,
                                      UserStatusAccount.REJECTED
                                    )
                                  }
                                  className="text-yellow-600"
                                >
                                  <X className="mr-2 h-4 w-4" />
                                  Từ chối tài khoản
                                </DropdownMenuItem>
                              )}
                              {staff.status_account !==
                                UserStatusAccount.BANNED && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusChange(
                                      staff,
                                      UserStatusAccount.BANNED
                                    )
                                  }
                                  className="text-red-600"
                                >
                                  <Ban className="mr-2 h-4 w-4" />
                                  Cấm tài khoản
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Không tìm thấy nhân viên nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4">
            {totalPage > 1 && staffStatus !== "pending" && (
              <PaginationWithLinks
                page={parseInt(currentPage)}
                totalCount={listStaff?.ParsedBody?.total ?? 0}
                pageSearchParam="page"
              />
            )}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
