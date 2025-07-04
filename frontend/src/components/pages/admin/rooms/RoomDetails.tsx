import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoomHeader } from "./components/RoomHeader";
import { RoomInfoCard } from "./components/RoomInfoCard";
import { OccupantsTable } from "./components/OccupantsTable";
import { MaintenanceTable } from "./components/MaintenanceTable";
import { AddStudentValues } from "./components/AddStudentForm";
import { useQuery } from "@tanstack/react-query";
import { Icons } from "@/components/ui/icons";
import { GetRoomDetails } from "wailsjs/go/app/App";

export default function RoomDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [openStudentDialog, setOpenStudentDialog] = useState(false);
  const [openMaintenanceDialog, setOpenMaintenanceDialog] = useState(false);

  const { data: room, isLoading } = useQuery({
    queryKey: ["room", id],
    queryFn: () => GetRoomDetails(id ? +id : 0),
  });

  const handleAddStudent = (values: AddStudentValues) => {
    setIsAddingStudent(true);

    setTimeout(() => {
      console.log("Adding student:", values);

      alert(
        `Đã thêm sinh viên ${values.name} vào phòng ${room?.Body?.data.room_number}`
      );

      setIsAddingStudent(false);
      setOpenStudentDialog(false);
    }, 1500);
  };

  const handleEditRoom = () => {
    navigate(`/admin/rooms/edit/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Icons.spinner className="h-20 w-20 animate-spin" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Không tìm thấy phòng</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Không tìm thấy thông tin phòng với mã {id}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <RoomHeader
        room={room?.Body.data}
        onEdit={handleEditRoom}
        id={id ? +id : 0}
      />

      <div className="grid gap-6 md:grid-cols-6">
        <RoomInfoCard room={room?.Body.data} />

        <Card className="md:col-span-4">
          <Tabs defaultValue="occupants">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Chi tiết phòng</CardTitle>
                <TabsList>
                  <TabsTrigger value="occupants">Người thuê</TabsTrigger>
                  <TabsTrigger value="maintenance">Lịch sử bảo trì</TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>
            <CardContent>
              <OccupantsTable
                room={room?.Body.data}
                openStudentDialog={openStudentDialog}
                setOpenStudentDialog={setOpenStudentDialog}
                isAddingStudent={isAddingStudent}
                onAddStudent={handleAddStudent}
              />

              <MaintenanceTable
                room={room?.Body.data}
                openMaintenanceDialog={openMaintenanceDialog}
                setOpenMaintenanceDialog={setOpenMaintenanceDialog}
              />
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
