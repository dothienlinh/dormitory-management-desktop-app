import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Bell,
  CalendarDays,
  Clock,
  HomeIcon,
  ShieldCheck,
  AlertCircle,
  Receipt,
  FileText,
  Users,
  CalendarClock,
  CheckCircle2,
  Info,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function StudentDashboard() {
  const user = useSelector((state: RootState) => state.auth.user);

  // Mock data cho thông tin sinh viên
  const studentInfo = {
    id: "SV123456",
    room: "A304",
    roomStatus: "active",
    contract: {
      id: "HD202303-125",
      startDate: "2023-09-01",
      endDate: "2024-06-30",
      remainingDays: 120,
    },
    payment: {
      nextDue: "2023-12-25",
      amount: "2,500,000 VND",
      remainingDays: 5,
    },
    roommates: [
      { name: "Nguyễn Văn A", id: "SV123457" },
      { name: "Trần Văn B", id: "SV123458" },
      { name: "Lê Thị C", id: "SV123459" },
    ],
    notifications: [
      {
        title: "Thanh toán sắp đến hạn",
        time: "Còn 5 ngày",
        type: "warning",
      },
      {
        title: "Thông báo bảo trì khu A",
        time: "Hôm qua",
        type: "info",
      },
    ],
    requests: [
      {
        title: "Sửa bóng đèn phòng ngủ",
        status: "approved",
        date: "22/11/2023",
      },
      {
        title: "Sửa vòi nước nhà vệ sinh",
        status: "pending",
        date: "24/11/2023",
      },
    ],
    events: [
      {
        title: "Hội thảo kỹ năng sống",
        time: "16:00, 27/11/2023",
        location: "Hội trường A",
      },
      {
        title: "Giao lưu sinh viên quốc tế",
        time: "18:00, 30/11/2023",
        location: "Sân vận động KTX",
      },
    ],
  };

  // Format ngày
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  // Notification icon
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "info":
        return <Bell className="h-5 w-5 text-blue-500" />;
      case "success":
        return <ShieldCheck className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  // Tính % thời gian còn lại của hợp đồng
  const calculateContractProgress = () => {
    const startDate = new Date(studentInfo.contract.startDate);
    const endDate = new Date(studentInfo.contract.endDate);
    const today = new Date();
    const totalDays =
      (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
    const daysElapsed =
      (today.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
    return Math.min(
      100,
      Math.max(0, Math.round((daysElapsed / totalDays) * 100))
    );
  };

  // Thông báo mẫu
  const notifications = [
    {
      id: 1,
      title: "Thông báo thanh toán phí KTX tháng 11/2023",
      date: "01/11/2023",
      read: false,
      type: "payment",
    },
    {
      id: 2,
      title: "Thông báo bảo trì hệ thống điện tại Tòa A",
      date: "29/10/2023",
      read: true,
      type: "maintenance",
    },
    {
      id: 3,
      title: "Kế hoạch hoạt động văn nghệ chào mừng 20/11",
      date: "25/10/2023",
      read: true,
      type: "event",
    },
    {
      id: 4,
      title: "Yêu cầu sửa chữa #123 đã được xử lý",
      date: "20/10/2023",
      read: true,
      type: "service",
    },
  ];

  // Sự kiện mẫu
  const events = [
    {
      id: 1,
      title: "Hạn thanh toán tiền phòng",
      date: "15/11/2023",
      time: "23:59",
      type: "deadline",
    },
    {
      id: 2,
      title: "Bảo trì hệ thống nước",
      date: "12/11/2023",
      time: "08:00 - 12:00",
      type: "maintenance",
    },
    {
      id: 3,
      title: "Hoạt động văn nghệ tại sân KTX",
      date: "20/11/2023",
      time: "19:00 - 21:00",
      type: "event",
    },
  ];

  // Function để lấy style dựa trên loại thông báo
  const getNotificationStyles = (type: string) => {
    switch (type) {
      case "payment":
        return {
          icon: <Receipt className="h-5 w-5" />,
          color: "text-blue-500",
          bg: "bg-blue-100",
        };
      case "maintenance":
        return {
          icon: <AlertCircle className="h-5 w-5" />,
          color: "text-yellow-500",
          bg: "bg-yellow-100",
        };
      case "event":
        return {
          icon: <CalendarClock className="h-5 w-5" />,
          color: "text-purple-500",
          bg: "bg-purple-100",
        };
      case "service":
        return {
          icon: <CheckCircle2 className="h-5 w-5" />,
          color: "text-green-500",
          bg: "bg-green-100",
        };
      default:
        return {
          icon: <Info className="h-5 w-5" />,
          color: "text-gray-500",
          bg: "bg-gray-100",
        };
    }
  };

  const getEventStyles = (type: string) => {
    switch (type) {
      case "deadline":
        return {
          icon: <AlertCircle className="h-5 w-5" />,
          color: "text-red-500",
          bg: "bg-red-100",
        };
      case "maintenance":
        return {
          icon: <AlertCircle className="h-5 w-5" />,
          color: "text-yellow-500",
          bg: "bg-yellow-100",
        };
      case "event":
        return {
          icon: <CalendarClock className="h-5 w-5" />,
          color: "text-purple-500",
          bg: "bg-purple-100",
        };
      default:
        return {
          icon: <Info className="h-5 w-5" />,
          color: "text-gray-500",
          bg: "bg-gray-100",
        };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Xin chào, {user?.full_name}!
          </h2>
          <p className="text-muted-foreground">
            Chào mừng bạn đến với Cổng thông tin sinh viên KTX
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <Button variant="outline" size="sm">
            <Bell className="mr-2 h-4 w-4" />
            Thông báo ({studentInfo.notifications.length})
          </Button>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Mã sinh viên
                </p>
                <p className="text-xl font-bold">{studentInfo.id}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Phòng ở
                </p>
                <p className="text-xl font-bold">{studentInfo.room}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center dark:bg-blue-900/30">
                <HomeIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-3 flex items-center text-sm">
              <Badge
                variant="secondary"
                className="text-green-600 dark:text-green-500"
              >
                Đang hoạt động
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Hạn hợp đồng
                </p>
                <p className="text-xl font-bold">
                  {formatDate(studentInfo.contract.endDate)}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center dark:bg-purple-900/30">
                <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="mt-3 flex items-center text-sm text-muted-foreground">
              <Clock className="mr-1 h-4 w-4" />
              <span>Còn {studentInfo.contract.remainingDays} ngày</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Thanh toán tiếp theo
                </p>
                <p className="text-xl font-bold">
                  {studentInfo.payment.amount}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center dark:bg-orange-900/30">
                <Receipt className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <div className="mt-3 flex items-center text-sm text-yellow-600 dark:text-yellow-500">
              <AlertCircle className="mr-1 h-4 w-4" />
              <span>Hạn chót: {studentInfo.payment.nextDue}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main content */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Contract info */}
        <Card className="col-span-1 lg:col-span-1">
          <CardHeader>
            <CardTitle>Thông tin hợp đồng</CardTitle>
            <CardDescription>
              Chi tiết và thời hạn hợp đồng KTX của bạn
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Mã hợp đồng:</span>
                <span className="font-medium">{studentInfo.contract.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Ngày bắt đầu:</span>
                <span className="font-medium">
                  {formatDate(studentInfo.contract.startDate)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Ngày hết hạn:</span>
                <span className="font-medium">
                  {formatDate(studentInfo.contract.endDate)}
                </span>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Tiến độ hợp đồng</span>
                <span className="text-sm font-medium">
                  {calculateContractProgress()}%
                </span>
              </div>
              <Progress value={calculateContractProgress()} className="h-2" />
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link to="/student/contract">
                Xem chi tiết hợp đồng
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Roommates */}
        <Card className="col-span-1 lg:col-span-1">
          <CardHeader>
            <CardTitle>Bạn cùng phòng</CardTitle>
            <CardDescription>
              Danh sách sinh viên cùng phòng với bạn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {studentInfo.roommates.map((roommate, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(roommate.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{roommate.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {roommate.id}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link to="/student/room">
                Chi tiết phòng ở
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Service requests */}
        <Card className="col-span-1 lg:col-span-1">
          <CardHeader>
            <CardTitle>Yêu cầu dịch vụ</CardTitle>
            <CardDescription>
              Yêu cầu sửa chữa và dịch vụ của bạn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {studentInfo.requests.map((request, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{request.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Ngày yêu cầu: {request.date}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={getStatusColor(request.status)}
                  >
                    {request.status === "approved"
                      ? "Đã duyệt"
                      : request.status === "pending"
                      ? "Đang xử lý"
                      : "Từ chối"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link to="/student/requests">
                Tạo yêu cầu mới
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Additional sections */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Thông báo gần đây</CardTitle>
            <CardDescription>
              Thông báo từ ban quản lý ký túc xá
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {studentInfo.notifications.map((notification, i) => (
                <div key={i} className="flex gap-3 rounded-lg border p-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {notification.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link to="/student/announcements">
                Xem tất cả thông báo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Events */}
        <Card>
          <CardHeader>
            <CardTitle>Sự kiện sắp tới</CardTitle>
            <CardDescription>
              Các sự kiện và hoạt động gần đây trong KTX
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {studentInfo.events.map((event, i) => (
                <div key={i} className="flex gap-3 rounded-lg border p-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <CalendarDays className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {event.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {event.time}
                    </p>
                    <p className="text-xs font-medium">{event.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">
              Xem tất cả sự kiện
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Quick actions */}
      <Card>
        <CardHeader>
          <CardTitle>Thao tác nhanh</CardTitle>
          <CardDescription>
            Các tác vụ thường dùng cho sinh viên
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-auto flex flex-col p-4 items-center justify-center gap-2"
              asChild
            >
              <Link to="/student/payment">
                <Receipt className="h-6 w-6" />
                <span className="text-sm">Thanh toán</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex flex-col p-4 items-center justify-center gap-2"
              asChild
            >
              <Link to="/student/requests">
                <Users className="h-6 w-6" />
                <span className="text-sm">Yêu cầu dịch vụ</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex flex-col p-4 items-center justify-center gap-2"
              asChild
            >
              <Link to="/student/room">
                <HomeIcon className="h-6 w-6" />
                <span className="text-sm">Phòng ở</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex flex-col p-4 items-center justify-center gap-2"
              asChild
            >
              <Link to="/student/profile">
                <Users className="h-6 w-6" />
                <span className="text-sm">Thông tin cá nhân</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Thông báo & Sự kiện */}
      <Card className="md:col-span-3">
        <CardHeader>
          <CardTitle>Thông báo & Sự kiện sắp tới</CardTitle>
          <CardDescription>
            Cập nhật các thông tin mới nhất và lịch sắp tới
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="notifications" className="w-full">
            <TabsList className="grid w-full md:w-[400px] grid-cols-2">
              <TabsTrigger value="notifications">
                <Bell className="mr-2 h-4 w-4" />
                Thông báo mới
              </TabsTrigger>
              <TabsTrigger value="events">
                <CalendarClock className="mr-2 h-4 w-4" />
                Sự kiện sắp tới
              </TabsTrigger>
            </TabsList>

            <TabsContent value="notifications" className="pt-4">
              <div className="space-y-4">
                {notifications.map((notification) => {
                  const style = getNotificationStyles(notification.type);
                  return (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg flex items-start gap-3 ${
                        notification.read ? "" : "border-l-4 border-primary"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-full ${style.bg} ${style.color}`}
                      >
                        {style.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4
                            className={`font-medium ${
                              notification.read ? "" : "font-semibold"
                            }`}
                          >
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <Badge variant="outline" className="ml-2">
                              Mới
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.date}
                        </p>
                      </div>
                    </div>
                  );
                })}

                <div className="text-center pt-2">
                  <Button variant="link">Xem tất cả thông báo</Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="events" className="pt-4">
              <div className="space-y-4">
                {events.map((event) => {
                  const style = getEventStyles(event.type);
                  return (
                    <div
                      key={event.id}
                      className="p-3 rounded-lg shadow-sm border flex items-start gap-3"
                    >
                      <div
                        className={`p-2 rounded-full ${style.bg} ${style.color}`}
                      >
                        {style.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{event.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <CalendarClock className="h-3 w-3" />
                          <span>{event.date}</span>
                          <span>•</span>
                          <span>{event.time}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="text-center pt-2">
                  <Button variant="link">Xem lịch đầy đủ</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
