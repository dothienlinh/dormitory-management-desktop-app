import { useState } from "react";
import { Link } from "react-router-dom";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Search,
  Filter,
  Eye,
  Printer,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  FileDown,
  ChevronLeft,
} from "lucide-react";
import { AddInvoiceDialog } from "./components/AddInvoiceDialog";
import { InvoiceDetailsDialog } from "./components/InvoiceDetailsDialog";
import { PaymentDialog } from "./components/PaymentDialog";

// Define invoice type
type Invoice = {
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
};

// Sample data for invoices
const invoicesData: Invoice[] = [
  {
    id: "INV001",
    studentName: "Nguyễn Văn A",
    studentId: "SV001",
    roomName: "P101",
    invoiceDate: "2023-09-01",
    dueDate: "2023-09-10",
    amount: 1500000,
    type: "monthly_fee",
    description: "Phí thuê tháng 9/2023",
    status: "paid",
    paidDate: "2023-09-03",
    paidAmount: 1500000,
  },
  {
    id: "INV002",
    studentName: "Trần Bình B",
    studentId: "SV002",
    roomName: "P101",
    invoiceDate: "2023-09-01",
    dueDate: "2023-09-10",
    amount: 1500000,
    type: "monthly_fee",
    description: "Phí thuê tháng 9/2023",
    status: "paid",
    paidDate: "2023-09-05",
    paidAmount: 1500000,
  },
  {
    id: "INV003",
    studentName: "Lê Thị C",
    studentId: "SV003",
    roomName: "P101",
    invoiceDate: "2023-09-01",
    dueDate: "2023-09-10",
    amount: 1500000,
    type: "monthly_fee",
    description: "Phí thuê tháng 9/2023",
    status: "paid",
    paidDate: "2023-09-05",
    paidAmount: 1500000,
  },
  {
    id: "INV004",
    studentName: "Phạm Văn D",
    studentId: "SV004",
    roomName: "P201",
    invoiceDate: "2023-10-01",
    dueDate: "2023-10-10",
    amount: 1500000,
    type: "monthly_fee",
    description: "Phí thuê tháng 10/2023",
    status: "paid",
    paidDate: "2023-10-07",
    paidAmount: 1500000,
  },
  {
    id: "INV005",
    studentName: "Hoàng Thị E",
    studentId: "SV005",
    roomName: "P201",
    invoiceDate: "2023-10-01",
    dueDate: "2023-10-10",
    amount: 1500000,
    type: "monthly_fee",
    description: "Phí thuê tháng 10/2023",
    status: "paid",
    paidDate: "2023-10-09",
    paidAmount: 1500000,
  },
  {
    id: "INV006",
    studentName: "Vũ Minh F",
    studentId: "SV006",
    roomName: "P301",
    invoiceDate: "2023-11-01",
    dueDate: "2023-11-10",
    amount: 2000000,
    type: "monthly_fee",
    description: "Phí thuê tháng 11/2023",
    status: "paid",
    paidDate: "2023-11-05",
    paidAmount: 2000000,
  },
  {
    id: "INV007",
    studentName: "Đặng Thu G",
    studentId: "SV007",
    roomName: "P301",
    invoiceDate: "2023-11-01",
    dueDate: "2023-11-10",
    amount: 2000000,
    type: "monthly_fee",
    description: "Phí thuê tháng 11/2023",
    status: "paid",
    paidDate: "2023-11-09",
    paidAmount: 2000000,
  },
  {
    id: "INV008",
    studentName: "Nguyễn Văn A",
    studentId: "SV001",
    roomName: "P101",
    invoiceDate: "2023-12-01",
    dueDate: "2023-12-10",
    amount: 1500000,
    type: "monthly_fee",
    description: "Phí thuê tháng 12/2023",
    status: "pending",
    paidDate: null,
    paidAmount: 0,
  },
  {
    id: "INV009",
    studentName: "Trần Bình B",
    studentId: "SV002",
    roomName: "P101",
    invoiceDate: "2023-12-01",
    dueDate: "2023-12-10",
    amount: 1500000,
    type: "monthly_fee",
    description: "Phí thuê tháng 12/2023",
    status: "pending",
    paidDate: null,
    paidAmount: 0,
  },
  {
    id: "INV010",
    studentName: "Vũ Minh F",
    studentId: "SV006",
    roomName: "P301",
    invoiceDate: "2023-11-15",
    dueDate: "2023-11-20",
    amount: 300000,
    type: "fine",
    description: "Phạt vi phạm nội quy",
    status: "overdue",
    paidDate: null,
    paidAmount: 0,
  },
];

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

// Get status icon
const getStatusIcon = (status: string) => {
  switch (status) {
    case "paid":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "pending":
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case "overdue":
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return null;
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

export default function Invoices() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [viewMode, setViewMode] = useState("all");
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Calculate statistics
  const totalInvoices = invoicesData.length;
  const totalAmount = invoicesData.reduce(
    (sum, invoice) => sum + invoice.amount,
    0
  );
  const paidAmount = invoicesData.reduce(
    (sum, invoice) => sum + invoice.paidAmount,
    0
  );
  const pendingAmount = totalAmount - paidAmount;
  const paidInvoices = invoicesData.filter(
    (invoice) => invoice.status === "paid"
  ).length;
  const pendingInvoices = invoicesData.filter(
    (invoice) => invoice.status === "pending"
  ).length;
  const overdueInvoices = invoicesData.filter(
    (invoice) => invoice.status === "overdue"
  ).length;

  // Filter invoices based on search and filters
  const filteredInvoices = invoicesData.filter((invoice) => {
    const matchesSearch =
      invoice.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.roomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || invoice.status === statusFilter;
    const matchesType = typeFilter === "all" || invoice.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Apply view mode filter (added functionality - my invoices / all)
  const displayedInvoices =
    viewMode === "mine"
      ? filteredInvoices.filter(
          (invoice) => invoice.studentId === "currentUser"
        ) // Replace with actual current user logic
      : filteredInvoices;

  // Handle view details
  const handleViewDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setOpenDetailsDialog(true);
  };

  // Handle print invoice
  const handlePrint = (invoice: Invoice) => {
    // Implement print functionality
    console.log("Printing invoice:", invoice);
    window.print();
  };

  // Handle payment
  const handlePayment = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setOpenPaymentDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
        <div className="flex items-center space-x-4">
          <Link to="/admin/finance">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Hóa đơn</h2>
            <p className="text-muted-foreground">
              Quản lý hóa đơn và thanh toán
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setOpenAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Tạo hóa đơn mới
          </Button>
          <Button variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Overview cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng hóa đơn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInvoices}</div>
            <div className="mt-1 flex text-xs text-muted-foreground">
              <div className="flex items-center">
                <CheckCircle className="mr-1 h-3 w-3 text-green-500" />
                <span className="mr-2">{paidInvoices} đã thanh toán</span>
              </div>
              <div className="flex items-center">
                <AlertTriangle className="mr-1 h-3 w-3 text-yellow-500" />
                <span className="mr-2">{pendingInvoices} chờ thanh toán</span>
              </div>
              <div className="flex items-center">
                <XCircle className="mr-1 h-3 w-3 text-red-500" />
                <span>{overdueInvoices} quá hạn</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng tiền</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalAmount.toLocaleString()} VND
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã thanh toán</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {paidAmount.toLocaleString()} VND
            </div>
            <p className="text-xs text-muted-foreground">
              <span>
                {Math.round((paidAmount / totalAmount) * 100)}% tổng số
              </span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Chưa thanh toán
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pendingAmount.toLocaleString()} VND
            </div>
            <p className="text-xs text-muted-foreground">
              <span>
                {Math.round((pendingAmount / totalAmount) * 100)}% tổng số
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách hóa đơn</CardTitle>
          <CardDescription>
            Quản lý tất cả các hóa đơn và thanh toán
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col space-y-3 md:flex-row md:items-center md:space-x-4 md:space-y-0">
            <div className="flex w-full items-center space-x-2 md:w-1/3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo mã, tên sinh viên, phòng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="flex items-center space-x-4">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="paid">Đã thanh toán</SelectItem>
                  <SelectItem value="pending">Chờ thanh toán</SelectItem>
                  <SelectItem value="overdue">Quá hạn</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Loại hóa đơn" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="monthly_fee">
                    Phí thuê hàng tháng
                  </SelectItem>
                  <SelectItem value="fine">Tiền phạt</SelectItem>
                  <SelectItem value="deposit">Tiền đặt cọc</SelectItem>
                  <SelectItem value="utility">Phí tiện ích</SelectItem>
                </SelectContent>
              </Select>

              <Select value={viewMode} onValueChange={setViewMode}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Chế độ xem" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả hóa đơn</SelectItem>
                  <SelectItem value="mine">Hóa đơn của tôi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã hóa đơn</TableHead>
                  <TableHead>Sinh viên</TableHead>
                  <TableHead>Phòng</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Hạn thanh toán</TableHead>
                  <TableHead>Số tiền (VND)</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedInvoices.length > 0 ? (
                  displayedInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">
                        {invoice.id}
                      </TableCell>
                      <TableCell>
                        <Link
                          to={`/admin/students/${invoice.studentId}`}
                          className="text-blue-600 hover:underline"
                        >
                          {invoice.studentName}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link
                          to={`/admin/rooms/${invoice.roomName}`}
                          className="text-blue-600 hover:underline"
                        >
                          {invoice.roomName}
                        </Link>
                      </TableCell>
                      <TableCell>{getInvoiceTypeText(invoice.type)}</TableCell>
                      <TableCell>
                        {new Date(invoice.invoiceDate).toLocaleDateString(
                          "vi-VN"
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(invoice.dueDate).toLocaleDateString("vi-VN")}
                      </TableCell>
                      <TableCell>{invoice.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(invoice.status)}
                          <Badge
                            variant="outline"
                            className={getStatusColor(invoice.status)}
                          >
                            {getStatusText(invoice.status)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDetails(invoice)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handlePrint(invoice)}
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                          {invoice.status !== "paid" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePayment(invoice)}
                            >
                              Thanh toán
                            </Button>
                          )}
                        </div>
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

      <AddInvoiceDialog open={openAddDialog} onOpenChange={setOpenAddDialog} />
      <InvoiceDetailsDialog
        open={openDetailsDialog}
        onOpenChange={setOpenDetailsDialog}
        invoice={selectedInvoice}
      />
      <PaymentDialog
        open={openPaymentDialog}
        onOpenChange={setOpenPaymentDialog}
        invoice={selectedInvoice}
      />
    </div>
  );
}
