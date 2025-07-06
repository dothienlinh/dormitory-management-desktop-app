import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Service = {
  id: number;
  name: string;
  description: string;
  price: number;
  unit: string;
  provider: string;
  available: boolean;
  subscriptions: number;
};

type ServiceStatsProps = {
  services: Service[];
};

export default function ServiceStats({ services }: ServiceStatsProps) {
  // Sort services by subscriptions in descending order and get top 4
  const topServices = [...services]
    .sort((a, b) => b.subscriptions - a.subscriptions)
    .slice(0, 4);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thống kê đăng ký dịch vụ</CardTitle>
        <CardDescription>
          Tổng quan về các dịch vụ được đăng ký nhiều nhất
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {topServices.map((service) => (
            <Card key={service.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {service.name}
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {service.subscriptions}
                </div>
                <p className="text-xs text-muted-foreground">
                  {service.price.toLocaleString("vi-VN")} VNĐ/{service.unit}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
