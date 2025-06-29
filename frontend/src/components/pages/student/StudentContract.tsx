import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  Calendar,
  CalendarCheck,
  CalendarClock,
  Check,
  Download,
  FileText,
  Home,
  Info,
  Receipt,
  Shield,
  User,
  Wallet,
} from "lucide-react";
import { Link } from "react-router-dom";

// Dữ liệu mẫu cho hợp đồng
const contractData = {
  id: "HD20230901",
  studentId: "SV123456",
  studentName: "Nguyễn Văn A",
  roomId: "A305",
  building: "Tòa nhà A",
  bedNumber: "02",
  roomType: "Phòng 4 người",
  startDate: "01/09/2023",
  endDate: "31/07/2024",
  status: "active", // active, expired, terminated
  deposit: 1000000,
  monthlyFee: 850000,
  paymentCycle: "monthly", // monthly, quarterly, yearly
  signDate: "20/08/2023",
  specialRequirements: "Không",
  contactInfo: {
    phone: "0912345678",
    email: "nguyenvana@example.com",
    emergencyContact: "0987654321 (Nguyễn Văn B - Bố)",
  },
  contractTerms: [
    {
      id: 1,
      title: "Thời hạn hợp đồng",
      content:
        "Hợp đồng có hiệu lực từ ngày 01/09/2023 đến ngày 31/07/2024 (11 tháng).",
    },
    {
      id: 2,
      title: "Phí ký túc xá",
      content:
        "Phí hàng tháng: 850.000 VNĐ/tháng. Thanh toán vào trước ngày 15 hàng tháng.",
    },
    {
      id: 3,
      title: "Tiền đặt cọc",
      content:
        "Tiền đặt cọc: 1.000.000 VNĐ. Sẽ được hoàn trả khi kết thúc hợp đồng nếu không có hư hỏng hoặc chi phí phát sinh.",
    },
    {
      id: 4,
      title: "Quy định ở KTX",
      content:
        "Sinh viên phải tuân thủ nội quy KTX, giữ gìn vệ sinh chung và bảo quản tài sản công.",
    },
    {
      id: 5,
      title: "Chấm dứt hợp đồng",
      content:
        "Sinh viên muốn chấm dứt hợp đồng trước thời hạn phải thông báo trước ít nhất 30 ngày và có thể bị mất tiền đặt cọc.",
    },
    {
      id: 6,
      title: "Điều khoản về điện nước",
      content:
        "Phí điện nước được tính theo thực tế sử dụng và sẽ được thông báo hàng tháng.",
    },
  ],
  paymentHistory: [
    {
      id: "PMT001",
      period: "Tháng 9/2023",
      amount: 850000,
      status: "paid",
      date: "12/09/2023",
      method: "Banking",
    },
    {
      id: "PMT002",
      period: "Tháng 10/2023",
      amount: 850000,
      status: "paid",
      date: "10/10/2023",
      method: "Banking",
    },
    {
      id: "PMT003",
      period: "Tháng 11/2023",
      amount: 850000,
      status: "due",
      dueDate: "15/11/2023",
    },
  ],
};

export default function StudentContract() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <Check className="mr-1 h-3 w-3" /> Đang hiệu lực
          </Badge>
        );
      case "expired":
        return <Badge variant="secondary">Đã hết hạn</Badge>;
      case "terminated":
        return <Badge variant="destructive">Đã chấm dứt</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Hợp đồng KTX</h2>
          <p className="text-muted-foreground">
            Thông tin chi tiết về hợp đồng ký túc xá của bạn
          </p>
        </div>
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>Tải PDF</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Thông tin tổng quan về hợp đồng */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <span>Thông tin hợp đồng</span>
            </CardTitle>
            <CardDescription>Mã hợp đồng: {contractData.id}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Trạng thái:</span>
              {getStatusBadge(contractData.status)}
            </div>

            <Separator className="my-2" />

            <div className="space-y-3">
              <div className="flex items-start">
                <CalendarCheck className="h-4 w-4 text-muted-foreground mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Ngày bắt đầu</p>
                  <p className="text-sm">{contractData.startDate}</p>
                </div>
              </div>

              <div className="flex items-start">
                <CalendarClock className="h-4 w-4 text-muted-foreground mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Ngày kết thúc</p>
                  <p className="text-sm">{contractData.endDate}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Calendar className="h-4 w-4 text-muted-foreground mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Ngày ký</p>
                  <p className="text-sm">{contractData.signDate}</p>
                </div>
              </div>
            </div>

            <Separator className="my-2" />

            <div className="space-y-3">
              <div className="flex items-start">
                <Home className="h-4 w-4 text-muted-foreground mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Phòng ở</p>
                  <p className="text-sm">
                    {contractData.roomId} - {contractData.building} (Giường{" "}
                    {contractData.bedNumber})
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <User className="h-4 w-4 text-muted-foreground mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Người thuê</p>
                  <p className="text-sm">
                    {contractData.studentName} - {contractData.studentId}
                  </p>
                </div>
              </div>
            </div>

            <Separator className="my-2" />

            <div className="space-y-3">
              <div className="flex items-start">
                <Wallet className="h-4 w-4 text-muted-foreground mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Phí hàng tháng</p>
                  <p className="text-sm font-semibold text-primary">
                    {contractData.monthlyFee.toLocaleString("vi-VN")} VNĐ
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Shield className="h-4 w-4 text-muted-foreground mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Tiền đặt cọc</p>
                  <p className="text-sm">
                    {contractData.deposit.toLocaleString("vi-VN")} VNĐ
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Receipt className="h-4 w-4 text-muted-foreground mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Chu kỳ thanh toán</p>
                  <p className="text-sm">
                    {contractData.paymentCycle === "monthly"
                      ? "Hàng tháng"
                      : contractData.paymentCycle === "quarterly"
                      ? "Hàng quý"
                      : "Hàng năm"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4">
            <Button asChild variant="outline">
              <Link to="/student/room">
                <Home className="mr-2 h-4 w-4" />
                Xem thông tin phòng
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Tabs cho điều khoản và lịch sử thanh toán */}
        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="terms" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="terms">
                <FileText className="mr-2 h-4 w-4" />
                Điều khoản hợp đồng
              </TabsTrigger>
              <TabsTrigger value="payments">
                <Receipt className="mr-2 h-4 w-4" />
                Lịch sử thanh toán
              </TabsTrigger>
            </TabsList>

            <TabsContent value="terms" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Các điều khoản chính</CardTitle>
                  <CardDescription>
                    Thông tin chi tiết về các điều khoản trong hợp đồng
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contractData.contractTerms.map((term) => (
                      <div key={term.id} className="border rounded-md p-4">
                        <h4 className="font-semibold flex items-center">
                          <Info className="h-4 w-4 mr-2 text-primary" />
                          {term.title}
                        </h4>
                        <p className="mt-1 text-sm">{term.content}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t p-4">
                  <div className="w-full flex items-center">
                    <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
                    <p className="text-sm text-muted-foreground">
                      Nếu có thắc mắc về điều khoản hợp đồng, vui lòng liên hệ
                      văn phòng KTX
                    </p>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="payments" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Lịch sử thanh toán</CardTitle>
                  <CardDescription>
                    Các khoản thanh toán và tình trạng hóa đơn
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Kỳ thanh toán</TableHead>
                        <TableHead>Số tiền</TableHead>
                        <TableHead>Ngày</TableHead>
                        <TableHead>Trạng thái</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contractData.paymentHistory.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">
                            {payment.period}
                          </TableCell>
                          <TableCell>
                            {payment.amount.toLocaleString("vi-VN")} VNĐ
                          </TableCell>
                          <TableCell>
                            {payment.status === "paid"
                              ? payment.date
                              : payment.dueDate}
                          </TableCell>
                          <TableCell>
                            {payment.status === "paid" ? (
                              <Badge
                                variant="outline"
                                className="bg-green-50 text-green-700 border-green-200"
                              >
                                Đã thanh toán
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="bg-amber-50 text-amber-700 border-amber-200"
                              >
                                Chưa thanh toán
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="border-t p-4 flex justify-between">
                  <p className="text-sm text-muted-foreground">
                    Thanh toán phí KTX trước ngày 15 hàng tháng
                  </p>
                  <Button asChild size="sm">
                    <Link to="/student/payment">Xem tất cả giao dịch</Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Thông tin liên hệ */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>Thông tin liên hệ</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Số điện thoại:</p>
                  <p className="text-sm">{contractData.contactInfo.phone}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Email:</p>
                  <p className="text-sm">{contractData.contactInfo.email}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Liên hệ khẩn cấp:</p>
                <p className="text-sm">
                  {contractData.contactInfo.emergencyContact}
                </p>
              </div>
            </CardContent>
            <CardFooter className="border-t p-4">
              <Button asChild variant="link" className="p-0">
                <Link to="/student/profile">Cập nhật thông tin cá nhân</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
