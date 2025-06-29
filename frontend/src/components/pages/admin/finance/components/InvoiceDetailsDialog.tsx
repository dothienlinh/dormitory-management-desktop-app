import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Printer, Download } from "lucide-react";

type InvoiceDetailsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: {
    id: string;
    studentName: string;
    studentId: string;
    roomName: string;
    invoiceDate: string;
    dueDate: string;
    amount: number;
    type: string;
    description: string;
    status: string;
    paidDate: string | null;
    paidAmount: number;
  } | null;
};

// Get status text in Vietnamese
const getStatusText = (status: string) => {
  switch (status) {
    case "paid":
      return "Đã thanh toán";
    case "pending":
      return "Chờ thanh toán";
    case "overdue":
      return "Quá hạn";
    default:
      return status;
  }
};

// Get status badge color
const getStatusColor = (status: string) => {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "overdue":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    default:
      return "";
  }
};

// Get invoice type in Vietnamese
const getInvoiceTypeText = (type: string) => {
  switch (type) {
    case "monthly_fee":
      return "Phí thuê hàng tháng";
    case "fine":
      return "Tiền phạt";
    case "deposit":
      return "Tiền đặt cọc";
    case "utility":
      return "Phí tiện ích";
    default:
      return type;
  }
};

export function InvoiceDetailsDialog({
  open,
  onOpenChange,
  invoice,
}: InvoiceDetailsDialogProps) {
  if (!invoice) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Chi tiết hóa đơn {invoice.id}</DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về hóa đơn và thanh toán
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end space-x-2">
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            In hóa đơn
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Tải PDF
          </Button>
        </div>

        <div className="mt-4 space-y-4">
          {/* Thông tin cơ bản */}
          <div>
            <h4 className="mb-2 font-medium">Thông tin cơ bản</h4>
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Trạng thái:
                </span>
                <Badge
                  variant="outline"
                  className={getStatusColor(invoice.status)}
                >
                  {getStatusText(invoice.status)}
                </Badge>
              </div>
              <Separator className="my-2" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Loại hóa đơn:
                </span>
                <span>{getInvoiceTypeText(invoice.type)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Số tiền:</span>
                <span className="font-medium">
                  {invoice.amount.toLocaleString()} VND
                </span>
              </div>
            </div>
          </div>

          {/* Thông tin sinh viên */}
          <div>
            <h4 className="mb-2 font-medium">Thông tin sinh viên</h4>
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Sinh viên:
                </span>
                <span>{invoice.studentName}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Mã sinh viên:
                </span>
                <span>{invoice.studentId}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Phòng:</span>
                <span>{invoice.roomName}</span>
              </div>
            </div>
          </div>

          {/* Thông tin thanh toán */}
          <div>
            <h4 className="mb-2 font-medium">Thông tin thanh toán</h4>
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Ngày tạo:</span>
                <span>
                  {new Date(invoice.invoiceDate).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <Separator className="my-2" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Hạn thanh toán:
                </span>
                <span>
                  {new Date(invoice.dueDate).toLocaleDateString("vi-VN")}
                </span>
              </div>
              {invoice.status === "paid" && (
                <>
                  <Separator className="my-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Ngày thanh toán:
                    </span>
                    <span>
                      {invoice.paidDate
                        ? new Date(invoice.paidDate).toLocaleDateString("vi-VN")
                        : "-"}
                    </span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Số tiền đã thanh toán:
                    </span>
                    <span className="font-medium">
                      {invoice.paidAmount.toLocaleString()} VND
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mô tả */}
          <div>
            <h4 className="mb-2 font-medium">Mô tả</h4>
            <div className="rounded-lg border p-4">
              <p className="text-sm">{invoice.description}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
