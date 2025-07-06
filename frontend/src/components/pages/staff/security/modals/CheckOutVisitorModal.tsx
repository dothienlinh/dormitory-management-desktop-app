import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

interface CheckOutVisitorModalProps {
  visitor: VisitorLog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (visitorId: string) => void;
}

// Format date and time
const formatDateTime = (dateString: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleString("vi-VN");
};

// Calculate duration of visit
const calculateDuration = (checkInTime: string) => {
  const start = new Date(checkInTime);
  const now = new Date();
  const diff = now.getTime() - start.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours} giờ ${minutes} phút`;
};

export default function CheckOutVisitorModal({
  visitor,
  open,
  onOpenChange,
  onConfirm,
}: CheckOutVisitorModalProps) {
  if (!visitor) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Xác nhận đăng ký ra</DialogTitle>
          <DialogDescription>
            Xác nhận khách rời khỏi ký túc xá
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
                <TableCell className="font-medium">Thời gian lưu trú</TableCell>
                <TableCell>{calculateDuration(visitor.checkInTime)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            onClick={() => {
              onConfirm(visitor.id);
              onOpenChange(false);
            }}
          >
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
