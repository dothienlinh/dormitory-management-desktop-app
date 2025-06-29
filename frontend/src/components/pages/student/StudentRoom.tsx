import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Activity,
  AlertCircle,
  ArrowUpRight,
  Bed,
  CircleUser,
  Home,
  Info,
  Lightbulb,
  MapPin,
  MessageSquarePlus,
  PiggyBank,
  ReceiptText,
  Shield,
  ShowerHead,
  Wifi,
} from "lucide-react";
import { Link } from "react-router-dom";
import { IssueReportForm } from "../../modules/student/IssueReportForm";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock data
const roomData = {
  id: "A305",
  buildingName: "Tòa nhà A",
  buildingAddress: "Số 123 Đường Nguyễn Văn Cừ, Quận 5, TP. Hồ Chí Minh",
  floor: 3,
  type: "Phòng 4 người",
  capacity: 4,
  area: "25m²",
  price: 850000,
  facilities: [
    { name: "Điều hòa", status: "working", icon: <Lightbulb /> },
    { name: "Quạt trần", status: "working", icon: <Activity /> },
    { name: "Tủ lạnh", status: "working", icon: <ShowerHead /> },
    { name: "Nhà vệ sinh", status: "working", icon: <ShowerHead /> },
    { name: "Internet", status: "working", icon: <Wifi /> },
  ],
  residents: [
    {
      id: "SV123456",
      name: "Nguyễn Văn A",
      major: "Công nghệ thông tin",
      year: "Năm 3",
      bedNumber: "02",
      avatar: "",
    },
    {
      id: "SV234567",
      name: "Trần Văn B",
      major: "Kỹ thuật điện tử",
      year: "Năm 2",
      bedNumber: "01",
      avatar: "",
    },
    {
      id: "SV345678",
      name: "Lê Thị C",
      major: "Kinh tế",
      year: "Năm 4",
      bedNumber: "03",
      avatar: "",
    },
    {
      id: "SV456789",
      name: "Phạm Văn D",
      major: "Kỹ thuật hóa học",
      year: "Năm 2",
      bedNumber: "04",
      avatar: "",
    },
  ],
  rules: [
    "Không hút thuốc trong phòng",
    "Không nấu ăn trong phòng",
    "Giữ im lặng sau 22:00",
    "Không nuôi thú cưng",
    "Không để người ngoài ở qua đêm mà không đăng ký",
    "Giữ vệ sinh phòng ở và khu vực chung",
    "Tiết kiệm điện, nước",
  ],
  recentIssues: [
    {
      id: "ISS001",
      title: "Quạt trần kêu to",
      date: "20/10/2023",
      status: "resolved",
      resolution: "Đã sửa chữa và tra dầu mỡ bôi trơn",
    },
    {
      id: "ISS002",
      title: "Bóng đèn phòng tắm hỏng",
      date: "05/11/2023",
      status: "inProgress",
      resolution: null,
    },
  ],
  cleaningSchedule: [
    { day: "Thứ 2", time: "08:00 - 10:00" },
    { day: "Thứ 5", time: "14:00 - 16:00" },
  ],
};

// Thông tin thanh toán mẫu
const billHistory = [
  {
    id: "BILL001",
    period: "Tháng 10/2023",
    amount: 850000,
    status: "paid",
    date: "28/09/2023",
  },
  {
    id: "BILL002",
    period: "Tháng 11/2023",
    amount: 850000,
    status: "due",
    dueDate: "15/11/2023",
  },
  {
    id: "BILL003",
    period: "Tháng 12/2023",
    amount: 850000,
    status: "upcoming",
    dueDate: "15/12/2023",
  },
];

// Get initials for avatar
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

export default function StudentRoom() {
  const currentUser =
    roomData.residents.find((resident) => resident.id === "SV123456") ||
    roomData.residents[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Thông tin phòng ở
          </h2>
          <p className="text-muted-foreground">
            Chi tiết về phòng ở và bạn cùng phòng
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <MessageSquarePlus className="mr-2 h-4 w-4" />
                Báo cáo sự cố
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Báo cáo sự cố</DialogTitle>
                <DialogDescription>
                  Vui lòng mô tả vấn đề bạn đang gặp phải. Ban quản lý sẽ xử lý
                  trong thời gian sớm nhất.
                </DialogDescription>
              </DialogHeader>
              <IssueReportForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Room Information */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Home className="mr-2 h-5 w-5" /> Phòng {roomData.id}
            </CardTitle>
            <CardDescription>
              {roomData.buildingName} - Tầng {roomData.floor}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Loại phòng
                </span>
                <span className="font-medium">{roomData.type}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Sức chứa</span>
                <span className="font-medium">{roomData.capacity} người</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Diện tích</span>
                <span className="font-medium">{roomData.area}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Giá phòng</span>
                <span className="font-medium text-primary">
                  {roomData.price.toLocaleString("vi-VN")} VNĐ/tháng
                </span>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="text-sm font-medium mb-3">Cơ sở vật chất</h4>
              <div className="grid grid-cols-2 gap-3">
                {roomData.facilities.map((facility, index) => (
                  <div
                    key={index}
                    className="flex items-center p-2 rounded-md bg-secondary/50"
                  >
                    <div className="mr-2">{facility.icon}</div>
                    <span className="text-sm">{facility.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="text-sm font-medium mb-3">Lịch dọn dẹp</h4>
              <div className="space-y-2">
                {roomData.cleaningSchedule.map((schedule, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center text-sm"
                  >
                    <span>{schedule.day}</span>
                    <span>{schedule.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="text-sm font-medium mb-3">Địa chỉ</h4>
              <div className="flex items-start">
                <MapPin className="h-4 w-4 text-muted-foreground mr-2 mt-0.5" />
                <span className="text-sm">{roomData.buildingAddress}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Roommates & More */}
        <div className="md:col-span-2">
          <Tabs defaultValue="roommates" className="w-full space-y-5">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="roommates">
                <CircleUser className="mr-2 h-4 w-4" />
                Bạn cùng phòng
              </TabsTrigger>
              <TabsTrigger value="rules">
                <Shield className="mr-2 h-4 w-4" />
                Nội quy
              </TabsTrigger>
              <TabsTrigger value="issues">
                <AlertCircle className="mr-2 h-4 w-4" />
                Sự cố
              </TabsTrigger>
            </TabsList>

            <TabsContent value="roommates" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin bạn cùng phòng</CardTitle>
                  <CardDescription>
                    Các sinh viên hiện đang ở cùng phòng với bạn
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {roomData.residents.map((resident) => (
                      <Card
                        key={resident.id}
                        className={
                          resident.id === currentUser.id ? "border-primary" : ""
                        }
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarImage src={resident.avatar} />
                              <AvatarFallback className="bg-primary text-primary-foreground">
                                {getInitials(resident.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center">
                                <p className="text-sm font-medium leading-none">
                                  {resident.name}
                                </p>
                                {resident.id === currentUser.id && (
                                  <Badge variant="outline" className="ml-2">
                                    Bạn
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {resident.major}, {resident.year}
                              </p>
                              <div className="flex items-center">
                                <Bed className="mr-1 h-3 w-3 text-muted-foreground" />
                                <span className="text-xs">
                                  Giường {resident.bedNumber}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <p className="text-xs text-muted-foreground">
                    Lưu ý: Nếu có vấn đề với bạn cùng phòng, vui lòng báo cáo
                    với Ban quản lý KTX
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="rules">
              <Card>
                <CardHeader>
                  <CardTitle>Nội quy phòng ở</CardTitle>
                  <CardDescription>
                    Các quy định cần tuân thủ khi ở tại KTX
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px] pr-4">
                    <ul className="space-y-3">
                      {roomData.rules.map((rule, index) => (
                        <li key={index} className="flex items-start">
                          <Shield className="h-5 w-5 text-primary mr-2 mt-0.5 shrink-0" />
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <p className="text-xs text-muted-foreground">
                    Vi phạm nội quy có thể bị xử lý kỷ luật theo quy định của
                    KTX
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="issues">
              <Card>
                <CardHeader>
                  <CardTitle>Sự cố và yêu cầu sửa chữa</CardTitle>
                  <CardDescription>
                    Lịch sử các sự cố và trạng thái xử lý
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {roomData.recentIssues.length > 0 ? (
                    <div className="space-y-4">
                      {roomData.recentIssues.map((issue) => (
                        <div
                          key={issue.id}
                          className="border rounded-md p-4 shadow-sm"
                        >
                          <div className="flex justify-between">
                            <h4 className="font-medium">{issue.title}</h4>
                            <Badge
                              variant={
                                issue.status === "resolved"
                                  ? "default"
                                  : issue.status === "inProgress"
                                  ? "outline"
                                  : "secondary"
                              }
                            >
                              {issue.status === "resolved"
                                ? "Đã xử lý"
                                : issue.status === "inProgress"
                                ? "Đang xử lý"
                                : "Chưa xử lý"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Báo cáo ngày: {issue.date}
                          </p>
                          {issue.resolution && (
                            <div className="mt-2 text-sm bg-secondary/50 p-2 rounded-md">
                              <span className="font-medium">
                                Kết quả xử lý:{" "}
                              </span>
                              {issue.resolution}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Info className="h-12 w-12 text-muted-foreground mx-auto" />
                      <h3 className="mt-2 font-medium">Không có sự cố nào</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Phòng của bạn hiện không có sự cố nào được báo cáo
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between border-t px-6 py-4">
                  <p className="text-xs text-muted-foreground">
                    Sử dụng nút "Báo cáo sự cố" để thông báo vấn đề mới
                  </p>
                  <Button variant="link" size="sm" className="h-auto p-0">
                    <ArrowUpRight className="mr-1 h-3 w-3" />
                    Xem tất cả
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Payment Information */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ReceiptText className="mr-2 h-5 w-5" />
                Thanh toán phí phòng
              </CardTitle>
              <CardDescription>
                Lịch sử và tình trạng thanh toán
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {billHistory.map((bill) => (
                  <div
                    key={bill.id}
                    className="border rounded-md p-4 shadow-sm flex justify-between items-center"
                  >
                    <div>
                      <h4 className="font-medium">{bill.period}</h4>
                      <p className="text-sm text-muted-foreground">
                        {bill.status === "paid"
                          ? `Đã thanh toán ngày ${bill.date}`
                          : bill.status === "due"
                          ? `Hạn thanh toán: ${bill.dueDate}`
                          : `Sẽ đến hạn vào: ${bill.dueDate}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium">
                        {bill.amount.toLocaleString("vi-VN")} VNĐ
                      </span>
                      {bill.status === "paid" ? (
                        <Badge>Đã thanh toán</Badge>
                      ) : bill.status === "due" ? (
                        <Button asChild size="sm">
                          <Link to="/student/payment">Thanh toán</Link>
                        </Button>
                      ) : (
                        <Badge variant="secondary">Sắp tới</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <div className="w-full flex justify-between items-center">
                <div className="flex items-center">
                  <PiggyBank className="h-5 w-5 text-primary mr-2" />
                  <p className="text-sm font-medium">
                    Xem lịch sử giao dịch đầy đủ
                  </p>
                </div>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/student/payment">
                    <ArrowUpRight className="mr-1 h-4 w-4" />
                    Xem chi tiết
                  </Link>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
