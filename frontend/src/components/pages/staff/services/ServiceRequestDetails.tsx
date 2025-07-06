import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";
import { serviceRequests } from "./data";

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

export default function ServiceRequestDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const request = serviceRequests.find((r) => r.id === id);

  const handleUpdateStatus = (newStatus: string) => {
    // TODO: Implement status update functionality
    console.log("Update request status:", id, newStatus);
  };

  if (!request) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Không tìm thấy yêu cầu dịch vụ</CardTitle>
          <CardDescription>
            Yêu cầu dịch vụ bạn đang tìm kiếm không tồn tại hoặc đã bị xóa
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button
            variant="outline"
            onClick={() => navigate("/staff/services/requests")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Chi tiết yêu cầu dịch vụ</CardTitle>
          <Button
            variant="outline"
            onClick={() => navigate("/staff/services/requests")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
        </div>
        <CardDescription>
          Thông tin chi tiết về yêu cầu {request.id}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Mã yêu cầu</TableCell>
              <TableCell>{request.id}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Sinh viên</TableCell>
              <TableCell>
                {request.studentName} ({request.studentId})
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Phòng</TableCell>
              <TableCell>{request.roomName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Loại dịch vụ</TableCell>
              <TableCell>{request.serviceType}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Mô tả</TableCell>
              <TableCell className="whitespace-pre-wrap">
                {request.description}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Mức độ ưu tiên</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={getUrgencyColor(request.urgency)}
                >
                  {getUrgencyText(request.urgency)}
                </Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Ngày yêu cầu</TableCell>
              <TableCell>{formatDate(request.requestDate)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Ngày hoàn thành</TableCell>
              <TableCell>{formatDate(request.completedDate)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Trạng thái</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={getStatusColor(request.status)}
                >
                  {getStatusText(request.status)}
                </Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        {request.status !== "completed" && request.status !== "cancelled" && (
          <div className="flex space-x-2">
            {request.status === "pending" && (
              <Button onClick={() => handleUpdateStatus("in_progress")}>
                Bắt đầu xử lý
              </Button>
            )}
            {request.status === "in_progress" && (
              <Button onClick={() => handleUpdateStatus("completed")}>
                Hoàn thành
              </Button>
            )}
            <Button
              variant="destructive"
              onClick={() => handleUpdateStatus("cancelled")}
            >
              Hủy yêu cầu
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
