import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search, Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { User as IUser, UserQueryParams } from "@/interfaces/user";
import { Gender, UserStatus } from "@/enums/user";
import { getGenderTextUser, getStatusTextUser } from "@/utils/getText";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import { useDebounce } from "use-debounce";
import { GetListUsers } from "wailsjs/go/app/App";

export default function Students() {
  const [searchTerm, setSearchTerm] = useState<string>();
  const [searchTermDebounced] = useDebounce(searchTerm, 1000);
  const [statusFilter, setStatusFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");

  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = searchParams.get("page") || 1;

  const { data: listStudent, status } = useQuery({
    queryKey: [
      "users",
      {
        page: currentPage,
        keyword: searchTermDebounced,
        status: statusFilter !== "all" ? statusFilter : undefined,
        gender: genderFilter !== "all" ? genderFilter : undefined,
      } as UserQueryParams,
    ],
    queryFn: (query) => {
      const [, params] = query.queryKey as [string, UserQueryParams];
      return GetListUsers(
        params.page || 1,
        params.keyword,
        params.order,
        params.status,
        params.gender
      );
    },
  });
  const totalPage = listStudent?.ParsedBody.total
    ? Math.ceil(listStudent.ParsedBody.total / 10)
    : 0;

  const handleResetPage = () => {
    setSearchParams((searchParams) => {
      searchParams.set("page", "1");
      return searchParams;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Quản lý sinh viên
          </h2>
          <p className="text-muted-foreground">
            Quản lý thông tin tất cả sinh viên trong ký túc xá
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách sinh viên</CardTitle>
          <CardDescription>
            Tổng số {listStudent?.ParsedBody.data.length} sinh viên,{" "}
            {
              listStudent?.ParsedBody.data.filter(
                (s: { status: UserStatus }) => s.status === UserStatus.Active
              ).length
            }{" "}
            đang ở,{" "}
            {
              listStudent?.ParsedBody.data.filter(
                (s: { status: UserStatus }) => s.status === UserStatus.Inactive
              ).length
            }{" "}
            tạm vắng,{" "}
            {
              listStudent?.ParsedBody.data.filter(
                (s: { status: UserStatus }) => s.status === UserStatus.Absent
              ).length
            }{" "}
            đã rời đi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col space-y-3 md:flex-row md:items-center md:space-x-4 md:space-y-0">
            <div className="flex w-full items-center space-x-2 md:w-1/3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên, MSSV, email, SĐT..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="flex items-center space-x-4">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value);
                  handleResetPage();
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value={UserStatus.Active}>Đang ở</SelectItem>
                  <SelectItem value={UserStatus.Inactive}>Tạm vắng</SelectItem>
                  <SelectItem value={UserStatus.Absent}>Đã rời đi</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={genderFilter}
                onValueChange={(value) => {
                  setGenderFilter(value);
                  handleResetPage();
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Giới tính" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value={Gender.Male}>Nam</SelectItem>
                  <SelectItem value={Gender.Female}>Nữ</SelectItem>
                  <SelectItem value={Gender.Other}>Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border relative">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>MSSV</TableHead>
                  <TableHead>Họ tên</TableHead>
                  <TableHead>Giới tính</TableHead>
                  <TableHead>Liên hệ</TableHead>
                  <TableHead>Phòng</TableHead>
                  <TableHead>Hợp đồng</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {status === "pending" ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      Đang tải dữ liệu...
                    </TableCell>
                  </TableRow>
                ) : listStudent?.ParsedBody.data &&
                  listStudent?.ParsedBody.data.length > 0 ? (
                  listStudent.ParsedBody.data.map((student: IUser) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        {student.student_code}
                      </TableCell>
                      <TableCell>{student.full_name}</TableCell>
                      <TableCell>{getGenderTextUser(student.gender)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-xs">{student.email}</span>
                          <span className="text-xs">{student.phone}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link
                          to={`/staff/rooms/${student.room?.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          {student.room?.room_number}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-xs">
                            Từ: {new Date().toLocaleDateString("vi-VN")}
                          </span>
                          <span className="text-xs">
                            Đến: {new Date().toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                            student.status === "active"
                              ? "bg-green-100 text-green-800"
                              : student.status === "inactive"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {getStatusTextUser(student.status)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Link to={`/staff/students/${student.id}`}>
                          <Button variant="link" size="sm">
                            Chi tiết
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      Không tìm thấy kết quả nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4">
            {totalPage > 1 && status !== "pending" && (
              <PaginationWithLinks
                page={+currentPage}
                totalCount={listStudent?.ParsedBody.total ?? 0}
                pageSearchParam="page"
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
