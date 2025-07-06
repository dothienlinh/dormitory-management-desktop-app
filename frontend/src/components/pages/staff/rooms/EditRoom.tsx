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
import EditRoomForm from "./components/EditRoomForm";
import {
  GetListAmenities,
  GetListRoomCategories,
  GetRoomDetails,
} from "wailsjs/go/app/App";

export default function EditRoom() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: amenities, isLoading: isLoadingAmenities } = useQuery({
    queryKey: ["amenities"],
    queryFn: () => GetListAmenities(1),
  });

  const { data: listRoomCategories, isLoading: isLoadingListRoomCategories } =
    useQuery({
      queryKey: ["roomCategories"],
      queryFn: () => GetListRoomCategories("1"),
    });

  const { data: room, isLoading } = useQuery({
    queryKey: ["room", id],
    queryFn: () => GetRoomDetails(id ? +id : 0),
  });

  if (isLoading || isLoadingAmenities || isLoadingListRoomCategories) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Đang tải dữ liệu...</span>
      </div>
    );
  }

  if (!room?.ParsedBody?.data) {
    return (
      <div className="max-w-4xl mx-auto my-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription>{room?.ParsedBody?.message}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => navigate("/staff/rooms")}>
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
          onClick={() => navigate(`/staff/rooms/${id}`)}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Chỉnh sửa phòng</h2>
          <p className="text-muted-foreground">
            Cập nhật thông tin phòng {room?.ParsedBody?.data.room_number}
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
          {room?.ParsedBody.data &&
            amenities?.ParsedBody.data &&
            listRoomCategories?.ParsedBody.data && (
              <EditRoomForm
                amenities={amenities?.ParsedBody.data || []}
                listRoomCategories={listRoomCategories?.ParsedBody.data || []}
                id={id ? +id : 0}
                room={room.ParsedBody.data}
              />
            )}
        </CardContent>
      </Card>
    </div>
  );
}
