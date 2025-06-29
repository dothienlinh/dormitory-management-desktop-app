import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  FileText,
  Edit,
  Printer,
  Download,
  Clock,
  Building,
  User,
  CalendarDays,
  BanknoteIcon,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { EditContractDialog } from "./components/EditContractDialog";

// Sample data for a contract
const contractsData = [
  {
    id: "1",
    roomName: "P101",
    roomId: "101",
    roomType: "Standard",
    buildingName: "Tòa A",
    studentName: "Nguyễn Văn A",
    studentId: "SV001",
    studentPhone: "0901234567",
    studentEmail: "nguyenvana@example.com",
    startDate: "2023-09-01",
    endDate: "2024-06-30",
    monthlyFee: 1500000,
    deposit: 1500000,
    status: "active",
    createdAt: "2023-08-15",
    terms: [
      "Sinh viên phải tuân thủ nội quy KTX",
      "Không gây ồn ào sau 10 giờ tối",
      "Không hút thuốc trong phòng",
      "Không nấu ăn trong phòng",
      "Không nuôi động vật",
      "Giữ gìn vệ sinh chung",
      "Thanh toán phí đúng hạn vào ngày 05 hàng tháng",
    ],
    paymentSchedule: [
      {
        dueDate: "2023-09-05",
        amount: 1500000,
        status: "paid",
        paidDate: "2023-09-03",
      },
      {
        dueDate: "2023-10-05",
        amount: 1500000,
        status: "paid",
        paidDate: "2023-10-02",
      },
      {
        dueDate: "2023-11-05",
        amount: 1500000,
        status: "paid",
        paidDate: "2023-11-05",
      },
      {
        dueDate: "2023-12-05",
        amount: 1500000,
        status: "pending",
        paidDate: null,
      },
      {
        dueDate: "2024-01-05",
        amount: 1500000,
        status: "pending",
        paidDate: null,
      },
      {
        dueDate: "2024-02-05",
        amount: 1500000,
        status: "pending",
        paidDate: null,
      },
      {
        dueDate: "2024-03-05",
        amount: 1500000,
        status: "pending",
        paidDate: null,
      },
      {
        dueDate: "2024-04-05",
        amount: 1500000,
        status: "pending",
        paidDate: null,
      },
      {
        dueDate: "2024-05-05",
        amount: 1500000,
        status: "pending",
        paidDate: null,
      },
      {
        dueDate: "2024-06-05",
        amount: 1500000,
        status: "pending",
        paidDate: null,
      },
    ],
    contractHistory: [
      {
        date: "2023-08-15",
        action: "created",
        description: "Hợp đồng được tạo",
        user: "Admin",
      },
      {
        date: "2023-08-15",
        action: "signed",
        description: "Hợp đồng được ký bởi sinh viên và quản lý",
        user: "Admin",
      },
      {
        date: "2023-09-03",
        action: "payment",
        description: "Thanh toán phí tháng 9/2023",
        user: "System",
      },
      {
        date: "2023-10-02",
        action: "payment",
        description: "Thanh toán phí tháng 10/2023",
        user: "System",
      },
      {
        date: "2023-11-05",
        action: "payment",
        description: "Thanh toán phí tháng 11/2023",
        user: "System",
      },
    ],
  },
  // Other contracts...
];

// Get status text in Vietnamese
const getStatusText = (status: string) => {
  switch (status) {
    case "active":
      return "Đang hiệu lực";
    case "expired":
      return "Đã hết hạn";
    case "terminated":
      return "Đã chấm dứt";
    default:
      return status;
  }
};

// Get status badge color
const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "expired":
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    case "terminated":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    default:
      return "";
  }
};

// Get payment status icon
const getPaymentStatusIcon = (status: string) => {
  switch (status) {
    case "paid":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "pending":
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case "overdue":
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    default:
      return null;
  }
};

// Get action icon
const getActionIcon = (action: string) => {
  switch (action) {
    case "created":
      return <FileText className="h-4 w-4 text-blue-500" />;
    case "signed":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "payment":
      return <BanknoteIcon className="h-4 w-4 text-purple-500" />;
    case "edited":
      return <Edit className="h-4 w-4 text-orange-500" />;
    case "terminated":
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return null;
  }
};

export default function ContractDetails() {
  const { id } = useParams<{ id: string }>();
  const contract = contractsData.find((c) => c.id === id);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  if (!contract) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Không tìm thấy hợp đồng</CardTitle>
            <CardDescription>
              Không tìm thấy thông tin hợp đồng với mã {id}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/admin/contracts">
              <Button>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Quay lại danh sách hợp đồng
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
        <div className="flex items-center space-x-4">
          <Link to="/admin/contracts">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Hợp đồng {contract.id}
            </h2>
            <div className="flex items-center space-x-2">
              <Badge
                variant="outline"
                className={getStatusColor(contract.status)}
              >
                {getStatusText(contract.status)}
              </Badge>
              <p className="text-muted-foreground">
                Ngày tạo:{" "}
                {new Date(contract.createdAt).toLocaleDateString("vi-VN")}
              </p>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            In hợp đồng
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Tải PDF
          </Button>
          <Button onClick={() => setOpenEditDialog(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Thông tin sinh viên
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Họ tên:</span>
                <Link
                  to={`/admin/students/${contract.studentId}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  {contract.studentName}
                </Link>
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">MSSV:</span>
                <span>{contract.studentId}</span>
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Số điện thoại:
                </span>
                <span>{contract.studentPhone}</span>
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Email:</span>
                <span>{contract.studentEmail}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Thông tin phòng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Mã phòng:</span>
                <Link
                  to={`/admin/rooms/${contract.roomId}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  {contract.roomName}
                </Link>
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tòa nhà:</span>
                <span>{contract.buildingName}</span>
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Loại phòng:
                </span>
                <span>{contract.roomType}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Thông tin hợp đồng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Thời hạn:
                  </span>
                  <span>
                    {new Date(contract.startDate).toLocaleDateString("vi-VN")} -{" "}
                    {new Date(contract.endDate).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Phí thuê hàng tháng:
                  </span>
                  <span className="font-medium">
                    {contract.monthlyFee.toLocaleString()} VND
                  </span>
                </div>
                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Tiền đặt cọc:
                  </span>
                  <span className="font-medium">
                    {contract.deposit.toLocaleString()} VND
                  </span>
                </div>
              </div>

              <div>
                <span className="text-sm text-muted-foreground">
                  Điều khoản hợp đồng:
                </span>
                <ul className="mt-2 space-y-1 pl-5 text-sm list-disc">
                  {contract.terms.map((term, index) => (
                    <li key={index}>{term}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BanknoteIcon className="h-5 w-5" />
              Lịch thanh toán
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kỳ thanh toán</TableHead>
                    <TableHead>Ngày đến hạn</TableHead>
                    <TableHead>Số tiền</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày thanh toán</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contract.paymentSchedule.map((payment, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        Tháng {index + 9}/2023 -{" "}
                        {index + 9 > 12 ? index + 9 - 12 : index + 9}/
                        {index + 9 > 12 ? "2024" : "2023"}
                      </TableCell>
                      <TableCell>
                        {new Date(payment.dueDate).toLocaleDateString("vi-VN")}
                      </TableCell>
                      <TableCell>
                        {payment.amount.toLocaleString()} VND
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getPaymentStatusIcon(payment.status)}
                          <span>
                            {payment.status === "paid"
                              ? "Đã thanh toán"
                              : "Chưa thanh toán"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {payment.paidDate
                          ? new Date(payment.paidDate).toLocaleDateString(
                              "vi-VN"
                            )
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {payment.status === "pending" && (
                          <Button variant="outline" size="sm">
                            Thanh toán
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div>
              <span className="text-sm text-muted-foreground">
                Đã thanh toán:
              </span>
              <span className="ml-2 font-medium">
                {(
                  contract.paymentSchedule.filter((p) => p.status === "paid")
                    .length * contract.monthlyFee
                ).toLocaleString()}{" "}
                VND
              </span>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Còn lại:</span>
              <span className="ml-2 font-medium">
                {(
                  contract.paymentSchedule.filter((p) => p.status !== "paid")
                    .length * contract.monthlyFee
                ).toLocaleString()}{" "}
                VND
              </span>
            </div>
          </CardFooter>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Lịch sử hợp đồng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contract.contractHistory.map((event, index) => (
                <div key={index} className="flex space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    {getActionIcon(event.action)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{event.description}</p>
                      <span className="text-xs text-muted-foreground">
                        {new Date(event.date).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Thực hiện bởi: {event.user}
                    </p>
                    {index < contract.contractHistory.length - 1 && (
                      <Separator className="mt-3" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <EditContractDialog
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
        contract={contract}
      />
    </div>
  );
}
