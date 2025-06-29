import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

interface ServiceRequest {
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
}

interface ServiceRequestDetailsModalProps {
  request: ServiceRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateStatus?: (request: ServiceRequest, newStatus: string) => void;
}

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

export default function ServiceRequestDetailsModal({
  request,
  open,
  onOpenChange,
  onUpdateStatus,
}: ServiceRequestDetailsModalProps) {
  if (!request) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Chi tiết yêu cầu dịch vụ</DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về yêu cầu {request.id}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
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
        </div>

        <DialogFooter className="mt-6">
          {onUpdateStatus &&
            request.status !== "completed" &&
            request.status !== "cancelled" && (
              <div className="flex space-x-2">
                {request.status === "pending" && (
                  <Button
                    onClick={() => {
                      onUpdateStatus(request, "in_progress");
                      onOpenChange(false);
                    }}
                  >
                    Bắt đầu xử lý
                  </Button>
                )}
                {request.status === "in_progress" && (
                  <Button
                    onClick={() => {
                      onUpdateStatus(request, "completed");
                      onOpenChange(false);
                    }}
                  >
                    Hoàn thành
                  </Button>
                )}
                <Button
                  variant="destructive"
                  onClick={() => {
                    onUpdateStatus(request, "cancelled");
                    onOpenChange(false);
                  }}
                >
                  Hủy yêu cầu
                </Button>
              </div>
            )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
