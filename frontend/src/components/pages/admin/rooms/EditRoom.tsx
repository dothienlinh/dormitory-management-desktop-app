import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { roomService } from "@/services/apis/rooms";
import { amenitiesService } from "@/services/apis/amenities";
import {
  RoomCategory,
  roomCategoryService,
} from "@/services/apis/roomCategories";
import EditRoomForm from "./components/EditRoomForm";
import { IResponse } from "@/interfaces/service";
import { Amenity } from "@/interfaces/amenity";
import { Room } from "@/interfaces/room";

export default function EditRoom() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: amenities, isLoading: isLoadingAmenities } = useQuery<
    IResponse<Amenity[]>
  >({
    queryKey: ["amenities"],
    queryFn: () => amenitiesService.list(),
  });

  const { data: listRoomCategories, isLoading: isLoadingListRoomCategories } =
    useQuery<IResponse<RoomCategory[]>>({
      queryKey: ["roomCategories"],
      queryFn: () =>
        roomCategoryService.listRoomCategories({ limit: 10, page: 1 }),
    });

  const { data: room, isLoading } = useQuery<IResponse<Room>>({
    queryKey: ["room", id],
    queryFn: () => roomService.detailRoom(id ? +id : 0),
  });

  if (isLoading || isLoadingAmenities || isLoadingListRoomCategories) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Đang tải dữ liệu...</span>
      </div>
    );
  }

  if (!room?.data) {
    return (
      <div className="max-w-4xl mx-auto my-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription>{room?.message}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => navigate("/admin/rooms")}>
            Quay lại danh sách phòng
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/admin/rooms/${id}`)}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Chỉnh sửa phòng</h2>
          <p className="text-muted-foreground">
            Cập nhật thông tin phòng {room?.data.room_number}
          </p>
        </div>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>Thông tin phòng</CardTitle>
          <CardDescription>
            Cập nhật thông tin chi tiết của phòng
          </CardDescription>
        </CardHeader>
        <CardContent>
          {room?.data && amenities?.data && listRoomCategories?.data && (
            <EditRoomForm
              amenities={amenities?.data || []}
              listRoomCategories={listRoomCategories?.data || []}
              id={id ? +id : 0}
              room={room.data}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
