import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { Search, UserCheck, Clock, CalendarDays } from "lucide-react";
import VisitorDetailsModal from "../modals/VisitorDetailsModal";
import CheckOutVisitorModal from "../modals/CheckOutVisitorModal";

interface VisitorLog {
  id: string;
  visitorName: string;
  visitorId: string;
  purpose: string;
  visitingStudent: {
    id: string;
    name: string;
    room: string;
  } | null;
  checkInTime: string;
  checkOutTime: string | null;
  status: "active" | "completed";
}

interface VisitorLogsProps {
  visitors: VisitorLog[];
}

// Get status text in Vietnamese
const getStatusText = (status: string) => {
  switch (status) {
    case "active":
      return "Đang hoạt động";
    case "completed":
      return "Đã hoàn thành";
    default:
      return status;
  }
};

// Get status color for badges
const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "completed":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    default:
      return "";
  }
};

// Format date and time
const formatDateTime = (dateString: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleString("vi-VN");
};

export default function VisitorLogs({ visitors }: VisitorLogsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVisitor, setSelectedVisitor] = useState<VisitorLog | null>(
    null
  );
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCheckOutModal, setShowCheckOutModal] = useState(false);

  // Filter visitors based on search
  const filteredVisitors = visitors.filter(
    (visitor) =>
      visitor.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.visitingStudent?.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      false
  );

  const handleCheckOut = (visitorId: string) => {
    // TODO: Implement check-out logic
    console.log("Checking out visitor:", visitorId);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Đăng ký khách ra vào</CardTitle>
          <CardDescription>
            Quản lý khách thăm và người ra vào ký túc xá
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex w-full items-center space-x-2 md:w-1/3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm khách..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã đăng ký</TableHead>
                  <TableHead>Tên khách</TableHead>
                  <TableHead>CCCD/CMND</TableHead>
                  <TableHead>Mục đích</TableHead>
                  <TableHead>Thăm sinh viên</TableHead>
                  <TableHead>Thời gian vào</TableHead>
                  <TableHead>Thời gian ra</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVisitors.length > 0 ? (
                  filteredVisitors.map((visitor) => (
                    <TableRow key={visitor.id}>
                      <TableCell className="font-medium">
                        {visitor.id}
                      </TableCell>
                      <TableCell>{visitor.visitorName}</TableCell>
                      <TableCell>{visitor.visitorId}</TableCell>
                      <TableCell>{visitor.purpose}</TableCell>
                      <TableCell>
                        {visitor.visitingStudent
                          ? `${visitor.visitingStudent.name} (${visitor.visitingStudent.room})`
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {formatDateTime(visitor.checkInTime)}
                      </TableCell>
                      <TableCell>
                        {visitor.checkOutTime
                          ? formatDateTime(visitor.checkOutTime)
                          : "Chưa rời đi"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getStatusColor(visitor.status)}
                        >
                          {getStatusText(visitor.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {visitor.status === "active" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedVisitor(visitor);
                              setShowCheckOutModal(true);
                            }}
                          >
                            Đăng ký ra
                          </Button>
                        )}
                        {visitor.status === "completed" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedVisitor(visitor);
                              setShowDetailsModal(true);
                            }}
                          >
                            Chi tiết
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      Không tìm thấy kết quả nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng lượt khách
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{visitors.length}</div>
            <p className="text-xs text-muted-foreground">Trong tháng 11/2023</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Khách đang trong khu vực
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {visitors.filter((visitor) => visitor.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lượt khách hôm nay
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {/* Giả sử lượt khách của ngày hiện tại */}
              {
                visitors.filter(
                  (visitor) =>
                    new Date(visitor.checkInTime).toDateString() ===
                    new Date().toDateString()
                ).length
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Thời gian trung bình
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1h 45m</div>
            <p className="text-xs text-muted-foreground">
              Thời gian lưu trú trung bình
            </p>
          </CardContent>
        </Card>
      </div>

      <VisitorDetailsModal
        visitor={selectedVisitor}
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
      />

      <CheckOutVisitorModal
        visitor={selectedVisitor}
        open={showCheckOutModal}
        onOpenChange={setShowCheckOutModal}
        onConfirm={handleCheckOut}
      />
    </div>
  );
}
