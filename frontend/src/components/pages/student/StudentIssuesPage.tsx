import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Filter,
  Info,
  Lightbulb,
  MessageSquarePlus,
  Search,
  Settings,
  SlidersHorizontal,
  Timer,
  X,
} from "lucide-react";
import { IssueReportForm } from "../../modules/student/IssueReportForm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Dữ liệu mẫu
const issuesData = {
  issues: [
    {
      id: "ISS001",
      title: "Quạt trần kêu to",
      category: "facilities",
      roomId: "A305",
      description: "Quạt trần phát ra tiếng kêu to khi hoạt động ở tốc độ cao.",
      status: "resolved",
      priority: "medium",
      createdAt: "20/10/2023",
      resolvedAt: "23/10/2023",
      response: "Đã sửa chữa và tra dầu mỡ bôi trơn.",
      feedback: "Cảm ơn, quạt đã hoạt động tốt.",
    },
    {
      id: "ISS002",
      title: "Bóng đèn phòng tắm hỏng",
      category: "electrical",
      roomId: "A305",
      description: "Bóng đèn trong phòng tắm không hoạt động khi bật công tắc.",
      status: "inProgress",
      priority: "high",
      createdAt: "05/11/2023",
      assignedTo: "Kỹ thuật viên điện",
      expectedResolution: "07/11/2023",
    },
    {
      id: "ISS003",
      title: "Internet không ổn định",
      category: "internet",
      roomId: "A305",
      description:
        "Kết nối internet thường xuyên bị ngắt vào buổi tối từ 20:00 - 22:00.",
      status: "pending",
      priority: "high",
      createdAt: "01/11/2023",
    },
    {
      id: "ISS004",
      title: "Bồn cầu bị rò rỉ nước",
      category: "plumbing",
      roomId: "A305",
      description:
        "Bồn cầu trong phòng vệ sinh bị rò rỉ nước từ đáy, tạo vũng nước nhỏ.",
      status: "resolved",
      priority: "medium",
      createdAt: "15/09/2023",
      resolvedAt: "17/09/2023",
      response: "Đã thay gioăng cao su bị mòn.",
    },
    {
      id: "ISS005",
      title: "Tiếng ồn từ phòng bên cạnh",
      category: "other",
      roomId: "A305",
      description:
        "Phòng bên cạnh (A306) thường xuyên gây tiếng ồn lớn sau 23:00 đêm.",
      status: "inProgress",
      priority: "low",
      createdAt: "02/11/2023",
      expectedResolution: "08/11/2023",
    },
  ],
  categories: [
    { id: "facilities", name: "Cơ sở vật chất" },
    { id: "electrical", name: "Hệ thống điện" },
    { id: "plumbing", name: "Hệ thống nước" },
    { id: "internet", name: "Internet/Wifi" },
    { id: "security", name: "An ninh" },
    { id: "roommate", name: "Vấn đề với bạn cùng phòng" },
    { id: "other", name: "Vấn đề khác" },
  ],
  // Thông tin thống kê
  stats: {
    total: 5,
    resolved: 2,
    inProgress: 2,
    pending: 1,
  },
};

// Helper function
const getCategoryName = (categoryId: string) => {
  const category = issuesData.categories.find((cat) => cat.id === categoryId);
  return category ? category.name : categoryId;
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "resolved":
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200"
        >
          <CheckCircle2 className="mr-1 h-3 w-3" /> Đã xử lý
        </Badge>
      );
    case "inProgress":
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200"
        >
          <Timer className="mr-1 h-3 w-3" /> Đang xử lý
        </Badge>
      );
    case "pending":
      return (
        <Badge
          variant="outline"
          className="bg-amber-50 text-amber-700 border-amber-200"
        >
          <AlertCircle className="mr-1 h-3 w-3" /> Chờ xử lý
        </Badge>
      );
    default:
      return <Badge variant="outline">Không xác định</Badge>;
  }
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "high":
      return (
        <Badge variant="destructive" className="px-2 py-0">
          Cao
        </Badge>
      );
    case "medium":
      return (
        <Badge variant="default" className="bg-amber-500 px-2 py-0">
          Trung bình
        </Badge>
      );
    case "low":
      return (
        <Badge variant="secondary" className="px-2 py-0">
          Thấp
        </Badge>
      );
    default:
      return null;
  }
};

export default function StudentIssuesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Lọc danh sách sự cố
  const filteredIssues = issuesData.issues.filter((issue) => {
    // Lọc theo từ khóa
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.id.toLowerCase().includes(searchTerm.toLowerCase());

    // Lọc theo trạng thái
    const matchesStatus =
      statusFilter === "all" || issue.status === statusFilter;

    // Lọc theo danh mục
    const matchesCategory =
      categoryFilter === "all" || issue.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Báo cáo sự cố</h2>
          <p className="text-muted-foreground">
            Quản lý và theo dõi các báo cáo sự cố của bạn
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <MessageSquarePlus className="mr-2 h-4 w-4" />
                Báo cáo sự cố mới
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Statistics Cards */}
        <Card className="bg-primary/5">
          <CardContent className="p-4 flex flex-row justify-between items-center">
            <div>
              <p className="text-sm font-medium">Tổng số báo cáo</p>
              <p className="text-3xl font-bold">{issuesData.stats.total}</p>
            </div>
            <FileText className="h-8 w-8 text-primary opacity-70" />
          </CardContent>
        </Card>
        <Card className="bg-green-500/5">
          <CardContent className="p-4 flex flex-row justify-between items-center">
            <div>
              <p className="text-sm font-medium">Đã xử lý</p>
              <p className="text-3xl font-bold text-green-600">
                {issuesData.stats.resolved}
              </p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-500 opacity-70" />
          </CardContent>
        </Card>
        <Card className="bg-blue-500/5">
          <CardContent className="p-4 flex flex-row justify-between items-center">
            <div>
              <p className="text-sm font-medium">Đang xử lý</p>
              <p className="text-3xl font-bold text-blue-600">
                {issuesData.stats.inProgress}
              </p>
            </div>
            <Timer className="h-8 w-8 text-blue-500 opacity-70" />
          </CardContent>
        </Card>
        <Card className="bg-amber-500/5">
          <CardContent className="p-4 flex flex-row justify-between items-center">
            <div>
              <p className="text-sm font-medium">Chờ xử lý</p>
              <p className="text-3xl font-bold text-amber-600">
                {issuesData.stats.pending}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-amber-500 opacity-70" />
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách báo cáo sự cố</CardTitle>
          <CardDescription>
            Theo dõi tình trạng các báo cáo và yêu cầu sửa chữa
          </CardDescription>

          <div className="flex flex-col sm:flex-row gap-3 mt-3">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm báo cáo..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value)}
              >
                <SelectTrigger className="w-full sm:w-[160px]">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Trạng thái" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="pending">Chờ xử lý</SelectItem>
                  <SelectItem value="inProgress">Đang xử lý</SelectItem>
                  <SelectItem value="resolved">Đã xử lý</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={categoryFilter}
                onValueChange={(value) => setCategoryFilter(value)}
              >
                <SelectTrigger className="w-full sm:w-[160px]">
                  <div className="flex items-center">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Danh mục" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả danh mục</SelectItem>
                  {issuesData.categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">Tất cả</TabsTrigger>
              <TabsTrigger value="pending">Chờ xử lý</TabsTrigger>
              <TabsTrigger value="inProgress">Đang xử lý</TabsTrigger>
              <TabsTrigger value="resolved">Đã xử lý</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="pt-6">
              <IssuesList issues={filteredIssues} />
            </TabsContent>
            <TabsContent value="pending" className="pt-6">
              <IssuesList
                issues={filteredIssues.filter(
                  (issue) => issue.status === "pending"
                )}
              />
            </TabsContent>
            <TabsContent value="inProgress" className="pt-6">
              <IssuesList
                issues={filteredIssues.filter(
                  (issue) => issue.status === "inProgress"
                )}
              />
            </TabsContent>
            <TabsContent value="resolved" className="pt-6">
              <IssuesList
                issues={filteredIssues.filter(
                  (issue) => issue.status === "resolved"
                )}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="border-t p-4 flex justify-between">
          <p className="text-sm text-muted-foreground">
            Hiển thị {filteredIssues.length} trong tổng số{" "}
            {issuesData.issues.length} báo cáo
          </p>
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
            <span>Cài đặt thông báo</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

// Component hiển thị danh sách sự cố
function IssuesList({ issues }: { issues: typeof issuesData.issues }) {
  if (issues.length === 0) {
    return (
      <div className="text-center py-12">
        <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium">Không tìm thấy báo cáo</h3>
        <p className="text-muted-foreground mt-2">
          Không có báo cáo sự cố nào phù hợp với bộ lọc hiện tại.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Accordion type="multiple" className="w-full">
        {issues.map((issue) => (
          <AccordionItem key={issue.id} value={issue.id}>
            <AccordionTrigger>
              <div className="flex flex-col sm:flex-row w-full items-start sm:items-center justify-between pr-4">
                <div className="flex items-center gap-3">
                  <div>
                    <h3 className="font-medium text-left">{issue.title}</h3>
                    <p className="text-xs text-muted-foreground text-left">
                      {issue.id} • {issue.createdAt} •{" "}
                      {getCategoryName(issue.category)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-2 sm:mt-0">
                  {getPriorityBadge(issue.priority)}
                  {getStatusBadge(issue.status)}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 px-2">
                <div>
                  <div className="text-sm font-medium mb-1">Mô tả sự cố:</div>
                  <p className="text-sm">{issue.description}</p>
                </div>

                {(issue.status === "inProgress" ||
                  issue.status === "resolved") && (
                  <div className="bg-muted/50 p-3 rounded-md">
                    <div className="text-sm font-medium mb-1">Phản hồi:</div>
                    {issue.status === "resolved" ? (
                      <div>
                        <p className="text-sm">{issue.response}</p>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-muted-foreground">
                            Đã xử lý: {issue.resolvedAt}
                          </span>
                          {issue.feedback && (
                            <span className="text-xs italic">
                              "{issue.feedback}"
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm">
                          Báo cáo của bạn đã được tiếp nhận và đang được xử lý.
                          {issue.assignedTo &&
                            ` Người phụ trách: ${issue.assignedTo}.`}
                        </p>
                        {issue.expectedResolution && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Dự kiến xử lý xong: {issue.expectedResolution}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {issue.status === "resolved" ? (
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Lightbulb className="h-3 w-3" />
                      <span>Báo cáo tương tự</span>
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" className="gap-1">
                      <X className="h-3 w-3" />
                      <span>Hủy báo cáo</span>
                    </Button>
                    <Button size="sm" className="gap-1">
                      <MessageSquarePlus className="h-3 w-3" />
                      <span>Bổ sung thông tin</span>
                    </Button>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
