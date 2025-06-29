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
import { formatCurrency } from "@/lib/utils";

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  unit: string;
  provider: string;
  available: boolean;
  subscriptions: number;
}

interface ServiceDetailsModalProps {
  service: Service | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (service: Service) => void;
}

export default function ServiceDetailsModal({
  service,
  open,
  onOpenChange,
  onEdit,
}: ServiceDetailsModalProps) {
  if (!service) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Chi tiết dịch vụ</DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về dịch vụ {service.name}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Tên dịch vụ</TableCell>
                <TableCell>{service.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Mô tả</TableCell>
                <TableCell className="whitespace-pre-wrap">
                  {service.description}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Giá</TableCell>
                <TableCell>
                  {formatCurrency(service.price)} / {service.unit}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Nhà cung cấp</TableCell>
                <TableCell>{service.provider}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Trạng thái</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      service.available
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : "bg-red-100 text-red-800 hover:bg-red-100"
                    }
                  >
                    {service.available ? "Đang hoạt động" : "Tạm ngưng"}
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Số lượt sử dụng</TableCell>
                <TableCell>{service.subscriptions} lượt</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <DialogFooter className="mt-6">
          {onEdit && (
            <Button
              variant="outline"
              onClick={() => {
                onEdit(service);
                onOpenChange(false);
              }}
            >
              Chỉnh sửa
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
