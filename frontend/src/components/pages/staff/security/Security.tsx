import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle } from "lucide-react";
import SecurityIncidents from "./components/SecurityIncidents";
import VisitorLogs from "./components/VisitorLogs";
import SecurityAlerts from "./components/SecurityAlerts";
import {
  securityIncidentsData,
  visitorLogsData,
  securityAlertsData,
} from "./data";
import CreateIncidentModal from "./modals/CreateIncidentModal";
import CreateVisitorModal from "./modals/CreateVisitorModal";
import CreateAlertModal from "./modals/CreateAlertModal";

export default function Security() {
  const [activeTab, setActiveTab] = useState("incidents");
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [showVisitorModal, setShowVisitorModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);

  const handleCreateClick = () => {
    switch (activeTab) {
      case "incidents":
        setShowIncidentModal(true);
        break;
      case "visitors":
        setShowVisitorModal(true);
        break;
      case "alerts":
        setShowAlertModal(true);
        break;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">An ninh</h2>
          <p className="text-muted-foreground">Quản lý an ninh và sự cố</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleCreateClick}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {activeTab === "incidents"
              ? "Báo cáo sự cố mới"
              : activeTab === "visitors"
              ? "Đăng ký khách"
              : "Tạo cảnh báo mới"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="incidents" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="incidents">Sự cố</TabsTrigger>
          <TabsTrigger value="visitors">Khách ra vào</TabsTrigger>
          <TabsTrigger value="alerts">Cảnh báo an ninh</TabsTrigger>
        </TabsList>

        <TabsContent value="incidents">
          <SecurityIncidents incidents={securityIncidentsData} />
        </TabsContent>

        <TabsContent value="visitors">
          <VisitorLogs visitors={visitorLogsData} />
        </TabsContent>

        <TabsContent value="alerts">
          <SecurityAlerts alerts={securityAlertsData} />
        </TabsContent>
      </Tabs>

      <CreateIncidentModal
        open={showIncidentModal}
        onOpenChange={setShowIncidentModal}
      />
      <CreateVisitorModal
        open={showVisitorModal}
        onOpenChange={setShowVisitorModal}
      />
      <CreateAlertModal
        open={showAlertModal}
        onOpenChange={setShowAlertModal}
      />
    </div>
  );
}
