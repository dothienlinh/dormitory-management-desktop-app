import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, CheckCircle, XCircle, Eye, Search } from "lucide-react";
import { UpdateServiceRequestDialog } from "./UpdateServiceRequestDialog";
import ServiceRequestDetailsModal from "../modals/ServiceRequestDetailsModal";

type ServiceRequest = {
  id: string;
  studentName: string;
  studentId: string;
  roomName: string;
  serviceType: string;
  description: string;
  status: string;
  requestDate: string;
  completedDate: string | null;
  urgency: string;
};

type ServiceRequestListProps = {
  requests: ServiceRequest[];
};

// Get status text in Vietnamese
const getStatusText = (status: string) => {
  switch (status) {
    case "pending":
      return "Chờ xử lý";
    case "in_progress":
      return "Đang xử lý";
    case "completed":
      return "Đã hoàn thành";
    case "cancelled":
      return "Đã hủy";
    default:
      return status;
  }
};

// Get status color for badges
const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "in_progress":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "completed":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "cancelled":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    default:
      return "";
  }
};

// Get status icon
const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case "in_progress":
      return <Clock className="h-4 w-4 text-blue-500" />;
    case "completed":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "cancelled":
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return null;
  }
};

// Get urgency text in Vietnamese
const getUrgencyText = (urgency: string) => {
  switch (urgency) {
    case "low":
      return "Thấp";
    case "medium":
      return "Trung bình";
    case "high":
      return "Cao";
    default:
      return urgency;
  }
};

// Get urgency color for badges
const getUrgencyColor = (urgency: string) => {
  switch (urgency) {
    case "low":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "medium":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "high":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    default:
      return "";
  }
};

// Format date
const formatDate = (dateString: string | null) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
};

export default function ServiceRequestList({
  requests,
}: ServiceRequestListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(
    null
  );
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Filter requests based on search term and filters
  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      searchTerm === "" ||
      request.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.roomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || request.status === statusFilter;
    const matchesUrgency =
      urgencyFilter === "all" || request.urgency === urgencyFilter;

    return matchesSearch && matchesStatus && matchesUrgency;
  });

  const handleUpdateStatus = (request: ServiceRequest, newStatus: string) => {
    // TODO: Implement status update functionality
    console.log("Update request status:", request.id, newStatus);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Danh sách yêu cầu dịch vụ</CardTitle>
        <CardDescription>
          Quản lý các yêu cầu dịch vụ từ sinh viên
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
            <div className="flex w-full items-center space-x-2 md:w-1/3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm yêu cầu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="md:w-1/4">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="pending">Chờ xử lý</SelectItem>
                <SelectItem value="in_progress">Đang xử lý</SelectItem>
                <SelectItem value="completed">Đã hoàn thành</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
            <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
              <SelectTrigger className="md:w-1/4">
                <SelectValue placeholder="Lọc theo mức độ ưu tiên" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="low">Thấp</SelectItem>
                <SelectItem value="medium">Trung bình</SelectItem>
                <SelectItem value="high">Cao</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã yêu cầu</TableHead>
                  <TableHead>Sinh viên</TableHead>
                  <TableHead>Phòng</TableHead>
                  <TableHead>Loại dịch vụ</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Ngày yêu cầu</TableHead>
                  <TableHead>Mức độ ưu tiên</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{request.studentName}</p>
                        <p className="text-sm text-muted-foreground">
                          {request.studentId}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{request.roomName}</TableCell>
                    <TableCell>{request.serviceType}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {request.description}
                    </TableCell>
                    <TableCell>{formatDate(request.requestDate)}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getUrgencyColor(request.urgency)}
                      >
                        {getUrgencyText(request.urgency)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(request.status)}
                        <Badge
                          variant="outline"
                          className={getStatusColor(request.status)}
                        >
                          {getStatusText(request.status)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon">
                          <Link
                            to={`/staff/services/requests/${request.id}`}
                            className="flex items-center justify-center"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        {(request.status === "pending" ||
                          request.status === "in_progress") && (
                          <Button
                            variant="ghost"
                            onClick={() => {
                              setSelectedRequest(request);
                              setOpenUpdateDialog(true);
                            }}
                          >
                            Cập nhật
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>

      {selectedRequest && (
        <UpdateServiceRequestDialog
          open={openUpdateDialog}
          onOpenChange={setOpenUpdateDialog}
          request={selectedRequest}
        />
      )}

      <ServiceRequestDetailsModal
        request={selectedRequest}
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
        onUpdateStatus={handleUpdateStatus}
      />
    </Card>
  );
}
