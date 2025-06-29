import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DoorOpen,
  Users,
  FileText,
  Receipt,
  Wrench,
  ShieldAlert,
} from "lucide-react";

const stats = [
  {
    title: "Phòng",
    value: "120",
    description: "Phòng đã sử dụng: 98",
    icon: DoorOpen,
    color: "bg-blue-100",
    textColor: "text-blue-700",
  },
  {
    title: "Sinh viên",
    value: "450",
    description: "Nam: 250, Nữ: 200",
    icon: Users,
    color: "bg-green-100",
    textColor: "text-green-700",
  },
  {
    title: "Hợp đồng",
    value: "420",
    description: "Hoạt động: 400",
    icon: FileText,
    color: "bg-yellow-100",
    textColor: "text-yellow-700",
  },
  {
    title: "Tài chính",
    value: "15M VND",
    description: "Chưa thanh toán: 2M",
    icon: Receipt,
    color: "bg-purple-100",
    textColor: "text-purple-700",
  },
  {
    title: "Dịch vụ",
    value: "25",
    description: "Đang xử lý: 8",
    icon: Wrench,
    color: "bg-pink-100",
    textColor: "text-pink-700",
  },
  {
    title: "An ninh",
    value: "5",
    description: "Sự cố gần đây",
    icon: ShieldAlert,
    color: "bg-red-100",
    textColor: "text-red-700",
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Tổng quan</h2>
        <p className="text-muted-foreground">
          Xem tổng quan về hoạt động của ký túc xá
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`${stat.color} rounded-full p-2`}>
                <stat.icon className={`h-4 w-4 ${stat.textColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Thông báo gần đây</CardTitle>
            <CardDescription>
              Các thông báo và hoạt động trong 7 ngày qua
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-lg border p-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Users className="h-4 w-4 text-blue-700" />
                </div>
                <div>
                  <p className="font-medium">Sinh viên mới đăng ký</p>
                  <p className="text-sm text-muted-foreground">
                    5 sinh viên đã đăng ký trong tuần này
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-lg border p-3">
                <div className="bg-yellow-100 p-2 rounded-full">
                  <FileText className="h-4 w-4 text-yellow-700" />
                </div>
                <div>
                  <p className="font-medium">Hợp đồng sắp hết hạn</p>
                  <p className="text-sm text-muted-foreground">
                    10 hợp đồng sẽ hết hạn trong 30 ngày tới
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-lg border p-3">
                <div className="bg-red-100 p-2 rounded-full">
                  <Receipt className="h-4 w-4 text-red-700" />
                </div>
                <div>
                  <p className="font-medium">Thanh toán quá hạn</p>
                  <p className="text-sm text-muted-foreground">
                    8 sinh viên chưa thanh toán đúng hạn
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tình trạng phòng</CardTitle>
            <CardDescription>Phân bổ và tình trạng các phòng</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Đã thuê</span>
                <span className="font-medium">98/120</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-full"
                  style={{ width: "82%" }}
                ></div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="rounded-lg border p-3">
                  <div className="text-sm text-muted-foreground">
                    Phòng trống
                  </div>
                  <div className="text-2xl font-bold">22</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-sm text-muted-foreground">
                    Đang bảo trì
                  </div>
                  <div className="text-2xl font-bold">5</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
