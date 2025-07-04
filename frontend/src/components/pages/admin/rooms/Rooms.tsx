import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle, Search, Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Icons } from "@/components/ui/icons";
import { RoomStatus } from "@/enums/rooms";
import { GetListRooms } from "wailsjs/go/app/App";

const getStatusText = (status: string) => {
  switch (status) {
    case "occupied":
      return "Đã thuê";
    case "vacant":
      return "Trống";
    case "maintenance":
      return "Bảo trì";
    default:
      return status;
  }
};

const getStatusColor = (status: RoomStatus) => {
  switch (status) {
    case RoomStatus.OCCUPIED:
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case RoomStatus.AVAILABLE:
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case RoomStatus.MAINTENANCE:
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    default:
      return "";
  }
};

export default function Rooms() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: listRoom, isLoading } = useQuery({
    queryKey: ["rooms"],
    queryFn: () => GetListRooms(1),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quản lý phòng</h2>
          <p className="text-muted-foreground">
            Quản lý thông tin tất cả các phòng trong ký túc xá
          </p>
        </div>
        <Button onClick={() => navigate("/admin/rooms/add")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Thêm phòng mới
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách phòng</CardTitle>
          <CardDescription>
            Tổng cộng {listRoom?.Body?.data.length} phòng,{" "}
            {
              listRoom?.Body?.data.filter(
                (r: { status: string }) => r.status === "occupied"
              ).length
            }{" "}
            đã thuê,{" "}
            {
              listRoom?.Body?.data.filter(
                (r: { status: string }) => r.status === RoomStatus.AVAILABLE
              ).length
            }{" "}
            trống,{" "}
            {
              listRoom?.Body?.data.filter(
                (r: { status: string }) => r.status === "maintenance"
              ).length
            }{" "}
            đang bảo trì
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col space-y-3 md:flex-row md:items-center md:space-x-4 md:space-y-0">
            <div className="flex w-full items-center space-x-2 md:w-1/3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo mã phòng, loại phòng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="flex items-center space-x-4">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tình trạng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="occupied">Đã thuê</SelectItem>
                  <SelectItem value="vacant">Trống</SelectItem>
                  <SelectItem value="maintenance">Đang bảo trì</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            {isLoading ? (
              <div className="flex items-center py-20 justify-center">
                <Icons.spinner className="h-10 w-10 animate-spin" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã phòng</TableHead>
                    <TableHead>Loại phòng</TableHead>
                    <TableHead>Sức chứa</TableHead>
                    <TableHead>Đã thuê</TableHead>
                    <TableHead>Tình trạng</TableHead>
                    <TableHead>Giá thuê (VND)</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {listRoom && listRoom?.Body?.data.length > 0 ? (
                    listRoom?.Body?.data.map(
                      (room: {
                        id: number;
                        room_number: string;
                        room_category: {
                          name: string;
                          capacity: number;
                          price: number;
                        };
                        user_count: number;
                        status: RoomStatus;
                      }) => (
                        <TableRow key={room.id}>
                          <TableCell className="font-medium">
                            {room.room_number}
                          </TableCell>
                          <TableCell>{room.room_category?.name}</TableCell>
                          <TableCell>{room.room_category?.capacity}</TableCell>
                          <TableCell>{room.user_count}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={getStatusColor(room.status)}
                            >
                              {getStatusText(room.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {room.room_category?.price.toLocaleString() ?? 0}
                          </TableCell>
                          <TableCell>
                            <Link to={`/admin/rooms/${room.id}`}>
                              <Button variant="link" size="sm">
                                Chi tiết
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      )
                    )
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        Không tìm thấy kết quả nào
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
