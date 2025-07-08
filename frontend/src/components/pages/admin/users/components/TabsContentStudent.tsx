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

import { Search } from "lucide-react";
import { User as IUser } from "@/interfaces/user";
import { UserRole, UserStatus } from "@/enums/user";
import { getGenderTextUser, getStatusTextUser } from "@/utils/getText";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import { client } from "wailsjs/go/models";

interface TabsContentStudentProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  listStudents: client.Response | undefined;
  totalPage: number;
  studentsStatus: "error" | "success" | "pending";
  currentPage: string;
  handleShowUserDetail: (user: IUser) => void;
}

export default function TabsContentStudent({
  searchTerm,
  setSearchTerm,
  listStudents,
  totalPage,
  studentsStatus,
  currentPage,
  handleShowUserDetail,
}: TabsContentStudentProps) {
  return (
    <TabsContent value={UserRole.STUDENT} className="space-y-4">
      <Card>
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
                  <TableHead>Trạng thái</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentsStatus === "pending" ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      Đang tải dữ liệu...
                    </TableCell>
                  </TableRow>
                ) : listStudents?.ParsedBody.data &&
                  listStudents?.ParsedBody.data.length > 0 ? (
                  listStudents.ParsedBody.data.map((student: IUser) => (
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
                        <span className="text-blue-600 hover:underline cursor-pointer">
                          {student.room?.room_number}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                            student.status === UserStatus.ACTIVE
                              ? "bg-green-100 text-green-800"
                              : student.status === UserStatus.INACTIVE
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {getStatusTextUser(student.status)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => handleShowUserDetail(student)}
                        >
                          Chi tiết
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      Không tìm thấy sinh viên nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4">
            {totalPage > 1 && studentsStatus !== "pending" && (
              <PaginationWithLinks
                page={parseInt(currentPage)}
                totalCount={listStudents?.ParsedBody?.total ?? 0}
                pageSearchParam="page"
              />
            )}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
