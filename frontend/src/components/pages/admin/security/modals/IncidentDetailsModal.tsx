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

interface SecurityIncident {
  id: string;
  title: string;
  description: string;
  type: string;
  status: "pending" | "investigating" | "resolved";
  severity: "low" | "medium" | "high";
  reportDate: string;
  location: string;
  reportedBy: string;
  involvedStudents: { id: string; name: string }[];
}

interface IncidentDetailsModalProps {
  incident: SecurityIncident | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Get status text in Vietnamese
const getStatusText = (status: string) => {
  switch (status) {
    case "pending":
      return "Chờ xử lý";
    case "investigating":
      return "Đang điều tra";
    case "resolved":
      return "Đã giải quyết";
    default:
      return status;
  }
};

// Get status color for badges
const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "investigating":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "resolved":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    default:
      return "";
  }
};

// Get severity text in Vietnamese
const getSeverityText = (severity: string) => {
  switch (severity) {
    case "low":
      return "Thấp";
    case "medium":
      return "Trung bình";
    case "high":
      return "Cao";
    default:
      return severity;
  }
};

// Get severity color for badges
const getSeverityColor = (severity: string) => {
  switch (severity) {
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

// Get incident type text in Vietnamese
const getIncidentTypeText = (type: string) => {
  switch (type) {
    case "curfew":
      return "Vi phạm giờ giới nghiêm";
    case "theft":
      return "Trộm cắp";
    case "noise":
      return "Gây ồn ào";
    case "fire_hazard":
      return "Nguy cơ cháy nổ";
    case "trespassing":
      return "Xâm nhập trái phép";
    case "rule_violation":
      return "Vi phạm nội quy";
    default:
      return type;
  }
};

// Format date and time
const formatDateTime = (dateString: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleString("vi-VN");
};

export default function IncidentDetailsModal({
  incident,
  open,
  onOpenChange,
}: IncidentDetailsModalProps) {
  if (!incident) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Chi tiết sự cố {incident.id}</DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về sự cố an ninh
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Tiêu đề</TableCell>
                <TableCell>{incident.title}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Mô tả</TableCell>
                <TableCell className="whitespace-pre-wrap">
                  {incident.description}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Loại sự cố</TableCell>
                <TableCell>{getIncidentTypeText(incident.type)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Trạng thái</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getStatusColor(incident.status)}
                  >
                    {getStatusText(incident.status)}
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Mức độ nghiêm trọng
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getSeverityColor(incident.severity)}
                  >
                    {getSeverityText(incident.severity)}
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Địa điểm</TableCell>
                <TableCell>{incident.location}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Thời gian báo cáo</TableCell>
                <TableCell>{formatDateTime(incident.reportDate)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Người báo cáo</TableCell>
                <TableCell>{incident.reportedBy}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Sinh viên liên quan
                </TableCell>
                <TableCell>
                  {incident.involvedStudents.map((student) => (
                    <div key={student.id}>{student.name}</div>
                  ))}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 flex justify-between">
          <div className="flex space-x-2">
            {incident.status !== "resolved" && (
              <>
                <Button variant="outline" size="sm">
                  Cập nhật trạng thái
                </Button>
                <Button variant="outline" size="sm">
                  Thêm ghi chú
                </Button>
              </>
            )}
          </div>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
