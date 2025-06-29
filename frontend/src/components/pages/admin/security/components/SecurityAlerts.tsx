import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, AlertTriangle, ShieldAlert } from "lucide-react";

interface SecurityAlert {
  id: number;
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
  dateCreated: string;
  expiryDate: string;
  isActive: boolean;
}

interface SecurityAlertsProps {
  alerts: SecurityAlert[];
}

// Get severity text in Vietnamese
const getSeverityText = (severity: string) => {
  switch (severity) {
    case "low":
      return "Thấp";
    case "medium":
      return "Trung bình";
    case "high":
      return "Cao";
    default:
      return severity;
  }
};

// Get severity color for badges
const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "low":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "medium":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "high":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    default:
      return "";
  }
};

// Format date and time
const formatDateTime = (dateString: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleString("vi-VN");
};

export default function SecurityAlerts({ alerts }: SecurityAlertsProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter alerts based on search
  const filteredAlerts = alerts.filter(
    (alert) =>
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Cảnh báo an ninh</CardTitle>
          <CardDescription>
            Quản lý các cảnh báo an ninh và thông báo quan trọng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex w-full items-center space-x-2 md:w-1/3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm cảnh báo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-4">
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert) => (
                <Card key={alert.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{alert.title}</CardTitle>
                      <Badge
                        variant="outline"
                        className={getSeverityColor(alert.severity)}
                      >
                        {getSeverityText(alert.severity)}
                      </Badge>
                    </div>
                    <CardDescription>
                      Tạo lúc: {formatDateTime(alert.dateCreated)} - Hết hạn:{" "}
                      {formatDateTime(alert.expiryDate)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{alert.description}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="mt-8 text-center text-muted-foreground">
                Không tìm thấy cảnh báo nào
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng cảnh báo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Cảnh báo đang hoạt động
            </CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {alerts.filter((alert) => alert.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Cảnh báo mức độ cao
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                alerts.filter(
                  (alert) => alert.severity === "high" && alert.isActive
                ).length
              }
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
