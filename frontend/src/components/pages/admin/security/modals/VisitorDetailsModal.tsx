import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

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

interface VisitorDetailsModalProps {
  visitor: VisitorLog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
const formatDateTime = (dateString: string | null) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleString("vi-VN");
};

// Calculate duration of visit
const calculateDuration = (
  checkInTime: string,
  checkOutTime: string | null
) => {
  if (!checkOutTime) return "Chưa rời đi";
  const start = new Date(checkInTime);
  const end = new Date(checkOutTime);
  const diff = end.getTime() - start.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours} giờ ${minutes} phút`;
};

export default function VisitorDetailsModal({
  visitor,
  open,
  onOpenChange,
}: VisitorDetailsModalProps) {
  if (!visitor) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Chi tiết khách thăm {visitor.id}</DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về lượt khách thăm
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Tên khách</TableCell>
                <TableCell>{visitor.visitorName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">CCCD/CMND</TableCell>
                <TableCell>{visitor.visitorId}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Mục đích thăm</TableCell>
                <TableCell className="whitespace-pre-wrap">
                  {visitor.purpose}
                </TableCell>
              </TableRow>
              {visitor.visitingStudent && (
                <>
                  <TableRow>
                    <TableCell className="font-medium">
                      Sinh viên được thăm
                    </TableCell>
                    <TableCell>{visitor.visitingStudent.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Phòng</TableCell>
                    <TableCell>{visitor.visitingStudent.room}</TableCell>
                  </TableRow>
                </>
              )}
              <TableRow>
                <TableCell className="font-medium">Thời gian vào</TableCell>
                <TableCell>{formatDateTime(visitor.checkInTime)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Thời gian ra</TableCell>
                <TableCell>{formatDateTime(visitor.checkOutTime)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Thời gian lưu trú</TableCell>
                <TableCell>
                  {calculateDuration(visitor.checkInTime, visitor.checkOutTime)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Trạng thái</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getStatusColor(visitor.status)}
                  >
                    {getStatusText(visitor.status)}
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
