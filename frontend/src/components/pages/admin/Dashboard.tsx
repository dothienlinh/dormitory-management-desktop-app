import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Users,
  AlertCircle,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  DoorOpen,
  Clock,
  Activity,
  UserCheck,
  Building,
  CircleDollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

// Dữ liệu mẫu cho các biểu đồ
const monthlyData = [
  { name: "Tháng 1", value: 23 },
  { name: "Tháng 2", value: 25 },
  { name: "Tháng 3", value: 35 },
  { name: "Tháng 4", value: 30 },
  { name: "Tháng 5", value: 40 },
  { name: "Tháng 6", value: 38 },
];

const occupancyData = [
  { name: "Đã thuê", value: 85, color: "#2563eb" },
  { name: "Còn trống", value: 15, color: "#e5e7eb" },
];

const revenueData = [
  { name: "Tiền phòng", value: 75, color: "#16a34a" },
  { name: "Dịch vụ", value: 15, color: "#f97316" },
  { name: "Khác", value: 10, color: "#a855f7" },
];

const recentStudents = [
  {
    name: "Nguyễn Văn A",
    room: "P101",
    checkIn: "2023-06-15",
    status: "active",
  },
  { name: "Trần Thị B", room: "P205", checkIn: "2023-06-12", status: "active" },
  { name: "Lê Văn C", room: "P302", checkIn: "2023-06-10", status: "pending" },
  { name: "Phạm Thị D", room: "P110", checkIn: "2023-06-08", status: "active" },
  {
    name: "Hoàng Văn E",
    room: "P404",
    checkIn: "2023-06-05",
    status: "inactive",
  },
];

const notifications = [
  {
    id: 1,
    title: "Hợp đồng sắp hết hạn",
    description: "5 hợp đồng sẽ hết hạn trong tuần tới",
    time: "2 giờ trước",
    type: "warning",
  },
  {
    id: 2,
    title: "Sinh viên mới đăng ký",
    description: "3 sinh viên mới đăng ký phòng",
    time: "4 giờ trước",
    type: "info",
  },
  {
    id: 3,
    title: "Vấn đề cơ sở vật chất",
    description: "Báo cáo sự cố ở khu vực A",
    time: "hôm qua",
    type: "error",
  },
  {
    id: 4,
    title: "Thanh toán hoàn tất",
    description: "12 thanh toán đã được xử lý",
    time: "hôm qua",
    type: "success",
  },
];

export default function Dashboard() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "inactive":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "info":
        return <Users className="h-5 w-5 text-blue-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "success":
        return <Activity className="h-5 w-5 text-green-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Chuyển đổi ngày
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tổng quan</h2>
          <p className="text-muted-foreground">
            Xem tổng quan về hoạt động của ký túc xá
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <Button variant="outline" size="sm">
            Xuất báo cáo
          </Button>
          <Button size="sm">Xem chi tiết</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Tổng phòng
                </p>
                <p className="text-2xl font-bold">120</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Building className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-3 flex items-center text-sm text-muted-foreground">
              <p>
                Còn trống:{" "}
                <span className="font-medium text-green-600 dark:text-green-500">
                  22
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Sinh viên
                </p>
                <p className="text-2xl font-bold">450</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center dark:bg-orange-900/30">
                <UserCheck className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <div className="mt-3 flex items-center text-sm text-green-600 dark:text-green-500">
              <ArrowUp className="mr-1 h-4 w-4" />
              <span>5% so với tháng trước</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Hợp đồng
                </p>
                <p className="text-2xl font-bold">420</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center dark:bg-blue-900/30">
                <DoorOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-3 flex items-center text-sm text-yellow-600 dark:text-yellow-500">
              <Clock className="mr-1 h-4 w-4" />
              <span>10 hợp đồng sắp hết hạn</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Doanh thu tháng
                </p>
                <p className="text-2xl font-bold">15.000.000đ</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center dark:bg-green-900/30">
                <CircleDollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-3 flex items-center text-sm text-red-600 dark:text-red-500">
              <ArrowDown className="mr-1 h-4 w-4" />
              <span>2% so với tháng trước</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-auto">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="occupancy">Tình trạng phòng</TabsTrigger>
          <TabsTrigger value="finances">Tài chính</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-1 md:col-span-1 lg:col-span-4">
              <CardHeader>
                <CardTitle>Sinh viên theo tháng</CardTitle>
                <CardDescription>
                  Số lượng sinh viên đăng ký theo tháng
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={monthlyData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="value"
                      fill="var(--primary)"
                      barSize={40}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="col-span-1 md:col-span-1 lg:col-span-3">
              <CardHeader>
                <CardTitle>Công suất phòng</CardTitle>
                <CardDescription>
                  Tỷ lệ phòng đã thuê so với tổng số phòng
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={occupancyData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {occupancyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Tỷ lệ lấp đầy</span>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                  <Progress value={85} className="mt-2 h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            <Card className="col-span-1 md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle>Sinh viên mới nhất</CardTitle>
                <CardDescription>
                  Danh sách sinh viên mới đăng ký gần đây
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-0">
                  <div className="rounded-md border">
                    <div className="grid grid-cols-5 p-3 text-sm font-medium text-muted-foreground">
                      <div className="col-span-2">Sinh viên</div>
                      <div>Phòng</div>
                      <div>Ngày đăng ký</div>
                      <div>Trạng thái</div>
                    </div>
                    <div className="divide-y">
                      {recentStudents.map((student, i) => (
                        <div
                          key={i}
                          className="grid grid-cols-5 items-center p-3"
                        >
                          <div className="col-span-2 flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {getInitials(student.name)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{student.name}</span>
                          </div>
                          <div>{student.room}</div>
                          <div>{formatDate(student.checkIn)}</div>
                          <div>
                            <Badge
                              variant="outline"
                              className={getStatusColor(student.status)}
                            >
                              {student.status === "active"
                                ? "Đã duyệt"
                                : student.status === "pending"
                                ? "Chờ duyệt"
                                : "Không hoạt động"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="ml-auto">
                  Xem tất cả
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Thông báo gần đây</CardTitle>
                <CardDescription>
                  Các thông báo và hoạt động trong 7 ngày qua
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[280px] pr-4">
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="flex gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {notification.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {notification.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter>
                <Button size="sm" variant="outline" className="w-full">
                  Xem tất cả thông báo
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="occupancy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin về tình trạng phòng</CardTitle>
              <CardDescription>
                Phân bố và tình trạng các phòng trong ký túc xá
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Phân bố phòng theo tầng
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Tầng 1</span>
                        <span className="text-sm font-medium">90%</span>
                      </div>
                      <Progress value={90} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Tầng 2</span>
                        <span className="text-sm font-medium">85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Tầng 3</span>
                        <span className="text-sm font-medium">75%</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Tầng 4</span>
                        <span className="text-sm font-medium">95%</span>
                      </div>
                      <Progress value={95} className="h-2" />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Thống kê phòng</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">
                            Đã thuê
                          </p>
                          <p className="text-2xl font-bold text-green-600 dark:text-green-500">
                            98
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">
                            Còn trống
                          </p>
                          <p className="text-2xl font-bold text-blue-600 dark:text-blue-500">
                            22
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">
                            Đang bảo trì
                          </p>
                          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-500">
                            5
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">
                            Đặt trước
                          </p>
                          <p className="text-2xl font-bold text-purple-600 dark:text-purple-500">
                            8
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finances" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin tài chính</CardTitle>
              <CardDescription>
                Phân tích doanh thu và chi phí của ký túc xá
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                <div className="col-span-1 md:col-span-2">
                  <h3 className="text-lg font-semibold mb-4">
                    Doanh thu theo thời gian
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart
                      data={monthlyData}
                      margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        name="Doanh thu (triệu đồng)"
                        dataKey="value"
                        fill="var(--primary)"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="md:col-span-1">
                  <h3 className="text-lg font-semibold mb-4">
                    Phân bố doanh thu
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={revenueData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {revenueData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        Thanh toán đúng hạn
                      </p>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-500">
                        92%
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        Thanh toán trễ hạn
                      </p>
                      <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-500">
                        6%
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        Chưa thanh toán
                      </p>
                      <p className="text-2xl font-bold text-red-600 dark:text-red-500">
                        2%
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
