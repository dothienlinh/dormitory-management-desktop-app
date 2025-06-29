import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
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
  Search,
  Filter,
  AlertTriangle,
  ShieldAlert,
  UserCheck,
  Clock,
} from "lucide-react";
import IncidentDetailsModal from "../modals/IncidentDetailsModal";

interface SecurityIncident {
  id: string;
  title: string;
  description: string;
  type: string;
  status: "pending" | "investigating" | "resolved";
  severity: "low" | "medium" | "high";
  reportDate: string;
  location: string;
  reportedBy: string;
  involvedStudents: { id: string; name: string }[];
}

interface SecurityIncidentsProps {
  incidents: SecurityIncident[];
}

// Get status text in Vietnamese
const getStatusText = (status: string) => {
  switch (status) {
    case "pending":
      return "Chờ xử lý";
    case "investigating":
      return "Đang điều tra";
    case "resolved":
      return "Đã giải quyết";
    default:
      return status;
  }
};

// Get status color for badges
const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "investigating":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "resolved":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    default:
      return "";
  }
};

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

// Get incident type text in Vietnamese
const getIncidentTypeText = (type: string) => {
  switch (type) {
    case "curfew":
      return "Vi phạm giờ giới nghiêm";
    case "theft":
      return "Trộm cắp";
    case "noise":
      return "Gây ồn ào";
    case "fire_hazard":
      return "Nguy cơ cháy nổ";
    case "trespassing":
      return "Xâm nhập trái phép";
    case "rule_violation":
      return "Vi phạm nội quy";
    default:
      return type;
  }
};

// Format date and time
const formatDateTime = (dateString: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleString("vi-VN");
};

export default function SecurityIncidents({
  incidents,
}: SecurityIncidentsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [incidentTypeFilter, setIncidentTypeFilter] = useState("all");
  const [selectedIncident, setSelectedIncident] =
    useState<SecurityIncident | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Filter incidents based on search and filters
  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch =
      incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || incident.status === statusFilter;
    const matchesSeverity =
      severityFilter === "all" || incident.severity === severityFilter;
    const matchesType =
      incidentTypeFilter === "all" || incident.type === incidentTypeFilter;

    return matchesSearch && matchesStatus && matchesSeverity && matchesType;
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Sự cố an ninh</CardTitle>
          <CardDescription>
            Quản lý và theo dõi các sự cố an ninh trong ký túc xá
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col space-y-3 md:flex-row md:items-center md:space-x-4 md:space-y-0">
            <div className="flex w-full items-center space-x-2 md:w-1/3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm sự cố..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Filter className="h-4 w-4 text-muted-foreground" />

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="pending">Chờ xử lý</SelectItem>
                  <SelectItem value="investigating">Đang điều tra</SelectItem>
                  <SelectItem value="resolved">Đã giải quyết</SelectItem>
                </SelectContent>
              </Select>

              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Mức độ nghiêm trọng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="low">Thấp</SelectItem>
                  <SelectItem value="medium">Trung bình</SelectItem>
                  <SelectItem value="high">Cao</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={incidentTypeFilter}
                onValueChange={setIncidentTypeFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Loại sự cố" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="curfew">
                    Vi phạm giờ giới nghiêm
                  </SelectItem>
                  <SelectItem value="theft">Trộm cắp</SelectItem>
                  <SelectItem value="noise">Gây ồn ào</SelectItem>
                  <SelectItem value="fire_hazard">Nguy cơ cháy nổ</SelectItem>
                  <SelectItem value="trespassing">
                    Xâm nhập trái phép
                  </SelectItem>
                  <SelectItem value="rule_violation">
                    Vi phạm nội quy
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã sự cố</TableHead>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Loại sự cố</TableHead>
                  <TableHead>Địa điểm</TableHead>
                  <TableHead>Thời gian báo cáo</TableHead>
                  <TableHead>Mức độ</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIncidents.length > 0 ? (
                  filteredIncidents.map((incident) => (
                    <TableRow key={incident.id}>
                      <TableCell className="font-medium">
                        {incident.id}
                      </TableCell>
                      <TableCell>{incident.title}</TableCell>
                      <TableCell>
                        {getIncidentTypeText(incident.type)}
                      </TableCell>
                      <TableCell>{incident.location}</TableCell>
                      <TableCell>
                        {formatDateTime(incident.reportDate)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getSeverityColor(incident.severity)}
                        >
                          {getSeverityText(incident.severity)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getStatusColor(incident.status)}
                        >
                          {getStatusText(incident.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedIncident(incident);
                            setShowDetailsModal(true);
                          }}
                        >
                          Chi tiết
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      Không tìm thấy kết quả nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số sự cố</CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{incidents.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang xử lý</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {incidents.filter((inc) => inc.status !== "resolved").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Mức độ nghiêm trọng cao
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {incidents.filter((inc) => inc.severity === "high").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã giải quyết</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {incidents.filter((inc) => inc.status === "resolved").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(
                (incidents.filter((inc) => inc.status === "resolved").length /
                  incidents.length) *
                  100
              )}
              % tổng số
            </p>
          </CardContent>
        </Card>
      </div>

      <IncidentDetailsModal
        incident={selectedIncident}
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
      />
    </div>
  );
}
