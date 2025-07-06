import { useState } from "react";
import ServiceList from "./components/ServiceList";
import ServiceStats from "./components/ServiceStats";
import ServiceRequestList from "./components/ServiceRequestList";
import { AddServiceDialog } from "./components/AddServiceDialog";
import { AddServiceRequestDialog } from "./components/AddServiceRequestDialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Types
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

type ServiceRequest = {
  id: string;
  studentName: string;
  studentId: string;
  roomName: string;
  serviceType: string;
  description: string;
  status: string;
  requestDate: string;
  completedDate: string | null;
  urgency: string;
};

// Sample data for services
const sampleServices: Service[] = [
  {
    id: 1,
    name: "Sửa chữa điện",
    description: "Dịch vụ sửa chữa các thiết bị điện trong phòng",
    price: 100000,
    unit: "Lần",
    provider: "Công ty điện lực",
    available: true,
    subscriptions: 50,
  },
  {
    id: 2,
    name: "Sửa chữa nước",
    description: "Dịch vụ sửa chữa đường ống nước, vòi nước",
    price: 150000,
    unit: "Lần",
    provider: "Công ty cấp nước",
    available: true,
    subscriptions: 30,
  },
  {
    id: 3,
    name: "Dọn vệ sinh",
    description: "Dịch vụ dọn vệ sinh phòng ở",
    price: 200000,
    unit: "Lần",
    provider: "Công ty vệ sinh",
    available: true,
    subscriptions: 100,
  },
  {
    id: 4,
    name: "Giặt ủi",
    description: "Dịch vụ giặt ủi quần áo",
    price: 50000,
    unit: "Kg",
    provider: "Tiệm giặt ủi",
    available: true,
    subscriptions: 150,
  },
];

// Sample data for service requests
const sampleRequests: ServiceRequest[] = [
  {
    id: "REQ001",
    studentName: "Nguyễn Văn A",
    studentId: "SV001",
    roomName: "P101",
    serviceType: "Sửa chữa",
    description: "Vòi nước bị rò rỉ",
    status: "pending",
    requestDate: "2023-11-10",
    completedDate: null,
    urgency: "medium",
  },
  {
    id: "REQ002",
    studentName: "Trần Thị B",
    studentId: "SV002",
    roomName: "P102",
    serviceType: "Vệ sinh",
    description: "Dọn vệ sinh phòng",
    status: "completed",
    requestDate: "2023-11-09",
    completedDate: "2023-11-10",
    urgency: "low",
  },
  {
    id: "REQ003",
    studentName: "Lê Văn C",
    studentId: "SV003",
    roomName: "P103",
    serviceType: "Điện",
    description: "Bóng đèn hỏng",
    status: "in_progress",
    requestDate: "2023-11-11",
    completedDate: null,
    urgency: "high",
  },
];

export default function Services() {
  const [activeTab, setActiveTab] = useState("services");
  const [openAddServiceDialog, setOpenAddServiceDialog] = useState(false);
  const [openAddRequestDialog, setOpenAddRequestDialog] = useState(false);

  return (
    <div className="space-y-4 p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quản lý dịch vụ</h2>
          <p className="text-muted-foreground">
            Quản lý các dịch vụ và yêu cầu dịch vụ từ sinh viên
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {activeTab === "services" ? (
            <Button onClick={() => setOpenAddServiceDialog(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Thêm dịch vụ
            </Button>
          ) : (
            <Button onClick={() => setOpenAddRequestDialog(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Thêm yêu cầu
            </Button>
          )}
        </div>
      </div>

      <Tabs
        defaultValue="services"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="services">Dịch vụ</TabsTrigger>
          <TabsTrigger value="requests">Yêu cầu dịch vụ</TabsTrigger>
        </TabsList>
        <TabsContent value="services" className="space-y-4">
          <ServiceStats services={sampleServices} />
          <ServiceList services={sampleServices} />
        </TabsContent>
        <TabsContent value="requests">
          <ServiceRequestList requests={sampleRequests} />
        </TabsContent>
      </Tabs>

      <AddServiceDialog
        open={openAddServiceDialog}
        onOpenChange={setOpenAddServiceDialog}
      />
      <AddServiceRequestDialog
        open={openAddRequestDialog}
        onOpenChange={setOpenAddRequestDialog}
      />
    </div>
  );
}
